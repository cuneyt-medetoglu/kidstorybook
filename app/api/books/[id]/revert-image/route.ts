/**
 * Book Image Revert API
 * 
 * POST /api/books/[id]/revert-image
 * Reverts a page image to a specific version from history
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { getBookById, updateBook } from '@/lib/db/books'
import { getEditHistory } from '@/lib/db/edit-history'
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

    const user = await requireUser()

    const body: RevertImageRequest = await request.json()
    const { pageNumber, targetVersion } = body

    if (!pageNumber || targetVersion === undefined || targetVersion === null) {
      return errorResponse('Missing required fields: pageNumber, targetVersion', undefined, 400)
    }

    if (pageNumber < 1) {
      return errorResponse('Invalid pageNumber: must be >= 1', undefined, 400)
    }

    if (targetVersion < 0) {
      return errorResponse('Invalid targetVersion: must be >= 0', undefined, 400)
    }

    console.log(`[Revert Image] Reverting book ${bookId}, page ${pageNumber} to version ${targetVersion}`)

    const { data: book, error: bookError } = await getBookById(bookId)
    if (bookError || !book) {
      return errorResponse('Book not found', undefined, 404)
    }

    if (book.user_id !== user.id) {
      return errorResponse('Unauthorized', undefined, 403)
    }

    if (!book.story_data || !Array.isArray(book.story_data.pages)) {
      return errorResponse('Book has no story data', undefined, 400)
    }

    const pageIndex = pageNumber - 1
    if (pageIndex < 0 || pageIndex >= book.story_data.pages.length) {
      return errorResponse(`Invalid page number: ${pageNumber}. Book has ${book.story_data.pages.length} pages.`, undefined, 400)
    }

    const history = await getEditHistory(bookId)
    const pageHistory = history.filter((h: any) => h.page_number === pageNumber)

    let targetImageUrl: string

    if (targetVersion === 0) {
      const currentPage = book.story_data.pages[pageIndex]
      if (!currentPage.imageUrl) {
        return errorResponse(`Page ${pageNumber} has no original image`, undefined, 404)
      }
      const firstEdit = pageHistory.sort((a: any, b: any) => a.version_number - b.version_number)[0]
      targetImageUrl = firstEdit?.previous_image_url || currentPage.imageUrl
    } else {
      const targetEdit = pageHistory.find((h: any) => h.version_number === targetVersion)
      if (!targetEdit) {
        return errorResponse(`Version ${targetVersion} not found for page ${pageNumber}`, undefined, 404)
      }
      targetImageUrl = targetEdit.new_image_url
    }

    console.log(`[Revert Image] Target image URL: ${targetImageUrl}`)

    const updatedPages = [...book.story_data.pages]
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      imageUrl: targetImageUrl,
    }

    await updateBook(bookId, {
      story_data: {
        ...book.story_data,
        pages: updatedPages,
      },
    })

    console.log('[Revert Image] ✅ Book updated with reverted image')

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
    return handleAPIError(error)
  }
}
