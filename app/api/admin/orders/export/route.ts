import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { pool } from '@/lib/db/pool'

interface ExportRow {
  order_id: string
  created_at: Date
  paid_at: Date | null
  status: string
  payment_provider: string
  order_currency: string
  subtotal: number
  discount_amount: number
  total_amount: number
  user_email: string
  user_name: string | null
  book_titles: string | null
  item_types: string | null
}

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function formatDateISO(date: Date | string | null): string {
  if (!date) return ''
  return new Date(date).toISOString().replace('T', ' ').slice(0, 19)
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((token as { role?: string }).role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const status   = searchParams.get('status')   ?? undefined
  const provider = searchParams.get('provider') ?? undefined
  const search   = searchParams.get('search')   ?? undefined

  const conditions: string[] = []
  const values: unknown[]    = []
  let idx = 1

  if (status) {
    conditions.push(`o.status = $${idx++}`)
    values.push(status)
  }
  if (provider) {
    conditions.push(`o.payment_provider = $${idx++}`)
    values.push(provider)
  }
  if (search) {
    conditions.push(`(u.email ILIKE $${idx} OR o.id::text ILIKE $${idx})`)
    values.push(`%${search}%`)
    idx++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const { rows } = await pool.query<ExportRow>(
    `SELECT
       o.id                 AS order_id,
       o.created_at,
       o.paid_at,
       o.status,
       o.payment_provider,
       o.order_currency,
       o.subtotal,
       o.discount_amount,
       o.total_amount,
       u.email              AS user_email,
       u.name               AS user_name,
       STRING_AGG(DISTINCT b.title,    ' | ') AS book_titles,
       STRING_AGG(DISTINCT oi.item_type, ' | ') AS item_types
     FROM orders o
     JOIN public.users u ON u.id = o.user_id
     LEFT JOIN order_items oi ON oi.order_id = o.id
     LEFT JOIN books b ON b.id = oi.book_id
     ${where}
     GROUP BY o.id, u.email, u.name
     ORDER BY o.created_at DESC
     LIMIT 5000`,
    values
  )

  const headers = [
    'order_id',
    'created_at',
    'paid_at',
    'status',
    'payment_provider',
    'currency',
    'subtotal',
    'discount',
    'total',
    'user_email',
    'user_name',
    'books',
    'item_types',
  ]

  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        escapeCsv(r.order_id),
        escapeCsv(formatDateISO(r.created_at)),
        escapeCsv(formatDateISO(r.paid_at)),
        escapeCsv(r.status),
        escapeCsv(r.payment_provider),
        escapeCsv(r.order_currency),
        escapeCsv(r.subtotal),
        escapeCsv(r.discount_amount),
        escapeCsv(r.total_amount),
        escapeCsv(r.user_email),
        escapeCsv(r.user_name),
        escapeCsv(r.book_titles),
        escapeCsv(r.item_types),
      ].join(',')
    ),
  ]

  const csv = lines.join('\r\n')
  const filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
