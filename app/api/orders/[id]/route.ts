import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/api-auth'
import { getOrderDetailForUser } from '@/lib/db/orders'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const order = await getOrderDetailForUser(params.id, user.id)
    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ order })
  } catch (err) {
    console.error('[GET /api/orders/[id]] DB error:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
