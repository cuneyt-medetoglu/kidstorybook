import type OpenAI from 'openai'
import { chatWithLog, type ChatLogContext } from '@/lib/ai/chat'
import { normalizeStoryCameraDistance, STORY_CAMERA_DISTANCES } from '@/lib/ai/story-camera-distance'
import {
  metadataThemeTrim,
  normalizeAppearsOnPages,
  normalizeEducationalThemes,
  normalizeMetadataSafetyChecked,
  normalizePageCharacterIds,
  normalizePageShotPlan,
  normalizeStoryMetadataAgeGroup,
  normalizeSupportingEntityType,
  STORY_METADATA_AGE_GROUPS,
  SUPPORTING_ENTITY_TYPES,
} from '@/lib/ai/story-response-normalize-fields'

type StoryCharacterRef = {
  id: string
  name?: string
}

export type RepairableField =
  | 'supportingEntities'
  | 'suggestedOutfits'
  | 'sceneMap'
  | 'coverDescription'
  | 'coverImagePrompt'

/**
 * Story repair: eksik/bozuk alanlar için en fazla bu kadar **ek** Chat Completions çağrısı.
 * Sonsuz döngü yok; `prepareStoryResponseForUse` içinde tek tur.
 */
export const STORY_RESPONSE_MAX_REPAIR_CALLS = 1

/** Ürün kuralı: entity master görseli başına maliyet — en fazla bu kadar supporting entity. */
export const MAX_SUPPORTING_ENTITIES = 2

type PrepareStoryResponseParams = {
  openai: OpenAI
  model: string
  userId: string
  characterId?: string | null
  bookId?: string | null
  promptVersion?: string | null
  requestMeta?: Record<string, unknown>
  storyData: any
  expectedPageCount: number
  characters: StoryCharacterRef[]
  /** Story seed text; used for smart entity repair (if entities empty but seed mentions objects). */
  customRequests?: string
}

