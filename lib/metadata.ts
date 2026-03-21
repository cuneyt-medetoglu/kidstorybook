/**
 * Locale-aware metadata builder for Next.js generateMetadata
 *
 * Usage in a server component or layout:
 *   export async function generateMetadata({ params: { locale } }) {
 *     return buildPageMetadata(locale, 'examples', '/examples')
 *   }
 */

import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://herokidstory.com'

/** Build hreflang alternate links for all supported locales */
function buildAlternates(path: string = '') {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = `${BASE_URL}/${locale}${path}`
  }
  // x-default points to the default locale
  languages['x-default'] = `${BASE_URL}/${routing.defaultLocale}${path}`

  return {
    canonical: `${BASE_URL}/${routing.defaultLocale}${path}`,
    languages,
  }
}

type MetadataKey =
  | 'home'
  | 'examples'
  | 'pricing'
  | 'dashboard'
  | 'cart'
  | 'checkout'
  | 'create'
  | 'authLogin'
  | 'authRegister'

/**
 * Builds full Metadata object for a page.
 * @param locale - current locale (en | tr)
 * @param key    - metadata namespace key (see MetadataKey)
 * @param path   - URL path after locale prefix (e.g. '/examples')
 */
export async function buildPageMetadata(
  locale: string,
  key: MetadataKey,
  path: string = ''
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const title = t(`${key}.title`)
  const description = t(`${key}.description`)
  const siteName = t('siteName')

  let ogTitle = title
  let ogDescription = description
  try {
    ogTitle = t(`${key}.ogTitle`)
    ogDescription = t(`${key}.ogDescription`)
  } catch {
    // ogTitle/ogDescription are optional — fall back to title/description
  }

  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US'
  const ogLocaleAlternate = locale === 'tr' ? 'en_US' : 'tr_TR'

  return {
    title,
    description,
    alternates: buildAlternates(path),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName,
      locale: ogLocale,
      alternateLocale: [ogLocaleAlternate],
      type: 'website',
      url: `${BASE_URL}/${locale}${path}`,
      images: [
        {
          url: `${BASE_URL}/brand.png`,
          width: 2816,
          height: 1536,
          alt: 'HeroKidStory',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [`${BASE_URL}/brand.png`],
    },
  }
}
