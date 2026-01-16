# PDF Generation Guide

**Versiyon:** 3.0 (Puppeteer + HTML/CSS)  
**Tarih:** 17 Ocak 2026  
**Durum:** Aktif  
**Teknoloji:** Puppeteer + HTML/CSS Template

---

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Teknoloji Stack](#teknoloji-stack)
3. [PDF Format ve Layout](#pdf-format-ve-layout)
4. [Template Yapısı](#template-yapısı)
5. [API Kullanımı](#api-kullanımı)
6. [Geliştirme ve Test](#geliştirme-ve-test)
7. [Gelecek İyileştirmeler](#gelecek-i̇yileştirmeler)

---

## Genel Bakış

KidStoryBook PDF generation sistemi, çocuk kitaplarını profesyonel bir formatta indirilebilir PDF'lere dönüştürür. Sistem, **Puppeteer + HTML/CSS Template** yaklaşımını kullanarak yüksek kaliteli PDF'ler oluşturur.

### Özellikler

✅ A4 landscape format (297mm x 210mm)  
✅ Double-page spread (her PDF sayfasında 2 içerik sayfası)  
✅ Alternatif görsel-metin düzeni  
✅ 1024x1536 görseller aspect ratio korunarak yerleştirilir  
✅ Çocuklara uygun font ve tipografi (16pt, 1.6 line height)  
✅ CSS ile arka plan desenleri  
✅ Sayfa numaraları sadece metin sayfalarında  
✅ HTML/CSS ile tam layout kontrolü  
✅ Web font desteği (gelecek)  

---

## Teknoloji Stack

### Kullanılan Teknolojiler

- **Puppeteer:** HTML/CSS'den PDF oluşturma (Chromium rendering)
- **HTML/CSS:** Template tabanlı PDF tasarımı
- **TypeScript:** Type safety
- **Node.js:** Server-side PDF generation

### Neden Puppeteer?

**Önceki Yaklaşım (jsPDF):**
- ❌ Manuel layout kontrolü zor
- ❌ Font rendering sorunları
- ❌ SVG desteği sınırlı
- ❌ Text positioning karmaşık
- ❌ Görsel kalitesi düşük

**Yeni Yaklaşım (Puppeteer):**
- ✅ HTML/CSS ile kolay layout kontrolü
- ✅ Web font desteği
- ✅ SVG ve görseller sorunsuz
- ✅ Responsive ve esnek tasarım
- ✅ Yüksek kaliteli render
- ✅ Örnek PDF'lere benzer sonuç

---

## PDF Format ve Layout

### Sayfa Boyutları

```
PDF Sayfası: A4 Landscape
- Genişlik: 297mm
- Yükseklik: 210mm

İçerik Sayfası (Her yarı): A5 equivalent
- Genişlik: 148.5mm (50% of A4 landscape)
- Yükseklik: 210mm
- Margin: 10mm
- İçerik Alanı: 128.5mm x 190mm
```

### Layout Pattern

PDF'deki her sayfa, 2 içerik sayfasını yan yana gösterir. Görsel ve metin alternating pattern ile yerleşir:

```
PDF Sayfa 1: [COVER IMAGE - Full Spread]

PDF Sayfa 2 (Spread 0): [Image | Text]  ← Sayfa 0 ve 1
PDF Sayfa 3 (Spread 1): [Text | Image]  ← Sayfa 2 ve 3
PDF Sayfa 4 (Spread 2): [Image | Text]  ← Sayfa 4 ve 5
PDF Sayfa 5 (Spread 3): [Text | Image]  ← Sayfa 6 ve 7
...
```

**Pattern Mantığı:**
- **Spread index 0, 2, 4...** (çift sayılar): Sol = Görsel, Sağ = Metin
- **Spread index 1, 3, 5...** (tek sayılar): Sol = Metin, Sağ = Görsel

Bu pattern, kitap açıldığında her zaman bir tarafta görsel, diğer tarafta metin olmasını sağlar.

---

## Template Yapısı

### Dosya Yapısı

```
lib/pdf/
├── generator.ts              # Ana PDF generation logic
├── templates/
│   ├── book-template.html    # HTML template (eski, artık kullanılmıyor)
│   └── book-styles.css       # CSS styles (kullanılıyor)
└── generator.old.ts.bak      # Eski jsPDF generator (backup)
```

### HTML Generation

PDF generator, sayfa verilerinden dinamik HTML oluşturur:

```typescript
// Cover page
<div class="page cover-page">
  <div class="cover-container">
    <img src="..." class="cover-image" />
    <h1 class="cover-title">Title</h1>
  </div>
</div>

// Spread pages
<div class="page spread-page">
  <div class="spread-container">
    <div class="half-page image-page">
      <img src="..." class="page-image" />
    </div>
    <div class="half-page text-page">
      <div class="text-content">
        <div class="page-text">Text content...</div>
        <span class="page-number">2</span>
      </div>
    </div>
  </div>
</div>
```

### CSS Styling

**Sayfa Formatı (@page):**
```css
@page {
  size: A4 landscape;
  margin: 0;
}
```

**Arka Plan Pattern:**
```css
.spread-page::before {
  background-image: radial-gradient(...);
  /* Pastel dot pattern */
}
```

**Typography:**
```css
.page-text {
  font-size: 16pt;
  line-height: 1.6;
  color: #1a1a1a;
}
```

---

## API Kullanımı

### Endpoint

```
POST /api/books/[id]/generate-pdf
```

### Request

```typescript
// Headers
Authorization: Bearer <supabase_token>

// No body required - book data fetched from database
```

### Response

```typescript
{
  "success": true,
  "data": {
    "pdfUrl": "https://...supabase.co/.../book.pdf",
    "pdfPath": "user_id/books/book_id/book_title_timestamp.pdf",
    "cached": false
  },
  "message": "PDF generated successfully",
  "meta": {
    "generationTime": 15234, // milliseconds
    "pdfSize": 2456789 // bytes
  }
}
```

### PDF Generation Flow

```mermaid
graph LR
    A[Client Request] --> B[Auth Check]
    B --> C[Fetch Book Data]
    C --> D[Check Cache]
    D -->|Exists| E[Return Cached PDF]
    D -->|Not Exists| F[Generate HTML]
    F --> G[Puppeteer Launch]
    G --> H[Load HTML/CSS]
    H --> I[Render PDF]
    I --> J[Upload to Storage]
    J --> K[Update Database]
    K --> L[Return PDF URL]
```

---

## Kod Yapısı

### Ana Dosya: `lib/pdf/generator.ts`

```typescript
// Main function
generateBookPDF(options: PDFOptions): Promise<Buffer>

// Helper functions
generateHTML(options, spreads): string
generateCoverHTML(options): string
generateSpreadHTML(spread): string
prepareSpreads(pages): SpreadData[]
formatText(text): string
escapeHtml(text): string
```

### PDFOptions Interface

```typescript
interface PDFOptions {
  title: string
  coverImageUrl?: string
  coverImageBuffer?: ArrayBuffer
  pages: PageData[]
  theme?: string
  illustrationStyle?: string
}

interface PageData {
  pageNumber: number
  text: string
  imageUrl?: string
  imageBuffer?: ArrayBuffer
}
```

### Puppeteer Configuration

```typescript
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const pdfBuffer = await page.pdf({
  format: 'A4',
  landscape: true,
  printBackground: true,
  margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  preferCSSPageSize: true,
})
```

---

## Geliştirme ve Test

### Local Development

1. **Template Değişiklikleri:**
   - `lib/pdf/templates/book-styles.css` dosyasını düzenle
   - CSS değişiklikleri anında yansır (Puppeteer HTML'den okuyor)

2. **Layout Testi:**
   - Test kitabı ile PDF oluştur
   - PDF'i aç ve layout'u kontrol et

3. **Debug:**
   - HTML'i konsola yazdır: `console.log(html)`
   - HTML'i dosyaya kaydet (debug için)

### Performans

**Ortalama Generation Time:**
- 5 sayfalık kitap: ~5-7 saniye
- 10 sayfalık kitap: ~10-15 saniye
- 20 sayfalık kitap: ~20-30 saniye

**PDF Dosya Boyutu:**
- 5 sayfa: ~2-3 MB
- 10 sayfa: ~4-6 MB
- 20 sayfa: ~8-12 MB

**Optimizasyon:**
- Puppeteer browser reuse (gelecek)
- Image compression (CSS ile)
- Parallel processing (gelecek)

---

## Gelecek İyileştirmeler

### Planlanan Özellikler

1. **Web Font Support**
   - Google Fonts entegrasyonu
   - Çocuk dostu fontlar (Nunito, Comic Neue, Quicksand)
   - Font subsetting (boyut optimizasyonu)

2. **Template Customization**
   - Kullanıcı template seçimi
   - Tema bazlı template'ler
   - Arka plan deseni seçenekleri

3. **PDF Preview** (Faz 5.7.2)
   - İndirmeden önce önizleme
   - Thumbnail'ler
   - Sayfa navigasyonu

4. **PDF Customization** (Faz 5.7.3)
   - Farklı sayfa boyutları (Letter, Square)
   - Farklı layout seçenekleri
   - Sayfa numarası stil seçenekleri

5. **Performance İyileştirmeleri**
   - Browser pool (Puppeteer reuse)
   - Image lazy loading
   - Progressive PDF generation
   - Background job processing

---

## Troubleshooting

### Sık Karşılaşılan Sorunlar

**1. Puppeteer Install Hatası**
```
Sorun: Puppeteer Chromium indirme hatası
Çözüm: 
- npm cache temizle: npm cache clean --force
- Puppeteer'ı yeniden kur: npm install puppeteer
- Alternatif: puppeteer-core kullan + external Chromium
```

**2. Görsel Yüklenmiyor**
```
Sorun: PDF'de görseller görünmüyor
Çözüm:
- Görsel URL'sini kontrol et (public URL olmalı)
- CORS ayarlarını kontrol et
- Puppeteer waitUntil: 'networkidle0' kullanıldığını kontrol et
```

**3. Layout Bozuk**
```
Sorun: Sayfa layout'u yanlış
Çözüm:
- CSS @page kurallarını kontrol et
- HTML structure'ı kontrol et
- Browser devtools ile HTML render'ı test et
```

**4. Font Render Hatası**
```
Sorun: Fontlar doğru render olmuyor
Çözüm:
- Web font URL'lerini kontrol et
- Font loading'i wait et
- Fallback fontlar ekle
```

---

## Karşılaştırma: Eski vs Yeni

### Eski Yaklaşım (jsPDF)

| Özellik | Durum |
|---------|-------|
| Layout Kontrolü | ❌ Zor, manuel |
| Font Rendering | ❌ Sorunlu |
| SVG Desteği | ❌ Yok |
| Text Positioning | ❌ Karmaşık |
| Görsel Kalitesi | ❌ Düşük |
| CSS Desteği | ❌ Yok |

### Yeni Yaklaşım (Puppeteer)

| Özellik | Durum |
|---------|-------|
| Layout Kontrolü | ✅ HTML/CSS ile kolay |
| Font Rendering | ✅ Web font desteği |
| SVG Desteği | ✅ Tam destek |
| Text Positioning | ✅ CSS ile kolay |
| Görsel Kalitesi | ✅ Yüksek |
| CSS Desteği | ✅ Tam destek |

---

## Referanslar

- **Puppeteer Dokümantasyonu:** https://pptr.dev/
- **CSS @page Spec:** https://www.w3.org/TR/css-page-3/
- **Supabase Storage:** https://supabase.com/docs/guides/storage

---

**Son Güncelleme:** 17 Ocak 2026  
**Geliştirici:** KidStoryBook Team  
**Versiyon:** 3.0 (Puppeteer + HTML/CSS Template)
