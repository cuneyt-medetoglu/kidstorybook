# Renk Teması ve Tema Yönetimi

**Durum:** ✅ Tamamlandı — Design Token sistemi kuruldu ve tüm bileşenler migrate edildi  
**Güncelleme:** 7 Mart 2026

---

## TL;DR — Rengi Nasıl Değiştirirsin?

**`app/globals.css` dosyasını aç → Aktif palet satırlarını comment'le → Alternatif paleti uncomment et → Kaydet.**  
Başka hiçbir dosyaya dokunmana gerek yok. Site genelinde (~50 bileşen, ~400+ renk referansı) otomatik güncellenir.

```css
/* app/globals.css — :root içinde bu satırları değiştir: */

/* 🟢 AKTİF — Teal → Cyan */
--primary:  174 72% 40%;   /* ← bu 2 satır */
--brand-2:  189 94% 43%;   /* ← bu 2 satır */

/* Alternatif: Purple → Pink — sadece yorumu kaldır */
/* --primary:  262 83% 58%;
   --brand-2:  330 81% 60%; */
```

`.dark` bloğu için de aynı şekilde (dark mode karşılıkları).

---

## 1. Mimari

```
app/globals.css          ← TEK KAYNAK — sadece burada HSL değerleri
     │
     ▼
tailwind.config.ts       ← CSS var'ları Tailwind utility'lerine bağlar
     │                      primary: hsl(var(--primary) / <alpha-value>)
     ▼                      brand-2: hsl(var(--brand-2) / <alpha-value>)
Tüm bileşenler           ← from-primary, text-primary, bg-primary/5 ...
```

### Token'lar

| Token                   | Light mode          | Dark mode           | Renk                        |
| ----------------------- | ------------------- | ------------------- | --------------------------- |
| `--primary`             | `174 72% 40%`       | `174 62% 50%`       | Teal-500 / Teal-400         |
| `--brand-2`             | `189 94% 43%`       | `188 85% 53%`       | Cyan-500 / Cyan-400         |
| `--primary-foreground`  | `0 0% 100%`         | `0 0% 10%`          | Beyaz / Koyu                |
| `--brand-2-foreground`  | `0 0% 100%`         | `0 0% 10%`          | Beyaz / Koyu                |
| `--accent`              | `166 76% 97%`       | `174 40% 12%`       | Teal-50 / Koyu teal         |
| `--ring`                | `174 72% 40%`       | `174 62% 50%`       | Primary ile aynı            |

### Opacity varyantları

`<alpha-value>` desteği sayesinde tek token'dan tüm opasite varyantları üretilir:

```
bg-primary          → hsl(var(--primary))           solid
bg-primary/5        → hsl(var(--primary) / 0.05)     %5 opasite
bg-primary/10       → hsl(var(--primary) / 0.10)     %10
bg-primary/20       → hsl(var(--primary) / 0.20)     %20
border-primary/30   → border rengi %30 opasite
from-primary        → gradient başlangıcı
```

---

## 2. Hazır Palet Alternatifleri

`globals.css` dosyasında her palet için hazır comment'ler mevcut:

| Palet | Primary | Brand-2 | Kullanım |
|-------|---------|---------|---------|
| 🟢 **Teal → Cyan** *(aktif)* | `174 72% 40%` | `189 94% 43%` | Macera, deniz, çocuk dostu |
| 🟣 **Purple → Pink** | `262 83% 58%` | `330 81% 60%` | Klasik, AI uygulamaları |
| 🔵 **Indigo → Blue** | `239 84% 67%` | `217 91% 60%` | Güven, teknoloji |
| 🟠 **Orange → Amber** | `25 95% 53%` | `38 92% 50%` | Sıcak, enerjik |
| 🟢 **Emerald → Green** | `160 84% 39%` | `142 71% 45%` | Doğa, büyüme |

**Önizleme:** Tarayıcıda `docs/palette-preview.html` — config = `app/globals.css`.

