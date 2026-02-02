# Faz 3.6: PDF Generation - Implementation Plan

**Tarih:** 10 Ocak 2026  
**Durum:** 📋 Planlama Tamamlandı - Hazır  
**Faz:** Faz 3.6 - PDF Generation  
**Öncelik:** 🔴 Kritik

---

## 📋 Genel Bakış

PDF Generation özelliği, kullanıcıların oluşturdukları kitapları PDF formatında indirmelerine olanak sağlar.

### Hedef
- ✅ Kullanıcılar kitaplarını PDF olarak indirebilmeli
- ✅ PDF'ler Supabase Storage'da saklanmalı
- ✅ PDF'ler profesyonel görünmeli (cover + sayfalar)
- ✅ Her sayfa: görsel + metin

---

## 🔍 Mevcut Durum Analizi

### Book Yapısı
```typescript
interface Book {
  id: string
  user_id: string
  title: string
  story_data: {
    title: string
    pages: Array<{
      pageNumber: number
      text: string
      imageUrl?: string  // Supabase Storage URL
      imagePrompt?: string
    }>
    moral?: string
  }
  cover_image_url?: string  // Supabase Storage URL
  cover_image_path?: string
  images_data: Array<{
    pageNumber: number
    imageUrl: string
    storagePath: string
    prompt: string
  }>
  total_pages: number
  status: 'draft' | 'generating' | 'completed' | 'failed' | 'archived'
}
```

### Storage Yapısı
- **Cover:** `user_id/covers/cover_timestamp.png`
- **Pages:** `user_id/books/bookId/page_X_timestamp.png`
- **PDF:** `user_id/books/bookId/book_title.pdf` (oluşturulacak)

### Mevcut Özellikler
- ✅ E-book Viewer (react-pageflip) - Sayfaları görüntüleme
- ✅ Story generation - Metin içeriği hazır
- ✅ Image generation - Görseller hazır
- ✅ Supabase Storage - Görseller storage'da

---

## 🎯 Gereksinimler

### Fonksiyonel Gereksinimler
1. **PDF Oluşturma API**
   - `POST /api/books/[id]/generate-pdf`
   - Book ID alır
   - Authentication gerekli
   - Ownership kontrolü

2. **PDF İçeriği**
   - Cover page (cover_image_url varsa)
   - Her sayfa: Görsel + Metin
   - Sayfa numaraları
   - Profesyonel layout

3. **Storage**
   - PDF Supabase Storage'a kaydedilmeli
   - Path: `user_id/books/bookId/book_title.pdf`
   - Database'de `pdf_url` ve `pdf_path` güncellenmeli

4. **İndirme Linki**
   - Public URL oluşturulmalı
   - Response'da PDF URL dönmeli

### Teknik Gereksinimler
1. **PDF Kütüphanesi Seçimi**
   - **jsPDF** (önerilen): Client-side, kolay kullanım, HTML/CSS desteği
   - **PDFKit**: Server-side, daha fazla kontrol, Node.js uyumlu
   - **Karar:** jsPDF (Next.js API route için uygun, daha kolay)

2. **Image Handling**
   - Supabase Storage'dan görselleri fetch et
   - Base64 veya Buffer'a çevir
   - PDF'e ekle

3. **Text Layout**
   - Font seçimi (çocuk dostu, okunabilir)
   - Sayfa boyutları (A4 veya Letter)
   - Margin'ler ve padding'ler

---

## 📦 Teknoloji Stack

### Kütüphaneler
- **jsPDF** (`jspdf`) - PDF oluşturma
- **jspdf-autotable** (opsiyonel) - Tablo desteği
- **jspdf-html2canvas** (opsiyonel) - HTML to PDF

### Storage
- **Supabase Storage** - PDF'leri sakla
- **Bucket:** `book-images` (mevcut) veya yeni `book-pdfs` bucket

