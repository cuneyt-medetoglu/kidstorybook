/**
 * PDF Generation — Puppeteer + HTML/CSS
 *
 * Sayfa sırası:
 *   1. Ön kapak  — A5 portrait  (148.5mm × 210mm)
 *   2. Spread'ler — A4 landscape (297mm   × 210mm)
 *   3. Arka kapak — A5 portrait  (148.5mm × 210mm)
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import QRCode from 'qrcode'

// ============================================================================
// Types
// ============================================================================

export interface PageData {
  pageNumber: number
  text: string
  imageUrl?: string
  imageBuffer?: ArrayBuffer
}

export interface PDFOptions {
  title: string
  coverImageUrl?: string
  coverImageBuffer?: ArrayBuffer
  pages: PageData[]
  theme?: string
  illustrationStyle?: string
}

interface SpreadData {
  left: {
    type: 'image' | 'text'
    data: PageData | null
  }
  right: {
    type: 'image' | 'text'
    data: PageData | null
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Metni paragraflara böler: önce satır sonları, sonra tek blokta kalan metni cümle sonlarına göre.
 * Sayfa daha dolu ve örnekteki gibi okunaklı görünür.
 */
function formatText(text: string): string {
  if (!text) return ''

  const blocks = text.split(/\n+/).map((b) => b.trim()).filter(Boolean)

  const paragraphs: string[] = []
  for (const block of blocks) {
    const sentences = splitIntoSentences(block)
    paragraphs.push(...sentences)
  }

  return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n')
}

/** Türkçe cümle sonları: . ! ? (ve …) sonrası boşluk */
function splitIntoSentences(block: string): string[] {
  const t = block.trim()
  if (!t) return []

  const raw = t.split(/(?<=[.!?…])\s+/).filter((s) => s.trim())
  if (raw.length <= 1) return [t]

  return raw.map((s) => s.trim())
}

// ============================================================================
// Cover Pages
// ============================================================================

/**
 * Ön kapak — A5 portrait
 * Full-bleed görsel + gradient + başlık + kurumsal HeroKidStory wordmark + altında küçük logo
 */
function generateFrontCoverHTML(options: PDFOptions, logoDataUri: string): string {
  const coverImage = options.coverImageUrl
    ? `<img src="${escapeHtml(options.coverImageUrl)}" alt="" class="cover-image" />`
    : ''

  const logoImg = logoDataUri
    ? `<img src="${logoDataUri}" alt="" class="cover-logo-below" />`
    : ''

  return `
    <div class="page front-cover">
      ${coverImage}
      <div class="cover-gradient"></div>
      <div class="cover-content">
        <h1 class="cover-title">${escapeHtml(options.title)}</h1>
        <div class="cover-branding">
          <div class="cover-wordmark">
            <span class="cw-hero">Hero</span><span class="cw-kid">Kid</span><span class="cw-story">Story</span>
          </div>
          ${logoImg}
        </div>
      </div>
    </div>
  `
}

/**
 * Arka kapak — A5 portrait
 * Üst: logo üzerinde değil, logo üstte + altında HeroKidStory; tagline; alt footer: "ile oluşturuldu" + logo + marka
 */
function generateBackCoverHTML(logoDataUri: string, qrDataUri: string): string {
  const logoLg = logoDataUri
    ? `<img src="${logoDataUri}" alt="" class="bc-logo-main" />`
    : ''
  const logoSm = logoDataUri
    ? `<img src="${logoDataUri}" alt="" class="bc-logo-footer" />`
    : ''

  const wordmark =
    '<span class="bc-wordmark">' +
    '<span class="bc-hero">Hero</span><span class="bc-kid">Kid</span><span class="bc-story">Story</span>' +
    '</span>'

  const qrBlock = qrDataUri
    ? `<div class="bc-qr-block"><img src="${qrDataUri}" alt="" class="bc-qr-img" /><span class="bc-qr-label">herokidstory.com</span></div>`
    : ''

  return `
    <div class="page back-cover">
      <span class="bc-corner bc-corner-tl"></span>
      <span class="bc-corner bc-corner-tr"></span>
      <span class="bc-corner bc-corner-bl"></span>
      <span class="bc-corner bc-corner-br"></span>
      <div class="bc-main">
        <div class="bc-logo-stack">${logoLg}${wordmark}</div>
        <div class="bc-divider"></div>
        <p class="bc-tagline">Çocuğunuzun kendi hikayesinin kahramanı olduğu, AI ile oluşturulmuş kişisel kitaplar.</p>
        ${qrBlock}
      </div>
      <footer class="bc-footer">
        <p class="bc-created-line">herokidstory.com ile oluşturuldu</p>
        <div class="bc-footer-brand">
          ${logoSm}
          ${wordmark}
        </div>
      </footer>
    </div>
  `
}

// ============================================================================
// Spread Pages
// ============================================================================

