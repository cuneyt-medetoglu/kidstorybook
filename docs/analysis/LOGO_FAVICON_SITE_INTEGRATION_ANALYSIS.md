# Logo & Favicon — Site Entegrasyonu Analizi

**Tarih:** 21 Mart 2026 (güncelleme: P0–P1 uygulandı; favicon şeffaflık notu; manifest `metadataBase` + middleware)  
**Amaç:** Marka görsellerinin `public/` ve `app/favicon.ico` üzerinden servis edilmesi, favicon/manifest/metadata ve UI’da tutarlı kullanım. *(Kaynak klasör `logo-favIcon/` repo’dan kaldırıldı — 2026; dosyalar `public/` içinde.)*  
**Not:** Aşağıdaki **Geliştirme fazları** bölümü implementasyon sırası için referanstır; **Faz 1–4** tamamlandı (21 Mart 2026). **Manifest:** `[locale]/layout.tsx` içinde `metadataBase` (köke göre mutlak URL); `middleware.ts` matcher’da `.webmanifest` uzantısı locale middleware’ine girmesin (aksi halde `/tr/site.webmanifest` 404).

---

## Yapılan işler (21 Mart 2026 — P0 + P1)

| Faz | Durum | Özet |
|-----|--------|------|
| **Faz 1** | ✅ | `favicon.ico` → `app/favicon.ico`. `logo.png` / `brand.png` + `apple-touch` + `android-chrome` + favicon PNG’leri → `public/`. (v2/v3 geçişleri geçmişte `logo-favIcon/` kaynağından kopyalandı; klasör silindi.) |
| **Faz 2** | ✅ | [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx): `metadata.icons` (SVG + ICO + 96×96 + Apple) ve `manifest: '/site.webmanifest'`. [public/site.webmanifest](../../public/site.webmanifest): `name` / `short_name` = HeroKidStory, `theme_color` = `#14b8a6`, ikon yolları. |
| **Faz 3** | ✅ | [Header.tsx](../../components/layout/Header.tsx) ve [Footer.tsx](../../components/layout/Footer.tsx): `next/image` ile `/logo.png` + [BrandWordmark](../../components/brand/BrandWordmark.tsx) (üç parça metin renkleri); mobil drawer; üst nav’da “Ana Sayfa” yok; `xl` altı hamburger. |
| **Faz 4** | ✅ | [lib/metadata.ts](../../lib/metadata.ts): `openGraph.images` ve `twitter.images` → mutlak URL ile `/brand.png` (2816×1536). |

**Güncelleme — `logo-favIcon/v2/` (şeffaf, sonra küçük görünüm):** SVG + ICO + 96×96; büyük SVG kaldırıldı.

**Güncelleme — `logo-favIcon/v3/` (tam set, kare odaklı):** `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192/512.png` → `public/` + `app/favicon.ico`. Tüm PNG’ler **RGBA** (alfa). [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx): ICO + 32 + 16 (SVG kullanılmıyor). `public/favicon.svg` ve `favicon-96x96.png` (v2 artığı) silindi. `site.webmanifest` kök şablonu boş isim / `#FFFFFF` theme içeriyordu; prod’da [public/site.webmanifest](../../public/site.webmanifest) (HeroKidStory + teal `theme_color`) korunur.

**Tek kaynak:** Sekme ikonu `metadata.icons` + `favicon.ico` / 16 / 32 PNG.

**Kaynak klasör:** `logo-favIcon/` kaldırıldı; tek kaynak `public/` + `app/favicon.ico`. Yeni export’lar doğrudan bu yollara konur veya Figma/Drive’da saklanır.

---

## Bilinen konu: sekme favicon’unda beyaz kutu (durum)

**Önceki durum:** İlk export’taki ICO/PNG’lerde opak beyaz zemin vardı.

**Güncel:** `v2` seti (şeffaf) deploy edildi; modern tarayıcılar **SVG** ile keskin ve şeffaf ikon gösterir. Hâlâ kutu görürsen önbelleği temizleyip sekneyi yeniden yükle; Safari/Edge davranışı farklı olabilir.

