/**
 * NextAuth.js Middleware (Edge-compatible)
 * Uses getToken only – does not import auth.ts/pg so it can run in Edge Runtime.
 */

import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const session = token ? { user: { id: token.sub, email: token.email, name: token.name } } : null

  // Protected routes that require authentication
  const protectedPaths = [
    '/dashboard',
    '/create',
    '/draft-preview',
    '/api/books',
    '/api/characters',
    '/api/ai',
    '/api/drafts',
  ]

  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (NextAuth routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
