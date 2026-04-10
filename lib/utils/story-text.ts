/**
 * Story text formatting utilities shared between ebook reader and PDF generator.
 *
 * Splits story paragraphs at sentence boundaries (Turkish/multilingual)
 * so each sentence renders as a separate visual paragraph — matching the
 * PDF export look-and-feel.
 */

const SENTENCE_END_RE = /(?<=[.!?…])\s+/

function splitIntoSentences(block: string): string[] {
  const trimmed = block.trim()
  if (!trimmed) return []

  const parts = trimmed.split(SENTENCE_END_RE).filter((s) => s.trim())
  return parts.length <= 1 ? [trimmed] : parts.map((s) => s.trim())
}

/**
 * Split raw page text into display-ready paragraphs.
 *
 * 1. Splits on newlines (explicit paragraph breaks by the author/AI).
 * 2. Within each block, splits on Turkish/universal sentence endings.
 *
 * Returns a string array ready for React rendering (one `<p>` per entry).
 */
export function splitStoryText(text: string): string[] {
  if (!text) return []

  return text
    .split(/\n+/)
    .map((b) => b.trim())
    .filter(Boolean)
    .flatMap(splitIntoSentences)
}
