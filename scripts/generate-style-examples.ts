/**
 * Generate Illustration Style Examples Script
 * 
 * Bu script, aynı sahne için 9 farklı illustration style'da görsel üretir.
 * Görseller public/illustration-styles/ klasörüne kaydedilir.
 * 
 * REFERANS GÖRSEL (OPSIYONEL):
 * - Referans görsel OPSIYONEL - yoksa random oluşturur, varsa ona göre oluşturur
 * - Referans görsel varsa: Daha tutarlı sonuçlar için `/v1/images/edits` API kullanır
 * - Referans görsel yoksa: `/v1/images/generations` API ile text-only generation yapar
 * - Referans görseli `scripts/reference.jpg` veya `public/illustration-styles/reference.jpg` olarak koy
 * 
 * Kullanım: npm run generate-style-examples
 * veya: npx tsx scripts/generate-style-examples.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'
import { getStyleDescription } from '../lib/prompts/image/v1.0.0/style-descriptions'
import { getStyleSpecificDirectives } from '../lib/prompts/image/v1.0.0/scene'

// .env dosyasını yükle
config()

// 9 Illustration Style
const ILLUSTRATION_STYLES = [
  '3d_animation',
  'geometric',
  'watercolor',
  'block_world',
  'collage',
  'clay_animation',
  'kawaii',
  'comic_book',
  'sticker_art',
] as const

// Aynı sahne açıklaması (tüm stiller için aynı)
const BASE_SCENE_DESCRIPTION = `A young girl with short curly brown hair wearing a light blue t-shirt with a yellow sun graphic, light pink shorts, and pink sneakers, walking on a sunny path with a small golden-brown puppy wearing a red bandana. The path is lined with colorful flowers (pink, purple, light blue, white) and lush green grass. Large trees with full green canopies are in the background. The sky is bright blue with fluffy white clouds. The scene is cheerful, bright, and friendly.`

// GPT-image API ayarları
const API_KEY = process.env.OPENAI_API_KEY
const MODEL = 'gpt-image-1.5'
const SIZE = '1024x1536'
const QUALITY = 'low'

// Rate limiting: 90 saniyede max 4 görsel
const RATE_LIMIT_DELAY = 90000 // 90 saniye
const BATCH_SIZE = 4

// Referans görsel yolları (sırayla kontrol edilir)
const REFERENCE_IMAGE_PATHS = [
  path.join(process.cwd(), 'scripts', 'reference.jpg'),
  path.join(process.cwd(), 'scripts', 'reference.png'),
  path.join(process.cwd(), 'public', 'illustration-styles', 'reference.jpg'),
  path.join(process.cwd(), 'public', 'illustration-styles', 'reference.png'),
]

/**
 * Referans görseli bul ve döndür
 */
function findReferenceImage(): string | null {
  for (const imagePath of REFERENCE_IMAGE_PATHS) {
    if (fs.existsSync(imagePath)) {
      console.log(`📸 Reference image found: ${imagePath}`)
      console.log(`✅ Will use reference image for consistent results`)
      return imagePath
    }
  }
  console.log(`ℹ️  No reference image found. Will use text-only generation (random variations).`)
  console.log(`💡 Tip: Place reference image at scripts/reference.jpg for more consistent results`)
  return null
}

/**
 * GPT-image API'ye istek at ve görsel URL'ini veya base64'ünü döndür
 * Referans görsel varsa /v1/images/edits kullanır, yoksa /v1/images/generations
 * @returns {Promise<{type: 'url' | 'base64', data: string}>}
 */
async function generateImage(
  prompt: string,
  styleId: string,
  referenceImagePath: string | null
): Promise<{ type: 'url' | 'base64'; data: string }> {
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }

  console.log(`\n🎨 Generating image for style: ${styleId}`)
  console.log(`📝 Prompt length: ${prompt.length} characters`)

  // Referans görsel varsa /v1/images/edits kullan
  if (referenceImagePath) {
    console.log(`📸 Using reference image: ${referenceImagePath}`)
    
    // Görseli oku (Node.js 18+ global Blob kullan)
    const imageBuffer = fs.readFileSync(referenceImagePath)
    const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' })

    // FormData oluştur (Node.js 18+ global FormData)
    const formData = new FormData()
    formData.append('model', MODEL)
    formData.append('prompt', prompt)
    formData.append('size', SIZE)
    formData.append('quality', QUALITY)
    formData.append('image', imageBlob, 'reference.jpg')

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      const errorPreview = errorText.length > 200 ? errorText.substring(0, 200) + '...' : errorText
      console.error(`❌ Edits API failed (${response.status}): ${errorPreview}`)
      console.error(`⚠️  Falling back to generations API...`)
      // Fallback to generations
      return generateImageTextOnly(prompt, styleId)
    }

    const result = await response.json()
    
    // URL varsa URL döndür
    if (result.data?.[0]?.url) {
      console.log(`✅ Image generated successfully for ${styleId} (using reference image, URL)`)
      return { type: 'url', data: result.data[0].url }
    }
    
    // Base64 varsa base64 döndür
    if (result.data?.[0]?.b64_json) {
      console.log(`✅ Image generated successfully for ${styleId} (using reference image, base64)`)
      return { type: 'base64', data: result.data[0].b64_json }
    }

    throw new Error('No image URL or base64 in API response')
  }

  // Referans görsel yoksa text-only generation
  return generateImageTextOnly(prompt, styleId)
}

