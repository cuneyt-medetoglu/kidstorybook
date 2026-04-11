import type { WordTiming, TextChunk } from "./types"

const SENTENCE_ENDERS = /[.!?…]$/
const CLAUSE_BREAKERS = /[,;:–—]$/

/**
 * Groups word timings into karaoke display chunks.
 * Respects punctuation boundaries for natural reading flow.
 */
export function chunkWords(
  words: WordTiming[],
  targetSize: number = 3
): TextChunk[] {
  if (words.length === 0) return []

  const chunks: TextChunk[] = []
  let buffer: WordTiming[] = []

  for (let i = 0; i < words.length; i++) {
    buffer.push(words[i])

    const isLastWord = i === words.length - 1
    const atTarget = buffer.length >= targetSize
    const atSentenceEnd = SENTENCE_ENDERS.test(words[i].text)
    const atClauseBreak = CLAUSE_BREAKERS.test(words[i].text)
    const nextWordFarAway =
      !isLastWord && words[i + 1].startMs - words[i].endMs > 200

    const shouldFlush =
      isLastWord ||
      atSentenceEnd ||
      (atTarget && (atClauseBreak || nextWordFarAway)) ||
      buffer.length >= targetSize + 2

    if (shouldFlush) {
      chunks.push({
        words: [...buffer],
        displayText: buffer.map((w) => w.text).join(" "),
        startMs: buffer[0].startMs,
        endMs: buffer[buffer.length - 1].endMs,
      })
      buffer = []
    }
  }

  return chunks
}

/**
 * Returns chunk size recommendation based on age group.
 */
export function getChunkSizeForAge(ageGroup: "young" | "middle" | "older"): number {
  switch (ageGroup) {
    case "young": return 2
    case "middle": return 3
    case "older": return 4
  }
}
