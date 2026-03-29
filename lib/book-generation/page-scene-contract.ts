/**
 * D1: Story JSON → iç sayfa görsel prompt girdileri için tek sözleşme.
 * `sceneMap` (yer/zaman planı) ile `pages[].imagePrompt` / `sceneDescription` önceliği burada netleşir;
 * `characterAction` uzun İngilizce imagePrompt ile ikinci kez doldurulmaz (token + çelişki riski).
 */

export type StorySceneMapRow = {
  pageNumber?: number | string
  location?: string
  timeOfDay?: string
  setting?: string
}

/** sceneMap girişinde pageNumber bazen string (örn. "3") gelebilir — hedef sayfa ile karşılaştır. */
function sceneMapPageNumberMatches(raw: unknown, targetPage: number): boolean {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.round(raw) === targetPage
  }
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = parseInt(raw.trim(), 10)
    return Number.isFinite(n) && n === targetPage
  }
  return false
}

/** Sayfa numarasına göre sceneMap satırı (pageNumber eşleşmesi). */
export function getSceneMapRowForPage(
  storyData: { sceneMap?: unknown } | null | undefined,
  pageNumber: number
): StorySceneMapRow | null {
  const sm = storyData?.sceneMap
  if (!Array.isArray(sm)) return null
  const row = sm.find(
    (e: unknown) =>
      e !== null &&
      typeof e === 'object' &&
      sceneMapPageNumberMatches((e as StorySceneMapRow).pageNumber, pageNumber)
  ) as StorySceneMapRow | undefined
  if (!row || typeof row !== 'object') return null
  return {
    pageNumber: row.pageNumber,
    location: typeof row.location === 'string' ? row.location : undefined,
    timeOfDay: typeof row.timeOfDay === 'string' ? row.timeOfDay : undefined,
    setting: typeof row.setting === 'string' ? row.setting : undefined,
  }
}

/** Tek satırlık plan özeti — generateFullPagePrompt içinde çelişki çözümü için. */
export function formatStoryScenePlanAnchor(row: StorySceneMapRow | null): string | undefined {
  if (!row) return undefined
  const parts: string[] = []
  if (row.location?.trim()) parts.push(`Location: ${row.location.trim()}`)
  if (row.timeOfDay?.trim()) parts.push(`Time: ${row.timeOfDay.trim()}`)
  if (row.setting?.trim()) parts.push(`Setting: ${row.setting.trim()}`)
  return parts.length > 0 ? parts.join(' | ') : undefined
}

/**
 * sceneMap.timeOfDay serbest metin → SceneInput.timeOfDay ile uyumlu dar küme.
 * Tanınmayan ifade için **varsayılan bucket yok** (yanlış "afternoon" ışığından kaçınır);
 * dönüş `undefined` ise SceneInput’a timeOfDay yazılmaz — aydınlatma öncelikle sahne metninden gelir.
 */
export function mapSceneMapTimeToSceneInput(
  raw: string | undefined
): 'morning' | 'afternoon' | 'evening' | 'night' | undefined {
  if (!raw?.trim()) return undefined
  const s = raw.toLowerCase()
  if (/(^|[^a-z])(night|midnight)([^a-z]|$)/i.test(s)) return 'night'
  if (/(sunset|dusk|evening|twilight|golden\s*hour|magic\s*hour|blue\s*hour)/i.test(s)) return 'evening'
  if (/(late\s*morning|early\s*morning|mid\s*morning|morning|dawn|sunrise)/i.test(s)) return 'morning'
  if (/(late\s*afternoon|early\s*afternoon|afternoon)/i.test(s)) return 'afternoon'
  if (/(midday|noon|mid-day|lunchtime)/i.test(s)) return 'afternoon'
  return undefined
}

function clipImagePromptForAction(imagePrompt: string, maxLen = 420): string {
  const t = imagePrompt.trim()
  if (t.length <= maxLen) return t
  const cut = t.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  return lastSpace > 200 ? cut.slice(0, lastSpace).trim() : cut.trim()
}

/**
 * Ana görsel brief: önce uzun İngilizce imagePrompt, yoksa sceneDescription, son çare metin.
 * (Mevcut pipeline ile aynı öncelik; tek giriş noktası.)
 */
export function buildPrimaryVisualBrief(page: {
  imagePrompt?: string
  sceneDescription?: string
  text?: string
}): string {
  return (page.imagePrompt || page.sceneDescription || page.text || '').trim()
}

/**
 * Karakter eylemi: sceneContext → sceneDescription → imagePrompt’un kısaltılmışı → text.
 * imagePrompt zaten primaryVisualBrief’te geçtiği için burada tam metin kullanılmaz.
 */
export function buildCharacterActionForPage(page: {
  sceneContext?: string
  sceneDescription?: string
  imagePrompt?: string
  text?: string
}): string {
  const a = page.sceneContext?.trim()
  if (a) return a
  const b = page.sceneDescription?.trim()
  if (b) return b
  const ip = page.imagePrompt?.trim()
  if (ip) return clipImagePromptForAction(ip)
  return page.text?.trim() || ''
}
