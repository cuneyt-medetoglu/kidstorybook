/**
 * Book Detail API
 * 
 * GET /api/books/:id - Get book details
 * PATCH /api/books/:id - Update book
 * DELETE /api/books/:id - Delete book
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getBookById,
  updateBook,
  deleteBook,
  toggleFavorite,
  incrementBookViews,
} from '@/lib/db/books'
import { successResponse, handleAPIError, CommonErrors } from '@/lib/api/response'

// ============================================================================
// GET /api/books/:id - Get book details
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication (supports both Bearer token and session cookies)
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return CommonErrors.unauthorized('Please login to continue')
    }

    const bookId = params.id

    if (!bookId) {
      return CommonErrors.badRequest('Book ID is required')
    }

    // Get Book
    const { data: book, error: dbError } = await getBookById(supabase, bookId)

    if (dbError || !book) {
      return CommonErrors.notFound('Book')
    }

    // Verify ownership (RLS should handle this, but double-check for security)
    if (book.user_id !== user.id) {
      return CommonErrors.forbidden('You do not own this book')
    }

    // Increment view count (non-blocking)
    incrementBookViews(supabase, bookId).catch((error) => {
      console.error('Failed to increment view count:', error)
    })

    return successResponse(book, 'Book fetched successfully')
  } catch (error) {
    console.error('Get book error:', error)
    return handleAPIError(error)
  }
}

// ============================================================================
// PATCH /api/books/:id - Update book
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication (supports both Bearer token and session cookies)
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return CommonErrors.unauthorized('Please login to continue')
    }

    const bookId = params.id

    if (!bookId) {
      return CommonErrors.badRequest('Book ID is required')
    }

    // Get Book (to verify ownership)
    const { data: existingBook, error: getError } = await getBookById(supabase, bookId)

    if (getError || !existingBook) {
      return CommonErrors.notFound('Book')
    }

    // Verify ownership
    if (existingBook.user_id !== user.id) {
      return CommonErrors.forbidden('You do not own this book')
    }

    // Parse Request Body
    const body = await request.json()
    const {
      title,
      status,
      images_data,
      cover_image_url,
      cover_image_path,
      is_favorite,
      generation_metadata,
    } = body

    // Prepare Update Input
    const updateInput: {
      title?: string
      status?: 'draft' | 'generating' | 'completed' | 'failed' | 'archived'
      images_data?: any[]
      cover_image_url?: string
      cover_image_path?: string
      is_favorite?: boolean
      generation_metadata?: any
    } = {}

    if (title !== undefined) updateInput.title = title
    if (status !== undefined) updateInput.status = status
    if (images_data !== undefined) updateInput.images_data = images_data
    if (cover_image_url !== undefined) updateInput.cover_image_url = cover_image_url
    if (cover_image_path !== undefined) updateInput.cover_image_path = cover_image_path
    if (is_favorite !== undefined) updateInput.is_favorite = is_favorite
    if (generation_metadata !== undefined)
      updateInput.generation_metadata = generation_metadata

    // Update Book
    const { data: updatedBook, error: updateError } = await updateBook(
      supabase,
      bookId,
      updateInput
    )

    if (updateError || !updatedBook) {
      console.error('Update error:', updateError)
      throw new Error('Failed to update book')
    }

    return successResponse(updatedBook, 'Book updated successfully')
  } catch (error) {
    console.error('Update book error:', error)
    return handleAPIError(error)
  }
}

// ============================================================================
// DELETE /api/books/:id - Delete book
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication (supports both Bearer token and session cookies)
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return CommonErrors.unauthorized('Please login to continue')
    }

    const bookId = params.id

    if (!bookId) {
      return CommonErrors.badRequest('Book ID is required')
    }

    // Get Book (to verify ownership)
    const { data: existingBook, error: getError } = await getBookById(supabase, bookId)

    if (getError || !existingBook) {
      return CommonErrors.notFound('Book')
    }

    // Verify ownership
    if (existingBook.user_id !== user.id) {
      return CommonErrors.forbidden('You do not own this book')
    }

    // Delete Book
    const { error: deleteError } = await deleteBook(supabase, bookId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      throw new Error('Failed to delete book')
    }

    return successResponse(
      { id: bookId },
      'Book deleted successfully',
      undefined,
      200
    )
  } catch (error) {
    console.error('Delete book error:', error)
    return handleAPIError(error)
  }
}

