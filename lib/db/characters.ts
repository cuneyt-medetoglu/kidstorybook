/**
 * Database operations for Characters
 * 
 * Handles CRUD operations for master character descriptions
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { CharacterDescription } from '@/lib/prompts/types'

// ============================================================================
// Types
// ============================================================================

export interface Character {
  id: string
  user_id: string
  name: string
  age: number
  gender: 'boy' | 'girl' | 'other'
  reference_photo_url?: string
  reference_photo_path?: string
  description: CharacterDescription
  analysis_raw?: any
  analysis_confidence?: number
  is_default: boolean
  used_in_books: string[]
  total_books: number
  last_used_at?: Date
  version: number
  previous_versions: any[]
  created_at: Date
  updated_at: Date
}

export interface CreateCharacterInput {
  name: string
  age: number
  gender: 'boy' | 'girl' | 'other'
  hair_color: string
  eye_color: string
  features?: string[]
  reference_photo_url?: string
  reference_photo_path?: string
  ai_analysis?: any
  full_description?: string
  description: CharacterDescription
  analysis_raw?: any
  analysis_confidence?: number
  is_default?: boolean
}

export interface UpdateCharacterInput {
  name?: string
  age?: number
  description?: CharacterDescription
  is_default?: boolean
}

// ============================================================================
// Create
// ============================================================================

export async function createCharacter(
  supabase: SupabaseClient,
  userId: string,
  input: CreateCharacterInput
): Promise<{ data: Character | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('characters')
      .insert({
        user_id: userId,
        name: input.name,
        age: input.age,
        gender: input.gender,
        hair_color: input.hair_color,
        eye_color: input.eye_color,
        features: input.features || [],
        reference_photo_url: input.reference_photo_url,
        reference_photo_path: input.reference_photo_path,
        ai_analysis: input.ai_analysis,
        full_description: input.full_description,
        description: input.description,
        analysis_raw: input.analysis_raw,
        analysis_confidence: input.analysis_confidence,
        is_default: input.is_default ?? true, // First character is default
      })
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error creating character:', error)
    return { data: null, error: error as Error }
  }
}

// ============================================================================
// Read
// ============================================================================

export async function getCharacterById(
  supabase: SupabaseClient,
  characterId: string
): Promise<{ data: Character | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching character:', error)
    return { data: null, error: error as Error }
  }
}

export async function getUserCharacters(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: Character[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('total_books', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching characters:', error)
    return { data: null, error: error as Error }
  }
}

export async function getDefaultCharacter(
  userId: string
): Promise<{ data: Character | null; error: Error | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is ok (no default character yet)
      throw error
    }

    return { data: data || null, error: null }
  } catch (error) {
    console.error('Error fetching default character:', error)
    return { data: null, error: error as Error }
  }
}

// ============================================================================
// Update
// ============================================================================

export async function updateCharacter(
  characterId: string,
  input: UpdateCharacterInput
): Promise<{ data: Character | null; error: Error | null }> {
  try {
    const supabase = createClient()

    // If updating description, save current version to history
    if (input.description) {
      const { data: current } = await getCharacterById(characterId)
      if (current) {
        const previousVersions = current.previous_versions || []
        previousVersions.push({
          version: current.version,
          description: current.description,
          updated_at: current.updated_at,
        })

        const { data, error } = await supabase
          .from('characters')
          .update({
            ...input,
            version: current.version + 1,
            previous_versions: previousVersions,
          })
          .eq('id', characterId)
          .select()
          .single()

        if (error) throw error
        return { data, error: null }
      }
    }

    // Normal update without versioning
    const { data, error } = await supabase
      .from('characters')
      .update(input)
      .eq('id', characterId)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error updating character:', error)
    return { data: null, error: error as Error }
  }
}

export async function setDefaultCharacter(
  characterId: string
): Promise<{ data: Character | null; error: Error | null }> {
  return updateCharacter(characterId, { is_default: true })
}

export async function markCharacterUsed(
  characterId: string,
  bookId: string
): Promise<{ error: Error | null }> {
  try {
    const supabase = createClient()

    // The trigger will handle updating used_in_books array
    // We just need to update the book's character_id
    const { error } = await supabase
      .from('books')
      .update({ character_id: characterId })
      .eq('id', bookId)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error marking character as used:', error)
    return { error: error as Error }
  }
}

// ============================================================================
// Delete
// ============================================================================

export async function deleteCharacter(
  characterId: string
): Promise<{ error: Error | null }> {
  try {
    const supabase = createClient()

    // Check if character is used in any books
    const { data: character } = await getCharacterById(characterId)
    if (character && character.total_books > 0) {
      return {
        error: new Error(
          `Cannot delete character. It is used in ${character.total_books} book(s).`
        ),
      }
    }

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', characterId)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error deleting character:', error)
    return { error: error as Error }
  }
}

// ============================================================================
// Statistics
// ============================================================================

export async function getCharacterStats(characterId: string): Promise<{
  data: {
    total_books: number
    last_used_at?: Date
    books_this_month: number
  } | null
  error: Error | null
}> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.rpc('get_character_stats', {
      p_character_id: characterId,
    })

    if (error) throw error

    return { data: data?.[0] || null, error: null }
  } catch (error) {
    console.error('Error fetching character stats:', error)
    return { data: null, error: error as Error }
  }
}

export async function getBooksByCharacter(characterId: string): Promise<{
  data: Array<{
    id: string
    title: string
    cover_image_url: string
    created_at: Date
    status: string
  }> | null
  error: Error | null
}> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.rpc('get_books_by_character', {
      p_character_id: characterId,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching books by character:', error)
    return { data: null, error: error as Error }
  }
}

