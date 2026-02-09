/**
 * Books API
 * 
 * POST /api/books - Create new book (triggers story generation)
 * GET /api/books - Get user's books
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { uploadFile, getPublicUrl, getObjectBuffer } from '@/lib/storage/s3'
import { appConfig } from '@/lib/config'
import { getCharacterById } from '@/lib/db/characters'
import { getUserRole } from '@/lib/db/users'
import { createBook, getUserBooks, updateBook, getBookById, deleteBook } from '@/lib/db/books'
import { generateStoryPrompt, getWordCountMin } from '@/lib/prompts/story/base'
import { successResponse, errorResponse, handleAPIError, CommonErrors } from '@/lib/api/response'
import { buildCharacterPrompt, buildDetailedCharacterPrompt, buildMultipleCharactersPrompt } from '@/lib/prompts/image/character'
import { generateFullPagePrompt, analyzeSceneDiversity, detectRiskySceneElements, getSafeSceneAlternative, extractSceneElements, type SceneDiversityAnalysis } from '@/lib/prompts/image/scene'
import { getStyleDescription, getCinematicPack } from '@/lib/prompts/image/style-descriptions'
import { getLayoutSafeMasterDirectives } from '@/lib/prompts/image/master'
import { generateTts } from '@/lib/tts/generate'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/** STOP_AFTER: .env'de STOP_AFTER=story_request | story_response | master_request | master_response yaz. O adım loglandıktan sonra istek durur. */
function stopAfter(step: string) {
  if (process.env.STOP_AFTER === step) {
    console.log(`[Create Book] ⏸️ STOP_AFTER=${step}`)
    throw new Error(`STOP_AFTER ${step}`)
  }
}

function normalizeThemeKey(theme: string): string {
  const t = (theme || '').toString().trim().toLowerCase()
  if (!t) return t
  if (t === 'sports&activities' || t === 'sports_activities' || t === 'sports-activities') return 'sports'
  return t
}

/**
 * Sıra 14 (COVER_PATH_FLOWERS_ANALYSIS.md): Kapak BACKGROUND'u hikayeden türet.
 * customRequests + sayfa sceneDescription/sceneContext/text içinden ortam anahtar kelimelerine göre
 * kısa bir environment cümlesi döner. Boş dönerse getEnvironmentDescription tema şablonuna düşer.
 */
function deriveCoverEnvironmentFromStory(
  customRequests: string | undefined,
  pages: Array<{ sceneDescription?: string; sceneContext?: string; text?: string; imagePrompt?: string }>
): string {
  const parts: string[] = [customRequests || '']
  for (const p of pages) {
    parts.push(p.sceneDescription || '', p.sceneContext || '', p.text || '', p.imagePrompt || '')
  }
  const combined = parts.join(' ').toLowerCase()
  // Öncelik: güçlü ortam (buz, uzay, deniz) önce; sonra orman, dağ, mağara
  if (/\b(glacier|ice|buz|frozen|snow|kar|snowy|karlı|buzul)\b/.test(combined)) {
    return 'glacier, ice cave, frozen landscape, soft snow and crystals'
  }
  if (/\b(space|uzay|stars|yıldız|planet|gezegen|cosmic|orbit)\b/.test(combined)) {
    return 'space, stars and planets, cosmic horizon'
  }
  if (/\b(ocean|deniz|sea|underwater|sualtı|coral|reef|aquatic)\b/.test(combined)) {
    return 'ocean, clear water, coral reef or underwater world'
  }
  if (/\b(cave|mağara|ice cave|buz mağara)\b/.test(combined)) {
    return 'cave, rocky interior, mysterious atmosphere'
  }
  if (/\b(forest|orman|clearing|açıklık|wildflowers|mushroom)\b/.test(combined)) {
    return 'lush forest, dappled sunlight, wildflowers'
  }
  if (/\b(mountain|dağ|path|yol|trail|patika|peak|zirve)\b/.test(combined)) {
    return 'mountain path, distant peaks, natural landscape'
  }
  if (/\b(beach|sahil|plaj|sand)\b/.test(combined)) {
    return 'sandy beach, ocean horizon, soft waves'
  }
  if (/\b(garden|bahçe|flower|çiçek)\b/.test(combined)) {
    return 'colorful garden, flowers and greenery'
  }
  return ''
}

/** From-example: örnek kapak görselinden sahne betimi (top, tavşan, kulübe vb.) alır; kapak prompt'unu zenginleştirmek için. */
async function describeCoverSceneForPrompt(imageUrl: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Describe this children\'s book cover in 1-2 short sentences for an image generation prompt. Include: setting (e.g. path, cottage, trees, flowers), key objects (e.g. ball, bunny, toys), and composition. English only, concise. No character description.' },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      }],
      max_tokens: 150,
    })
    const text = completion.choices[0]?.message?.content?.trim()
    return text ? ` Scene must include these key elements: ${text}` : ''
  } catch (e) {
    console.warn('[Create Book] From-example cover description (Vision) failed:', (e as Error).message)
    return ''
  }
}

// ============================================================================
// Retry Mechanism for API Calls (NEW: 16 Ocak 2026)
// ============================================================================

/**
 * Check if error is retryable (temporary error)
 */
function isRetryableError(status: number): boolean {
  // Retryable errors: 502 (Bad Gateway), 503 (Service Unavailable), 504 (Gateway Timeout), 429 (Too Many Requests)
  return status === 502 || status === 503 || status === 504 || status === 429
}

/**
 * Check if error is permanent (should not retry)
 */
function isPermanentError(status: number): boolean {
  // Permanent errors: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 500 (Internal Server Error)
  return status === 400 || status === 401 || status === 403 || status === 500
}

/**
 * Check if error is 400 + moderation_blocked / safety_violations (false positive).
 * Used to allow 1 retry for cover edits API (24 Ocak 2026).
 */
function isModerationBlockedError(error: any): boolean {
  const status = error?.status
  const msg = (error?.message || '').toString()
  if (status !== 400) return false
  return msg.includes('moderation_blocked') || msg.includes('safety_violations')
}

/**
 * Retry wrapper for API calls with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param context - Context for logging (e.g., "Page 3", "Cover")
 * @returns Response from successful call
 * @throws Error if all retries fail
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  context: string = 'API call'
): Promise<T> {
  let lastError: Error | null = null
  let lastStatus: number | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn()
      if (attempt > 1) {
        console.log(`[Retry] ✅ ${context} succeeded on attempt ${attempt}/${maxRetries}`)
      }
      return result
    } catch (error: any) {
      lastError = error
      
      // Extract status code from error
      const status = error.status || error.response?.status || null
      lastStatus = status
      
      if (status && isPermanentError(status)) {
        // Permanent error - don't retry
        console.error(`[Retry] ❌ ${context} failed with permanent error (${status}) - not retrying`)
        throw error
      }
      
      if (status && !isRetryableError(status)) {
        // Unknown error status - don't retry
        console.error(`[Retry] ❌ ${context} failed with unknown error (${status}) - not retrying`)
        throw error
      }
      
      if (attempt < maxRetries) {
        // Calculate exponential backoff: 1s, 2s, 4s
        const backoffMs = Math.pow(2, attempt - 1) * 1000
        console.warn(`[Retry] ⚠️  ${context} failed (attempt ${attempt}/${maxRetries}, status: ${status || 'unknown'}) - retrying in ${backoffMs}ms...`)
        await new Promise(resolve => setTimeout(resolve, backoffMs))
      } else {
        // All retries exhausted
        console.error(`[Retry] ❌ ${context} failed after ${maxRetries} attempts (last status: ${lastStatus || 'unknown'})`)
        throw error
      }
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw lastError || new Error(`${context} failed after ${maxRetries} attempts`)
}

/**
 * Generate Master Character Illustration
 * NEW: 18 Ocak 2026 - Canonical reference image for character consistency
 * Creates a neutral, front-facing portrait from character photos
 * UPDATED: 18 Ocak 2026 - Each character gets its own master illustration
 */
async function generateMasterCharacterIllustration(
  characterPhoto: string,
  characterDescription: any,
  characterId: string,
  illustrationStyle: string,
  userId: string,
  includeAge: boolean = true,
  characterGender?: 'boy' | 'girl' | 'other',
  storyClothing?: string, // Hikayeden gelen kıyafet – master bu kıyafetle çizilir (referans sadece yüz/vücut)
  debugTracePush?: (entry: DebugTraceEntry) => void,
  debugStep?: string
): Promise<string> {
  const fixedDescription = {
    ...characterDescription,
    gender: characterGender || characterDescription?.gender || 'boy',
  }
  const characterPrompt = buildCharacterPrompt(fixedDescription, includeAge, true)
  const styleDirective = illustrationStyle === '3d_animation' ? 'Pixar-style 3D' : illustrationStyle === 'watercolor' ? 'Watercolor' : illustrationStyle

  // Master kıyafeti: hikayeden geliyorsa onu kullan, yoksa referans fotoğraftan
  const outfitPart = storyClothing?.trim()
    ? `Character wearing exactly: ${storyClothing}. `
    : ''
  // [A9] Layout-safe master: karakter küçük (config: masterLayout.characterScaleMin/Max), bol boşluk; PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md §9.4
  const layoutSafeDirectives = getLayoutSafeMasterDirectives()
  const masterPrompt = [
    '[ANATOMY] 5 fingers each hand separated, arms at sides, 2 arms 2 legs, symmetrical face (2 eyes 1 nose 1 mouth) [/ANATOMY]',
    `[STYLE] ${styleDirective} [/STYLE]`,
    '[EXPRESSION] Neutral or gentle facial expression, closed mouth or soft closed-mouth smile, calm and relaxed face. Not a big open-mouthed smile. [/EXPRESSION]',
    `Full body, standing, feet visible, neutral pose. Child from head to toe. ${characterPrompt}. ${outfitPart}Plain neutral background. Illustration style (NOT photorealistic). Match reference photos for face and body.`,
    layoutSafeDirectives,
  ].join(' ')

  const masterRequestRaw = {
    model: 'gpt-image-1.5',
    prompt: masterPrompt,
    size: '1024x1536',
    quality: 'low',
    input_fidelity: 'high',
    image: '(FormData Blob)',
  }
  console.log('[Create Book] 📤 MASTER REQUEST sent (model, prompt length:', masterPrompt.length, ')')
  stopAfter('master_request')

  // Get character photo as buffer with correct image type (OpenAI accepts only image/jpeg, image/png, image/webp)
  let refImageBuffer: Buffer
  let imageMime: string
  const imageResponse = await fetch(characterPhoto)
  const contentType = imageResponse.headers.get('content-type') || ''
  const isImage = /^image\/(jpeg|png|webp)/i.test(contentType)
  if (isImage) {
    const arrBuf = await imageResponse.arrayBuffer()
    refImageBuffer = Buffer.from(arrBuf)
    imageMime = contentType.split(';')[0].trim().toLowerCase() || 'image/png'
  } else {
    // Fetch returned XML (e.g. S3 error) or non-image – get from S3 directly
    try {
      const url = new URL(characterPhoto)
      const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
      const obj = await getObjectBuffer(key)
      if (!obj) throw new Error('S3 object not found')
      refImageBuffer = obj.buffer
      imageMime = /^image\/(jpeg|png|webp)/i.test(obj.contentType) ? obj.contentType.split(';')[0].trim() : 'image/png'
    } catch (e) {
      throw new Error(`Referans fotoğraf yüklenemedi (fetch: ${contentType?.slice(0, 30) || 'unknown'}). S3 erişimini kontrol edin.`)
    }
  }
  const imageBlob = new Blob([new Uint8Array(refImageBuffer)], { type: imageMime })
  const ext = imageMime.includes('jpeg') ? 'jpg' : imageMime.includes('webp') ? 'webp' : 'png'

  // Prepare FormData
  const formData = new FormData()
  formData.append('model', 'gpt-image-1.5')
  formData.append('prompt', masterPrompt)
  formData.append('size', '1024x1536')
  formData.append('quality', 'low')
  formData.append('input_fidelity', 'high')
  formData.append('image[]', imageBlob, `character.${ext}`)
  
  // Call /v1/images/edits API
  const apiKey = process.env.OPENAI_API_KEY
  const response = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData,
  })
  
  if (!response.ok) {
    const errorBody = await response.text()
    let errorMessage = `Master illustration generation failed: ${response.status}`
    try {
      const errJson = JSON.parse(errorBody)
      if (errJson?.error?.message) errorMessage += ` - ${errJson.error.message}`
      else if (errorBody.length < 500) errorMessage += ` - ${errorBody}`
    } catch {
      if (errorBody.length < 300) errorMessage += ` - ${errorBody}`
    }
    console.error('[Create Book] ❌ Master illustration API error:', errorMessage)
    throw new Error(errorMessage)
  }
  
  const result = await response.json()
  const b64Image = result.data?.[0]?.b64_json

  if (!b64Image) {
    throw new Error('No image data in master illustration response')
  }

  console.log('[Create Book] 📥 MASTER RESPONSE received (image data present)')
  stopAfter('master_response')

  // Upload to S3 with character ID in filename
  const masterImageBuffer = Buffer.from(b64Image, 'base64')
  const timestamp = Date.now()
  const filename = `${userId}/masters/master_${characterId}_${timestamp}.png`
  const s3Key = await uploadFile('books', filename, masterImageBuffer, 'image/png')
  const masterUrl = getPublicUrl(s3Key)

  if (debugTracePush) {
    debugTracePush({
      step: debugStep || `master_character_${characterId}`,
      request: { model: 'gpt-image-1.5', prompt: masterPrompt, size: '1024x1536', quality: 'low', characterId },
      response: { url: masterUrl, b64Length: (b64Image as string).length, rawResponse: result },
    })
  }
  return masterUrl
}

/**
 * Generate Master Illustration for Supporting Entity (Animal/Object)
 * NEW: 31 Ocak 2026 - Master-For-All-Entities
 * Creates master illustration for animals and objects WITHOUT reference photo
 * Uses text-only prompt generation
 */
