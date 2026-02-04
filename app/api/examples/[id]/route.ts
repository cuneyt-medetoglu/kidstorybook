/**
 * GET /api/examples/[id]
 *
 * Get a single example book by id (for "Create Your Own" flow).
 * Only returns books with is_example = true.
 * Requires authentication (user must be logged in to create from example).
 */

import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBookById } from '@/lib/db/books'
import { successResponse, CommonErrors } from '@/lib/api/response'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return CommonErrors.unauthorized('Please log in to create your own book from this example.')
    }

    const exampleId = params.id
    if (!exampleId) {
      return CommonErrors.badRequest('Example book ID is required')
    }

    const { data: book, error: dbError } = await getBookById(supabase, exampleId)

    if (dbError || !book) {
      return CommonErrors.notFound('Example book not found')
    }

    const isExample = (book as any).is_example === true
    if (!isExample) {
      return CommonErrors.forbidden('This book is not an example book')
    }

    if (book.status !== 'completed') {
      return CommonErrors.badRequest('Example book is not yet completed')
    }

    return successResponse(
      {
        id: book.id,
        title: book.title,
        theme: book.theme,
        illustration_style: book.illustration_style,
        language: book.language,
        age_group: book.age_group,
        total_pages: book.total_pages,
        story_data: book.story_data,
        cover_image_url: book.cover_image_url,
        images_data: book.images_data,
      },
      'Example book fetched'
    )
  } catch (error) {
    console.error('[GET /api/examples/[id]] Error:', error)
    return CommonErrors.internal('Failed to fetch example book')
  }
}
