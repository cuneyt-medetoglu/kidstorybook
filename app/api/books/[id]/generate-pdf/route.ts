/**
 * PDF Generation API
 * 
 * POST /api/books/[id]/generate-pdf
 * Generates PDF from book data
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBookById, updateBook } from '@/lib/db/books'
import { generateBookPDF } from '@/lib/pdf/generator'
import { compressImageForPdf } from '@/lib/pdf/image-compress'
import { successResponse, errorResponse } from '@/lib/api/response'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()

  try {
    // ====================================================================
    // 1. AUTHENTICATION & AUTHORIZATION
    // ====================================================================
    const supabase = await createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', undefined, 401)
    }

    const bookId = params.id

    // ====================================================================
    // 2. FETCH BOOK DATA
    // ====================================================================
    const { data: book, error: bookError } = await getBookById(supabase, bookId)

    if (bookError || !book) {
      return errorResponse('Book not found', undefined, 404)
    }

    // Check ownership
    if (book.user_id !== user.id) {
      return errorResponse('Unauthorized', undefined, 403)
    }

    // Check if book has story data
    if (!book.story_data || !book.story_data.pages) {
      return errorResponse('Book has no story data', undefined, 400)
    }

    // Check if PDF already exists (cache)
    // Allow bypass with ?force=true query parameter
    const { searchParams } = new URL(request.url)
    const forceRegenerate = searchParams.get('force') === 'true'
    
    // Verify PDF actually exists in storage bucket
    let pdfExistsInBucket = false
    if (!forceRegenerate && book.pdf_path) {
      try {
        // Split path to get folder and filename
        const pathParts = book.pdf_path.split('/')
        const fileName = pathParts.pop() || ''
        const folderPath = pathParts.join('/')
        
        // List files in the folder and check if our file exists
        const { data: fileData, error: fileError } = await supabase.storage
          .from('pdfs')
          .list(folderPath || '', {
            limit: 1000,
          })
        
        if (!fileError && fileData) {
          // Check if file exists in the list
          pdfExistsInBucket = fileData.some((file) => file.name === fileName)
        }
        
        if (!pdfExistsInBucket) {
          console.log('[PDF Generation] PDF path in database but file not found in bucket, will regenerate')
        }
      } catch (error) {
        console.error('[PDF Generation] Error checking file existence:', error)
        // If check fails, assume file doesn't exist to be safe
        pdfExistsInBucket = false
      }
    }
    
    if (!forceRegenerate && book.pdf_url && book.pdf_path && pdfExistsInBucket) {
      console.log('[PDF Generation] PDF already exists, returning cached URL')
      return successResponse(
        {
          pdfUrl: book.pdf_url,
          pdfPath: book.pdf_path,
          cached: true,
        },
        'PDF already generated',
        {
          generationTime: 0,
        }
      )
    }
    
    // If PDF path exists in DB but file is missing from bucket, clear DB records
    if (book.pdf_path && !pdfExistsInBucket && !forceRegenerate) {
      console.log('[PDF Generation] PDF missing from bucket, clearing database records')
      await updateBook(supabase, bookId, {
        pdf_url: null,
        pdf_path: null,
      })
    }
    
    if (forceRegenerate) {
      console.log('[PDF Generation] Force regenerate requested, ignoring cache')
    }

    // ====================================================================
    // 3. PREPARE PAGE DATA
    // ====================================================================
    const pages = book.story_data.pages || []
    const coverImageUrl = book.cover_image_url

    console.log('[PDF Generation] Preparing PDF generation:')
    console.log('[PDF Generation] - Book ID:', bookId)
    console.log('[PDF Generation] - Title:', book.title)
    console.log('[PDF Generation] - Total Pages:', pages.length)
    console.log('[PDF Generation] - Cover Image:', coverImageUrl ? 'Yes' : 'No')

    // Prepare page data with image URLs
    let pageData = pages.map((page: any) => ({
      pageNumber: page.pageNumber || 0,
      text: page.text || '',
      imageUrl: page.imageUrl || null,
    }))

    // ====================================================================
    // 3b. COMPRESS IMAGES FOR PDF (stay under 50 MB storage limit)
    // ====================================================================
    const TARGET_MAX_MB = 50
    console.log('[PDF Generation] Compressing images for PDF (target <', TARGET_MAX_MB, 'MB)...')
    let coverUrlForPdf: string | undefined = coverImageUrl
    if (coverImageUrl) {
      const coverResult = await compressImageForPdf(coverImageUrl)
      coverUrlForPdf = coverResult.dataUrl
      if (coverResult.usedCompression) console.log('[PDF Generation] Cover image compressed')
    }
    const compressedPages = await Promise.all(
      pageData.map(async (p: { pageNumber: number; text: string; imageUrl: string | null }) => {
        if (!p.imageUrl) return { ...p, imageUrl: null }
        const result = await compressImageForPdf(p.imageUrl)
        return { ...p, imageUrl: result.dataUrl }
      })
    )
    pageData = compressedPages
    console.log('[PDF Generation] Images compressed for PDF')

    // ====================================================================
    // 4. GENERATE PDF
    // ====================================================================
    console.log('[PDF Generation] Generating PDF...')

    const pdfBuffer = await generateBookPDF({
      title: book.title || book.story_data.title || 'Untitled Story',
      coverImageUrl: coverUrlForPdf,
      pages: pageData,
      theme: book.theme,
      illustrationStyle: book.illustration_style,
    })

    console.log('[PDF Generation] PDF generated successfully')
    console.log('[PDF Generation] - PDF Size:', (pdfBuffer.length / 1024).toFixed(2), 'KB')

    // ====================================================================
    // 5. UPLOAD TO SUPABASE STORAGE
    // ====================================================================
    const fileName = `${book.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`
    const filePath = `${user.id}/books/${bookId}/${fileName}`

    console.log('[PDF Generation] Uploading PDF to Supabase Storage:', filePath)
    console.log('[PDF Generation] - PDF Size:', (pdfBuffer.length / 1024 / 1024).toFixed(2), 'MB')

    // Use 'pdfs' bucket (50 MB limit) instead of 'book-images' (10 MB limit)
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('[PDF Generation] Storage upload error:', uploadError)
      return errorResponse('Failed to upload PDF to storage', uploadError.message, 500)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath)

    const pdfUrl = publicUrlData?.publicUrl

    if (!pdfUrl) {
      return errorResponse('Failed to get PDF public URL', undefined, 500)
    }

    console.log('[PDF Generation] PDF uploaded successfully:', pdfUrl)

    // ====================================================================
    // 6. UPDATE DATABASE
    // ====================================================================
    const { error: updateError } = await updateBook(supabase, bookId, {
      pdf_url: pdfUrl,
      pdf_path: filePath,
    })

    if (updateError) {
      console.error('[PDF Generation] Database update error:', updateError)
      // PDF uploaded but database update failed - still return success
      // PDF will be re-uploaded next time (upsert: false)
      console.warn('[PDF Generation] Warning: PDF uploaded but database update failed')
    }

    const generationTime = Date.now() - startTime

    console.log('[PDF Generation] PDF generation completed in', generationTime, 'ms')

    // ====================================================================
    // 7. RETURN SUCCESS
    // ====================================================================
    return successResponse(
      {
        pdfUrl: pdfUrl,
        pdfPath: filePath,
        cached: false,
      },
      'PDF generated successfully',
      {
        generationTime,
        pdfSize: pdfBuffer.length,
      }
    )
  } catch (error) {
    console.error('[PDF Generation] Error:', error)
    return errorResponse(
      'Failed to generate PDF',
      error instanceof Error ? error.message : 'Unknown error',
      500
    )
  }
}

