/**
 * Character Analysis API
 * 
 * POST /api/characters/analyze
 * Analyzes reference photo and creates master character description
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { generateCharacterAnalysisPrompt } from '@/lib/prompts/image/character'
import { createCharacter } from '@/lib/db/characters'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()

    // Parse request body
    const body = await request.json()
    const {
      photoUrl,
      photoBase64,
      name,
      age,
      gender,
      additionalDetails,
      skipOpenAI, // DEBUG: Skip OpenAI API call, use mock analysis
      mockAnalysis, // DEBUG: Mock analysis data
    } = body

    // Validation
    if (!name || !age || !gender) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, gender' },
        { status: 400 }
      )
    }

    // If skipOpenAI is true, use mock analysis (DEBUG mode)
    let characterData: any
    if (skipOpenAI && mockAnalysis) {
      console.log('[Character Analysis API] DEBUG: Using mock analysis (skipping OpenAI API call)')
      
      // Use mock analysis data, structure it to match both OpenAI response format and CharacterDescription
      characterData = {
        name,
        age: parseInt(age),
        gender,
        // OpenAI response format (for consistency)
        hair: {
          color: additionalDetails?.hairColor || 'brown',
          length: mockAnalysis.hairLength || 'short',
          style: mockAnalysis.hairStyle || 'straight',
          texture: mockAnalysis.hairTexture || 'smooth',
        },
        physicalFeatures: {
          faceShape: mockAnalysis.faceShape || 'round',
          eyeShape: mockAnalysis.eyeShape || 'round',
          eyeColor: additionalDetails?.eyeColor || 'brown',
          skinTone: mockAnalysis.skinTone || 'fair',
        },
        uniqueFeatures: [],
        typicalExpression: 'happy',
        personalityTraits: ['curious', 'friendly'],
        clothingStyle: 'casual',
        clothingColors: ['blue', 'red'],
        confidence: 0.9,
        // CharacterDescription format (for database)
        finalDescription: {
          age: parseInt(age),
          gender,
          skinTone: mockAnalysis.skinTone || 'fair',
          hairColor: additionalDetails?.hairColor || 'brown',
          hairStyle: mockAnalysis.hairStyle || 'straight',
          hairLength: mockAnalysis.hairLength || 'short',
          eyeColor: additionalDetails?.eyeColor || 'brown',
          eyeShape: mockAnalysis.eyeShape || 'round',
          faceShape: mockAnalysis.faceShape || 'round',
          height: 'average',
          build: 'normal',
          clothingStyle: 'casual',
          clothingColors: ['blue', 'red'],
          defaultClothing: mockAnalysis.defaultClothing || 'casual blue and red outfit',
          uniqueFeatures: [],
          typicalExpression: 'happy',
          personalityTraits: ['curious', 'friendly'],
        },
      }
    } else {
      // Normal flow: Call OpenAI Vision API
      if (!photoUrl && !photoBase64) {
        return NextResponse.json(
          { error: 'Either photoUrl or photoBase64 is required' },
          { status: 400 }
        )
      }

      // Generate analysis prompt
      const analysisPrompt = generateCharacterAnalysisPrompt(
        'Analyze this photo and extract detailed character features',
        {
          name,
          age: parseInt(age),
          gender,
          additionalDetails,
        }
      )

      // Call OpenAI Vision API
      const imageInput = photoUrl
        ? { type: 'image_url' as const, image_url: { url: photoUrl } }
        : {
            type: 'image_url' as const,
            image_url: { url: `data:image/jpeg;base64,${photoBase64}` },
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

      // Parse JSON response
      characterData = JSON.parse(analysisResult)
    }

    // Extract specific fields from OpenAI analysis (or mock) for database columns
    const hairColor = characterData.hair?.color || characterData.finalDescription?.hairColor || additionalDetails?.hairColor || 'brown'
    const eyeColor = characterData.physicalFeatures?.eyeColor || characterData.finalDescription?.eyeColor || additionalDetails?.eyeColor || 'brown'
    const features = characterData.uniqueFeatures || characterData.finalDescription?.uniqueFeatures || []
    
    // Use finalDescription if available (for mock), otherwise construct from OpenAI response
    const rawDesc = characterData.finalDescription || {
      age: characterData.age || parseInt(age),
      gender: characterData.gender || gender,
      skinTone: characterData.physicalFeatures?.skinTone || 'fair',
      hairColor: hairColor,
      hairStyle: characterData.hair?.style || 'straight',
      hairLength: characterData.hair?.length || 'short',
      eyeColor: eyeColor,
      eyeShape: characterData.physicalFeatures?.eyeShape || 'round',
      faceShape: characterData.physicalFeatures?.faceShape || 'round',
      height: 'average',
      build: 'normal',
      clothingStyle: characterData.clothingStyle?.style ?? characterData.clothingStyle ?? 'casual',
      clothingColors: characterData.clothingStyle?.colors ?? characterData.clothingColors ?? ['blue', 'red'],
      uniqueFeatures: features,
      typicalExpression: characterData.typicalExpression || 'happy',
      personalityTraits: characterData.personalityTraits || ['curious', 'friendly'],
    }
    // Faz 1: defaultClothing from analysis (exact outfit from photo for story/image consistency)
    const defaultClothing =
      characterData.defaultClothing ||
      (rawDesc.clothingStyle && Array.isArray(rawDesc.clothingColors)
        ? `${rawDesc.clothingStyle} in ${rawDesc.clothingColors.join(' and ')}`
        : undefined)
    const characterDescription = { ...rawDesc, ...(defaultClothing && { defaultClothing }) }

    // Create character in database
    const { data: character, error: dbError } = await createCharacter(
      user.id,
      {
        name: characterData.name || name,
        age: characterData.age || parseInt(age),
        gender: (characterData.gender || gender) as 'boy' | 'girl' | 'other',
        hair_color: hairColor,
        eye_color: eyeColor,
        features: features,
        reference_photo_url: photoUrl,
        ai_analysis: characterData,
        full_description: JSON.stringify(characterData),
        description: characterDescription,
        analysis_raw: characterData,
        analysis_confidence: characterData.confidence || 0.8,
        is_default: true, // First character is default
      }
    )

    if (dbError || !character) {
      throw new Error('Failed to create character in database')
    }

    return NextResponse.json({
      success: true,
      character: {
        id: character.id,
        name: character.name,
        age: character.age,
        gender: character.gender,
        description: character.description,
        confidence: character.analysis_confidence,
        reference_photo_url: character.reference_photo_url || photoUrl || null,
        reference_photo_path: character.reference_photo_path || null,
      },
      message: 'Character analyzed successfully',
    })
  } catch (error) {
    console.error('Error analyzing character:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze character',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

