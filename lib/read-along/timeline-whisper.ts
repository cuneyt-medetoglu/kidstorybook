import { execFile } from "child_process"
import { promisify } from "util"
import fs from "fs"
import os from "os"
import path from "path"
import type { WordTiming } from "./types"

const execFileAsync = promisify(execFile)

const WHISPER_SCRIPT = path.resolve(process.cwd(), "scripts/whisper-align.py")
const WHISPER_MODEL = process.env.WHISPER_MODEL || "base"
const WHISPER_TIMEOUT = 60_000

interface WhisperResult {
  words: Array<{ text: string; startMs: number; endMs: number }>
  durationMs: number
  error?: string
}

/**
 * Downloads audio from URL to a temp file for Whisper processing.
 */
async function downloadToTempFile(audioUrl: string): Promise<string> {
  const tmpDir = os.tmpdir()
  const tmpFile = path.join(tmpDir, `whisper_${Date.now()}.mp3`)

  const response = await fetch(audioUrl)
  if (!response.ok) throw new Error(`Failed to download audio: ${response.status}`)

  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.promises.writeFile(tmpFile, buffer)
  return tmpFile
}

/**
 * Runs Whisper forced alignment on an audio file.
 * Requires Python + openai-whisper installed on the server.
 */
export async function generateWhisperTimeline(
  audioUrl: string,
  language: string
): Promise<{ words: WordTiming[]; durationMs: number }> {
  let tmpFile: string | null = null

  try {
    tmpFile = await downloadToTempFile(audioUrl)

    const langCode = language.length === 2 ? language : language.split("-")[0]

    const { stdout, stderr } = await execFileAsync(
      "python3",
      [WHISPER_SCRIPT, tmpFile, langCode, WHISPER_MODEL],
      { timeout: WHISPER_TIMEOUT }
    )

    if (stderr) {
      console.warn("[Whisper] stderr:", stderr.substring(0, 500))
    }

    const result: WhisperResult = JSON.parse(stdout)

    if (result.error) {
      throw new Error(`Whisper error: ${result.error}`)
    }

    return {
      words: result.words,
      durationMs: result.durationMs,
    }
  } finally {
    if (tmpFile) {
      fs.promises.unlink(tmpFile).catch(() => {})
    }
  }
}

/**
 * Checks if Whisper is available on this system.
 */
export async function isWhisperAvailable(): Promise<boolean> {
  try {
    await execFileAsync("python3", ["-c", "import whisper"], { timeout: 5_000 })
    return true
  } catch {
    return false
  }
}
