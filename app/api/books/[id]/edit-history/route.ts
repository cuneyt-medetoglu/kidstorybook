/**
 * Book Edit History API
 * 
 * GET /api/books/[id]/edit-history
 * Returns all edit history for a book, grouped by page
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBookById } from '@/lib/db/books'
import { successResponse, errorResponse, handleAPIError } from '@/lib/api/response'

export interface EditHistoryItem {
  version: number
  imageUrl: string
  editPrompt: string
  createdAt: string
}

export interface PageEditHistory {
  currentVersion: number
  versions: EditHistoryItem[]
}

export interface EditHistoryResponse {
  bookId: string
  quotaUsed: number
  quotaLimit: number
  pages: {
    [pageNumber: number]: PageEditHistory
  }
}

export async function GET(
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
    // 2. FETCH BOOK & CHECK OWNERSHIP
    // ====================================================================
    const { data: book, error: bookError } = await getBookById(supabase, bookId)
    if (bookError || !book) {
      return errorResponse('Book not found', 404)
    }

    if (book.user_id !== user.id) {
      return errorResponse('Unauthorized', 403)
    }

    // ====================================================================
    // 3. FETCH EDIT HISTORY
    // ====================================================================
    const { data: historyData, error: historyError } = await supabase.rpc('get_book_edit_history', {
      p_book_id: bookId,
    })

    if (historyError) {
      console.error('[Edit History] Error fetching history:', historyError)
      throw new Error(`Failed to fetch edit history: ${historyError.message}`)
    }

    // ====================================================================
    // 4. GROUP HISTORY BY PAGE
    // ====================================================================
    const pageHistoryMap: { [pageNumber: number]: PageEditHistory } = {}

    if (historyData && Array.isArray(historyData)) {
      historyData.forEach((item: any) => {
        const pageNumber = item.page_number

        if (!pageHistoryMap[pageNumber]) {
          pageHistoryMap[pageNumber] = {
            currentVersion: 0,
            versions: [],
          }
        }

        const historyItem: EditHistoryItem = {
          version: item.version,
          imageUrl: item.edited_image_url,
          editPrompt: item.edit_prompt,
          createdAt: item.created_at,
        }

        pageHistoryMap[pageNumber].versions.push(historyItem)

        // Track the highest version as current
        if (item.version > pageHistoryMap[pageNumber].currentVersion) {
          pageHistoryMap[pageNumber].currentVersion = item.version
        }
      })
    }

    // ====================================================================
    // 5. RETURN RESPONSE
    // ====================================================================
    const quotaUsed = book.edit_quota_used || 0
    const quotaLimit = book.edit_quota_limit || 3

    return successResponse<EditHistoryResponse>(
      {
        bookId,
        quotaUsed,
        quotaLimit,
        pages: pageHistoryMap,
      },
      'Edit history fetched successfully'
    )
  } catch (error) {
    console.error('[Edit History] Error:', error)
    return handleAPIError(error, 'Failed to fetch edit history')
  }
}