export interface PreparedStoryResponse {
  storyData: any
  repaired: boolean
  issues: string[]
  /** İlk model cevabında eksik/bozuk bulunan alanlar; repair tetikleme nedeni (boş = repair yok). */
  repairFieldsRequested: RepairableField[]
  /** Repair çağrısı yapıldıysa (0 veya 1); `STORY_RESPONSE_MAX_REPAIR_CALLS` ile sınırlı. */
  repairCalls: number
  /** İlk story cevabından sonra yapılan repair isteğinin token kullanımı (OpenAI `usage`). */
  repairUsage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

function normalizePositiveInt(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** Re-export: tek kaynak `story-camera-distance.ts` */
export type { StoryCameraDistance } from '@/lib/ai/story-camera-distance'
export { normalizeStoryCameraDistance } from '@/lib/ai/story-camera-distance'

function normalizeStoryShape(
  storyData: any,
  expectedPageCount: number,
  normalizationNotes?: string[]
): any {
  const normalized = typeof storyData === 'object' && storyData !== null ? structuredClone(storyData) : {}

  if (Array.isArray(normalized.pages)) {
    normalized.pages = normalized.pages.slice(0, expectedPageCount).map((page: any, index: number) => {
      const beforeCam = page?.cameraDistance
      const cameraDistance = normalizeStoryCameraDistance(beforeCam, index)
      if (
        normalizationNotes &&
        beforeCam !== undefined &&
        beforeCam !== null &&
        String(beforeCam).trim() !== '' &&
        String(beforeCam).trim().toLowerCase() !== cameraDistance &&
        !(STORY_CAMERA_DISTANCES as readonly string[]).includes(String(beforeCam).trim().toLowerCase())
      ) {
        normalizationNotes.push(
          `Page ${index + 1}: cameraDistance normalized from ${JSON.stringify(beforeCam)} to "${cameraDistance}"`
        )
      }

      const shotPlan = normalizePageShotPlan(page?.shotPlan, index, normalizationNotes)
      const characterIds = normalizePageCharacterIds(page?.characterIds, index, normalizationNotes)

      return {
        ...page,
        pageNumber: index + 1,
        cameraDistance,
        shotPlan,
        characterIds,
      }
    })
  }

  if (Array.isArray(normalized.sceneMap)) {
    normalized.sceneMap = normalized.sceneMap.slice(0, expectedPageCount).map((entry: any, index: number) => ({
      ...entry,
      pageNumber: index + 1,
    }))
  }

  if (Array.isArray(normalized.supportingEntities)) {
    normalized.supportingEntities = normalized.supportingEntities.map((entity: any, ei: number) => {
      const beforeType = entity?.type
      const type = normalizeSupportingEntityType(beforeType, ei)
      if (
        normalizationNotes &&
        String(beforeType ?? '').trim() !== '' &&
        type !== String(beforeType).trim().toLowerCase()
      ) {
        normalizationNotes.push(
          `supportingEntities[${ei}].type normalized from ${JSON.stringify(beforeType)} to "${type}"`
        )
      }
      const beforePages = entity?.appearsOnPages
      const appearsOnPages = normalizeAppearsOnPages(beforePages)
      if (
        normalizationNotes &&
        beforePages !== undefined &&
        JSON.stringify(beforePages ?? null) !== JSON.stringify(appearsOnPages)
      ) {
        normalizationNotes.push(`supportingEntities[${ei}].appearsOnPages coerced to integer page list`)
      }
      return { ...entity, type, appearsOnPages }
    })
  }

  if (normalized.metadata && typeof normalized.metadata === 'object') {
    const m = normalized.metadata as Record<string, unknown>
    const beforeAge = m.ageGroup
    m.ageGroup = normalizeStoryMetadataAgeGroup(beforeAge)
    const beforeAgeKey = String(beforeAge ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
    if (
      normalizationNotes &&
      String(beforeAge ?? '').trim() !== '' &&
      !(STORY_METADATA_AGE_GROUPS as readonly string[]).includes(beforeAgeKey)
    ) {
      normalizationNotes.push(
        `metadata.ageGroup normalized from ${JSON.stringify(beforeAge)} to "${m.ageGroup}"`
      )
    }

    const beforeSafety = m.safetyChecked
    if (normalizationNotes && typeof beforeSafety !== 'boolean') {
      normalizationNotes.push(
        `metadata.safetyChecked coerced from ${JSON.stringify(beforeSafety)} to ${normalizeMetadataSafetyChecked(beforeSafety)}`
      )
    }
    m.safetyChecked = normalizeMetadataSafetyChecked(beforeSafety)

    const beforeThemes = m.educationalThemes
    m.educationalThemes = normalizeEducationalThemes(beforeThemes)
    if (normalizationNotes && !Array.isArray(beforeThemes)) {
      normalizationNotes.push('metadata.educationalThemes coerced to string array')
    }

    if (typeof m.theme === 'string') {
      m.theme = metadataThemeTrim(m.theme)
    }
  }

  return normalized
}

function isSupportingEntitiesEntryValid(entity: unknown): boolean {
  if (!entity || typeof entity !== 'object') return false
  const e = entity as Record<string, unknown>
  return (
    isNonEmptyString(e.id) &&
    (SUPPORTING_ENTITY_TYPES as readonly string[]).includes(e.type as string) &&
    isNonEmptyString(e.name) &&
    isNonEmptyString(e.description) &&
    Array.isArray(e.appearsOnPages)
  )
}

function findRepairableFields(
  storyData: any,
  expectedPageCount: number,
  characterIds: string[],
  customRequests?: string
): RepairableField[] {
  const repairFields = new Set<RepairableField>()

  if (!isNonEmptyString(storyData?.coverDescription)) {
    repairFields.add('coverDescription')
  }

  if (!isNonEmptyString(storyData?.coverImagePrompt)) {
    repairFields.add('coverImagePrompt')
  }

  const supportingEntities = storyData?.supportingEntities
  const hasInvalidEntry = Array.isArray(supportingEntities) &&
    supportingEntities.some((entry: unknown) => !isSupportingEntitiesEntryValid(entry))
  const isEmptyWithSeed = Array.isArray(supportingEntities) &&
    supportingEntities.length === 0 &&
    typeof customRequests === 'string' && customRequests.trim().length > 0
  const tooManyEntities =
    Array.isArray(supportingEntities) && supportingEntities.length > MAX_SUPPORTING_ENTITIES
  const needsSupportingEntitiesRepair =
    !Array.isArray(supportingEntities) ||
    hasInvalidEntry ||
    isEmptyWithSeed ||
    tooManyEntities
  if (needsSupportingEntitiesRepair) {
    repairFields.add('supportingEntities')
  }

  const outfits = storyData?.suggestedOutfits
  const missingOutfit =
    !outfits ||
    typeof outfits !== 'object' ||
    characterIds.some((id) => !isNonEmptyString(outfits[id]))
  if (missingOutfit) {
    repairFields.add('suggestedOutfits')
  }

  const sceneMap = storyData?.sceneMap
  const invalidSceneMap =
    !Array.isArray(sceneMap) ||
    sceneMap.length !== expectedPageCount ||
    sceneMap.some(
      (entry: any, index: number) =>
        normalizePositiveInt(entry?.pageNumber) !== index + 1 ||
        !isNonEmptyString(entry?.location) ||
        !isNonEmptyString(entry?.timeOfDay) ||
        !isNonEmptyString(entry?.setting)
    )
  if (invalidSceneMap) {
    repairFields.add('sceneMap')
  }

  return [...repairFields]
}

// ============================================================================
// Faz 1.2 — Sahne çeşitliliği kontrolleri
// ============================================================================

/**
 * Gerund (-ing) pattern: storybook imagePrompt'larda aktif sahne için en güvenilir proxy.
 * "reaching", "holding", "running" gibi kelimeler aksiyon varlığını gösterir.
 */
const HAS_ACTION_RE = /\b\w+ing\b/

/** Bakış fiilleri: looks/watches/peers/gazes/stares */
const GAZE_RE = /\b(looks?|watches?|peers?|gazes?|stares?)\b/i

/**
 * Faz 1.2: Story response'un sahne çeşitliliği kontrollerini yapar.
 *
 * Uyarılar `issues[]` dizisine eklenir (log + debug export'ta görünür).
 * Sadece ardışık lokasyon tekrarı `sceneMap` repair'ini tetikler — diğerleri uyarı.
 *
 * Kontroller:
 * 1. Ardışık 3 sayfa aynı `location`  → sceneMap repair
 * 2. Sayfaların yarısından fazlası aynı `cameraDistance` → uyarı
 * 3. imagePrompt'ta gerund/aksiyon fiili yok → uyarı
 * 4. (V2) Ardışık iki sayfada gaze dominant imagePrompt → uyarı
 */
function checkSceneDiversity(
  storyData: any,
  issues: string[]
): RepairableField[] {
  const additionalRepairFields: RepairableField[] = []
  const pages: any[] = Array.isArray(storyData?.pages) ? storyData.pages : []
  const sceneMap: any[] = Array.isArray(storyData?.sceneMap) ? storyData.sceneMap : []

  // ── 1. Ardışık 3 sayfa aynı location → sceneMap repair ──────────────────
  for (let i = 0; i <= sceneMap.length - 3; i++) {
    const l0 = String(sceneMap[i]?.location ?? '').trim().toLowerCase()
    const l1 = String(sceneMap[i + 1]?.location ?? '').trim().toLowerCase()
    const l2 = String(sceneMap[i + 2]?.location ?? '').trim().toLowerCase()
    if (l0 && l0 === l1 && l1 === l2) {
      issues.push(
        `diversity: pages ${i + 1}–${i + 3} share the same location ("${sceneMap[i]?.location}") — sceneMap repair requested`
      )
      additionalRepairFields.push('sceneMap')
      break // tek bir lokasyon bloğu yeterli tetikleyici
    }
  }

  // ── 2. Sayfaların ≥50 %'si aynı cameraDistance → uyarı ──────────────────
  if (pages.length >= 6) {
    const camCounts: Record<string, number> = {}
    for (const page of pages) {
      const cam = String(page?.cameraDistance ?? '').trim()
      if (cam) camCounts[cam] = (camCounts[cam] ?? 0) + 1
    }
    for (const [cam, count] of Object.entries(camCounts)) {
      if (count >= Math.ceil(pages.length / 2)) {
        issues.push(
          `diversity warning: cameraDistance "${cam}" appears on ${count}/${pages.length} pages — low variety`
        )
      }
    }
  }

  // ── 3. imagePrompt'ta aksiyon fiili (gerund) yok → uyarı ────────────────
  const pagesWithoutAction: number[] = []
  for (const page of pages) {
    const prompt = String(page?.imagePrompt ?? '')
    if (!HAS_ACTION_RE.test(prompt) && typeof page?.pageNumber === 'number') {
      pagesWithoutAction.push(page.pageNumber)
    }
  }
  if (pagesWithoutAction.length > 0) {
    issues.push(
      `diversity warning: pages ${pagesWithoutAction.join(', ')} imagePrompt may lack an active action verb (no gerund found)`
    )
  }

  // ── 4. (V2) Ardışık iki sayfada gaze dominant imagePrompt → uyarı ────────
  let prevGaze = false
  for (const page of pages) {
    const prompt = String(page?.imagePrompt ?? '')
    const hasGaze = GAZE_RE.test(prompt)
    if (hasGaze && prevGaze && typeof page?.pageNumber === 'number') {
      issues.push(
        `diversity warning: page ${page.pageNumber} and the preceding page both have gaze-dominant imagePrompt — consider alternating action types`
      )
      prevGaze = false // tek uyarı per çift yeterli; kaskadı önler
      continue
    }
    prevGaze = hasGaze
  }

  return additionalRepairFields
}

function buildRepairSchema(fields: RepairableField[]) {
  const properties: Record<string, unknown> = {}
  const required: string[] = []

  if (fields.includes('coverDescription')) {
    properties.coverDescription = { type: 'string' }
    required.push('coverDescription')
  }

  if (fields.includes('coverImagePrompt')) {
    properties.coverImagePrompt = { type: 'string' }
    required.push('coverImagePrompt')
  }

  if (fields.includes('sceneMap')) {
    properties.sceneMap = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          pageNumber: { type: 'integer' },
          location: { type: 'string' },
          timeOfDay: { type: 'string' },
          setting: { type: 'string' },
        },
        required: ['pageNumber', 'location', 'timeOfDay', 'setting'],
      },
    }
    required.push('sceneMap')
  }

