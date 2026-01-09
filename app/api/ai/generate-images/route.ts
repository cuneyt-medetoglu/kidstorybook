/**
 * Image Generation API
 * 
 * POST /api/ai/generate-images
 * Generates all images for a book using DALL-E 3 with character consistency
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBookById, updateBook } from '@/lib/db/books'
import { getCharacterById } from '@/lib/db/characters'
import { buildDetailedCharacterPrompt } from '@/lib/prompts/image/v1.0.0/character'
import { generateFullPagePrompt } from '@/lib/prompts/image/v1.0.0/scene'
import { getNegativePrompt } from '@/lib/prompts/image/v1.0.0/negative'
import { successResponse, errorResponse, handleAPIError } from '@/lib/api/response'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ImageGenerationRequest {
  bookId: string
  startPage?: number // For resuming failed generations
  endPage?: number   // For partial generation
}

export interface ImageGenerationResponse {
  bookId: string
  title: string
  imagesGenerated: number
  totalPages: number
  images: Array<{
    pageNumber: number
    imageUrl: string
    storagePath: string
    prompt: string
    revisedPrompt?: string
  }>
  generationTime: number
  totalCost: number
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let imagesGenerated = 0
  let totalCost = 0

  try {
    // ====================================================================
    // 1. Authentication
    // ====================================================================
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 'Please login to continue', 401)
    }

    // ====================================================================
    // 2. Parse & Validate Request
    // ====================================================================
    const body: ImageGenerationRequest = await request.json()
    const { bookId, startPage = 1, endPage } = body

    if (!bookId) {
      return errorResponse('Missing bookId', 'bookId is required', 400)
    }

    // ====================================================================
    // 3. Get Book
    // ====================================================================
    const { data: book, error: bookError } = await getBookById(bookId)

    if (bookError || !book) {
      return errorResponse('Book not found', 'Invalid book ID', 404)
    }

    // Verify ownership
    if (book.user_id !== user.id) {
      return errorResponse('Forbidden', 'You do not own this book', 403)
    }

    // Check if story data exists
    if (!book.story_data || !book.story_data.pages) {
      return errorResponse(
        'Invalid book data',
        'Book must have story data before generating images',
        400
      )
    }

    // ====================================================================
    // 4. Get Character
    // ====================================================================
    let characterPrompt = ''
    let ageGroup = book.age_group || 'preschool'

    if (book.character_id) {
      const { data: character } = await getCharacterById(book.character_id)
      if (character) {
        characterPrompt = buildDetailedCharacterPrompt(
          character.description,
          book.illustration_style
        )
      }
    }

    // ====================================================================
    // 5. Update Book Status
    // ====================================================================
    await updateBook(bookId, { status: 'generating' })

    // ====================================================================
    // 6. Generate Images for Each Page
    // ====================================================================
    const pages = book.story_data.pages
    const finalEndPage = endPage || pages.length
    const images: ImageGenerationResponse['images'] = []
    const errors: string[] = []

    console.log(
      `Starting image generation for book: ${book.title} (${startPage}-${finalEndPage})`
    )

    for (let i = startPage - 1; i < finalEndPage; i++) {
      const page = pages[i]
      if (!page) continue

      try {
        console.log(`Generating image for page ${page.pageNumber}...`)

        // Build full prompt
        const sceneInput = {
          pageNumber: page.pageNumber,
          sceneDescription: page.sceneDescription || page.imagePrompt,
          theme: book.theme,
          mood: 'happy',
          characterAction: 'in the scene',
          focusPoint: 'balanced' as const,
        }

        const fullPrompt = characterPrompt
          ? `${characterPrompt}, ${page.imagePrompt}`
          : page.imagePrompt

        // Get negative prompt
        const negativePrompt = getNegativePrompt(
          ageGroup,
          book.illustration_style,
          book.theme
        )

        // Generate image with DALL-E 3
        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: fullPrompt,
          n: 1,
          size: '1024x1024', // DALL-E 3 supports: 1024x1024, 1792x1024, 1024x1792
          quality: 'standard', // or 'hd' for higher quality (more expensive)
          style: 'vivid', // or 'natural'
        })

        const imageUrl = imageResponse.data[0].url
        const revisedPrompt = imageResponse.data[0].revised_prompt

        if (!imageUrl) {
          throw new Error('No image URL returned from DALL-E')
        }

        // ====================================================================
        // 7. Download and Upload to Supabase Storage
        // ====================================================================
        const imageBlob = await fetch(imageUrl).then((r) => r.blob())
        const fileName = `${bookId}/page-${page.pageNumber}.png`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('book-images')
          .upload(fileName, imageBlob, {
            contentType: 'image/png',
            upsert: true,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error('Failed to upload image to storage')
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('book-images').getPublicUrl(fileName)

        // Add to images array
        images.push({
          pageNumber: page.pageNumber,
          imageUrl: publicUrl,
          storagePath: fileName,
          prompt: fullPrompt,
          revisedPrompt,
        })

        imagesGenerated++

        // Cost calculation (DALL-E 3 pricing)
        // Standard 1024x1024: $0.040 per image
        // HD 1024x1024: $0.080 per image
        totalCost += 0.04

        console.log(`✓ Page ${page.pageNumber} image generated and uploaded`)

        // Small delay to avoid rate limiting (optional)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error generating image for page ${page.pageNumber}:`, error)
        errors.push(`Page ${page.pageNumber}: ${error}`)

        // Continue with next page instead of failing entire generation
        continue
      }
    }

    // ====================================================================
    // 8. Update Book with Images
    // ====================================================================
    const status = imagesGenerated === pages.length ? 'completed' : 'failed'

    await updateBook(bookId, {
      status,
      images_data: images,
      cover_image_url: images[0]?.imageUrl, // First page as cover
      cover_image_path: images[0]?.storagePath,
      generation_metadata: {
        ...book.generation_metadata,
        imagesGenerated,
        totalCost: (book.generation_metadata?.totalCost || 0) + totalCost,
        imageModel: 'dall-e-3',
        imageGenerationTime: Date.now() - startTime,
        errors: errors.length > 0 ? errors : undefined,
      },
    })

    // ====================================================================
    // 9. Prepare Response
    // ====================================================================
    const generationTime = Date.now() - startTime

    console.log(
      `Image generation completed: ${imagesGenerated}/${pages.length} images in ${generationTime}ms`
    )

    const response: ImageGenerationResponse = {
      bookId: book.id,
      title: book.title,
      imagesGenerated,
      totalPages: pages.length,
      images,
      generationTime,
      totalCost,
    }

    return successResponse(
      response,
      imagesGenerated === pages.length
        ? 'All images generated successfully'
        : `Generated ${imagesGenerated}/${pages.length} images`,
      {
        status,
        errors: errors.length > 0 ? errors : undefined,
        cost: `$${totalCost.toFixed(2)}`,
        averageTimePerImage: `${(generationTime / imagesGenerated / 1000).toFixed(1)}s`,
      }
    )
  } catch (error) {
    console.error('Image generation error:', error)

    // Try to update book status to failed
    try {
      const { bookId } = await request.json()
      if (bookId) {
        await updateBook(bookId, { status: 'failed' })
      }
    } catch {}

    return handleAPIError(error)
  }
}

// ============================================================================
// GET - Get Image Generation Status (for polling)
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')

    if (!bookId) {
      return errorResponse('Missing bookId', 'bookId query parameter is required', 400)
    }

    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 'Please login to continue', 401)
    }

    const { data: book, error } = await getBookById(bookId)

    if (error || !book) {
      return errorResponse('Book not found', 'Invalid book ID', 404)
    }

    if (book.user_id !== user.id) {
      return errorResponse('Forbidden', 'You do not own this book', 403)
    }

    return successResponse({
      bookId: book.id,
      status: book.status,
      imagesGenerated: book.images_data?.length || 0,
      totalPages: book.total_pages,
      progress: ((book.images_data?.length || 0) / book.total_pages) * 100,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

