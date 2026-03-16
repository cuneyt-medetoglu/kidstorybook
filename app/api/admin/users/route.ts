import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { getAdminUsers } from '@/lib/db/admin'

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((token as { role?: string }).role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const result = await getAdminUsers({
    search: searchParams.get('search') ?? undefined,
    role: searchParams.get('role') ?? undefined,
    page: parseInt(searchParams.get('page') ?? '1'),
    pageSize: parseInt(searchParams.get('pageSize') ?? '20'),
  })

  return NextResponse.json(result)
}