async function generateSupportingEntityMaster(
  entityId: string,
  entityType: 'animal' | 'object',
  entityName: string,
  entityDescription: string,
  illustrationStyle: string,
  userId: string,
  debugTracePush?: (entry: DebugTraceEntry) => void,
  debugStep?: string
): Promise<string> {
  // Build prompt for entity master (text-only, no reference photo)
  // GPT sinematik kalite: aynı STYLE_CORE + CINEMATIC_PACK ile kitap bütünlüğü (7 Şubat 2026)
  const styleDirective = getStyleDescription(illustrationStyle)
  const cinematicPack = getCinematicPack()
  const entityPrompt = [
    `[STYLE] ${styleDirective} [/STYLE]`,
    `[CINEMATIC] ${cinematicPack}. Consistent lighting and material with the book style. [/CINEMATIC]`,
    `Neutral front-facing view. ${entityDescription}.`,
    `Plain neutral background. Illustration style (NOT photorealistic).`,
    entityType === 'animal' ? 'Friendly and appealing animal character.' : 'Clear and recognizable object.',
    'Centered in frame. Simple, clean, professional children\'s book illustration.',
  ].join(' ')
  
  // Call /v1/images/generations API (text-only; no reference image)
  const apiKey = process.env.OPENAI_API_KEY
  // gpt-image-1.5 generations API does not accept response_format; returns b64 by default
  const body = {
    model: 'gpt-image-1.5',
    prompt: entityPrompt,
    size: '1024x1536' as const,
    quality: 'low' as const,
  }
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Entity master generation failed: ${response.status}${errText ? ` - ${errText.slice(0, 150)}` : ''}`)
  }

  const result = await response.json()
  const b64Image = result.data?.[0]?.b64_json
  if (!b64Image || typeof b64Image !== 'string') {
    throw new Error('No b64_json in entity master response. API may require response_format.')
  }

  const imageBuffer = Buffer.from(b64Image, 'base64')
  const timestamp = Date.now()
  const filename = `${userId}/entity-masters/entity_master_${entityId}_${timestamp}.png`
  const s3Key = await uploadFile('books', filename, imageBuffer, 'image/png')
  const entityUrl = getPublicUrl(s3Key)
  if (debugTracePush) {
    debugTracePush({
      step: debugStep || `entity_master_${entityName}`,
      request: { model: 'gpt-image-1.5', prompt: entityPrompt, size: '1024x1536', entityId, entityType, entityName },
      response: { url: entityUrl, b64Length: (b64Image as string).length, rawResponse: result },
    })
  }
  return entityUrl
}

/**
 * Detect which characters appear in page text
 * UPDATED: 18 Ocak 2026 - Used to select only relevant character masters for each page
 */
// ============================================================================
// Character Detection Helper (for page-level character tracking)
// ============================================================================

function detectCharactersInPageText(
  pageText: string,
  characters: Array<{ id: string; name: string }>
): string[] {
  const foundCharacterIds: string[] = []
  const lowerText = pageText.toLowerCase()
  
  for (const char of characters) {
    const charName = char.name.toLowerCase()
    if (lowerText.includes(charName)) {
      foundCharacterIds.push(char.id)
    }
  }
  
  // Eğer hiç karakter bulunamazsa, ana karakteri kullan (güvenli fallback)
  return foundCharacterIds.length > 0 ? foundCharacterIds : [characters[0].id]
}

/**
 * Retry wrapper specifically for fetch calls
 */
async function retryFetch(
  url: string,
  options: RequestInit,
  maxRetries: number = 3,
  context: string = 'API call'
): Promise<Response> {
  return retryWithBackoff(async () => {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      const status = response.status
      
      if (isPermanentError(status)) {
        // Permanent error - throw immediately
        const errorText = await response.text()
        const error = new Error(`API call failed with permanent error: ${status} - ${errorText}`) as any
        error.status = status
        error.response = response
        throw error
      }
      
      if (isRetryableError(status)) {
        // Retryable error - throw to trigger retry
        const errorText = await response.text()
        const error = new Error(`API call failed with retryable error: ${status} - ${errorText}`) as any
        error.status = status
        error.response = response
        throw error
      }
      
      // Unknown error - throw
      const errorText = await response.text()
      const error = new Error(`API call failed: ${status} - ${errorText}`) as any
      error.status = status
      error.response = response
      throw error
    }
    
    return response
  }, maxRetries, context)
}

export interface CreateBookRequest {
  characterId?: string // Backward compatibility: single character (optional)
  characterIds?: string[] // NEW: Multiple characters support (optional)
  theme: string
  illustrationStyle: string
  customRequests?: string
  pageCount?: number // Debug: Optional page count override (3-20)
  language?: 'en' | 'tr' | 'de' | 'fr' | 'es' | 'zh' | 'pt' | 'ru'
  storyModel?: string // Story generation model (default: 'gpt-4o-mini')
  /** When true, create book without payment. Only allowed when DEBUG_SKIP_PAYMENT or user is admin + skipPaymentForCreateBook. */
  skipPayment?: boolean
  /** Create from example: use example book's story_data and images; only swap character via edits (image[] = [exampleImage, master]). */
  fromExampleId?: string
  /** When true, mark created book as public example (admin only; see step6 "Create example book"). */
  isExample?: boolean
  /** Debug: run pipeline up to this step then return result without keeping book (admin + showDebugQualityButtons). */
  debugRunUpTo?: 'masters' | 'cover'
  /** Debug: collect full raw request/response for every step (story, masters, cover, pages); admin + showDebugQualityButtons. */
  debugTrace?: boolean
  // NOTE: imageModel and imageSize removed - now hardcoded to gpt-image-1.5 / 1024x1536 / low
}

/** One entry per step when debugTrace is true (docs/analysis/DEBUG_QUALITY_BUTTONS_PLAN.md §10) */
export type DebugTraceEntry = { step: string; request: unknown; response: unknown }

export interface CreateBookResponse {
  id: string
  title: string
  status: 'draft' | 'generating' | 'completed' | 'failed'
  totalPages: number
  theme: string
  illustrationStyle: string
  character: {
    id: string
    name: string
  }
  generationTime: number
  tokensUsed: number
  story_data?: any
}

// ============================================================================
// POST /api/books - Create new book and generate story
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const user = await requireUser()

    // Parse & Validate Request
    const body: CreateBookRequest = await request.json()
    const {
      characterId, // Backward compatibility
      characterIds, // NEW: Multiple characters
      theme,
      illustrationStyle,
      customRequests,
      pageCount, // Debug: Optional page count override (0 or undefined = cover only)
      language = 'en',
      storyModel = 'gpt-4o-mini', // Default: GPT-4o Mini (Önerilen)
      skipPayment,
      fromExampleId, // Create from example: same story/scenes, only character swap via edits
      isExample, // Mark as public example (admin only; step6 "Create example book")
      debugRunUpTo, // Debug: run up to step then return (admin + showDebugQualityButtons)
      debugTrace: debugTraceRequested, // Debug: full raw request/response per step (admin + flag)
    } = body

    // Skip-payment: only when DEBUG or admin + flag (see docs/strategies/DEBUG_AND_FEATURE_FLAGS_ANALYSIS.md)
    if (skipPayment === true) {
      const debugSkip = process.env.DEBUG_SKIP_PAYMENT === 'true'
      const role = await getUserRole(user.id)
      const isAdmin = role === 'admin'
      const flagOn = appConfig.features.dev.skipPaymentForCreateBook
      const canSkip = debugSkip || (isAdmin && flagOn)
      if (!canSkip) {
        return CommonErrors.forbidden('Skip payment is not allowed for this user')
      }
    }

    // Debug run-up-to: admin + showDebugQualityButtons only (docs/analysis/DEBUG_QUALITY_BUTTONS_PLAN.md §9)
    const isDebugCoverMode = debugRunUpTo === 'cover'
    const isDebugMastersMode = debugRunUpTo === 'masters'
    if (debugRunUpTo) {
      if (debugRunUpTo !== 'cover' && debugRunUpTo !== 'masters') {
        return CommonErrors.badRequest('debugRunUpTo only supports "masters" or "cover"')
      }
      const role = await getUserRole(user.id)
      const isAdmin = role === 'admin'
      const flagOn = appConfig.features.dev.showDebugQualityButtons
      if (!isAdmin || !flagOn) {
        return CommonErrors.forbidden('Debug run-up-to is only allowed for admin with showDebugQualityButtons')
      }
    }

    // Debug trace: collect full raw request/response for every step (docs/analysis/DEBUG_QUALITY_BUTTONS_PLAN.md §10)
    let debugTrace: DebugTraceEntry[] | null = null
    if (debugTraceRequested === true) {
      const role = await getUserRole(user.id)
      const isAdmin = role === 'admin'
      const flagOn = appConfig.features.dev.showDebugQualityButtons
      if (isAdmin && flagOn) debugTrace = []
    }

    // Image generation defaults (hardcoded - no override)
    const imageModel = 'gpt-image-1.5'
    const imageSize = '1024x1536' // Portrait orientation
    const imageQuality = 'low'

    const themeKey = normalizeThemeKey(theme)

    if (!fromExampleId && (!themeKey || !illustrationStyle)) {
      return CommonErrors.badRequest(
        'theme and illustrationStyle are required'
      )
    }

    // Get Characters (NEW: Support both single and multiple characters)
    let characters: any[] = []
    
    if (characterIds && characterIds.length > 0) {
      // NEW: Multiple characters
      for (const charId of characterIds) {
        const { data: char, error: charError } = await getCharacterById( charId)
        
        if (charError || !char) {
          return CommonErrors.notFound(`Character ${charId}`)
        }
        
        // Verify ownership
        if (char.user_id !== user.id) {
          return CommonErrors.forbidden('You do not own this character')
        }
        
        characters.push(char)
      }
    } else if (characterId) {
      // Backward compatibility: Single character
      const { data: char, error: charError } = await getCharacterById( characterId)
      
      if (charError || !char) {
        return CommonErrors.notFound('Character')
      }
      
      // Verify ownership
      if (char.user_id !== user.id) {
        return CommonErrors.forbidden('You do not own this character')
      }
      
      characters.push(char)
    } else {
      return CommonErrors.badRequest('characterId or characterIds is required')
    }

    // Main character (first character)
    const character = characters[0]

    // ====================================================================
    // DETERMINE MODE: Cover Only, From Example, Full Book, or Debug (run up to masters/cover)
    // ====================================================================
    const isDebugRunUpTo = isDebugCoverMode || isDebugMastersMode
    const isCoverOnlyMode = !isDebugRunUpTo && !fromExampleId && (!pageCount || pageCount === 0)
    const isFromExampleMode = !isDebugRunUpTo && !!fromExampleId
    // Debug: force full book path (story → masters [→ cover]) then return without keeping book
    const effectivePageCount = isDebugRunUpTo ? (pageCount || 5) : pageCount

    console.log(`[Create Book] 📋 Mode: ${isDebugMastersMode ? 'Debug (run up to masters)' : isDebugCoverMode ? 'Debug (run up to cover)' : isCoverOnlyMode ? 'Cover Only' : isFromExampleMode ? 'From Example' : 'Full Book'} (pageCount: ${effectivePageCount ?? 'undefined'}, fromExampleId: ${fromExampleId || 'none'})`)
    console.log(`[Create Book] 🎯 Theme: ${themeKey}`)

    let storyData: any = null
    let completion: any = null
    let book: any = null
    let exampleBook: any = null
    let masterIllustrations: Record<string, string> = {}
    let entityMasterIllustrations: Record<string, string> = {}

    // ====================================================================
    // FROM EXAMPLE MODE: Use example book's story_data and images; swap character via edits
    // ====================================================================
    if (isFromExampleMode) {
      const { data: exBook, error: exErr } = await getBookById( fromExampleId!)
      if (exErr || !exBook) {
        return CommonErrors.notFound('Example book not found')
      }
      if ((exBook as any).is_example !== true) {
        return CommonErrors.forbidden('Book is not an example book')
      }
      if (exBook.status !== 'completed') {
        return CommonErrors.badRequest('Example book is not completed')
      }
      exampleBook = exBook
      storyData = JSON.parse(JSON.stringify(exBook.story_data))
      if (!storyData?.pages?.length) {
        return CommonErrors.badRequest('Example book has no story data')
      }
      const fromExampleCharIds = characterIds ?? characters.map((c: { id: string }) => c.id)
      // Replace example character name(s) with user's character name(s) in story text and title
      const exPages = storyData.pages || []
      const exampleCharOrder: string[] = []
      const seen = new Set<string>()
      for (const p of exPages) {
        const ids = (p as any).characterIds || []
        for (const id of ids) {
          if (!seen.has(id)) {
            seen.add(id)
            exampleCharOrder.push(id)
          }
        }
      }
      if (exampleCharOrder.length > 0 && fromExampleCharIds.length > 0) {
        const oldNames = await Promise.all(
          exampleCharOrder.map((id) => getCharacterById( id).then((r) => r.data?.name ?? ''))
        )
        const newNames = await Promise.all(
          fromExampleCharIds.map((id) => getCharacterById( id).then((r) => r.data?.name ?? ''))
        )
        const replaceCount = Math.min(oldNames.length, newNames.length)
        for (let i = 0; i < replaceCount; i++) {
          const oldName = (oldNames[i] || '').trim()
          const newName = (newNames[i] || '').trim()
          if (!oldName || !newName || oldName === newName) continue
          if (storyData.title) storyData.title = (storyData.title as string).split(oldName).join(newName)
          for (const page of storyData.pages || []) {
            if ((page as any).text) (page as any).text = (page as any).text.split(oldName).join(newName)
          }
        }
        console.log('[Create Book] 📝 From-example: replaced character names in story and title')
      }
      // Sayfa görsellerinde master kullanılsın: örnek karakter ID'lerini kullanıcı karakter ID'leri ile eşleştir (aynı sıra).
      const charIdMapCount = Math.min(exampleCharOrder.length, fromExampleCharIds.length)
      if (charIdMapCount > 0) {
        for (const page of storyData.pages || []) {
          const ids = (page as any).characterIds as string[] | undefined
          if (!ids?.length) continue
          ;(page as any).characterIds = ids.map((id: string) => {
            const idx = exampleCharOrder.indexOf(id)
            return idx >= 0 && idx < fromExampleCharIds.length ? fromExampleCharIds[idx]! : id
          })
        }
        console.log('[Create Book] 📝 From-example: replaced characterIds in pages for master lookup')
      }
      const exTheme = normalizeThemeKey(exBook.theme)
      const exTitle = storyData.title || exBook.title
      const { data: createdBook, error: bookError } = await createBook(user.id, {
        character_id: character.id,
        title: exTitle,
        theme: exTheme,
        illustration_style: exBook.illustration_style || illustrationStyle,
        language: exBook.language || language,
        age_group: exBook.age_group || 'preschool',
        total_pages: storyData.pages.length,
        story_data: storyData,
        status: 'draft',
        custom_requests: '',
        images_data: [],
        generation_metadata: {
          imageModel: imageModel,
          imageSize: imageSize,
          mode: 'from-example',
          fromExampleId: fromExampleId,
          characterIds: characters.map(c => c.id),
        },
      })
      if (bookError || !createdBook) {
        console.error('[Create Book] from-example createBook error:', bookError)
        throw new Error('Failed to create book from example')
      }
      book = createdBook
      console.log(`[Create Book] ✅ Book created from example: ${book.id}`)
    }
    // ====================================================================
    // COVER ONLY MODE: Skip story generation
    // ====================================================================
    else if (isCoverOnlyMode) {
      console.log('[Create Book] ⏭️  Skipping story generation (cover only mode)')
      console.log('[Create Book] 📝 Creating book with minimal data...')

      // Create book with minimal data (no story, just metadata)
      // Use default title format (POC style - customRequests is used in story generation, not as title)
      const bookTitle = `${character.name}'s ${themeKey.charAt(0).toUpperCase() + themeKey.slice(1)} Adventure`
      
      console.log('[Create Book] 📝 Book title (default format):', bookTitle)
      console.log('[Create Book] ℹ️  Note: customRequests will be used in story generation prompt (not as title)')
      
      const { data: createdBook, error: bookError } = await createBook(user.id, {
        character_id: character.id, // Main character ID (backward compatibility)
        title: bookTitle,
        theme: themeKey,
        illustration_style: illustrationStyle,
        language,
        age_group: 'preschool', // Default for cover only
        total_pages: 0, // Cover only = 0 pages
        story_data: null, // No story in cover only mode
        status: 'draft', // Will be updated after cover generation
        custom_requests: customRequests,
        images_data: [], // No page images in cover only mode
        ...(isExample === true && { is_example: true }), // Admin "Create example book" (step6)
        generation_metadata: {
          model: storyModel,
          imageModel: imageModel,
          imageSize: imageSize,
          promptVersion: '1.0.0',
          tokensUsed: 0, // No story generation
          generationTime: 0,
          mode: 'cover-only',
          // NEW: Multiple characters support
          characterIds: characters.map(c => c.id),
          additionalCharacters: characters.slice(1).map(c => c.character_type || {
            group: "Child",
            value: "Child",
            displayName: c.name,
          }),
        },
      })

      if (bookError || !createdBook) {
        console.error('Database error:', bookError)
        throw new Error('Failed to save book to database')
      }

      book = createdBook
      console.log(`[Create Book] ✅ Book created: ${book.id} (cover only)`)
    }
    // ====================================================================
    // FULL BOOK MODE: Generate story
    // ====================================================================
    else {
      console.log('[Create Book] 📖 Starting story generation...')

      // Generate Story Prompt (NEW: Multiple characters support)
      const storyPrompt = generateStoryPrompt({
        characterName: character.name,
        characterAge: character.age,
        characterGender: character.gender,
        theme: themeKey,
        illustrationStyle,
        customRequests,
        pageCount: effectivePageCount, // Debug: Optional page count override; debug cover mode uses 5 if not set
        referencePhotoAnalysis: {
          detectedFeatures: character.description.physicalFeatures || {},
          finalDescription: character.description,
          confidence: character.analysis_confidence || 0.8,
        },
        language,
        // NEW: Multiple characters support
        characters: characters.map((char, index) => ({
          id: char.id,
          name: char.name,
          type: char.character_type || {
            group: "Child",
            value: "Child",
            displayName: char.name,
          },
          characterId: char.id,
        })),
      })

      const languageNames: Record<string, string> = {
        en: 'English',
        tr: 'Turkish',
        de: 'German',
        fr: 'French',
        es: 'Spanish',
        zh: 'Chinese (Mandarin)',
        pt: 'Portuguese',
        ru: 'Russian',
      }
      const languageName = languageNames[language] || 'English'
      const storyRequestBody = {
        model: storyModel,
        messages: [
          {
            role: 'system' as const,
            content:
              `You are a professional children's book author. Create engaging, age-appropriate stories with detailed image prompts. Return exactly the requested number of pages. Write the entire story in ${languageName} only; do not use words from other languages.`,
          },
          { role: 'user' as const, content: storyPrompt },
        ],
        response_format: { type: 'json_object' as const },
        temperature: 0.8,
        max_tokens: 8000, // 12+ sayfa için güvenli; limitin üzerinde kalması sorun değil
      }
      console.log('[Create Book] 📤 STORY REQUEST sent (model:', storyModel, ', prompt length:', storyPrompt.length, ')')
      stopAfter('story_request')

      console.log(`[Create Book] 🤖 Calling OpenAI for story generation (model: ${storyModel})`)
      console.log('[Create Book] ⏱️  Story request started at:', new Date().toISOString())
      
      // Retry mechanism for story generation (max 3 attempts)
      const MAX_RETRIES = 3
      // IMPORTANT: do NOT shadow the outer "storyData" variable (used later for image generation)
      let generatedStoryData: any = null
      let lastError: Error | null = null
      
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const storyReqStart = Date.now()

          completion = await openai.chat.completions.create(storyRequestBody)
          const storyReqMs = Date.now() - storyReqStart
          console.log(`[Create Book] ⏱️  Story response time (attempt ${attempt}/${MAX_RETRIES}):`, storyReqMs, 'ms')

          const storyContent = completion.choices[0].message.content
          if (!storyContent) {
            throw new Error('No story content generated')
          }

          generatedStoryData = JSON.parse(storyContent)
          console.log('[Create Book] 📥 STORY RESPONSE received (title:', generatedStoryData?.title, ', pages:', generatedStoryData?.pages?.length, ')')
          stopAfter('story_response')

          // Validate Story Structure
          if (!generatedStoryData.title || !generatedStoryData.pages || !Array.isArray(generatedStoryData.pages)) {
            throw new Error('Invalid story structure from AI')
          }

          // Validate characterIds field in each page (REQUIRED)
          for (const page of generatedStoryData.pages) {
            if (!page.characterIds || !Array.isArray(page.characterIds) || page.characterIds.length === 0) {
              throw new Error(`Page ${page.pageNumber} is missing required "characterIds" field`)
            }
          }

          // Sıra 17: suggestedOutfits REQUIRED – one key per character ID (PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md)
          const suggestedOutfits = generatedStoryData.suggestedOutfits
          if (!suggestedOutfits || typeof suggestedOutfits !== 'object') {
            throw new Error('Story is missing required "suggestedOutfits" object')
          }
          for (const char of characters) {
            const outfit = suggestedOutfits[char.id]
            if (typeof outfit !== 'string' || !outfit.trim()) {
              throw new Error(`suggestedOutfits is missing or empty for character ${char.id} (${char.name})`)
            }
          }

          // Sıra 17: characterExpressions REQUIRED per page – one key per character in that page (PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md)
          for (const page of generatedStoryData.pages) {
            const exp = page.characterExpressions
            if (!exp || typeof exp !== 'object') {
              throw new Error(`Page ${page.pageNumber} is missing required "characterExpressions" object`)
            }
            for (const charId of page.characterIds || []) {
              const desc = exp[charId]
              if (typeof desc !== 'string' || !desc.trim()) {
                throw new Error(`Page ${page.pageNumber} characterExpressions is missing or empty for character ${charId}`)
              }
            }
          }

          // Debug trace: full raw story request/response (before trim so you see what API actually returned)
          if (debugTrace) {
            debugTrace.push({
              step: 'story',
              request: {
                model: storyModel,
                effectivePageCount,
                systemMessage: storyRequestBody.messages[0].content,
                userPromptLength: storyPrompt.length,
                userPrompt: storyPrompt,
                fullRequestBody: storyRequestBody,
              },
              response: {
                rawContent: storyContent,
                parsed: generatedStoryData,
                pagesCount: generatedStoryData.pages?.length,
                usage: completion?.usage,
              },
            })
          }

          // v1.6.0: "clothing" field REMOVED from story schema – visual details from master system only; no validation for clothing

          // Enforce requested pageCount strictly
          if (effectivePageCount !== undefined && effectivePageCount !== null) {
            const requestedPages = Number(effectivePageCount)
            const returnedPages = generatedStoryData.pages.length

            console.log(`[Create Book] 📏 Requested pages: ${requestedPages}, AI returned: ${returnedPages} (attempt ${attempt}/${MAX_RETRIES})`)

            if (returnedPages > requestedPages) {
              console.warn(`[Create Book] ⚠️  AI returned more pages than requested. Trimming to ${requestedPages} pages.`)
              generatedStoryData.pages = generatedStoryData.pages.slice(0, requestedPages)
              break // Success - exit retry loop
            } else if (returnedPages < requestedPages) {
              const errorMsg = `AI returned fewer pages than requested (${returnedPages}/${requestedPages})`
              console.error(`[Create Book] ❌ ${errorMsg} (attempt ${attempt}/${MAX_RETRIES})`)
              
              if (attempt < MAX_RETRIES) {
                console.log(`[Create Book] 🔄 Retrying story generation...`)
                lastError = new Error(errorMsg)
                continue // Retry
              } else {
                // Last attempt failed
                throw new Error(`${errorMsg} after ${MAX_RETRIES} attempts`)
              }
            } else {
              // Exact match - success!
              break // Success - exit retry loop
            }
          } else {
            // No page count specified - accept whatever AI returns
            break // Success - exit retry loop
          }
        } catch (error: any) {
          lastError = error
          // STOP_AFTER is intentional – do not retry, just rethrow
          if (error?.message?.startsWith?.('STOP_AFTER')) {
            throw error
          }
          console.log(`[Create Book] 📥 STORY RESPONSE: err, message=${(error?.message || '').slice(0, 120)}`)
          console.error(`[Create Book] ❌ Story generation attempt ${attempt}/${MAX_RETRIES} failed:`, error.message)
          
          if (attempt < MAX_RETRIES) {
            console.log(`[Create Book] 🔄 Retrying story generation...`)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
          } else {
            throw error
          }
        }
      }
      
      if (!generatedStoryData) {
        throw lastError || new Error('Failed to generate story after all retries')
      }

      // Renumber pages consistently (1..N)
      generatedStoryData.pages = generatedStoryData.pages.map((page: any, idx: number) => ({
        ...page,
        pageNumber: idx + 1,
      }))

      // Assign to outer variable for downstream steps (cover + page image generation)
      storyData = generatedStoryData

      // Sıra 17: Kelime sayısı kontrolü ve gerekirse kısa repair (PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md)
      const ageGroupForWordCount = storyData?.metadata?.ageGroup || 'preschool'
      const wordMin = getWordCountMin(ageGroupForWordCount)
      const wordCounts = storyData.pages.map((page: any, index: number) => {
        const text = page.text || ''
        const count = text.trim() ? text.split(/\s+/).length : 0
        return { pageNumber: page.pageNumber ?? index + 1, count, pageIndex: index }
      })
      const shortPages = wordCounts.filter((p: { count: number }) => p.count < wordMin)
      console.log(`[Create Book] 📊 Word count (min ${wordMin}):`, wordCounts.map((p: { pageNumber: number; count: number }) => `p${p.pageNumber}=${p.count}`).join(', '))
      if (shortPages.length > 0) {
        console.warn(`[Create Book] ⚠️ Short pages (below ${wordMin} words):`, shortPages.map((p: { pageNumber: number; count: number }) => `page ${p.pageNumber} (${p.count})`).join(', '))
        try {
          const repairPrompt = `The following story has some pages with too few words. Return ONLY a valid JSON object with key "pages": an array of objects. Each object has "pageNumber" (number) and "text" (string). Include ONLY the pages that need expansion (page numbers: ${shortPages.map((p: { pageNumber: number }) => p.pageNumber).join(', ')}). For each of these pages, rewrite the "text" to be at least ${wordMin} words while keeping the same story event and tone. Use the same language as the original. Do not change other pages.

Original story title: ${storyData.title}
Current short page texts:
${shortPages.map((p: { pageNumber: number; pageIndex: number }) => `Page ${p.pageNumber}: "${(storyData.pages[p.pageIndex].text || '').slice(0, 200)}..."`).join('\n')}

Return JSON: { "pages": [ { "pageNumber": 2, "text": "..." }, ... ] }`

          const repairCompletion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: repairPrompt }],
            response_format: { type: 'json_object' },
            temperature: 0.4,
            max_tokens: 2000,
          })
          const repairContent = repairCompletion.choices[0]?.message?.content
          if (repairContent) {
            const repairData = JSON.parse(repairContent)
            if (Array.isArray(repairData.pages)) {
              for (const item of repairData.pages) {
                const idx = storyData.pages.findIndex((p: any, i: number) => (p.pageNumber ?? i + 1) === item.pageNumber)
                if (idx >= 0 && item.text) {
                  storyData.pages[idx].text = item.text
                  const newCount = item.text.split(/\s+/).length
                  console.log(`[Create Book] 📝 Repair: expanded page ${item.pageNumber} to ${newCount} words`)
                }
              }
            }
          }
        } catch (repairErr: any) {
          console.warn('[Create Book] Word count repair failed (non-fatal):', repairErr?.message || repairErr)
        }
      }

      console.log(`[Create Book] ✅ Story ready: ${storyData.pages.length} pages`)

      // Create Book in Database
      const { data: createdBook, error: bookError } = await createBook(user.id, {
        character_id: character.id, // Main character ID (backward compatibility)
        title: storyData.title,
        theme,
        illustration_style: illustrationStyle,
        language,
        age_group: storyData.metadata?.ageGroup || 'preschool',
        total_pages: storyData.pages.length,
        story_data: storyData,
        status: 'draft', // Story generated, images not yet
        custom_requests: customRequests,
        images_data: [], // Will be populated after image generation
        ...(isExample === true && { is_example: true }), // Admin "Create example book" (step6)
        generation_metadata: {
          model: storyModel,
          imageModel: imageModel,
          imageSize: imageSize,
          promptVersion: '1.0.0',
          tokensUsed: completion.usage?.total_tokens || 0,
          generationTime: Date.now() - startTime,
          mode: 'full-book',
          // NEW: Multiple characters support
          characterIds: characters.map(c => c.id),
          additionalCharacters: characters.slice(1).map(c => c.character_type || {
            group: "Child",
            value: "Child",
            displayName: c.name,
          }),
        },
      })

      if (bookError || !createdBook) {
        console.error('Database error:', bookError)
        throw new Error('Failed to save book to database')
      }

      book = createdBook
      console.log(`[Create Book] ✅ Book created: ${book.id}`)
    }

    // ====================================================================
    // FROM-EXAMPLE: master generation; cover/page use same pipeline below
    // ====================================================================
    if (isFromExampleMode && exampleBook) {
      await updateBook(book.id, { status: 'generating' })

      // Master illustrations (same face on every page)
      const themeClothingForMaster: Record<string, string> = {
        adventure: 'comfortable outdoor clothing, hiking clothes, sneakers (adventure outfit)',
        space: 'child-sized astronaut suit or space exploration outfit',
        underwater: 'swimwear, beach clothes',
        sports: 'sportswear, athletic clothes',
        fantasy: 'fantasy-appropriate casual clothing, adventure-style',
        'daily-life': 'everyday casual clothing',
      }
      const exThemeKey = normalizeThemeKey(exampleBook.theme)
      const themeClothing = themeClothingForMaster[exThemeKey] || 'age-appropriate casual clothing'
      for (const char of characters) {
        if (!char.reference_photo_url) continue
        try {
          const masterUrl = await generateMasterCharacterIllustration(
            char.reference_photo_url,
            char.description,
            char.id,
            exampleBook.illustration_style || illustrationStyle,
            user.id,
            true,
            char.gender,
            themeClothing,
            debugTrace ? (e) => debugTrace!.push(e) : undefined,
            `master_character_${char.name || char.id}`
          )
          masterIllustrations[char.id] = masterUrl
          console.log(`[Create Book] ✅ From-example master for character ${char.id} (${char.name}): ${masterUrl}`)
        } catch (err: any) {
          console.warn(`[Create Book] ⚠️ From-example master failed for ${char.id}, using reference photo:`, err?.message)
        }
      }
      if (Object.keys(masterIllustrations).length > 0) {
        const currentMeta = book.generation_metadata || {}
        await updateBook(book.id, {
          generation_metadata: {
            ...currentMeta,
            masterIllustrations,
            masterIllustrationCreated: true,
          },
        })
        console.log(`[Create Book] 💾 From-example: saved ${Object.keys(masterIllustrations).length} master(s) to generation_metadata`)
      }

      // From-example: entity masters (example'da supportingEntities varsa üret; kapak/sayfa pipeline aynı)
      if (storyData?.supportingEntities && storyData.supportingEntities.length > 0) {
        const exIllustrationStyle = exampleBook.illustration_style || illustrationStyle
        console.log(`[Create Book] 🐾 From-example: generating ${storyData.supportingEntities.length} supporting entity masters...`)
        for (const entity of storyData.supportingEntities) {
          try {
            const entityMasterUrl = await generateSupportingEntityMaster(
              entity.id,
              entity.type,
              entity.name,
              entity.description,
              exIllustrationStyle,
              user.id
            )
            entityMasterIllustrations[entity.id] = entityMasterUrl
            console.log(`[Create Book] ✅ From-example entity master for ${entity.name} (${entity.type}): ${entityMasterUrl}`)
          } catch (err: any) {
            console.warn(`[Create Book] ⚠️ From-example entity master failed for ${entity.name}:`, err?.message)
          }
        }
        if (Object.keys(entityMasterIllustrations).length > 0) {
          const currentMeta = book.generation_metadata || {}
          await updateBook(book.id, {
            generation_metadata: {
              ...currentMeta,
              entityMasterIllustrations,
              entityMasterCreated: true,
            },
          })
          console.log(`[Create Book] 💾 From-example: saved ${Object.keys(entityMasterIllustrations).length} entity master(s) to generation_metadata`)
        }
      }

      console.log(`[Create Book] ✅ From-example: masters ready; cover/page will use pipeline below`)
    }

    // ====================================================================
    // STEP 2: GENERATE MASTER CHARACTER ILLUSTRATION (UPDATED: 18 Ocak 2026)
    // UPDATED: Each character gets its own master illustration
    // Master kıyafeti: tema ile uyumlu (adventure → outdoor gear; story clothing yok artık)
    // ====================================================================
    if (!isFromExampleMode) {
    console.log(`[Create Book] 🎨 Starting master character illustration generation...`)
    
    const themeClothingForMaster: Record<string, string> = {
      adventure: 'comfortable outdoor clothing, hiking clothes, sneakers (adventure outfit)',
      space: 'child-sized astronaut suit or space exploration outfit',
      underwater: 'swimwear, beach clothes',
      sports: 'sportswear, athletic clothes',
      fantasy: 'fantasy-appropriate casual clothing, adventure-style',
      'daily-life': 'everyday casual clothing',
    }
    const themeClothing = themeClothingForMaster[themeKey] || 'age-appropriate casual clothing'
    const suggestedOutfits = storyData?.suggestedOutfits && typeof storyData.suggestedOutfits === 'object' ? storyData.suggestedOutfits as Record<string, string> : null

    // Generate master illustration for each character separately (uses outer masterIllustrations)
    for (const char of characters) {
      if (!char.reference_photo_url) {
        console.log(`[Create Book] ⚠️  Character ${char.id} (${char.name}) has no reference photo - skipping master illustration`)
        continue
      }
      
      // Determine if age should be included in prompt
      const isMainCharacter = char.id === characters[0].id
      let includeAge: boolean
      
      if (isMainCharacter) {
        // Ana karakter: Her zaman yaş dahil (Step 1'de zaten var)
        includeAge = true
      } else {
        // Ek karakterler:
        // Sadece Child type + yaş varsa yaş dahil et
        const isChildType = char.character_type?.group === 'Child' || char.character_type?.value === 'Child'
        const hasAge = char.description?.age && char.description.age > 0
        includeAge = isChildType && hasAge
      }
      
      // Her karakter için kıyafet: sadece suggestedOutfits[char.id]; yoksa tema (tek outfit tüm karakterlere uygulanmaz)
      const charOutfit = (suggestedOutfits?.[char.id]?.trim()) || themeClothing
      if (suggestedOutfits?.[char.id]) {
        console.log(`[Create Book] 👕 Master clothing for ${char.name} from story (suggestedOutfits):`, charOutfit.slice(0, 60) + (charOutfit.length > 60 ? '...' : ''))
      }

      try {
        // FIX: Pass char.gender to ensure correct gender is used (25 Ocak 2026)
        const masterUrl = await generateMasterCharacterIllustration(
          char.reference_photo_url,
          char.description,
          char.id,
          illustrationStyle,
          user.id,
          includeAge,
          char.gender,
          charOutfit,
          debugTrace ? (e) => debugTrace!.push(e) : undefined,
          `master_character_${char.name || char.id}`
        )
        masterIllustrations[char.id] = masterUrl
        console.log(`[Create Book] ✅ Master illustration created for character ${char.id} (${char.name}): ${masterUrl}`)
      } catch (error: any) {
        // STOP_AFTER is intentional – do not continue, rethrow so request stops
        if (error?.message?.startsWith?.('STOP_AFTER')) {
          throw error
        }
        console.error(`[Create Book] ❌ Master illustration generation failed for character ${char.id} (${char.name}):`, error)
        // Continue with other characters - this character will use original photo as fallback
      }
    }
    
    // Update generation_metadata with master illustrations map
    if (Object.keys(masterIllustrations).length > 0) {
      const currentMetadata = book.generation_metadata || {}
      await updateBook(book.id, {
        generation_metadata: {
          ...currentMetadata,
          masterIllustrations: masterIllustrations,
          masterIllustrationCreated: true,
        },
      })
      console.log(`[Create Book] 💾 Master illustrations saved to generation_metadata (${Object.keys(masterIllustrations).length} characters)`)
    } else {
      console.log('[Create Book] ⚠️  No master illustrations created - all characters will use original photos')
      const currentMetadata = book.generation_metadata || {}
      await updateBook(book.id, {
        generation_metadata: {
          ...currentMetadata,
          masterIllustrationCreated: false,
          masterIllustrationError: 'No master illustrations generated for any character',
        },
      })
    }

    // ====================================================================
    // STEP 2.5: GENERATE SUPPORTING ENTITY MASTERS (NEW: 31 Ocak 2026)
    // ====================================================================
    // Generate master illustrations for animals and objects from story (uses outer entityMasterIllustrations)
    if (storyData?.supportingEntities && storyData.supportingEntities.length > 0) {
      console.log(`[Create Book] 🐾 Generating ${storyData.supportingEntities.length} supporting entity masters...`)
      
      for (const entity of storyData.supportingEntities) {
        try {
          const entityMasterUrl = await generateSupportingEntityMaster(
            entity.id,
            entity.type,
            entity.name,
            entity.description,
            illustrationStyle,
            user.id,
            debugTrace ? (e) => debugTrace!.push(e) : undefined,
            `entity_master_${entity.name}`
          )
          entityMasterIllustrations[entity.id] = entityMasterUrl
          console.log(`[Create Book] ✅ Entity master created for ${entity.name} (${entity.type}): ${entityMasterUrl}`)
        } catch (error) {
          console.error(`[Create Book] ❌ Entity master generation failed for ${entity.name}:`, error)
          // Continue with other entities
        }
      }
      
      // Update generation_metadata with entity master illustrations
      if (Object.keys(entityMasterIllustrations).length > 0) {
        const currentMetadata = book.generation_metadata || {}
        await updateBook(book.id, {
          generation_metadata: {
            ...currentMetadata,
            entityMasterIllustrations: entityMasterIllustrations,
            entityMasterCreated: true,
          },
        })
        console.log(`[Create Book] 💾 Entity masters saved to generation_metadata (${Object.keys(entityMasterIllustrations).length} entities)`)
      }
    } else {
      console.log('[Create Book] ℹ️  No supporting entities in story - skipping entity master generation')
    }

    } // end if (!isFromExampleMode) — cover/page below run for both normal and from-example

    // Debug: run up to masters – return result and remove book (kalite/prompt iyileştirme için)
    if (isDebugMastersMode) {
      const { error: delErr } = await deleteBook(book.id)
      if (delErr) console.error('[Create Book] Debug: deleteBook failed', delErr)
      return NextResponse.json({
        success: true,
        debug: true,
        debugRunUpTo: 'masters',
        data: {
          storyData,
          masterIllustrations,
          entityMasterIllustrations: entityMasterIllustrations || {},
        },
        request: {
          characterIds: characterIds ?? (characterId ? [characterId] : []),
          theme: themeKey,
          illustrationStyle,
          language,
          customRequests,
          pageCount: effectivePageCount,
        },
      })
    }

    console.log(`[Create Book] 🎨 Starting cover generation...`)

    // ====================================================================
    // STEP 3: GENERATE COVER IMAGE
    // ====================================================================
    // Store cover image URL for page generation (NEW: 16 Ocak 2026)
    let generatedCoverImageUrl: string | null = null
    
    try {
      // Update status to 'generating'
      await updateBook(book.id, { status: 'generating' })
      console.log(`[Create Book] Status updated to 'generating'`)

      // Build cover generation request using generateFullPagePrompt (POC style)
      // Use story-based summary when storyData exists (full-book); otherwise title + theme + customRequests
      let coverSceneDescription: string
      if (storyData?.pages?.length) {
        const locations = new Set<string>()
        for (const p of storyData.pages) {
          const desc = p.sceneDescription || p.imagePrompt || ''
          const text = p.text || ''
          const extracted = extractSceneElements(desc, text)
          if (extracted.location) locations.add(extracted.location)
        }
        const locationList = [...locations].join(', ')
        const journeyPhrase = locationList
          ? ` Evoke the full journey: ${locationList}. Key story moments and world of the story in one image.`
          : ' Key story moments and world of the story in one image.'
        // A2: customRequests only once (PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md)
        const storyBlock = customRequests && customRequests.trim() ? `Story: ${customRequests}. ` : ''
        const base = `A magical book cover for a children's story titled "${book.title}". ${storyBlock}In a ${themeKey} theme. The main character should be integrated into the scene with an inviting, whimsical background that captures the essence of the story.${journeyPhrase} The composition should be eye-catching and suitable for a children's book cover, with space for title text at the top. Vibrant, warm colors with a sense of wonder and adventure.`
        coverSceneDescription = base
        if (locationList) {
          console.log('[Create Book] 📍 Story-based cover: locations', locationList)
        }
      } else {
        // A2: customRequests only once (PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md)
        const storyBlock = customRequests && customRequests.trim() ? `Story: ${customRequests}. ` : ''
        coverSceneDescription = `A magical book cover for a children's story titled "${book.title}". ${storyBlock}In a ${themeKey} theme. The main character should be integrated into the scene with an inviting, whimsical background that captures the essence of the story. The composition should be eye-catching and suitable for a children's book cover, with space for title text at the top. Vibrant, warm colors with a sense of wonder and adventure.`
      }

      // From-example: örnek kapak görselinden sahne öğelerini (top, tavşan vb.) Vision ile alıp prompt'a ekle
      if (isFromExampleMode && exampleBook?.cover_image_url) {
        const exampleSceneExtra = await describeCoverSceneForPrompt(exampleBook.cover_image_url)
        if (exampleSceneExtra) {
          coverSceneDescription += exampleSceneExtra
          console.log('[Create Book] 📍 From-example: cover prompt enriched with example scene elements')
        }
      }

      console.log('[Create Book] 📝 Cover scene description:', coverSceneDescription.substring(0, 150) + '...')
      if (customRequests && customRequests.trim()) {
        console.log('[Create Book] ✅ Using customRequests in cover scene:', customRequests)
      }

      // Build character prompt (NEW: Multiple characters support)
      const additionalCharacters = characters.slice(1).map((char) => ({
        type: char.character_type || {
          group: "Child",
          value: "Child",
          displayName: char.name,
        },
        description: char.description,
      }))

      // NEW: Use buildMultipleCharactersPrompt if there are additional characters
      // Plan: Kapak/Close-up/Kıyafet - exclude clothing from character prompt (clothing comes from story)
      const characterPrompt = additionalCharacters.length > 0
        ? buildMultipleCharactersPrompt(character.description, additionalCharacters, true) // excludeClothing: true
        : buildCharacterPrompt(character.description, true, true) // includeAge: true, excludeClothing: true
      
      if (additionalCharacters.length > 0) {
        console.log('[Create Book] 👥 Multiple characters detected:', additionalCharacters.length + 1, 'total')
        console.log('[Create Book] 📝 Character prompt includes:', additionalCharacters.map(c => c.type.displayName).join(', '))
      }
      
      // Determine age group (default for cover only mode)
      const ageGroup = isCoverOnlyMode ? 'preschool' : (storyData?.metadata?.ageGroup || 'preschool')
      
      // Plan A: Önce story LLM çıktısındaki coverSetting; yoksa keyword fallback (deriveCoverEnvironmentFromStory). COVER_PATH_FLOWERS_ANALYSIS.md §7
      const coverEnvironment =
        (typeof storyData?.coverSetting === 'string' && storyData.coverSetting.trim())
          ? storyData.coverSetting.trim()
          : (storyData?.pages?.length ? deriveCoverEnvironmentFromStory(customRequests, storyData.pages) : '')
      if (coverEnvironment) {
        console.log('[Create Book] 🌍 Cover environment from story:', coverEnvironment)
      }

      // Kapak/sayfa: Master referans varsa kıyafeti referanstan al (mavi/kırmızı zorlaması yok)
      const useMasterForClothing = Object.keys(masterIllustrations).length > 0
      const coverClothing = useMasterForClothing ? 'match_reference' : undefined // v1.6.0: no clothing from story
      const coverSceneInput = {
        pageNumber: 1,
        sceneDescription: coverSceneDescription,
        theme: themeKey,
        mood: themeKey === 'adventure' ? 'exciting' : themeKey === 'fantasy' ? 'mysterious' : themeKey === 'space' ? 'inspiring' : themeKey === 'sports' ? 'exciting' : 'happy',
        characterAction: characters.length > 1 ? `characters integrated into environment as guides into the world; sense of wonder and adventure` : `character integrated into environment as guide into the world; sense of wonder and adventure`,
        focusPoint: 'balanced' as const,
        ...(coverClothing && { clothing: coverClothing }),
        ...(coverEnvironment && { coverEnvironment }),
      }
      
      // Generate full page prompt using generateFullPagePrompt (POC style - enhanced)
      // NEW: Pass additionalCharactersCount for group composition
      // FIXED (16 Ocak 2026): Add isCover=true parameter for cover-specific prompts
      const textPrompt = generateFullPagePrompt(
        characterPrompt,
        coverSceneInput,
        illustrationStyle,
        ageGroup,
        additionalCharacters.length, // NEW: Additional characters count
        true, // isCover: true (CRITICAL: Cover quality is essential)
        false // useCoverReference: false (no cover yet - this IS the cover)
      )

      console.log('[Create Book] 📤 COVER IMAGE REQUEST: prompt length=', textPrompt.length)
      // Call GPT-image API (text-to-image via /v1/images/generations)
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not configured')
      }

      // A10: Reference image order = [0] character masters, [1..] entity masters (OpenAI: first image preserved best). PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md
      const coverMasterUrls = Object.values(masterIllustrations).filter((url): url is string => Boolean(url))
      const entityMasterUrls = Object.values(entityMasterIllustrations).filter((url): url is string => Boolean(url))
      const allCoverMasters = [...coverMasterUrls, ...entityMasterUrls]

      const referenceImageUrls = allCoverMasters.length > 0
        ? allCoverMasters
        : characters.map((char) => char.reference_photo_url).filter((url): url is string => Boolean(url))
      
      let coverImageUrl: string | null = null
      let coverImageB64: string | null = null
      let coverImageOutputFormat: string | null = null
      let referenceImageBlobCount = 0
      let referenceImageBlobTotalBytes = 0
      let editsApiSuccess = false // Track if edits API was successful

      // Use /v1/images/edits if reference image available, otherwise /v1/images/generations
      if (referenceImageUrls.length > 0) {
        // Convert reference image URLs to Blobs (support both data URL and HTTP URL)
        // Reference images format: Blob (binary data) sent as multipart/form-data
        const imageBlobs: Array<{ blob: Blob; filename: string }> = []
        
        for (let i = 0; i < referenceImageUrls.length; i += 1) {
          const referenceImageUrl = referenceImageUrls[i]
          const imageProcessingStartTime = Date.now()
          
          try {
            if (referenceImageUrl.startsWith('data:')) {
              console.log('[Create Book] 🔄 Processing data URL reference image...')
              // Data URL: extract base64 data
              const base64Data = referenceImageUrl.split(',')[1]
              const binaryData = Buffer.from(base64Data, 'base64')
              const imageBlob = new Blob([binaryData], { type: 'image/png' })
              imageBlobs.push({ blob: imageBlob, filename: `reference_${i + 1}.png` })
              referenceImageBlobCount += 1
              referenceImageBlobTotalBytes += imageBlob.size
              console.log('[Create Book] ✅ Data URL converted to Blob, size:', imageBlob.size, 'bytes')
            } else {
              // HTTP URL: download the image
              console.log('[Create Book] 📥 Downloading reference image from URL...')
              console.log('[Create Book]   URL length:', referenceImageUrl.length, 'chars')
              console.log('[Create Book]   URL preview:', referenceImageUrl.substring(0, 80) + '...')
              const downloadStartTime = Date.now()
              const imageResponse = await fetch(referenceImageUrl)
              const downloadTime = Date.now() - downloadStartTime
              console.log('[Create Book] ⏱️  Download took:', downloadTime, 'ms')
              
              if (!imageResponse.ok) {
                throw new Error(`Failed to download reference image: ${imageResponse.status} ${imageResponse.statusText}`)
              }
              
              const imageBuffer = await imageResponse.arrayBuffer()
              const imageBlob = new Blob([imageBuffer], { type: 'image/png' })
              imageBlobs.push({ blob: imageBlob, filename: `reference_${i + 1}.png` })
              referenceImageBlobCount += 1
              referenceImageBlobTotalBytes += imageBlob.size
              const processingTime = Date.now() - imageProcessingStartTime
              console.log('[Create Book] ✅ Reference image downloaded successfully')
              console.log('[Create Book] 📊 Image blob size:', imageBlob.size, 'bytes')
              console.log('[Create Book] ⏱️  Total processing time:', processingTime, 'ms')
            }
          } catch (imageError) {
            const processingTime = Date.now() - imageProcessingStartTime
            console.error('[Create Book] ❌ Error processing reference image:', imageError)
            console.error('[Create Book] ⏱️  Processing failed after:', processingTime, 'ms')
          }
        }

        if (imageBlobs.length === 0) {
          console.log('[Create Book] ⚠️  No valid reference images processed - falling back to /v1/images/generations')
        }

        // Only use /v1/images/edits if we have at least one valid image blob
        if (imageBlobs.length > 0) {
          console.log('[Create Book] 📦 Preparing FormData for /v1/images/edits API call...')
          const formData = new FormData()
          formData.append('model', imageModel)
          formData.append('prompt', textPrompt)
          formData.append('size', imageSize)
          formData.append('quality', imageQuality)
          formData.append('input_fidelity', 'high') // Anatomik detayları koru
          // Append images as array (image[] format) to support multiple reference images
          imageBlobs.forEach(({ blob, filename }) => {
            formData.append('image[]', blob, filename)
          })
          
          console.log('[Create Book] 📤 FormData prepared:')
          console.log('[Create Book]   - Model:', imageModel)
          console.log('[Create Book]   - Size:', imageSize)
          console.log('[Create Book]   - Quality:', imageQuality)
          console.log('[Create Book]   - Image blobs:', imageBlobs.length)
          console.log('[Create Book]   - Total image bytes:', referenceImageBlobTotalBytes, 'bytes')
          console.log('[Create Book]   - Image format: Blob (multipart/form-data)')
          console.log('[Create Book]   - Prompt included: Yes ✅')
          console.log('[Create Book]   - Reference images included: Yes ✅ (as Blobs)')

          const editsApiStartTime = Date.now()
          console.log('[Create Book] 🚀 Calling /v1/images/edits API...')
          console.log('[Create Book] ⏱️  API call started at:', new Date().toISOString())
          
            try {
            // NEW: Retry mechanism for cover edits API (16 Ocak 2026)
            // Retry on temporary errors (502, 503, 504, 429) - max 3 attempts with exponential backoff
            // NEW (24 Ocak 2026): 400 + moderation_blocked → 1 extra retry (false positive)
            let editsResponse: Response
            try {
              editsResponse = await retryFetch(
                'https://api.openai.com/v1/images/edits',
                {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                  },
                  body: formData,
                },
                3, // max 3 retries
                'Cover edits API'
              )
            } catch (error: any) {
              if (isModerationBlockedError(error)) {
                console.log('[Create Book] Moderation 400 (false positive), retrying once...')
                await new Promise((r) => setTimeout(r, 2000))
                const formData2 = new FormData()
                formData2.append('model', imageModel)
                formData2.append('prompt', textPrompt)
                formData2.append('size', imageSize)
                formData2.append('quality', imageQuality)
                formData2.append('input_fidelity', 'high')
                imageBlobs.forEach(({ blob, filename }) => formData2.append('image[]', blob, filename))
                const res = await fetch('https://api.openai.com/v1/images/edits', {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${apiKey}` },
                  body: formData2,
                })
                if (!res.ok) {
                  const errText = await res.text()
                  const err = new Error(
                    `Cover image generation failed after retries. Status: ${res.status}. ` +
                    `This is a permanent error. Please try creating the book again. ` +
                    `Reference images (character photos) are required for character consistency.`
                  ) as any
                  err.status = res.status
                  throw err
                }
                editsResponse = res
              } else {
                const errorStatus = error.status || 'unknown'
                const errorText = error.message || 'Unknown error'
                console.error('[Create Book] ❌ Cover edits API failed after retries:', {
                  status: errorStatus,
                  error: errorText,
                  isRetryable: errorStatus ? isRetryableError(errorStatus) : false,
                  isPermanent: errorStatus ? isPermanentError(errorStatus) : false
                })
                throw new Error(
                  `Cover image generation failed after retries. ` +
                  `Status: ${errorStatus}. ` +
                  `This is a ${isPermanentError(errorStatus) ? 'permanent' : 'temporary'} error. ` +
                  `Please try creating the book again. ` +
                  `Reference images (character photos) are required for character consistency.`
                )
              }
            }

            // Success - parse response
            const editsApiTime = Date.now() - editsApiStartTime
            console.log('[Create Book] ⏱️  API call completed in:', editsApiTime, 'ms')
            console.log('[Create Book] 📊 Response status:', editsResponse.status, editsResponse.statusText)
            // Avoid logging full headers to keep logs clean (some infra adds verbose headers)
            console.log('[Create Book] 📊 Response content-type:', editsResponse.headers.get('content-type') || 'unknown')

            if (editsResponse.ok) {
              console.log('[Create Book] ✅ Edits API call successful, parsing response...')
              const editsResult = await editsResponse.json()
              console.log('[Create Book] 📦 Response structure:', {
                hasData: !!editsResult.data,
                dataLength: editsResult.data?.length || 0,
                dataType: Array.isArray(editsResult.data) ? 'array' : typeof editsResult.data,
              })
              
              if (editsResult.data && Array.isArray(editsResult.data) && editsResult.data.length > 0) {
                // GPT-image APIs may return either `url` or `b64_json`
                coverImageUrl = editsResult.data[0]?.url || null
                coverImageB64 = editsResult.data[0]?.b64_json || null
                coverImageOutputFormat = editsResult.output_format || null

                console.log('[Create Book] ✅ Edits API response parsed successfully')
                console.log('[Create Book] ✅ Edits response image field:', coverImageUrl ? 'url ✅' : (coverImageB64 ? 'b64_json ✅' : 'missing ❌'))
                
                if (coverImageUrl) {
                  console.log('[Create Book] 🖼️  Cover image URL received (length:', coverImageUrl.length, 'chars)')
                  editsApiSuccess = true
                  console.log('[Create Book] ✅✅✅ /v1/images/edits API SUCCESSFUL - Reference image was used! ✅✅✅')
                }
                if (coverImageB64) {
                  editsApiSuccess = true
                  console.log('[Create Book] ✅✅✅ /v1/images/edits API SUCCESSFUL - Reference image was used! ✅✅✅')
                  console.log('[Create Book] 🔍 CRITICAL: Edits API returned b64_json (not URL) - this is NORMAL and SUCCESSFUL')
                  console.log('[Create Book] 🔍 CRITICAL: Do NOT fallback to generations API - edits API was successful!')
                }
              } else {
                console.error('[Create Book] ❌ Response data is missing or invalid')
                console.error('[Create Book]   Has data:', !!editsResult.data)
                console.error('[Create Book]   Is array:', Array.isArray(editsResult.data))
                console.error('[Create Book]   Array length:', editsResult.data?.length || 0)
                coverImageUrl = null
              }
            }
          } catch (editsError) {
            // This catch block should only handle unexpected errors (not retryable/permanent errors)
            // Retryable/permanent errors are already handled in retryFetch
            const editsApiTime = Date.now() - editsApiStartTime
            console.error('[Create Book] ❌ Unexpected exception during /v1/images/edits API call:')
            console.error('[Create Book]   Error:', editsError)
            console.error('[Create Book]   Error type:', editsError instanceof Error ? editsError.constructor.name : typeof editsError)
            console.error('[Create Book]   Error message:', editsError instanceof Error ? editsError.message : String(editsError))
            console.error('[Create Book]   Error stack:', editsError instanceof Error ? editsError.stack : 'N/A')
            console.error('[Create Book] ⏱️  API call failed after:', editsApiTime, 'ms')
            
            // CRITICAL: Do NOT fallback to generations API - reference images would be lost!
            // Instead, re-throw error so user can retry the book generation
            throw new Error(
              `Cover image generation failed with unexpected error. ` +
              `Please try creating the book again. ` +
              `Reference images (character photos) are required for character consistency.`
            )
          }
        } else {
          console.log('[Create Book] ⚠️  No valid image blob, skipping /v1/images/edits')
        }

        // Fall back to /v1/images/generations ONLY if edits failed AND no image blob
        // CRITICAL: If edits API returned b64_json (even without URL), it was SUCCESSFUL - do NOT fallback!
        // REMOVED: Fallback to /v1/images/generations for cover (16 Ocak 2026)
        // Reason: Generations API doesn't support reference images, which would result in
        // completely unrelated cover image (no character consistency).
        // Instead, if edits API fails after retries, we throw an error so user can retry.
        
        // Only use generations API if NO reference images are available (shouldn't happen in normal flow)
        if (!coverImageUrl && !coverImageB64 && !editsApiSuccess && referenceImageUrls.length === 0) {
          console.warn('[Create Book] ⚠️  No reference images available, using /v1/images/generations (this should not happen in normal flow)')
          console.log('[Create Book] ⚠️  WARNING: Reference image was NOT used - using text-only generation')
          console.log('[Create Book] 📋 Model:', imageModel)
          console.log('[Create Book] 📏 Size:', imageSize)
          console.log('[Create Book] 📝 Prompt length:', textPrompt.length, 'characters')
          
          const generationsApiStartTime = Date.now()
          console.log('[Create Book] 🚀 Calling /v1/images/generations API...')
          console.log('[Create Book] ⏱️  API call started at:', new Date().toISOString())
          
          try {
            const genResponse = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: imageModel,
                prompt: textPrompt,
                n: 1,
                size: imageSize,
                // Note: GPT-image API doesn't support response_format parameter
              }),
            })

            const generationsApiTime = Date.now() - generationsApiStartTime
            console.log('[Create Book] ⏱️  Generations API call completed in:', generationsApiTime, 'ms')
            console.log('[Create Book] 📊 Response status:', genResponse.status, genResponse.statusText)

            if (!genResponse.ok) {
              const errorText = await genResponse.text()
              console.error('[Create Book] ❌ GPT-image generations API error:')
              console.error('[Create Book]   Status:', genResponse.status)
              console.error('[Create Book]   Status Text:', genResponse.statusText)
              console.error('[Create Book]   Error Response:', errorText)
              
              // Try to parse error JSON for better logging
              try {
                const errorJson = JSON.parse(errorText)
                console.error('[Create Book]   Parsed Error:', (errorJson?.error?.message || errorText?.slice(0, 300)))
              } catch {
                console.error('[Create Book]   Raw Error Text:', errorText)
              }
              
              throw new Error(`GPT-image generations API error: ${genResponse.status} - ${errorText}`)
            }

            console.log('[Create Book] ✅ Generations API call successful, parsing response...')
            const genResult = await genResponse.json()
            console.log('[Create Book] 📦 Response structure:', {
              hasData: !!genResult.data,
              dataLength: genResult.data?.length || 0,
              dataType: Array.isArray(genResult.data) ? 'array' : typeof genResult.data,
            })
            
            coverImageUrl = genResult.data?.[0]?.url || null
            console.log('[Create Book] ✅ Cover image URL extracted:', coverImageUrl ? 'Yes ✅' : 'No ❌')
            if (coverImageUrl) {
              console.log('[Create Book] 🖼️  Cover image URL received (length:', coverImageUrl.length, 'chars)')
            } else {
              console.error('[Create Book] ❌ Response data is missing or invalid')
              console.error('[Create Book]   Response has data array:', !!genResult.data && Array.isArray(genResult.data))
              console.error('[Create Book]   Data array length:', genResult.data?.length || 0)
            }
          } catch (genError) {
            const generationsApiTime = Date.now() - generationsApiStartTime
            console.error('[Create Book] ❌ Exception during /v1/images/generations API call:')
            console.error('[Create Book]   Error:', genError)
            console.error('[Create Book]   Error type:', genError instanceof Error ? genError.constructor.name : typeof genError)
            console.error('[Create Book]   Error message:', genError instanceof Error ? genError.message : String(genError))
            console.error('[Create Book]   Error stack:', genError instanceof Error ? genError.stack : 'N/A')
            console.error('[Create Book] ⏱️  API call failed after:', generationsApiTime, 'ms')
            throw genError
          }
        }
      } else {
        // No reference image, use /v1/images/generations directly
        console.log('[Create Book] 🔄 No reference image provided, using /v1/images/generations directly')
        console.log('[Create Book] 📋 Model:', imageModel)
        console.log('[Create Book] 📏 Size:', imageSize)
        console.log('[Create Book] 📝 Prompt length:', textPrompt.length, 'characters')
        
        const generationsApiStartTime = Date.now()
        console.log('[Create Book] 🚀 Calling /v1/images/generations API...')
        console.log('[Create Book] ⏱️  API call started at:', new Date().toISOString())
        
        try {
          const genResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: imageModel,
              prompt: textPrompt,
              n: 1,
              size: imageSize,
            }),
          })

          const generationsApiTime = Date.now() - generationsApiStartTime
          console.log('[Create Book] ⏱️  Generations API call completed in:', generationsApiTime, 'ms')
          console.log('[Create Book] 📊 Response status:', genResponse.status, genResponse.statusText)

          if (!genResponse.ok) {
            const errorText = await genResponse.text()
            console.error('[Create Book] ❌ GPT-image generations API error:')
            console.error('[Create Book]   Status:', genResponse.status)
            console.error('[Create Book]   Status Text:', genResponse.statusText)
            console.error('[Create Book]   Error Response:', errorText)
            throw new Error(`GPT-image generations API error: ${genResponse.status} - ${errorText}`)
          }

          console.log('[Create Book] ✅ Generations API call successful, parsing response...')
            const genResult = await genResponse.json()
            coverImageUrl = genResult.data?.[0]?.url || null
            coverImageB64 = genResult.data?.[0]?.b64_json || null
            coverImageOutputFormat = genResult.output_format || null

            console.log('[Create Book] ✅ Generations response image field:', coverImageUrl ? 'url ✅' : (coverImageB64 ? 'b64_json ✅' : 'missing ❌'))
            if (coverImageUrl) {
              console.log('[Create Book] 🖼️  Cover image URL received (length:', coverImageUrl.length, 'chars)')
            }
            if (coverImageB64) {
            }
        } catch (genError) {
          const generationsApiTime = Date.now() - generationsApiStartTime
          console.error('[Create Book] ❌ Exception during /v1/images/generations API call:')
          console.error('[Create Book]   Error:', genError)
          throw genError
        }
      }

      if (!coverImageUrl && !coverImageB64) {
        console.error('[Create Book] ❌ No cover image URL returned from API')
        console.error('[Create Book] 📊 Summary:')
        console.error('[Create Book]   - Reference image URL:', referenceImageUrls.length > 0 ? 'Provided' : 'Not provided')
        console.error('[Create Book]   - Reference image blob created:', referenceImageBlobCount > 0 ? 'Yes' : 'No')
        console.error('[Create Book]   - Reference image blob size:', referenceImageBlobTotalBytes ?? 'N/A')
        console.error('[Create Book]   - Edits API attempted:', referenceImageUrls.length > 0 ? 'Yes' : 'No')
        console.error('[Create Book]   - Generations API called:', 'Yes')
        console.error('[Create Book]   - Final coverImageUrl:', coverImageUrl ? 'Yes' : 'No')
        console.error('[Create Book]   - Final coverImageB64:', coverImageB64 ? 'Yes' : 'No')
        throw new Error('No cover image URL returned from API')
      }

      console.log('[Create Book] ✅ Cover image generated successfully')
      console.log('[Create Book] 🖼️  Cover image field:', coverImageUrl ? 'url ✅' : 'b64_json ✅')
      if (editsApiSuccess) {
        console.log('[Create Book] ✅✅✅ SUCCESS: Reference image was used via /v1/images/edits API ✅✅✅')
      } else if (referenceImageUrls.length > 0) {
        console.log('[Create Book] ⚠️  WARNING: Reference image(s) were provided but edits API was not used')
      } else {
        console.log('[Create Book] ℹ️  INFO: No reference image provided - used text-only generation')
      }

      // Download and upload to Supabase Storage
      let uploadBytes: ArrayBuffer | Buffer
      let contentType = 'image/png'
      const ext = (coverImageOutputFormat || 'png').toLowerCase()

      if (coverImageUrl) {
        const downloadStart = Date.now()
        console.log('[Create Book] 📥 Downloading cover image from URL for upload...')
        const res = await fetch(coverImageUrl)
        const downloadMs = Date.now() - downloadStart
        console.log('[Create Book] ⏱️  Cover URL download time:', downloadMs, 'ms')
        uploadBytes = await res.arrayBuffer()
      } else {
        // b64_json path
        console.log('[Create Book] 🔄 Converting cover b64_json to bytes for upload...')
        uploadBytes = Buffer.from(coverImageB64 as string, 'base64')
      }

      if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
      if (ext === 'webp') contentType = 'image/webp'

      const fileName = `${user.id}/covers/cover_${Date.now()}.${ext || 'png'}`

      console.log('[Create Book] 📤 Uploading cover to S3...')

      const uploadBuffer = Buffer.isBuffer(uploadBytes) ? uploadBytes : Buffer.from(uploadBytes as ArrayBuffer)
      const s3Key = await uploadFile('covers', fileName, uploadBuffer, contentType)
      const storageCoverUrl = getPublicUrl(s3Key)

      console.log('[Create Book] ✅ Cover uploaded to S3')
      
      // Store cover URL for page generation (NEW: 16 Ocak 2026)
      generatedCoverImageUrl = storageCoverUrl
      console.log('[Create Book] 📸 Cover image URL stored for page generation:', generatedCoverImageUrl ? 'Yes ✅' : 'No ❌')
      if (generatedCoverImageUrl) {
        console.log('[Create Book] 📸 Cover image URL length:', generatedCoverImageUrl.length, 'chars')
      }

      if (debugTrace) {
        debugTrace.push({
          step: 'cover',
          request: { prompt: textPrompt, sceneDescription: coverSceneDescription, coverSceneInput, themeKey, illustrationStyle },
          response: { url: storageCoverUrl },
        })
      }

      // Update book with cover image URL
      // Update book with cover image URL
      // Status: Always 'generating' after cover (will be 'completed' only after page images in full-book mode)
      // Cover-only mode: Keep as 'generating' (in-progress) since book has no content
      // Full-book mode: Keep as 'generating' until page images are done
      await updateBook(book.id, {
        cover_image_url: storageCoverUrl,
        cover_image_path: s3Key,
        status: 'generating', // Always 'generating' after cover (completed only after full book)
      })

      if (isCoverOnlyMode) {
        console.log('[Create Book] ✅ Book updated with cover image URL, status: generating (cover-only, no content yet)')
      } else {
        console.log('[Create Book] ✅ Book updated with cover image URL, status: generating (waiting for page images)')
      }

      // Debug: run up to cover – return result and remove book (docs/analysis/DEBUG_QUALITY_BUTTONS_PLAN.md §9)
      if (isDebugCoverMode) {
        const { error: delErr } = await deleteBook(book.id)
        if (delErr) console.error('[Create Book] Debug: deleteBook failed', delErr)
        return NextResponse.json({
          success: true,
          debug: true,
          debugRunUpTo: 'cover',
          data: {
            coverUrl: storageCoverUrl,
            storyData,
            masterIllustrations,
            entityMasterIllustrations: entityMasterIllustrations || {},
          },
          request: {
            characterIds: characterIds ?? (characterId ? [characterId] : []),
            theme: themeKey,
            illustrationStyle,
            language,
            customRequests,
            pageCount: effectivePageCount,
          },
        })
      }
    } catch (coverError) {
      console.error('[Create Book] Cover generation failed:', coverError)
      if (isDebugCoverMode) {
        const { error: delErr } = await deleteBook(book.id)
        if (delErr) console.error('[Create Book] Debug: deleteBook failed', delErr)
        return NextResponse.json(
          { success: false, debug: true, debugRunUpTo: 'cover', error: (coverError as Error).message },
          { status: 500 }
        )
      }
      // Update status to 'failed' but don't throw - book can still be used without cover
      await updateBook(book.id, { status: 'failed' })
      // Continue to response - story is still generated
    }

    // ====================================================================
    // STEP 3: GENERATE PAGE IMAGES (Skip in cover only mode)
    // ====================================================================
    if (isCoverOnlyMode) {
      console.log('[Create Book] ⏭️  Skipping page images generation (cover only mode)')
      console.log('[Create Book] ✅ Cover only book cover generated (status: generating - no content yet)')
    } else {
      try {
        const pageImagesStartTime = Date.now()
        console.log(`[Create Book] 🎨 Starting page images generation...`)
        console.log(`[Create Book] 📄 Total pages to generate: ${storyData.pages.length}`)
        // Log per-page character expressions from story (v1.9.0 – debug: verify expression flow)
        storyData.pages.forEach((p: any, idx: number) => {
          const num = p.pageNumber ?? idx + 1
          console.log(`[Create Book] Page ${num} character expressions:`)
          const exprs = p.characterExpressions || {}
          if (Object.keys(exprs).length === 0) {
            console.log(`  (none)`)
          } else {
            Object.entries(exprs).forEach(([charId, expr]) => {
              const char = characters.find((c: any) => c.id === charId)
              console.log(`  - ${char?.name || charId}: ${expr}`)
            })
          }
        })
        console.log(`[Create Book] 🚀 Using PARALLEL batch processing (15 images per batch, 90s window)`)
        console.log(`[Create Book] 📊 Model: ${imageModel} | Size: ${imageSize} | Quality: ${imageQuality}`)
        console.log(`[Create Book] ⏱️  Page images generation started at: ${new Date().toISOString()}`)

        const pages = storyData.pages
        const totalPages = pages.length
        
        // Get cover image URL (needed for fallback - not used as reference anymore)
        const coverImageUrl = generatedCoverImageUrl || book.cover_image_url || null
        
        const generatedImages: any[] = []
        
        // NEW: Scene diversity tracking (16 Ocak 2026)
        const sceneDiversityAnalysis: SceneDiversityAnalysis[] = []
        
        // FIX: additionalCharactersCount removed - now calculated per page (25 Ocak 2026)
        console.log(`[Create Book] 👥 Total characters: ${characters.length} (1 main + ${characters.length - 1} additional)`)
        if (characters.length > 1) {
          const allAdditionalCharacters = characters.slice(1).map((char) => ({
            type: char.character_type || {
              group: "Child",
              value: "Child",
              displayName: char.name,
            },
            description: char.description,
          }))
          console.log(`[Create Book] 📝 All additional characters:`, allAdditionalCharacters.map(c => c.type.displayName).join(', '))
        }

        // Process pages in batches of 15 (capacity: 15 concurrent image requests per window)
        const BATCH_SIZE = 15
        const RATE_LIMIT_WINDOW_MS = 90000 // 90 seconds

        for (let batchStart = 0; batchStart < totalPages; batchStart += BATCH_SIZE) {
          const batchEnd = Math.min(batchStart + BATCH_SIZE, totalPages)
          const batchPages = pages.slice(batchStart, batchEnd)
          
          console.log(`[Create Book] 🔄 Processing batch ${Math.floor(batchStart / BATCH_SIZE) + 1}: pages ${batchStart + 1}-${batchEnd} (${batchPages.length} images in parallel)`)

          // Process batch in parallel using Promise.allSettled
          const batchPromises = batchPages.map(async (page: { pageNumber?: number; text?: string; characterIds?: string[]; imagePrompt?: string; sceneDescription?: string; imageUrl?: string }, batchIndex: number) => {
            const i = batchStart + batchIndex
            const pageNumber = page.pageNumber || (i + 1)

            console.log(`[Create Book] 🖼️  [BATCH] Generating image for page ${pageNumber}/${totalPages}...`)

        // Build prompt for this page
        let sceneDescription = page.imagePrompt || page.sceneDescription || page.text
        const ageGroup = storyData.metadata?.ageGroup || 'preschool'
        // NEW (v1.6.0): Story no longer generates clothing; master system handles it
        const pageUseMasterClothing = Object.keys(masterIllustrations).length > 0
        // Note: stripClothingFromSceneText REMOVED (v1.6.0) - story doesn't produce clothing text anymore

        // Sıra 15: characterAction = İngilizce kaynak (FOREGROUND'a gider); page.text (Türkçe) sadece fallback. PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md
        const pageWithContext = page as { sceneContext?: string; sceneDescription?: string; imagePrompt?: string; text?: string }
        const characterActionRaw = pageWithContext.sceneContext?.trim() || pageWithContext.sceneDescription?.trim() || pageWithContext.imagePrompt?.trim() || page.text?.trim() || ''
        const riskAnalysis = detectRiskySceneElements(sceneDescription ?? '', characterActionRaw)
        let characterAction = riskAnalysis.hasRisk ? getSafeSceneAlternative(characterActionRaw) : characterActionRaw
        const focusPoint: 'character' | 'environment' | 'balanced' = 'balanced'
        const mood = themeKey === 'adventure' ? 'exciting' : themeKey === 'fantasy' ? 'mysterious' : themeKey === 'space' ? 'inspiring' : themeKey === 'sports' ? 'exciting' : 'happy'
        const pageClothing = pageUseMasterClothing ? 'match_reference' : undefined // v1.6.0: no clothing from story
        
        // FIX: pageCharacters must be defined before characterExpressions (ReferenceError fix)
        const pageCharacters = page.characterIds || []
        
        // v1.9.0: Per-character expressions from story
        const characterExpressions: Record<string, string> = {}
        const pageCharExprs = (page as any).characterExpressions || {}
        pageCharacters.forEach((charId: string) => {
          const expr = pageCharExprs[charId]?.trim()
          if (expr) {
            characterExpressions[charId] = expr
          }
        })
        
        // A5: Optional shotPlan from story LLM; pass through if present and object-shaped
        const pageShotPlan = (page as { shotPlan?: { shotType?: string; lens?: string; cameraAngle?: string; placement?: string; timeOfDay?: string; mood?: string } }).shotPlan
        const hasValidShotPlan = pageShotPlan && typeof pageShotPlan === 'object' && !Array.isArray(pageShotPlan)

        const sceneInput = {
          pageNumber,
          sceneDescription: sceneDescription ?? '',
          theme: themeKey,
          mood,
          characterAction: characterAction ?? '',
          focusPoint,
          ...(pageClothing && { clothing: pageClothing }),
          ...(Object.keys(characterExpressions).length > 0 && { characterExpressions }),
          ...(hasValidShotPlan && { shotPlan: pageShotPlan }),
        }

        // Generate full page prompt (NEW: Master illustration only, no cover reference)
        // Master illustration is the canonical reference - cover is not needed
        const isCoverPage = false // Page is NOT cover
        
        // FIX: Page-specific character prompt (25 Ocak 2026)
        // Her page için sadece o page'deki karakterlerin prompt'unu oluştur
        // Ana karakteri bul (her zaman ilk karakter)
        const mainCharacter = characters.find((c: { id: string }) => c.id === pageCharacters[0]) || character
        
        // Sadece bu page'deki ek karakterleri bul
        const pageAdditionalCharacters = pageCharacters
          .slice(1) // Ana karakter hariç
          .map((charId: string) => {
            const char = characters.find((c: { id: string }) => c.id === charId)
            if (!char) return null
            return {
              type: char.character_type || {
                group: "Child",
                value: "Child", 
                displayName: char.name,
              },
              description: char.description,
            }
          })
          .filter((char): char is NonNullable<typeof char> => char !== null)
        
        // buildMultipleCharactersPrompt kullan (eğer ek karakter varsa)
        // Plan: Kapak/Close-up/Kıyafet - exclude clothing from character prompt (clothing comes from story)
        const characterPrompt = pageAdditionalCharacters.length > 0
          ? buildMultipleCharactersPrompt(mainCharacter.description, pageAdditionalCharacters, true) // excludeClothing: true
          : buildCharacterPrompt(mainCharacter.description, true, true) // includeAge: true, excludeClothing: true
        
        // additionalCharactersCount güncelle (sadece bu page için)
        const additionalCharactersCount = pageAdditionalCharacters.length
        
        
        // NEW: Analyze scene diversity (16 Ocak 2026)
        const currentSceneAnalysis = analyzeSceneDiversity(
          sceneDescription ?? '',
          page.text || '',
          pageNumber,
          sceneDiversityAnalysis
        )
        sceneDiversityAnalysis.push(currentSceneAnalysis)
        const fullPrompt = generateFullPagePrompt(
          characterPrompt,
          sceneInput,
          illustrationStyle,
          ageGroup,
          additionalCharactersCount, // NEW: Pass additional characters count (page-specific)
          isCoverPage, // isCover: false for all pages
          false, // useCoverReference: false - master illustration is used instead
          sceneDiversityAnalysis.slice(0, -1), // Pass previous scenes (exclude current)
          totalPages, // totalPages for pose variation
          pageCharacters.map((charId: string) => ({ id: charId, name: characters.find((c: any) => c.id === charId)?.name || 'Character' })) // v1.11.0: for [CHARACTER_EXPRESSIONS] labels
        )

        // Call GPT-image API
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
          throw new Error('OPENAI_API_KEY is not configured')
        }

        let pageImageUrl: string | null = null
        let pageImageB64: string | null = null
        let pageImageOutputFormat: string | null = null

        const pageImageStartTime = Date.now()
        // FIX: pageCharacters already defined above (line 1411) - use existing variable (25 Ocak 2026)
        // Use characterIds directly from story generation (required field) - pageCharacters already defined
        // A10: Order = [0] character masters, [1..] entity masters (first image preserved best). PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md
        const pageMasterUrls = pageCharacters
          .map(charId => masterIllustrations[charId])
          .filter((url): url is string => Boolean(url))

        const pageEntityIds: string[] = []
        if (storyData?.supportingEntities) {
          for (const entity of storyData.supportingEntities) {
            if (entity.appearsOnPages && entity.appearsOnPages.includes(pageNumber)) {
              pageEntityIds.push(entity.id)
            }
          }
        }
        const pageEntityMasterUrls = pageEntityIds
          .map(entityId => entityMasterIllustrations[entityId])
          .filter((url): url is string => Boolean(url))

        const allPageMasters = [...pageMasterUrls, ...pageEntityMasterUrls]

        const referenceImageUrls = allPageMasters.length > 0
          ? allPageMasters
          : characters
              .filter(c => pageCharacters.includes(c.id))
              .map(c => c.reference_photo_url)
              .filter((url): url is string => Boolean(url))
        
        if (referenceImageUrls.length > 0) {
          // Convert reference image URLs to Blobs (support both data URL and HTTP URL)
          // Reference images format: Blob (binary data) sent as multipart/form-data
          const imageBlobs: Array<{ blob: Blob; filename: string }> = []
          
          for (let i = 0; i < referenceImageUrls.length; i += 1) {
            const referenceImageUrl = referenceImageUrls[i]
            const charId = pageCharacters[i] || `unknown_${i}`
            const charName = characters.find(c => c.id === charId)?.name || `character_${i + 1}`
            const isMaster = pageMasterUrls.length > 0 && pageMasterUrls.includes(referenceImageUrl)
            const imageLabel = isMaster ? `master_${charName}` : `photo_${charName}`
            const imageProcessingStartTime = Date.now()
            
            try {
              if (referenceImageUrl.startsWith('data:')) {
                console.log(`[Create Book] Page ${pageNumber} - 🔄 Processing data URL ${imageLabel}...`)
                // Data URL: extract base64 data
                const base64Data = referenceImageUrl.split(',')[1]
                const binaryData = Buffer.from(base64Data, 'base64')
                const imageBlob = new Blob([binaryData], { type: 'image/png' })
                imageBlobs.push({ blob: imageBlob, filename: `${imageLabel}.png` })
                console.log(`[Create Book] Page ${pageNumber} - ✅ Data URL ${imageLabel} converted to Blob, size:`, imageBlob.size, 'bytes')
              } else {
                // HTTP URL: download the image
                console.log(`[Create Book] Page ${pageNumber} - 📥 Downloading ${imageLabel} from URL...`)
                console.log(`[Create Book] Page ${pageNumber} -   URL length:`, referenceImageUrl.length, 'chars')
                if (isMaster) {
                  console.log(`[Create Book] Page ${pageNumber} -   🎨 This is MASTER ILLUSTRATION for character ${charName} (canonical reference)`)
                }
                const downloadStartTime = Date.now()
                const imageResponse = await fetch(referenceImageUrl)
                const downloadTime = Date.now() - downloadStartTime
                console.log(`[Create Book] Page ${pageNumber} - ⏱️  Download ${imageLabel} took:`, downloadTime, 'ms')
                
                if (!imageResponse.ok) {
                  throw new Error(`Failed to download ${imageLabel}: ${imageResponse.status} ${imageResponse.statusText}`)
                }
                
                const imageBuffer = await imageResponse.arrayBuffer()
                const imageBlob = new Blob([imageBuffer], { type: 'image/png' })
                imageBlobs.push({ blob: imageBlob, filename: `${imageLabel}.png` })
                const processingTime = Date.now() - imageProcessingStartTime
                console.log(`[Create Book] Page ${pageNumber} - ✅ ${imageLabel} downloaded successfully`)
                console.log(`[Create Book] Page ${pageNumber} - 📊 Image blob ${imageLabel} size:`, imageBlob.size, 'bytes')
                console.log(`[Create Book] Page ${pageNumber} - ⏱️  Total processing time ${imageLabel}:`, processingTime, 'ms')
              }
            } catch (imageError) {
              const processingTime = Date.now() - imageProcessingStartTime
              console.error(`[Create Book] Page ${pageNumber} - ❌ Error processing reference image ${i + 1}:`, imageError)
              console.error(`[Create Book] Page ${pageNumber} - ⏱️  Processing failed after:`, processingTime, 'ms')
            }
          }

          if (imageBlobs.length === 0) {
            console.log(`[Create Book] Page ${pageNumber} - ⚠️  No valid reference images processed - falling back to /v1/images/generations`)
          }

          // Only use /v1/images/edits if we have at least one valid image blob
          if (imageBlobs.length > 0) {
            console.log(`[Create Book] Page ${pageNumber} - 📦 Preparing FormData for /v1/images/edits API call...`)
            
            const formData = new FormData()
            formData.append('model', imageModel)
            formData.append('prompt', fullPrompt)
            formData.append('size', imageSize)
            formData.append('quality', imageQuality)
            formData.append('input_fidelity', 'high') // Anatomik detayları koru
            // Append images as array (image[] format) to support multiple reference images
            imageBlobs.forEach(({ blob, filename }) => {
              formData.append('image[]', blob, filename)
            })
            
            console.log(`[Create Book] Page ${pageNumber} - 📤 FormData prepared:`)
            console.log(`[Create Book] Page ${pageNumber} -   - Model:`, imageModel)
            console.log(`[Create Book] Page ${pageNumber} -   - Size:`, imageSize)
            console.log(`[Create Book] Page ${pageNumber} -   - Quality:`, imageQuality)
            console.log(`[Create Book] Page ${pageNumber} -   - Image blobs:`, imageBlobs.length)
            console.log(`[Create Book] Page ${pageNumber} -   - Reference type:`, pageMasterUrls.length > 0 ? `Master Illustrations ✅ (${pageMasterUrls.length} characters)` : `Character Photos (${referenceImageUrls.length})`)
            console.log(`[Create Book] Page ${pageNumber} -   - Image format: Blob (multipart/form-data)`)
            console.log(`[Create Book] Page ${pageNumber} -   - Prompt included: Yes ✅`)
            console.log(`[Create Book] Page ${pageNumber} -   - Reference images included: Yes ✅ (${imageBlobs.length} as Blobs)`)
            if (pageMasterUrls.length > 0) {
              console.log(`[Create Book] Page ${pageNumber} -   - 🎨 MASTER ILLUSTRATIONS ACTIVE: Using masters for characters: ${pageCharacters.map((id: string) => characters.find((c: { id: string }) => c.id === id)?.name || id).join(', ')}`)
            }

            // NEW: Retry mechanism for edits API (16 Ocak 2026)
            // Retry on temporary errors (502, 503, 504, 429) - max 3 attempts with exponential backoff
            let editsResponse: Response
            try {
              editsResponse = await retryFetch(
                'https://api.openai.com/v1/images/edits',
                {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                  },
                  body: formData,
                },
                3, // max 3 retries
                `Page ${pageNumber} edits API`
              )
            } catch (error: any) {
              // Retry exhausted or permanent error
              const errorStatus = error.status || 'unknown'
              const errorText = error.message || 'Unknown error'
              console.error(`[Create Book] ❌ Page ${pageNumber} edits API failed after retries:`, {
                status: errorStatus,
                error: errorText,
                isRetryable: errorStatus ? isRetryableError(errorStatus) : false,
                isPermanent: errorStatus ? isPermanentError(errorStatus) : false
              })
              
              // CRITICAL: Do NOT fallback to generations API - reference images would be lost!
              // Instead, throw error so user can retry the book generation
              throw new Error(
                `Page ${pageNumber} image generation failed after retries. ` +
                `Status: ${errorStatus}. ` +
                `This is a ${isPermanentError(errorStatus) ? 'permanent' : 'temporary'} error. ` +
                `Please try creating the book again. ` +
                `Reference images (master illustration or character photos) are required for character consistency.`
              )
            }

            // Success - parse response
            const editsApiTime = Date.now() - pageImageStartTime
            console.log(`[Create Book] ⏱️  Page ${pageNumber} edits API call completed in:`, editsApiTime, 'ms')
            console.log(`[Create Book] 📊 Page ${pageNumber} edits response status:`, editsResponse.status, editsResponse.statusText)
            
            const editsResult = await editsResponse.json()
            console.log(`[Create Book] 📦 Page ${pageNumber} edits response structure:`, {
              hasData: !!editsResult.data,
              dataLength: editsResult.data?.length || 0,
              dataType: Array.isArray(editsResult.data) ? 'array' : typeof editsResult.data,
            })
            
            pageImageUrl = editsResult.data[0]?.url || null
            pageImageB64 = editsResult.data[0]?.b64_json || null
            pageImageOutputFormat = editsResult.output_format || null
            console.log(`[Create Book] ✅ Page ${pageNumber} edits response image field:`, pageImageUrl ? 'url ✅' : (pageImageB64 ? 'b64_json ✅' : 'missing ❌'))
            if (pageImageUrl) {
              console.log(`[Create Book] 🖼️  Page ${pageNumber} image URL received (length:`, pageImageUrl.length, 'chars)')
            }
            if (pageImageB64) {
            }
          }

          // REMOVED: Fallback to /v1/images/generations (16 Ocak 2026)
          // Reason: Generations API doesn't support reference images, which would result in
          // completely unrelated images (no character consistency).
          // Instead, if edits API fails after retries, we throw an error so user can retry.
          
          // Only use generations API if NO reference images are available (shouldn't happen in normal flow)
          if (!pageImageUrl && !pageImageB64 && referenceImageUrls.length === 0) {
            console.warn(`[Create Book] ⚠️  Page ${pageNumber} - No reference images available, using /v1/images/generations (this should not happen in normal flow)`)
            console.log(`[Create Book] 📋 Page ${pageNumber} - Model:`, imageModel)
            console.log(`[Create Book] 📏 Page ${pageNumber} - Size:`, imageSize)
            console.log(`[Create Book] 🎨 Page ${pageNumber} - Quality:`, imageQuality)
            console.log(`[Create Book] 📝 Page ${pageNumber} - Prompt length:`, fullPrompt.length, 'characters')
            
            const generationsApiStartTime = Date.now()
            console.log(`[Create Book] 🚀 Page ${pageNumber} - Calling /v1/images/generations API...`)
            console.log(`[Create Book] ⏱️  Page ${pageNumber} - API call started at:`, new Date().toISOString())
            
            const genResponse = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: imageModel,
                prompt: fullPrompt,
                n: 1,
                size: imageSize,
                quality: imageQuality,
                // Note: GPT-image API doesn't support response_format parameter
              }),
            })

            const generationsApiTime = Date.now() - generationsApiStartTime
            console.log(`[Create Book] ⏱️  Page ${pageNumber} - Generations API call completed in:`, generationsApiTime, 'ms')
            console.log(`[Create Book] 📊 Page ${pageNumber} - Response status:`, genResponse.status, genResponse.statusText)

            if (!genResponse.ok) {
              const errorText = await genResponse.text()
              console.error(`[Create Book] ❌ Page ${pageNumber} - Generations API error:`)
              console.error(`[Create Book]   Status:`, genResponse.status)
              console.error(`[Create Book]   Status Text:`, genResponse.statusText)
              console.error(`[Create Book]   Error Response:`, errorText)
              
              // Try to parse error JSON
              try {
                const errorJson = JSON.parse(errorText)
                console.error(`[Create Book]   Parsed Error:`, (errorJson?.error?.message || errorText?.slice(0, 300)))
              } catch {
                console.error(`[Create Book]   Raw Error Text:`, errorText)
              }
              
              return null // Skip this page, return null
            }

            console.log(`[Create Book] ✅ Page ${pageNumber} - Generations API call successful, parsing response...`)
            const genResult = await genResponse.json()
            console.log(`[Create Book] 📦 Page ${pageNumber} - Response structure:`, {
              hasData: !!genResult.data,
              dataLength: genResult.data?.length || 0,
              dataType: Array.isArray(genResult.data) ? 'array' : typeof genResult.data,
            })
            
            pageImageUrl = genResult.data?.[0]?.url || null
            pageImageB64 = genResult.data?.[0]?.b64_json || null
            pageImageOutputFormat = genResult.output_format || null
            console.log(`[Create Book] ✅ Page ${pageNumber} - Generations response image field:`, pageImageUrl ? 'url ✅' : (pageImageB64 ? 'b64_json ✅' : 'missing ❌'))
            if (pageImageUrl) {
              console.log(`[Create Book] 🖼️  Page ${pageNumber} - Image URL received (length:`, pageImageUrl.length, 'chars)')
            }
            if (pageImageB64) {
            }
          }
        } else {
          // No reference image available: MUST call generations directly
          console.log(`[Create Book] 🔄 Page ${pageNumber} - No reference image, calling /v1/images/generations directly`)
          console.log(`[Create Book] 📋 Page ${pageNumber} - Model:`, imageModel)
          console.log(`[Create Book] 📏 Page ${pageNumber} - Size:`, imageSize)
          console.log(`[Create Book] 🎨 Page ${pageNumber} - Quality:`, imageQuality)
          console.log(`[Create Book] 📝 Page ${pageNumber} - Prompt length:`, fullPrompt.length, 'characters')

          const generationsApiStartTime = Date.now()
          console.log(`[Create Book] 🚀 Page ${pageNumber} - Calling /v1/images/generations API...`)
          console.log(`[Create Book] ⏱️  Page ${pageNumber} - API call started at:`, new Date().toISOString())

          const genResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: imageModel,
              prompt: fullPrompt,
              n: 1,
              size: imageSize,
              quality: imageQuality,
            }),
          })

          const generationsApiTime = Date.now() - generationsApiStartTime
          console.log(`[Create Book] ⏱️  Page ${pageNumber} - Generations API call completed in:`, generationsApiTime, 'ms')
          console.log(`[Create Book] 📊 Page ${pageNumber} - Response status:`, genResponse.status, genResponse.statusText)

          if (!genResponse.ok) {
            const errorText = await genResponse.text()
            console.error(`[Create Book] ❌ Page ${pageNumber} - Generations API error:`)
            console.error(`[Create Book]   Status:`, genResponse.status)
            console.error(`[Create Book]   Status Text:`, genResponse.statusText)
            console.error(`[Create Book]   Error Response:`, errorText)
            return null
          }

          console.log(`[Create Book] ✅ Page ${pageNumber} - Generations API call successful, parsing response...`)
          const genResult = await genResponse.json()
          console.log(`[Create Book] 📦 Page ${pageNumber} - Response structure:`, {
            hasData: !!genResult.data,
            dataLength: genResult.data?.length || 0,
            dataType: Array.isArray(genResult.data) ? 'array' : typeof genResult.data,
          })

          pageImageUrl = genResult.data?.[0]?.url || null
          pageImageB64 = genResult.data?.[0]?.b64_json || null
          pageImageOutputFormat = genResult.output_format || null
          console.log(`[Create Book] ✅ Page ${pageNumber} - Generations response image field:`, pageImageUrl ? 'url ✅' : (pageImageB64 ? 'b64_json ✅' : 'missing ❌'))
          if (pageImageUrl) {
            console.log(`[Create Book] 🖼️  Page ${pageNumber} - Image URL received (length:`, pageImageUrl.length, 'chars)')
          }
          if (pageImageB64) {
          }
        }

        if (!pageImageUrl && !pageImageB64) {
          const totalTime = Date.now() - pageImageStartTime
          console.error(`[Create Book] ❌ Page ${pageNumber} - No image URL or b64_json returned from API`)
          console.error(`[Create Book] ⏱️  Page ${pageNumber} - Total time before failure:`, totalTime, 'ms')
          return null
        }

        const totalImageGenTime = Date.now() - pageImageStartTime
        console.log(`[Create Book] ✅ Page ${pageNumber} - Image generated successfully (${totalImageGenTime}ms)`)
        console.log(`[Create Book] 🖼️  Page ${pageNumber} - Image field:`, pageImageUrl ? 'url ✅' : 'b64_json ✅')

        // Download and upload to Supabase Storage
        let imageBuffer: ArrayBuffer | Buffer
        let contentType = 'image/png'
        const ext = (pageImageOutputFormat || 'png').toLowerCase()
        
        if (pageImageUrl) {
          const downloadStart = Date.now()
          console.log(`[Create Book] 📥 Page ${pageNumber} - Downloading image from URL for upload...`)
          const res = await fetch(pageImageUrl)
          const downloadMs = Date.now() - downloadStart
          console.log(`[Create Book] ⏱️  Page ${pageNumber} - URL download time:`, downloadMs, 'ms')
          imageBuffer = await res.arrayBuffer()
        } else {
          // b64_json path
          console.log(`[Create Book] 🔄 Page ${pageNumber} - Converting b64_json to bytes for upload...`)
          imageBuffer = Buffer.from(pageImageB64 as string, 'base64')
        }
        
        if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
        if (ext === 'webp') contentType = 'image/webp'
        const fileName = `${user.id}/books/${book.id}/page_${pageNumber}_${Date.now()}.${ext || 'png'}`

        const uploadStart = Date.now()
        console.log(`[Create Book] 📤 Page ${pageNumber} - Uploading to S3...`)
        console.log(`[Create Book]   File name:`, fileName)
        console.log(`[Create Book]   Content type:`, contentType)
        console.log(`[Create Book]   Buffer size:`, imageBuffer.byteLength || (imageBuffer as Buffer).length, 'bytes')

        const pageImageBuffer = Buffer.isBuffer(imageBuffer) ? imageBuffer : Buffer.from(imageBuffer as ArrayBuffer)
        const s3Key = await uploadFile('books', fileName, pageImageBuffer, contentType)
        
        const uploadMs = Date.now() - uploadStart
        console.log(`[Create Book] ⏱️  Page ${pageNumber} - Upload time:`, uploadMs, 'ms')

        console.log(`[Create Book] ✅ Page ${pageNumber} - Image uploaded to S3 successfully`)

        const storageImageUrl = getPublicUrl(s3Key)

        console.log(`[Create Book] ✅ Page ${pageNumber} - Image uploaded:`, storageImageUrl)
        console.log(`[Create Book] 📊 Page ${pageNumber} - Storage URL length:`, storageImageUrl?.length || 0, 'chars')

        if (debugTrace) {
          debugTrace.push({
            step: `page_${pageNumber}`,
            request: { prompt: fullPrompt, sceneDescription, pageNumber },
            response: { url: storageImageUrl },
          })
        }

            // Update page with image URL
            const pageIndex = pages.findIndex((p: { pageNumber?: number }) => (p.pageNumber || pages.indexOf(p) + 1) === pageNumber)
            if (pageIndex !== -1) {
              pages[pageIndex].imageUrl = storageImageUrl
            }

            return {
              pageNumber,
              imageUrl: storageImageUrl,
              storagePath: s3Key,
              prompt: fullPrompt,
            }
          })

          // Wait for all images in batch to complete (parallel processing)
          const batchResults = await Promise.allSettled(batchPromises)
          
          // Collect successful results
          for (const result of batchResults) {
            if (result.status === 'fulfilled' && result.value) {
              generatedImages.push(result.value)
              const pageIndex = pages.findIndex((p: { pageNumber?: number }) => (p.pageNumber || pages.indexOf(p) + 1) === result.value.pageNumber)
              if (pageIndex !== -1) {
                pages[pageIndex].imageUrl = result.value.imageUrl
              }
            } else if (result.status === 'rejected') {
              console.error(`[Create Book] ❌ Batch image generation failed:`, result.reason)
            }
          }

          const successCount = batchResults.filter(r => r.status === 'fulfilled').length
          const failCount = batchResults.filter(r => r.status === 'rejected').length
          console.log(`[Create Book] ✅ Batch ${Math.floor(batchStart / BATCH_SIZE) + 1} completed: ${successCount}/${batchPages.length} images generated (${failCount} failed)`)

          // Rate limiting: Wait 90 seconds before next batch (except for last batch)
          if (batchEnd < totalPages) {
            console.log(`[Create Book] ⏳ Rate limiting: Waiting 90 seconds before next batch...`)
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_WINDOW_MS))
          }
        }

      const totalPageImagesTime = Date.now() - pageImagesStartTime
      const totalPageImagesTimeSeconds = Math.round(totalPageImagesTime / 1000)
      const totalPageImagesTimeMinutes = Math.floor(totalPageImagesTimeSeconds / 60)
      const remainingSeconds = totalPageImagesTimeSeconds % 60
      
      console.log(`[Create Book] ✅ Generated ${generatedImages.length}/${totalPages} page images (parallel batch processing)`)
      console.log(`[Create Book] ⏱️  Total page images generation time: ${totalPageImagesTime}ms (${totalPageImagesTimeMinutes}m ${remainingSeconds}s)`)
      console.log(`[Create Book] 📊 Average time per page: ${Math.round(totalPageImagesTime / totalPages)}ms (${(totalPageImagesTime / totalPages / 1000).toFixed(1)}s)`)
      console.log(`[Create Book] 📦 Generated images data:`, generatedImages.map(img => ({
        pageNumber: img.pageNumber,
        hasImageUrl: !!img.imageUrl,
        imageUrlLength: img.imageUrl?.length || 0,
      })))

      // Update book with page images
      console.log(`[Create Book] 💾 Updating book in database with page images...`)
      const dbUpdateStart = Date.now()

      const allImagesGenerated = generatedImages.length === totalPages
      
      await updateBook(book.id, {
        story_data: {
          ...storyData,
          pages: pages,
        },
        images_data: generatedImages,
        status: allImagesGenerated ? 'completed' : 'failed',
      })
      
      const dbUpdateMs = Date.now() - dbUpdateStart
      console.log(`[Create Book] ⏱️  Database update time:`, dbUpdateMs, 'ms')
      if (allImagesGenerated) {
        console.log(`[Create Book] ✅ Book completed! All images generated and uploaded`)
      } else {
        console.warn(`[Create Book] ⚠️  Book NOT completed - missing page images (${generatedImages.length}/${totalPages}). Status set to 'failed'.`)
      }
      console.log(`[Create Book] 📊 Final stats:`)
      console.log(`[Create Book]   - Total pages:`, totalPages)
      console.log(`[Create Book]   - Images generated:`, generatedImages.length)
      console.log(`[Create Book]   - Images in story_data.pages:`, pages.filter((p: any) => p.imageUrl).length)
      console.log(`[Create Book]   - Images in images_data:`, generatedImages.length)

      // TTS prewarm: generate audio for each page so first read is instant (TTS_GOOGLE_GEMINI_ANALYSIS.md §2)
      if (allImagesGenerated && pages?.length) {
        const bookLanguage = language || 'tr'
        console.log(`[Create Book] 🔊 TTS prewarm: generating audio for ${pages.length} pages...`)
        for (let i = 0; i < pages.length; i++) {
          const p = pages[i]
          const text = p?.text?.trim()
          if (!text) continue
          try {
            await generateTts(text, { language: bookLanguage })
            if (process.env.DEBUG_LOGGING === 'true') {
              console.log(`[Create Book] TTS prewarm: page ${i + 1}/${pages.length} ok`)
            }
          } catch (ttsErr) {
            console.warn(`[Create Book] TTS prewarm: page ${i + 1} failed:`, (ttsErr as Error).message)
          }
        }
        console.log(`[Create Book] 🔊 TTS prewarm done`)
      }

      } catch (imagesError) {
        console.error('[Create Book] Page images generation failed:', imagesError)
        // Update status to 'failed'
        await updateBook(book.id, { status: 'failed' })
      }
    }

    // Prepare Response - Fetch updated book to get latest status and cover_image_url
    const { data: updatedBook, error: fetchError } = await getBookById( book.id)
    
    const finalBook = updatedBook || book // Fallback to original book if fetch fails
    
    const generationTime = Date.now() - startTime
    const tokensUsed = completion?.usage?.total_tokens || 0

    console.log(
      `[Create Book] ✅ Book created successfully: ${book.id} (${generationTime}ms, ${tokensUsed} tokens)`
    )
    console.log(`[Create Book] 📊 Final book status: ${finalBook.status}`)
    console.log(`[Create Book] 🖼️  Cover image: ${finalBook.cover_image_url ? 'Yes ✅' : 'No ❌'}`)
    console.log(`[Create Book] 📄 Total pages: ${finalBook.total_pages}`)

    const response: CreateBookResponse & { debugTrace?: DebugTraceEntry[] } = {
      id: finalBook.id,
      title: finalBook.title,
      status: finalBook.status,
      totalPages: finalBook.total_pages,
      theme: finalBook.theme,
      illustrationStyle: finalBook.illustration_style,
      character: {
        id: character.id,
        name: character.name,
      },
      generationTime,
      tokensUsed,
      story_data: storyData, // Include story content in response for debug/preview (null in cover only mode)
      ...(debugTrace && debugTrace.length > 0 && { debugTrace }),
    }

    return successResponse(
      response,
      'Book created and story generated successfully'
    )
  } catch (error) {
    console.error('Book creation error:', error)
    return handleAPIError(error)
  }
}

// ============================================================================
// GET /api/books - Get user's books
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()

    // Parse Query Parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Get User's Books
    const { data: books, error: dbError } = await getUserBooks(user.id, {
      status: status || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to fetch books')
    }

    return successResponse(books || [], 'Books fetched successfully')
  } catch (error) {
    console.error('Get books error:', error)
    return handleAPIError(error)
  }
}

