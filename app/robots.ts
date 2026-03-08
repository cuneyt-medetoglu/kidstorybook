import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://herokidstory.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/en/', '/tr/'],
        disallow: [
          '/api/',
          '/en/dashboard',
          '/tr/dashboard',
          '/en/cart',
          '/tr/cart',
          '/en/checkout',
          '/tr/checkout',
          '/en/books/',
          '/tr/books/',
          '/en/draft-preview',
          '/tr/draft-preview',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
