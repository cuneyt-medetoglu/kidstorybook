/**
 * Generate Hero "Your Child, The Hero" – Story Character Görseli
 *
 * Bir gerçek çocuk fotoğrafını alıp, verdiğin prompt’a göre hikaye karakteri
 * (story character) versiyonunu üretir. Çıktıyı "Your Child, The Hero" hero
 * bölümünde kullanmak üzere scripts/hero-transformation-output/ içine kaydeder;
 * dosyayı public/hero-transformation/stories/ vb. ilgili yere taşıma işini sen yaparsın.
 *
 * Mantık: generate-style-examples.ts ile aynı – OpenAI /v1/images/edits API
 * (referans görsel + prompt ile dönüşüm). Girdi 1024x1024 veya farklı oran olabilir;
 * çıktı 1024x1024 (1:1) üretilir.
 *
 * Kullanım:
 *   npx tsx scripts/generate-hero-transformation.ts --input=photo.jpg --prompt="In a magical forest with a compass" --style=3d_animation
 *   npx tsx scripts/generate-hero-transformation.ts --input=child.png --prompt="Space adventure, astronaut" --style=watercolor --output-name=child1-forest
 *
 * Argümanlar:
 *   --input       Girdi görsel yolu (zorunlu). Örn: scripts/reference.jpg veya 1024x1024 çocuk fotoğrafı.
 *   --prompt      Dönüşüm prompt’u (zorunlu). Örn: "In a magical forest, holding a compass and map."
 *   --style       Illustration style (zorunlu). Geçerli: 3d_animation, geometric, watercolor, block_world, collage, clay_animation, kawaii, comic_book, sticker_art
 *   --output-name Çıktı dosya adı (uzantısız). Varsayılan: hero-story-YYYYMMDDHHmmss
 *   --output-dir  Çıktı klasörü. Varsayılan: scripts/hero-transformation-output/
 *   --size        Çıktı boyutu. Varsayılan: 1024x1024 (1:1, hero için uygun)
 *   --quality     low | medium | high | auto. Varsayılan: low
 *
 * Örnek: --input=photo.jpg --prompt="In a magical forest with a compass" --style=3d_animation
 */

import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'
import { getStyleDescription } from '../lib/prompts/image/style-descriptions'
import { getStyleSpecificDirectives } from '../lib/prompts/image/scene'

config()

const API_KEY = process.env.OPENAI_API_KEY
const MODEL = 'gpt-image-1.5'

function parseArg(name: string): string | undefined {
  const prefix = `--${name}=`
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) return arg.slice(prefix.length).trim()
  }
  return undefined
}

function requireArg(name: string): string {
  const v = parseArg(name)
  if (!v) {
    console.error(`❌ --${name}=... zorunludur.`)
    process.exit(1)
  }
  return v
}

function buildPromptForStyle(userScenePrompt: string, style: string): string {
  const styleDesc = getStyleDescription(style)
  const styleDirectives = getStyleSpecificDirectives(style)
  return [
    `${styleDesc} illustration`,
    `Transform this child into the main character. ${userScenePrompt}`,
    styleDirectives || '',
    `Children's book illustration, professional, print-ready. NO TEXT, NO WRITING, NO LETTERS in the image.`,
  ].filter(Boolean).join('. ')
}

async function generateHeroTransformation(
  inputPath: string,
  prompt: string,
  outputPath: string,
  size: string,
  quality: string
): Promise<void> {
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY ortam değişkeni tanımlı değil. .env dosyasını kontrol et.')
  }

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Girdi görseli bulunamadı: ${inputPath}`)
  }

  const ext = path.extname(inputPath).toLowerCase()
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg'
  const buffer = fs.readFileSync(inputPath)
  const blob = new Blob([buffer], { type: mime })
  const baseName = path.basename(inputPath)

  const formData = new FormData()
  formData.append('model', MODEL)
  formData.append('prompt', prompt)
  formData.append('size', size)
  formData.append('quality', quality)
  formData.append('image', blob, baseName)

  console.log('🎨 GPT-image /v1/images/edits çağrılıyor...')
  console.log('   model:', MODEL, '| size:', size, '| quality:', quality)
  console.log('   prompt:', prompt.slice(0, 120) + (prompt.length > 120 ? '...' : ''))

  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text()
    const preview = text.length > 300 ? text.slice(0, 300) + '...' : text
    throw new Error(`API hatası (${res.status}): ${preview}`)
  }

  const data = await res.json()

  if (data.data?.[0]?.b64_json) {
    const buf = Buffer.from(data.data[0].b64_json, 'base64')
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, buf)
    console.log('✅ Kaydedildi:', outputPath, `(${(buf.length / 1024).toFixed(1)} KB)`)
    return
  }

  if (data.data?.[0]?.url) {
    const imgRes = await fetch(data.data[0].url)
    if (!imgRes.ok) throw new Error('Görsel indirilemedi: ' + imgRes.status)
    const buf = Buffer.from(await imgRes.arrayBuffer())
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, buf)
    console.log('✅ Kaydedildi:', outputPath, `(${(buf.length / 1024).toFixed(1)} KB)`)
    return
  }

  throw new Error('API yanıtında url veya b64_json yok.')
}

async function main() {
  console.log('🚀 Hero "Your Child, The Hero" – Story character dönüşümü\n')

  const inputPath = path.resolve(process.cwd(), requireArg('input'))
  const userPrompt = requireArg('prompt')
  const style = requireArg('style')
  const outputName = parseArg('output-name') ?? `hero-story-${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}`
  const outputDir = path.resolve(process.cwd(), parseArg('output-dir') ?? 'scripts/hero-transformation-output')
  const size = parseArg('size') ?? '1024x1024'
  const quality = parseArg('quality') ?? 'low'

  const prompt = buildPromptForStyle(userPrompt, style)
  console.log('   style:', style, '\n')

  const outputPath = path.join(outputDir, outputName.endsWith('.jpg') ? outputName : `${outputName}.jpg`)

  await generateHeroTransformation(inputPath, prompt, outputPath, size, quality)

  console.log('\n📁 Çıktı: ' + outputPath)
  console.log('💡 Bu dosyayı public/hero-transformation/stories/ altına taşıyıp config’e ekleyebilirsin.')
  console.log('   Bkz: docs/guides/HERO_YOUR_CHILD_THE_HERO_IMAGES_ANALYSIS.md')
}

main().catch((e) => {
  console.error('❌', e instanceof Error ? e.message : e)
  process.exit(1)
})
