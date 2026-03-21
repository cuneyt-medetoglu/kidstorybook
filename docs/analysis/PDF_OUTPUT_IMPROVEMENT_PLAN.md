# PDF Çıktı İyileştirme Planı

**Tarih:** 22 Mart 2026 · **Durum:** Analiz + HTML önizleme · **Faz:** 5.7 · **Kod:** henüz yok (sadece plan + `public/pdf-preview-test.html`)

---

## Kısa özet (30 saniye)

| Ne istiyoruz? | Şu an | Hedef |
|---------------|--------|--------|
| Kapak | A4 yatay spread (sol görsel \| sağ başlık) | **Tek sayfa A5 dikey**, full-bleed görsel + altta başlık + **küçük logo + `herokidstory`** |
| İçerik | A4 yatay spread | **Aynı** (değişmeyecek) |
| Arka kapak | Yok | **Tek sayfa A5 dikey** — Header’daki gibi **`logo.png` + renkli HeroKidStory** + tagline + URL |
| Deneme | — | **`/pdf-preview-test.html`** ile önce görsel onay, sonra kod |

**Marka kuralı:** Kapakta üç renkli “Hero / Kid / Story” wordmark **yok**; sadece **küçük logo + `herokidstory`** metni. Arka kapakta ana sayfa gibi **logo + HeroKidStory** (wordmark renkleri `BrandWordmark.tsx` ile uyumlu).

---

## Referanslar

- **Rehber:** `docs/guides/PDF_GENERATION_GUIDE.md`, `docs/guides/PDF_GENERATION_TEST_GUIDE.md`
- **Kod:** `lib/pdf/generator.ts`, `lib/pdf/templates/book-styles.css`, `lib/pdf/image-compress.ts`, `app/api/books/[id]/generate-pdf/route.ts`
- **Önizleme:** `public/pdf-preview-test.html`
- **Marka:** `components/brand/BrandWordmark.tsx`, `components/layout/Header.tsx`, `public/logo.png`
- **Agent:** `.cursor/rules/pdf-generation-manager.mdc` — PDF işlerinde tek yönlendirici
- **Bağlam:** `docs/technical/MONOLITH_VS_SPLIT_ANALYSIS.md` (Puppeteer yükü)

---

## Hedef sayfa sırası

1. **Ön kapak** — A5 portrait (148.5 × 210 mm): görsel tam sayfa, başlık gradient üzerinde, en altta logo + `herokidstory`.
2. **Spread’ler** — A4 landscape (297 × 210 mm): mevcut [görsel \| metin] alternansı.
3. **Arka kapak** — A5 portrait: logo + HeroKidStory wordmark (Header ile aynı mantık), kısa metin, `herokidstory.com`.

---

## Teknik not (mixed page size)

Farklı sayfa boyutları için CSS **named `@page`** + `page: ...` ataması planlanıyor; Puppeteer/Chrome davranışı **HTML önizleme + gerçek PDF** ile doğrulanmalı. Sorun çıkarsa yedek: iki PDF + `pdf-lib` ile birleştirme (planda detay).

---

## Sonraki adımlar

1. `pdf-preview-test.html` ile kapak + arka kapak onayı  
2. `generator.ts` + `book-styles.css` entegrasyonu  
3. `PDF_GENERATION_GUIDE.md` güncellemesi  
4. Gerçek export + isteğe bağlı baskı testi  

---

## Kaybedilmemesi için detaylar (kısa)

- **Sıkıştırma / limit:** 50 MB; `image-compress.ts` + route içi akış — `PDF_GENERATION_GUIDE.md`.
- **Timeout:** Büyük base64 içerikte navigation timeout; `generator.ts` ayarı.
- **Hard copy:** İleride bleed (~3 mm) eklenebilir.

**Son güncelleme:** 22 Mart 2026
