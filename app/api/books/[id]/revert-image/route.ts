/**
 * Book Image Revert API
 * 
 * POST /api/books/[id]/revert-image
 * Reverts a page image to a specific version from history
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBookById, updateBook } from '@/lib/db/books'
import { successResponse, errorResponse, handleAPIError } from '@/lib/api/response'

export interface RevertImageRequest {
  pageNumber: number
  targetVersion: number // 0 = original
}

export interface RevertImageResponse {
  pageNumber: number
  newImageUrl: string
  revertedToVersion: number
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id

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
    const body: RevertImageRequest = await request.json()
    const { pageNumber, targetVersion } = body

    if (!pageNumber || targetVersion === undefined || targetVersion === null) {
      return errorResponse('Missing required fields: pageNumber, targetVersion', 400)
    }

    if (pageNumber < 1) {
      return errorResponse('Invalid pageNumber: must be >= 1', 400)
    }

    if (targetVersion < 0) {
      return errorResponse('Invalid targetVersion: must be >= 0', 400)
    }

    console.log(`[Revert Image] Reverting book ${bookId}, page ${pageNumber} to version ${targetVersion}`)

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
    // 4. VALIDATE PAGE NUMBER
    // ====================================================================
    if (!book.story_data || !Array.isArray(book.story_data.pages)) {
      return errorResponse('Book has no story data', 400)
    }

    const pageIndex = pageNumber - 1
    if (pageIndex < 0 || pageIndex >= book.story_data.pages.length) {
      return errorResponse(`Invalid page number: ${pageNumber}. Book has ${book.story_data.pages.length} pages.`, 400)
    }

    // ====================================================================
    // 5. FETCH TARGET VERSION FROM HISTORY OR USE ORIGINAL
    // ====================================================================
    let targetImageUrl: string

    if (targetVersion === 0) {
      // Version 0 = Original image (from story_data, not from history)
      const currentPage = book.story_data.pages[pageIndex]
      if (!currentPage.imageUrl) {
        return errorResponse(`Page ${pageNumber} has no original image`, 404)
      }
      
      // Try to get original from first edit history, otherwise use current
      const { data: firstEdit } = await supabase
        .from('image_edit_history')
        .select('original_image_url')
        .eq('book_id', bookId)
        .eq('page_number', pageNumber)
        .order('version', { ascending: true })
        .limit(1)
        .single()

      targetImageUrl = firstEdit?.original_image_url || currentPage.imageUrl
    } else {
      // Version > 0 = Edited version (from history)
      const { data: historyData, error: historyError } = await supabase
        .from('image_edit_history')
        .select('*')
        .eq('book_id', bookId)
        .eq('page_number', pageNumber)
        .eq('version', targetVersion)
        .single()

      if (historyError || !historyData) {
        return errorResponse(`Version ${targetVersion} not found for page ${pageNumber}`, 404)
      }

      targetImageUrl = historyData.edited_image_url
    }

    console.log(`[Revert Image] Target image URL: ${targetImageUrl}`)

    // ====================================================================
    // 6. UPDATE BOOK WITH REVERTED IMAGE
    // ====================================================================
    const updatedPages = [...book.story_data.pages]
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      imageUrl: targetImageUrl,
    }

    await updateBook(supabase, bookId, {
      story_data: {
        ...book.story_data,
        pages: updatedPages,
      },
    })

    console.log('[Revert Image] ✅ Book updated with reverted image')

    // ====================================================================
    // 7. RETURN RESPONSE
    // ====================================================================
    return successResponse<RevertImageResponse>(
      {
        pageNumber,
        newImageUrl: targetImageUrl,
        revertedToVersion: targetVersion,
      },
      `Page ${pageNumber} reverted to version ${targetVersion}`
    )
  } catch (error) {
    console.error('[Revert Image] Error:', error)
    return handleAPIError(error, 'Failed to revert image')
  }
}
