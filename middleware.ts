/**
 * Combined middleware: next-intl locale routing + NextAuth protection
 * Edge-compatible (no pg/Node imports)
 */

import createMiddleware from 'next-intl/middleware'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

const handleI18nRouting = createMiddleware(routing)

// Protected page paths — checked WITHOUT locale prefix
const PROTECTED_PAGE_PATHS = ['/dashboard', '/create', '/draft-preview']

// Admin-only paths — require role === 'admin'
const ADMIN_PAGE_PATHS = ['/admin']

// Protected API paths — locale-free, return 401 if unauthenticated
const PROTECTED_API_PATHS = [
  '/api/books',
  '/api/characters',
  '/api/ai',
  '/api/drafts',
]

/** Strip /en or /tr prefix from a pathname */
function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1)
    if (pathname === `/${locale}`) return '/'
  }
  return pathname
}

/** Detect locale from pathname, fallback to defaultLocale */
function detectLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale
    }
  }
  return routing.defaultLocale
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── API routes: auth only, no locale handling ──────────────────────────────
  if (pathname.startsWith('/api/')) {
    const isProtected = PROTECTED_API_PATHS.some(p => pathname.startsWith(p))
    if (isProtected) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
    return NextResponse.next()
  }

  // ── Page routes: auth check for protected paths ────────────────────────────
  const pathnameWithoutLocale = stripLocale(pathname)
  const isProtectedPage = PROTECTED_PAGE_PATHS.some(p =>
    pathnameWithoutLocale.startsWith(p)
  )

  if (isProtectedPage) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    if (!token) {
      const locale = detectLocale(pathname)
      const loginUrl = new URL(`/${locale}/auth/login`, request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── Admin-only pages: must be logged in AND role === 'admin' ───────────────
  const isAdminPage = ADMIN_PAGE_PATHS.some(p => pathnameWithoutLocale.startsWith(p))
  if (isAdminPage) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    const locale = detectLocale(pathname)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Admin middleware] pathnameWithoutLocale:', pathnameWithoutLocale, '| token?.role:', (token as { role?: string })?.role, '| token?.id:', (token as { id?: string })?.id)
    }
    if (!token) {
      const loginUrl = new URL(`/${locale}/auth/login`, request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if ((token as { role?: string }).role !== 'admin') {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }
  }

  // ── Locale routing (next-intl handles prefix, detection, redirect) ─────────
  return handleI18nRouting(request)
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image  (Next.js internals)
     * - favicon.ico
     * - api/auth  (NextAuth own routes)
     * - Static files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|html)$).*)',
  ],
}
