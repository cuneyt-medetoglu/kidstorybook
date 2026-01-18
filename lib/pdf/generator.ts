/**
 * PDF Generation Helper
 * 
 * Generates PDF files from book data using Puppeteer + HTML/CSS
 * Format: A4 Landscape with double-page spreads (storybook style)
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

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
// Constants
// ============================================================================

const PAGE_WIDTH = 297 // A4 landscape width in mm
const PAGE_HEIGHT = 210 // A4 landscape height in mm
const MARGIN = 10 // Margin in mm

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Escape HTML special characters
 */
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
 * Convert text to HTML paragraphs (preserve line breaks)
 */
function formatText(text: string): string {
  if (!text) return ''
  const escaped = escapeHtml(text)
  // Split by line breaks and wrap in paragraphs
  return escaped
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => `<p>${line.trim()}</p>`)
    .join('\n')
}

/**
 * Generate HTML for cover page
 */
function generateCoverHTML(options: PDFOptions): string {
  const coverImage = options.coverImageUrl
    ? `<img src="${escapeHtml(options.coverImageUrl)}" alt="Cover" class="page-image cover-image" />`
    : ''

  return `
    <div class="page cover-page">
      <div class="spread-container">
        <div class="half-page image-page cover-image-page">
          ${coverImage}
        </div>
        <div class="half-page cover-title-page">
          <h1 class="cover-title">${escapeHtml(options.title)}</h1>
        </div>
      </div>
    </div>
  `
}

/**
 * Generate HTML for a spread (double-page)
 */
function generateSpreadHTML(spread: SpreadData): string {
  // Left page
  let leftHTML = '<div class="half-page"></div>'
  if (spread.left.data) {
    if (spread.left.type === 'image' && spread.left.data.imageUrl) {
      leftHTML = `
        <div class="half-page image-page">
          <img src="${escapeHtml(spread.left.data.imageUrl)}" alt="Page ${spread.left.data.pageNumber}" class="page-image" />
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

  // Right page
  let rightHTML = '<div class="half-page"></div>'
  if (spread.right.data) {
    if (spread.right.type === 'image' && spread.right.data.imageUrl) {
      rightHTML = `
        <div class="half-page image-page">
          <img src="${escapeHtml(spread.right.data.imageUrl)}" alt="Page ${spread.right.data.pageNumber}" class="page-image" />
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

/**
 * Generate complete HTML document
 */
function generateHTML(options: PDFOptions, spreads: SpreadData[]): string {
  const cssPath = path.join(process.cwd(), 'lib', 'pdf', 'templates', 'book-styles.css')
  let css = fs.readFileSync(cssPath, 'utf-8')

  // Load SVG pattern and convert to base64 data URI
  const svgPath = path.join(process.cwd(), 'public', 'pdf-backgrounds', 'children-pattern.svg')
  if (fs.existsSync(svgPath)) {
    const svgContent = fs.readFileSync(svgPath, 'utf-8')
    const base64Svg = Buffer.from(svgContent).toString('base64')
    const dataUri = `data:image/svg+xml;base64,${base64Svg}`
    
    // Replace SVG URL with data URI in CSS
    css = css.replace(
      /url\(['"]?\/pdf-backgrounds\/children-pattern\.svg['"]?\)/g,
      `url('${dataUri}')`
    )
  }

  const coverHTML = generateCoverHTML(options)
  const spreadsHTML = spreads.map(generateSpreadHTML).join('\n')

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(options.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Alegreya:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    ${css}
  </style>
</head>
<body>
  ${coverHTML}
  ${spreadsHTML}
</body>
</html>
  `.trim()
}

/**
 * Prepare spreads data from pages
 * 
 * SIMPLE PATTERN: Each page alternates Image-Text-Image-Text...
 * - Page index 0, 2, 4... (even): Show Image
 * - Page index 1, 3, 5... (odd): Show Text
 * 
 * LAYOUT: Alternates every spread
 * - Spread 0: [Image (page 0) | Text (page 1)]
 * - Spread 1: [Text (page 2) | Image (page 3)] - Layout swaps
 * - Spread 2: [Image (page 4) | Text (page 5)]
 * 
 * Example with 3 pages:
 * - Page 0 (index 0): Image → Spread 0, Left
 * - Page 1 (index 1): Text → Spread 0, Right
 * - Page 2 (index 2): Image → Spread 1, Right (alternate layout)
 */
function prepareSpreads(pages: PageData[]): SpreadData[] {
  const spreads: SpreadData[] = []

  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i]
    if (!page) continue

    const isEvenSpread = i % 2 === 0
    const hasImage = Boolean(page.imageUrl)

    const imageSide = isEvenSpread ? 'left' : 'right'
    const textSide = isEvenSpread ? 'right' : 'left'

    const spread: SpreadData = {
      left: { type: 'text', data: null },
      right: { type: 'text', data: null },
    }

    // Same story page produces two facing pages (image + text)
    if (hasImage) {
      spread[imageSide] = { type: 'image', data: page }
    } else {
      // Fallback if image is missing
      spread[imageSide] = { type: 'text', data: page }
    }

    spread[textSide] = { type: 'text', data: page }

    spreads.push(spread)
  }

  return spreads
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Generate PDF from book data using Puppeteer
 */
export async function generateBookPDF(options: PDFOptions): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    // Prepare spreads data
    const spreads = prepareSpreads(options.pages || [])

    // Generate HTML
    const html = generateHTML(options, spreads)

    // Set content and wait for images to load
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: true,
    })

    return Buffer.from(pdfBuffer)
  } finally {
    await browser.close()
  }
}
