/**
 * Cover Generation API
 * 
 * POST /api/ai/generate-cover
 * Generates book cover using GPT-image API with reference photo support
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildDetailedCharacterPrompt } from '@/lib/prompts/image/v1.0.0/character'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Authentication
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      characterDescription,
      illustrationStyle,
      theme,
      title,
      referenceImageUrl, // Reference photo URL (base64 data URL)
      useFreeCredit = false,
      model = 'gpt-image-1', // gpt-image-1.5, gpt-image-1, gpt-image-1-mini
      size = '1024x1024', // 1024x1024, 1024x1792, 1792x1024
    } = body

    // Validation
    if (!characterDescription || !illustrationStyle || !theme || !title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: characterDescription, illustrationStyle, theme, title',
        },
        { status: 400 }
      )
    }

    // Validate reference image URL if provided
    if (referenceImageUrl && !referenceImageUrl.startsWith('data:') && !referenceImageUrl.startsWith('http')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid reference image URL format',
        },
        { status: 400 }
      )
    }

    // Check free cover credit if requested
    if (useFreeCredit) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('free_cover_used')
        .eq('id', user.id)
        .single()

      if (userError) {
        console.error('[Cover Generation] Error fetching user data:', userError)
        return NextResponse.json(
          { success: false, error: 'Failed to check free cover credit' },
          { status: 500 }
        )
      }

      if (userData?.free_cover_used) {
        return NextResponse.json(
          {
            success: false,
            error: 'Free cover credit already used',
            code: 'FREE_COVER_USED',
          },
          { status: 403 }
        )
      }
    }

    // Build cover prompt (text description)
    const coverScene = `A magical book cover for a children's story titled "${title}" in a ${theme} theme. The main character should be prominently displayed in the center with an inviting, whimsical background that captures the essence of the story. The composition should be eye-catching and suitable for a children's book cover, with space for title text at the top. Vibrant, warm colors with a sense of wonder and adventure.`

    const textPrompt = buildDetailedCharacterPrompt(
      characterDescription,
      illustrationStyle,
      coverScene
    )

    console.log('[Cover Generation] Using GPT-image API:', model)
    console.log('[Cover Generation] Text prompt:', textPrompt.substring(0, 200) + '...')
    console.log('[Cover Generation] Reference image:', referenceImageUrl ? 'Provided' : 'Not provided')

    // Call GPT-image API using /v1/images/edits endpoint
    // This endpoint supports text prompt + reference image (multimodal)
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    console.log('[Cover Generation] Calling GPT-image API (edits) with model:', model)

    const formData = new FormData()
    formData.append('model', model) // gpt-image-1.5, gpt-image-1, gpt-image-1-mini
    formData.append('prompt', textPrompt)
    formData.append('size', size) // 1024x1024, 1024x1792, 1792x1024
    
    // Add reference image if provided
    if (referenceImageUrl) {
      // Check if it's a data URL (base64)
      if (referenceImageUrl.startsWith('data:')) {
        // Convert base64 to Blob
        const base64Data = referenceImageUrl.split(',')[1]
        const mimeType = referenceImageUrl.split(';')[0].split(':')[1]
        const binaryStr = atob(base64Data)
        const len = binaryStr.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: mimeType })
        formData.append('image', blob, 'reference.png')
      } else {
        // Fetch image from URL and append as Blob
        const imageRes = await fetch(referenceImageUrl)
        const imageBlob = await imageRes.blob()
        formData.append('image', imageBlob, 'reference.png')
      }
    } else {
      // If no reference image, we should use generations endpoint, 
      // but for consistency with this route's purpose (multimodal), 
      // we might need a placeholder or switch endpoint.
      // However, edits endpoint REQUIRES an image.
      // Fallback to generations if no image provided
      if (!referenceImageUrl) {
        console.log('[Cover Generation] No reference image, switching to /v1/images/generations')
        const genResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            prompt: textPrompt,
            n: 1,
            size: size, // Use provided size parameter
            response_format: "url"
          })
        })
        
        if (!genResponse.ok) {
           const errorText = await genResponse.text()
           throw new Error(`GPT-image Generation API error: ${genResponse.status} - ${errorText}`)
        }
        
        const genResult = await genResponse.json()
        const coverUrl = genResult.data[0].url
        
        // ... (rest of the code for upload/response)
        console.log('[Cover Generation] Cover generated successfully:', coverUrl)

        // Download image and upload to Supabase Storage
        const imageBuffer = await fetch(coverUrl).then((res) => res.arrayBuffer())
        const fileName = `cover_${Date.now()}.png`
        const filePath = `${user.id}/covers/${fileName}`

        console.log('[Cover Generation] Uploading to Supabase Storage:', filePath)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('book-images')
          .upload(filePath, imageBuffer, {
            contentType: 'image/png',
            upsert: false,
          })

        if (uploadError) {
          console.error('[Cover Generation] Error uploading to Supabase Storage:', uploadError)
          return NextResponse.json({
            success: true,
            data: {
              coverUrl: coverUrl,
              model: model,
              storage: {
                uploaded: false,
                error: uploadError.message,
              },
            },
            warning: 'Cover generated but failed to upload to storage',
          })
        }

        const { data: publicUrlData } = supabase.storage
          .from('book-images')
          .getPublicUrl(filePath)

        const storageCoverUrl = publicUrlData?.publicUrl || coverUrl

        return NextResponse.json({
          success: true,
          data: {
            coverUrl: storageCoverUrl,
            model: model,
            originalPrompt: textPrompt,
            revisedPrompt: genResult.data[0].revised_prompt || textPrompt,
            referenceImageUsed: false,
            storage: {
              uploaded: true,
              path: filePath,
            },
            generationTime: Date.now() - startTime,
            usedFreeCredit: useFreeCredit,
          },
          message: 'Cover generated successfully'
        })
      }
    }

    const apiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // Content-Type header is set automatically with FormData
      },
      body: formData,
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error('[Cover Generation] API Error:', apiResponse.status, errorText)
      throw new Error(`GPT-image API error: ${apiResponse.status} - ${errorText}`)
    }

    const apiResult = await apiResponse.json()
    console.log('[Cover Generation] API Response:', JSON.stringify(apiResult).substring(0, 500) + '...')

    // Extract image URL from response (standard images API format)
    const coverUrl = apiResult.data?.[0]?.url

    if (!coverUrl) {
      console.error('[Cover Generation] Could not extract image URL from response:', JSON.stringify(apiResult, null, 2))
      throw new Error('No image URL found in GPT-image API response')
    }

    console.log('[Cover Generation] Cover generated successfully:', coverUrl)

    // Download image and upload to Supabase Storage
    const imageBuffer = await fetch(coverUrl).then((res) => res.arrayBuffer())
    const fileName = `cover_${Date.now()}.png`
    const filePath = `${user.id}/covers/${fileName}`

    console.log('[Cover Generation] Uploading to Supabase Storage:', filePath)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('book-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (uploadError) {
      console.error('[Cover Generation] Error uploading to Supabase Storage:', uploadError)
      // Return API URL even if upload fails
      return NextResponse.json({
        success: true,
        data: {
          coverUrl: coverUrl,
          model: model,
          storage: {
            uploaded: false,
            error: uploadError.message,
          },
        },
        warning: 'Cover generated but failed to upload to storage',
      })
    }

    // Get public URL from Supabase Storage
    const { data: publicUrlData } = supabase.storage
      .from('book-images')
      .getPublicUrl(filePath)

    const storageCoverUrl = publicUrlData?.publicUrl || coverUrl

    console.log('[Cover Generation] Cover uploaded to storage:', storageCoverUrl)

    // Mark free cover as used if requested
    if (useFreeCredit) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ free_cover_used: true })
        .eq('id', user.id)

      if (updateError) {
        console.error('[Cover Generation] Error marking free cover as used:', updateError)
      } else {
        console.log('[Cover Generation] Free cover credit marked as used for user:', user.id)
      }
    }

    const generationTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      data: {
        coverUrl: storageCoverUrl,
        model: model,
        originalPrompt: textPrompt,
        referenceImageUsed: !!referenceImageUrl,
        storage: {
          uploaded: true,
          path: filePath,
        },
        generationTime,
        usedFreeCredit: useFreeCredit,
      },
      message: useFreeCredit
        ? 'Cover generated successfully using free credit'
        : 'Cover generated successfully',
    })
  } catch (error) {
    console.error('[Cover Generation] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate cover',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
