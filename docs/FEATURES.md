# ✨ Özellik Listesi ve Önceliklendirme
# KidStoryBook Platform

**Doküman Versiyonu:** 1.0  
**Tarih:** 21 Aralık 2025  
**Durum:** Planlama

---

## Öncelik Seviyeleri

- 🔴 **P0 - Critical (MVP için zorunlu):** Bu özellikler olmadan ürün çalışmaz
- 🟡 **P1 - High (MVP'ye dahil edilmeli):** Önemli ama olmadan da çalışır
- 🟢 **P2 - Medium (MVP sonrası):** Faydalı ama bekleyebilir
- ⚪ **P3 - Low (Nice to have):** İleride düşünülecek

---

## 1. Kullanıcı ve Hesap Yönetimi

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Kullanıcı kaydı (Email) | 🟡 P1 | Email + şifre ile kayıt | MVP |
| Google OAuth | 🟢 P2 | Google ile giriş | Post-MVP |
| Facebook OAuth | ⚪ P3 | Facebook ile giriş | Gelecek |
| Şifre sıfırlama | 🟡 P1 | Email ile şifre recovery | MVP |
| Profil yönetimi | 🟡 P1 | İsim, email, avatar | MVP |
| Kullanıcı dashboard'u | 🟡 P1 | Oluşturulan kitapları görme | MVP |
| Sipariş geçmişi | 🟡 P1 | Geçmiş siparişler ve durumları | MVP |

**MVP Kararı:** Basit email/şifre authentication yeterli. OAuth isteğe bağlı.

---

## 2. Karakter Oluşturma ve Kişiselleştirme

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Fotoğraf yükleme | 🔴 P0 | Çocuk fotoğrafı upload | MVP |
| Fotoğraf önizleme ve kırpma | 🟡 P1 | Crop/resize özelliği | MVP |
| Karakter adı girişi | 🔴 P0 | Zorunlu alan | MVP |
| Yaş girişi | 🔴 P0 | 0-12 yaş arası | MVP |
| Cinsiyet seçimi | 🔴 P0 | Erkek/Kız/Diğer | MVP |
| Saç rengi seçimi | 🟡 P1 | Dropdown veya color picker | MVP |
| Göz rengi seçimi | 🟡 P1 | Dropdown | MVP |
| Fiziksel özellikler (gözlük, vb.) | 🟡 P1 | Multi-select checkboxes | MVP |
| 5'e kadar karakter | 🟢 P2 | Çoklu karakter desteği | Post-MVP |
| Karakter rolü (ana/yan) | 🟢 P2 | Hangisi ana karakter | Post-MVP |
| Karakter şablonları | ⚪ P3 | Fotoğrafsız karakter yaratma | Gelecek |

**MVP Kararı:** 1 ana karakter ile başla. Multi-character desteği sonra eklenebilir.

---

## 3. Pet ve Oyuncak Karakterleri

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Pet ekleme | 🟢 P2 | Evcil hayvan fotoğrafı ve adı | Post-MVP |
| Pet türü seçimi | 🟢 P2 | Köpek, kedi, tavşan, vb. | Post-MVP |
| Oyuncak/peluş ekleme | 🟢 P2 | Oyuncak tanımı ve fotoğrafı | Post-MVP |
| Pet/oyuncak hikayede rolü | 🟢 P2 | AI hikayeye dahil etme | Post-MVP |

**MVP Kararı:** MVP'de değil. V1.1'de eklenebilir.

---

## 4. Hikaye Oluşturma

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Tema seçimi | 🔴 P0 | Ana temalar (macera, peri masalı, vb.) | MVP |
| Alt-tema/konu seçimi | 🔴 P0 | Spesifik konular (dinozor, uzay, vb.) | MVP |
| Yaş grubuna uygun içerik | 🔴 P0 | 0-2, 3-5, 6-9 yaş grupları | MVP |
| Özel istekler text alanı | 🟡 P1 | Serbest metin girişi | MVP |
| 24 sayfa standart uzunluk | 🔴 P0 | Sabit sayfa sayısı | MVP |
| Farklı sayfa uzunlukları | ⚪ P3 | 12, 24, 36 sayfa seçenekleri | Gelecek |
| AI hikaye üretimi | 🔴 P0 | GPT-4o ile | MVP |
| Hikaye önizleme | 🔴 P0 | Satın almadan önce görme | MVP |
| Hikaye başlığı önerisi | 🟡 P1 | AI önerisi + manuel düzenleme | MVP |
| Manuel başlık girişi | 🟡 P1 | Kullanıcı kendi başlığını yazar | MVP |
| Hikaye template'leri | 🟢 P2 | Hazır hikaye iskeletleri | Post-MVP |
| İnteraktif hikaye seçenekleri | ⚪ P3 | "Macera A mı B mi olsun?" | Gelecek |

**MVP Kararı:** 
- 5-7 ana tema
- 20-30 alt tema
- Özel istekler serbest text
- AI otomatik üretim

---

## 5. Görsel Stil ve Tasarım

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Illustration style seçimi | 🔴 P0 | Watercolor, 3D, cartoon, vb. | MVP |
| Style önizleme | 🟡 P1 | Her stil için örnek görsel | MVP |
| Font seçimi | 🟡 P1 | 3-5 font seçeneği | MVP |
| Font önizleme | 🟡 P1 | Font'u görerek seçme | MVP |
| Renk paleti seçimi | 🟢 P2 | Hikayenin renk tonları | Post-MVP |
| Kapak tasarımı seçimi | 🟢 P2 | Farklı kapak layout'ları | Post-MVP |
| Custom logo/isim ekleme | ⚪ P3 | Kendi logonu ekle | Gelecek |

**MVP Kararı:**
- 4-6 illustration style (MVP için)
- 3-4 font seçeneği
- Renk paleti sabit (AI otomatik seçsin)

---

## 6. E-Book Görüntüleyici

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Flipbook animasyonu | 🔴 P0 | Sayfa çevirme efekti | MVP |
| İleri/geri navigasyon | 🔴 P0 | Ok tuşları, butonlar | MVP |
| Sayfa numarası gösterimi | 🟡 P1 | "4 / 30" şeklinde | MVP |
| Direkt sayfa atlama | 🟡 P1 | Sayfa seçici | MVP |
| Zoom in/out | 🟢 P2 | Görselleri büyütme | Post-MVP |
| Tam ekran modu | 🟡 P1 | Fullscreen | MVP |
| Mobil swipe desteği | 🔴 P0 | Touch gesture'lar | MVP |
| Klavye kısayolları | 🟢 P2 | Arrow keys, space | Post-MVP |
| Otomatik oynatma | ⚪ P3 | Slideshow modu | Gelecek |
| Sesli okuma | ⚪ P3 | Text-to-speech | Gelecek |
| Animasyonlu öğeler | ⚪ P3 | İnteraktif elementler | Gelecek |

**MVP Kararı:**
- react-pageflip library
- Temel navigasyon
- Responsive (mobil + desktop)

---

## 7. Kitap Düzenleme

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Metin düzenleme | 🟡 P1 | Sayfa metinlerini değiştirme | MVP |
| Görsel yeniden üretme | 🟢 P2 | "Bu görseli değiştir" butonu | Post-MVP |
| Sayfa ekleme/silme | ⚪ P3 | Dinamik sayfa yönetimi | Gelecek |
| Sayfa sırasını değiştirme | ⚪ P3 | Drag & drop | Gelecek |
| Font değiştirme (sayfa bazlı) | ⚪ P3 | Her sayfa farklı font | Gelecek |
| Kişisel önsöz ekleme | 🟢 P2 | Özel mesaj yazma | Post-MVP |

**MVP Kararı:**
- Basit text editing yeterli
- Görsel değiştirme manuel (support ticket)
- V1.1'de otomatik görsel regeneration

---

## 8. Ödeme ve Satın Alma

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| E-book satın alma | 🔴 P0 | $7.99 dijital kitap | MVP |
| Stripe entegrasyonu | 🔴 P0 | Kredi kartı ödemesi | MVP |
| İyzico entegrasyonu (TR) | 🟡 P1 | Türkiye ödemeleri | MVP |
| 3D Secure | 🔴 P0 | Güvenli ödeme | MVP |
| Sipariş onay sayfası | 🔴 P0 | Özet ve confirm | MVP |
| Sipariş onay emaili | 🔴 P0 | Otomatik email | MVP |
| PDF indirme linki | 🔴 P0 | Email'de link | MVP |
| Fatura oluşturma | 🟡 P1 | Otomatik fatura | MVP |
| PayPal entegrasyonu | 🟢 P2 | Alternatif ödeme | Post-MVP |
| Kupon/indirim kodu | 🟢 P2 | Promosyon kodları | Post-MVP |
| Hediye kartı | ⚪ P3 | Gift card sistemi | Gelecek |

**MVP Kararı:**
- Stripe (global)
- İyzico (Türkiye)
- Sadece e-book satışı (MVP)

---

## 9. Basılı Kitap Sipariş

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Hardcover sipariş | 🟡 P1 | $34.99 basılı kitap | MVP |
| Adres girişi | 🟡 P1 | Teslimat adresi | MVP |
| Kapak seçimi (mat/parlak) | 🟡 P1 | Finish seçeneği | MVP |
| Miktar seçimi | 🟡 P1 | 1, 3, 5, 10+ | MVP |
| Paket fiyatlandırma | 🟢 P2 | 3+ kitap indirim | Post-MVP |
| Print-on-demand entegrasyonu | 🟡 P1 | Printful API | MVP |
| Kargo takibi | 🟡 P1 | Tracking number | MVP |
| Sipariş durumu | 🟡 P1 | Printing, shipped, delivered | MVP |
| Hızlı kargo seçeneği | 🟢 P2 | Express shipping | Post-MVP |
| Uluslararası kargo | 🟡 P1 | 26 ülkeye teslimat | MVP |

**MVP Kararı:**
- Printful entegrasyonu
- Temel sipariş akışı
- Kargo takibi

---

## 10. Web Sitesi İçeriği

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| **Ana Sayfa** | 🔴 P0 | Landing page | MVP |
| - Hero section | 🔴 P0 | Başlık, CTA | MVP |
| - "Nasıl Çalışır?" | 🔴 P0 | 3 adım açıklama | MVP |
| - Örnek kitaplar | 🟡 P1 | Carousel | MVP |
| - Testimonials | 🟢 P2 | Kullanıcı yorumları | Post-MVP |
| - FAQ | 🟡 P1 | Sık sorulan sorular | MVP |
| **Features Sayfası** | 🟡 P1 | Özellikler detayı | MVP |
| **Examples Sayfası** | 🟡 P1 | Örnek kitaplar | MVP |
| **Ideas Sayfası** | 🟢 P2 | Hikaye fikirleri | Post-MVP |
| **Pricing Sayfası** | 🔴 P0 | Fiyatlandırma | MVP |
| **For Schools** | 🟢 P2 | Kurumsal satış | Post-MVP |
| **Reviews Sayfası** | 🟢 P2 | Kullanıcı incelemeleri | Post-MVP |
| **Blog** | 🟢 P2 | İçerik marketing | Post-MVP |
| **Help Center** | 🟡 P1 | Yardım merkezi | MVP |
| **About Us** | 🟡 P1 | Hakkımızda | MVP |
| **Contact** | 🟡 P1 | İletişim formu | MVP |
| **Privacy Policy** | 🔴 P0 | GDPR/KVKK uyum | MVP |
| **Terms of Service** | 🔴 P0 | Kullanım şartları | MVP |

**MVP Kararı:**
- Ana sayfa, Features, Pricing, Help zorunlu
- Examples birkaç örnek yeterli
- Blog ve Reviews sonra

---

## 11. Çok Dilli Destek

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Türkçe (TR) | 🔴 P0 | Ana dil | MVP |
| İngilizce (EN) | 🔴 P0 | İkinci dil | MVP |
| Dil değiştirici | 🔴 P0 | Language switcher | MVP |
| URL yapısı (/tr/, /en/) | 🟡 P1 | SEO dostu URL'ler | MVP |
| Otomatik dil algılama | 🟢 P2 | Browser locale | Post-MVP |
| Almanca (DE) | 🟢 P2 | 3. dil | Post-MVP |
| Fransızca (FR) | 🟢 P2 | 4. dil | Post-MVP |
| İspanyolca (ES) | 🟢 P2 | 5. dil | Post-MVP |
| Diğer diller | ⚪ P3 | Topluluk çevirileri | Gelecek |

**MVP Kararı:**
- TR ve EN yeterli
- next-intl kullan
- Diğer diller talebe göre

---

## 12. SEO ve Marketing

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Meta tags | 🔴 P0 | Title, description | MVP |
| Open Graph tags | 🟡 P1 | Sosyal medya paylaşım | MVP |
| Sitemap.xml | 🟡 P1 | SEO | MVP |
| robots.txt | 🟡 P1 | SEO | MVP |
| Google Analytics | 🟡 P1 | Trafik analizi | MVP |
| Facebook Pixel | 🟢 P2 | Retargeting | Post-MVP |
| Email newsletter | 🟢 P2 | Mailchimp/Sendgrid | Post-MVP |
| Referral program | ⚪ P3 | Arkadaşını getir | Gelecek |
| Affiliate program | ⚪ P3 | Ortaklık programı | Gelecek |

---

## 13. Admin Panel

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Sipariş yönetimi | 🔴 P0 | Siparişleri görme/yönetme | MVP |
| Kullanıcı yönetimi | 🟡 P1 | Kullanıcıları görme | MVP |
| Kitap yönetimi | 🟡 P1 | Oluşturulan kitapları görme | MVP |
| İstatistikler | 🟡 P1 | Dashboard metrics | MVP |
| Manuel sipariş oluşturma | 🟢 P2 | Destek için | Post-MVP |
| İndirim kodu yönetimi | 🟢 P2 | Kupon oluşturma | Post-MVP |
| Email şablonları | 🟢 P2 | Email template düzenleme | Post-MVP |
| İçerik yönetimi (CMS) | 🟢 P2 | Blog, pages düzenleme | Post-MVP |

**MVP Kararı:**
- Medusa Admin kullan (built-in)
- Custom dashboard sonra

---

## 14. Teknik Özellikler

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Responsive tasarım | 🔴 P0 | Mobil uyumluluk | MVP |
| Progressive Web App | 🟢 P2 | PWA özellikleri | Post-MVP |
| SSL sertifikası | 🔴 P0 | HTTPS | MVP |
| CDN kullanımı | 🟡 P1 | Hızlı yüklenme | MVP |
| Image optimization | 🟡 P1 | Next.js Image | MVP |
| Error tracking | 🟡 P1 | Sentry | MVP |
| Automated backups | 🟡 P1 | Veritabanı yedekleme | MVP |
| Rate limiting | 🟡 P1 | API abuse önleme | MVP |
| GDPR uyumlu | 🔴 P0 | Veri koruma | MVP |
| KVKK uyumlu | 🔴 P0 | Türkiye veri koruma | MVP |
| Veri silme hakkı | 🔴 P0 | Kullanıcı isteği ile silme | MVP |

---

## 15. Performans ve Kalite

| Özellik | Öncelik | Açıklama | Faz |
|---------|---------|----------|-----|
| Hikaye üretim süresi < 3 dk | 🔴 P0 | Hızlı üretim | MVP |
| Sayfa yüklenme < 3 sn | 🔴 P0 | Performans | MVP |
| 100+ concurrent users | 🟡 P1 | Ölçeklenebilirlik | MVP |
| Otomatik testing | 🟢 P2 | Unit + E2E tests | Post-MVP |
| CI/CD pipeline | 🟡 P1 | Otomatik deployment | MVP |

---

## MVP Özet Özellikleri

### Kesinlikle Olması Gerekenler (P0):
1. ✅ Kullanıcı kaydı ve girişi
2. ✅ 1 karakter oluşturma (fotoğraf + bilgi)
3. ✅ Tema ve stil seçimi
4. ✅ AI hikaye üretimi (24 sayfa)
5. ✅ E-book görüntüleyici (flipbook)
6. ✅ E-book satın alma ($7.99)
7. ✅ Ödeme (Stripe + İyzico)
8. ✅ PDF generation ve indirme
9. ✅ Ana sayfa, Features, Pricing
10. ✅ TR ve EN dil desteği

### Olması İyi Olur (P1):
1. Hardcover sipariş
2. Print-on-demand entegrasyonu
3. Metin düzenleme
4. Birkaç örnek kitap
5. FAQ ve Help Center

### Sonra Eklenebilir (P2):
1. Multi-character (5 karakter)
2. Pet ve oyuncak
3. Görsel yeniden üretme
4. Reviews ve testimonials
5. Ideas sayfası
6. Blog

---

**Son Güncelleme:** 21 Aralık 2025  
**Güncelleyen:** Proje Ekibi

