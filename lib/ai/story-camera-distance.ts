/**
 * Story JSON `pages[].cameraDistance` — şema enum'u ile pipeline uyumu.
 * DB / OpenAI import yok; smoke test ve validator tarafından paylaşılır.
 */

/** json_schema + görsel pipeline ile uyumlu tek değerler */
export type StoryCameraDistance = 'close' | 'medium' | 'wide' | 'establishing'

export const STORY_CAMERA_DISTANCES: readonly StoryCameraDistance[] = [
  'close',
  'medium',
  'wide',
  'establishing',
]

/**
 * Model `strict: false` ile enum dışı üretebiliyor: "medium-wide", "close-up", "Medium" vb.
 * Son kullanıcıya hata göstermek yerine kanonik değere map eder.
 */
export function normalizeStoryCameraDistance(
  value: unknown,
  pageIndex: number
): StoryCameraDistance {
  const fallbacks: StoryCameraDistance[] = ['wide', 'medium', 'establishing', 'medium']
  const fallback = fallbacks[pageIndex % fallbacks.length]

  if (value === undefined || value === null) return fallback

  const raw = String(value).trim()
  if (!raw) return fallback

  const s = raw.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim()

  if ((STORY_CAMERA_DISTANCES as readonly string[]).includes(s)) {
    return s as StoryCameraDistance
  }

  if (/(medium\s*[-]?\s*wide|wide\s*[-]?\s*medium|mediumwide)/i.test(s)) return 'wide'
  if (/(extreme\s*wide|very\s*wide|establishing|establish\b|env(?:ironment)?\s*shot)/i.test(s)) {
    return 'establishing'
  }
  if (/(close[\s-]*up|closeup|tight\s*shot|\bcu\b)/i.test(s)) return 'close'
  if (/(long\s*shot|full\s*shot|^\s*wide\b|\bwide\s*shot)/i.test(s)) return 'wide'
  if (/(^\s*medium\b|\bmedium\s*shot|\bmid\b|normal\s*shot)/i.test(s)) return 'medium'
  if (/\bclose\b/.test(s)) return 'close'
  if (/\bwide\b/.test(s)) return 'wide'

  return fallback
}
