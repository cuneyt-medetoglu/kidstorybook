import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    const supabase = await createClient(request)
    const { searchParams } = new URL(request.url)
    
    const ageGroup = searchParams.get('ageGroup') || undefined
    const theme = searchParams.get('theme') || undefined
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Build query
    let query = supabase
      .from('books')
      .select('*')
      .eq('is_example', true)
      .eq('status', 'completed') // Only show completed example books
      .order('created_at', { ascending: false })

    // Filters
    if (ageGroup) {
      query = query.eq('age_group', ageGroup)
    }
    if (theme) {
      query = query.eq('theme', theme)
    }

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data: books, error } = await query

    if (error) {
      console.error('[GET /api/examples] Error fetching example books:', error)
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