  if (fields.includes('supportingEntities')) {
    properties.supportingEntities = {
      type: 'array',
      maxItems: MAX_SUPPORTING_ENTITIES,
      description:
        `At most ${MAX_SUPPORTING_ENTITIES} plot-significant objects or non-character animals; never scenery-only.`,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['animal', 'object'] },
          name: { type: 'string' },
          description: { type: 'string' },
          appearsOnPages: { type: 'array', items: { type: 'integer' } },
        },
        required: ['id', 'type', 'name', 'description', 'appearsOnPages'],
      },
    }
    required.push('supportingEntities')
  }

  if (fields.includes('suggestedOutfits')) {
    properties.suggestedOutfits = {
      type: 'object',
      description: 'Keys are character UUIDs, values are one-line English outfits.',
    }
    required.push('suggestedOutfits')
  }

  return {
    type: 'object',
    properties,
    required,
  }
}

/**
 * Repair prompt için storyData'yı sadeleştirir.
 * - supportingEntities/suggestedOutfits/coverDescription/coverImagePrompt → sadece page text'leri ve başlık yeterli
 * - sceneMap → page text + environmentDescription da faydalı
 * Gereksiz alanları (imagePrompt, shotPlan, characterExpressions, sceneDescription…) göndermez; input token tasarrufu sağlar.
 */
