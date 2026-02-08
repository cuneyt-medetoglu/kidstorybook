/**
 * GET /api/debug/quality/can-show
 * Returns whether the current user can see debug quality buttons (Step 6).
 * Used by Step 6 to show/hide debug panel.
 * 
 * Requirements: user must be admin AND feature flag showDebugQualityButtons must be true.
 */

import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/api-auth'
import { getUserRole } from '@/lib/db/users'
import { appConfig } from '@/lib/config'

export async function GET() {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ canShow: false })
  }

  const role = await getUserRole(user.id)
  const isAdmin = role === 'admin'
  const flagOn = appConfig.features.dev.showDebugQualityButtons

  const canShow = isAdmin && flagOn

  return NextResponse.json({ canShow })
}
