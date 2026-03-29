/**
 * Okuma yaşı (Step 1) → sayfa başı kelime hedefi ve prompt katmanları.
 * Tek kaynak: UI, story prompt ve (ileride) doğrulama aynı tabloyu kullanır.
 *
 * Aralıklar çocuk edebiyatı / board & picture book pratiğine göre:
 * - 0-1: çok az metin, tekrar, ses-odaklı
 * - 1-3: erken toddler / kısa cümleler
 * - 3-5: okul öncesi resimli kitap
 * - 6+: okuma gelişen çocuk resimli kitap
 */

export const READING_AGE_BRACKET_IDS = ['0-1', '1-3', '3-5', '6+'] as const
export type ReadingAgeBracketId = (typeof READING_AGE_BRACKET_IDS)[number]

export interface ReadingAgeBracketConfig {
  id: ReadingAgeBracketId
  /** Karakter / DB için temsilî yaş (yaklaşık orta nokta) */
  representativeAge: number
  /**
   * Story JSON metadata.ageGroup — image pipeline lookup tablolarıyla uyumlu etiket.
   * Mevcut tablolar: toddler | preschool | early-elementary | elementary | pre-teen.
   * 0-1 bandı 'toddler' olarak etiketlenir (en kısıtlayıcı kurallar zaten toddler'da tanımlı).
   */
  metadataAgeGroup: 'toddler' | 'preschool' | 'early-elementary' | 'elementary' | 'pre-teen'
  wordsPerPageMin: number
  wordsPerPageMax: number
  readingTimeMinutesPerPage: number
  vocabularyLevel: string
  sentenceLength: string
  complexityLevel: string
}

export const READING_AGE_BRACKETS: Record<ReadingAgeBracketId, ReadingAgeBracketConfig> = {
  '0-1': {
    id: '0-1',
    representativeAge: 1,
    metadataAgeGroup: 'toddler',
    wordsPerPageMin: 5,
    wordsPerPageMax: 14,
    readingTimeMinutesPerPage: 1,
    vocabularyLevel: 'single words, very short two-word phrases, caregiver-friendly rhythm; lots of repetition; sounds and onomatopoeia welcome',
    sentenceLength: 'mostly 1–4 word units; one idea per line; present tense',
    complexityLevel: 'one sensory moment per page; no plot twists; predictable pattern',
  },
  '1-3': {
    id: '1-3',
    representativeAge: 2,
    metadataAgeGroup: 'toddler',
    wordsPerPageMin: 15,
    wordsPerPageMax: 38,
    readingTimeMinutesPerPage: 1,
    vocabularyLevel: 'very simple, common words only; concrete nouns and action verbs; gentle repetition',
    sentenceLength: 'very short sentences, simple verbs, lots of repetition',
    complexityLevel: 'very simple, repetitive, predictable; one clear beat per page',
  },
  '3-5': {
    id: '3-5',
    representativeAge: 4,
    metadataAgeGroup: 'preschool',
    wordsPerPageMin: 40,
    wordsPerPageMax: 75,
    readingTimeMinutesPerPage: 2,
    vocabularyLevel: 'simple words, basic concepts; introduce a few new words with context',
    sentenceLength: 'short sentences, simple structure; occasional dialogue',
    complexityLevel: 'simple with gentle surprises; clear cause and effect',
  },
  '6+': {
    id: '6+',
    representativeAge: 7,
    metadataAgeGroup: 'elementary',
    wordsPerPageMin: 85,
    wordsPerPageMax: 150,
    readingTimeMinutesPerPage: 4,
    vocabularyLevel: 'moderate vocabulary, age-appropriate challenges; richer dialogue',
    sentenceLength: 'medium sentences, clear cause-effect; varied rhythm',
    complexityLevel: 'moderate complexity with light problem-solving; emotional nuance ok',
  },
}

/** Eski sadece `age` (sayı) kayıtları için geriye dönük eşleme */
export function inferReadingAgeBracketFromNumericAge(age: number): ReadingAgeBracketId {
  if (age <= 1) return '0-1'
  if (age <= 3) return '1-3'
  if (age <= 5) return '3-5'
  return '6+'
}

export function getReadingAgeBracketConfig(
  bracket: ReadingAgeBracketId | undefined,
  fallbackNumericAge: number
): ReadingAgeBracketConfig {
  const id = bracket ?? inferReadingAgeBracketFromNumericAge(fallbackNumericAge)
  return READING_AGE_BRACKETS[id]
}

export function wordsPerPageRangeString(cfg: ReadingAgeBracketConfig): string {
  return `${cfg.wordsPerPageMin}-${cfg.wordsPerPageMax}`
}

/** API / JSON / formdan gelen değeri güvenli şekilde bant id’sine çevirir */
export function parseReadingAgeBracket(raw: unknown): ReadingAgeBracketId | undefined {
  if (typeof raw !== 'string') return undefined
  return (READING_AGE_BRACKET_IDS as readonly string[]).includes(raw)
    ? (raw as ReadingAgeBracketId)
    : undefined
}