function buildRepairStoryContext(fields: RepairableField[], storyData: any): string {
  const needsSceneDetails =
    fields.includes('sceneMap') || fields.includes('coverDescription') || fields.includes('coverImagePrompt')

  const pages = Array.isArray(storyData?.pages) ? storyData.pages : []
  const pageContext = pages.map((page: any) => {
    const base: Record<string, unknown> = {
      pageNumber: page.pageNumber,
      text: page.text,
      characterIds: page.characterIds,
    }
    if (needsSceneDetails) {
      if (page.environmentDescription) base.environmentDescription = page.environmentDescription
      if (page.sceneDescription) base.sceneDescription = page.sceneDescription
    }
    return base
  })

  const condensed: Record<string, unknown> = {
    title: storyData?.title,
    pages: pageContext,
  }

  if (storyData?.coverDescription) condensed.coverDescription = storyData.coverDescription
  if (storyData?.coverImagePrompt) condensed.coverImagePrompt = storyData.coverImagePrompt
  if (storyData?.suggestedOutfits) condensed.suggestedOutfits = storyData.suggestedOutfits
  if (storyData?.metadata) condensed.metadata = storyData.metadata

  return JSON.stringify(condensed)
}

function buildRepairPrompt(
  fields: RepairableField[],
  storyData: any,
  expectedPageCount: number,
  characters: StoryCharacterRef[],
  customRequests?: string
): string {
  const fieldNotes = fields.map((field) => {
    switch (field) {
      case 'coverDescription':
        return '- coverDescription: 2-4 English sentences, reader-facing summary of the cover scene.'
      case 'coverImagePrompt':
        return '- coverImagePrompt: 4-8 English sentences, cinematic movie-poster cover brief; not page 1.'
      case 'sceneMap':
        return '- sceneMap: exactly one entry per page; pageNumber/location/timeOfDay/setting must match the existing story beats. DIVERSITY: no 3 consecutive pages with the exact same location — if present, vary them (adjacent area, different room, different part of the environment). location, timeOfDay, setting — English only (image pipeline).'
      case 'supportingEntities':
        return `- supportingEntities: **At most ${MAX_SUPPORTING_ENTITIES} entries** (product cost cap). Each entry = plot-significant object or non-character animal (carried, found, worn, shared, talked to, used to solve a problem). If more than ${MAX_SUPPORTING_ENTITIES} candidates exist, keep only the two most central to the plot (prioritize story-seed objects if listed). No scenery-only items. name and description — English only. appearsOnPages = page numbers where the entity appears.`
      case 'suggestedOutfits':
        return '- suggestedOutfits: one English outfit line per character UUID. Same outfit for the whole book unless the story text explicitly changes wardrobe (e.g. pajamas, swimwear).'
      default:
        return ''
    }
  })

  const characterMap = Object.fromEntries(characters.map((character) => [character.id, character.name ?? character.id]))

  const seedBlock =
    fields.includes('supportingEntities') && customRequests?.trim()
      ? `\n\n**Story seed (author's original idea):**\n"${customRequests.trim()}"\nAny object or animal mentioned in this seed that is plot-significant MUST appear in supportingEntities.`
      : ''

  return `Repair the children story JSON below.

Return ONLY a JSON object with these keys: ${fields.join(', ')}.
Do not rewrite the story, do not change page texts, and do not invent a new plot.
Use the existing story content as the source of truth.

**Language:** All strings you output must be **English** (cover fields, sceneMap, supportingEntities, suggestedOutfits, etc.).

Requirements:
${fieldNotes.join('\n')}
- Expected page count: ${expectedPageCount}
- Character map (do NOT add these to supportingEntities): ${JSON.stringify(characterMap)}
- sceneMap must follow the actual current pages in order, pageNumber = 1..${expectedPageCount}.${seedBlock}

Story context:
${buildRepairStoryContext(fields, storyData)}`
}