**İsteğe bağlı:** `apple-touch-icon` ve `android-chrome-*.png` hâlâ eski paketten ise, aynı marka ile `v2` tarzında yeniden export edilip `public/` üzerine yazılabilir (PWA / ana ekran).

---

## Geliştirme fazları (öncelik sırası)

**Öncelik işaretleri**

| İşaret | Anlam |
|--------|--------|
| **P0 — Acil** | Kullanıcı/sekme/marka tutarlılığı için temel; diğer fazlar buna bağlı veya 404/çift kaynak riski giderilir. |
| **P1 — Önemli** | Ürün hissi ve paylaşım; kısa vadede yapılmalı (launch öncesi ideal). |
| **P2 — Sonra** | Tutarlılık ve ek kanallar; P0–P1 bitince veya paralel düşük öncelikli sprint. |
| **P3 — İsteğe bağlı** | Operasyonel / basılı / e-posta; ürün çekirdeği olmadan ertelenebilir. |

---

### Faz 1 — Statik dosyalar ve tek kaynak (P0 — Acil) ✅ 21 Mart 2026

**Ne yapıldı:** Görseller `public/` ve `app/favicon.ico` olarak yerleştirildi. `public/icon.svg` ile çakışma: sekme ikonu için **metadata + `.ico` öncelikli**; `icon.svg` isteğe bağlı temizlik.

**Çıktı:** İkonlar servis edilir; favicon 404 riski giderildi.

---

### Faz 2 — Metadata, manifest ve head bağlantıları (P0 — Acil) ✅ 21 Mart 2026

**Ne yapıldı:** [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx) içinde `metadata.icons` + `manifest`. [public/site.webmanifest](../../public/site.webmanifest) dolduruldu (`name`, `short_name`, `theme_color`, ikonlar).

**Çıktı:** Sekme / Apple / Android ikon yolları tanımlı. *(Sekme görünümünde beyaz kutu için bkz. üstte **Bilinen konu**.)*

---

### Faz 3 — Ana shell: Header, Footer, mobil drawer (P1 — Önemli) ✅ 21 Mart 2026

**Ne yapıldı:** Header, Footer ve mobil drawer’da `/logo.png` + gradient metin; `alt="HeroKidStory"`, `priority` header’da.

**Çıktı:** Ana shell’de marka görseli kullanımda. *(Dark mode kontrastı gerekirse ayrı ince ayar.)*

---

### Faz 4 — SEO ve sosyal paylaşım görselleri (P1 — Önemli) ✅ 21 Mart 2026

**Ne yapıldı:** [lib/metadata.ts](../../lib/metadata.ts) içinde `openGraph.images` ve `twitter.images` → `/brand.png` (mutlak URL).

**Çıktı:** Varsayılan paylaşım görseli tanımlı. *(İleride sayfa bazlı OG görseli eklenebilir.)*

---

### Faz 5 — Auth ve Admin yüzeyleri (P2 — Sonra)

**Ne yapılır:** Login / register layout’larında üstte marka bloğu (`brand.png` veya küçük logo + başlık). [components/admin/admin-header.tsx](../../components/admin/admin-header.tsx) (veya eşdeğer) ile ana site ile aynı logo.

**Çıktı:** Giriş ve yönetim ekranlarında marka kopukluğu kalmaz.

---

### Faz 6 — PWA ve manifest cilası (P2 — Sonra)

**Ne yapılır:** `site.webmanifest` içinde `display`, markaya uygun `theme_color` (beyaz yerine teal/cyan tonu — [LOGO_BRIEF_AND_PROMPTS.md](./LOGO_BRIEF_AND_PROMPTS.md) paleti), splash benzeri deneyim için gereken ek meta (platforma göre).

**Çıktı:** “Uygulama gibi” kurulumda status bar ve splash renkleri marka ile uyumlu.

---

