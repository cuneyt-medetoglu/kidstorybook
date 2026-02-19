/**
 * GET /api/debug/quality/can-show
 * Returns whether the current user can see debug quality buttons (Step 6).
 * Used by Step 6 to show/hide debug panel.
 * Admin only: visible in both development and production (no NODE_ENV/flag check).
 */

import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/api-auth'
import { getUserRole } from '@/lib/db/users'

export async function GET() {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ canShow: false })
  }

  const role = await getUserRole(user.id)
  const isAdmin = role === 'admin'
  const canShow = isAdmin

  return NextResponse.json({ canShow })
}