async function repairStoryFields(
  params: PrepareStoryResponseParams,
  fields: RepairableField[]
): Promise<{ data: any; usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } }> {
  const repairPrompt = buildRepairPrompt(
    fields,
    params.storyData,
    params.expectedPageCount,
    params.characters,
    params.customRequests
  )

  const repairContext: ChatLogContext = {
    userId: params.userId,
    characterId: params.characterId ?? null,
    bookId: params.bookId ?? null,
    operationType: 'story_generation',
    promptVersion: params.promptVersion ?? null,
    requestMeta: {
      ...(params.requestMeta ?? {}),
      repairFields: fields,
      repairKind: 'story_response',
    },
  }

  const completion = await chatWithLog(
    params.openai,
    {
      model: params.model,
      messages: [
        {
          role: 'system',
          content:
            'You repair missing or invalid fields in a children story JSON response. Return only valid JSON matching the requested schema. Every string you output must be English (image/API pipeline). You never return or rewrite pages[].text.',
        },
        { role: 'user', content: repairPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'story_response_repair',
          strict: false,
          schema: buildRepairSchema(fields),
        },
      },
      temperature: 0.2,
      max_completion_tokens: 2500,
    },
    repairContext
  )

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('Story repair returned empty content')
  }

  return {
    data: JSON.parse(content),
    usage: completion.usage ?? undefined,
  }
}

