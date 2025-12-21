# ❓ Karar Verilmesi Gereken Konular
# KidStoryBook Platform

**Doküman Versiyonu:** 1.0  
**Tarih:** 21 Aralık 2025  
**Durum:** Aktif Karar Aşaması

---

## 🎯 Kritik Kararlar

### 1. Platform ve Teknoloji Stack

#### Soru:
Hangi teknoloji stack ile gidelim?

#### Seçenekler:

**A. Shopify + Custom Embedded App**
- ✅ Hızlı (4-6 hafta)
- ✅ Ödeme hazır
- ❌ Kısıtlı esneklik
- ❌ E-book viewer zorluğu
- 💰 Maliyet: $8k-12k/yıl

**B. Headless E-commerce (Medusa.js + Next.js)** ⭐ ÖNERİLEN
- ✅ Tam kontrol
- ✅ Modern stack
- ✅ Makul maliyet
- ❌ Biraz daha uzun (8-10 hafta)
- 💰 Maliyet: $6k-12k/yıl

**C. Full Custom**
- ✅ %100 kontrol
- ❌ En uzun süre (12-20 hafta)
- ❌ En pahalı ($20k+/yıl)

#### Öneri:
**Seçenek B: Medusa.js + Next.js**

**Gerekçe:**
- Tam kontrol (AI, e-book viewer, custom features)
- Modern ve maintainable
- Open source (vendor lock-in yok)
- Makul maliyet ve süre
- E-commerce özellikleri hazır

#### Karar:
[ ] **Onaylandı - B seçeneği**  
[ ] Başka seçenek  
[ ] Daha fazla araştırma gerekiyor

---

### 2. AI Teknolojisi Seçimi

#### Soru:
Hangi AI servislerini kullanmalıyız?

#### Hikaye Metni İçin:

**A. GPT-4o (OpenAI)** ⭐ ÖNERİLEN
- ✅ Hızlı ve kaliteli
- ✅ JSON output
- ✅ Çok dilli
- 💰 ~$0.035/hikaye

**B. Claude 3.5 Sonnet**
- ✅ İyi kalite
- ✅ Biraz daha ucuz
- ❌ OpenAI kadar popüler değil

**C. Gemini Pro**
- ✅ ÜCRETSİZ (limit dahilinde)
- ❌ Kalite GPT-4 kadar iyi değil

#### Öneri:
**GPT-4o (primary) + Gemini Pro (test için)**

#### Görsel Üretimi İçin:

**MVP Aşaması:**
- **DALL-E 3** ⭐ ÖNERİLEN
- Kolay entegrasyon
- İyi kalite
- $0.48-0.96/kitap

**Gelecek İyileştirmeler:**
- Midjourney (consistent character)
- Stable Diffusion + LoRA (maliyet optimizasyonu)

#### Karar:
[ ] **Onaylandı - GPT-4o + DALL-E 3**  
[ ] Başka kombinasyon  
[ ] Test et, sonra karar ver

---

### 3. UI/UX Yaklaşımı

#### Soru:
Web sitesi tasarımını nasıl yapmalıyız?

#### Seçenekler:

**A. Hazır tema satın al**
- ✅ Hızlı ($50-300)
- ❌ Generic
- ❌ Özelleştirme sınırlı

**B. UI Kit kullan (shadcn/ui + Tailwind)** ⭐ ÖNERİLEN
- ✅ Modern ve customizable
- ✅ ÜCRETSİZ
- ✅ Tam kontrol
- ❌ Biraz daha fazla iş

**C. Custom Figma tasarım**
- ✅ Benzersiz
- ❌ Pahalı ($2k-5k)
- ❌ Zaman alıcı

#### Öneri:
**Seçenek B: shadcn/ui + Tailwind CSS**

**Gerekçe:**
- Modern component library
- Referans sitelere bakarak hızlı ilerlenebilir
- Ücretsiz ve esnek
- İyi dokümantasyon

#### Ek Strateji:
- magicalchildrensbook.com'u referans al
- shadcn/ui componentleri ile benzer UI yap
- Kendi branding'ini ekle (renkler, logo)

#### Karar:
[ ] **Onaylandı - shadcn/ui**  
[ ] Tema satın al (hangisi?)  
[ ] Custom tasarım yaptır

---

### 4. İlk Aşama: Manuel mi Otomatik mi?

#### Soru:
İlk siparişler için AI tamamen otomatik mi çalışsın, yoksa manuel kontrol mü?

#### Seçenekler:

