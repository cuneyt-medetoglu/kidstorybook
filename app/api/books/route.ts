/**
 * Books API
 * 
 * POST /api/books - Create new book (triggers story generation)
 * GET /api/books - Get user's books
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
// Note: createClient now supports Bearer token from Authorization header
import { getCharacterById } from '@/lib/db/characters'
import { createBook, getUserBooks } from '@/lib/db/books'
import { generateStoryPrompt } from '@/lib/prompts/story/v1.0.0/base'
import { successResponse, errorResponse, handleAPIError, CommonErrors } from '@/lib/api/response'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface CreateBookRequest {
  characterId: string
  theme: string
  illustrationStyle: string
  customRequests?: string
  language?: 'en' | 'tr'
}

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
}

// ============================================================================
// POST /api/books - Create new book and generate story
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Authentication (supports both Bearer token and session cookies)
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return CommonErrors.unauthorized('Please login to continue')
    }

    // Parse & Validate Request
    const body: CreateBookRequest = await request.json()
    const {
      characterId,
      theme,
      illustrationStyle,
      customRequests,
      language = 'en',
    } = body

    if (!characterId || !theme || !illustrationStyle) {
      return CommonErrors.badRequest(
        'characterId, theme, and illustrationStyle are required'
      )
    }

    // Get Character (using authenticated supabase client)
    const { data: character, error: charError } = await getCharacterById(supabase, characterId)

    if (charError || !character) {
      return CommonErrors.notFound('Character')
    }

    // Verify ownership
    if (character.user_id !== user.id) {
      return CommonErrors.forbidden('You do not own this character')
    }

    // Generate Story Prompt
    const storyPrompt = generateStoryPrompt({
      characterName: character.name,
      characterAge: character.age,
      characterGender: character.gender,
      theme,
      illustrationStyle,
      customRequests,
      referencePhotoAnalysis: {
        detectedFeatures: character.description.physicalFeatures || {},
        finalDescription: character.description,
        confidence: character.analysis_confidence || 0.8,
      },
      language,
    })

    console.log(`Starting story generation for book: ${character.name} - ${theme}`)

    // Call OpenAI GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional children\'s book author. Create engaging, age-appropriate stories with detailed image prompts.',
        },
        {
          role: 'user',
          content: storyPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 4000,
    })

    const storyContent = completion.choices[0].message.content
    if (!storyContent) {
      throw new Error('No story content generated')
    }

    // Parse JSON response
    const storyData = JSON.parse(storyContent)

    // Validate Story Structure
    if (!storyData.title || !storyData.pages || !Array.isArray(storyData.pages)) {
      throw new Error('Invalid story structure from AI')
    }

    // Create Book in Database
    const { data: book, error: bookError } = await createBook(supabase, user.id, {
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
      images_data: [], // Will be populated after image generation
      generation_metadata: {
        model: 'gpt-4o',
        promptVersion: '1.0.0',
        tokensUsed: completion.usage?.total_tokens || 0,
        generationTime: Date.now() - startTime,
      },
    })

    if (bookError || !book) {
      console.error('Database error:', bookError)
      throw new Error('Failed to save book to database')
    }

    // Prepare Response
    const generationTime = Date.now() - startTime
    const tokensUsed = completion.usage?.total_tokens || 0

    console.log(
      `Book created successfully: ${book.id} (${generationTime}ms, ${tokensUsed} tokens)`
    )

    const response: CreateBookResponse = {
      id: book.id,
      title: book.title,
      status: book.status,
      totalPages: book.total_pages,
      theme: book.theme,
      illustrationStyle: book.illustration_style,
      character: {
        id: character.id,
        name: character.name,
      },
      generationTime,
      tokensUsed,
      story_data: storyData, // Include story content in response for debug/preview
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
    // Authentication (supports both Bearer token and session cookies)
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return CommonErrors.unauthorized('Please login to continue')
    }

    // Parse Query Parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Get User's Books
    const { data: books, error: dbError } = await getUserBooks(supabase, user.id, {
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

