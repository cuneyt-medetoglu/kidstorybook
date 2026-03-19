/**
 * GET /api/books/:id/generation-status
 *
 * Progress polling endpoint — frontend her 3 saniyede bu endpoint'i çağırır.
 * Tam kitap verisi yerine sadece ilerleme bilgisi döndürür (düşük yük).
 *
 * Response:
 *   { bookId, title, status, progress_percent, progress_step }
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { getBookById } from '@/lib/db/books'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser()
    const bookId = params.id

    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      )
    }

    const { data: book, error } = await getBookById(bookId)

    if (error || !book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }

    if (book.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      bookId: book.id,
      title: book.title,
      status: book.status,
      progress_percent: book.progress_percent ?? 0,
      progress_step: book.progress_step ?? '',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
