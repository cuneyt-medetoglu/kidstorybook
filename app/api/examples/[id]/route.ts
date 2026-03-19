/**
 * GET /api/examples/[id]
 *
 * Get a single example book by id. Public endpoint – no authentication required.
 * Used for: viewing example books at /examples/[id], and "Create Your Own" flow.
 * Only returns books with is_example = true and status = completed.
 */

import { NextRequest } from 'next/server'
import { getBookById } from '@/lib/db/books'
import { getCharacterTypesByIds } from '@/lib/db/characters'
import { successResponse, CommonErrors } from '@/lib/api/response'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exampleId = params.id
    if (!exampleId) {
      return CommonErrors.badRequest('Example book ID is required')
    }

    const { data: book, error: dbError } = await getBookById(exampleId)

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

    // Collect character IDs in story slot order for type lookup
    const pages: any[] = book.story_data?.pages ?? []
    const seenIds = new Set<string>()
    const characterSlotIds: string[] = []
    for (const page of pages) {
      for (const cid of (page.characterIds ?? [])) {
        if (!seenIds.has(cid)) {
          seenIds.add(cid)
          characterSlotIds.push(cid)
        }
      }
    }
    const typeMap = await getCharacterTypesByIds(characterSlotIds)
    const characterSlotTypes = characterSlotIds.map(
      (id) => typeMap[id] ?? { group: 'Child', value: 'Child', displayName: 'Child' }
    )

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
        characterSlotTypes,
      },
      'Example book fetched'
    )
  } catch (error) {
    console.error('[GET /api/examples/[id]] Error:', error)
    return CommonErrors.internalError('Failed to fetch example book')
  }
}
