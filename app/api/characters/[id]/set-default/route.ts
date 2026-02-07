/**
 * Set Default Character API
 * 
 * POST /api/characters/:id/set-default - Set character as default
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { getCharacterById, setDefaultCharacter } from '@/lib/db/characters'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser()

    // Verify ownership
    const { data: existing } = await getCharacterById(params.id)
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set as default
    const { data: character, error: dbError } = await setDefaultCharacter(
      params.id
    )

    if (dbError || !character) {
      throw new Error('Failed to set default character')
    }

    return NextResponse.json({
      success: true,
      character,
      message: 'Default character updated successfully',
    })
  } catch (error) {
    console.error('Error setting default character:', error)
    return NextResponse.json(
      {
        error: 'Failed to set default character',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