/**
 * Text-only image generation (fallback)
 * @returns {Promise<{type: 'url' | 'base64', data: string}>}
 */
async function generateImageTextOnly(prompt: string, styleId: string): Promise<{ type: 'url' | 'base64'; data: string }> {
  console.log(`📝 Using text-only generation (no reference image)`)

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt,
      n: 1,
      size: SIZE,
      quality: QUALITY,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    const errorPreview = errorText.length > 200 ? errorText.substring(0, 200) + '...' : errorText
    throw new Error(`GPT-image API error: ${response.status} - ${errorPreview}`)
  }

  const result = await response.json()
  
  // URL varsa URL döndür
  if (result.data?.[0]?.url) {
    console.log(`✅ Image generated successfully for ${styleId} (text-only, URL)`)
    return { type: 'url', data: result.data[0].url }
  }
  
  // Base64 varsa base64 döndür
  if (result.data?.[0]?.b64_json) {
    console.log(`✅ Image generated successfully for ${styleId} (text-only, base64)`)
    return { type: 'base64', data: result.data[0].b64_json }
  }

  throw new Error('No image URL or base64 in API response')
}

/**
 * URL'den görseli indir veya base64'ü decode edip dosyaya kaydet
 */
async function saveImage(
  imageData: { type: 'url' | 'base64'; data: string },
  filePath: string
): Promise<void> {
  if (imageData.type === 'base64') {
    // Base64'ü decode et ve kaydet
    console.log(`💾 Saving base64 image to ${filePath}...`)
    const imageBuffer = Buffer.from(imageData.data, 'base64')
    fs.writeFileSync(filePath, imageBuffer)
    console.log(`✅ Image saved to ${filePath} (${(imageBuffer.length / 1024).toFixed(2)} KB)`)
  } else {
    // URL'den indir ve kaydet
    console.log(`📥 Downloading image from URL to ${filePath}...`)
    const response = await fetch(imageData.data)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    fs.writeFileSync(filePath, Buffer.from(buffer))
    console.log(`✅ Image saved to ${filePath} (${(buffer.byteLength / 1024).toFixed(2)} KB)`)
  }
}

/**
 * Prompt oluştur (stil-specific direktiflerle)
 */
function buildPrompt(styleId: string): string {
  const styleDescription = getStyleDescription(styleId)
  const styleDirectives = getStyleSpecificDirectives(styleId)

  const promptParts = [
    `${styleDescription} illustration`,
    BASE_SCENE_DESCRIPTION,
    styleDirectives,
    'professional children\'s book illustration',
    'high quality, print-ready',
    'detailed but age-appropriate',
    'warm and inviting atmosphere',
    'NO TEXT, NO WRITING, NO LETTERS, NO WORDS in the image',
  ]

  return promptParts.filter(Boolean).join(', ')
}

/**
 * Ana fonksiyon
 */
async function main() {
  console.log('🚀 Starting illustration style examples generation...')
  console.log(`📊 Total styles: ${ILLUSTRATION_STYLES.length}`)
  console.log(`⏱️  Estimated time: ~${Math.ceil(ILLUSTRATION_STYLES.length / BATCH_SIZE) * (RATE_LIMIT_DELAY / 1000)} seconds\n`)

  // Referans görseli bul
  const referenceImagePath = findReferenceImage()

  // Output klasörünü oluştur
  const outputDir = path.join(process.cwd(), 'public', 'illustration-styles')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`📁 Created output directory: ${outputDir}`)
  }

  // Her stil için görsel üret
  for (let i = 0; i < ILLUSTRATION_STYLES.length; i++) {
    const styleId = ILLUSTRATION_STYLES[i]

    try {
      // Prompt oluştur
      const prompt = buildPrompt(styleId)

      // Görsel üret (referans görsel varsa kullan)
      const imageData = await generateImage(prompt, styleId, referenceImagePath)

      // Görseli kaydet (URL veya base64)
      const fileName = `${styleId}.jpg`
      const filePath = path.join(outputDir, fileName)
      await saveImage(imageData, filePath)

      console.log(`✅ Completed ${i + 1}/${ILLUSTRATION_STYLES.length}: ${styleId}\n`)

      // Rate limiting: Her 4 görselden sonra 90 saniye bekle
      if ((i + 1) % BATCH_SIZE === 0 && i + 1 < ILLUSTRATION_STYLES.length) {
        console.log(`⏳ Rate limit: Waiting ${RATE_LIMIT_DELAY / 1000} seconds before next batch...`)
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorPreview = errorMessage.length > 300 ? errorMessage.substring(0, 300) + '...' : errorMessage
      console.error(`❌ Error generating image for ${styleId}: ${errorPreview}`)
      console.error(`⚠️  Continuing with next style...\n`)
    }
  }

  console.log('🎉 All illustration style examples generated successfully!')
  console.log(`📁 Images saved to: ${outputDir}`)
}

// Script'i çalıştır
main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
