/**
 * Timeline orchestrator — generates and caches word-level timelines.
 * Strategy: Whisper if available, heuristic fallback.
 */

import crypto from "crypto"
import { uploadFile, getSignedObjectUrl, fileExists, getObjectBuffer } from "@/lib/storage/s3"
import { generateHeuristicTimeline } from "./timeline-heuristic"
import { generateWhisperTimeline, isWhisperAvailable } from "./timeline-whisper"
import { chunkWords } from "./chunker"
import type {
  PageTimeline,
  TimelineGenerateOptions,
  TimelineResult,
  TimelineStrategy,
  WordTiming,
} from "./types"

const TIMELINE_CACHE_PREFIX = "tts-cache"

function timelineCacheKey(text: string, audioUrl: string, language: string): string {
  const hash = crypto
    .createHash("sha256")
    .update(`timeline|${text}|${audioUrl}|${language}`)
    .digest("hex")
  return `${TIMELINE_CACHE_PREFIX}/${hash}_timeline.json`
}

async function getCachedTimeline(cacheKey: string): Promise<PageTimeline | null> {
  try {
    const exists = await fileExists(cacheKey)
    if (!exists) return null
    const obj = await getObjectBuffer(cacheKey)
    if (!obj) return null
    return JSON.parse(obj.buffer.toString("utf-8"))
  } catch {
    return null
  }
}

async function saveTimelineCache(cacheKey: string, timeline: PageTimeline): Promise<void> {
  try {
    const json = JSON.stringify(timeline)
    const buffer = Buffer.from(json, "utf-8")
    const fileName = cacheKey.split("/").pop()!
    await uploadFile(TIMELINE_CACHE_PREFIX, fileName, buffer, "application/json")
  } catch (err) {
    console.error("[Timeline] Cache save failed:", err)
  }
}

/**
 * Gets audio duration from an audio URL by downloading and checking MP3 frame headers.
 * Falls back to a rough estimate from file size.
 */
async function estimateAudioDurationMs(audioUrl: string): Promise<number> {
  try {
    const response = await fetch(audioUrl, { method: "HEAD" })
    const contentLength = Number(response.headers.get("content-length") || 0)
    if (contentLength > 0) {
      // MP3 128kbps ≈ 16KB/s → duration ≈ size / 16000 * 1000
      return Math.round((contentLength / 16_000) * 1000)
    }
  } catch {}
  return 5000
}

/**
 * Generate word-level timeline for a page.
 * Tries Whisper first (if available), falls back to heuristic.
 */
export async function generateTimeline(
  options: TimelineGenerateOptions
): Promise<TimelineResult> {
  const { text, audioUrl, language, pageNumber, strategy: preferredStrategy, chunkSize = 3 } = options

  const cacheKey = timelineCacheKey(text, audioUrl, language)
  const cached = await getCachedTimeline(cacheKey)
  if (cached) {
    return { timeline: cached, strategy: "heuristic", cached: true }
  }

  let words: WordTiming[]
  let totalDurationMs: number
  let usedStrategy: TimelineStrategy = "heuristic"

  const shouldTryWhisper = preferredStrategy === "whisper" || !preferredStrategy
  if (shouldTryWhisper) {
    try {
      const available = await isWhisperAvailable()
      if (available) {
        const result = await generateWhisperTimeline(audioUrl, language)
        words = result.words
        totalDurationMs = result.durationMs
        usedStrategy = "whisper"
      } else {
        totalDurationMs = await estimateAudioDurationMs(audioUrl)
        words = generateHeuristicTimeline(text, totalDurationMs)
      }
    } catch (err) {
      console.warn("[Timeline] Whisper failed, falling back to heuristic:", err)
      totalDurationMs = await estimateAudioDurationMs(audioUrl)
      words = generateHeuristicTimeline(text, totalDurationMs)
    }
  } else {
    totalDurationMs = await estimateAudioDurationMs(audioUrl)
    words = generateHeuristicTimeline(text, totalDurationMs)
  }

  const chunks = chunkWords(words, chunkSize)

  const timeline: PageTimeline = {
    pageNumber,
    totalDurationMs,
    words,
    chunks,
  }

  await saveTimelineCache(cacheKey, timeline)

  return { timeline, strategy: usedStrategy, cached: false }
}
