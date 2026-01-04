/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // DALL-E 3 images
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      // OpenAI generated images (if needed)
      {
        protocol: 'https',
        hostname: '**.openai.com',
      },
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
    NODE_ENV: process.env.NODE_ENV || 'development',
  },

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Enable SWC minification
    swcMinify: true,
    // Compress responses
    compress: true,
    // Optimize fonts
    optimizeFonts: true,
  }),

  // Development settings
  ...(process.env.NODE_ENV === 'development' && {
    // Enable React strict mode
    reactStrictMode: true,
  }),
}

module.exports = nextConfig