### Adım adım palet değiştirme

1. `app/globals.css` aç
2. `:root` bloğunda `/* 🟢 AKTİF */` satırlarını `/* ... */` ile comment'le
3. İstediğin alternatif palet satırlarının başındaki `/*` ve `*/` işaretlerini kaldır
4. `.dark` bloğunda aynı işlemi yap (her palet için dark karşılıkları da hazır)
5. Kaydet — dev server otomatik günceller

---

## 3. Kullanım Kuralları

### Yeni bileşen yazarken

```tsx
// ✅ DOĞRU — Token kullan
className="bg-gradient-to-r from-primary to-brand-2"
className="text-primary"
className="border-primary/20"
className="bg-primary/5"
className="ring-primary"

// ❌ YANLIŞ — Hardcoded renk yazma
className="from-purple-500 to-pink-500"
className="text-purple-600"
className="border-purple-200"
```

### Dönüşüm tablosu

| Eski (hardcoded)                             | Yeni (token)                    |
| -------------------------------------------- | ------------------------------- |
| `from-purple-500 to-pink-500`                | `from-primary to-brand-2`       |
| `text-purple-600 dark:text-purple-400`       | `text-primary`                  |
| `bg-purple-50 dark:bg-purple-900/20`         | `bg-primary/5`                  |
| `bg-purple-100 dark:bg-purple-900/30`        | `bg-primary/10`                 |
| `border-purple-200 dark:border-purple-800`   | `border-primary/20`             |
| `ring-purple-500 / focus:ring-purple-500`    | `ring-primary`                  |
| `from-purple-50 via-white to-pink-50`        | `from-primary/5 via-white to-brand-2/5` |
| `hover:text-purple-600 dark:hover:...`       | `hover:text-primary`            |

**Dark mode class'larına gerek yok** — token dark/light'ı kendi içinde yönetir.

---

## 4. `tailwind.config.ts` — Token Tanımları

```ts
primary: {
  DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
  foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
},
'brand-2': {
  DEFAULT: 'hsl(var(--brand-2) / <alpha-value>)',
  foreground: 'hsl(var(--brand-2-foreground) / <alpha-value>)',
},
accent: {
  DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
  foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
},
```

---

## 5. Kapsam

Bu sistem tüm site bileşenlerini kapsar (~50 dosya):

| Kategori | Dosyalar |
|----------|---------|
| Layout | Header, Footer, CookieConsentBanner |
| Sections | Hero, HeroBookTransformation, HowItWorks, FeaturesSection, PricingSection, FAQSection, ExampleBooksCarousel, CampaignBanners |
| Auth | login, register, forgot-password, verify-email, callback |
| Create Wizard | step1–6, from-example |
| App Pages | dashboard, examples, pricing, cart, checkout/success, draft-preview, books/settings |
| Book Viewer | book-viewer, book-page, page-thumbnails, EditHistoryPanel, ImageEditModal, RegenerateImageModal |
| Checkout | CheckoutForm, CartSummary, PlanSelectionModal |

**Dokunulmayan (zaten temiz):**
- `components/ui/` (17 shadcn bileşeni) — semantic token kullanıyor, otomatik güncellenir
- `lib/prompts/` — AI prompt içerikleri, marka rengi değil
- `lib/config/hero-transformation.ts` — gradient config, intentional design

---

## 6. Özet

| Soru | Cevap |
|------|-------|
| Rengi değiştirmek için kaç dosya? | **1 dosya** (`globals.css`) |
| Kaç satır güncelleme? | **4 satır** (primary + brand-2, light + dark) |
| Bileşenler otomatik güncellenir mi? | **Evet** — tüm ~50 bileşen |
| Dark mode ayrıca yazılmalı mı? | **Hayır** — token dark mode'u yönetir |
| Yeni bileşende ne kullanmalıyım? | `text-primary`, `from-primary`, `bg-primary/5` ... |

*Son güncelleme: 7 Mart 2026*
