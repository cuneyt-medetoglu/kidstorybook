/**
 * Supabase Server Client with Bearer Token Support
 * 
 * Helper function to create Supabase client that supports both:
 * - Session cookies (browser requests)
 * - Bearer tokens (Postman, API clients)
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Create Supabase client with Bearer token support
 * 
 * @param request - Next.js request object (optional, for Bearer token)
 * @returns Supabase client configured for server-side use
 */
export async function createClient(request?: NextRequest) {
  // Check for Bearer token in Authorization header (Postman support)
  const authHeader = request?.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null

  // If Bearer token exists, use it directly
  if (bearerToken) {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      }
    )
  }

  // Otherwise, use session cookies (normal browser flow)
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if we have middleware refreshing sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if we have middleware refreshing sessions.
          }
        },
      },
    }
  )
}

/**
 * Get authenticated user from request
 * Supports both Bearer token and session cookies
 */
export async function getAuthenticatedUser(request: NextRequest) {
  const supabase = await createClient(request)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  return { user, error: authError }
}

