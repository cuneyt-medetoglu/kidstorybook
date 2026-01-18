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
import { generateFullPagePrompt, detectRiskySceneElements, getSafeSceneAlternative } from '@/lib/prompts/image/v1.0.0/scene'
import { successResponse, errorResponse, handleAPIError } from '@/lib/api/response'

export interface ImageGenerationRequest {
  bookId: string
  startPage?: number // For resuming failed generations
  endPage?: number   // For partial generation
  // NOTE: model, size, quality removed - now hardcoded to gpt-image-1.5 / 1024x1536 / low
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
    const size = '1024x1536' // Portrait orientation
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
    // 4. PREPARE IMAGE GENERATION - GET ALL CHARACTERS
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

    // Get ALL characters for this book (main + additional)
    const characterIds = book.story_data?.metadata?.characterIds || [book.character_id]
    const characters = await Promise.all(
      characterIds.map(async (charId: string) => {
        const { data } = await getCharacterById(supabase, charId)
        return data
      })
    )
    const validCharacters = characters.filter(Boolean)
    
    console.log(`[Image Generation] Starting generation for book ${bookId}`)
    console.log(`[Image Generation] Pages: ${startPage}-${actualEndPage} of ${totalPages}`)
    console.log(`[Image Generation] Model: ${model} | Size: ${size} | Quality: ${quality}`)
    console.log(`[Image Generation] Characters: ${validCharacters.length} (main: ${character.name})`)
    if (validCharacters.length > 1) {
      console.log(`[Image Generation] Additional characters:`, validCharacters.slice(1).map(c => c.name).join(', '))
    }

    // ====================================================================
    // 5. GENERATE IMAGES FOR EACH PAGE (COVER-AS-REFERENCE APPROACH)
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

    // Get ALL character reference photos
    const allCharacterReferences = validCharacters
      .map((char) => char.reference_photo_url)
      .filter((url): url is string => Boolean(url))

    console.log(`[Image Generation] Total reference images: ${allCharacterReferences.length}`)

    // Build character prompt once (used for all pages)
    const additionalCharacters = validCharacters.slice(1).map((char) => ({
      type: char.character_type || {
        group: "Child",
        value: "Child",
        displayName: char.name,
      },
      description: char.description,
    }))
    
    const characterPrompt = additionalCharacters.length > 0
      ? require('@/lib/prompts/image/v1.0.0/character').buildMultipleCharactersPrompt(character.description, additionalCharacters)
      : buildCharacterPrompt(character.description)
    
    // Get age group from book metadata or default
    const ageGroup = book.story_data?.metadata?.ageGroup || book.age_group || 'preschool'
    
    // Get theme key from book
    const themeKey = book.theme || 'adventure'
    
    // Cover image URL (will be set after Page 1 generation)
    let coverImageUrl: string | null = null

