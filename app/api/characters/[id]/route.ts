/**
 * Single Character API
 * 
 * GET /api/characters/:id - Get character details
 * PATCH /api/characters/:id - Update character
 * DELETE /api/characters/:id - Delete character
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} from '@/lib/db/characters'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get character
    const { data: character, error: dbError } = await getCharacterById(
      params.id
    )

    if (dbError || !character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (character.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      character,
    })
  } catch (error) {
    console.error('Error fetching character:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch character',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const { data: existing } = await getCharacterById(params.id)
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const { name, age, description, isDefault } = body

    // Update character
    const { data: character, error: dbError } = await updateCharacter(
      params.id,
      {
        name,
        age: age ? parseInt(age) : undefined,
        description,
        is_default: isDefault,
      }
    )

    if (dbError || !character) {
      throw new Error('Failed to update character')
    }

    return NextResponse.json({
      success: true,
      character,
      message: 'Character updated successfully',
    })
  } catch (error) {
    console.error('Error updating character:', error)
    return NextResponse.json(
      {
        error: 'Failed to update character',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const { data: existing } = await getCharacterById(params.id)
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete character
    const { error: dbError } = await deleteCharacter(params.id)

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({
      success: true,
      message: 'Character deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting character:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete character',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

