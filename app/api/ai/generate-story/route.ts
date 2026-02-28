/**
 * Story Generation API
 *
 * POST /api/ai/generate-story
 * Body: characterId, theme, illustrationStyle, customRequests?, language?
 * Generates a complete children's story with image prompts (GPT-4o).
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { getCharacterById } from '@/lib/db/characters'
import { createBook, getBookById } from '@/lib/db/books'
import { getUserRole } from '@/lib/db/users'
import { generateStoryPrompt, getWordCountMin } from '@/lib/prompts/story/base'
import type { ShotPlan } from '@/lib/prompts/types'
import { successResponse, errorResponse, handleAPIError } from '@/lib/api/response'
import OpenAI from 'openai'

const ALLOWED_STORY_MODELS = ['gpt-4o-mini', 'gpt-4o', 'o1-mini'] as const
type AllowedStoryModel = typeof ALLOWED_STORY_MODELS[number]

/** Per-model pricing (USD / 1M tokens). Approximate blended input+output. */
const MODEL_COST_PER_1M: Record<AllowedStoryModel, { input: number; output: number }> = {
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o':      { input: 2.50, output: 10.00 },
  'o1-mini':     { input: 1.10, output: 4.40 },
}

function calcCost(model: AllowedStoryModel, inputTokens: number, outputTokens: number): string {
  const pricing = MODEL_COST_PER_1M[model]
  const cost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000
  return `~$${cost.toFixed(4)}`
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface StoryGenerationRequest {
  characterId: string
  theme: string
  illustrationStyle: string
  customRequests?: string
  language?: 'en' | 'tr' | 'de' | 'fr' | 'es' | 'zh' | 'pt' | 'ru'
  /** Sayfa sayısı (2–20). Verilmezse prompt varsayılanı kullanılır (şu an 10). */
  pageCount?: number
  /** Debug: return apiRequest, characterResolved, aiRequest in response metadata.debug */
  debug?: boolean
  /** Admin/debug only: override story model. Ignored for regular users. */
  storyModel?: string
}

export interface StoryGenerationResponse {
  storyId: string
  title: string
  pages: Array<{
    pageNumber: number
    text: string
    imagePrompt: string
    sceneDescription: string
    /** A5: Optional shot plan from LLM; used for image prompt when present. */
    shotPlan?: ShotPlan
  }>
  metadata: {
    ageGroup: string
    theme: string
    totalPages: number
    readingTime: number
    educationalThemes: string[]
  }
  character: {
    id: string
    name: string
  }
  generationTime: number
  tokensUsed: number
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // ====================================================================
    // 1. Authentication
    // ====================================================================
    const user = await requireUser()

    // ====================================================================
    // 2. Parse & Validate Request
    // ====================================================================
    const body: StoryGenerationRequest = await request.json()
    const {
      characterId,
      theme,
      illustrationStyle,
      customRequests,
      language = 'en',
      pageCount: pageCountOverride,
      debug: debugMode = false,
      storyModel: requestedModel,
    } = body

    // Admin/debug only model override (mirrors books/route.ts logic)
    const userRole = await getUserRole(user.id)
    const isAdmin = userRole === 'admin'
    const canUseDebugOptions = process.env.DEBUG_SKIP_PAYMENT === 'true' || isAdmin
    const effectiveStoryModel: AllowedStoryModel =
      canUseDebugOptions &&
      requestedModel &&
      (ALLOWED_STORY_MODELS as readonly string[]).includes(requestedModel)
        ? (requestedModel as AllowedStoryModel)
        : 'gpt-4o-mini'

    if (effectiveStoryModel !== 'gpt-4o-mini') {
      console.log(`[generate-story] 🔧 Model override: ${effectiveStoryModel} (admin=${isAdmin})`)
    }

    if (!characterId || !theme || !illustrationStyle) {
      return errorResponse(
        'Missing required fields',
        'characterId, theme, and illustrationStyle are required',
        400
      )
    }

    // ====================================================================
    // 3. Get Character
    // ====================================================================
    const { data: character, error: charError } = await getCharacterById(characterId)

    if (charError || !character) {
      return errorResponse('Character not found', 'Invalid character ID', 404)
    }

    // Verify ownership
    if (character.user_id !== user.id) {
      return errorResponse('Forbidden', 'You do not own this character', 403)
    }

    // ====================================================================
    // 4. Generate Story Prompt
    // ====================================================================
    // Faz 1: defaultClothing from master character (exact outfit for story consistency)
    const desc = character.description as unknown as Record<string, unknown>
    const defaultClothing =
      (desc?.defaultClothing as string | undefined) ||
      (character.description?.clothingStyle && Array.isArray(character.description?.clothingColors)
        ? `${character.description.clothingStyle} in ${character.description.clothingColors.join(' and ')}`
        : undefined)

    // CHARACTER MAPPING için gerçek UUID: tek karakterde bile characters dizisi veriyoruz (aksiyon planı 1.2)
    const charactersForPrompt = [
      {
        id: character.id,
        name: character.name,
        type: { displayName: character.name, group: 'Child', value: 'Child' },
      },
    ]

    const storyPrompt = generateStoryPrompt({
      characterName: character.name,
      characterAge: character.age,
      characterGender: character.gender,
      theme,
      illustrationStyle,
      customRequests,
      pageCount: pageCountOverride,
      referencePhotoAnalysis: {
        detectedFeatures: {
          age: character.description.age,
          gender: character.description.gender,
          skinTone: character.description.skinTone,
          hairColor: character.description.hairColor,
          hairStyle: character.description.hairStyle,
          eyeColor: character.description.eyeColor,
          faceShape: character.description.faceShape,
        },
        finalDescription: character.description,
        confidence: character.analysis_confidence || 0.8,
      },
      language,
      defaultClothing,
      characters: charactersForPrompt,
    })

    console.log('Story generation started for character:', character.name)

    // ====================================================================
    // 5. Call OpenAI
    // ====================================================================
    // Get language name for system message
    const languageNames: Record<string, string> = {
      'en': 'English',
      'tr': 'Turkish',
      'de': 'German',
      'fr': 'French',
      'es': 'Spanish',
      'zh': 'Chinese (Mandarin)',
      'pt': 'Portuguese',
      'ru': 'Russian',
    }
    const languageName = languageNames[language] || 'English'
    const systemMessage =
      `You are a professional children's book author. Create engaging, age-appropriate stories with detailed image prompts.

LANGUAGE: Only the "text" field of each page (the story narrative) must be in ${languageName}. The fields imagePrompt, sceneDescription, sceneContext, and characterExpressions must be in English (used for image generation APIs).`

    const completion = await openai.chat.completions.create({
      model: effectiveStoryModel,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: storyPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8, // Creative but not too random
      max_tokens: 4000,
    })

    const storyContent = completion.choices[0].message.content
    if (!storyContent) {
      throw new Error('No story content generated')
    }

    // Parse JSON response
    const storyData = JSON.parse(storyContent)

    // ====================================================================
    // 6. Validate Story Structure
    // ====================================================================
    if (!storyData.title || !storyData.pages || !Array.isArray(storyData.pages)) {
      throw new Error('Invalid story structure from AI')
    }

    // ====================================================================
    // 6.0. Validator + repair pass: supportingEntities, suggestedOutfits (aksiyon planı 2.1)
    // ====================================================================
    const needsSupportingEntities = !Array.isArray(storyData.supportingEntities) || storyData.supportingEntities.length === 0
    const characterIdsFromPages = new Set<string>()
    storyData.pages?.forEach((p: { characterIds?: string[] }) => {
      (p.characterIds || []).forEach((id: string) => characterIdsFromPages.add(id))
    })
    const needsSuggestedOutfits =
      !storyData.suggestedOutfits ||
      typeof storyData.suggestedOutfits !== 'object' ||
      [...characterIdsFromPages].some((id) => !storyData.suggestedOutfits[id])

    if (needsSupportingEntities || needsSuggestedOutfits) {
      try {
        const repairPrompt = `The following story JSON is missing required fields. Return ONLY a valid JSON object containing the missing field(s). Do not repeat or change the story content.

Missing: ${needsSupportingEntities ? 'supportingEntities (array of { id, type: "animal"|"object", name, description, appearsOnPages: number[] }) - list ALL animals and important objects in the story.' : ''}${needsSuggestedOutfits ? (needsSupportingEntities ? ' ' : '') + 'suggestedOutfits (object: character UUID -> one line English outfit per character). Character IDs to include: ' + [...characterIdsFromPages].join(', ') + '.' : ''}

Story title: ${storyData.title}
Pages count: ${storyData.pages?.length || 0}
Theme: ${theme}

Return only JSON with keys: ${[needsSupportingEntities && 'supportingEntities', needsSuggestedOutfits && 'suggestedOutfits'].filter(Boolean).join(', ')}.`

        const repairCompletion = await openai.chat.completions.create({
          model: effectiveStoryModel,
          messages: [{ role: 'user', content: repairPrompt }],
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 1500,
        })
        const repairContent = repairCompletion.choices[0]?.message?.content
        if (repairContent) {
          const repairData = JSON.parse(repairContent)
          if (Array.isArray(repairData.supportingEntities)) {
            storyData.supportingEntities = repairData.supportingEntities
            console.log('[Story Generation] Repair: added supportingEntities', storyData.supportingEntities.length)
          }
          if (repairData.suggestedOutfits && typeof repairData.suggestedOutfits === 'object') {
            storyData.suggestedOutfits = { ...storyData.suggestedOutfits, ...repairData.suggestedOutfits }
            console.log('[Story Generation] Repair: added/updated suggestedOutfits')
          }
        }
      } catch (repairErr) {
        console.warn('[Story Generation] Repair pass failed (non-fatal):', repairErr)
      }
    }

    // ====================================================================
    // 6.1. Word Count Analysis + Short-Page Repair (7 Şubat 2026)
    // ====================================================================
    const ageGroup = storyData.metadata?.ageGroup || 'preschool'
    const wordMin = getWordCountMin(ageGroup)
    const wordCounts = storyData.pages.map((page: any, index: number) => {
      const text = page.text || ''
      const count = text.trim() ? text.split(/\s+/).length : 0
      return { pageNumber: page.pageNumber || index + 1, count, pageIndex: index }
    })
    type WordCountItem = { pageNumber: number; count: number; pageIndex: number }
    const shortPages = wordCounts.filter((p: WordCountItem) => p.count < wordMin)

    console.log('[Story Generation] 📊 WORD COUNT ANALYSIS:')
    wordCounts.forEach((p: WordCountItem) => {
      console.log(`  Page ${p.pageNumber}: ${p.count} words (min: ${wordMin})${p.count < wordMin ? ' ⚠️ TOO SHORT!' : ' ✓'}`)
    })
    const avgWordCount = wordCounts.reduce((sum: number, p: WordCountItem) => sum + p.count, 0) / wordCounts.length
    console.log(`  Average: ${avgWordCount.toFixed(1)} words per page (min per page: ${wordMin})`)

    // Repair: expand short pages (one LLM pass for all short pages)
    if (shortPages.length > 0) {
      try {
        const repairPrompt = `The following story has some pages with too few words. Return ONLY a valid JSON object with key "pages": an array of objects. Each object has "pageNumber" (number) and "text" (string). Include ONLY the pages that need expansion (page numbers: ${shortPages.map((p: WordCountItem) => p.pageNumber).join(', ')}). For each of these pages, rewrite the "text" to be at least ${wordMin} words while keeping the same story event and tone. Use the same language as the original. Do not change other pages.

Original story title: ${storyData.title}
Theme: ${theme}
Current short page texts:
${shortPages.map((p: WordCountItem) => `Page ${p.pageNumber}: "${(storyData.pages[p.pageIndex].text || '').slice(0, 200)}..."`).join('\n')}

Return JSON: { "pages": [ { "pageNumber": 2, "text": "..." }, ... ] }`

        const repairCompletion = await openai.chat.completions.create({
          model: effectiveStoryModel,
          messages: [{ role: 'user', content: repairPrompt }],
          response_format: { type: 'json_object' },
          temperature: 0.4,
          max_tokens: 2000,
        })
        const repairContent = repairCompletion.choices[0]?.message?.content
        if (repairContent) {
          const repairData = JSON.parse(repairContent)
          if (Array.isArray(repairData.pages)) {
            repairData.pages.forEach((item: { pageNumber: number; text: string }) => {
              const idx = storyData.pages.findIndex((p: any, i: number) => (p.pageNumber || i + 1) === item.pageNumber)
              if (idx >= 0 && item.text) {
                storyData.pages[idx].text = item.text
                console.log(`[Story Generation] Repair: expanded page ${item.pageNumber} to ${item.text.split(/\s+/).length} words`)
              }
            })
          }
        }
      } catch (repairErr) {
        console.warn('[Story Generation] Word count repair pass failed (non-fatal):', repairErr)
      }
    }
    
    // ====================================================================
    // 6.2. LOG: Theme & Clothing Style (NEW: 15 Ocak 2026 - Quality Check)
    // ====================================================================
    console.log('[Story Generation] 👔 THEME & CLOTHING ANALYSIS:')
    console.log(`  Theme: ${theme}`)
    const themeClothingMap: Record<string, string> = {
      adventure: 'comfortable outdoor clothing',
      sports: 'sportswear',
      fantasy: 'fantasy-appropriate casual clothing',
      animals: 'casual comfortable clothing for nature/outdoors',
      'daily-life': 'everyday casual clothing',
      space: 'space/exploration-appropriate clothing',
      underwater: 'swimwear or beach-appropriate clothing',
    }
    const expectedClothing = themeClothingMap[theme] || 'age-appropriate casual clothing'
    console.log(`  Expected clothing: ${expectedClothing}`)
    console.log(`  ✅ Clothing style directives added to prompt`)

    // ====================================================================
    // 7. Save to Database
    // ====================================================================
    const { data: book, error: bookError } = await createBook(user.id, {
      character_id: characterId,
      title: storyData.title,
      theme,
      illustration_style: illustrationStyle,
      language,
      age_group: storyData.metadata?.ageGroup || 'preschool',
      total_pages: storyData.pages.length,
      story_data: storyData,
      status: 'draft', // Story generated, images not yet
      custom_requests: customRequests,
      generation_metadata: {
        model: effectiveStoryModel,
        promptVersion: '1.0.0',
        tokensUsed: completion.usage?.total_tokens || 0,
        generationTime: Date.now() - startTime,
      },
    })

    if (bookError || !book) {
      console.error('Database error:', bookError)
      throw new Error('Failed to save story to database')
    }

    // ====================================================================
    // 8. Prepare Response
    // ====================================================================
    const generationTime = Date.now() - startTime
    const tokensUsed = completion.usage?.total_tokens || 0

    console.log(`Story generated successfully in ${generationTime}ms, ${tokensUsed} tokens`)

    const response: StoryGenerationResponse = {
      storyId: book.id,
      title: storyData.title,
      pages: storyData.pages,
      metadata: {
        ageGroup: storyData.metadata?.ageGroup || 'preschool',
        theme,
        totalPages: storyData.pages.length,
        readingTime: storyData.pages.length * 2, // Estimated 2 min per page
        educationalThemes: storyData.metadata?.educationalThemes || [],
      },
      character: {
        id: character.id,
        name: character.name,
      },
      generationTime,
      tokensUsed,
    }

    const metadata: Record<string, unknown> = {
      cost: calcCost(
        effectiveStoryModel,
        completion.usage?.prompt_tokens || 0,
        completion.usage?.completion_tokens || 0
      ),
      model: effectiveStoryModel,
      characterUsage: character.total_books + 1,
    }
    if (debugMode) {
      metadata.debug = {
        apiRequest: {
          characterId,
          theme,
          illustrationStyle,
          customRequests: customRequests ?? '',
          language,
          pageCount: pageCountOverride,
        },
        characterResolved: {
          id: character.id,
          name: character.name,
          age: character.age,
          gender: character.gender,
        },
        aiRequest: {
          model: 'gpt-4o-mini',
          systemMessage,
          userMessage: storyPrompt,
        },
      }
    }

    return successResponse(response, 'Story generated successfully', metadata)
  } catch (error) {
    console.error('Story generation error:', error)
    return handleAPIError(error)
  }
}

// ============================================================================
// GET - Get Story Status (optional, for polling)
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storyId = searchParams.get('storyId')

    if (!storyId) {
      return errorResponse('Missing storyId', 'storyId query parameter is required', 400)
    }

    const user = await requireUser()

    const { data: book, error } = await getBookById(storyId)

    if (error || !book) {
      return errorResponse('Story not found', 'Invalid story ID', 404)
    }

    if (book.user_id !== user.id) {
      return errorResponse('Unauthorized', 'You can only view your own stories', 403)
    }

    return successResponse(book)
  } catch (error) {
    return handleAPIError(error)
  }
}

