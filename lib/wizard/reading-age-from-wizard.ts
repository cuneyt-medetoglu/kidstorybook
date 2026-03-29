/**
 * Tek kaynak: Step 1 `readingAgeBracket` (+ geriye dönük step1.age / eski step3.ageGroup).
 * Step 3 artık yaş sormuyor; özet ve API karakter tarafı Step 1 ile hizalı kalır.
 */

import {
  type ReadingAgeBracketId,
  getReadingAgeBracketConfig,
  inferReadingAgeBracketFromNumericAge,
  parseReadingAgeBracket,
  wordsPerPageRangeString,
} from '@/lib/config/reading-age-brackets'

function legacyStep3AgeGroupIdToBracket(id: string): ReadingAgeBracketId | undefined {
  if (id === '0-2') return '1-3'
  if (id === '3-5') return '3-5'
  if (id === '6-9') return '6+'
  return undefined
}

/**
 * Wizard step1 (+ isteğe bağlı eski step3.ageGroup) → okuma yaşı bandı.
 */
export function resolveReadingAgeBracketFromWizard(
  step1: Record<string, unknown> | undefined | null,
  step3AgeGroup?: unknown
): ReadingAgeBracketId {
  const fromStep1 = parseReadingAgeBracket(step1?.readingAgeBracket)
  if (fromStep1) return fromStep1

  const age = step1?.age
  const n = typeof age === 'number' ? age : Number(age)
  if (Number.isFinite(n)) return inferReadingAgeBracketFromNumericAge(n)

  let legacyId: string | undefined
  if (step3AgeGroup && typeof step3AgeGroup === 'object' && step3AgeGroup !== null && 'id' in step3AgeGroup) {
    legacyId = String((step3AgeGroup as { id: string }).id)
  } else if (typeof step3AgeGroup === 'string') {
    legacyId = step3AgeGroup
  }
  const fromLegacy = legacyId ? legacyStep3AgeGroupIdToBracket(legacyId) : undefined
  if (fromLegacy) return fromLegacy

  return '3-5'
}

export function readingBracketWordRangeLine(bracket: ReadingAgeBracketId): string {
  const cfg = getReadingAgeBracketConfig(bracket, 5)
  return wordsPerPageRangeString(cfg)
}
