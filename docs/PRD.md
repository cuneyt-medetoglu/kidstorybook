# 📄 Product Requirements Document (PRD)
# HeroKidStory Platform

**Versiyon:** 1.6  
**Tarih:** 21 Aralık 2025  
**Son Güncelleme:** 9 Şubat 2026  
**Durum:** TASLAK – FAZ 3 (MVP hazır; Multi-character, TTS, Currency, Cart, Image Edit, 8 dil, PDF, Debug/Feature Flags; TTS/viewer: signed URL, admin config, prewarm, Parent Settings read-aloud, Audio badge, mute, child UX footer)

> **Kısa PRD:** Teknik detaylar → [PRD Teknik Gereksinimler](technical/PRD_TECHNICAL_DETAILS.md). Tamamlanan özellikler → [COMPLETED_FEATURES.md](COMPLETED_FEATURES.md).

---

## 1. Executive Summary

### 1.1 Ürün Vizyonu
HeroKidStory, ebeveynlerin çocuklarının fotoğraflarını kullanarak AI destekli, kişiselleştirilmiş çocuk hikaye kitapları oluşturduğu bir SaaS platformudur.

### 1.2 Problem
- Ebeveynler özel ve anlamlı hediyeler arıyor; mevcut kitaplar generic.
- Özel kitap hazırlatmak pahalı ve zaman alıcı.
- Çocuklar kendilerini hikayenin kahramanı olarak görmek istiyor.

### 1.3 Çözüm
AI ile kullanıcı dostu arayüzden dakikalar içinde kişiselleştirilmiş, profesyonel kalitede çocuk hikaye kitapları.

### 1.4 Hedef Kitle
**Birincil:** 2–10 yaş çocuğu olan ebeveynler; TR ve EN pazarlar.  
**İkincil:** Anaokulları/kreşler (toplu sipariş), büyükanne/büyükbaba, hediye amaçlı alıcılar.

---

## 2. Ürün Özellikleri ve Gereksinimler

### 2.0 Kullanıcı ve Kimlik Doğrulama
- [x] Email + şifre, email doğrulama, şifre sıfırlama, profil, hesap silme ✅
- [x] Google ve Facebook OAuth ✅ | [ ] Instagram – Planlanıyor
- [x] Kullanıcı kitaplığı: grid/liste, filtreleme, sıralama, arama, kitap aksiyonları, hardcopy bulk satın alma ✅

**Kitap durumları:** Taslak, İşleniyor, Tamamlandı, Arşivlendi.

### 2.1 Core (MVP)
- **Karakter:** [x] Fotoğraf (5MB, JPG/PNG), ad/yaş/cinsiyet, saç/göz, fiziksel özellikler, **5 karaktere kadar**, ana/yan karakter ✅
- **Hikaye:** [x] Tema, alt-tema, yaş grubu (0–2, 3–5, 6–9), **24 sayfa**, özel istekler, **8 dil** (TR, EN, DE, FR, ES, ZH, PT, RU) ✅
- **Görsel stil:** [x] Watercolor, 3D, Cartoon, Realistic, Minimalist, Vintage Storybook ✅
- **Font:** [ ] 3–5 font seçeneği, önizleme – Orta öncelik
- **E-Book görüntüleyici:** [x] Flipbook, mobil/desktop, metin+görsel sayfalar, navigasyon, zoom, tam ekran, PDF indirme, **TTS**, otomatik oynatma ✅
- **Kitap başlığı:** [ ] AI önerisi + manuel – Orta
- **Kişisel önsöz:** [ ] Post-MVP
- **Düzenleme:** [x] Metin düzenleme, versioning; görsel revize (1 ücretsiz/satın alım), ChatGPT-style mask-based edit, version history/revert ✅

### 2.2 Pet ve Oyuncak Karakterleri
- [x] Evcil hayvan/oyuncak fotoğrafı, hikayede rol, 5 karakter kotası içinde, AI analiz (Family/Pets/Other/Toys) ✅

### 2.3 Ödeme ve Fiyatlandırma
- **Ücretsiz kapak:** [x] Yeni üyeye 1 adet, sadece kapak, hesapta gösterim ✅
- **Fiyatlandırma:** Planlar (10/15/20 sayfa + Özel); E-book vs Basılı; referans fiyatlar PRD teknik detayda.
- **Ödeme:** [ ] Stripe/İyzico, 3D Secure – Planlanıyor
- **Currency detection:** [x] IP-based, Vercel header, fallback, TRY/USD/EUR/GBP ✅
- **Sepet:** [x] CartContext, API, `/cart`, My Library bulk selection, rate limiting ✅

