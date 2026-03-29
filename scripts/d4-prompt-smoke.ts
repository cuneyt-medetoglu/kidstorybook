/**
 * D4 — Prompt katmanı duman testi (API / piksel yok).
 * Grafik stil (comic_book) dalında sinematik dilin sızmadığını doğrular.
 * Master prompt tarafı: styleDirective tam açıklama, pet prompt insan alanı yok.
 *
 * Çalıştır: npx tsx scripts/d4-prompt-smoke.ts
 */

import { normalizeStoryCameraDistance } from '../lib/ai/story-camera-distance'
import {
  normalizeAppearsOnPages,
  normalizeEducationalThemes,
  normalizeMetadataSafetyChecked,
  normalizePageShotPlan,
  normalizeStoryMetadataAgeGroup,
  normalizeSupportingEntityType,
} from '../lib/ai/story-response-normalize-fields'
import {
  getCinematicPack,
  getGlobalArtDirection,
  getStyleQualityPhrase,
  getStyleDescription,
} from '../lib/prompts/image/style-descriptions'
import { generateFullPagePrompt, type SceneInput } from '../lib/prompts/image/scene'

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`ASSERT: ${msg}`)
}

// ─── Helpers (image-pipeline'dan kopyalanmış — aynı mantık) ────────────────
function buildPetCharacterBriefTest(desc: any, animalKind: string | null): string {
  const parts: string[] = []
  const coatColor = String(desc?.hairColor || '').trim()
  const coatLength = String(desc?.hairLength || '').trim()
  const eyeColor = String(desc?.eyeColor || '').trim()
  const build = String(desc?.build || '').trim()
  if (coatColor) parts.push(coatLength ? `${coatColor}, ${coatLength} coat` : `${coatColor} fur`)
  if (eyeColor) parts.push(`${eyeColor} eyes`)
  if (build && !['normal', 'average', 'fair'].includes(build.toLowerCase())) parts.push(`${build} build`)
  return parts.length > 0 ? parts.join(', ') : (animalKind || 'animal')
}

// ─── Testler ───────────────────────────────────────────────────────────────
function main(): void {
  const comic = 'comic_book'
  const water = 'watercolor'

  // --- D3: sayfa prompt zincirleri ---
  assert(getGlobalArtDirection(comic).includes('Graphic storybook'), 'comic: global art direction must be graphic branch')
  assert(!getCinematicPack(comic).includes('volumetric sun rays'), 'comic: pack must not use volumetric sun rays')
  assert(getCinematicPack(water).includes('volumetric sun rays'), 'watercolor: pack must keep cinematic items')
  assert(getStyleQualityPhrase(comic).includes('graphic'), 'comic: quality phrase must mention graphic')
  assert(getStyleQualityPhrase(water).includes('cinematic'), 'watercolor: quality phrase stays cinematic')

  const scene: SceneInput = {
    pageNumber: 2,
    sceneDescription: 'A sunny park with trees.',
    theme: 'adventure',
    mood: 'calm',
    timeOfDay: 'afternoon',
    characterAction: 'walking',
    focusPoint: 'balanced',
  }
  const full = generateFullPagePrompt(
    'A friendly child character, storybook illustration.',
    scene,
    comic,
    'preschool',
    0, false, false, undefined, 12,
  )
  assert(full.includes('Graphic storybook'), 'full page: must inject graphic global direction')
  assert(!full.includes('volumetric sun rays'), 'full page: comic must not inject cinematic volumetric pack')
  assert(full.includes('bold graphic illustration quality'), 'full page: style quality phrase for graphic')

  // --- D4: styleDirective tam açıklama ---
  const comicDesc = getStyleDescription(comic)
  assert(comicDesc.includes('Bold thick black outlines'), 'comic styleDesc must include bold outlines detail')
  assert(comicDesc.includes('halftone'), 'comic styleDesc must include halftone detail')
  const waterDesc = getStyleDescription(water)
  assert(waterDesc.includes('watercolor'), 'watercolor styleDesc must mention watercolor')

  // --- D4: buildPetCharacterBrief insan alanı içermemeli ---
  const mockDogDesc = { hairColor: 'white and brown', hairLength: 'short', eyeColor: 'brown', gender: 'other', skinTone: 'fair', faceShape: 'round' }
  const petBrief = buildPetCharacterBriefTest(mockDogDesc, 'dog')
  assert(petBrief.includes('white and brown'), 'pet brief: coat color present')
  assert(petBrief.includes('brown eyes'), 'pet brief: eye color present')
  assert(!petBrief.includes('fair'), 'pet brief: skin tone must NOT appear')
  assert(!petBrief.includes('other'), 'pet brief: gender label must NOT appear')
  assert(!petBrief.includes('round'), 'pet brief: face shape must NOT appear')

  // --- Story: cameraDistance normalizasyonu (LLM enum sapması) ---
  assert(normalizeStoryCameraDistance('medium-wide', 0) === 'wide', 'medium-wide → wide')
  assert(normalizeStoryCameraDistance('Medium', 0) === 'medium', 'capitalized Medium → medium')
  assert(normalizeStoryCameraDistance('close-up', 0) === 'close', 'close-up → close')
  assert(normalizeStoryCameraDistance('establishing shot', 0) === 'establishing', 'establishing shot')
  const canon = ['close', 'medium', 'wide', 'establishing'] as const
  for (const c of canon) {
    assert(normalizeStoryCameraDistance(c, 0) === c, `canonical ${c}`)
  }

  assert(normalizeSupportingEntityType('Animal', 0) === 'animal', 'Animal → animal')
  assert(normalizeSupportingEntityType('toy', 0) === 'object', 'toy → object')
  assert(normalizeStoryMetadataAgeGroup('Preschool') === 'preschool', 'Preschool')
  assert(normalizeStoryMetadataAgeGroup('early elementary') === 'early-elementary', 'early elementary')
  assert(normalizeMetadataSafetyChecked('true') === true, 'safety string true')
  assert(Array.isArray(normalizeEducationalThemes('a, b')), 'themes from string')
  assert(normalizeAppearsOnPages(['1', 2, 2, 'x']).join(',') === '1,2', 'appearsOnPages ints')
  const sp = normalizePageShotPlan({ shotType: '', lens: '35mm' }, 0)
  assert(sp.shotType === 'medium shot' && sp.lens === '35mm', 'shotPlan defaults fill empty')

  console.log('d4-prompt-smoke: OK')
}

main()
