/**
 * Örnek kitaptan story_data klonlama — ödeme sonrası placeholder kitap için.
 * Mantık `app/api/books/route.ts` from-example dalı ile uyumlu (isim + karakter ID remap).
 */

import { getCharacterById } from '@/lib/db/characters'

function applyCharacterNameSwapToStoryData(storyData: any, oldName: string, newName: string): void {
  if (!oldName || !newName || oldName === newName) return
  const swap = (s: string) => s.split(oldName).join(newName)
  if (typeof storyData.title === 'string') storyData.title = swap(storyData.title)
  for (const k of ['coverImagePrompt', 'coverDescription'] as const) {
    if (typeof storyData[k] === 'string') storyData[k] = swap(storyData[k] as string)
  }
  for (const row of storyData.sceneMap || []) {
    if (row && typeof row === 'object') {
      for (const fld of ['location', 'setting', 'timeOfDay'] as const) {
        if (typeof (row as any)[fld] === 'string') (row as any)[fld] = swap((row as any)[fld] as string)
      }
    }
  }
  for (const page of storyData.pages || []) {
    const p = page as Record<string, unknown>
    for (const fld of ['text', 'imagePrompt', 'sceneDescription', 'sceneContext', 'environmentDescription']) {
      if (typeof p[fld] === 'string') p[fld] = swap(p[fld] as string)
    }
  }
  for (const ent of storyData.supportingEntities || []) {
    if (ent && typeof ent === 'object') {
      const e = ent as Record<string, unknown>
      if (typeof e.name === 'string') e.name = swap(e.name)
      if (typeof e.description === 'string') e.description = swap(e.description)
    }
  }
}

function buildCharIdMapFromExampleOrder(
  exampleCharOrder: string[],
  fromExampleCharIds: string[]
): Record<string, string> {
  const map: Record<string, string> = {}
  const n = Math.min(exampleCharOrder.length, fromExampleCharIds.length)
  for (let i = 0; i < n; i++) {
    map[exampleCharOrder[i]] = fromExampleCharIds[i]
  }
  return map
}

function remapCharacterIdKeyedMapsInStoryData(storyData: any, charIdMap: Record<string, string>): void {
  if (!storyData?.pages?.length || Object.keys(charIdMap).length === 0) return
  for (const page of storyData.pages) {
    const p = page as Record<string, unknown>
    const ids = p.characterIds as string[] | undefined
    if (ids?.length) {
      p.characterIds = ids.map((id) => charIdMap[id] ?? id)
    }
    const exprs = p.characterExpressions as Record<string, string> | undefined
    if (exprs && typeof exprs === 'object' && !Array.isArray(exprs)) {
      const next: Record<string, string> = {}
      for (const [oldId, v] of Object.entries(exprs)) {
        const nid = charIdMap[oldId] ?? oldId
        if (typeof v === 'string') next[nid] = v
      }
      p.characterExpressions = next
    }
  }
  const outfits = storyData.suggestedOutfits
  if (outfits && typeof outfits === 'object' && !Array.isArray(outfits)) {
    const nextOut: Record<string, string> = {}
    for (const [oldId, v] of Object.entries(outfits as Record<string, string>)) {
      const nid = charIdMap[oldId] ?? oldId
      nextOut[nid] = v
    }
    storyData.suggestedOutfits = nextOut
  }
}

/**
 * Örnek kitabın hikâyesini kullanıcı karakter ID'leriyle klonlar (ödeme sonrası üretim için).
 */
export async function cloneExampleStoryForPaidPlaceholder(
  exampleBook: { id: string; title: string; story_data: unknown },
  userCharacterIds: string[]
): Promise<{ storyData: Record<string, unknown>; title: string } | null> {
  if (!userCharacterIds.length) return null
  const exStory = exampleBook.story_data
  if (!exStory || typeof exStory !== 'object') return null
  const storyData = JSON.parse(JSON.stringify(exStory)) as Record<string, unknown>
  const pages = storyData.pages as unknown[] | undefined
  if (!pages?.length) return null

  const exampleCharOrder: string[] = []
  const seen = new Set<string>()
  for (const p of pages) {
    const ids = (p as { characterIds?: string[] }).characterIds || []
    for (const id of ids) {
      if (typeof id === 'string' && !seen.has(id)) {
        seen.add(id)
        exampleCharOrder.push(id)
      }
    }
  }

  if (exampleCharOrder.length > 0 && userCharacterIds.length > 0) {
    const oldNames = await Promise.all(
      exampleCharOrder.map((id) => getCharacterById(id).then((r) => r.data?.name ?? ''))
    )
    const newNames = await Promise.all(
      userCharacterIds.map((id) => getCharacterById(id).then((r) => r.data?.name ?? ''))
    )
    const replaceCount = Math.min(oldNames.length, newNames.length)
    for (let i = 0; i < replaceCount; i++) {
      const oldName = (oldNames[i] || '').trim()
      const newName = (newNames[i] || '').trim()
      if (!oldName || !newName || oldName === newName) continue
      applyCharacterNameSwapToStoryData(storyData, oldName, newName)
    }
  }

  const charIdMap = buildCharIdMapFromExampleOrder(exampleCharOrder, userCharacterIds)
  if (Object.keys(charIdMap).length > 0) {
    remapCharacterIdKeyedMapsInStoryData(storyData, charIdMap)
  }

  const title =
    (typeof storyData.title === 'string' && storyData.title.trim()) || exampleBook.title
  return { storyData, title }
}