**A. Tam Otomatik**
- ✅ Hızlı, ölçeklenebilir
- ❌ Kalite garanti edilemez
- ❌ Karakter tutarlılığı sorun olabilir

**B. Yarı-Otomatik (Hybrid)** ⭐ ÖNERİLEN
- ✅ AI üretir, insan kontrol eder
- ✅ Kalite garantisi
- ✅ Müşteri memnuniyeti yüksek
- ❌ Ölçeklenebilirlik sınırlı (50-100 kitap/ay)

**C. Tam Manuel**
- ✅ En yüksek kalite
- ❌ Çok yavaş
- ❌ Ölçeklenemez

#### Öneri:
**Seçenek B: Yarı-Otomatik (İlk 3-6 Ay)**

**Akış:**
1. Kullanıcı siparişi tamamlar
2. AI otomatik hikaye + görseller üretir
3. **Admin panelde manuel review** (30-60 dk)
4. Gerekirse görselleri düzenle/yeniden üret
5. Onayla ve kullanıcıya gönder

**Geçiş Planı:**
- 3-6 ay sonra daha otomatik hale getir
- Kalite metrikleri toplayarak AI'ı iyileştir
- Karakter tutarlılığı çözümlerini test et (LoRA, Midjourney)

#### Karar:
[ ] **Onaylandı - Hybrid yaklaşım**  
[ ] Tam otomatik riske girelim  
[ ] Tam manuel daha iyi

---

### 5. E-Book Fiyatlandırması

#### Soru:
E-book ve basılı kitap fiyatları ne olmalı?

#### Maliyet Analizi:

**E-Book Maliyeti (per kitap):**
- AI (hikaye + görseller): $1.00
- PDF generation: $0.05
- Storage: $0.05
- Payment processing (%3): $0.24
- **Toplam Maliyet:** ~$1.34

**Önerilen E-Book Fiyatı:**
- **$7.99** (referans siteyle aynı)
- Kar marjı: ~$6.65 (83%)

**Basılı Kitap Maliyeti (per kitap):**
- Printful hardcover A4: $15-20
- Kargo: $8-15
- E-book maliyeti: $1.34
- Payment processing (%3): $1.00
- **Toplam Maliyet:** ~$25-36

**Önerilen Hardcover Fiyatı:**
- **$34.99** (tek kitap)
- Kar marjı: ~$10 (29%)

**Paket Fiyatları:**
- 3 kitap: $99 ($33/kitap - %6 indirim)
- 5 kitap: $159 ($31.80/kitap - %9 indirim)

#### Karar:
[ ] **Onaylandı - $7.99 (e-book), $34.99 (hardcover)**  
[ ] Farklı fiyat öner: _______

---

### 6. Print-on-Demand Servisi

#### Soru:
Hangi print-on-demand servisi kullanılmalı?

#### Karşılaştırma:

| Servis | Fiyat | Teslimat | API | Kalite |
|--------|-------|----------|-----|--------|
| **Printful** | $15-25 | 7-14 gün | ✅ | ⭐⭐⭐⭐⭐ |
| **Gelato** | $12-22 | 3-7 gün | ✅ | ⭐⭐⭐⭐ |
| **Printify** | $12-20 | 5-12 gün | ✅ | ⭐⭐⭐⭐ |
| **Lulu** | $10-18 | 7-10 gün | ✅ | ⭐⭐⭐⭐ |

#### Öneri:
**Printful** (birinci seçenek) veya **Gelato** (ikinci seçenek)

**Gerekçe:**
- İyi API dokümantasyonu
- Yüksek kalite
- Global teslimat
- Güvenilir

#### İlk Aşama Alternatif:
İlk 20-50 kitap için **lokal matbaa** (Türkiye için)
- Daha ucuz olabilir
- Daha fazla kontrol
- Manuel süreç

#### Karar:
[ ] **Printful API entegrasyonu**  
[ ] **Gelato**  
[ ] **İlk aşama manuel (lokal matbaa)**

---

### 7. Çok Dilli Destek Kapsamı

#### Soru:
MVP'de kaç dil desteklensin?

#### Seçenekler:

**A. Sadece Türkçe**
- ✅ En hızlı
- ❌ Pazar kısıtlı

**B. Türkçe + İngilizce** ⭐ ÖNERİLEN
- ✅ Global pazara açılır
- ✅ Makul iş yükü
- 💰 2x content çalışması

**C. TR + EN + 3-5 Avrupa Dili**
- ✅ Geniş pazar
- ❌ Çok fazla iş
- ❌ Tüm içeriği çevirmek zor