### Database
- **Supabase PostgreSQL** - PDF URL/path kaydet
- **Column:** `pdf_url`, `pdf_path` (schema'da kontrol et)

---

## 🏗️ Implementation Plan

### Adım 1: Dependencies Kurulumu
```bash
npm install jspdf
```

### Adım 2: Database Schema Kontrolü
- `books` table'da `pdf_url` ve `pdf_path` column'ları var mı?
- Yoksa migration oluştur

### Adım 3: PDF Generation Helper Fonksiyonu
- `lib/pdf/generator.ts` oluştur
- PDF template fonksiyonu
- Image + text layout

### Adım 4: API Endpoint
- `app/api/books/[id]/generate-pdf/route.ts` oluştur
- Authentication
- Book fetch
- Ownership check
- PDF generation
- Storage upload
- Database update
- Response

### Adım 5: Testing
- Test book ile PDF oluştur
- Layout kontrolü
- Image quality kontrolü
- Text readability kontrolü

---

## 📝 Detaylı Implementation

### 1. Database Schema Kontrolü
```sql
-- books table'da pdf_url ve pdf_path var mı kontrol et
-- Yoksa ekle:
ALTER TABLE books ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS pdf_path TEXT;
```

### 2. PDF Generator Helper

**Dosya:** `lib/pdf/generator.ts`

```typescript
import { jsPDF } from 'jspdf'

interface PageData {
  pageNumber: number
  text: string
  imageUrl?: string
  imageBuffer?: Buffer
}

interface PDFOptions {
  title: string
  coverImageUrl?: string
  coverImageBuffer?: Buffer
  pages: PageData[]
}

export async function generateBookPDF(options: PDFOptions): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  // Cover page
  if (options.coverImageBuffer) {
    // Add cover image
  }
  
  // Add title
  
  // Pages
  for (const page of options.pages) {
    doc.addPage()
    // Add image
    // Add text
  }
  
  return doc.output('arraybuffer')
}
```

### 3. API Endpoint

**Dosya:** `app/api/books/[id]/generate-pdf/route.ts`

```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Authentication
  // 2. Fetch book
  // 3. Ownership check
  // 4. Check if PDF already exists (cache)
  // 5. Fetch images (cover + pages)
  // 6. Generate PDF
  // 7. Upload to Supabase Storage
  // 8. Update database
  // 9. Return PDF URL
}
```

---

## 🎨 PDF Layout Tasarımı

### Cover Page
- Cover image (full page veya üst kısım)
- Book title (büyük, merkez)
- Alt kısım: Metadata (theme, style, vb.)

### İç Sayfalar
- **Layout:** Image üstte, text altta
- **Image:** 60-70% sayfa yüksekliği
- **Text:** 30-40% sayfa yüksekliği
- **Font:** Arial veya çocuk dostu font
- **Font Size:** 12-14pt (okunabilir)
- **Margin:** 15mm (tüm kenarlar)
- **Page Number:** Alt orta

### Sayfa Boyutu
- **Format:** A4 (210mm x 297mm)
- **Orientation:** Portrait (dikey)

---

## ✅ Test Senaryoları

1. **PDF Oluşturma**
   - ✅ Cover + 10 sayfa içerikli PDF oluştur
   - ✅ Tüm görseller yüklü mü kontrol et
   - ✅ PDF boyutu makul mü? (5-10MB)

2. **Storage Upload**
   - ✅ PDF Supabase Storage'a yüklendi mi?
   - ✅ Public URL oluşturuldu mu?
   - ✅ Database güncellendi mi?

3. **Edge Cases**
   - ✅ Cover image yoksa ne olur?
   - ✅ Bazı sayfaların görseli yoksa?
   - ✅ PDF zaten varsa (cache)?

4. **Performance**
   - ✅ PDF oluşturma süresi? (5-10 saniye beklenebilir)
   - ✅ Memory usage? (büyük PDF'ler için)

---

## 🚀 Sıradaki Adımlar

1. ✅ **Planlama Tamamlandı** (bu doküman)
2. ⏳ **Dependencies Kurulumu** - jsPDF install
3. ⏳ **Database Schema Kontrolü** - pdf_url, pdf_path columns
4. ⏳ **PDF Generator Helper** - `lib/pdf/generator.ts`
5. ⏳ **API Endpoint** - `app/api/books/[id]/generate-pdf/route.ts`
6. ⏳ **Testing** - Test book ile PDF oluştur
7. ⏳ **ROADMAP Güncelleme** - Faz 3.6 işaretle

---

## 📚 Referanslar

- **ROADMAP:** `docs/ROADMAP.md` - Faz 3.6
- **Database Schema:** `docs/database/SCHEMA.md`
- **Books API:** `app/api/books/[id]/route.ts`
- **jsPDF Docs:** https://github.com/parallax/jsPDF
- **Supabase Storage:** `docs/guides/SUPABASE_MIGRATION_GUIDE.md`

---

**Son Güncelleme:** 10 Ocak 2026  
**Durum:** 📋 Plan Hazır - Implementasyona Başlanabilir  
**Sonraki Adım:** Dependencies kurulumu

