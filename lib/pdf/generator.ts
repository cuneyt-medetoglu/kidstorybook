/**
 * PDF Generation Helper
 * 
 * Generates PDF files from book data using jsPDF
 */

import { jsPDF } from 'jspdf'

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

// ============================================================================
// Constants
// ============================================================================

const PAGE_WIDTH = 210 // A4 width in mm
const PAGE_HEIGHT = 297 // A4 height in mm
const MARGIN = 15 // Margin in mm
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2) // 180mm
const IMAGE_HEIGHT = 140 // Image height in mm (60% of content area)
const TEXT_HEIGHT = PAGE_HEIGHT - MARGIN - IMAGE_HEIGHT - MARGIN - 40 // Text area height
const TITLE_FONT_SIZE = 24
const TEXT_FONT_SIZE = 12

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert ArrayBuffer to base64
 * Uses Node.js Buffer for efficient conversion (works in Next.js API routes)
 */
function convertArrayBufferToBase64(arrayBuffer: ArrayBuffer, contentType: string = 'image/png'): string {
  // Use Buffer for efficient conversion (Node.js environment)
  // This avoids "Maximum call stack size exceeded" error with large images
  const buffer = Buffer.from(arrayBuffer)
  const base64 = buffer.toString('base64')
  return `data:${contentType};base64,${base64}`
}

/**
 * Download image from URL and convert to base64
 */
async function downloadImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/png'
    
    return convertArrayBufferToBase64(arrayBuffer, contentType)
  } catch (error) {
    console.error('[PDF Generator] Error downloading image:', error)
    throw error
  }
}

/**
 * Add image to PDF with proper sizing
 */
async function addImageToPDF(
  doc: jsPDF,
  imageUrl: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<void> {
  try {
    const base64Image = await downloadImageAsBase64(imageUrl)
    doc.addImage(base64Image, 'PNG', x, y, width, height, undefined, 'FAST')
  } catch (error) {
    console.error('[PDF Generator] Error adding image to PDF:', error)
    // Add placeholder rectangle if image fails
    doc.setFillColor(240, 240, 240)
    doc.rect(x, y, width, height, 'F')
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(10)
    doc.text('Image unavailable', x + width / 2, y + height / 2, {
      align: 'center',
      baseline: 'middle',
    })
  }
}

/**
 * Wrap text to fit within width
 */
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const testWidth = doc.getTextWidth(testLine)

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Generate PDF from book data
 */
export async function generateBookPDF(options: PDFOptions): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // ========================================================================
  // Cover Page
  // ========================================================================
  if (options.coverImageBuffer || options.coverImageUrl) {
    try {
      const coverImage = options.coverImageBuffer
        ? `data:image/png;base64,${Buffer.from(options.coverImageBuffer).toString('base64')}`
        : await downloadImageAsBase64(options.coverImageUrl!)

      // Add cover image (full page or top portion)
      const coverImageHeight = PAGE_HEIGHT * 0.7 // 70% of page height
      const coverImageWidth = CONTENT_WIDTH
      const coverImageX = MARGIN
      const coverImageY = MARGIN

      doc.addImage(coverImage, 'PNG', coverImageX, coverImageY, coverImageWidth, coverImageHeight, undefined, 'FAST')

      // Add title below cover image
      doc.setFontSize(TITLE_FONT_SIZE)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      
      const titleY = coverImageY + coverImageHeight + 20
      const titleLines = wrapText(doc, options.title, CONTENT_WIDTH)
      let currentTitleY = titleY
      
      for (const line of titleLines) {
        doc.text(line, PAGE_WIDTH / 2, currentTitleY, {
          align: 'center',
        })
        currentTitleY += 10
      }

      // Add metadata (theme, style) if provided
      if (options.theme || options.illustrationStyle) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 100)
        const metadata = [
          options.theme && `Theme: ${options.theme}`,
          options.illustrationStyle && `Style: ${options.illustrationStyle}`,
        ]
          .filter(Boolean)
          .join(' • ')
        
        doc.text(metadata, PAGE_WIDTH / 2, currentTitleY + 10, {
          align: 'center',
        })
      }
    } catch (error) {
      console.error('[PDF Generator] Error adding cover page:', error)
      // Add title only if cover fails
      doc.setFontSize(TITLE_FONT_SIZE)
      doc.setFont('helvetica', 'bold')
      doc.text(options.title, PAGE_WIDTH / 2, PAGE_HEIGHT / 2, {
        align: 'center',
      })
    }
  } else {
    // No cover image - add title only
    doc.setFontSize(TITLE_FONT_SIZE)
    doc.setFont('helvetica', 'bold')
    doc.text(options.title, PAGE_WIDTH / 2, PAGE_HEIGHT / 2, {
      align: 'center',
    })
  }

  // ========================================================================
  // Content Pages
  // ========================================================================
  for (const page of options.pages) {
    doc.addPage()

    let currentY = MARGIN

    // Add page image (if available)
    if (page.imageUrl) {
      try {
        await addImageToPDF(
          doc,
          page.imageUrl,
          MARGIN,
          currentY,
          CONTENT_WIDTH,
          IMAGE_HEIGHT
        )
        currentY += IMAGE_HEIGHT + 10
      } catch (error) {
        console.error(`[PDF Generator] Error adding image for page ${page.pageNumber}:`, error)
        currentY += 10 // Skip image space if error
      }
    }

    // Add page text
    doc.setFontSize(TEXT_FONT_SIZE)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)

    const textLines = wrapText(doc, page.text, CONTENT_WIDTH)
    const lineHeight = 7
    const maxLines = Math.floor(TEXT_HEIGHT / lineHeight)

    for (let i = 0; i < Math.min(textLines.length, maxLines); i++) {
      doc.text(textLines[i], MARGIN, currentY)
      currentY += lineHeight

      // Check if we need a new page for text
      if (currentY > PAGE_HEIGHT - MARGIN - 20 && i < textLines.length - 1) {
        doc.addPage()
        currentY = MARGIN
      }
    }

    // Add page number
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${page.pageNumber}`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
      {
        align: 'center',
      }
    )
  }

  // ========================================================================
  // Return PDF as Buffer
  // ========================================================================
  const pdfArray = doc.output('arraybuffer')
  return Buffer.from(pdfArray)
}

