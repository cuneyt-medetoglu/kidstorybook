/**
 * Image Generation API
 * 
 * POST /api/ai/generate-images
 * Generates all images for a book using GPT-image API with character consistency
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { uploadFile, getPublicUrl } from '@/lib/storage/s3'
import { getBookById, updateBook } from '@/lib/db/books'
import { getCharacterById } from '@/lib/db/characters'
import { buildCharacterPrompt, buildMultipleCharactersPrompt } from '@/lib/prompts/image/character'
import { generateFullPagePrompt, detectRiskySceneElements, getSafeSceneAlternative } from '@/lib/prompts/image/scene'
import { successResponse, errorResponse, handleAPIError } from '@/lib/api/response'
import { imageEditWithLog } from '@/lib/ai/images'

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
    const user = await requireUser()

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
      return errorResponse('Missing required field: bookId', undefined, 400)
    }

    // ====================================================================
    // 3. FETCH BOOK & CHARACTER DATA
    // ====================================================================
    const { data: book, error: bookError } = await getBookById(bookId)
    if (bookError || !book) {
      return errorResponse('Book not found', undefined, 404)
    }

    // Check ownership
    if (book.user_id !== user.id) {
      return errorResponse('Unauthorized', undefined, 403)
    }

    // Check if book has story data
    if (!book.story_data || !book.story_data.pages) {
      return errorResponse('Book has no story data. Generate story first.', undefined, 400)
    }

    const characterId = book.character_id
    if (!characterId) {
      return errorResponse('Book has no character', undefined, 404)
    }
    const { data: character, error: charError } = await getCharacterById(characterId)
    if (charError || !character) {
      return errorResponse('Character not found', undefined, 404)
    }

    // ====================================================================
    // 4. PREPARE IMAGE GENERATION - GET ALL CHARACTERS
    // ====================================================================
    const pages = book.story_data.pages
    const totalPages = pages.length
    const actualEndPage = endPage || totalPages

    if (startPage < 1 || startPage > totalPages) {
      return errorResponse(`Invalid startPage: ${startPage}. Must be between 1 and ${totalPages}`, undefined, 400)
    }

    if (actualEndPage < startPage || actualEndPage > totalPages) {
      return errorResponse(`Invalid endPage: ${actualEndPage}. Must be between ${startPage} and ${totalPages}`, undefined, 400)
    }

    // Get ALL characters for this book (main + additional)
    const characterIds = book.story_data?.metadata?.characterIds || [book.character_id]
    const characters = await Promise.all(
      characterIds.map(async (charId: string) => {
        const { data } = await getCharacterById(charId)
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
      ? buildMultipleCharactersPrompt(character.description, additionalCharacters)
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
        console.log('[Image Generation] Cover reference images:', allCharacterReferences.length)
        allCharacterReferences.forEach((url, index) => {
          const preview = url.startsWith('data:') ? `[data URL, ${url.length} chars]` : url.slice(0, 80) + (url.length > 80 ? '...' : '')
          console.log(`[Image Generation]   - character_${index + 1}: ${preview}`)
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
      const coverApiResult = await imageEditWithLog(coverFormData, {
        userId: user.id,
        bookId,
        operationType: 'image_cover',
        model,
        quality,
        size,
        refImageCount: allCharacterReferences.length,
      })
      const coverTempUrl = coverApiResult.data?.[0]?.url

      if (!coverTempUrl) {
        throw new Error('No cover image URL found in GPT-image API response')
      }

      console.log(`[Image Generation] ✅ Cover generated successfully`)
      
      // Upload cover to AWS S3
      const coverImageBuffer = await fetch(coverTempUrl).then((res) => res.arrayBuffer())
      const coverFileName = `${user.id}/books/${bookId}/cover_${Date.now()}.png`

      const coverS3Key = await uploadFile('covers', coverFileName, Buffer.from(coverImageBuffer), 'image/png')
      const coverStorageUrl = getPublicUrl(coverS3Key)
      const coverFinalUrl = coverStorageUrl || coverTempUrl
      coverImageUrl = coverFinalUrl

      console.log(`[Image Generation] ✅ Cover uploaded to storage:`, coverFinalUrl)
      
      generatedImages.push({
        pageNumber: coverPageNumber,
        imageUrl: coverFinalUrl,
        storagePath: coverS3Key,
        prompt: coverPrompt,
      })

      imagesGenerated++

      // Update cover page in database
      const updatedPagesAfterCover = [...pages]
      updatedPagesAfterCover[0] = {
        ...updatedPagesAfterCover[0],
        imageUrl: coverStorageUrl,
      }

      await updateBook(bookId, {
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
      
      // A5: Optional shotPlan from story; pass through if present
      const pageShotPlan = (page as { shotPlan?: { shotType?: string; lens?: string; cameraAngle?: string; placement?: string; timeOfDay?: string; mood?: string } }).shotPlan
      const hasValidShotPlan = pageShotPlan && typeof pageShotPlan === 'object' && !Array.isArray(pageShotPlan)

      // Create SceneInput object for generateFullPagePrompt
      const sceneInput = {
        pageNumber,
        sceneDescription,
        theme: themeKey,
        mood,
        characterAction,
        focusPoint,
        ...(hasValidShotPlan && { shotPlan: pageShotPlan }),
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
        console.log(`[Image Generation] Page ${pageNumber} reference images:`, referenceImages.length)
        referenceImages.forEach((url, index) => {
          const label = coverImageUrl && index === referenceImages.length - 1
            ? 'cover'
            : `character_${index + 1}`
          const preview = url.startsWith('data:') ? `[data URL, ${url.length} chars]` : url.slice(0, 80) + (url.length > 80 ? '...' : '')
          console.log(`[Image Generation]   - ${label}: ${preview}`)
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

      const apiResult = await imageEditWithLog(formData, {
        userId: user.id,
        bookId,
        operationType: 'image_page',
        pageIndex: pageNumber,
        model,
        quality,
        size,
        refImageCount: referenceImages.length,
      })

      // Extract image URL from response (standard images API format)
      const imageUrl = apiResult.data?.[0]?.url

      if (!imageUrl) {
        console.error(`[Image Generation] Could not extract image URL for page ${pageNumber}. hasData:`, !!apiResult?.data, ', dataLength:', apiResult?.data?.length)
        throw new Error(`No image URL found in GPT-image API response for page ${pageNumber}`)
      }

      console.log(`[Image Generation] Page ${pageNumber} image generated:`, imageUrl)

      // Download and upload to S3
      const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer())
      const fileName = `${user.id}/books/${bookId}/page_${pageNumber}_${Date.now()}.png`

      const s3Key = await uploadFile('books', fileName, Buffer.from(imageBuffer), 'image/png')
      const storageUrl = getPublicUrl(s3Key)

      console.log(`[Image Generation] Page ${pageNumber} uploaded to S3:`, storageUrl)

      generatedImages.push({
        pageNumber,
        imageUrl: storageUrl,
        storagePath: s3Key,
        prompt: fullPrompt,
      })

      imagesGenerated++

      // Update page with image URL in database
      const updatedPages = [...pages]
      updatedPages[i] = {
        ...updatedPages[i],
        imageUrl: storageUrl,
      }

      await updateBook(bookId, {
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
      await updateBook(bookId, {
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
    return handleAPIError(error)
  }
}
