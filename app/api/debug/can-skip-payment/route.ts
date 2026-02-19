/**
 * GET /api/debug/can-skip-payment
 * Returns whether the current user is allowed to create a book without payment.
 * Used by Step 6 to show "Create without payment" button.
 * See docs/strategies/DEBUG_AND_FEATURE_FLAGS_ANALYSIS.md
 */

import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/api-auth'
import { getUserRole } from '@/lib/db/users'

export async function GET() {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ canSkipPayment: false })
  }

  const debugSkip = process.env.DEBUG_SKIP_PAYMENT === 'true'
  const role = await getUserRole(user.id)
  const isAdmin = role === 'admin'
  const canSkipPayment = debugSkip || isAdmin

  return NextResponse.json({ canSkipPayment })
}
