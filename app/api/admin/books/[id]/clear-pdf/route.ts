/**
 * POST /api/admin/books/[id]/clear-pdf
 * Admin: kitabın PDF önbelleğini temizler — S3 dosyası (varsa) silinir, pdf_url / pdf_path NULL yapılır.
 * Sonraki generate-pdf isteği yeni PDF üretir.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getAdminBookById } from '@/lib/db/admin'
import { updateBook } from '@/lib/db/books'
import { deleteFile } from '@/lib/storage/s3'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((token as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const bookId = params.id
  const book = await getAdminBookById(bookId)
  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const pdfPath = book.pdf_path
  if (pdfPath) {
    const key = pdfPath.startsWith('pdfs/') ? pdfPath : `pdfs/${pdfPath}`
    try {
      await deleteFile(key)
    } catch (e) {
      console.error('[admin/clear-pdf] S3 delete failed (continuing to clear DB):', e)
    }
  }

  const { error } = await updateBook(bookId, {
    pdf_url: null,
    pdf_path: null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
