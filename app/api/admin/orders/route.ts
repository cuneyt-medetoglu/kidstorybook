import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { getAdminOrders } from '@/lib/db/orders'

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((token as { role?: string }).role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)

  const result = await getAdminOrders({
    search: searchParams.get('search') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    provider: searchParams.get('provider') ?? undefined,
    page: parseInt(searchParams.get('page') ?? '1'),
    limit: parseInt(searchParams.get('pageSize') ?? '20'),
  })

  return NextResponse.json(result)
}
