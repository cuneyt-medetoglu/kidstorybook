/**
 * Database operations for Characters (PostgreSQL)
 * 
 * Handles CRUD operations for master character descriptions
 */

import { pool } from './pool'
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
  character_type?: any // JSONB: {group, value, displayName}
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
  character_type?: any // JSONB: {group, value, displayName}
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
  gender?: 'boy' | 'girl' | 'other'
  hair_color?: string
  eye_color?: string
  features?: string[]
  character_type?: any // JSONB: {group, value, displayName}
  description?: CharacterDescription
  is_default?: boolean
}

// ============================================================================
// Create
// ============================================================================

export async function createCharacter(
  userId: string,
  input: CreateCharacterInput
): Promise<{ data: Character | null; error: Error | null }> {
  try {
    const result = await pool.query(
      `INSERT INTO characters (
        user_id, name, age, gender, character_type, hair_color, eye_color, features,
        reference_photo_url, reference_photo_path, ai_analysis, full_description,
        description, analysis_raw, analysis_confidence, is_default, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
      RETURNING *`,
      [
        userId,
        input.name,
        input.age,
        input.gender,
        input.character_type ? JSON.stringify(input.character_type) : null,
        input.hair_color,
        input.eye_color,
        input.features || [],
        input.reference_photo_url || null,
        input.reference_photo_path || null,
        input.ai_analysis ? JSON.stringify(input.ai_analysis) : null,
        input.full_description || null,
        JSON.stringify(input.description),
        input.analysis_raw ? JSON.stringify(input.analysis_raw) : null,
        input.analysis_confidence || null,
        input.is_default ?? true,
      ]
    )

    return { data: result.rows[0], error: null }
  } catch (error) {
    console.error('Error creating character:', error)
    return { data: null, error: error as Error }
  }
}

// ============================================================================
// Read
// ============================================================================

export async function getCharacterById(
  characterId: string
): Promise<{ data: Character | null; error: Error | null }> {
  try {
    const result = await pool.query(
      'SELECT * FROM characters WHERE id = $1',
      [characterId]
    )

    return { data: result.rows[0] || null, error: null }
  } catch (error) {
    console.error('Error fetching character:', error)
    return { data: null, error: error as Error }
  }
}

export async function getUserCharacters(
  userId: string
): Promise<{ data: Character[] | null; error: Error | null }> {
  try {
    const result = await pool.query(
      `SELECT * FROM characters 
       WHERE user_id = $1 
       ORDER BY is_default DESC, total_books DESC, created_at DESC`,
      [userId]
    )

    return { data: result.rows, error: null }
  } catch (error) {
    console.error('Error fetching characters:', error)
    return { data: null, error: error as Error }
  }
}

export async function getDefaultCharacter(
  userId: string
): Promise<{ data: Character | null; error: Error | null }> {
  try {
    const result = await pool.query(
      'SELECT * FROM characters WHERE user_id = $1 AND is_default = true LIMIT 1',
      [userId]
    )

    return { data: result.rows[0] || null, error: null }
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

        const fields: string[] = []
        const values: any[] = []
        let paramCount = 1

        if (input.name !== undefined) {
          fields.push(`name = $${paramCount++}`)
          values.push(input.name)
        }
        if (input.age !== undefined) {
          fields.push(`age = $${paramCount++}`)
          values.push(input.age)
        }
        if (input.gender !== undefined) {
          fields.push(`gender = $${paramCount++}`)
          values.push(input.gender)
        }
        if (input.description !== undefined) {
          fields.push(`description = $${paramCount++}`)
          values.push(JSON.stringify(input.description))
        }
        if (input.is_default !== undefined) {
          fields.push(`is_default = $${paramCount++}`)
          values.push(input.is_default)
        }

        fields.push(`version = $${paramCount++}`)
        values.push(current.version + 1)
        fields.push(`previous_versions = $${paramCount++}`)
        values.push(JSON.stringify(previousVersions))
        fields.push(`updated_at = NOW()`)
        values.push(characterId)

        const result = await pool.query(
          `UPDATE characters SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
          values
        )

        return { data: result.rows[0] || null, error: null }
      }
    }

    // Normal update without versioning
    const fields: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (input.name !== undefined) {
      fields.push(`name = $${paramCount++}`)
      values.push(input.name)
    }
    if (input.age !== undefined) {
      fields.push(`age = $${paramCount++}`)
      values.push(input.age)
    }
    if (input.gender !== undefined) {
      fields.push(`gender = $${paramCount++}`)
      values.push(input.gender)
    }
    if (input.character_type !== undefined) {
      fields.push(`character_type = $${paramCount++}`)
      values.push(JSON.stringify(input.character_type))
    }
    if (input.is_default !== undefined) {
      fields.push(`is_default = $${paramCount++}`)
      values.push(input.is_default)
    }

    if (fields.length === 0) {
      return getCharacterById(characterId)
    }

    fields.push(`updated_at = NOW()`)
    values.push(characterId)

    const result = await pool.query(
      `UPDATE characters SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )

    return { data: result.rows[0] || null, error: null }
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
    // The trigger will handle updating used_in_books array
    // We just need to update the book's character_id
    await pool.query(
      'UPDATE books SET character_id = $1 WHERE id = $2',
      [characterId, bookId]
    )

    return { error: null }
  } catch (error) {
    console.error('Error marking character as used:', error)
    return { error: error as Error }
  }
}

export async function updateCharacterLastUsed(
  characterId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    await pool.query(
      'UPDATE characters SET last_used_at = NOW() WHERE id = $1',
      [characterId]
    )

    console.log('[Character] Updated last_used_at for character:', characterId)
    return { success: true, error: null }
  } catch (error) {
    console.error('[Character] Error updating last_used_at:', error)
    return { success: false, error: error as Error }
  }
}

// ============================================================================
// Delete
// ============================================================================

export async function deleteCharacter(
  characterId: string
): Promise<{ error: Error | null }> {
  try {
    // Check if character is used in any books
    const { data: character } = await getCharacterById(characterId)
    if (character && character.total_books > 0) {
      return {
        error: new Error(
          `Cannot delete character. It is used in ${character.total_books} book(s).`
        ),
      }
    }

    await pool.query('DELETE FROM characters WHERE id = $1', [characterId])

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
    const result = await pool.query(
      'SELECT * FROM get_character_stats($1)',
      [characterId]
    )

    return { data: result.rows[0] || null, error: null }
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
    const result = await pool.query(
      'SELECT * FROM get_books_by_character($1)',
      [characterId]
    )

    return { data: result.rows, error: null }
  } catch (error) {
    console.error('Error fetching books by character:', error)
    return { data: null, error: error as Error }
  }
}