function generateSpreadHTML(spread: SpreadData): string {
  let leftHTML = '<div class="half-page"></div>'
  if (spread.left.data) {
    if (spread.left.type === 'image' && spread.left.data.imageUrl) {
      leftHTML = `
        <div class="half-page image-page">
          <img src="${escapeHtml(spread.left.data.imageUrl)}" alt="" class="page-image" />
        </div>
      `
    } else if (spread.left.type === 'text') {
      leftHTML = `
        <div class="half-page text-page">
          <span class="corner-pattern corner-top-left"></span>
          <span class="corner-pattern corner-top-right"></span>
          <span class="corner-pattern corner-bottom-left"></span>
          <span class="corner-pattern corner-bottom-right"></span>
          <div class="text-content">
            <div class="page-text">${formatText(spread.left.data.text)}</div>
            <span class="page-number">${spread.left.data.pageNumber}</span>
          </div>
        </div>
      `
    }
  }

  let rightHTML = '<div class="half-page"></div>'
  if (spread.right.data) {
    if (spread.right.type === 'image' && spread.right.data.imageUrl) {
      rightHTML = `
        <div class="half-page image-page">
          <img src="${escapeHtml(spread.right.data.imageUrl)}" alt="" class="page-image" />
        </div>
      `
    } else if (spread.right.type === 'text') {
      rightHTML = `
        <div class="half-page text-page">
          <span class="corner-pattern corner-top-left"></span>
          <span class="corner-pattern corner-top-right"></span>
          <span class="corner-pattern corner-bottom-left"></span>
          <span class="corner-pattern corner-bottom-right"></span>
          <div class="text-content">
            <div class="page-text">${formatText(spread.right.data.text)}</div>
            <span class="page-number">${spread.right.data.pageNumber}</span>
          </div>
        </div>
      `
    }
  }

  return `
    <div class="page spread-page">
      <div class="spread-container">
        ${leftHTML}
        ${rightHTML}
      </div>
    </div>
  `
}

// ============================================================================
// Spread Preparation
// ============================================================================

/**
 * Her hikaye sayfası → bir spread (görsel sol/sağ alternating + karşı metin)
 *
 * Spread 0: [Image | Text]   (çift spread index)
 * Spread 1: [Text  | Image]  (tek  spread index)
 * Spread 2: [Image | Text]
 */
function prepareSpreads(pages: PageData[]): SpreadData[] {
  const spreads: SpreadData[] = []

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    if (!page) continue

    const isEven = i % 2 === 0
    const imageSide = isEven ? 'left' : 'right'
    const textSide  = isEven ? 'right' : 'left'

    const spread: SpreadData = {
      left:  { type: 'text', data: null },
      right: { type: 'text', data: null },
    }

    spread[imageSide] = page.imageUrl
      ? { type: 'image', data: page }
      : { type: 'text',  data: page }

    spread[textSide] = { type: 'text', data: page }

    spreads.push(spread)
  }

  return spreads
}

/** Ana site URL’si — QR kodda kullanılır */
async function buildQrDataUri(): Promise<string> {
  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://herokidstory.com').replace(/\/$/, '')
  try {
    return await QRCode.toDataURL(base, {
      width: 200,
      margin: 1,
      color: { dark: '#2a2a2a', light: '#fef9f3' },
      errorCorrectionLevel: 'M',
    })
  } catch (e) {
    console.warn('[PDF] QR generation failed:', e)
    return ''
  }
}

// ============================================================================
// HTML Assembly
// ============================================================================

async function generateHTML(options: PDFOptions, spreads: SpreadData[]): Promise<string> {
  // CSS
  const cssPath = path.join(process.cwd(), 'lib', 'pdf', 'templates', 'book-styles.css')
  let css = fs.readFileSync(cssPath, 'utf-8')

  // SVG pattern → base64 (köşe desenleri için)
  const svgPath = path.join(process.cwd(), 'public', 'pdf-backgrounds', 'children-pattern.svg')
  if (fs.existsSync(svgPath)) {
    const svgContent = fs.readFileSync(svgPath, 'utf-8')
    const dataUri = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`
    css = css.replace(
      /url\(['"]?\/pdf-backgrounds\/children-pattern\.svg['"]?\)/g,
      `url('${dataUri}')`
    )
  }

  // Logo → base64 (kapak + arka kapak için)
  const logoPath = path.join(process.cwd(), 'public', 'logo.png')
  const logoDataUri = fs.existsSync(logoPath)
    ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`
    : ''

  const qrDataUri = await buildQrDataUri()

  const frontCoverHTML = generateFrontCoverHTML(options, logoDataUri)
  const spreadsHTML    = spreads.map(generateSpreadHTML).join('\n')
  const backCoverHTML  = generateBackCoverHTML(logoDataUri, qrDataUri)

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(options.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Alegreya:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  ${frontCoverHTML}
  ${spreadsHTML}
  ${backCoverHTML}
</body>
</html>`
}

// ============================================================================
// Main Export
// ============================================================================

export async function generateBookPDF(options: PDFOptions): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    // Büyük base64 içerik için timeout artırıldı
    page.setDefaultNavigationTimeout(120_000)

    const spreads = prepareSpreads(options.pages || [])
    const html = await generateHTML(options, spreads)

    await page.setContent(html, { waitUntil: 'networkidle0' })

    // preferCSSPageSize: true → named @page kuralları (cover/spread) geçerli olur
    const pdfBuffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    })

    return Buffer.from(pdfBuffer)
  } finally {
    await browser.close()
  }
}
