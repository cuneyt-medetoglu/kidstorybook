/**
 * D2: supportingEntities — `appearsOnPages` ile sayfa görselleri hizası + entity master (İngilizce görsel brief).
 */

import { getStyleDescription, getCinematicPack } from '@/lib/prompts/image/style-descriptions'

/** Görsel prompt içinde delinen tırnak / satır sonu kaçışı */
function sanitizeEntityPromptFragment(s: string): string {
  return s.replace(/\r?\n/g, ' ').replace(/"/g, "'").replace(/\s+/g, ' ').trim()
}

/** 1..totalPages aralığında tamsayı sayfa numaraları; tekrarsız, sıralı. */
export function normalizeAppearsOnPages(raw: unknown, totalPages: number): number[] {
  if (totalPages < 1) return []
  if (!Array.isArray(raw)) return []
  const valid = new Set<number>()
  for (const x of raw) {
    const n =
      typeof x === 'number' && Number.isFinite(x)
        ? Math.round(x)
        : parseInt(String(x), 10)
    if (!Number.isFinite(n)) continue
    if (n >= 1 && n <= totalPages) valid.add(n)
  }
  return [...valid].sort((a, b) => a - b)
}

/** Sayfa görseli / referans seçiminde kullan — ham dizi yerine normalize liste. */
export function entityAppearsOnPage(
  entity: { appearsOnPages?: unknown },
  pageNumber: number,
  totalPages: number
): boolean {
  return normalizeAppearsOnPages(entity.appearsOnPages, totalPages).includes(pageNumber)
}

/**
 * Metin üretimli master (referans foto yok). Story alanları English-only olmalı;
 * prompt’ta bunu açıkça hatırlatıyoruz ve entity adını kimlik için sabitliyoruz.
 */
export function buildSupportingEntityMasterPrompt(
  entity: { name: string; description: string; type: 'animal' | 'object' },
  illustrationStyle: string
): string {
  const styleDirective = getStyleDescription(illustrationStyle)
  const renderPack = getCinematicPack(illustrationStyle)
  const name = sanitizeEntityPromptFragment(entity.name)
  const desc = sanitizeEntityPromptFragment(entity.description)
  return [
    `[STYLE] ${styleDirective} [/STYLE]`,
    `[RENDER] ${renderPack}. Consistent with the book illustration style. [/RENDER]`,
    `English-only visual brief for the image model. Subject name (identity): ${name}. Visual description: ${desc}.`,
    `Neutral front-facing view; one clear subject matching the name and description.`,
    `Plain neutral background. Illustration style (NOT photorealistic).`,
    entity.type === 'animal'
      ? 'Friendly and appealing animal character.'
      : 'Clear and recognizable object.',
    "Centered in frame. Simple, clean, professional children's book illustration.",
  ].join(' ')
}
