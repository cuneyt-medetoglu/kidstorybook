# 📄 PRD - Teknik Gereksinimler (Detay)

**Kaynak:** PRD.md Bölüm 3  
**Son Güncelleme:** 2 Şubat 2026  
**Amaç:** Ürün gereksinimlerindeki teknik detayları tek yerde toplamak; PRD kısa kalsın.

---

## 3.1 AI Gereksinimleri

### 3.1.1 Hikaye Metni Üretimi
**Production (Aktif):**
- ✅ GPT-4o (OpenAI) - Aktif kullanılan model
- ✅ JSON format çıktısı
- ✅ Yaş grubuna göre özelleştirilmiş prompt'lar
- ✅ 4000 token limit

**Alternatif Modeller (Gelecek):** GPT-4 Turbo, Gemini Pro, Claude 3

### 3.1.2 Görsel Üretimi
**Production (Aktif):**
- ✅ GPT-image-1.5 (OpenAI)
- ✅ 1024x1536 portrait format
- ✅ Reference image (karakter tutarlılığı)
- ✅ Rate limiting: 4 images / 90 saniye (Tier 1)

**Alternatif Modeller (Gelecek):** DALL-E 3, Midjourney, Stable Diffusion XL, Leonardo.ai, Ideogram

### 3.1.3 Karakter Tutarlılığı
- ✅ Reference image (GPT-image-1.5 edits API)
- ✅ Detaylı karakter açıklamaları
- ✅ Kıyafet tutarlılığı (hikaye boyunca aynı kıyafet)
- ✅ Anatomik doğruluk (5 parmak, 2 el vb.)

### 3.1.4 Prompt Yönetimi ve Version Control
- ✅ Semantic versioning (major.minor.patch)
- ✅ Kod-Dokümantasyon sync (`lib/prompts/`, `docs/prompts/`)
- ✅ Changelog ve version tracking
- Dokümantasyon: `docs/prompts/STORY_PROMPT_TEMPLATE.md`, `IMAGE_PROMPT_TEMPLATE.md`

### 3.1.5 Prompt Kalite İyileştirme
**Story:** Word count (yaş gruplarına göre), diyalog/detay direktifleri, writing style, page structure, tema-uyumlu kıyafet.  
**Image:** Cinematic composition, 3-level environment, clothing consistency, anatomical error prevention (100+ negative prompts), logical/pose error prevention.  
**Süreç:** Kullanıcı feedback → prompt iyileştirme; log sistemi.

### 3.1.6 Prompt Monitoring ve Logging
- Story word count analizi, theme & clothing kontrolü, image clothing directive kontrolü, formal wear warning.

---

## 3.2 E-Book Teknolojisi
- [x] PDF generation (A4 landscape, double-page spread)
- [x] Flipbook library
- [x] Responsive tasarım
- [x] Supabase Storage + indirme linki

---

## 3.3 Performans Gereksinimleri
- [ ] Hikaye üretim: Maks 2-3 dk
- [ ] Görsel başına: 30-60 sn
- [ ] Sayfa yüklenme: < 3 sn
- [ ] Mobil optimize

---

## 3.4 Güvenlik ve Gizlilik
- [ ] GDPR / KVKK uyumlu
- [ ] Çocuk fotoğrafları şifreli saklama
- [ ] Kullanıcı verisi silme hakkı
- [ ] SSL, secure payment gateway

---

## 3.5 Operasyonel Yapılandırma (Debug / Feature Flags)
**Amaç:** Test ortamında ödemesiz kitap oluşturma; admin dashboard sadece yetkili kullanıcıda.

**Config:** `lib/config.ts` → `skipPaymentForCreateBook`, `showAdminDashboard`. Env: `DEBUG_SKIP_PAYMENT`. Yetki: DB'deki admin rolü. Production'da DEBUG kapalı; yetki her zaman server-side.

**Referans:** `docs/strategies/DEBUG_AND_FEATURE_FLAGS_ANALYSIS.md`
