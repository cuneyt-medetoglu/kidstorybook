/**
 * GET /api/orders/[id]/download
 *
 * Ödeme tamamlanmış siparişlerdeki e-book kalemlerinin PDF URL'lerini döner.
 *
 * Güvenlik:
 *  - Oturum kontrolü — sadece sipariş sahibi erişebilir.
 *  - Sipariş status kontrolü — yalnızca `paid` siparişler.
 *  - Her kalem `ebook` veya `bundle` türünde olmalı.
 *
 * Yanıt:
 *  { downloads: [{ bookId, bookTitle, pdfUrl }] }
 *
 * pdfUrl:
 *  - books.pdf_url dolu ise doğrudan döner.
 *  - Dolu değilse `/books/[bookId]` viewer sayfasına yönlendiren URL döner
 *    (PDF üretimi henüz tamamlanmamış ya da URL saklanmamış olabilir).
 */

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { pool } from '@/lib/db/pool'

interface DownloadItem {
  bookId:    string
  bookTitle: string | null
  pdfUrl:    string | null
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  try {
    // Sipariş sahibi + status kontrolü
    const { rows: orderRows } = await pool.query<{ status: string }>(
      `SELECT status FROM orders WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [params.id, session.user.id]
    )

    if (!orderRows[0]) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (orderRows[0].status !== 'paid') {
      return NextResponse.json(
        { error: 'Bu sipariş henüz ödenmedi.' },
        { status: 403 }
      )
    }

    // E-book kalemleri
    const { rows: itemRows } = await pool.query<DownloadItem>(
      `SELECT oi.book_id AS "bookId",
              b.title    AS "bookTitle",
              b.pdf_url  AS "pdfUrl"
       FROM order_items oi
       LEFT JOIN books b ON b.id = oi.book_id
       WHERE oi.order_id = $1
         AND oi.item_type IN ('ebook','bundle')`,
      [params.id]
    )

    const downloads = itemRows.map((item) => ({
      bookId:    item.bookId,
      bookTitle: item.bookTitle,
      // pdf_url varsa direkt, yoksa viewer sayfası
      pdfUrl: item.pdfUrl ?? `${appUrl}/books/${item.bookId}`,
    }))

    return NextResponse.json({ downloads })
  } catch (err) {
    console.error('[GET /api/orders/[id]/download] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
