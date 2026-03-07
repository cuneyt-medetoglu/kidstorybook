/**
 * Locale-aware navigation utilities.
 * Use these instead of next/link and next/navigation throughout the app.
 *
 * import { Link, useRouter, usePathname, redirect } from '@/i18n/navigation'
 */
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
