/**
 * Character Creation API
 * 
 * POST /api/characters
 * Creates a character with AI photo analysis for non-Child characters
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCharacter } from '@/lib/db/characters'
import { generateCharacterAnalysisPrompt } from '@/lib/prompts/image/v1.0.0/character'
import type { CharacterDescription } from '@/lib/prompts/types'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
      photoBase64, // Base64 encoded photo (data URL without prefix)
      characterType, // NEW: Character type info {group, value, displayName}
    } = body

    // FIX: Gender validation based on characterType (25 Ocak 2026)
    // Automatic gender correction for male/female character types - prevents incorrect gender from frontend
    let validatedGender = gender ? gender.toLowerCase() : ''
    
    if (characterType) {
      const charTypeValue = characterType.value?.toLowerCase() || ''
      const charName = name?.toLowerCase() || ''
      const charDisplayName = characterType.displayName?.toLowerCase() || ''
      
      // Male character types - automatic "boy" gender
      const maleTypes = ['dad', 'father', 'brother', 'grandpa', 'grandfather', 'uncle']
      const maleKeywords = ['uncle', 'brother', 'dad', 'father', 'grandpa', 'grandfather']
      
      if (maleTypes.includes(charTypeValue) || 
          maleKeywords.some(keyword => charName.includes(keyword) || charDisplayName.includes(keyword))) {
        validatedGender = 'boy'
        console.log(`[Character Creation] 🔧 Gender auto-corrected: ${characterType.value || name} character must be "boy" (was: ${gender})`)
      }
      // Female character types - automatic "girl" gender
      else if (charTypeValue === "mom" || charTypeValue === "mother" || 
               charTypeValue === "sister" || charTypeValue === "grandma" || charTypeValue === "grandmother" ||
               charTypeValue === "aunt") {
        validatedGender = 'girl'
        console.log(`[Character Creation] 🔧 Gender auto-corrected: ${characterType.value || name} character must be "girl" (was: ${gender})`)
      }
      // "Other Family" - determine gender based on name
      else if (characterType.value === "Other Family" || characterType.value === "other family") {
        const femaleKeywords = ['aunt', 'mother', 'mom', 'sister', 'grandma', 'grandmother']
        const hasFemaleKeyword = femaleKeywords.some(keyword => charName.includes(keyword) || charDisplayName.includes(keyword))
        
        if (hasFemaleKeyword) {
          validatedGender = 'girl'
          console.log(`[Character Creation] 🔧 Gender auto-corrected: ${name} (Other Family) character must be "girl" based on name (was: ${gender})`)
        } else if (maleKeywords.some(keyword => charName.includes(keyword) || charDisplayName.includes(keyword))) {
          validatedGender = 'boy'
          console.log(`[Character Creation] 🔧 Gender auto-corrected: ${name} (Other Family) character must be "boy" based on name (was: ${gender})`)
        }
      }
    }
    
    // Validation
    // Toys don't need gender validation (gender-neutral)
    const isToys = characterType?.group === 'Toys'
    if (!name || !age || (!validatedGender && !isToys)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, gender' },
        { status: 400 }
      )
    }

    // Determine if AI analysis is needed
    const needsAIAnalysis = photoBase64 && characterType && characterType.group !== 'Child'
    let characterDescription: CharacterDescription
    let aiAnalysisData: any = null
    let analysisConfidence: number | null = null

    if (needsAIAnalysis) {
      // Perform AI analysis for non-Child characters with photos
      console.log(`[Character Creation] 🤖 Performing AI analysis for ${characterType.group} character`)
      
      try {
        const additionalStr = [hairColor && `Hair: ${hairColor}`, eyeColor && `Eyes: ${eyeColor}`].filter(Boolean).join(', ') || undefined
        const analysisPrompt = generateCharacterAnalysisPrompt(
          'Analyze this photo and extract detailed character features',
          {
            name,
            age: parseInt(age) || 5,
            gender: validatedGender || 'other',
            additionalDetails: additionalStr,
          }
        )

        const imageInput = {
          type: 'image_url' as const,
          image_url: { url: `data:image/jpeg;base64,${photoBase64.includes(',') ? photoBase64.split(',')[1] : photoBase64}` },
        }

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: analysisPrompt },
                imageInput,
              ],
            },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
        })

        const analysisResult = completion.choices[0].message.content
        if (!analysisResult) {
          throw new Error('No analysis result from OpenAI')
        }

        aiAnalysisData = JSON.parse(analysisResult)
        analysisConfidence = aiAnalysisData.confidence || 0.8

        // Extract fields from AI analysis, merge with user-provided data
        const analyzedHairColor = aiAnalysisData.hair?.color || aiAnalysisData.finalDescription?.hairColor || hairColor || 'brown'
        const analyzedEyeColor = aiAnalysisData.physicalFeatures?.eyeColor || aiAnalysisData.finalDescription?.eyeColor || eyeColor || 'brown'
        const analyzedFeatures = aiAnalysisData.uniqueFeatures || aiAnalysisData.finalDescription?.uniqueFeatures || []

        // Build character description from AI analysis
        characterDescription = aiAnalysisData.finalDescription || {
          age: aiAnalysisData.age || parseInt(age) || 5,
          gender: validatedGender || aiAnalysisData.gender || 'other',
          skinTone: aiAnalysisData.physicalFeatures?.skinTone || 'fair',
          hairColor: hairColor || analyzedHairColor, // User input takes priority
          hairStyle: aiAnalysisData.hair?.style || 'natural',
          hairLength: aiAnalysisData.hair?.length || (parseInt(age) <= 3 ? 'short' : parseInt(age) <= 7 ? 'medium' : 'long'),
          eyeColor: eyeColor || analyzedEyeColor, // User input takes priority
          eyeShape: aiAnalysisData.physicalFeatures?.eyeShape || 'round',
          faceShape: aiAnalysisData.physicalFeatures?.faceShape || 'round',
          height: aiAnalysisData.body?.heightForAge || 'average',
          build: aiAnalysisData.body?.build || 'normal',
          clothingStyle: aiAnalysisData.clothingStyle?.style || 'casual',
          clothingColors: aiAnalysisData.clothingStyle?.colors || ['blue', 'red'],
          uniqueFeatures: analyzedFeatures,
          typicalExpression: aiAnalysisData.expression?.typical || 'happy',
          personalityTraits: aiAnalysisData.personalityTraits || ['curious', 'friendly'],
        }

        console.log(`[Character Creation] ✅ AI analysis completed (confidence: ${analysisConfidence})`)
      } catch (analysisError) {
        console.error('[Character Creation] ⚠️ AI analysis failed, falling back to basic description:', analysisError)
        // Fallback to basic description if analysis fails
        characterDescription = {
          age: parseInt(age) || 5,
          gender: validatedGender || 'other',
          skinTone: 'fair',
          hairColor: hairColor || 'brown',
          hairStyle: 'natural',
          hairLength: parseInt(age) <= 3 ? 'short' : parseInt(age) <= 7 ? 'medium' : 'long',
          eyeColor: eyeColor || 'brown',
          eyeShape: 'round',
          faceShape: 'round',
          height: 'average',
          build: 'normal',
          clothingStyle: 'casual',
          clothingColors: ['blue', 'red'],
          uniqueFeatures: [],
          typicalExpression: 'happy',
          personalityTraits: ['curious', 'friendly'],
        }
      }
    } else {
      // Build character description from Step 1 data (simple mapping, no AI Analysis)
      characterDescription = {
        age: parseInt(age) || 5,
        gender: validatedGender || 'other',
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
        uniqueFeatures: [],
        typicalExpression: 'happy',
        personalityTraits: ['curious', 'friendly'], // Default
      }
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
        features: [],
        reference_photo_url: referencePhotoUrl,
        reference_photo_path: referencePhotoPath,
        description: characterDescription,
        is_default: true, // First character is default
        // AI analysis fields (only for non-Child characters with photos)
        ai_analysis: aiAnalysisData,
        full_description: aiAnalysisData ? JSON.stringify(aiAnalysisData) : null,
        analysis_raw: aiAnalysisData,
        analysis_confidence: analysisConfidence,
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
