/**
 * PDF için görsel sıkıştırma
 *
 * Görselleri indirir, yeniden boyutlandırır ve JPEG olarak sıkıştırır.
 * PDF boyutunun 50 MB sınırının altında kalması için kullanılır.
 */

// Hedef PDF boyutu ~30–40 MB (50 MB limit altında, kalite kaybı az)
const MAX_WIDTH_PX = 2000 // Görsel max genişlik (px)
const JPEG_QUALITY = 95 // 90–95: yüksek kalite, ~30–40 MB bandı

export interface CompressResult {
  dataUrl: string
  originalUrl: string
  usedCompression: boolean
}

/**
 * Bir görsel URL'sini PDF'te kullanmak için sıkıştırır.
 * Hata durumunda orijinal URL döner (PDF kırılmasın).
 */
export async function compressImageForPdf(imageUrl: string): Promise<CompressResult> {
  if (!imageUrl || !imageUrl.startsWith('http')) {
    return { dataUrl: imageUrl, originalUrl: imageUrl, usedCompression: false }
  }

  try {
    const res = await fetch(imageUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const arrayBuffer = await res.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    const sharp = (await import('sharp')).default
    const outputBuffer = await sharp(inputBuffer)
      .resize(MAX_WIDTH_PX, null, { withoutEnlargement: true }) // Sadece büyükse küçült
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer()

    const base64 = outputBuffer.toString('base64')
    const dataUrl = `data:image/jpeg;base64,${base64}`

    return {
      dataUrl,
      originalUrl: imageUrl,
      usedCompression: true,
    }
  } catch (err) {
    console.warn('[PDF Image Compress] Failed to compress image, using original URL:', err)
    return { dataUrl: imageUrl, originalUrl: imageUrl, usedCompression: false }
  }
}
