import { defineRouting } from 'next-intl/routing'

/**
 * Localization routing config.
 * To add a new language: add the locale code here and create messages/<code>.json
 */
export const routing = defineRouting({
  locales: ['en', 'tr'],
  defaultLocale: 'en',
  localePrefix: 'always', // /en/... /tr/... always in URL (SEO)
})

export type Locale = (typeof routing.locales)[number]
