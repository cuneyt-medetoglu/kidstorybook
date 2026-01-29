/**
 * GET /api/debug/can-skip-payment
 * Returns whether the current user is allowed to create a book without payment.
 * Used by Step 6 to show "Create without payment" button.
 * See docs/strategies/DEBUG_AND_FEATURE_FLAGS_ANALYSIS.md
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { appConfig } from '@/lib/config'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ canSkipPayment: false })
  }

  const debugSkip = process.env.DEBUG_SKIP_PAYMENT === 'true'
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  const flagOn = appConfig.features.dev.skipPaymentForCreateBook
  const canSkipPayment = debugSkip || (isAdmin && flagOn)

  return NextResponse.json({ canSkipPayment })
}
