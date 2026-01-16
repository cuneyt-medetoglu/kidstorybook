# PDF Generation Test Rehberi

**Versiyon:** 2.0  
**Tarih:** 17 Ocak 2026  
**Test Edilen Özellikler:** A4 Landscape, Double-Page Spread, Alternatif Layout

---

## Test Senaryosu

### Ön Hazırlık

1. **Development Server Başlatma**
   ```bash
   npm run dev
   ```

2. **Login**
   - http://localhost:3000 adresine git
   - Mevcut hesapla giriş yap

3. **Dashboard**
   - http://localhost:3000/dashboard adresine git
   - Mevcut kitaplardan birini seç (veya yeni kitap oluştur)

---

## Test Adımları

### Test 1: PDF Generation

1. **PDF İndir Butonu**
   - Dashboard'da bir kitabın üzerine gel
   - "Download PDF" butonuna tıkla
   - Loading state'i görünmeli

2. **PDF İndirme**
   - PDF otomatik olarak indirilmeli
   - Dosya adı: `{book_id}.pdf`
   - Dosya boyutu: ~2-3 MB (10 sayfalık kitap için)

3. **Beklenen Süre**
   - 10 sayfalık kitap: ~15-20 saniye
   - İlk generation: Daha uzun (cache yok)
   - İkinci generation: Hızlı (cache'den)

---

### Test 2: PDF Format Kontrolü

PDF dosyasını aç ve şunları kontrol et:

#### 1. Sayfa Formatı
- ✅ A4 Landscape (yatay)
- ✅ Her PDF sayfasında 2 içerik sayfası (sol ve sağ)
- ✅ Sayfa boyutu: 297mm x 210mm

#### 2. Cover Page
- ✅ İlk sayfa: Cover image (tam sayfa)
- ✅ Kitap başlığı cover'ın altında
- ✅ Theme ve style metadata görünüyor mu?
- ✅ Arka plan deseni var mı?

#### 3. İçerik Sayfaları
- ✅ Sayfa 1: Sol = Görsel, Sağ = Metin
- ✅ Sayfa 2: Sol = Metin, Sağ = Görsel
- ✅ Sayfa 3: Sol = Görsel, Sağ = Metin
- ✅ Pattern devam ediyor mu?

#### 4. Görsel Kalitesi
- ✅ Görseller net mi?
- ✅ Görseller bozulmuş mu? (aspect ratio kontrol)
- ✅ Görseller ortalanmış mı?
- ✅ Görseller tam sayfa kaplayıp taşmıyor mu?

#### 5. Metin Kalitesi
- ✅ Metin okunabilir mi?
- ✅ Font boyutu uygun mu? (14pt)
- ✅ Satır aralığı uygun mu? (1.5x)
- ✅ Metin wrap çalışıyor mu?
- ✅ Metin taşmıyor mu?

#### 6. Arka Plan
- ✅ Arka plan deseni görünüyor mu?
- ✅ Desen hafif mi (metin okunabilir mi)?
- ✅ Her iki sayfada da desen var mı?

#### 7. Sayfa Numaraları
- ✅ **Sadece metin sayfalarında** numara var mı?
- ✅ Görsel sayfalarında numara YOK mu?
- ✅ Numaralar doğru sırada mı? (1, 2, 3...)
- ✅ Numaralar alt ortada mı?
- ✅ Numaralar gri renkte mi?

---

### Test 3: Edge Cases

#### 1. Tek Sayfa Kitap
- Kitap 1 sayfaysa:
  - PDF Sayfa 1: Cover
  - PDF Sayfa 2: Sol = Görsel, Sağ = boş

#### 2. Tek Sayılı Sayfa Kitap (3, 5, 7...)
- Son sayfa tek kalırsa:
  - PDF Sayfa N: Sol veya Sağ dolu, diğer taraf boş

#### 3. Görsel Yüklenmeyen Sayfa
- Görsel URL geçersizse:
  - Placeholder görünmeli ("Image unavailable")
  - Gri arka plan
  - Metin ortalı

#### 4. Uzun Metin
- Metin overflow olursa:
  - Metin kesilmeli (max lines)
  - Sayfa taşmamalı

---

### Test 4: Performans

1. **Generation Süresi**
   - Console log'lara bak
   - `[PDF Generation] PDF generation completed in X ms`
   - Beklenen: 15000-20000ms (15-20 saniye)

2. **PDF Dosya Boyutu**
   - 10 sayfa: ~2-3 MB
   - 5 sayfa: ~1-1.5 MB
   - 20 sayfa: ~4-5 MB

3. **Cache Kontrolü**
   - Aynı PDF'i tekrar indir
   - İkinci indirme çok hızlı olmalı (<1 saniye)
   - Response'da `cached: true` olmalı

---

### Test 5: API Response

Browser Console'da Network tab'ı aç:

```json
POST /api/books/{id}/generate-pdf

Response:
{
  "success": true,
  "data": {
    "pdfUrl": "https://...supabase.co/.../book.pdf",
    "pdfPath": "user_id/books/book_id/filename.pdf",
    "cached": false
  },
  "message": "PDF generated successfully",
  "meta": {
    "generationTime": 15234,
    "pdfSize": 2456789
  }
}
```

---

## Hata Senaryoları

### Senaryo 1: Görsel İndirilemedi
**Hata:** `[PDF Generator] Error downloading image`

**Çözüm:**
- Görsel URL'sini kontrol et
- Supabase Storage permissions kontrolü
- Placeholder gösterilmeli

### Senaryo 2: Arka Plan Yüklenemedi
**Hata:** `[PDF Generator] Could not load background pattern`

**Çözüm:**
- `public/pdf-backgrounds/default-pattern.svg` var mı?
- Fallback: Krem rengi arka plan (#FFFEF8)

### Senaryo 3: PDF Upload Hatası
**Hata:** `Failed to upload PDF to storage`

**Çözüm:**
- Supabase Storage bucket'ı kontrol et
- `book-images` bucket'ı var mı?
- PDF MIME type allowed mı? (migration 008)

### Senaryo 4: Font Hatası
**Hata:** Font render hatası

**Çözüm:**
- jsPDF default font'ları kullan (Helvetica)
- Font boyutunu kontrol et

---

## Başarı Kriterleri

✅ PDF indirildi  
✅ A4 Landscape format  
✅ Double-page spread çalışıyor  
✅ Alternatif görsel-metin layout  
✅ Görseller bozulmadan yerleştirilmiş  
✅ Metin okunabilir  
✅ Arka plan deseni görünüyor  
✅ Sayfa numaraları sadece metin sayfalarında  
✅ Cover page düzgün görünüyor  
✅ Generation süresi makul (<30 saniye)  
✅ Cache çalışıyor  

---

## Karşılaştırma: Eski vs Yeni

### Eski Format (v1.0)
- ❌ A4 Portrait (dikey)
- ❌ Her PDF sayfası = 1 içerik sayfası
- ❌ Görsel üstte, metin altta
- ❌ Sayfa numaraları her sayfada
- ❌ Arka plan yok

### Yeni Format (v2.0)
- ✅ A4 Landscape (yatay)
- ✅ Her PDF sayfası = 2 içerik sayfası (kitap formatı)
- ✅ Alternatif görsel-metin layout
- ✅ Sayfa numaraları sadece metin sayfalarında
- ✅ Pastel arka plan deseni

---

## Debug Komutları

### Console Log'ları

```bash
# Server terminal'de göreceklerin:
[PDF Generation] Preparing PDF generation:
[PDF Generation] - Book ID: ...
[PDF Generation] - Title: ...
[PDF Generation] - Total Pages: 10
[PDF Generation] - Cover Image: Yes

[PDF Generation] Generating PDF...
[PDF Generation] PDF generated successfully
[PDF Generation] - PDF Size: 2456.78 KB

[PDF Generation] Uploading PDF to Supabase Storage: ...
[PDF Generation] PDF uploaded successfully: ...
[PDF Generation] PDF generation completed in 15234 ms
```

### Database Kontrolü

```sql
-- PDF URL ve path kontrolü
SELECT id, title, pdf_url, pdf_path, created_at
FROM books
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC;
```

### Storage Kontrolü

Supabase Dashboard → Storage → book-images:
- `{user_id}/books/{book_id}/{filename}.pdf`

---

## Bilinen Sorunlar ve Sınırlamalar

1. **Custom Font:** jsPDF custom font desteği karmaşık (TTF gerekir)
   - Şimdilik: Helvetica (default)
   - Gelecek: Google Fonts entegrasyonu

2. **SVG Rendering:** jsPDF SVG desteği sınırlı
   - Çözüm: SVG → base64 conversion
   - Fallback: Düz renk arka plan

3. **Memory:** Büyük görseller memory kullanır
   - 10+ sayfa: ~100-200MB RAM
   - 50+ sayfa: Dikkatli olunmalı

4. **Generation Time:** Görsel sayısına bağlı
   - 10 sayfa: ~15-20 saniye
   - 20 sayfa: ~30-40 saniye
   - Optimize edilebilir (parallel processing)

---

## Sonraki Adımlar

Test başarılıysa:
1. ✅ Tüm checklist maddelerini işaretle
2. ✅ ROADMAP'ı güncelle (Faz 5.7.1 tamamlandı)
3. ✅ Kullanıcılara duyuru yap (changelog)
4. ⏳ Feedback topla
5. ⏳ İyileştirmeler planla (Faz 5.7.4)

---

**Son Güncelleme:** 17 Ocak 2026  
**Test Eden:** -  
**Test Durumu:** Bekliyor