### Faz 7 — PDF, e-posta ve dış kanallar (P3 — İsteğe bağlı)

**Ne yapılır:** PDF üretiminde üstbilgi/altbilgi logo ([PDF_GENERATION_GUIDE.md](../guides/PDF_GENERATION_GUIDE.md)); varsa transactional e-posta HTML’inde logo URL’leri; basılı için yüksek çözünürlük / vektör kararı.

**Çıktı:** Basılı kitap ve e-posta ile web arasında görsel tutarlılık.

---

### Özet: ne acil, ne ertelenebilir?

| Kategori | Fazlar | Gerekçe |
|----------|--------|---------|
| **Acil (önce bunlar)** | Faz 1, Faz 2 | Dosya yoksa metadata işe yaramaz; çift `icon` kaynağı kafa karıştırır; 404 ve tutarsız sekme ikonu kullanıcıya kötü sinyal. |
| **Önemli (hemen ardından)** | Faz 3, Faz 4 | Ürün yüzü ve paylaşılan linklerde marka; launch öncesi checklist ([PHASE_5_LAUNCH.md](../roadmap/PHASE_5_LAUNCH.md)) ile örtüşür. |
| **Sonra** | Faz 5, Faz 6 | Tüm kullanıcı yolu ana siteden geçer; auth/admin/PWA daha dar kitle veya ikincil yüzey. |
| **İsteğe bağlı / operasyonel** | Faz 7 | PDF/e-posta üretimi ayrı süreç; web MVP’sinden bağımsız planlanabilir. |

**Önerilen uygulama sırası:** **1 → 2 → 3 → 4** zorunlu akış; **5 ↔ 6** sırası ekip tercihine göre değişebilir; **7** bağımsız ve paralel.

---

## Referans dokümanlar

| Doküman | İçerik |
|---------|--------|
| [LOGO_BRIEF_AND_PROMPTS.md](./LOGO_BRIEF_AND_PROMPTS.md) | Marka brief’i, teal/cyan paleti, kullanım bağlamları (header, favicon, splash, sosyal medya), 8 adet İngilizce logo prompt’u, `globals.css` / Header ile uyum notu |
| [BRAND_RENAME_KIDSTORYBOOK_TO_HEROKIDSTORY_ANALYSIS.md](./BRAND_RENAME_KIDSTORYBOOK_TO_HEROKIDSTORY_ANALYSIS.md) | KidStoryBook → HeroKidStory geçişi; domain, env, tutarlı marka adı |
| [THEME_AND_COLOR_GUIDE.md](../guides/THEME_AND_COLOR_GUIDE.md) | `--primary`, `--brand-2` ve gradient kullanımı (logo ile görsel uyum) |
| [DESIGN_TOKEN_IMPLEMENTATION.md](../implementation/DESIGN_TOKEN_IMPLEMENTATION.md) | Semantik renk token’ları (UI ile logo rengi hizası) |
| [PHASE_5_LAUNCH.md](../roadmap/PHASE_5_LAUNCH.md) | Launch’ta “logo ve şirket bilgileri yerleşimi” maddeleri |
| [DOCUMENTATION.md](../DOCUMENTATION.md) | Proje doküman indeksi |

**Güncel:** Header/Footer ve mobil drawer’da `/logo.png` + gradient metin kullanılıyor. Brief’teki eski “yalnızca metin” notu [LOGO_BRIEF_AND_PROMPTS.md](./LOGO_BRIEF_AND_PROMPTS.md) içinde tarihsel referans olarak kalabilir; istenirse o dosyada tek cümle güncelleme yapılabilir.

---

## Mevcut kaynaklar (`public/` — üretim)

| Dosya | Tipik kullanım |
|-------|----------------|
| `logo.png` | Header + footer marka ikonu (`next/image`) |
| `brand.png` | OG/Twitter varsayılan görseli |
| `favicon.ico` (kök + `app/`) | Sekme ikonu |
| `favicon-16x16.png`, `favicon-32x32.png` | `<link rel="icon">` |
| `apple-touch-icon.png` | iOS |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | PWA / manifest |
| [site.webmanifest](../../public/site.webmanifest) | `name`, `short_name`, `theme_color` |

