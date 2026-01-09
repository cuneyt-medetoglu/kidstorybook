/**
 * Characters API
 * 
 * GET /api/characters - Get all user's characters
 * POST /api/characters - Create new character (without photo analysis)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserCharacters, createCharacter } from '@/lib/db/characters'

export async function GET(request: NextRequest) {
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

    // Get user's characters
    const { data: characters, error: dbError } = await getUserCharacters(
      user.id
    )

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({
      success: true,
      characters: characters || [],
    })
  } catch (error) {
    console.error('Error fetching characters:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch characters',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { name, age, gender, description, isDefault } = body

    // Validation
    if (!name || !age || !gender || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, gender, description' },
        { status: 400 }
      )
    }

    // Create character
    const { data: character, error: dbError } = await createCharacter(
      user.id,
      {
        name,
        age: parseInt(age),
        gender,
        description,
        is_default: isDefault ?? false,
      }
    )

    if (dbError || !character) {
      throw new Error('Failed to create character')
    }

    return NextResponse.json({
      success: true,
      character,
      message: 'Character created successfully',
    })
  } catch (error) {
    console.error('Error creating character:', error)
    return NextResponse.json(
      {
        error: 'Failed to create character',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

