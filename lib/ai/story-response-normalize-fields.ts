/**
 * Story JSON alan normalleştirme — `strict: false` + LLM sapması için.
 * DB / OpenAI import yok; `story-response-validator` ve smoke test paylaşır.
 */

export type SupportingEntityType = 'animal' | 'object'

export const SUPPORTING_ENTITY_TYPES: readonly SupportingEntityType[] = ['animal', 'object']

/** `reading-age-brackets.ts` metadataAgeGroup ile aynı küme */
export type StoryMetadataAgeGroup =
  | 'toddler'
  | 'preschool'
  | 'early-elementary'
  | 'elementary'
  | 'pre-teen'

export const STORY_METADATA_AGE_GROUPS: readonly StoryMetadataAgeGroup[] = [
  'toddler',
  'preschool',
  'early-elementary',
  'elementary',
  'pre-teen',
]

const SHOT_PLAN_KEYS = ['shotType', 'lens', 'cameraAngle', 'placement', 'timeOfDay', 'mood'] as const
export type ShotPlanKey = (typeof SHOT_PLAN_KEYS)[number]

const SHOT_PLAN_DEFAULTS: Record<ShotPlanKey, string> = {
  shotType: 'medium shot',
  lens: '50mm',
  cameraAngle: 'eye level',
  placement: 'balanced',
  timeOfDay: 'afternoon',
  mood: 'calm',
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** supportingEntities[].type — Animal, obj, toy vb. → animal | object */
export function normalizeSupportingEntityType(value: unknown, index: number): SupportingEntityType {
  const fallback: SupportingEntityType = index % 2 === 0 ? 'object' : 'animal'
  if (value === undefined || value === null) return fallback

  const raw = String(value).trim()
  if (!raw) return fallback

  const s = raw.toLowerCase().replace(/\s+/g, ' ')

  if (s === 'animal' || s === 'animals') return 'animal'
  if (s === 'object' || s === 'objects' || s === 'item' || s === 'items' || s === 'prop' || s === 'props') {
    return 'object'
  }
  if (s.startsWith('anim')) return 'animal'
  if (s.startsWith('obj')) return 'object'

  // Önce nesne / oyuncak (teddy bear ≠ vahşi ayı)
  if (
    /\b(toy|teddy|doll|stuffed|plush|prop|thing|item|tool|map|photo|lantern|ball|kite|boat|vehicle|furniture|book|treasure|chest|instrument)\b/i.test(
      s
    )
  ) {
    return 'object'
  }
  if (
    /\b(wildlife|creature|mammal|bird|fish|insect|reptile|amphibian|pet|animal|bunny|rabbit|puppy|kitten|squirrel|butterfly|bee|frog|mouse|whale|dolphin)\b/i.test(
      s
    )
  ) {
    return 'animal'
  }

  return fallback
}

/** metadata.ageGroup — büyük harf, boşluk, "early elementary" vb. */
export function normalizeStoryMetadataAgeGroup(value: unknown): StoryMetadataAgeGroup {
  const fallback: StoryMetadataAgeGroup = 'preschool'
  if (value === undefined || value === null) return fallback

  const s = String(value).trim().toLowerCase().replace(/\s+/g, ' ')
  if (!s) return fallback

  if ((STORY_METADATA_AGE_GROUPS as readonly string[]).includes(s)) {
    return s as StoryMetadataAgeGroup
  }

  const hyphen = s.replace(/\s+/g, '-')
  if (hyphen === 'early-elementary' || (s.includes('early') && s.includes('elementary'))) {
    return 'early-elementary'
  }
  if (s.includes('pre-teen') || s.includes('preteen') || /\bteen\b/.test(s)) return 'pre-teen'
  if (s.includes('elementary') && !s.includes('early')) return 'elementary'
  if (s.includes('preschool') || s.includes('pre-school') || s.includes('kindergarten')) {
    return 'preschool'
  }
  if (s.includes('toddler') || s.includes('infant') || s.includes('baby')) return 'toddler'

  return fallback
}

export function normalizeMetadataSafetyChecked(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 1) return true
  if (value === 'false' || value === 0) return false
  return true
}

export function normalizeEducationalThemes(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((x) => String(x).trim()).filter((x) => x.length > 0)
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[,;]/)
      .map((x) => x.trim())
      .filter(Boolean)
  }
  return []
}

/** appearsOnPages — string sayılar, tekrarlar, sıra */
export function normalizeAppearsOnPages(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<number>()
  for (const x of value) {
    const n =
      typeof x === 'number' && Number.isFinite(x)
        ? Math.round(x)
        : parseInt(String(x).trim(), 10)
    if (Number.isFinite(n) && n > 0) seen.add(n)
  }
  return [...seen].sort((a, b) => a - b)
}

export function normalizePageShotPlan(
  shotPlan: unknown,
  pageIndex: number,
  notes?: string[]
): Record<ShotPlanKey, string> {
  const base = { ...SHOT_PLAN_DEFAULTS }
  if (!shotPlan || typeof shotPlan !== 'object') {
    notes?.push(`Page ${pageIndex + 1}: shotPlan missing — filled defaults`)
    return base
  }
  const sp = shotPlan as Record<string, unknown>
  let filled = false
  for (const key of SHOT_PLAN_KEYS) {
    const v = sp[key]
    const str = v === undefined || v === null ? '' : String(v).trim()
    if (!str) {
      filled = true
      base[key] = SHOT_PLAN_DEFAULTS[key]
    } else {
      base[key] = str
    }
  }
  if (filled) {
    notes?.push(`Page ${pageIndex + 1}: shotPlan had empty fields — defaults applied`)
  }
  return base
}

/**
 * characterIds — bazen model tek UUID string döndürür.
 * Sadece geçerli UUID tek string ise [id]'ye çevirir.
 */
export function normalizePageCharacterIds(
  raw: unknown,
  pageIndex: number,
  notes?: string[]
): unknown {
  if (raw == null) return raw
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (UUID_RE.test(t)) {
      notes?.push(`Page ${pageIndex + 1}: characterIds coerced from string to array`)
      return [t]
    }
    return raw
  }
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x).trim()).filter((x) => x.length > 0)
  }
  return raw
}

export function metadataThemeTrim(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}
