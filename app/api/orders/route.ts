import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/api-auth'
import { getOrdersByUserWithItems } from '@/lib/db/orders'

export async function GET() {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await getOrdersByUserWithItems(user.id)
    return NextResponse.json({ orders })
  } catch (err) {
    console.error('[GET /api/orders] DB error:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