    // ====================================================================
    // STEP 1: GENERATE COVER (PAGE 1) FIRST
    // ====================================================================
    if (startPage === 1 && actualEndPage >= 1) {
      const coverPage = pages[0]
      const coverPageNumber = 1
      
      console.log(`[Image Generation] ======================================`)
      console.log(`[Image Generation] STEP 1: Generating COVER (Page 1) FIRST`)
      console.log(`[Image Generation] ======================================`)
      console.log(`[Image Generation] Cover will be used as reference for Pages 2-${totalPages}`)
      console.log(`[Image Generation] ALL ${validCharacters.length} character(s) MUST appear in cover`)
      
      const illustrationStyle = book.illustration_style
      const coverSceneDescription = coverPage.imagePrompt || coverPage.sceneDescription || coverPage.text
      const coverCharacterActionRaw = validCharacters.length > 1
        ? `all ${validCharacters.length} characters standing together prominently, looking at the viewer with a sense of wonder and adventure`
        : coverPage.text || coverSceneDescription
      const coverRiskAnalysis = detectRiskySceneElements(coverSceneDescription, coverCharacterActionRaw)
      const coverCharacterAction = coverRiskAnalysis.hasRisk
        ? getSafeSceneAlternative(coverCharacterActionRaw)
        : coverCharacterActionRaw
      
      const coverMood = themeKey === 'adventure' ? 'exciting' :
                        themeKey === 'fantasy' ? 'mysterious' :
                        themeKey === 'space' ? 'inspiring' :
                        themeKey === 'sports' ? 'exciting' :
                        'happy'
      
      const coverSceneInput = {
        pageNumber: coverPageNumber,
        sceneDescription: coverSceneDescription,
        theme: themeKey,
        mood: coverMood,
        characterAction: coverCharacterAction,
        focusPoint: 'character' as const,
      }

      // Generate cover prompt with isCover=true flag
      const coverPrompt = generateFullPagePrompt(
        characterPrompt,
        coverSceneInput,
        illustrationStyle,
        ageGroup,
        additionalCharacters.length,
        true, // isCover = true (CRITICAL: Cover quality is essential)
        false // useCoverReference = false (no cover yet)
      )

      console.log(`[Image Generation] Cover prompt length:`, coverPrompt.length)
      console.log(`[Image Generation] Cover prompt preview:`, coverPrompt.substring(0, 300) + '...')
      console.log('[Image Generation] 🧾 Cover FULL PROMPT START')
      console.log(coverPrompt)
      console.log('[Image Generation] 🧾 Cover FULL PROMPT END')
      if (coverRiskAnalysis.hasRisk) {
        console.log('[Image Generation] ⚠️  Cover risky scene detected:', coverRiskAnalysis.riskyElements)
        console.log('[Image Generation] ✅ Cover safe action applied:', coverCharacterAction)
      }
      
      // Build FormData for cover (only original reference photos)
      const coverFormData = new FormData()
      coverFormData.append('model', model)
      coverFormData.append('prompt', coverPrompt)
      coverFormData.append('size', size)
      coverFormData.append('quality', quality)
      
      // Add ALL character reference images to cover
      console.log(`[Image Generation] Adding ${allCharacterReferences.length} reference images to cover`)
      if (allCharacterReferences.length > 0) {
        console.log('[Image Generation] Cover reference image URLs (full):')
        allCharacterReferences.forEach((url, index) => {
          console.log(`[Image Generation]   - character_${index + 1}: ${url}`)
        })
      }
      for (let idx = 0; idx < allCharacterReferences.length; idx++) {
        const imgUrl = allCharacterReferences[idx]
        
        if (imgUrl.startsWith('data:')) {
          const base64Data = imgUrl.split(',')[1]
          const mimeType = imgUrl.split(';')[0].split(':')[1]
          const binaryStr = atob(base64Data)
          const len = binaryStr.length
          const bytes = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i)
          }
          const blob = new Blob([bytes], { type: mimeType })
          coverFormData.append('image[]', blob, `reference_${idx}.png`)
        } else {
          const imageRes = await fetch(imgUrl)
          const imageBlob = await imageRes.blob()
          coverFormData.append('image[]', imageBlob, `reference_${idx}.png`)
        }
      }
      
      // Generate cover
      const coverApiResponse = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: coverFormData,
      })

      if (!coverApiResponse.ok) {
        const errorText = await coverApiResponse.text()
        console.error(`[Image Generation] Cover generation failed:`, coverApiResponse.status, errorText)
        throw new Error(`Cover generation failed: ${coverApiResponse.status} - ${errorText}`)
      }

      const coverApiResult = await coverApiResponse.json()
      const coverTempUrl = coverApiResult.data?.[0]?.url

      if (!coverTempUrl) {
        throw new Error('No cover image URL found in GPT-image API response')
      }

      console.log(`[Image Generation] ✅ Cover generated successfully`)
      
      // Upload cover to Supabase Storage
      const coverImageBuffer = await fetch(coverTempUrl).then((res) => res.arrayBuffer())
      const coverFileName = `cover_${Date.now()}.png`
      const coverFilePath = `${user.id}/books/${bookId}/${coverFileName}`

      const { error: coverUploadError } = await supabase.storage
        .from('book-images')
        .upload(coverFilePath, coverImageBuffer, {
          contentType: 'image/png',
          upsert: false,
        })

      if (coverUploadError) {
        console.error(`[Image Generation] Cover upload failed:`, coverUploadError)
        throw new Error(`Failed to upload cover: ${coverUploadError.message}`)
      }

      const { data: coverPublicUrlData } = supabase.storage
        .from('book-images')
        .getPublicUrl(coverFilePath)

      coverImageUrl = coverPublicUrlData?.publicUrl || coverTempUrl

      console.log(`[Image Generation] ✅ Cover uploaded to storage:`, coverImageUrl)
      
      generatedImages.push({
        pageNumber: coverPageNumber,
        imageUrl: coverImageUrl,
        storagePath: coverFilePath,
        prompt: coverPrompt,
      })

      imagesGenerated++

      // Update cover page in database
      const updatedPagesAfterCover = [...pages]
      updatedPagesAfterCover[0] = {
        ...updatedPagesAfterCover[0],
        imageUrl: coverImageUrl,
      }

      await updateBook(supabase, bookId, {
        story_data: {
          ...book.story_data,
          pages: updatedPagesAfterCover,
        },
      })
      
      console.log(`[Image Generation] ======================================`)
      console.log(`[Image Generation] Cover generation COMPLETE`)
      console.log(`[Image Generation] Cover URL will be used as reference for remaining pages`)
      console.log(`[Image Generation] ======================================`)
    }

    // ====================================================================
    // STEP 2: GENERATE PAGES 2-10 (WITH COVER AS REFERENCE)
    // ====================================================================
    const pagesToGenerate = startPage === 1 ? 2 : startPage
    
    for (let i = pagesToGenerate - 1; i < actualEndPage; i++) {
      const page = pages[i]
      const pageNumber = page.pageNumber

      console.log(`[Image Generation] Generating image for page ${pageNumber}/${totalPages}`)

      // Build prompt for this page
      const illustrationStyle = book.illustration_style
      const sceneDescription = page.imagePrompt || page.sceneDescription || page.text
      
      // Extract character action from page text
      const characterActionRaw = page.text || sceneDescription
      const riskAnalysis = detectRiskySceneElements(sceneDescription, characterActionRaw)
      const characterAction = riskAnalysis.hasRisk
        ? getSafeSceneAlternative(characterActionRaw)
        : characterActionRaw
      
      // Determine focus point
      const focusPoint: 'character' | 'environment' | 'balanced' = 
        pageNumber === totalPages ? 'balanced' : 'balanced'
      
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

      // Generate full page prompt with useCoverReference=true
      const fullPrompt = generateFullPagePrompt(
        characterPrompt,
        sceneInput,
        illustrationStyle,
        ageGroup,
        additionalCharacters.length,
        false, // isCover = false
        true // useCoverReference = true (use cover as reference)
      )

      console.log(`[Image Generation] Page ${pageNumber} prompt:`, fullPrompt.substring(0, 200) + '...')
      console.log(`[Image Generation] 🧾 Page ${pageNumber} FULL PROMPT START`)
      console.log(fullPrompt)
      console.log(`[Image Generation] 🧾 Page ${pageNumber} FULL PROMPT END`)
      if (riskAnalysis.hasRisk) {
        console.log(`[Image Generation] ⚠️  Page ${pageNumber} risky scene detected:`, riskAnalysis.riskyElements)
        console.log(`[Image Generation] ✅ Page ${pageNumber} safe action applied:`, characterAction)
      }

      // Build FormData with ALL reference images + Cover image
      const formData = new FormData()
      formData.append('model', model)
      formData.append('prompt', fullPrompt)
      formData.append('size', size)
      formData.append('quality', quality)
      
      // Combine: Original character photos + Cover image
      const referenceImages = coverImageUrl 
        ? [...allCharacterReferences, coverImageUrl]
        : allCharacterReferences
      
      console.log(`[Image Generation] Page ${pageNumber} references:`, {
        originalPhotos: allCharacterReferences.length,
        coverImage: coverImageUrl ? 'Yes' : 'No',
        totalReferences: referenceImages.length
      })
      if (referenceImages.length > 0) {
        console.log(`[Image Generation] Page ${pageNumber} reference image URLs (full):`)
        referenceImages.forEach((url, index) => {
          const label = coverImageUrl && index === referenceImages.length - 1
            ? 'cover'
            : `character_${index + 1}`
          console.log(`[Image Generation]   - ${label}: ${url}`)
        })
      }
      
      // Add ALL reference images (original photos + cover)
      for (let idx = 0; idx < referenceImages.length; idx++) {
        const imgUrl = referenceImages[idx]
        
        if (imgUrl.startsWith('data:')) {
          // Convert base64 to Blob
          const base64Data = imgUrl.split(',')[1]
          const mimeType = imgUrl.split(';')[0].split(':')[1]
          const binaryStr = atob(base64Data)
          const len = binaryStr.length
          const bytes = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i)
          }
          const blob = new Blob([bytes], { type: mimeType })
          formData.append('image[]', blob, `reference_${idx}.png`)
        } else {
          // Fetch image from URL
          const imageRes = await fetch(imgUrl)
          const imageBlob = await imageRes.blob()
          formData.append('image[]', imageBlob, `reference_${idx}.png`)
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