function assertStoryResponseValid(
  storyData: any,
  expectedPageCount: number,
  characters: StoryCharacterRef[]
) {
  if (!isNonEmptyString(storyData?.title)) {
    throw new Error('Invalid story structure: missing title')
  }

  if (!Array.isArray(storyData?.pages)) {
    throw new Error('Invalid story structure: missing pages array')
  }

  if (storyData.pages.length !== expectedPageCount) {
    throw new Error(`Invalid story structure: expected ${expectedPageCount} pages, got ${storyData.pages.length}`)
  }

  if (!Array.isArray(storyData?.sceneMap) || storyData.sceneMap.length !== expectedPageCount) {
    throw new Error(`Invalid story structure: sceneMap must contain exactly ${expectedPageCount} entries`)
  }

  if (!isNonEmptyString(storyData?.coverDescription)) {
    throw new Error('Story is missing required "coverDescription"')
  }

  if (!isNonEmptyString(storyData?.coverImagePrompt)) {
    throw new Error('Story is missing required "coverImagePrompt"')
  }

  const characterIds = characters.map((character) => character.id)

  for (const [index, entry] of storyData.sceneMap.entries()) {
    if (
      normalizePositiveInt(entry?.pageNumber) !== index + 1 ||
      !isNonEmptyString(entry?.location) ||
      !isNonEmptyString(entry?.timeOfDay) ||
      !isNonEmptyString(entry?.setting)
    ) {
      throw new Error(`sceneMap entry ${index + 1} is invalid`)
    }
  }

  for (const [index, page] of storyData.pages.entries()) {
    if (normalizePositiveInt(page?.pageNumber) !== index + 1) {
      throw new Error(`Page ${index + 1} has invalid pageNumber`)
    }
    if (!isNonEmptyString(page?.text)) {
      throw new Error(`Page ${index + 1} is missing "text"`)
    }
    if (!isNonEmptyString(page?.imagePrompt)) {
      throw new Error(`Page ${index + 1} is missing "imagePrompt"`)
    }
    if (!isNonEmptyString(page?.sceneDescription)) {
      throw new Error(`Page ${index + 1} is missing "sceneDescription"`)
    }
    if (!isNonEmptyString(page?.environmentDescription)) {
      throw new Error(`Page ${index + 1} is missing "environmentDescription"`)
    }
    if (!(STORY_CAMERA_DISTANCES as readonly string[]).includes(page?.cameraDistance)) {
      throw new Error(`Page ${index + 1} has invalid "cameraDistance"`)
    }
    if (!Array.isArray(page?.characterIds) || page.characterIds.length === 0) {
      throw new Error(`Page ${index + 1} is missing required "characterIds" field`)
    }
    if (!page.characterIds.every((id: unknown) => typeof id === 'string')) {
      throw new Error(`Page ${index + 1} has invalid "characterIds"`)
    }
    if (!page.characterIds.every((id: string) => characterIds.includes(id))) {
      throw new Error(`Page ${index + 1} contains unknown character ID`)
    }
    if (!page.characterExpressions || typeof page.characterExpressions !== 'object') {
      throw new Error(`Page ${index + 1} is missing required "characterExpressions" object`)
    }
    for (const characterId of page.characterIds) {
      if (!isNonEmptyString(page.characterExpressions[characterId])) {
        throw new Error(`Page ${index + 1} characterExpressions is missing "${characterId}"`)
      }
    }
    if (!page.shotPlan || typeof page.shotPlan !== 'object') {
      throw new Error(`Page ${index + 1} is missing required "shotPlan"`)
    }
    const shotPlanKeys = ['shotType', 'lens', 'cameraAngle', 'placement', 'timeOfDay', 'mood'] as const
    for (const key of shotPlanKeys) {
      if (!isNonEmptyString(page.shotPlan[key])) {
        throw new Error(`Page ${index + 1} shotPlan is missing "${key}"`)
      }
    }
  }

  if (!Array.isArray(storyData?.supportingEntities)) {
    throw new Error('Story is missing required "supportingEntities" array')
  }

  if (storyData.supportingEntities.length > MAX_SUPPORTING_ENTITIES) {
    throw new Error(
      `supportingEntities must contain at most ${MAX_SUPPORTING_ENTITIES} entries (entity master cost cap)`
    )
  }

  for (const entity of storyData.supportingEntities) {
    if (
      !isNonEmptyString(entity?.id) ||
      !(SUPPORTING_ENTITY_TYPES as readonly string[]).includes(entity?.type) ||
      !isNonEmptyString(entity?.name) ||
      !isNonEmptyString(entity?.description) ||
      !Array.isArray(entity?.appearsOnPages)
    ) {
      throw new Error('supportingEntities contains an invalid entry')
    }
  }

  if (!storyData?.suggestedOutfits || typeof storyData.suggestedOutfits !== 'object') {
    throw new Error('Story is missing required "suggestedOutfits" object')
  }

  for (const characterId of characterIds) {
    if (!isNonEmptyString(storyData.suggestedOutfits[characterId])) {
      throw new Error(`suggestedOutfits is missing or empty for character ${characterId}`)
    }
  }

  if (!storyData?.metadata || typeof storyData.metadata !== 'object') {
    throw new Error('Story is missing required "metadata" object')
  }

  if (
    !isNonEmptyString(storyData.metadata.ageGroup) ||
    !(STORY_METADATA_AGE_GROUPS as readonly string[]).includes(String(storyData.metadata.ageGroup).trim())
  ) {
    throw new Error('Story metadata.ageGroup is missing or not a known age band')
  }

  if (
    !isNonEmptyString(storyData.metadata.theme) ||
    !Array.isArray(storyData.metadata.educationalThemes) ||
    typeof storyData.metadata.safetyChecked !== 'boolean'
  ) {
    throw new Error('Story metadata is invalid')
  }
}