### 2.4 Web Sitesi Sayfaları
- **Ana sayfa:** [ ] Hero, Nasıl Çalışır, örnek kitaplar, testimonials, features/pricing özeti, FAQ, footer
- **Features / Ideas / Reviews / Help:** [ ] Planlanıyor veya kısmen
- **Examples:** [x] Örnek kitaplar, önizleme, Create Your Own from Example ✅
- **Pricing:** [x] Planlar, E-book vs Basılı, paket fiyatları, karşılaştırma tablosu, kurumsal, currency entegrasyonu ✅
- **For Schools:** [ ] Post-MVP

### 2.5 Çok Dilli Destek (i18n)
- [x] 8 dil (TR, EN, DE, FR, ES, ZH, PT, RU); hikaye dili seçimi; prompt dil talimatları ✅
- [ ] URL `/tr/`, `/en/`, dil değiştirici, website UI dili – Planlanıyor

### 2.6 Checkout ve Sipariş
- **E-Book:** [x] Oluştur → Önizleme → Satın Al butonu; [ ] Ödeme sayfası, email ile gönderim – Planlanıyor; [x] Dashboard’dan indirme ✅
- **Basılı:** [x] Sepet, bulk selection; [ ] Adres, kapak seçimi, kargo, ödeme, Print-on-Demand – Planlanıyor

---

## 3. Teknik Gereksinimler (Özet)

- **AI:** GPT-4o (hikaye), GPT-image-1.5 (görsel); prompt versioning ve kalite süreçleri aktif.
- **E-Book:** PDF (A4 landscape), flipbook, AWS S3 storage, indirme linki.
- **Performans:** Hikaye &lt; 3 dk, görsel 30–60 sn, sayfa &lt; 3 sn hedefleniyor.
- **Güvenlik:** GDPR/KVKK, çocuk fotoğrafı şifreleme, veri silme hakkı hedefleniyor.
- **Debug/Feature Flags:** `lib/config.ts` + `DEBUG_SKIP_PAYMENT`; admin rolü ile test ortamında ödemesiz kitap.
- **Deployment:** Production AWS EC2 (Faz 5.5); ilerleme: `docs/implementation/FAZ5_5_IMPLEMENTATION.md`, kapsam: `docs/analysis/DEPLOYMENT_SERVER_ANALYSIS.md`.

**Detay:** [PRD Teknik Gereksinimler](technical/PRD_TECHNICAL_DETAILS.md)

---

## 4. Kullanıcı Deneyimi (UX)
- [ ] Responsive (mobil, tablet, desktop)
- [ ] Erişilebilirlik (WCAG 2.1 AA, klavye, screen reader, alt text)
- [ ] Tasarım sistemi (renk paleti, typography, icon, component library)

---

## 5. Başarı Metrikleri (KPI)
- MAU 100+, E-book dönüşüm %15+, E-book→basılı %30+, Memnuniyet 4.5+/5, NPS 50+

---

## 6. Out of Scope (MVP Dışı)
Mobil uygulama, video hikayeler, kullanıcı yorumları (başlangıç), affiliate, hediye kartları, abonelik, gelişmiş hikaye editörü, topluluk. *(TTS MVP’ye eklendi.)*

---

## 7. Riskler ve Varsayımlar
**Riskler:** AI maliyeti, karakter tutarlılığı, baskı kalitesi, yasal (çocuk fotoğrafı), rekabet.  
**Varsayımlar:** Ebeveynler AI içerik için ödemeye razı; AI yeterince olgun; PoD kaliteli ve hızlı; 2 saat teslimat kabul edilebilir.

---

## 8. Referanslar
- https://magicalchildrensbook.com/
- https://magicalchildrensbook.com/features
- https://magicalchildrensbook.com/idea/toes-and-fingers-adventure

---

## 9. Versiyon Özeti (Son Değişiklikler)

1. **9 Şubat 2026:** TTS ve e-book viewer iyileştirmeleri: signed URL (S3 erişim), admin TTS config (ses/ton/dil), kitap tamamlanınca TTS prewarm, Parent Settings’te sesli okuma ayarları (hız, volume), dashboard’da “Audio” badge, okuyucuda mute, çocuk UX (44px dokunmatik, basınca animasyon). Ref: `docs/analysis/TTS_GOOGLE_GEMINI_ANALYSIS.md`
2. **29 Ocak 2026:** Debug/Feature Flags (PRD 3.5)
3. **25 Ocak 2026:** Multi-character, Pet/Toys, Currency, Sepet, Pricing sayfası, TTS, Rate limiting
4. **24 Ocak 2026:** 8 dil, dil talimatları
5. **17 Ocak 2026:** Image Edit (mask-based), version history/revert
6. **15 Ocak 2026:** Prompt versioning, kalite iyileştirme, log/monitoring

**Tüm tamamlanan özellikler:** [COMPLETED_FEATURES.md](COMPLETED_FEATURES.md)

---

**Doküman Sahibi:** Proje Ekibi  
**Son Güncelleme:** 9 Şubat 2026
