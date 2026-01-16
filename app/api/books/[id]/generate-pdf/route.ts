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
    
    if (!forceRegenerate && book.pdf_url && book.pdf_path) {
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
    const pageData = pages.map((page: any) => ({
      pageNumber: page.pageNumber || 0,
      text: page.text || '',
      imageUrl: page.imageUrl || null,
    }))

    // ====================================================================
    // 4. GENERATE PDF
    // ====================================================================
    console.log('[PDF Generation] Generating PDF...')

    const pdfBuffer = await generateBookPDF({
      title: book.title || book.story_data.title || 'Untitled Story',
      coverImageUrl: coverImageUrl,
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

