# ✨ Özellik Listesi ve Önceliklendirme
# HeroKidStory Platform

**Doküman Versiyonu:** 2.0  
**Tarih:** 2 Şubat 2026  
**Durum:** AKTİF – Güncel (FAZ 4 çıktısı)

---

## 📖 Kullanım Rehberi

| Soru | Yanıt |
|------|--------|
| **Ne için kullanılır?** | Özellik **önceliklendirme** ve planlama; MVP kararları, hangi özelliğin ne zaman yapılacağı. |
| **ROADMAP ile farkı?** | **ROADMAP:** Ne yapılacak (görev listesi, checkbox’lar). **FEATURES:** Neyin öncelikli olduğu (P0/P1/P2/P3). |
| **Nasıl kullanılır?** | MVP tanımı, özellik seçimi, “önce ne?” kararlarında bu dokümana bak; detaylı iş takibi için [ROADMAP](ROADMAP.md) ve [docs/roadmap/](roadmap/) kullan. |

**Detaylı iş takibi:** [ROADMAP.md](ROADMAP.md) (özet + faz dosyalarına linkler).  
**Tamamlanan özellikler (kronolojik):** [COMPLETED_FEATURES.md](COMPLETED_FEATURES.md).

---

## Öncelik Seviyeleri

- 🔴 **P0 - Critical (MVP için zorunlu):** Bu özellikler olmadan ürün çalışmaz
- 🟡 **P1 - High (MVP'ye dahil edilmeli):** Önemli ama olmadan da çalışır
- 🟢 **P2 - Medium (MVP sonrası):** Faydalı ama bekleyebilir
- ⚪ **P3 - Low (Nice to have):** İleride düşünülecek

**Gösterim:** ✅ = Tamamlandı (mevcut sürümde var).

---

## 1. Kullanıcı ve Hesap Yönetimi

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Kullanıcı kaydı (Email) | 🟡 P1 | ✅ | Email + şifre ile kayıt |
| Google OAuth | 🟢 P2 | ✅ | Google ile giriş |
| Facebook OAuth | ⚪ P3 | ✅ | Facebook ile giriş |
| Instagram OAuth | ⚪ P3 | | Planlanıyor |
| Şifre sıfırlama | 🟡 P1 | ✅ | Email ile şifre recovery |
| Profil yönetimi | 🟡 P1 | ✅ | İsim, email, avatar |
| Kullanıcı dashboard'u | 🟡 P1 | ✅ | Kitaplık, filtreleme, sipariş geçmişi |
| Sipariş geçmişi | 🟡 P1 | ✅ | Geçmiş siparişler ve durumları |

**MVP Kararı:** Email/şifre + OAuth (Google, Facebook) yeterli. Instagram isteğe bağlı.

---

## 2. Karakter Oluşturma ve Kişiselleştirme

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Fotoğraf yükleme | 🔴 P0 | ✅ | Çocuk fotoğrafı upload |
| Fotoğraf önizleme ve kırpma | 🟡 P1 | ✅ | Crop/resize |
| Karakter adı girişi | 🔴 P0 | ✅ | Zorunlu alan |
| Yaş girişi | 🔴 P0 | ✅ | 0-12 yaş arası |
| Cinsiyet seçimi | 🔴 P0 | ✅ | Erkek/Kız/Diğer |
| Saç/göz rengi, fiziksel özellikler | 🟡 P1 | ✅ | Dropdown / checkboxes |
| **5'e kadar karakter** | 🟢 P2 | ✅ | Çoklu karakter (ana/yan) |
| Karakter rolü (ana/yan) | 🟢 P2 | ✅ | Hangisi ana karakter |
| Karakter şablonları | ⚪ P3 | | Fotoğrafsız karakter – Gelecek |

**MVP Kararı:** Multi-character (5 karakter) tamamlandı. Karakter şablonları sonra.

---

## 3. Pet ve Oyuncak Karakterleri

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Pet ekleme | 🟢 P2 | ✅ | Evcil hayvan fotoğrafı ve adı |
| Pet türü / Oyuncak | 🟢 P2 | ✅ | Family, Pets, Other, Toys (AI analiz) |
| Pet/oyuncak hikayede rolü | 🟢 P2 | ✅ | AI hikayeye dahil etme |

**MVP Kararı:** Pet ve oyuncak karakterleri tamamlandı (5 karakter kotası içinde).

---

## 4. Hikaye Oluşturma

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Tema seçimi | 🔴 P0 | ✅ | Ana temalar |
| Alt-tema/konu seçimi | 🔴 P0 | ✅ | Spesifik konular |
| Yaş grubuna uygun içerik | 🔴 P0 | ✅ | 0-2, 3-5, 6-9 yaş grupları |
| Özel istekler text alanı | 🟡 P1 | ✅ | Serbest metin |
| 24 sayfa standart uzunluk | 🔴 P0 | ✅ | Sabit sayfa sayısı |
| Farklı sayfa uzunlukları | ⚪ P3 | | 12, 24, 36 sayfa – Gelecek |
| AI hikaye üretimi | 🔴 P0 | ✅ | GPT-4o ile |
| Hikaye önizleme | 🔴 P0 | ✅ | Satın almadan önce görme |
| **8 dil desteği (hikaye)** | 🔴 P0 | ✅ | TR, EN, DE, FR, ES, ZH, PT, RU |
| Hikaye template'leri | 🟢 P2 | | Hazır iskeletler – Post-MVP |

**MVP Kararı:** 5-7 tema, 20-30 alt tema, özel istekler, AI üretim – tamamlandı.

---

## 5. Görsel Stil ve Tasarım

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Illustration style seçimi | 🔴 P0 | ✅ | Watercolor, 3D, cartoon, vb. |
| Style önizleme | 🟡 P1 | ✅ | Her stil için örnek görsel |
| Font seçimi | 🟡 P1 | | 3-5 font seçeneği – Orta öncelik |
| **Image Edit (mask-based)** | 🟢 P2 | ✅ | ChatGPT-style görsel düzenleme, version history |
| Kapak tasarımı | 🟢 P2 | ✅ | Kapak üretimi, ücretsiz kapak hakkı |
| Renk paleti / Custom logo | ⚪ P3 | | Gelecek |

**MVP Kararı:** 4-6 illustration style tamamlandı. Font seçimi sonra.

---

## 6. E-Book Görüntüleyici

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Flipbook animasyonu | 🔴 P0 | ✅ | Sayfa çevirme efekti |
| İleri/geri navigasyon | 🔴 P0 | ✅ | Ok tuşları, butonlar |
| Sayfa numarası, direkt atlama | 🟡 P1 | ✅ | Sayfa seçici |
| Zoom, tam ekran | 🟡 P1 | ✅ | Fullscreen |
| Mobil swipe desteği | 🔴 P0 | ✅ | Touch gesture'lar |
| **Sesli okuma (TTS)** | 🟢 P2 | ✅ | Text-to-speech |
| **Otomatik oynatma** | 🟢 P2 | ✅ | Slideshow modu |
| PDF indirme | 🔴 P0 | ✅ | Tamamlandı kitaplar için |
| Animasyonlu öğeler | ⚪ P3 | ✅ | Görsel ve animasyonlar |

**MVP Kararı:** react-pageflip, TTS, otomatik oynatma, PDF – tamamlandı. TTS: signed URL, admin config, prewarm, Parent Settings (hız/volume), Audio badge, mute, çocuk UX footer (Şubat 2026).

---

## 7. Kitap Düzenleme

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Metin düzenleme | 🟡 P1 | ✅ | Sayfa metinlerini değiştirme |
| Görsel yeniden üretme / Edit | 🟢 P2 | ✅ | Mask-based edit, version history |
| Sayfa ekleme/silme, sıra değiştirme | ⚪ P3 | | Gelecek |
| Kişisel önsöz | 🟢 P2 | | Post-MVP |

**MVP Kararı:** Metin düzenleme ve görsel edit tamamlandı.

---

## 8. Ödeme ve Satın Alma

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| **Currency detection** | 🟡 P1 | ✅ | IP-based, TRY/USD/EUR/GBP |
| **Sepet sistemi** | 🔴 P0 | ✅ | CartContext, API, /cart, bulk selection |
| **Pricing sayfası** | 🔴 P0 | ✅ | Planlar, E-book vs Basılı, karşılaştırma |
| E-book satın alma | 🔴 P0 | | Stripe/İyzico – Planlanıyor |
| Stripe entegrasyonu | 🔴 P0 | | Kredi kartı – Planlanıyor |
| İyzico entegrasyonu (TR) | 🟡 P1 | | Türkiye ödemeleri – Planlanıyor |
| 3D Secure, sipariş onay, email | 🔴 P0 | | Planlanıyor |
| PDF indirme linki (satın alma sonrası) | 🔴 P0 | ✅ | Dashboard’dan indirme |
| Kupon/indirim kodu | 🟢 P2 | | Post-MVP |

**MVP Kararı:** Currency, sepet, pricing sayfası tamamlandı. Ödeme (Stripe/İyzico) sırada.

---

## 9. Basılı Kitap Sipariş

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Hardcover sipariş | 🟡 P1 | | Planlanıyor |
| Adres, kapak seçimi, miktar | 🟡 P1 | | Planlanıyor |
| Print-on-demand entegrasyonu | 🟡 P1 | | Planlanıyor |
| Kargo takibi, sipariş durumu | 🟡 P1 | | Planlanıyor |

**MVP Kararı:** E-book önce; basılı kitap sonra.

---

## 10. Web Sitesi İçeriği

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Ana Sayfa (Hero, Nasıl Çalışır, FAQ) | 🔴 P0 | ✅ | Landing, örnek kitaplar, kampanya banner |
| **Examples Sayfası** | 🟡 P1 | ✅ | Örnek kitaplar |
| **Pricing Sayfası** | 🔴 P0 | ✅ | Fiyatlandırma, planlar |
| Features / Ideas / Reviews / Help | 🟡 P1 | | Kısmen veya planlanıyor |
| Pricing, Privacy, Terms, KVKK | 🔴 P0 | | Statik sayfalar – Planlanıyor |
| Contact, About | 🟡 P1 | | Planlanıyor |
| For Schools, Blog | 🟢 P2 | | Post-MVP |

**MVP Kararı:** Ana sayfa, Examples, Pricing tamamlandı. Statik sayfalar (Features, Pricing detay, Privacy, Terms, KVKK, Contact) sırada.

---

## 11. Çok Dilli Destek

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| **Hikaye dili (8 dil)** | 🔴 P0 | ✅ | TR, EN, DE, FR, ES, ZH, PT, RU |
| Website UI dili (/tr/, /en/) | 🟡 P1 | | Planlanıyor |
| Dil değiştirici | 🔴 P0 | | Planlanıyor |
| Otomatik dil algılama | 🟢 P2 | | Post-MVP |

**MVP Kararı:** Hikaye 8 dil tamamlandı. Site UI i18n sonra.

---

## 12. SEO ve Marketing

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Meta tags, Open Graph | 🔴 P0 | | Planlanıyor |
| Sitemap.xml, robots.txt | 🟡 P1 | | Planlanıyor |
| Google Analytics | 🟡 P1 | | Planlanıyor |
| Facebook Pixel, Newsletter | 🟢 P2 | | Post-MVP |

---

## 13. Admin Panel

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Sipariş yönetimi | 🔴 P0 | | Planlanıyor |
| Kullanıcı / Kitap yönetimi | 🟡 P1 | | Planlanıyor |
| İstatistikler, dashboard | 🟡 P1 | | Planlanıyor |
| İndirim kodu, email şablonları | 🟢 P2 | | Post-MVP |

---

## 14. Teknik Özellikler

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Responsive tasarım | 🔴 P0 | ✅ | Mobil uyumluluk |
| SSL (HTTPS) | 🔴 P0 | ✅ | Vercel |
| Image optimization | 🟡 P1 | ✅ | Next.js Image |
| Rate limiting | 🟡 P1 | ✅ | API koruması |
| GDPR/KVKK uyumlu | 🔴 P0 | | İçerik planlanıyor |
| PWA | 🟢 P2 | | Post-MVP |

---

## 15. Performans ve Kalite

| Özellik | Öncelik | Durum | Açıklama |
|---------|---------|--------|----------|
| Hikaye üretim süresi < 3 dk | 🔴 P0 | ✅ | Hedef karşılanıyor |
| Sayfa yüklenme < 3 sn | 🔴 P0 | ✅ | Performans |
| Otomatik testing, CI/CD | 🟢 P2 | | Post-MVP |

---

## MVP Özet (Güncel)

### ✅ Tamamlanan (P0/P1)
- Kullanıcı kaydı, giriş, OAuth (Google, Facebook), şifre sıfırlama, profil, kitaplık
- 5 karaktere kadar (çocuk + pet/oyuncak), tema/stil, AI hikaye (24 sayfa, 8 dil)
- E-book görüntüleyici (flipbook, TTS, otomatik oynatma, PDF indirme)
- Image Edit (mask-based), version history
- Currency detection, sepet, pricing sayfası, ücretsiz kapak hakkı
- Ana sayfa, Examples, Pricing sayfası, cookie banner
- Teknik: responsive, HTTPS, rate limiting, image optimization

### 🔴 Sıradaki (MVP için)
- Ödeme: Stripe, İyzico, checkout, sipariş onay, email
- Statik sayfalar: Features, Pricing detay, Privacy, Terms, KVKK, Contact
- Admin: sipariş/kullanıcı/kitap yönetimi (temel)
- SEO: meta tags, sitemap, analytics

### 🟢 Sonra (P2)
- Hardcover, print-on-demand, kargo takibi
- Website UI i18n (/tr/, /en/), dil değiştirici
- PWA, otomatik test, CI/CD

---

**Son Güncelleme:** 2 Şubat 2026  
**Detaylı iş listesi:** [ROADMAP.md](ROADMAP.md) | **Tamamlanan özellikler:** [COMPLETED_FEATURES.md](COMPLETED_FEATURES.md)
