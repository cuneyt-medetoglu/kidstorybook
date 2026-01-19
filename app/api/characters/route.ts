/**
 * Character Creation API (Simplified - No AI Analysis)
 * 
 * POST /api/characters
 * Creates a character using Step 1 data only (no AI Analysis needed)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCharacter } from '@/lib/db/characters'
import type { CharacterDescription } from '@/lib/prompts/types'

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const {
      name,
      age,
      gender,
      hairColor,
      eyeColor,
      specialFeatures = [],
      photoBase64, // Base64 encoded photo (data URL without prefix)
      characterType, // NEW: Character type info {group, value, displayName}
    } = body

    // FIX: Gender validation based on characterType (25 Ocak 2026)
    // Dad/Mom için otomatik gender düzeltme - frontend'den yanlış gender gönderilme riskini önler
    let validatedGender = gender ? gender.toLowerCase() : ''
    
    if (characterType) {
      // Dad için otomatik olarak "boy" yap
      if (characterType.value === "Dad" || characterType.value === "dad") {
        validatedGender = 'boy'
        console.log('[Character Creation] 🔧 Gender auto-corrected: Dad character must be "boy" (was: ' + gender + ')')
      }
      // Mom için otomatik olarak "girl" yap
      else if (characterType.value === "Mom" || characterType.value === "mom") {
        validatedGender = 'girl'
        console.log('[Character Creation] 🔧 Gender auto-corrected: Mom character must be "girl" (was: ' + gender + ')')
      }
    }
    
    // Validation
    if (!name || !age || !validatedGender) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, gender' },
        { status: 400 }
      )
    }

    // Build character description from Step 1 data (simple mapping, no AI Analysis)
    const characterDescription: CharacterDescription = {
      age: parseInt(age) || 5,
      gender: validatedGender,
      skinTone: 'fair', // Default, can be adjusted later
      hairColor: hairColor || 'brown',
      hairStyle: 'natural', // Default
      hairLength: parseInt(age) <= 3 ? 'short' : parseInt(age) <= 7 ? 'medium' : 'long', // Age-based default
      eyeColor: eyeColor || 'brown',
      eyeShape: 'round', // Default for children
      faceShape: 'round', // Default for children
      height: 'average',
      build: 'normal',
      clothingStyle: 'casual',
      clothingColors: ['blue', 'red'], // Default
      uniqueFeatures: Array.isArray(specialFeatures) ? specialFeatures : [],
      typicalExpression: 'happy',
      personalityTraits: ['curious', 'friendly'], // Default
    }

    let referencePhotoUrl: string | undefined
    let referencePhotoPath: string | undefined

    // Upload photo to Supabase Storage if provided
    if (photoBase64) {
      try {
        // Convert base64 to buffer
        const base64Data = photoBase64.includes(',') 
          ? photoBase64.split(',')[1] 
          : photoBase64
        
        const buffer = Buffer.from(base64Data, 'base64')

        // Supabase Storage keys are strict; sanitize name to avoid invalid characters (e.g., "Venüs")
        const safeName = name
          .toString()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // strip diacritics
          .replace(/[^a-zA-Z0-9_-]+/g, '_') // keep only safe chars
          .replace(/_+/g, '_')
          .replace(/^_+|_+$/g, '')
          .slice(0, 40) || 'child'

        const fileName = `character_${Date.now()}_${safeName}.png`
        const filePath = `${user.id}/characters/${fileName}`

        console.log('[Character Creation] Uploading photo to Supabase Storage:', filePath)

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('book-images')
          .upload(filePath, buffer, {
            contentType: 'image/png',
            upsert: false,
          })

        if (uploadError) {
          console.error('[Character Creation] Storage upload error:', uploadError)
          // Continue without photo if upload fails
        } else {
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('book-images')
            .getPublicUrl(filePath)

          referencePhotoUrl = publicUrlData?.publicUrl
          referencePhotoPath = filePath

          console.log('[Character Creation] Photo uploaded successfully:', referencePhotoUrl)
        }
      } catch (photoError) {
        console.error('[Character Creation] Error processing photo:', photoError)
        // Continue without photo if processing fails
      }
    }

    // Log character type for debugging
    if (characterType) {
      console.log('[Character Creation] Character type:', JSON.stringify(characterType))
    } else {
      console.log('[Character Creation] Warning: No characterType provided, using default (Child)')
    }

    // Create character in database
    const { data: character, error: dbError } = await createCharacter(
      supabase,
      user.id,
      {
        name,
        age: parseInt(age) || 5,
        gender: (validatedGender as 'boy' | 'girl' | 'other'), // FIX: Use validatedGender (25 Ocak 2026)
        character_type: characterType || { group: 'Child', value: 'Child', displayName: name }, // NEW: Character type info
        hair_color: hairColor || 'brown',
        eye_color: eyeColor || 'brown',
        features: Array.isArray(specialFeatures) ? specialFeatures : [],
        reference_photo_url: referencePhotoUrl,
        reference_photo_path: referencePhotoPath,
        description: characterDescription,
        is_default: true, // First character is default
        // No AI analysis fields
        ai_analysis: null,
        full_description: null,
        analysis_raw: null,
        analysis_confidence: null,
      }
    )

    if (dbError || !character) {
      console.error('[Character Creation] Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create character in database', details: dbError?.message },
        { status: 500 }
      )
    }

    console.log('[Character Creation] Character created successfully:', character.id)

    return NextResponse.json({
      success: true,
      character: {
        id: character.id,
        name: character.name,
        age: character.age,
        gender: character.gender,
        reference_photo_url: character.reference_photo_url,
      },
      message: 'Character created successfully',
    })
  } catch (error) {
    console.error('[Character Creation] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create character',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