export async function prepareStoryResponseForUse(
  params: PrepareStoryResponseParams
): Promise<PreparedStoryResponse> {
  const issues: string[] = []
  const normNotesInitial: string[] = []
  let storyData = normalizeStoryShape(params.storyData, params.expectedPageCount, normNotesInitial)
  issues.push(...normNotesInitial)

  const structuralRepairFields = findRepairableFields(
    storyData,
    params.expectedPageCount,
    params.characters.map((character) => character.id),
    params.customRequests
  )

  // Faz 1.2: sahne çeşitliliği kontrolleri — uyarıları issues[]'e ekle;
  // lokasyon tekrarı varsa sceneMap repair'i de tetiklenebilir.
  const diversityRepairFields = checkSceneDiversity(storyData, issues)
  const repairFieldSet = new Set<RepairableField>([
    ...structuralRepairFields,
    ...diversityRepairFields,
  ])
  const repairFields = [...repairFieldSet]

  let repaired = false
  let repairCalls = 0
  let repairUsage: PreparedStoryResponse['repairUsage']

  if (repairFields.length > 0) {
    issues.push(`repair requested: ${repairFields.join(', ')}`)
    const { data: repairedFields, usage } = await repairStoryFields({ ...params, storyData }, repairFields)
    const normNotesAfterRepair: string[] = []
    storyData = normalizeStoryShape({ ...storyData, ...repairedFields }, params.expectedPageCount, normNotesAfterRepair)
    issues.push(...normNotesAfterRepair)
    repaired = true
    repairCalls = STORY_RESPONSE_MAX_REPAIR_CALLS
    repairUsage = usage
  }

  assertStoryResponseValid(storyData, params.expectedPageCount, params.characters)

  return {
    storyData,
    repaired,
    issues,
    repairFieldsRequested: repairFields,
    repairCalls,
    repairUsage,
  }
}
