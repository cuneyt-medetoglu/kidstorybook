/**
 * Image Edit API
 * 
 * POST /api/ai/edit-image
 * Uses OpenAI Image Edit API to fix/edit images with mask-based editing
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBookById, updateBook } from '@/lib/db/books'
import { successResponse, errorResponse, handleAPIError } from '@/lib/api/response'

export interface ImageEditRequest {
  bookId: string
  pageNumber: number
  maskImageBase64: string // Canvas mask as PNG base64
  editPrompt: string // User's edit description
}

export interface ImageEditResponse {
  editedImageUrl: string
  version: number
  quotaRemaining: number
  history: Array<{
    version: number
    imageUrl: string
    editPrompt: string
    createdAt: string
  }>
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

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
    const body: ImageEditRequest = await request.json()
    const { bookId, pageNumber, maskImageBase64, editPrompt } = body

    if (!bookId || !pageNumber || !maskImageBase64 || !editPrompt) {
      return errorResponse('Missing required fields: bookId, pageNumber, maskImageBase64, editPrompt', 400)
    }

    if (pageNumber < 1) {
      return errorResponse('Invalid pageNumber: must be >= 1', 400)
    }

    if (!maskImageBase64.startsWith('data:image/png;base64,')) {
      return errorResponse('maskImageBase64 must be a PNG in base64 format', 400)
    }

    if (editPrompt.trim().length < 5) {
      return errorResponse('editPrompt must be at least 5 characters', 400)
    }

    console.log(`[Image Edit] Starting edit for book ${bookId}, page ${pageNumber}`)
    console.log(`[Image Edit] User: ${user.email}`)
    const promptPrefix = 'Only modify the masked area. Keep the rest of the image unchanged.'
    const finalPrompt = `${promptPrefix} ${editPrompt}`.trim()
    console.log(`[Image Edit] Prompt: ${finalPrompt}`)

    // ====================================================================
    // 3. FETCH BOOK & CHECK OWNERSHIP
    // ====================================================================
    const { data: book, error: bookError } = await getBookById(supabase, bookId)
    if (bookError || !book) {
      return errorResponse('Book not found', 404)
    }

    if (book.user_id !== user.id) {
      return errorResponse('Unauthorized', 403)
    }

    // ====================================================================
    // 4. CHECK EDIT QUOTA
    // ====================================================================
    const quotaUsed = book.edit_quota_used || 0
    const quotaLimit = book.edit_quota_limit || 3

    if (quotaUsed >= quotaLimit) {
      return errorResponse(`Edit quota exceeded. You have used all ${quotaLimit} edits for this book.`, 429)
    }

    console.log(`[Image Edit] Quota check: ${quotaUsed}/${quotaLimit} used`)

    // ====================================================================
    // 5. GET CURRENT IMAGE FOR THE PAGE
    // ====================================================================
    if (!book.story_data || !Array.isArray(book.story_data.pages)) {
      return errorResponse('Book has no story data', 400)
    }

    const pageIndex = pageNumber - 1
    if (pageIndex < 0 || pageIndex >= book.story_data.pages.length) {
      return errorResponse(`Invalid page number: ${pageNumber}. Book has ${book.story_data.pages.length} pages.`, 400)
    }

    const currentPage = book.story_data.pages[pageIndex]
    const currentImageUrl = currentPage.imageUrl

    if (!currentImageUrl) {
      return errorResponse(`Page ${pageNumber} has no image to edit`, 400)
    }

    console.log(`[Image Edit] Current image URL: ${currentImageUrl}`)

    // ====================================================================
    // 6. GET LATEST VERSION NUMBER
    // ====================================================================
    const { data: latestVersionData, error: versionError } = await supabase.rpc('get_latest_page_version', {
      p_book_id: bookId,
      p_page_number: pageNumber,
    })

    if (versionError) {
      console.error('[Image Edit] Error getting latest version:', versionError)
      return errorResponse('Failed to get version history', 500)
    }

    const nextVersion = (latestVersionData || 0) + 1
    console.log(`[Image Edit] Next version: ${nextVersion}`)

    // ====================================================================
    // 7. PREPARE OPENAI API REQUEST
    // ====================================================================
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Fetch current image from URL
    console.log('[Image Edit] Fetching current image...')
    const imageResponse = await fetch(currentImageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch current image: ${imageResponse.statusText}`)
    }
    const imageBlob = await imageResponse.blob()

    // Convert base64 mask to Blob
    console.log('[Image Edit] Converting mask to blob...')
    const base64Data = maskImageBase64.split(',')[1]
    const binaryStr = atob(base64Data)
    const len = binaryStr.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    const maskBlob = new Blob([bytes], { type: 'image/png' })

    // Build FormData
    // According to OpenAI docs: Image Edit API returns b64_json by default
    // Parameters: image, mask, prompt, model, size (optional), quality (optional)
    const formData = new FormData()
    formData.append('image', imageBlob, 'original.png')
    formData.append('mask', maskBlob, 'mask.png')
    formData.append('prompt', finalPrompt)
    // Use same model as image generation (gpt-image-1.5)
    formData.append('model', 'gpt-image-1.5')
    formData.append('size', '1024x1536') // Portrait orientation (same as generation)
    formData.append('quality', 'low') // Same quality as generation
    formData.append('input_fidelity', 'high')

    // ====================================================================
    // 8. CALL OPENAI IMAGE EDIT API
    // ====================================================================
    console.log('[Image Edit] Calling OpenAI Image Edit API...')
    const openaiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error(`[Image Edit] OpenAI API Error: ${openaiResponse.status} - ${errorText}`)
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`)
    }

    const openaiResult = await openaiResponse.json()
    const dataCount = Array.isArray(openaiResult.data) ? openaiResult.data.length : 0
    const firstItem = dataCount > 0 ? openaiResult.data[0] : null
    const b64Length = firstItem?.b64_json ? firstItem.b64_json.length : 0
    console.log('[Image Edit] OpenAI Response Summary:', {
      dataCount,
      b64Length,
      size: openaiResult.size,
      quality: openaiResult.quality,
      output_format: openaiResult.output_format,
      usage: openaiResult.usage ? {
        input_tokens: openaiResult.usage.input_tokens,
        output_tokens: openaiResult.usage.output_tokens,
      } : undefined,
    })
    
    // Image Edit API returns b64_json by default (per OpenAI documentation)
    // Response format: { data: [{ b64_json: string }] }
    let editedImageBase64: string | null = null
    
    if (openaiResult.data && Array.isArray(openaiResult.data) && openaiResult.data.length > 0) {
      const firstItem = openaiResult.data[0]
      editedImageBase64 = firstItem.b64_json || null
    }

    if (!editedImageBase64) {
      console.error('[Image Edit] Missing b64_json in OpenAI response', {
        dataCount,
        hasUsage: Boolean(openaiResult.usage),
        size: openaiResult.size,
        quality: openaiResult.quality,
        output_format: openaiResult.output_format,
      })
      throw new Error('No b64_json found in OpenAI response')
    }

    console.log('[Image Edit] ✅ OpenAI edit successful, converting base64 to buffer...')

    // ====================================================================
    // 9. CONVERT BASE64 TO ARRAYBUFFER & UPLOAD TO SUPABASE STORAGE
    // ====================================================================
    // Convert base64 to ArrayBuffer for storage upload
    const editedBinaryStr = atob(editedImageBase64)
    const editedLen = editedBinaryStr.length
    const editedBytes = new Uint8Array(editedLen)
    for (let i = 0; i < editedLen; i++) {
      editedBytes[i] = editedBinaryStr.charCodeAt(i)
    }
    const editedImageBuffer = editedBytes.buffer
    const editedFileName = `page_${pageNumber}_v${nextVersion}_${Date.now()}.png`
    const editedFilePath = `${user.id}/books/${bookId}/edits/${editedFileName}`

    const { error: uploadError } = await supabase.storage
      .from('book-images')
      .upload(editedFilePath, editedImageBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (uploadError) {
      console.error('[Image Edit] Upload error:', uploadError)
      throw new Error(`Failed to upload edited image: ${uploadError.message}`)
    }

    const { data: publicUrlData } = supabase.storage
      .from('book-images')
      .getPublicUrl(editedFilePath)

    const editedImageUrl = publicUrlData?.publicUrl || editedTempUrl

    console.log('[Image Edit] ✅ Edited image uploaded:', editedImageUrl)

    // ====================================================================
    // 10. UPLOAD MASK IMAGE (OPTIONAL, FOR DEBUGGING)
    // ====================================================================
    let maskImageUrl: string | null = null
    try {
      const maskFileName = `page_${pageNumber}_mask_v${nextVersion}_${Date.now()}.png`
      const maskFilePath = `${user.id}/books/${bookId}/edits/${maskFileName}`

      const { error: maskUploadError } = await supabase.storage
        .from('book-images')
        .upload(maskFilePath, maskBlob, {
          contentType: 'image/png',
          upsert: false,
        })

      if (!maskUploadError) {
        const { data: maskPublicUrlData } = supabase.storage
          .from('book-images')
          .getPublicUrl(maskFilePath)

        maskImageUrl = maskPublicUrlData?.publicUrl || null
      }
    } catch (error) {
      console.warn('[Image Edit] Failed to upload mask (non-critical):', error)
    }

    // ====================================================================
    // 11. INSERT EDIT HISTORY
    // ====================================================================
    const processingTime = Date.now() - startTime

    const { error: historyError } = await supabase
      .from('image_edit_history')
      .insert({
        book_id: bookId,
        page_number: pageNumber,
        version: nextVersion,
        original_image_url: currentImageUrl,
        edited_image_url: editedImageUrl,
        mask_image_url: maskImageUrl,
        edit_prompt: editPrompt,
        ai_model: 'gpt-image-1.5',
        edit_metadata: {
          processingTime,
          maskSize: maskBlob.size,
        },
      })

    if (historyError) {
      console.error('[Image Edit] History insert error:', historyError)
      throw new Error(`Failed to save edit history: ${historyError.message}`)
    }

    console.log('[Image Edit] ✅ Edit history saved')

    // ====================================================================
    // 12. UPDATE BOOK: INCREMENT QUOTA & UPDATE PAGE IMAGE
    // ====================================================================
    const updatedPages = [...book.story_data.pages]
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      imageUrl: editedImageUrl,
    }

    await updateBook(supabase, bookId, {
      story_data: {
        ...book.story_data,
        pages: updatedPages,
      },
    })

    // Update quota separately (to avoid race conditions)
    await supabase
      .from('books')
      .update({ edit_quota_used: quotaUsed + 1 })
      .eq('id', bookId)

    console.log('[Image Edit] ✅ Book updated with new image and quota')

    // ====================================================================
    // 13. FETCH EDIT HISTORY FOR RESPONSE
    // ====================================================================
    const { data: historyData, error: historyFetchError } = await supabase.rpc('get_book_edit_history', {
      p_book_id: bookId,
    })

    const history = (historyData || [])
      .filter((h: any) => h.page_number === pageNumber)
      .map((h: any) => ({
        version: h.version,
        imageUrl: h.edited_image_url,
        editPrompt: h.edit_prompt,
        createdAt: h.created_at,
      }))

    // ====================================================================
    // 14. RETURN RESPONSE
    // ====================================================================
    const quotaRemaining = quotaLimit - (quotaUsed + 1)

    return successResponse<ImageEditResponse>(
      {
        editedImageUrl,
        version: nextVersion,
        quotaRemaining,
        history,
      },
      'Image edited successfully'
    )
  } catch (error) {
    console.error('[Image Edit] Error:', error)
    return handleAPIError(error, 'Image edit failed')
  }
}
