/**
 * Image Generation API
 * 
 * POST /api/ai/generate-images
 * Generates all images for a book using GPT-image API with character consistency
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBookById, updateBook } from '@/lib/db/books'
import { getCharacterById } from '@/lib/db/characters'
import { buildCharacterPrompt } from '@/lib/prompts/image/v1.0.0/character'
import { generateFullPagePrompt } from '@/lib/prompts/image/v1.0.0/scene'
import { successResponse, errorResponse, handleAPIError } from '@/lib/api/response'

export interface ImageGenerationRequest {
  bookId: string
  startPage?: number // For resuming failed generations
  endPage?: number   // For partial generation
  // NOTE: model, size, quality removed - now hardcoded to gpt-image-1.5 / 1024x1024 / low
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
  }>
  generationTime: number
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let imagesGenerated = 0

  try {
    // ====================================================================
    // 1. AUTHENTICATION & AUTHORIZATION
    // ====================================================================
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    // ====================================================================
    // 2. PARSE & VALIDATE REQUEST
    // ====================================================================
    const body: ImageGenerationRequest = await request.json()
    const { bookId, startPage = 1, endPage } = body

    // Image generation defaults (hardcoded - no override)
    const model = 'gpt-image-1.5'
    const size = '1024x1024'
    const quality = 'low'

    if (!bookId) {
      return errorResponse('Missing required field: bookId', 400)
    }

    // ====================================================================
    // 3. FETCH BOOK & CHARACTER DATA
    // ====================================================================
    const book = await getBookById(supabase, bookId)
    if (!book) {
      return errorResponse('Book not found', 404)
    }

    // Check ownership
    if (book.user_id !== user.id) {
      return errorResponse('Unauthorized', 403)
    }

    // Check if book has story data
    if (!book.story_data || !book.story_data.pages) {
      return errorResponse('Book has no story data. Generate story first.', 400)
    }

    const character = await getCharacterById(supabase, book.character_id)
    if (!character) {
      return errorResponse('Character not found', 404)
    }

    // ====================================================================
    // 4. PREPARE IMAGE GENERATION
    // ====================================================================
    const pages = book.story_data.pages
    const totalPages = pages.length
    const actualEndPage = endPage || totalPages

    if (startPage < 1 || startPage > totalPages) {
      return errorResponse(`Invalid startPage: ${startPage}. Must be between 1 and ${totalPages}`, 400)
    }

    if (actualEndPage < startPage || actualEndPage > totalPages) {
      return errorResponse(`Invalid endPage: ${actualEndPage}. Must be between ${startPage} and ${totalPages}`, 400)
    }

    console.log(`[Image Generation] Starting generation for book ${bookId}`)
    console.log(`[Image Generation] Pages: ${startPage}-${actualEndPage} of ${totalPages}`)
    console.log(`[Image Generation] Model: ${model} | Size: ${size} | Quality: ${quality}`)
    console.log(`[Image Generation] Character: ${character.name} (${character.id})`)

    // ====================================================================
    // 5. GENERATE IMAGES FOR EACH PAGE
    // ====================================================================
    const generatedImages: Array<{
      pageNumber: number
      imageUrl: string
      storagePath: string
      prompt: string
    }> = []

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Get reference photo URL if available
    const referenceImageUrl = character.reference_photo_url || null

    // Build character prompt once (used for all pages)
    const characterPrompt = buildCharacterPrompt(character.description)
    
    // Get age group from book metadata or default
    const ageGroup = book.story_data?.metadata?.ageGroup || book.age_group || 'preschool'
    
    // Get theme key from book
    const themeKey = book.theme || 'adventure'

    for (let i = startPage - 1; i < actualEndPage; i++) {
      const page = pages[i]
      const pageNumber = page.pageNumber

      console.log(`[Image Generation] Generating image for page ${pageNumber}/${totalPages}`)

      // Build prompt for this page
      const illustrationStyle = book.illustration_style
      const sceneDescription = page.imagePrompt || page.sceneDescription || page.text
      
      // Extract character action from page text
      const characterAction = page.text || sceneDescription
      
      // Determine focus point (first page = character focus, last page = balanced, others = balanced)
      const focusPoint: 'character' | 'environment' | 'balanced' = 
        pageNumber === 1 ? 'character' : 
        pageNumber === totalPages ? 'balanced' : 
        'balanced'
      
      // Determine mood from theme or use default
      const mood = themeKey === 'adventure' ? 'exciting' :
                   themeKey === 'fantasy' ? 'mysterious' :
                   themeKey === 'space' ? 'inspiring' :
                   themeKey === 'sports' ? 'exciting' :
                   'happy'
      
      // Create SceneInput object for generateFullPagePrompt
      const sceneInput = {
        pageNumber,
        sceneDescription,
        theme: themeKey,
        mood,
        characterAction,
        focusPoint,
      }

      // Generate full page prompt with correct parameters
      const fullPrompt = generateFullPagePrompt(
        characterPrompt,
        sceneInput,
        illustrationStyle,
        ageGroup
      )

      console.log(`[Image Generation] Page ${pageNumber} prompt:`, fullPrompt.substring(0, 200) + '...')

      // Build input array for /v1/responses endpoint (must be items with allowed types)
      const messageContent: any[] = [
        {
          type: 'input_text',
          text: fullPrompt,
        },
      ]

      // Add reference image if available
      // image_url must be a direct string (URL), not an object!
      if (referenceImageUrl) {
        messageContent.push({
          type: 'input_image',
          image_url: referenceImageUrl, // ✅ Direkt string (URL), object değil!
        })
      }

      const inputItems: any[] = [
        {
          type: 'message',
          role: 'user',
          content: messageContent,
        },
      ]

      // Call GPT-image API using /v1/images/edits endpoint
      // This endpoint supports text prompt + reference image (multimodal)
      
      const formData = new FormData()
      formData.append('model', model)
      formData.append('prompt', fullPrompt)
      formData.append('size', size)
      formData.append('quality', quality)
      
      // Add reference image if available
      if (referenceImageUrl) {
        // Check if it's a data URL (base64)
        if (referenceImageUrl.startsWith('data:')) {
          // Convert base64 to Blob
          const base64Data = referenceImageUrl.split(',')[1]
          const mimeType = referenceImageUrl.split(';')[0].split(':')[1]
          const binaryStr = atob(base64Data)
          const len = binaryStr.length
          const bytes = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i)
          }
          const blob = new Blob([bytes], { type: mimeType })
          formData.append('image', blob, 'reference.png')
        } else {
          // Fetch image from URL and append as Blob
          const imageRes = await fetch(referenceImageUrl)
          const imageBlob = await imageRes.blob()
          formData.append('image', imageBlob, 'reference.png')
        }
      } else {
        // Fallback to generations if no reference image
        // (Same logic as generate-cover)
        if (!referenceImageUrl) {
          console.log(`[Image Generation] No reference image for page ${pageNumber}, switching to /v1/images/generations`)
          const genResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              prompt: fullPrompt,
              n: 1,
              size,
              quality,
              // NOTE: response_format is NOT supported for GPT-image models
              // Response always returns URL format by default
            })
          })
          
          if (!genResponse.ok) {
             const errorText = await genResponse.text()
             throw new Error(`GPT-image Generation API error: ${genResponse.status} - ${errorText}`)
          }
          
          const genResult = await genResponse.json()
          const imageUrl = genResult.data[0].url
          
          // Use this imageUrl for the rest of the flow...
          // We need to jump to image processing logic below
          
          // ... (Common image processing logic: download, upload, etc.)
          console.log(`[Image Generation] Page ${pageNumber} image generated:`, imageUrl)

          // Download and upload to Supabase Storage
          const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer())
          const fileName = `page_${pageNumber}_${Date.now()}.png`
          const filePath = `${user.id}/books/${bookId}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('book-images')
            .upload(filePath, imageBuffer, {
              contentType: 'image/png',
              upsert: false,
            })

          if (uploadError) {
            console.error(`[Image Generation] Storage upload error for page ${pageNumber}:`, uploadError)
            // Continue with next page, but log error
            generatedImages.push({
              pageNumber,
              imageUrl: imageUrl, // Use temporary URL
              storagePath: 'upload_failed',
              prompt: fullPrompt,
              revisedPrompt: genResult.data[0].revised_prompt,
            })
            continue // Next page
          }

          const { data: publicUrlData } = supabase.storage
            .from('book-images')
            .getPublicUrl(filePath)

          const storageImageUrl = publicUrlData?.publicUrl || imageUrl

          generatedImages.push({
            pageNumber,
            imageUrl: storageImageUrl,
            storagePath: filePath,
            prompt: fullPrompt,
            revisedPrompt: genResult.data[0].revised_prompt,
          })
          imagesGenerated++
          totalCost += 0.04 // Placeholder cost
          continue // Skip the rest of the loop for this page
        }
      }

      const apiResponse = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          // Content-Type header is set automatically with FormData
        },
        body: formData,
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error(`[Image Generation] API Error for page ${pageNumber}:`, apiResponse.status, errorText)
        throw new Error(`GPT-image API error: ${apiResponse.status} - ${errorText}`)
      }

      const apiResult = await apiResponse.json()

      // Extract image URL from response (standard images API format)
      const imageUrl = apiResult.data?.[0]?.url

      if (!imageUrl) {
        console.error(`[Image Generation] Could not extract image URL for page ${pageNumber}:`, JSON.stringify(apiResult, null, 2))
        throw new Error(`No image URL found in GPT-image API response for page ${pageNumber}`)
      }

      console.log(`[Image Generation] Page ${pageNumber} image generated:`, imageUrl)

      // Download and upload to Supabase Storage
      const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer())
      const fileName = `page_${pageNumber}_${Date.now()}.png`
      const filePath = `${user.id}/books/${bookId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('book-images')
        .upload(filePath, imageBuffer, {
          contentType: 'image/png',
          upsert: false,
        })

      if (uploadError) {
        console.error(`[Image Generation] Storage upload error for page ${pageNumber}:`, uploadError)
        throw new Error(`Failed to upload image for page ${pageNumber}: ${uploadError.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('book-images')
        .getPublicUrl(filePath)

      const storageUrl = publicUrlData?.publicUrl || imageUrl

      console.log(`[Image Generation] Page ${pageNumber} uploaded to storage:`, storageUrl)

      generatedImages.push({
        pageNumber,
        imageUrl: storageUrl,
        storagePath: filePath,
        prompt: fullPrompt,
      })

      imagesGenerated++

      // Update page with image URL in database
      const updatedPages = [...pages]
      updatedPages[i] = {
        ...updatedPages[i],
        imageUrl: storageUrl,
      }

      await updateBook(supabase, bookId, {
        story_data: {
          ...book.story_data,
          pages: updatedPages,
        },
      })
    }

    // ====================================================================
    // 6. UPDATE BOOK STATUS
    // ====================================================================
    const allPagesHaveImages = pages.every((p: any) => p.imageUrl)
    if (allPagesHaveImages) {
      await updateBook(supabase, bookId, {
        status: 'completed',
      })
      console.log(`[Image Generation] Book ${bookId} marked as completed`)
    }

    // ====================================================================
    // 7. RETURN RESPONSE
    // ====================================================================
    const generationTime = Date.now() - startTime

    return successResponse<ImageGenerationResponse>(
      {
        bookId,
        title: book.title,
        imagesGenerated,
        totalPages,
        images: generatedImages,
        generationTime,
      },
      'Images generated successfully'
    )
  } catch (error) {
    console.error('[Image Generation] Error:', error)
    return handleAPIError(error, 'Image generation failed')
  }
}
