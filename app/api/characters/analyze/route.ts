/**
 * Character Analysis API
 * 
 * POST /api/characters/analyze
 * Analyzes reference photo and creates master character description
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateCharacterAnalysisPrompt } from '@/lib/prompts/image/v1.0.0/character'
import { createCharacter } from '@/lib/db/characters'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
    const {
      photoUrl,
      photoBase64,
      name,
      age,
      gender,
      additionalDetails,
    } = body

    // Validation
    if (!name || !age || !gender) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, gender' },
        { status: 400 }
      )
    }

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
    const characterData = JSON.parse(analysisResult)

    // Create character in database
    const { data: character, error: dbError } = await createCharacter(
      user.id,
      {
        name: characterData.name || name,
        age: characterData.age || parseInt(age),
        gender: characterData.gender || gender,
        description: characterData,
        reference_photo_url: photoUrl,
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

