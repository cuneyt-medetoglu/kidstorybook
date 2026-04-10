# 💳 HeroKidStory — Ödeme Sistemi Entegrasyonu Yol Haritası

**Oluşturma tarihi:** 5 Nisan 2026  
**Son güncelleme:** **11 Nisan 2026** — Bu dosya, **geldiğimiz nokta** ve **Stripe + faturalama dışında kalan işler** için güncel özet ekrandır. *(Konuya ara verildi; devam ederken buradan başlayın.)*

**Durum özeti:** Faz 0 ✅ · Faz 1 ✅ · Faz 4 ✅ · **Faz 7 ✅** *(kod)* · Faz 5 🔶 *(kısmen)* · Faz 2 ⏸️ · Faz 3 ⬜ · Faz 6 ⬜

**Kapsam:** iyzico (TR) ile uçtan uca ödeme. **Stripe** ve **Profil Ayarları / Faturalama** tarafı **bilinçli olarak sonra**; ayrıntılar [Kalan işler (Stripe + faturalama hariç)](#snapshot-remaining-without-stripe) ve [Kalan işler — sonra](#snapshot-remaining-stripe-billing) bölümlerinde.

---

## Bu sayfada ne var?

| Bölüm | İçerik |
|-------|--------|
| **[Geldiğimiz nokta (11 Nisan 2026)](#snapshot-done-2026-04-11)** | Son teslimatlar (kod + UX) |
| **[Ortam kontrol listesi](#snapshot-env-checklist)** | Prod/staging’de doğrulanacaklar |
| **[Kalan işler (Stripe + faturalama hariç)](#snapshot-remaining-without-stripe)** | Faz 6, Faz 5 kapanışı, Faz 3 |
| **[Kalan işler — sonra](#snapshot-remaining-stripe-billing)** | Stripe, faturalama |
| Aşağıdaki tablolar | Strateji, faz dosyaları, mimari, SSS, bağımlılıklar *(referans)* |

---

<a id="snapshot-done-2026-04-11"></a>

## Geldiğimiz nokta (11 Nisan 2026)

### Kod ve ürün UX

- **Faz 7 — Promo kodları:** `migrations/031_promo_codes.sql` (`promo_codes`, `promo_code_usages`, `orders.promo_code_id`), `lib/db/promo-codes.ts`, `POST /api/promo/validate`, admin CRUD (`/api/admin/promo-codes`), sepet + iyzico initialize’da sunucu tarafı doğrulama ve indirim, ödeme sonrası kullanım kaydı (`recordPromoCodeUsage`), admin arayüzü `/admin/promo-codes`.
- **Ödeme başarılı ekranı:** `/payment/success` — kısa ödeme onayı + kitap üretim aşamaları (canlı ilerleme), kapatınca arka planda devam / yönlendirme akışı.
- **Siparişler tek deneyim:** Header “Siparişlerim” → `/dashboard/settings?section=orders`; ayarlar sidebar’ında **Siparişlerim** / **My Orders**; `/orders` aynı hedefe **yönlendirme**; `/orders/[id]` detay geri linki ile uyumlu.

### Faz 0–1–4 (özet, değişmedi)

- Ödeme tabloları, iyzico Checkout Form, callback, sipariş DB, kullanıcı + admin sipariş ekranları, iade API — tamamlandı (detay: ilgili `FAZx_*.md` dosyaları).

---

<a id="snapshot-env-checklist"></a>

## Ortam kontrol listesi (promo + sipariş)

Ortam başına doğrulayın:

- [ ] **`031_promo_codes`** migration’ı **staging / production** PostgreSQL’de uygulandı (yerel ile prod aynı olmayabilir).
- [ ] Promo kodu ile sepet → ödeme → `paid` sonrası **`promo_code_usages`** ve **`used_count`** beklendiği gibi.
- [ ] Manuel regresyon: [PAYMENT_MANUAL_TESTS.md](PAYMENT_MANUAL_TESTS.md).

---

<a id="snapshot-remaining-without-stripe"></a>

## Kalan işler (Stripe + faturalama hariç)

Önerilen sıra: önce **güven ve regresyon**, sonra **post-ödeme kapanışı** ve **checkout iyileştirmeleri**.

| Sıra | Konu | Doküman |
|------|------|---------|
| **1** | **Faz 6** — sandbox / 3DS / kenar durumlar, canlıya alış checklist | [FAZ6_TEST_VE_CANLIYA_ALIS.md](FAZ6_TEST_VE_CANLIYA_ALIS.md), [PAYMENT_MANUAL_TESTS.md](PAYMENT_MANUAL_TESTS.md) |
| **2** | **Faz 5 kapanışı** — e-posta (domain / Resend), hardcopy fulfillment netliği, operasyonel “tamam” | [FAZ5_POST_ODEME.md](FAZ5_POST_ODEME.md) |
| **3** | **Faz 3** — checkout / geo-routing (Stripe yokken iyzico-only parçalar mümkün) | [FAZ3_CHECKOUT.md](FAZ3_CHECKOUT.md) |
| **İsteğe bağlı** | `docs/database/SCHEMA.md` içinde **`031`** / promo tablolarının özeti | Şema dokümanı senkronu |

---

<a id="snapshot-remaining-stripe-billing"></a>

## Kalan işler — sonra (Stripe, faturalama)

| Konu | Not |
|------|-----|
| **Faz 2 — Stripe** | [FAZ2_STRIPE.md](FAZ2_STRIPE.md); ardından Faz 3 ile tam geo-routing (TR → iyzico, diğer → Stripe). |
| **Faturalama** | Profil ayarlarındaki “Faturalama” / müşteri portalı, fatura PDF, vergi alanları vb. — **ürün kararı sonrası**; ayrı faz dosyası yok, ihtiyaç halinde eklenebilir. |

---

## 🚦 Güncel strateji (Nisan 2026)

| Dalga | Kapsam |
|-------|--------|
| **Tamamlanan (iyzico çekirdeği + sipariş + promo kodu)** | Faz 0, 1, 4, 7 *(kod)*; ödeme başarı + üretim UI; sipariş navigasyonu birleşik |
| **Sıradaki (Stripe / faturalama hariç)** | Faz 6 test & canlı; Faz 5 kapanış; isteğe bağlı Faz 3 |
| **Sonra** | Stripe, tam geo-routing, faturalama UI |

**iyzico sandbox:** Panelden alınan API / güvenlik anahtarları **yalnızca** yerel `.env` dosyasına yazılır; **asla** git'e commit edilmez ve dokümana gerçek değer olarak eklenmez.

**Günlük / hatırlatma notları:** [ODEME_NOTLARI.md](ODEME_NOTLARI.md)

**Deploy notu:** `package.json` ve `package-lock.json` commit edildiyse `deploy:build` / sunucuda `npm install` `iyzipay`’ı kurar. Sunucu `.env` içinde `IYZICO_*` tanımlı olmalı (commit edilmez).

---

## 🏗️ Mimari karar (hazır ödeme + kendi sepet/sipariş)

**Evet, bu yaklaşım dokümanda yer alıyor; özeti burada sabitlenir:**

| Katman | Ne kullanılır? |
|--------|----------------|
| **Sepet, sipariş satırları, toplam, promo indirimi** | Uygulama içi: sepet + sunucuda `orders` / `order_items` + sunucu tarafı fiyat / promo doğrulama (`promo_codes`, Faz 7). **Tam headless commerce suite (Medusa, Saleor vb.) kullanılmayacak** — detay: [FAZ0_HAZIRLIK.md](FAZ0_HAZIRLIK.md) bölüm **1.1**. |
| **Kart / 3D Secure / tahsilat** | **iyzico:** Checkout Form (API + iframe). **Stripe:** Checkout Session (hosted) veya Payment Element — [FAZ2_STRIPE.md](FAZ2_STRIPE.md). |
| **Ödeme sonucu** | iyzico callback (+ gerekirse webhook); Stripe webhook → sipariş `paid`. |

Yani: **sıfırdan kart formu yazılmaz**; **tüm e-ticaret platformunu da sıfırdan yazmak / satın almak zorunda değilsiniz** — orta yol: **kendi iş mantığınız + sağlayıcının checkout'u.**

---

## 🎯 Temel Hedef (hedef mimari)

Kullanıcının bulunduğu ülkeye göre otomatik olarak doğru ödeme sağlayıcısını göstermek hedeflenir:

| Kullanıcı | Ödeme Sağlayıcısı | Para Birimi |
|-----------|-------------------|-------------|
| 🇹🇷 Türkiye | **iyzico** | TRY (₺) |
| 🌍 Diğer ülkeler | **Stripe** *(şimdilik yok — entegrasyon sonra)* | USD / EUR / GBP |

> Ülke tespiti: Mevcut `lib/currency.ts` altyapısı (`x-vercel-ip-country` header) kullanılacak. Stripe gelene kadar checkout **sadece iyzico** veya **yalnızca TR / TRY** senaryosu ile sınırlandırılabilir.

---

## 🤖 Önerilen AI modeli (faz bazında)

Aşağıdaki isimler **Cursor / benzeri araçlarda seçebileceğiniz model takma adları**dır; ürün arayüzünde isimler değişebilir. Amaç: **düşük risk / tekrarlı iş**te hızlı model, **para ve güvenlik**te daha güçlü model + mümkünse insan gözden geçirme.

| Model (örnek) | Ne zaman? |
|----------------|-----------|
| **Auto** | Hızlı iterasyon, küçük düzeltmeler, checklist güncellemesi |
| **Claude Sonnet 4.6** | Orta zorluk: migration, API route, admin CRUD, React sayfaları |
| **Claude Opus 4.6** | Yüksek risk: ödeme akışı, imza/callback, tutarlılık, kenar durumlar |
| **GPT 5.4** | Opus alternatifi: entegrasyon hatalarını ayıklama, çok adımlı akış |
| **Gemini 3.1 Pro** | Uzun doküman/çok dosya taraması, karşılaştırma (isteğe bağlı) |
| **Composer 2** | UI odaklı, bileşen taslakları, hızlı ekran iskeleti |

> **Not:** Ödeme ile ilgili PR'larda üst segment model (Opus / GPT 5.4) + sizin kısa review'ünüz önerilir. Tablo **öneridir**; ekip alışkanlığına göre güncelleyin.

---

## 📂 Faz Dosyaları

| Faz | Dosya | Konu | Önerilen model | Durum |
|-----|-------|------|----------------|-------|
| **Faz 0** | [FAZ0_HAZIRLIK.md](FAZ0_HAZIRLIK.md) | DB şeması, env, temel altyapı | **Sonnet 4.6** *(veya Auto — migration tekrarlarında)* | ✅ **Tamamlandı** |
| **Faz 1** | [FAZ1_IYZICO.md](FAZ1_IYZICO.md) | iyzico entegrasyonu | **Opus 4.6** veya **GPT 5.4** | ✅ **Tamamlandı** |
| **Faz 2** | [FAZ2_STRIPE.md](FAZ2_STRIPE.md) | Stripe entegrasyonu | **Opus 4.6** veya **GPT 5.4** | ⏸️ **ERTELENDİ — sonra** |
| **Faz 3** | [FAZ3_CHECKOUT.md](FAZ3_CHECKOUT.md) | Checkout, geo-routing | **Sonnet 4.6** veya **Composer 2** *(UI ağırlıklı)* | ⬜ Bekliyor *(Stripe yokken: önce iyzico-only)* |
| **Faz 4** | [FAZ4_ADMIN_SIPARISLER.md](FAZ4_ADMIN_SIPARISLER.md) | Admin sipariş | **Sonnet 4.6** *(veya Auto — tablo/liste rutini)* | ✅ **Tamamlandı** |
| **Faz 5** | [FAZ5_POST_ODEME.md](FAZ5_POST_ODEME.md) | Post-ödeme, e-posta | **Sonnet 4.6** veya **Auto** | 🔶 Kısmen Tamamlandı *(domain bekliyor)* |
| **Faz 6** | [FAZ6_TEST_VE_CANLIYA_ALIS.md](FAZ6_TEST_VE_CANLIYA_ALIS.md) · [PAYMENT_MANUAL_TESTS.md](PAYMENT_MANUAL_TESTS.md) | Test, canlıya alış | **Auto** veya **Gemini 3.1 Pro** *(uzun checklist / doküman taraması)* | ⬜ Bekliyor |
| **Faz 7** | [FAZ7_PROMO_KODLARI.md](FAZ7_PROMO_KODLARI.md) | İndirim / promo kodu sistemi | **Sonnet 4.6** | ✅ **Kod tamamlandı** *(ortamda `031` + QA)* |

---

## 🗺️ Genel Bakış — Ödeme Akışı (Uçtan Uca)

```
Kullanıcı → Sepet → Checkout Sayfası
                         │
              ┌──────────┴──────────┐
         TR mi?                  TR değil mi?
              │                       │
           iyzico                  Stripe
        Ödeme Formu          Checkout Session
        (3D Secure)          (hosted/embedded)
              │                       │
         Callback/                 Webhook
         Webhook                      │
              └──────────┬────────────┘
                         │
                   Sipariş Kaydı (DB)
                         │
                   Ödeme Başarılı Sayfası
                         │
                   E-posta Bildirimi
                         │
                   Kitap Üretimi (eğer e-book ise)
```

---

## 📦 Ne Satıyoruz?

| Ürün | Açıklama | TR Fiyat | USD Fiyat |
|------|----------|----------|-----------|
| **E-Book** | Dijital kitap (PDF/web viewer) | ₺299 | $9.99 |
| **Hardcopy** | Basılı kitap (fiziksel kargo — şimdilik sadece TR) | ₺499 | — |
| **E-Book + Hardcopy Bundle** | Her ikisi birden | ₺699 | — |

> Not: Fiyatlar `lib/pricing/payment-products.ts` içinde tanımlıdır — her zaman sunucu tarafından hesaplanır.

---

## 🗃️ Yeni Veritabanı Tabloları (Özet)

| Tablo | Amaç |
|-------|------|
| `orders` | Ana kayıt; sağlayıcı sütunu **`payment_provider`**, para birimi **`order_currency`** |
| `order_items` | Sipariş satırları (book_id, item_type: ebook/hardcopy/bundle) |
| `payments` | Ödeme girişimleri (`payment_provider`, `payment_currency`, sağlayıcı ID’leri) |
| `payment_events` | Webhook/callback log (`payment_provider` + idempotency) |
| `promo_codes` / `promo_code_usages` | Promo kodu tanımları ve kullanım kaydı; `orders.promo_code_id` (Faz 7) |

> Detay: [FAZ0_HAZIRLIK.md](FAZ0_HAZIRLIK.md) · Sıra: `025` → **`025b`** (indeks) → **`025c`** (trigger) → `026` → `027` → **`027c`** *(yalnızca eski `payments` tablosu 027 şemasından farklıysa)* → **`027b`** → `028` → **`028b`** → **`029`** → **`030`** → **`031`** *(promo)*. DBeaver: [ODEME_NOTLARI.md](ODEME_NOTLARI.md).

---

## ❓ Sık sorulan: boş sepet, metinler, DB hatası, ne zaman tam test?

| Soru | Kısa cevap | Hangi faz / doküman |
|------|------------|---------------------|
| **Kitap oluşturma adım 6’da “Öde” → sepet boş** | Önceden yalnızca `/cart?plan=…` yönlendirmesi vardı; sepete satır eklenmiyordu. Kodda **önce `addToCart`, sonra navigasyon** (Faz 1). | [FAZ1_IYZICO.md](FAZ1_IYZICO.md) §2.3 · [ODEME_NOTLARI.md](ODEME_NOTLARI.md) |
| **Checkout’ta ham anahtarlar (`checkout.billingAddress…`) veya yanlış alt başlık** | `next-intl` namespace’i yanlış kullanıldığında anahtarlar ekranda kalır; düzeltme **Faz 1** (parça parça QA). TR arayüz + **USD ($)**: Stripe/uluslararası hedefiyle fiyat gösterimi henüz tam hizalanmamış olabilir; **TRY + iyzico** tutarlılığı Faz 1 sandbox’ta, geniş **para birimi / geo** kurgusu **Faz 3**. | [FAZ3_CHECKOUT.md](FAZ3_CHECKOUT.md) |
| **`column "payment_provider" of relation "payments" does not exist`** | Hedef veritabanında **`027_create_payments.sql`** (ve **`027b`**) uygulanmamış veya yarım çalıştırılmış. Kod hatası değil. | [ODEME_NOTLARI.md](ODEME_NOTLARI.md) (027 notu) |
| **Tam uçtan uca test ne zaman?** | **Faz 1:** sandbox kart + migration + `NEXT_PUBLIC_APP_URL` (public HTTPS; localhost callback genelde yetmez). **Resmi regresyon / canlı öncesi checklist:** [FAZ6_TEST_VE_CANLIYA_ALIS.md](FAZ6_TEST_VE_CANLIYA_ALIS.md). | [ODEME_NOTLARI.md](ODEME_NOTLARI.md) “Sandbox” bölümü |

---

## 🔑 Kullanılacak Servisler

### iyzico
- **Test:** `sandbox.iyzipay.com` — Test API key'leri kullanılır
- **Prod:** İyzico başvurusu yapılacak (KVK/şirket bilgisi gerekiyor)
- **Yöntem:** İyzico Checkout Form (iframe tabanlı, 3D Secure dahil)
- **SDK:** `iyzipay` — **`package.json` → `dependencies`** (repoda sabitlenir); sunucuda `npm install` / `npm ci`

### Stripe *(sonra)*
- **Durum:** Faz 0 ✅ · Faz 1 ✅ (iyzico tamam) · Stripe henüz yok ([FAZ2](FAZ2_STRIPE.md))
- **Test:** `dashboard.stripe.com` test mode — mevcut hesap
- **Prod:** Mevcut Stripe hesabı bağlanacak
- **Yöntem:** Stripe Payment Element (embedded) veya Stripe Checkout (hosted)
- **SDK:** `stripe` + `@stripe/stripe-js` npm paketleri

---

## 📋 Bağımlılıklar ve Önkoşullar

- [x] Kullanıcı kimlik doğrulama sistemi mevcut (NextAuth)
- [x] Ülke tespiti altyapısı mevcut (`lib/currency.ts`)
- [x] Sepet sistemi kısmen mevcut (localStorage tabanlı)
- [x] Admin panel iskelet mevcut (`/admin`)
- [x] iyzico sandbox hesabı açıldı — key'ler **sadece** `.env` (dokümanda gerçek değer yok)
- [ ] Stripe test API key'leri → **Stripe fazına kadar bekliyor**
- [x] `orders`, `order_items`, `payments`, `payment_events` migration'ları (`025`, `025b`, `025c`, `026`, `027`, `027b`, `028`, `028b`)
- [x] `lib/payment/types.ts`, `lib/payment/config.ts`, `lib/payment/provider.ts`
- [x] `lib/pricing/payment-products.ts` — ürün/fiyat kataloğu
- [x] `lib/db/orders.ts` — DB yardımcı fonksiyonlar
- [x] `GET /api/payment/provider` API endpoint
- [x] `CartItem` tipine `currency` ve `productId` eklendi
- [x] i18n: `products`, `orders`, `payment` anahtarları (TR + EN)
- [x] Migration'lar PostgreSQL'e uygulandı (`025` → `025c` → `026` → `027` → `027b` → `028` → `028b`) — ortam başına doğrula
- [x] `iyzipay` — `package.json` + lockfile; yerelde `npm install` / sunucuda deploy ile kurulum
- [x] iyzico callback için public erişilebilir `NEXT_PUBLIC_APP_URL` — Faz 1 sandbox QA’da doğrulandı (staging/production; yerel tünel gerekirse ngrok vb.)
- [ ] **`031_promo_codes`** hedef veritabanında uygulandı mı? *(Her ortam için doğrula.)*

---

## 📊 Faz Durumu

| Faz | İçerik | Tahmini süre | Önerilen model | Durum |
|-----|--------|--------------|----------------|-------|
| Faz 0 | DB + Env + Altyapı (iyzico) | 1-2 gün | Sonnet 4.6 / Auto | ✅ **Tamamlandı** |
| Faz 1 | iyzico | 3-5 gün | Opus 4.6 / GPT 5.4 | ✅ **Tamamlandı** |
| Faz 2 | Stripe | 3-5 gün | Opus 4.6 / GPT 5.4 | ⏸️ Ertelendi |
| Faz 3 | Checkout (önce iyzico-only) | 2-3 gün | Sonnet 4.6 / Composer 2 | ⬜ |
| Faz 4 | Admin sipariş | 2-3 gün | Sonnet 4.6 / Auto | ✅ **Tamamlandı** |
| Faz 5 | Post-ödeme | 1-2 gün | Sonnet 4.6 / Auto | 🔶 Kısmen *(domain / operasyon)* |
| Faz 6 | Test + Canlıya alış | 2-3 gün | Auto / Gemini 3.1 Pro | ⬜ **Sıradaki ana blok** *(Stripe hariç)* |
| Faz 7 | İndirim / Promo Kodları | 2-3 gün | Sonnet 4.6 | ✅ **Kod tamam** *(bkz. [Ortam kontrol listesi](#snapshot-env-checklist))* |

**İlk dalga (iyzico):** Stripe hariç çekirdek + sipariş + promo kodu kodlandı; **canlı öncesi** Faz 6 + Faz 5 kapanışı önerilir. Stripe eklendiğinde Faz 2 + Faz 3 tam birleşim.

### Dağıtım / sandbox kontrolü (iyzico — tamamlandı)

1. [x] Migration zinciri hedef DB’de (`025` … `030`; ayrıca **`031`** prod’da doğrula)
2. [x] `iyzipay` deploy ortamında kurulu
3. [x] Sunucu `.env`: `IYZICO_*` + `NEXT_PUBLIC_APP_URL` (commit edilmez)
4. [x] Callback + başarılı ödeme + DB (`orders` / `payment_events`) doğrulandı

### Sıradaki adım (özet)

**Stripe ve faturalama bilinçli olarak sonra.** Öncesinde: **[Faz 6](FAZ6_TEST_VE_CANLIYA_ALIS.md)** + **[Faz 5](FAZ5_POST_ODEME.md)** kalan maddeler; isteğe bağlı **[Faz 3](FAZ3_CHECKOUT.md)**.

---

## ✅ İlerleme takibi (bu dosya = özet ekran)

- **Evet:** Ödeme işinin **üst özetini** burada görmek için `docs/payment/PAYMENT_ROADMAP.md` dosyasını kullanın.
- Bir faz tamamlandığında:
  1. Bu dosyada **Faz Dosyaları** ve **Faz Durumu** tablolarındaki durumu güncelleyin (ör. ⬜ → ✅ veya 🟡 → ✅).
  2. İlgili **`FAZx_*.md`** içindeki checklist kutularını işaretleyin.
  3. Üstteki **Son güncelleme** satırına kısa not ekleyin (isteğe bağlı ama faydalı).

Böylece hem tek sayfada ilerleme hem de faz bazlı detay ayrı dosyada kalır.

---

## 🧭 Cursor: Ödeme sistemi uzmanı (rule / agent) — ne zaman?

**Amaç:** Ödeme konusunda hem **dokümantasyon** (`docs/payment/*`) hem **kod** (`lib/payment/*`, `lib/db/orders.ts`, `lib/pricing/payment-products.ts`, migration’lar, callback/webhook güvenliği) üzerinde tutarlı karar veren tek bir **Cursor Rule** (veya eşdeğer agent tanımı).

**Önerilen zamanlama (en mantıklı sıra):**

1. **Minimum (iyzico-first):** **[Faz 6](FAZ6_TEST_VE_CANLIYA_ALIS.md) bittikten sonra** — sandbox + canlıya alış deneyimi, tuzaklar ve env checklist kurala yazılmış olur.
2. **Tam kapsam (iyzico + Stripe):** Ayrıca **[Faz 2](FAZ2_STRIPE.md) kodlandıktan sonra** kuralı **bir kez güncelle**; böylece agent her iki sağlayıcı + geo-routing için de yetkili referans olur.

Erken fazlarda (Faz 0–1) kural yazmak mümkün ama sık sık revize edilir; **Faz 6 sonrası** oluşturmak “tek seferde doğru” oranı daha yüksek.

**Yapılacak iş:** `.cursor/rules/` altında yeni bir rule dosyası (ör. `payment-system.mdc`) — `alwaysApply: false` + `globs` ile `docs/payment/**`, `lib/payment/**`, `lib/db/orders.ts`, `lib/db/promo-codes.ts`, `app/api/payment/**`, `app/api/promo/**`, `migrations/025*.sql` … `031*.sql` odaklı.

---

## 🔗 İlgili Mevcut Dokümanlar

- `docs/roadmap/PHASE_4_ECOMMERCE.md` — E-ticaret genel planı
- `docs/analysis/ADMIN_DASHBOARD_ANALYSIS.md` — Admin panel analizi (Faz B.1: Sipariş Yönetimi)
- `docs/database/SCHEMA.md` — Mevcut DB şeması
- `lib/currency.ts` — Mevcut ülke/para birimi tespiti
- `app/api/cart/route.ts` — Mevcut sepet API'si
- `app/api/currency/route.ts` — Mevcut para birimi API'si
- [ODEME_NOTLARI.md](ODEME_NOTLARI.md) — Kısa günlük / hata notları

---

*Detaylı implementasyon adımları için ilgili faz dosyasına bakın.*