**Taşıma hedefi (Next.js App Router ile uyumlu öneri):**

- Statik dosyalar **`public/`** altında: örn. `public/favicon.ico`, `public/apple-touch-icon.png`, `public/android-chrome-192x192.png`, `public/android-chrome-512x512.png`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/site.webmanifest`.
- Alternatif: Next 13+ dosya konvansiyonu **`app/favicon.ico`** (tek dosya için); çoklu ikon + manifest için `public/` + `metadata.icons` veya `head` link’leri genelde daha net.
- **`logo.png` / `brand.png`:** `public/` altında anlamlı isimlerle (ör. `public/brand/logo.png`, `public/brand/brand-hero.png`) veya `public/logo.png` — ekip içi isimlendirme kararı.

`site.webmanifest` içindeki `icons[].src` değerleri, dosyaların gerçekten `public/` köküne kopyalandığında `/android-chrome-*.png` olarak çalışır; **`name` ve `short_name`** alanlarının “HeroKidStory” ile doldurulması gerekir.

---

## Metadata & SEO (güncel)

- **`app/[locale]/layout.tsx`:** `buildPageMetadata` + `metadata.icons` + `manifest`.
- **`lib/metadata.ts`:** `openGraph.images` ve `twitter.images` → `/brand.png`.
- **`public/icon.svg`:** İsteğe bağlı; favicon seti metadata + `app/favicon.ico` ile tanımlı.

---

## UI entegrasyonu (Header, footer, mobil) — uygulandı

- **Header / mobil drawer / Footer:** `/logo.png` + gradient metin; `next/image`, `priority` header’da.
- **İsteğe bağlı iyileştirme:** Footer’da daha küçük wordmark; dark mode için ayrı asset veya CSS filtresi.

---

## Önerilen ek işler (kapsam genişletme)

1. **Admin panel** (`components/admin/…`): Aynı logo seti ile üst bar tutarlılığı.
2. **Auth sayfaları** (login/register): Marka bloğu için `brand.png` veya kilit.
3. **E-posta şablonları** (varsa): Inline veya CDN URL ile logo.
4. **PDF / baskı** ([PDF_GENERATION_GUIDE.md](../guides/PDF_GENERATION_GUIDE.md) — marka satırı): Basılı çözünürlük için vektör veya yüksek DPI PNG.
5. **PWA:** `site.webmanifest` içinde `theme_color` teal olarak ayarlandı; ek splash/meta (Faz 6).
6. **Erişilebilirlik:** Logo için `alt="HeroKidStory"` kullanılıyor.
7. **Favicon şeffaflık:** Kaynak ICO/PNG şeffaf yeniden export (üstte **Bilinen konu**).

---

## Özet kontrol listesi (faz eşlemesi)

| # | Madde | Faz |
|---|--------|-----|
| 1 | Görseller `public/` + `app/favicon.ico`, `icon.svg` isteğe bağlı | Faz 1 ✅ |
| 2 | `metadata` / favicon / apple-touch / manifest yolu | Faz 2 ✅ |
| 3 | `site.webmanifest`: `name`, `short_name`, ikon yolları | Faz 2 ✅ (+ Faz 6 cilası) |
| 4 | Header + footer + mobil menü: logo + tipografi | Faz 3 ✅ |
| 5 | OG + Twitter görseli | Faz 4 ✅ |
| 6 | Auth + Admin logo | Faz 5 |
| 7 | PDF + e-posta logo | Faz 7 |

---

**Sonuç:** **Faz 1–4** tamamlandı (21 Mart 2026). Sırada **Faz 5–7** (auth/admin, PWA cilası, PDF/e-posta). Favicon’da beyaz kutu için **tasarım kaynağından şeffaf export** önerilir (üstte **Bilinen konu**).
