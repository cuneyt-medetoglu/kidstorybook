/**
 * Database operations for Books
 * 
 * Handles CRUD operations for user-generated books
 */

import type { SupabaseClient } from '@supabase/supabase-js'

// ============================================================================
// Types
// ============================================================================

export interface Book {
  id: string
  user_id: string
  character_id?: string
  title: string
  theme: string
  illustration_style: string
  language: string
  age_group?: string
  story_data: any // JSON structure from story generation
  total_pages: number
  custom_requests?: string
  images_data: any[] // Array of image objects
  cover_image_url?: string
  cover_image_path?: string
  pdf_url?: string // Generated PDF URL
  pdf_path?: string // PDF storage path
  status: 'draft' | 'generating' | 'completed' | 'failed' | 'archived'
  generation_metadata: any
  view_count: number
  last_viewed_at?: Date
  is_favorite: boolean
  created_at: Date
  updated_at: Date
  completed_at?: Date
}

export interface CreateBookInput {
  character_id?: string
  title: string
  theme: string
  illustration_style: string
  language?: string
  age_group?: string
  story_data: any
  total_pages: number
  custom_requests?: string
  images_data?: any[]
  generation_metadata?: any
  status?: 'draft' | 'generating' | 'completed'
}

export interface UpdateBookInput {
  title?: string
  status?: 'draft' | 'generating' | 'completed' | 'failed' | 'archived'
  images_data?: any[]
  cover_image_url?: string
  cover_image_path?: string
  pdf_url?: string
  pdf_path?: string
  is_favorite?: boolean
  generation_metadata?: any
}

// ============================================================================
// Create
// ============================================================================

export async function createBook(
  supabase: SupabaseClient,
  userId: string,
  input: CreateBookInput
): Promise<{ data: Book | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert({
        user_id: userId,
        ...input,
      })
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error creating book:', error)
    return { data: null, error: error as Error }
  }
}

// ============================================================================
// Read
// ============================================================================

export async function getBookById(
  supabase: SupabaseClient,
  bookId: string
): Promise<{ data: Book | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching book:', error)
    return { data: null, error: error as Error }
  }
}

export async function getUserBooks(
  supabase: SupabaseClient,
  userId: string,
  options?: {
    status?: string
    limit?: number
    offset?: number
  }
): Promise<{ data: Book[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (options?.status) {
      query = query.eq('status', options.status)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching books:', error)
    return { data: null, error: error as Error }
  }
}

export async function getUserFavoriteBooks(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: Book[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .eq('is_favorite', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching favorite books:', error)
    return { data: null, error: error as Error }
  }
}

// ============================================================================
// Update
// ============================================================================

export async function updateBook(
  supabase: SupabaseClient,
  bookId: string,
  input: UpdateBookInput
): Promise<{ data: Book | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .update(input)
      .eq('id', bookId)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error updating book:', error)
    return { data: null, error: error as Error }
  }
}

export async function toggleFavorite(
  supabase: SupabaseClient,
  bookId: string,
  isFavorite: boolean
): Promise<{ data: Book | null; error: Error | null }> {
  return updateBook(supabase, bookId, { is_favorite: isFavorite })
}

export async function incrementBookViews(
  supabase: SupabaseClient,
  bookId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.rpc('increment_book_views', {
      p_book_id: bookId,
    })

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error incrementing book views:', error)
    return { error: error as Error }
  }
}

// ============================================================================
// Delete
// ============================================================================

export async function deleteBook(
  supabase: SupabaseClient,
  bookId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from('books').delete().eq('id', bookId)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error deleting book:', error)
    return { error: error as Error }
  }
}

// ============================================================================
// Statistics
// ============================================================================

export async function getUserBookStats(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  data: {
    total_books: number
    completed_books: number
    draft_books: number
    favorite_books: number
    total_pages: number
    characters_used: number
  } | null
  error: Error | null
}> {
  try {
    const { data, error } = await supabase.rpc('get_user_book_stats', {
      p_user_id: userId,
    })

    if (error) throw error

    return { data: data?.[0] || null, error: null }
  } catch (error) {
    console.error('Error fetching book stats:', error)
    return { data: null, error: error as Error }
  }
}

export async function getBookWithCharacter(
  supabase: SupabaseClient,
  bookId: string
): Promise<{
  data: {
    book_id: string
    title: string
    theme: string
    status: string
    character_name: string
    character_age: number
    created_at: Date
  } | null
  error: Error | null
}> {
  try {
    const { data, error } = await supabase.rpc('get_book_with_character', {
      p_book_id: bookId,
    })

    if (error) throw error

    return { data: data?.[0] || null, error: null }
  } catch (error) {
    console.error('Error fetching book with character:', error)
    return { data: null, error: error as Error }
  }
}
