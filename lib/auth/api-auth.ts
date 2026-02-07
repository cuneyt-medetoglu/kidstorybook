/**
 * Auth helper for API routes
 * 
 * Provides getUser() function to check authentication in API routes
 * Uses NextAuth.js session
 */

import { auth } from '@/auth'
import { NextRequest } from 'next/server'

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

/**
 * Get authenticated user from NextAuth session
 * Returns null if not authenticated
 */
export async function getUser(): Promise<AuthUser | null> {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id!,
    email: session.user.email!,
    name: session.user.name,
    image: session.user.image,
  }
}

/**
 * Get authenticated user or throw 401 error
 * Use this in API routes that require authentication
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