#### Öneri:
**B: TR + EN (MVP için)**

**İyileştirme Planı:**
- MVP: TR + EN
- V1.1: DE (Almanca) - Büyük pazar
- V1.2: FR, ES (Fransızca, İspanyolca)
- Gelecek: Kullanıcı talebine göre

#### AI Hikaye Dili:
- AI zaten çok dilli (GPT-4o)
- Hikaye üretimi için ekstra maliyet yok

#### Karar:
[ ] **Onaylandı - TR + EN**  
[ ] Sadece TR (daha hızlı)  
[ ] Daha fazla dil ekle: _______

---

### 8. Hosting ve Infrastructure

#### Soru:
Nerede host edelim?

#### Önerilen Stack:

**Frontend:**
- **Vercel** (Next.js için ideal)
- ÜCRETSİZ 100GB/ay
- Pro: $20/ay

**Backend:**
- **Railway** ($5-20/ay)
- veya **Render** ($7/ay)
- PostgreSQL dahil

**File Storage:**
- **AWS S3** ($5-20/ay)
- Fotoğraflar, AI görseller, PDF'ler

**Alternatif All-in-One:**
- **AWS** (EC2 + RDS + S3)
- Daha pahalı ama daha fazla kontrol

#### Tahmini Aylık Maliyet:
- Vercel: $0-20
- Railway/Render: $10-30
- S3: $10-30
- **Toplam: $20-80/ay**

#### Karar:
[ ] **Onaylandı - Vercel + Railway + S3**  
[ ] AWS (tam kontrol)  
[ ] Başka öneri: _______

---

### 9. Karakter Tutarlılığı Çözümü

#### Soru:
AI her sayfada aynı karakteri nasıl üretsin?

#### Problem:
DALL-E 3, her istekte farklı görünümlü karakterler üretebilir.

#### Çözümler:

**A. Detaylı Prompt + Manuel Kontrol** ⭐ MVP İÇİN
- Her promptta çok detaylı karakter tanımı
- Manuel review ve düzeltme
- %70-80 tutarlılık
- **İlk 3-6 ay için uygun**

**B. Midjourney Consistent Character**
- Midjourney v6'nın --cref özelliği
- %85-95 tutarlılık
- Midjourney API bekleniyor (veya 3rd party tools)

**C. Stable Diffusion + LoRA Training**
- Her karakter için custom model
- 30-60 dakika training
- %90-95 tutarlılık
- Otomatize edilebilir (Replicate)

**D. Hybrid: Manuel İlk Aşama**
- İlk siparişler için AI + Photoshop/manuel editing
- %100 kalite garantisi
- Yavaş ama güvenilir

#### Öneri:
**MVP: Seçenek A + D (Detaylı prompt + manuel review)**
**V1.1-1.2: Seçenek B veya C (otomatize)**

#### Karar:
[ ] **Onaylandı - Manuel başla, sonra otomatize**  
[ ] Direkt otomatik çözüm (risk)  
[ ] Başka fikir: _______

---

### 10. MVP Kapsamı

#### Soru:
MVP'de hangi özellikler kesinlikle olmalı?

#### Minimum Viable Product Tanımı:

**Olmazsa Olmaz (P0):**
1. ✅ Kullanıcı kaydı (email/şifre)
2. ✅ 1 karakter oluşturma (fotoğraf + bilgiler)
3. ✅ Tema ve stil seçimi
4. ✅ AI hikaye üretimi (24 sayfa)
5. ✅ E-book görüntüleyici (flipbook)
6. ✅ E-book satın alma ve ödeme
7. ✅ PDF indirme
8. ✅ Ana sayfa + Features + Pricing
9. ✅ TR + EN dil desteği
10. ✅ Responsive design

**MVP Dışı Bırakabiliriz (Post-MVP):**
- ❌ Multi-character (5 karakter)
- ❌ Pet ve oyuncak
- ❌ Basılı kitap siparişi (önemli ama sonra eklenebilir)
- ❌ Görsel düzenleme
- ❌ Kişisel önsöz
- ❌ Blog ve Reviews

#### Alternatif: Daha Geniş MVP

**MVP+ (Hardcover Dahil):**
- Yukarıdakiler + Basılı kitap siparişi
- +2-3 hafta geliştirme süresi

#### Karar:
[ ] **Minimal MVP (sadece e-book)**  
[ ] **MVP+ (e-book + hardcover)** ⭐ ÖNERİLEN  
[ ] Farklı kapsam: _______

