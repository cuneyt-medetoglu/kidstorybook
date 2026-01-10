/**
 * Test Login API (Development Only)
 * 
 * POST /api/auth/test-login
 * For testing purposes only - allows login via email/password in Postman
 * 
 * ⚠️ WARNING: This endpoint should be disabled in production!
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse, CommonErrors } from '@/lib/api/response'

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return CommonErrors.forbidden('This endpoint is only available in development')
  }

  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return CommonErrors.badRequest('email and password are required')
    }

    // Use direct Supabase client for auth (not cookie-based)
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Sign in with email/password
    const {
      data: { user, session },
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !user || !session) {
      return CommonErrors.unauthorized(
        authError?.message || 'Invalid email or password'
      )
    }

    // Return session data (token, user info)
    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email,
        },
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        },
      },
      'Login successful'
    )
  } catch (error) {
    console.error('Test login error:', error)
    return errorResponse(
      'Login failed',
      error instanceof Error ? error.message : 'Unknown error',
      500
    )
  }
}

