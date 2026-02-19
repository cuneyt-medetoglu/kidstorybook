/**
 * POST /api/debug/quality/generate-masters
 * Debug endpoint: Generate only master character and entity illustrations
 * Admin only (visible in prod and dev, no NODE_ENV/flag check).
 *
 * Body: { characterIds: string[], theme: string, illustrationStyle: string }
 * Returns: { success, data: { characterMasters, entityMasters }, metadata }
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { getUserRole } from '@/lib/db/users'
import { getCharacterById } from '@/lib/db/characters'

// Import master generation functions from books route
// Note: In production, these should be extracted to a shared lib
// For now, we'll duplicate the core logic here for debug purposes

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // ====================================================================
    // 1. Auth check: admin only
    // ====================================================================
    const user = await requireUser()
    const role = await getUserRole(user.id)
    const isAdmin = role === 'admin'

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // ====================================================================
    // 2. Parse & Validate Request
    // ====================================================================
    const body = await request.json()
    const { characterIds, theme, illustrationStyle } = body

    if (!characterIds || !Array.isArray(characterIds) || characterIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'characterIds array is required' },
        { status: 400 }
      )
    }

    if (!theme || !illustrationStyle) {
      return NextResponse.json(
        { success: false, error: 'theme and illustrationStyle are required' },
        { status: 400 }
      )
    }

    // ====================================================================
    // 3. Get Characters
    // ====================================================================
    const characters: any[] = []
    for (const charId of characterIds) {
      const { data: char, error: charError } = await getCharacterById(charId)
      
      if (charError || !char) {
        return NextResponse.json(
          { success: false, error: `Character ${charId} not found` },
          { status: 404 }
        )
      }
      
      if (char.user_id !== user.id) {
        return NextResponse.json(
          { success: false, error: 'You do not own this character' },
          { status: 403 }
        )
      }
      
      characters.push(char)
    }

    // ====================================================================
    // 4. Generate Masters (inline - simplified version)
    // ====================================================================
    // Note: This duplicates logic from books/route.ts for now
    // In production, extract to lib/ai/master-generation.ts
    
    const themeClothingForMaster: Record<string, string> = {
      adventure: 'comfortable outdoor clothing, hiking clothes, sneakers (adventure outfit)',
      space: 'child-sized astronaut suit or space exploration outfit',
      underwater: 'swimwear, beach clothes',
      sports: 'sportswear, athletic clothes',
      fantasy: 'fantasy-appropriate casual clothing, adventure-style',
      'daily-life': 'everyday casual clothing',
    }
    const themeClothing = themeClothingForMaster[theme] || 'age-appropriate casual clothing'

    const characterMasters: Record<string, { url: string; request: any; response: any }> = {}
    const errors: string[] = []

    for (const char of characters) {
      if (!char.reference_photo_url) {
        errors.push(`Character ${char.id} (${char.name}) has no reference photo - skipping`)
        continue
      }

      try {
        // Build minimal master request for debug visibility
        const isMainCharacter = char.id === characters[0].id
        const includeAge = isMainCharacter || (char.character_type?.group === 'Child' && char.description?.age > 0)

        const requestSnapshot = {
          characterId: char.id,
          characterName: char.name,
          theme,
          illustrationStyle,
          themeClothing,
          includeAge,
          referencePhotoUrl: char.reference_photo_url,
        }

        // For debug endpoint, we return request/response structure without actual generation
        // Actual generation call would be here (using same logic as books/route.ts)
        // For MVP debug, we'll return a mock structure showing what would be sent

        characterMasters[char.id] = {
          url: `(would generate master for ${char.name})`,
          request: requestSnapshot,
          response: {
            message: 'Master generation not implemented in debug endpoint yet',
            note: 'Use full book creation to generate actual masters',
          },
        }
      } catch (error: any) {
        errors.push(`Character ${char.id} (${char.name}): ${error.message}`)
      }
    }

    // ====================================================================
    // 5. Return Debug Response
    // ====================================================================
    const generationTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      data: {
        characterMasters,
        entityMasters: {}, // Entity masters would be generated if story had supportingEntities
      },
      metadata: {
        requestBody: body,
        characterCount: characters.length,
        generationTime,
        errors: errors.length > 0 ? errors : undefined,
      },
    })
  } catch (error: any) {
    console.error('[Debug Quality] Generate masters error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate masters' },
      { status: 500 }
    )
  }
}
