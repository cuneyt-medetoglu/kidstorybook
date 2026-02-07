/**
 * Book Edit History API
 * 
 * GET /api/books/[id]/edit-history
 * Returns all edit history for a book, grouped by page
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { getBookById } from '@/lib/db/books'
import { getEditHistory } from '@/lib/db/edit-history'
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

    const user = await requireUser()

    const { data: book, error: bookError } = await getBookById(bookId)
    if (bookError || !book) {
      return errorResponse('Book not found', undefined, 404)
    }

    if (book.user_id !== user.id) {
      return errorResponse('Unauthorized', undefined, 403)
    }

    const historyData = await getEditHistory(bookId)

    const pageHistoryMap: { [pageNumber: number]: PageEditHistory } = {}
    const allPages = book.story_data?.pages || []

    const pagesWithEdits = new Set<number>()
    if (historyData && Array.isArray(historyData)) {
      historyData.forEach((item: any) => {
        pagesWithEdits.add(item.page_number)
      })
    }

    allPages.forEach((page: any, index: number) => {
      const pageNumber = index + 1
      if (!page.imageUrl) return

      let originalImageUrl = page.imageUrl
      if (pagesWithEdits.has(pageNumber)) {
        const firstEdit = historyData?.find(
          (item: any) => item.page_number === pageNumber
        )
        if (firstEdit?.previous_image_url) {
          originalImageUrl = firstEdit.previous_image_url
        }
      }

      pageHistoryMap[pageNumber] = {
        currentVersion: 0,
        versions: [
          {
            version: 0,
            imageUrl: originalImageUrl,
            editPrompt: 'Original generated image',
            createdAt: book.created_at ? String(book.created_at) : new Date().toISOString(),
          },
        ],
      }
    })

    if (historyData && Array.isArray(historyData)) {
      historyData.forEach((item: any) => {
        const pageNumber = item.page_number
        const version = item.version_number ?? item.version

        if (!pageHistoryMap[pageNumber]) {
          pageHistoryMap[pageNumber] = {
            currentVersion: 0,
            versions: [
              {
                version: 0,
                imageUrl: item.previous_image_url || item.new_image_url,
                editPrompt: 'Original generated image',
                createdAt: book.created_at ? String(book.created_at) : new Date().toISOString(),
              },
            ],
          }
        }

        pageHistoryMap[pageNumber].versions.push({
          version,
          imageUrl: item.new_image_url,
          editPrompt: item.edit_prompt || 'Image edit',
          createdAt: String(item.created_at),
        })

        if (version > pageHistoryMap[pageNumber].currentVersion) {
          pageHistoryMap[pageNumber].currentVersion = version
        }
      })
    }

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
    return handleAPIError(error)
  }
}
