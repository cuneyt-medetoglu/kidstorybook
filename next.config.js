/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      // S3 / custom storage (use your bucket domain if needed)
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

