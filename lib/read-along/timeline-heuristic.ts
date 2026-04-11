import type { WordTiming } from "./types"

const PAUSE_AFTER_PERIOD = 350
const PAUSE_AFTER_COMMA = 150
const PAUSE_AFTER_EXCLAMATION = 300
const PAUSE_AFTER_QUESTION = 300
const PAUSE_AFTER_COLON = 200
const PAUSE_AFTER_SEMICOLON = 180
const PAUSE_AFTER_ELLIPSIS = 400

function getPauseAfterWord(word: string): number {
  const trimmed = word.trimEnd()
  if (trimmed.endsWith("...") || trimmed.endsWith("…")) return PAUSE_AFTER_ELLIPSIS
  const lastChar = trimmed.charAt(trimmed.length - 1)
  switch (lastChar) {
    case ".": return PAUSE_AFTER_PERIOD
    case ",": return PAUSE_AFTER_COMMA
    case "!": return PAUSE_AFTER_EXCLAMATION
    case "?": return PAUSE_AFTER_QUESTION
    case ":": return PAUSE_AFTER_COLON
    case ";": return PAUSE_AFTER_SEMICOLON
    default: return 0
  }
}

function getWordWeight(word: string): number {
  const clean = word.replace(/[^\p{L}\p{N}]/gu, "")
  return Math.max(clean.length, 1)
}

/**
 * Character-weighted heuristic: longer words get more time,
 * punctuation adds natural pauses. Much better than uniform split.
 */
export function generateHeuristicTimeline(
  text: string,
  audioDurationMs: number
): WordTiming[] {
  const rawWords = text.split(/\s+/).filter(Boolean)
  if (rawWords.length === 0) return []

  const weights = rawWords.map(getWordWeight)
  const pauses = rawWords.map(getPauseAfterWord)
  const totalPause = pauses.reduce((sum, p) => sum + p, 0)
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)

  const speakingTime = Math.max(audioDurationMs - totalPause, audioDurationMs * 0.7)
  const msPerWeight = speakingTime / totalWeight

  const result: WordTiming[] = []
  let cursor = 0

  for (let i = 0; i < rawWords.length; i++) {
    const wordDuration = weights[i] * msPerWeight
    const startMs = Math.round(cursor)
    const endMs = Math.round(cursor + wordDuration)

    result.push({
      text: rawWords[i],
      startMs,
      endMs,
    })

    cursor = endMs + pauses[i]
  }

  if (result.length > 0) {
    const last = result[result.length - 1]
    if (last.endMs > audioDurationMs) {
      const scale = audioDurationMs / last.endMs
      let accumulated = 0
      for (const w of result) {
        const dur = (w.endMs - w.startMs) * scale
        w.startMs = Math.round(accumulated)
        w.endMs = Math.round(accumulated + dur)
        accumulated = w.endMs + getPauseAfterWord(w.text) * scale
      }
    }
    result[result.length - 1].endMs = Math.min(result[result.length - 1].endMs, audioDurationMs)
  }

  return result
}
