import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { getOrderDetailForAdmin, updateOrderStatus } from '@/lib/db/orders'
import type { OrderStatus } from '@/lib/payment/types'

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'paid',
  'failed',
  'cancelled',
  'refunded',
  'partially_refunded',
]

async function requireAdmin(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return null
  if ((token as { role?: string }).role !== 'admin') return null
  return token
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const order = await getOrderDetailForAdmin(params.id)
    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ order })
  } catch (err) {
    console.error('[GET /api/admin/orders/[id]] DB error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { status?: string; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { status, notes } = body

  if (status !== undefined && !VALID_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json(
      { error: `Geçersiz durum: ${status}` },
      { status: 422 }
    )
  }

  try {
    const existing = await getOrderDetailForAdmin(params.id)
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updateInput: Parameters<typeof updateOrderStatus>[1] = {
      status: (status as OrderStatus) ?? existing.status,
    }

    if (status === 'cancelled' && existing.status !== 'cancelled') {
      updateInput.cancelledAt = new Date()
    }
    if (status === 'refunded' && existing.status !== 'refunded') {
      updateInput.refundedAt = new Date()
    }
    if (notes !== undefined) {
      updateInput.notes = notes
    }

    const updated = await updateOrderStatus(params.id, updateInput)
    return NextResponse.json({ order: updated })
  } catch (err) {
    console.error('[PATCH /api/admin/orders/[id]] DB error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
