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
import { generateStoryPrompt } from '@/lib/prompts/story/base'
import { successResponse, errorResponse, handleAPIError } from '@/lib/api/response'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface StoryGenerationRequest {
  characterId: string
  theme: string
  illustrationStyle: string
  customRequests?: string
  language?: 'en' | 'tr' | 'de' | 'fr' | 'es' | 'zh' | 'pt' | 'ru'
}

export interface StoryGenerationResponse {
  storyId: string
  title: string
  pages: Array<{
    pageNumber: number
    text: string
    imagePrompt: string
    sceneDescription: string
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
    } = body

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

    const storyPrompt = generateStoryPrompt({
      characterName: character.name,
      characterAge: character.age,
      characterGender: character.gender,
      theme,
      illustrationStyle,
      customRequests,
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            `You are a professional children's book author. Create engaging, age-appropriate stories with detailed image prompts.

CRITICAL LANGUAGE REQUIREMENT: The story MUST be written entirely in ${languageName} ONLY. DO NOT use any English words, phrases, or sentences. Every single word in the story text must be in ${languageName}. If you use any English words, the story will be rejected.`,
        },
        {
          role: 'user',
          content: storyPrompt,
        },
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
    // 6.1. LOG: Word Count Analysis (NEW: 15 Ocak 2026 - Quality Check)
    // ====================================================================
    console.log('[Story Generation] 📊 WORD COUNT ANALYSIS:')
    const ageGroup = storyData.metadata?.ageGroup || 'preschool'
    const expectedWordCount = ageGroup === 'toddler' ? '35-45' : 
                             ageGroup === 'preschool' ? '50-70' :
                             ageGroup === 'early-elementary' ? '80-100' : '110-130'
    
    storyData.pages.forEach((page: any, index: number) => {
      const wordCount = page.text ? page.text.split(/\s+/).length : 0
      const pageNum = page.pageNumber || index + 1
      const isTooShort = (ageGroup === 'toddler' && wordCount < 35) ||
                        (ageGroup === 'preschool' && wordCount < 50) ||
                        (ageGroup === 'early-elementary' && wordCount < 80) ||
                        (ageGroup === 'elementary' && wordCount < 110)
      
      console.log(`  Page ${pageNum}: ${wordCount} words (target: ${expectedWordCount} avg)${isTooShort ? ' ⚠️ TOO SHORT!' : ' ✓'}`)
    })
    
    const avgWordCount = storyData.pages.reduce((sum: number, page: any) => {
      return sum + (page.text ? page.text.split(/\s+/).length : 0)
    }, 0) / storyData.pages.length
    console.log(`  Average: ${avgWordCount.toFixed(1)} words per page (target: ${expectedWordCount})`)
    
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
        model: 'gpt-4o-mini',
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

    return successResponse(
      response,
      'Story generated successfully',
      {
        cost: `~$${((tokensUsed / 1000) * 0.005).toFixed(4)}`, // Rough estimate
        characterUsage: character.total_books + 1,
      }
    )
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

