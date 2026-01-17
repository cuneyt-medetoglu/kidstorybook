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
    // 4. GROUP HISTORY BY PAGE AND ADD ORIGINAL VERSIONS (Version 0)
    // ====================================================================
    const pageHistoryMap: { [pageNumber: number]: PageEditHistory } = {}
    const allPages = book.story_data?.pages || []

    // First, collect all pages that have edits
    const pagesWithEdits = new Set<number>()
    if (historyData && Array.isArray(historyData)) {
      historyData.forEach((item: any) => {
        pagesWithEdits.add(item.page_number)
      })
    }

    // For each page, add version 0 (original) if it has edits OR always show all pages
    allPages.forEach((page: any, index: number) => {
      const pageNumber = index + 1
      if (!page.imageUrl) return

      // Get original image URL from first edit (if exists), otherwise use current image
      let originalImageUrl = page.imageUrl
      if (pagesWithEdits.has(pageNumber)) {
        const firstEdit = historyData?.find(
          (item: any) => item.page_number === pageNumber
        )
        if (firstEdit?.original_image_url) {
          originalImageUrl = firstEdit.original_image_url
        }
      }

      pageHistoryMap[pageNumber] = {
        currentVersion: 0, // Will be updated below if edits exist
        versions: [
          {
            version: 0,
            imageUrl: originalImageUrl,
            editPrompt: 'Original generated image',
            createdAt: book.created_at || new Date().toISOString(),
          },
        ],
      }
    })

    // Then, add edit history on top
    if (historyData && Array.isArray(historyData)) {
      historyData.forEach((item: any) => {
        const pageNumber = item.page_number

        // Ensure page exists in map (should already exist from above)
        if (!pageHistoryMap[pageNumber]) {
          pageHistoryMap[pageNumber] = {
            currentVersion: 0,
            versions: [
              {
                version: 0,
                imageUrl: item.original_image_url || item.edited_image_url,
                editPrompt: 'Original generated image',
                createdAt: book.created_at || new Date().toISOString(),
              },
            ],
          }
        }

        const historyItem: EditHistoryItem = {
          version: item.version,
          imageUrl: item.edited_image_url,
          editPrompt: item.edit_prompt || 'Image edit',
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
