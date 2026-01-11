/**
 * Books API
 * 
 * POST /api/books - Create new book (triggers story generation)
 * GET /api/books - Get user's books
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
// Note: createClient now supports Bearer token from Authorization header
import { getCharacterById } from '@/lib/db/characters'
import { createBook, getUserBooks, updateBook, getBookById } from '@/lib/db/books'
import { generateStoryPrompt } from '@/lib/prompts/story/v1.0.0/base'
import { successResponse, errorResponse, handleAPIError, CommonErrors } from '@/lib/api/response'
import { buildDetailedCharacterPrompt } from '@/lib/prompts/image/v1.0.0/character'
import { generateFullPagePrompt } from '@/lib/prompts/image/v1.0.0/scene'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface CreateBookRequest {
  characterId: string
  theme: string
  illustrationStyle: string
  customRequests?: string
  pageCount?: number // Debug: Optional page count override (3-20)
  language?: 'en' | 'tr'
  storyModel?: string // Story generation model (default: 'gpt-3.5-turbo')
  imageModel?: string // Image generation model (default: 'gpt-image-1-mini')
  imageSize?: string // Image size (default: '1024x1024')
}

export interface CreateBookResponse {
  id: string
  title: string
  status: 'draft' | 'generating' | 'completed' | 'failed'
  totalPages: number
  theme: string
  illustrationStyle: string
  character: {
    id: string
    name: string
  }
  generationTime: number
  tokensUsed: number
}

// ============================================================================
// POST /api/books - Create new book and generate story
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Authentication (supports both Bearer token and session cookies)
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return CommonErrors.unauthorized('Please login to continue')
    }

    // Parse & Validate Request
    const body: CreateBookRequest = await request.json()
    const {
      characterId,
      theme,
      illustrationStyle,
      customRequests,
      pageCount, // Debug: Optional page count override (0 or undefined = cover only)
      language = 'en',
      storyModel = 'gpt-3.5-turbo', // Default: GPT-3.5 Turbo (Legacy)
      imageModel = 'gpt-image-1-mini', // Default: GPT-image-1-mini (Fast)
      imageSize = '1024x1024', // Default: 1024x1024 (Square)
    } = body

    if (!characterId || !theme || !illustrationStyle) {
      return CommonErrors.badRequest(
        'characterId, theme, and illustrationStyle are required'
      )
    }

    // Get Character (using authenticated supabase client)
    const { data: character, error: charError } = await getCharacterById(supabase, characterId)

    if (charError || !character) {
      return CommonErrors.notFound('Character')
    }

    // Verify ownership
    if (character.user_id !== user.id) {
      return CommonErrors.forbidden('You do not own this character')
    }

    // ====================================================================
    // DETERMINE MODE: Cover Only or Full Book
    // ====================================================================
    const isCoverOnlyMode = !pageCount || pageCount === 0
    
    console.log(`[Create Book] 📋 Mode: ${isCoverOnlyMode ? 'Cover Only' : 'Full Book'} (pageCount: ${pageCount || 'undefined'})`)

    let storyData: any = null
    let completion: any = null
    let book: any = null

    // ====================================================================
    // COVER ONLY MODE: Skip story generation
    // ====================================================================
    if (isCoverOnlyMode) {
      console.log('[Create Book] ⏭️  Skipping story generation (cover only mode)')
      console.log('[Create Book] 📝 Creating book with minimal data...')

      // Create book with minimal data (no story, just metadata)
      const bookTitle = `${character.name}'s ${theme.charAt(0).toUpperCase() + theme.slice(1)} Adventure`
      
      const { data: createdBook, error: bookError } = await createBook(supabase, user.id, {
        character_id: characterId,
        title: bookTitle,
        theme,
        illustration_style: illustrationStyle,
        language,
        age_group: 'preschool', // Default for cover only
        total_pages: 0, // Cover only = 0 pages
        story_data: null, // No story in cover only mode
        status: 'draft', // Will be updated after cover generation
        custom_requests: customRequests,
        images_data: [], // No page images in cover only mode
        generation_metadata: {
          model: storyModel,
          imageModel: imageModel,
          imageSize: imageSize,
          promptVersion: '1.0.0',
          tokensUsed: 0, // No story generation
          generationTime: 0,
          mode: 'cover-only',
        },
      })

      if (bookError || !createdBook) {
        console.error('Database error:', bookError)
        throw new Error('Failed to save book to database')
      }

      book = createdBook
      console.log(`[Create Book] ✅ Book created: ${book.id} (cover only)`)
    }
    // ====================================================================
    // FULL BOOK MODE: Generate story
    // ====================================================================
    else {
      console.log('[Create Book] 📖 Starting story generation...')

      // Generate Story Prompt
      const storyPrompt = generateStoryPrompt({
        characterName: character.name,
        characterAge: character.age,
        characterGender: character.gender,
        theme,
        illustrationStyle,
        customRequests,
        pageCount: pageCount, // Debug: Optional page count override
        referencePhotoAnalysis: {
          detectedFeatures: character.description.physicalFeatures || {},
          finalDescription: character.description,
          confidence: character.analysis_confidence || 0.8,
        },
        language,
      })

      console.log(`[Create Book] 🤖 Calling OpenAI for story generation (model: ${storyModel})`)
      console.log('[Create Book] ⏱️  Story request started at:', new Date().toISOString())
      const storyReqStart = Date.now()

      // Call OpenAI with selected model
      completion = await openai.chat.completions.create({
        model: storyModel,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional children\'s book author. Create engaging, age-appropriate stories with detailed image prompts.',
          },
          {
            role: 'user',
            content: storyPrompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 4000,
      })
      const storyReqMs = Date.now() - storyReqStart
      console.log('[Create Book] ⏱️  Story response time:', storyReqMs, 'ms')

      const storyContent = completion.choices[0].message.content
      if (!storyContent) {
        throw new Error('No story content generated')
      }

      // Parse JSON response
      storyData = JSON.parse(storyContent)

      // Validate Story Structure
      if (!storyData.title || !storyData.pages || !Array.isArray(storyData.pages)) {
        throw new Error('Invalid story structure from AI')
      }

      // Enforce requested pageCount strictly (no more than requested)
      if (pageCount !== undefined && pageCount !== null) {
        const requestedPages = Number(pageCount)
        const returnedPages = storyData.pages.length

        console.log(`[Create Book] 📏 Requested pages: ${requestedPages}, AI returned: ${returnedPages}`)

        if (returnedPages > requestedPages) {
          console.warn(`[Create Book] ⚠️  AI returned more pages than requested. Trimming to ${requestedPages} pages.`)
          storyData.pages = storyData.pages.slice(0, requestedPages)
        } else if (returnedPages < requestedPages) {
          console.error(`[Create Book] ❌ AI returned fewer pages than requested (${returnedPages}/${requestedPages}). Aborting to avoid incorrect book.`)
          throw new Error(`AI returned fewer pages than requested (${returnedPages}/${requestedPages})`)
        }

        // Renumber pages consistently (1..N)
        storyData.pages = storyData.pages.map((page: any, idx: number) => ({
          ...page,
          pageNumber: idx + 1,
        }))
      }

      console.log(`[Create Book] ✅ Story ready: ${storyData.pages.length} pages`)

      // Create Book in Database
      const { data: createdBook, error: bookError } = await createBook(supabase, user.id, {
        character_id: characterId,
        title: storyData.title,
        theme,
        illustration_style: illustrationStyle,
        language,
        age_group: storyData.metadata?.ageGroup || 'preschool',
        total_pages: storyData.pages.length,
        story_data: storyData,
        status: 'draft', // Story generated, images not yet
        custom_requests: customRequests,
        images_data: [], // Will be populated after image generation
        generation_metadata: {
          model: storyModel,
          imageModel: imageModel,
          imageSize: imageSize,
          promptVersion: '1.0.0',
          tokensUsed: completion.usage?.total_tokens || 0,
          generationTime: Date.now() - startTime,
          mode: 'full-book',
        },
      })

      if (bookError || !createdBook) {
        console.error('Database error:', bookError)
        throw new Error('Failed to save book to database')
      }

      book = createdBook
      console.log(`[Create Book] ✅ Book created: ${book.id}`)
    }

    console.log(`[Create Book] 🎨 Starting cover generation...`)

    // ====================================================================
    // STEP 2: GENERATE COVER IMAGE
    // ====================================================================
    try {
      // Update status to 'generating'
      await updateBook(supabase, book.id, { status: 'generating' })
      console.log(`[Create Book] Status updated to 'generating'`)

      // Build cover generation request
      const coverScene = `A magical book cover for a children's story titled "${book.title}" in a ${theme} theme. The main character should be prominently displayed in the center with an inviting, whimsical background that captures the essence of the story. The composition should be eye-catching and suitable for a children's book cover, with space for title text at the top. Vibrant, warm colors with a sense of wonder and adventure.`

      const characterDescription = character.description
      const textPrompt = buildDetailedCharacterPrompt(
        characterDescription,
        illustrationStyle,
        coverScene
      )

      console.log('[Create Book] 🖼️  Calling GPT-image API for cover generation...')
      console.log('[Create Book] 📝 Cover scene description:', coverScene.substring(0, 100) + '...')
      console.log('[Create Book] 🎨 Illustration style:', illustrationStyle)
      console.log('[Create Book] 📋 Character description keys:', Object.keys(characterDescription || {}))
      console.log('[Create Book] 📏 Final prompt length:', textPrompt.length, 'characters')
      console.log('[Create Book] 📄 Prompt preview (first 200 chars):', textPrompt.substring(0, 200) + '...')

      // Call GPT-image API (text-to-image via /v1/images/generations)
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not configured')
      }

      const referenceImageUrl = character.reference_photo_url || null
      let coverImageUrl: string | null = null
      let coverImageB64: string | null = null
      let coverImageOutputFormat: string | null = null
      let referenceImageBlobCreated = false
      let referenceImageBlobSizeBytes: number | null = null

      console.log('[Create Book] 📸 Reference image URL:', referenceImageUrl ? 'Provided ✅' : 'Not provided ❌')

      // Use /v1/images/edits if reference image available, otherwise /v1/images/generations
      if (referenceImageUrl) {
        console.log('[Create Book] 🔧 Attempting to use /v1/images/edits (with reference image)')
        console.log('[Create Book] 📋 Model:', imageModel)
        console.log('[Create Book] 📏 Size:', imageSize)
        console.log('[Create Book] 📝 Prompt will be included: Yes ✅')
        console.log('[Create Book] 📏 Prompt length:', textPrompt.length, 'characters')
        
        // Convert reference image URL to Blob (support both data URL and HTTP URL)
        // Reference image format: Blob (binary data) sent as multipart/form-data
        let imageBlob: Blob | null = null
        const imageProcessingStartTime = Date.now()
        
        try {
          if (referenceImageUrl.startsWith('data:')) {
            console.log('[Create Book] 🔄 Processing data URL reference image...')
            // Data URL: extract base64 data
            const base64Data = referenceImageUrl.split(',')[1]
            const binaryData = Buffer.from(base64Data, 'base64')
            imageBlob = new Blob([binaryData], { type: 'image/png' })
            referenceImageBlobCreated = true
            referenceImageBlobSizeBytes = imageBlob.size
            console.log('[Create Book] ✅ Data URL converted to Blob, size:', imageBlob.size, 'bytes')
          } else {
            // HTTP URL: download the image
            console.log('[Create Book] 📥 Downloading reference image from URL...')
            console.log('[Create Book]   URL length:', referenceImageUrl.length, 'chars')
            console.log('[Create Book]   URL preview:', referenceImageUrl.substring(0, 80) + '...')
            const downloadStartTime = Date.now()
            const imageResponse = await fetch(referenceImageUrl)
            const downloadTime = Date.now() - downloadStartTime
            console.log('[Create Book] ⏱️  Download took:', downloadTime, 'ms')
            
            if (!imageResponse.ok) {
              throw new Error(`Failed to download reference image: ${imageResponse.status} ${imageResponse.statusText}`)
            }
            
            const imageBuffer = await imageResponse.arrayBuffer()
            imageBlob = new Blob([imageBuffer], { type: 'image/png' })
            referenceImageBlobCreated = true
            referenceImageBlobSizeBytes = imageBlob.size
            const processingTime = Date.now() - imageProcessingStartTime
            console.log('[Create Book] ✅ Reference image downloaded successfully')
            console.log('[Create Book] 📊 Image blob size:', imageBlob.size, 'bytes')
            console.log('[Create Book] ⏱️  Total processing time:', processingTime, 'ms')
          }
        } catch (imageError) {
          const processingTime = Date.now() - imageProcessingStartTime
          console.error('[Create Book] ❌ Error processing reference image:', imageError)
          console.error('[Create Book] ⏱️  Processing failed after:', processingTime, 'ms')
          // Fall back to /v1/images/generations if reference image fails
          console.log('[Create Book] ⚠️  Falling back to /v1/images/generations (reference image processing failed)')
          imageBlob = null
        }

        // Only use /v1/images/edits if we have a valid image blob
        if (imageBlob) {
          console.log('[Create Book] 📦 Preparing FormData for /v1/images/edits API call...')
          const formData = new FormData()
          formData.append('model', imageModel)
          formData.append('prompt', textPrompt)
          formData.append('size', imageSize)
          formData.append('image', imageBlob, 'reference.png')
          
          console.log('[Create Book] 📤 FormData prepared:')
          console.log('[Create Book]   - Model:', imageModel)
          console.log('[Create Book]   - Size:', imageSize)
          console.log('[Create Book]   - Image blob size:', imageBlob.size, 'bytes')
          console.log('[Create Book]   - Image format: Blob (multipart/form-data)')
          console.log('[Create Book]   - Prompt included: Yes ✅')
          console.log('[Create Book]   - Reference image included: Yes ✅ (as Blob)')

          const editsApiStartTime = Date.now()
          console.log('[Create Book] 🚀 Calling /v1/images/edits API...')
          console.log('[Create Book] ⏱️  API call started at:', new Date().toISOString())
          
          try {
            const editsResponse = await fetch('https://api.openai.com/v1/images/edits', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
              },
              body: formData,
            })

            const editsApiTime = Date.now() - editsApiStartTime
            console.log('[Create Book] ⏱️  API call completed in:', editsApiTime, 'ms')
            console.log('[Create Book] 📊 Response status:', editsResponse.status, editsResponse.statusText)
            // Avoid logging full headers to keep logs clean (some infra adds verbose headers)
            console.log('[Create Book] 📊 Response content-type:', editsResponse.headers.get('content-type') || 'unknown')

            if (!editsResponse.ok) {
              const errorText = await editsResponse.text()
              console.error('[Create Book] ❌ GPT-image edits API error:')
              console.error('[Create Book]   Status:', editsResponse.status)
              console.error('[Create Book]   Status Text:', editsResponse.statusText)
              console.error('[Create Book]   Error Response:', errorText)
              
              // Try to parse error JSON for better logging
              try {
                const errorJson = JSON.parse(errorText)
                console.error('[Create Book]   Parsed Error:', JSON.stringify(errorJson, null, 2))
              } catch {
                console.error('[Create Book]   Raw Error Text:', errorText)
              }
              
              // Fall back to /v1/images/generations
              console.log('[Create Book] ⚠️  Falling back to /v1/images/generations (edits API failed)')
              coverImageUrl = null
            } else {
              console.log('[Create Book] ✅ Edits API call successful, parsing response...')
            const editsResult = await editsResponse.json()
              console.log('[Create Book] 📦 Response structure:', {
                hasData: !!editsResult.data,
                dataLength: editsResult.data?.length || 0,
                dataType: Array.isArray(editsResult.data) ? 'array' : typeof editsResult.data,
              })
              
              if (editsResult.data && Array.isArray(editsResult.data) && editsResult.data.length > 0) {
                // GPT-image APIs may return either `url` or `b64_json`
                coverImageUrl = editsResult.data[0]?.url || null
                coverImageB64 = editsResult.data[0]?.b64_json || null
                coverImageOutputFormat = editsResult.output_format || null

                console.log('[Create Book] ✅ Edits response image field:', coverImageUrl ? 'url ✅' : (coverImageB64 ? 'b64_json ✅' : 'missing ❌'))
                if (coverImageUrl) {
                  console.log('[Create Book] 🖼️  Cover image URL received (length:', coverImageUrl.length, 'chars)')
                }
                if (coverImageB64) {
                  console.log('[Create Book] 🧩 Cover image b64 received (length:', coverImageB64.length, 'chars)')                  
                }
              } else {
                console.error('[Create Book] ❌ Response data is missing or invalid')
                console.error('[Create Book]   Has data:', !!editsResult.data)
                console.error('[Create Book]   Is array:', Array.isArray(editsResult.data))
                console.error('[Create Book]   Array length:', editsResult.data?.length || 0)
                coverImageUrl = null
              }
            }
          } catch (editsError) {
            const editsApiTime = Date.now() - editsApiStartTime
            console.error('[Create Book] ❌ Exception during /v1/images/edits API call:')
            console.error('[Create Book]   Error:', editsError)
            console.error('[Create Book]   Error type:', editsError instanceof Error ? editsError.constructor.name : typeof editsError)
            console.error('[Create Book]   Error message:', editsError instanceof Error ? editsError.message : String(editsError))
            console.error('[Create Book]   Error stack:', editsError instanceof Error ? editsError.stack : 'N/A')
            console.error('[Create Book] ⏱️  API call failed after:', editsApiTime, 'ms')
            console.log('[Create Book] ⚠️  Falling back to /v1/images/generations (edits API exception)')
            coverImageUrl = null
          }
        } else {
          console.log('[Create Book] ⚠️  No valid image blob, skipping /v1/images/edits')
        }

        // Fall back to /v1/images/generations if edits failed or no image blob
        if (!coverImageUrl) {
          console.log('[Create Book] 🔄 Using /v1/images/generations (no reference image)')
          console.log('[Create Book] 📋 Model:', imageModel)
          console.log('[Create Book] 📏 Size:', imageSize)
          console.log('[Create Book] 📝 Prompt length:', textPrompt.length, 'characters')
          
          const generationsApiStartTime = Date.now()
          console.log('[Create Book] 🚀 Calling /v1/images/generations API...')
          console.log('[Create Book] ⏱️  API call started at:', new Date().toISOString())
          
          try {
            const genResponse = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: imageModel,
                prompt: textPrompt,
                n: 1,
                size: imageSize,
                // Note: GPT-image API doesn't support response_format parameter
              }),
            })

            const generationsApiTime = Date.now() - generationsApiStartTime
            console.log('[Create Book] ⏱️  Generations API call completed in:', generationsApiTime, 'ms')
            console.log('[Create Book] 📊 Response status:', genResponse.status, genResponse.statusText)

            if (!genResponse.ok) {
              const errorText = await genResponse.text()
              console.error('[Create Book] ❌ GPT-image generations API error:')
              console.error('[Create Book]   Status:', genResponse.status)
              console.error('[Create Book]   Status Text:', genResponse.statusText)
              console.error('[Create Book]   Error Response:', errorText)
              
              // Try to parse error JSON for better logging
              try {
                const errorJson = JSON.parse(errorText)
                console.error('[Create Book]   Parsed Error:', JSON.stringify(errorJson, null, 2))
              } catch {
                console.error('[Create Book]   Raw Error Text:', errorText)
              }
              
              throw new Error(`GPT-image generations API error: ${genResponse.status} - ${errorText}`)
            }

            console.log('[Create Book] ✅ Generations API call successful, parsing response...')
            const genResult = await genResponse.json()
            console.log('[Create Book] 📦 Response structure:', {
              hasData: !!genResult.data,
              dataLength: genResult.data?.length || 0,
              dataType: Array.isArray(genResult.data) ? 'array' : typeof genResult.data,
            })
            
            coverImageUrl = genResult.data?.[0]?.url || null
            console.log('[Create Book] ✅ Cover image URL extracted:', coverImageUrl ? 'Yes ✅' : 'No ❌')
            if (coverImageUrl) {
              console.log('[Create Book] 🖼️  Cover image URL received (length:', coverImageUrl.length, 'chars)')
            } else {
              console.error('[Create Book] ❌ Response data is missing or invalid')
              console.error('[Create Book]   Response has data array:', !!genResult.data && Array.isArray(genResult.data))
              console.error('[Create Book]   Data array length:', genResult.data?.length || 0)
            }
          } catch (genError) {
            const generationsApiTime = Date.now() - generationsApiStartTime
            console.error('[Create Book] ❌ Exception during /v1/images/generations API call:')
            console.error('[Create Book]   Error:', genError)
            console.error('[Create Book]   Error type:', genError instanceof Error ? genError.constructor.name : typeof genError)
            console.error('[Create Book]   Error message:', genError instanceof Error ? genError.message : String(genError))
            console.error('[Create Book]   Error stack:', genError instanceof Error ? genError.stack : 'N/A')
            console.error('[Create Book] ⏱️  API call failed after:', generationsApiTime, 'ms')
            throw genError
          }
        }
      } else {
        // No reference image, use /v1/images/generations directly
        console.log('[Create Book] 🔄 No reference image provided, using /v1/images/generations directly')
        console.log('[Create Book] 📋 Model:', imageModel)
        console.log('[Create Book] 📏 Size:', imageSize)
        console.log('[Create Book] 📝 Prompt length:', textPrompt.length, 'characters')
        
        const generationsApiStartTime = Date.now()
        console.log('[Create Book] 🚀 Calling /v1/images/generations API...')
        console.log('[Create Book] ⏱️  API call started at:', new Date().toISOString())
        
        try {
          const genResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: imageModel,
              prompt: textPrompt,
              n: 1,
              size: imageSize,
            }),
          })

          const generationsApiTime = Date.now() - generationsApiStartTime
          console.log('[Create Book] ⏱️  Generations API call completed in:', generationsApiTime, 'ms')
          console.log('[Create Book] 📊 Response status:', genResponse.status, genResponse.statusText)

          if (!genResponse.ok) {
            const errorText = await genResponse.text()
            console.error('[Create Book] ❌ GPT-image generations API error:')
            console.error('[Create Book]   Status:', genResponse.status)
            console.error('[Create Book]   Status Text:', genResponse.statusText)
            console.error('[Create Book]   Error Response:', errorText)
            throw new Error(`GPT-image generations API error: ${genResponse.status} - ${errorText}`)
          }

          console.log('[Create Book] ✅ Generations API call successful, parsing response...')
            const genResult = await genResponse.json()
            coverImageUrl = genResult.data?.[0]?.url || null
            coverImageB64 = genResult.data?.[0]?.b64_json || null
            coverImageOutputFormat = genResult.output_format || null

            console.log('[Create Book] ✅ Generations response image field:', coverImageUrl ? 'url ✅' : (coverImageB64 ? 'b64_json ✅' : 'missing ❌'))
            if (coverImageUrl) {
              console.log('[Create Book] 🖼️  Cover image URL received (length:', coverImageUrl.length, 'chars)')
            }
            if (coverImageB64) {
              console.log('[Create Book] 🧩 Cover image b64 received (length:', coverImageB64.length, 'chars)')
            }
        } catch (genError) {
          const generationsApiTime = Date.now() - generationsApiStartTime
          console.error('[Create Book] ❌ Exception during /v1/images/generations API call:')
          console.error('[Create Book]   Error:', genError)
          throw genError
        }
      }

      if (!coverImageUrl && !coverImageB64) {
        console.error('[Create Book] ❌ No cover image URL returned from API')
        console.error('[Create Book] 📊 Summary:')
        console.error('[Create Book]   - Reference image URL:', referenceImageUrl ? 'Provided' : 'Not provided')
        console.error('[Create Book]   - Reference image blob created:', referenceImageBlobCreated ? 'Yes' : 'No')
        console.error('[Create Book]   - Reference image blob size:', referenceImageBlobSizeBytes ?? 'N/A')
        console.error('[Create Book]   - Edits API attempted:', referenceImageUrl ? 'Yes' : 'No')
        console.error('[Create Book]   - Generations API called:', 'Yes')
        console.error('[Create Book]   - Final coverImageUrl:', coverImageUrl ? 'Yes' : 'No')
        console.error('[Create Book]   - Final coverImageB64:', coverImageB64 ? 'Yes' : 'No')
        throw new Error('No cover image URL returned from API')
      }

      console.log('[Create Book] ✅ Cover image generated successfully')
      console.log('[Create Book] 🖼️  Cover image field:', coverImageUrl ? 'url ✅' : 'b64_json ✅')

      // Download and upload to Supabase Storage
      let uploadBytes: ArrayBuffer | Buffer
      let contentType = 'image/png'
      const ext = (coverImageOutputFormat || 'png').toLowerCase()

      if (coverImageUrl) {
        const downloadStart = Date.now()
        console.log('[Create Book] 📥 Downloading cover image from URL for upload...')
        const res = await fetch(coverImageUrl)
        const downloadMs = Date.now() - downloadStart
        console.log('[Create Book] ⏱️  Cover URL download time:', downloadMs, 'ms')
        uploadBytes = await res.arrayBuffer()
      } else {
        // b64_json path
        console.log('[Create Book] 🔄 Converting cover b64_json to bytes for upload...')
        uploadBytes = Buffer.from(coverImageB64 as string, 'base64')
      }

      if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
      if (ext === 'webp') contentType = 'image/webp'

      const fileName = `cover_${Date.now()}.${ext || 'png'}`
      const filePath = `${user.id}/covers/${fileName}`

      console.log('[Create Book] 📤 Uploading cover to Supabase Storage...')

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('book-images')
        .upload(filePath, uploadBytes, {
          contentType,
          upsert: false,
        })

      if (uploadError) {
        console.error('[Create Book] Error uploading cover to storage:', uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('book-images')
        .getPublicUrl(filePath)

      const storageCoverUrl = publicUrlData?.publicUrl

      console.log('[Create Book] ✅ Cover uploaded to Supabase Storage')

      // Update book with cover image URL
      // Update book with cover image URL
      // Status: Always 'generating' after cover (will be 'completed' only after page images in full-book mode)
      // Cover-only mode: Keep as 'generating' (in-progress) since book has no content
      // Full-book mode: Keep as 'generating' until page images are done
      await updateBook(supabase, book.id, {
        cover_image_url: storageCoverUrl,
        cover_image_path: filePath,
        status: 'generating', // Always 'generating' after cover (completed only after full book)
      })

      if (isCoverOnlyMode) {
        console.log('[Create Book] ✅ Book updated with cover image URL, status: generating (cover-only, no content yet)')
      } else {
        console.log('[Create Book] ✅ Book updated with cover image URL, status: generating (waiting for page images)')
      }

    } catch (coverError) {
      console.error('[Create Book] Cover generation failed:', coverError)
      // Update status to 'failed' but don't throw - book can still be used without cover
      await updateBook(supabase, book.id, { status: 'failed' })
      // Continue to response - story is still generated
    }

    // ====================================================================
    // STEP 3: GENERATE PAGE IMAGES (Skip in cover only mode)
    // ====================================================================
    if (isCoverOnlyMode) {
      console.log('[Create Book] ⏭️  Skipping page images generation (cover only mode)')
      console.log('[Create Book] ✅ Cover only book cover generated (status: generating - no content yet)')
    } else {
      try {
        console.log(`[Create Book] 🎨 Starting page images generation...`)
        console.log(`[Create Book] 📄 Total pages to generate: ${storyData.pages.length}`)

        const pages = storyData.pages
        const totalPages = pages.length
        const referenceImageUrl = character.reference_photo_url || null
        const characterDescription = character.description
        const generatedImages: any[] = []

      for (let i = 0; i < totalPages; i++) {
        const page = pages[i]
        const pageNumber = page.pageNumber || (i + 1)

        console.log(`[Create Book] 🖼️  Generating image for page ${pageNumber}/${totalPages}...`)

        // Build prompt for this page
        const sceneDescription = page.imagePrompt || page.text
        const ageGroup = storyData.metadata?.ageGroup || 'preschool'
        
        // Extract character action from page text (what character is doing)
        const characterAction = page.text || sceneDescription
        
        // Determine focus point (first page = character focus, last page = balanced, others = balanced)
        const focusPoint: 'character' | 'environment' | 'balanced' = 
          pageNumber === 1 ? 'character' : 
          pageNumber === totalPages ? 'balanced' : 
          'balanced'
        
        // Determine mood from theme or use default
        const mood = theme === 'adventure' ? 'exciting' :
                     theme === 'fantasy' ? 'mysterious' :
                     theme === 'space' ? 'inspiring' :
                     'happy'
        
        // Create SceneInput object for generateFullPagePrompt
        const sceneInput = {
          pageNumber,
          sceneDescription,
          theme,
          mood,
          characterAction,
          focusPoint,
          // Optional: timeOfDay and weather can be extracted from story if available
        }
        
        console.log(`[Create Book] 📋 Page ${pageNumber} scene input:`, {
          pageNumber,
          theme,
          mood,
          illustrationStyle,
          ageGroup,
          focusPoint,
          sceneDescriptionLength: sceneDescription.length,
        })

        // Generate full page prompt with correct parameters
        const fullPrompt = generateFullPagePrompt(
          characterDescription,
          sceneInput,
          illustrationStyle,
          ageGroup
        )

        console.log(`[Create Book] 📝 Page ${pageNumber} prompt (first 200 chars):`, fullPrompt.substring(0, 200) + '...')
        console.log(`[Create Book] 📏 Page ${pageNumber} prompt length:`, fullPrompt.length, 'characters')
        console.log(`[Create Book] 🎨 Page ${pageNumber} illustration style in prompt:`, illustrationStyle)

        // Call GPT-image API
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
          throw new Error('OPENAI_API_KEY is not configured')
        }

        let pageImageUrl: string | null = null
        let pageImageB64: string | null = null
        let pageImageOutputFormat: string | null = null

        const pageImageStartTime = Date.now()
        console.log(`[Create Book] ⏱️  Page ${pageNumber} image generation started at:`, new Date().toISOString())

        // Use /v1/images/edits if reference image available, otherwise /v1/images/generations
        if (referenceImageUrl) {
          // Convert reference image URL to Blob (support both data URL and HTTP URL)
          let imageBlob: Blob | null = null
          try {
            if (referenceImageUrl.startsWith('data:')) {
              // Data URL: extract base64 data
              const base64Data = referenceImageUrl.split(',')[1]
              const binaryData = Buffer.from(base64Data, 'base64')
              imageBlob = new Blob([binaryData], { type: 'image/png' })
            } else {
              // HTTP URL: download the image
              const imageResponse = await fetch(referenceImageUrl)
              if (!imageResponse.ok) {
                throw new Error(`Failed to download reference image: ${imageResponse.status}`)
              }
              const imageBuffer = await imageResponse.arrayBuffer()
              imageBlob = new Blob([imageBuffer], { type: 'image/png' })
            }
          } catch (imageError) {
            console.error(`[Create Book] Page ${pageNumber} - Error processing reference image:`, imageError)
            // Fall back to /v1/images/generations if reference image fails
            imageBlob = null
          }

          // Only use /v1/images/edits if we have a valid image blob
          if (imageBlob) {
            const formData = new FormData()
            formData.append('model', imageModel)
            formData.append('prompt', fullPrompt)
            formData.append('size', imageSize)
            formData.append('image', imageBlob, 'reference.png')

            const editsResponse = await fetch('https://api.openai.com/v1/images/edits', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
              },
              body: formData,
            })

            if (!editsResponse.ok) {
              const errorText = await editsResponse.text()
              console.error(`[Create Book] Page ${pageNumber} image generation failed:`, errorText)
              // Fall back to /v1/images/generations
              imageBlob = null
            } else {
              const editsApiTime = Date.now() - pageImageStartTime
              console.log(`[Create Book] ⏱️  Page ${pageNumber} edits API call completed in:`, editsApiTime, 'ms')
              console.log(`[Create Book] 📊 Page ${pageNumber} edits response status:`, editsResponse.status, editsResponse.statusText)
              
              const editsResult = await editsResponse.json()
              console.log(`[Create Book] 📦 Page ${pageNumber} edits response structure:`, {
                hasData: !!editsResult.data,
                dataLength: editsResult.data?.length || 0,
                dataType: Array.isArray(editsResult.data) ? 'array' : typeof editsResult.data,
              })
              
              pageImageUrl = editsResult.data[0]?.url || null
              pageImageB64 = editsResult.data[0]?.b64_json || null
              pageImageOutputFormat = editsResult.output_format || null
              
              console.log(`[Create Book] ✅ Page ${pageNumber} edits response image field:`, pageImageUrl ? 'url ✅' : (pageImageB64 ? 'b64_json ✅' : 'missing ❌'))
              if (pageImageUrl) {
                console.log(`[Create Book] 🖼️  Page ${pageNumber} image URL received (length:`, pageImageUrl.length, 'chars)')
              }
              if (pageImageB64) {
                console.log(`[Create Book] 🧩 Page ${pageNumber} image b64 received (length:`, pageImageB64.length, 'chars)')
              }
            }
          }

          // Fall back to /v1/images/generations if edits failed or no image blob
          if (!pageImageUrl && !pageImageB64) {
            console.log(`[Create Book] 🔄 Page ${pageNumber} - Falling back to /v1/images/generations (no reference image or edits failed)`)
            console.log(`[Create Book] 📋 Page ${pageNumber} - Model:`, imageModel)
            console.log(`[Create Book] 📏 Page ${pageNumber} - Size:`, imageSize)
            console.log(`[Create Book] 📝 Page ${pageNumber} - Prompt length:`, fullPrompt.length, 'characters')
            
            const generationsApiStartTime = Date.now()
            console.log(`[Create Book] 🚀 Page ${pageNumber} - Calling /v1/images/generations API...`)
            console.log(`[Create Book] ⏱️  Page ${pageNumber} - API call started at:`, new Date().toISOString())
            
            const genResponse = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: imageModel,
                prompt: fullPrompt,
                n: 1,
                size: imageSize,
                // Note: GPT-image API doesn't support response_format parameter
              }),
            })

            const generationsApiTime = Date.now() - generationsApiStartTime
            console.log(`[Create Book] ⏱️  Page ${pageNumber} - Generations API call completed in:`, generationsApiTime, 'ms')
            console.log(`[Create Book] 📊 Page ${pageNumber} - Response status:`, genResponse.status, genResponse.statusText)

            if (!genResponse.ok) {
              const errorText = await genResponse.text()
              console.error(`[Create Book] ❌ Page ${pageNumber} - Generations API error:`)
              console.error(`[Create Book]   Status:`, genResponse.status)
              console.error(`[Create Book]   Status Text:`, genResponse.statusText)
              console.error(`[Create Book]   Error Response:`, errorText)
              
              // Try to parse error JSON
              try {
                const errorJson = JSON.parse(errorText)
                console.error(`[Create Book]   Parsed Error:`, JSON.stringify(errorJson, null, 2))
              } catch {
                console.error(`[Create Book]   Raw Error Text:`, errorText)
              }
              
              continue // Skip this page, continue with others
            }

            console.log(`[Create Book] ✅ Page ${pageNumber} - Generations API call successful, parsing response...`)
            const genResult = await genResponse.json()
            console.log(`[Create Book] 📦 Page ${pageNumber} - Response structure:`, {
              hasData: !!genResult.data,
              dataLength: genResult.data?.length || 0,
              dataType: Array.isArray(genResult.data) ? 'array' : typeof genResult.data,
            })
            
            pageImageUrl = genResult.data?.[0]?.url || null
            pageImageB64 = genResult.data?.[0]?.b64_json || null
            pageImageOutputFormat = genResult.output_format || null
            
            console.log(`[Create Book] ✅ Page ${pageNumber} - Generations response image field:`, pageImageUrl ? 'url ✅' : (pageImageB64 ? 'b64_json ✅' : 'missing ❌'))
            if (pageImageUrl) {
              console.log(`[Create Book] 🖼️  Page ${pageNumber} - Image URL received (length:`, pageImageUrl.length, 'chars)')
            }
            if (pageImageB64) {
              console.log(`[Create Book] 🧩 Page ${pageNumber} - Image b64 received (length:`, pageImageB64.length, 'chars)')
            }
          }
        }

        if (!pageImageUrl && !pageImageB64) {
          const totalTime = Date.now() - pageImageStartTime
          console.error(`[Create Book] ❌ Page ${pageNumber} - No image URL or b64_json returned from API`)
          console.error(`[Create Book] ⏱️  Page ${pageNumber} - Total time before failure:`, totalTime, 'ms')
          continue
        }

        const totalImageGenTime = Date.now() - pageImageStartTime
        console.log(`[Create Book] ✅ Page ${pageNumber} - Image generated successfully (${totalImageGenTime}ms)`)
        console.log(`[Create Book] 🖼️  Page ${pageNumber} - Image field:`, pageImageUrl ? 'url ✅' : 'b64_json ✅')

        // Download and upload to Supabase Storage
        let imageBuffer: ArrayBuffer | Buffer
        let contentType = 'image/png'
        const ext = (pageImageOutputFormat || 'png').toLowerCase()
        
        if (pageImageUrl) {
          const downloadStart = Date.now()
          console.log(`[Create Book] 📥 Page ${pageNumber} - Downloading image from URL for upload...`)
          const res = await fetch(pageImageUrl)
          const downloadMs = Date.now() - downloadStart
          console.log(`[Create Book] ⏱️  Page ${pageNumber} - URL download time:`, downloadMs, 'ms')
          imageBuffer = await res.arrayBuffer()
        } else {
          // b64_json path
          console.log(`[Create Book] 🔄 Page ${pageNumber} - Converting b64_json to bytes for upload...`)
          imageBuffer = Buffer.from(pageImageB64 as string, 'base64')
        }
        
        if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
        if (ext === 'webp') contentType = 'image/webp'
        const fileName = `page_${pageNumber}_${Date.now()}.${ext || 'png'}`
        const filePath = `${user.id}/books/${book.id}/${fileName}`

        const uploadStart = Date.now()
        console.log(`[Create Book] 📤 Page ${pageNumber} - Uploading to Supabase Storage...`)
        console.log(`[Create Book]   File path:`, filePath)
        console.log(`[Create Book]   Content type:`, contentType)
        console.log(`[Create Book]   Buffer size:`, imageBuffer.byteLength || (imageBuffer as Buffer).length, 'bytes')

        const { data: uploadData, error: uploadError} = await supabase.storage
          .from('book-images')
          .upload(filePath, imageBuffer, {
            contentType,
            upsert: false,
          })
        
        const uploadMs = Date.now() - uploadStart
        console.log(`[Create Book] ⏱️  Page ${pageNumber} - Upload time:`, uploadMs, 'ms')

        if (uploadError) {
          console.error(`[Create Book] ❌ Page ${pageNumber} - Error uploading image:`, uploadError)
          console.error(`[Create Book]   Upload error details:`, JSON.stringify(uploadError, null, 2))
          continue
        }

        console.log(`[Create Book] ✅ Page ${pageNumber} - Image uploaded to storage successfully`)

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('book-images')
          .getPublicUrl(filePath)

        const storageImageUrl = publicUrlData?.publicUrl

        console.log(`[Create Book] ✅ Page ${pageNumber} - Image uploaded:`, storageImageUrl)
        console.log(`[Create Book] 📊 Page ${pageNumber} - Storage URL length:`, storageImageUrl?.length || 0, 'chars')

        // Update page with image URL
        pages[i].imageUrl = storageImageUrl

        generatedImages.push({
          pageNumber,
          imageUrl: storageImageUrl,
          storagePath: filePath,
          prompt: fullPrompt,
        })
      }

      const totalPageImagesTime = Date.now() - startTime
      console.log(`[Create Book] ✅ Generated ${generatedImages.length}/${totalPages} page images`)
      console.log(`[Create Book] ⏱️  Total page images generation time:`, totalPageImagesTime, 'ms')
      console.log(`[Create Book] 📊 Average time per page:`, Math.round(totalPageImagesTime / totalPages), 'ms')
      console.log(`[Create Book] 📦 Generated images data:`, generatedImages.map(img => ({
        pageNumber: img.pageNumber,
        hasImageUrl: !!img.imageUrl,
        imageUrlLength: img.imageUrl?.length || 0,
      })))

      // Update book with page images
      console.log(`[Create Book] 💾 Updating book in database with page images...`)
      const dbUpdateStart = Date.now()
      
      await updateBook(supabase, book.id, {
        story_data: {
          ...storyData,
          pages: pages,
        },
        images_data: generatedImages,
        status: 'completed', // All images generated
      })
      
      const dbUpdateMs = Date.now() - dbUpdateStart
      console.log(`[Create Book] ⏱️  Database update time:`, dbUpdateMs, 'ms')
      console.log(`[Create Book] ✅ Book completed! All images generated and uploaded`)
      console.log(`[Create Book] 📊 Final stats:`)
      console.log(`[Create Book]   - Total pages:`, totalPages)
      console.log(`[Create Book]   - Images generated:`, generatedImages.length)
      console.log(`[Create Book]   - Images in story_data.pages:`, pages.filter((p: any) => p.imageUrl).length)
      console.log(`[Create Book]   - Images in images_data:`, generatedImages.length)

      } catch (imagesError) {
        console.error('[Create Book] Page images generation failed:', imagesError)
        // Update status to 'failed'
        await updateBook(supabase, book.id, { status: 'failed' })
      }
    }

    // Prepare Response - Fetch updated book to get latest status and cover_image_url
    const { data: updatedBook, error: fetchError } = await getBookById(supabase, book.id)
    
    const finalBook = updatedBook || book // Fallback to original book if fetch fails
    
    const generationTime = Date.now() - startTime
    const tokensUsed = completion?.usage?.total_tokens || 0

    console.log(
      `[Create Book] ✅ Book created successfully: ${book.id} (${generationTime}ms, ${tokensUsed} tokens)`
    )
    console.log(`[Create Book] 📊 Final book status: ${finalBook.status}`)
    console.log(`[Create Book] 🖼️  Cover image: ${finalBook.cover_image_url ? 'Yes ✅' : 'No ❌'}`)
    console.log(`[Create Book] 📄 Total pages: ${finalBook.total_pages}`)

    const response: CreateBookResponse = {
      id: finalBook.id,
      title: finalBook.title,
      status: finalBook.status,
      totalPages: finalBook.total_pages,
      theme: finalBook.theme,
      illustrationStyle: finalBook.illustration_style,
      character: {
        id: character.id,
        name: character.name,
      },
      generationTime,
      tokensUsed,
      story_data: storyData, // Include story content in response for debug/preview (null in cover only mode)
    }

    return successResponse(
      response,
      'Book created and story generated successfully'
    )
  } catch (error) {
    console.error('Book creation error:', error)
    return handleAPIError(error)
  }
}

// ============================================================================
// GET /api/books - Get user's books
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Authentication (supports both Bearer token and session cookies)
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return CommonErrors.unauthorized('Please login to continue')
    }

    // Parse Query Parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Get User's Books
    const { data: books, error: dbError } = await getUserBooks(supabase, user.id, {
      status: status || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to fetch books')
    }

    return successResponse(books || [], 'Books fetched successfully')
  } catch (error) {
    console.error('Get books error:', error)
    return handleAPIError(error)
  }
}

