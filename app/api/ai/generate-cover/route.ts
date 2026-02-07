/**
 * Cover Generation API
 * 
 * POST /api/ai/generate-cover
 * Generates book cover using GPT-image API with reference photo support
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/api-auth'
import { uploadFile, getPublicUrl } from '@/lib/storage/s3'
import { getUserById, updateUser } from '@/lib/db/users'
import { buildDetailedCharacterPrompt } from '@/lib/prompts/image/character'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Authentication
    const user = await requireUser()

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
      const userData = await getUserById(user.id)

      if (!userData) {
        console.error('[Cover Generation] User not found:', user.id)
        return NextResponse.json(
          { success: false, error: 'Failed to check free cover credit' },
          { status: 500 }
        )
      }

      if (userData.free_cover_used) {
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

        // Download image and upload to S3
        const imageBuffer = await fetch(coverUrl).then((res) => res.arrayBuffer())
        const fileName = `${user.id}/covers/cover_${Date.now()}.png`

        console.log('[Cover Generation] Uploading to S3:', fileName)

        try {
          const s3Key = await uploadFile('covers', fileName, Buffer.from(imageBuffer), 'image/png')
          const storageCoverUrl = getPublicUrl(s3Key)

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
                path: fileName,
              },
              generationTime: Date.now() - startTime,
              usedFreeCredit: useFreeCredit,
            },
            message: 'Cover generated successfully'
          })
        } catch (uploadError) {
          console.error('[Cover Generation] Error uploading to S3:', uploadError)
          return NextResponse.json({
            success: true,
            data: {
              coverUrl: coverUrl,
              model: model,
              storage: {
                uploaded: false,
                error: (uploadError as Error).message,
              },
            },
            warning: 'Cover generated but failed to upload to storage',
          })
        }
      }
    }

    console.log('[Cover Generation] ==========================================')
    console.log('[Cover Generation] Request Configuration:')
    console.log('[Cover Generation] - Endpoint: /v1/images/edits')
    console.log('[Cover Generation] - Model:', model)
    console.log('[Cover Generation] - Size:', size)
    console.log('[Cover Generation] - Reference Image: Provided')
    console.log('[Cover Generation] - Prompt Length:', textPrompt.length)
    console.log('[Cover Generation] - FormData Keys:', Array.from(formData.keys()))
    console.log('[Cover Generation] ==========================================')

    const apiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // Content-Type header is set automatically with FormData
      },
      body: formData,
    })

    console.log('[Cover Generation] API Response Status:', apiResponse.status, apiResponse.statusText)
    console.log('[Cover Generation] API Response Headers:', Object.fromEntries(apiResponse.headers.entries()))

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error('[Cover Generation] ==========================================')
      console.error('[Cover Generation] API Error Details:')
      console.error('[Cover Generation] - Status:', apiResponse.status)
      console.error('[Cover Generation] - Status Text:', apiResponse.statusText)
      console.error('[Cover Generation] - Error Body:', errorText)
      console.error('[Cover Generation] ==========================================')
      
      // Try to parse error JSON for better error handling
      try {
        const errorJson = JSON.parse(errorText)
        console.error('[Cover Generation] Parsed Error:', errorJson?.error?.message ?? errorText?.slice(0, 300))
        
        // Check if it's a verification error
        if (errorJson.error?.message?.includes('organization must be verified')) {
          console.error('[Cover Generation] ❌ ERROR TYPE: Organization Verification Required')
          console.error('[Cover Generation] 💡 SOLUTION: Verify organization at https://platform.openai.com/settings/organization/general')
          console.error('[Cover Generation] ⏱️ PROPAGATION TIME: Up to 15 minutes after verification')
        }
      } catch (e) {
        console.error('[Cover Generation] Could not parse error JSON')
      }
      
      throw new Error(`GPT-image API error: ${apiResponse.status} - ${errorText}`)
    }

    const apiResult = await apiResponse.json()
    console.log('[Cover Generation] API Response received (hasData:', !!apiResult?.data, ', dataLength:', apiResult?.data?.length ?? 0, ')')

    // Extract image URL from response
    // GPT-image API /v1/images/edits endpoint returns: { data: [{ url: "...", ... }] }
    // OR sometimes: { data: [{ b64_json: "...", ... }] } (if output_format is b64_json)
    let coverUrl: string | null = null
    
    if (apiResult.data && Array.isArray(apiResult.data) && apiResult.data.length > 0) {
      const firstItem = apiResult.data[0]
      // Try URL first (most common)
      if (firstItem.url) {
        coverUrl = firstItem.url
      } 
      // Try b64_json (if output_format was b64_json)
      else if (firstItem.b64_json) {
        // Convert base64 to data URL
        coverUrl = `data:image/png;base64,${firstItem.b64_json}`
      }
      // Try direct URL (some APIs return directly)
      else if (typeof apiResult.data[0] === 'string') {
        coverUrl = apiResult.data[0]
      }
    }
    // Alternative: direct URL in response
    else if (apiResult.url) {
      coverUrl = apiResult.url
    }

    if (!coverUrl) {
      console.error('[Cover Generation] Could not extract image URL from response. Response structure:', {
        hasData: !!apiResult.data,
        dataType: typeof apiResult.data,
        isArray: Array.isArray(apiResult.data),
        dataLength: apiResult.data?.length,
        firstItemKeys: apiResult.data?.[0] ? Object.keys(apiResult.data[0]) : [],
        hasUrl: !!apiResult.url,
      })
      throw new Error('No image URL found in GPT-image API response')
    }

    console.log('[Cover Generation] Cover generated successfully:', coverUrl)

    // Download image and upload to S3
    const imageBuffer = await fetch(coverUrl).then((res) => res.arrayBuffer())
    const fileName = `${user.id}/covers/cover_${Date.now()}.png`

    console.log('[Cover Generation] Uploading to S3:', fileName)

    try {
      const s3Key = await uploadFile('covers', fileName, Buffer.from(imageBuffer), 'image/png')
      const storageCoverUrl = getPublicUrl(s3Key)

      console.log('[Cover Generation] Cover uploaded to S3:', storageCoverUrl)

      // Mark free cover as used if requested
      if (useFreeCredit) {
        try {
          await updateUser(user.id, { free_cover_used: true })
          console.log('[Cover Generation] Free cover credit marked as used for user:', user.id)
        } catch (updateError) {
          console.error('[Cover Generation] Error marking free cover as used:', updateError)
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
            path: s3Key,
          },
          generationTime,
          usedFreeCredit: useFreeCredit,
        },
        message: useFreeCredit
          ? 'Cover generated successfully using free credit'
        : 'Cover generated successfully',
    })
    } catch (uploadErr) {
      console.error('[Cover Generation] Upload error:', uploadErr)
      throw uploadErr
    }
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