---

### 11. Launch Stratejisi

#### Soru:
Nasıl launch yapalım?

#### Seçenekler:

**A. Soft Launch (Beta)**
- Kapalı beta, davetiye ile
- İlk 50-100 kullanıcı
- Feedback topla, iyileştir
- 2-3 ay beta sonra public

**B. Public Launch**
- Direkt herkese açık
- Marketing kampanyası
- Riskli ama hızlı growth

**C. Pre-Order / Waitlist**
- Önce landing page + waitlist
- İlgi ölç
- Geliştirirken waitlist büyüt
- Launch'ta hazır müşteri tabanı

#### Öneri:
**C: Pre-Order / Waitlist** ⭐

**Strateji:**
1. **Şimdi:** Landing page yayınla (sadece bilgi + email toplaması)
2. **Ay 1-2:** Geliştirmeye devam, email listesi büyüt
3. **Ay 3:** Kapalı beta (ilk 20-50 kullanıcı)
4. **Ay 4:** Public launch

**Avantajları:**
- Launch'tan önce ilgi görsün
- Email listesi (marketing için)
- Feedback erken gelir
- Launch'ta momentum

#### Karar:
[ ] **Waitlist stratejisi**  
[ ] Direkt public launch  
[ ] Uzun beta dönemi

---

### 12. Telif ve Yasal Konular

#### Soru:
Yasal olarak nelere dikkat etmeliyiz?

#### Kritik Konular:

**1. Çocuk Fotoğrafları:**
- [ ] Açık rıza metni (ebeveyn onayı)
- [ ] Fotoğrafların sadece AI için kullanıldığı
- [ ] Veri saklama süresi (GDPR/KVKK)
- [ ] Veri silme hakkı

**2. AI Üretilmiş İçerik:**
- [ ] Telif hakkı kim de? (Müşteri mi, platform mu?)
- [ ] AI artwork'lerin ticari kullanımı (OpenAI ToS)
- [ ] İçerik politikası (uygunsuz içerik üretilirse)

**3. Terms of Service:**
- [ ] Kullanım şartları
- [ ] Iade politikası
- [ ] Teslimat garantisi

**4. Gizlilik:**
- [ ] Privacy Policy (GDPR/KVKK uyumlu)
- [ ] Cookie policy
- [ ] Çocuk gizliliği (COPPA - ABD)

#### Öneri:
- Avukat danışmanlığı al (1-2 saat yeterli)
- Şablon ToS/Privacy kullan (termly.io gibi)
- Açık rıza formları hazırla

#### Karar:
[ ] **Avukat danışmanlığı al**  
[ ] **Şablon kullan**  
[ ] İkisini de yap ⭐

---

## 📋 Karar Özeti Tablosu

| # | Konu | Önerilen Seçenek | Durum |
|---|------|------------------|-------|
| 1 | Platform | Medusa.js + Next.js | ⏳ Bekliyor |
| 2 | AI | GPT-4o + DALL-E 3 | ⏳ Bekliyor |
| 3 | UI/UX | shadcn/ui + Tailwind | ⏳ Bekliyor |
| 4 | İlk Aşama | Yarı-otomatik (Hybrid) | ⏳ Bekliyor |
| 5 | Fiyat | $7.99 (e-book), $34.99 (hardcover) | ⏳ Bekliyor |
| 6 | Print-on-Demand | Printful | ⏳ Bekliyor |
| 7 | Dil | TR + EN | ⏳ Bekliyor |
| 8 | Hosting | Vercel + Railway + S3 | ⏳ Bekliyor |
| 9 | Karakter Tutarlılığı | Manuel başla, sonra otomatize | ⏳ Bekliyor |
| 10 | MVP Kapsamı | E-book + Hardcover | ⏳ Bekliyor |
| 11 | Launch | Waitlist → Beta → Public | ⏳ Bekliyor |
| 12 | Yasal | Avukat + Şablon | ⏳ Bekliyor |

---

## 🎯 Sonraki Adımlar

Kararlar alındıktan sonra:

1. [ ] Faz 2 detaylı planı oluştur
2. [ ] Tech stack dokümantasyonu
3. [ ] Geliştirme timeline'ı
4. [ ] Prototip ve testler
5. [ ] Launch planı detaylandırma

---

**Son Güncelleme:** 21 Aralık 2025  
**Güncelleyen:** Proje Ekibi  
**Karar Alınacak Kişi:** Proje Sahibi

