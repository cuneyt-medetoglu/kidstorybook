import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db/pool'

export const dynamic = 'force-dynamic'

/**
 * GET /api/examples
 * 
 * Get public example books (is_example = true)
 * No authentication required - publicly accessible
 * 
 * Query params:
 * - ageGroup?: string (e.g., "3-5")
 * - theme?: string (e.g., "adventure")
 * - limit?: number (default: 20)
 * - offset?: number (default: 0)
 * 
 * @see docs/strategies/EXAMPLES_REAL_BOOKS_AND_CREATE_YOUR_OWN.md
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const ageGroup = searchParams.get('ageGroup') || undefined
    const theme = searchParams.get('theme') || undefined
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Build query
    let query = 'SELECT * FROM books WHERE is_example = true AND status = $1'
    const params: any[] = ['completed']
    let paramCount = 2

    // Filters
    if (ageGroup) {
      query += ` AND age_group = $${paramCount++}`
      params.push(ageGroup)
    }
    if (theme) {
      query += ` AND theme = $${paramCount++}`
      params.push(theme)
    }

    query += ' ORDER BY created_at DESC'
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    const books = result.rows

    if (!books) {
      console.error('[GET /api/examples] No books found')
      return NextResponse.json(
        { success: false, error: 'Failed to fetch example books' },
        { status: 500 }
      )
    }

    // Transform books to match ExampleBook type (app/examples/types.ts)
    const exampleBooks = books.map((book: any) => ({
      id: book.id,
      title: book.title,
      description: book.story_data?.metadata?.description || book.story_data?.pages?.[0]?.text?.slice(0, 150) + '...' || 'A wonderful story',
      coverImage: book.cover_image_url || '',
      ageGroup: book.age_group || '',
      theme: book.theme || '',
      usedPhotos: [], // ROADMAP: Examples metadata - extract from story_data/images_data when available
      storyDetails: {
        style: book.illustration_style || '',
        font: 'Playful', // ROADMAP: Get from book/metadata when available
        characterCount: book.generation_metadata?.characterIds?.length || 1,
      },
    }))

    return NextResponse.json({
      success: true,
      data: exampleBooks,
      total: exampleBooks.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error('[GET /api/examples] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
