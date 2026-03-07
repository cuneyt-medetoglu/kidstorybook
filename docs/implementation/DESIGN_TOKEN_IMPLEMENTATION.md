# Design Token – Renk Sistemi İmplementasyonu

**İlgili ROADMAP görevi:** 2.1.9 – Renk Teması ve Tema Gözden Geçirmesi  
**Tamamlanma tarihi:** 7 Mart 2026  
**Kullanıcı rehberi:** `docs/guides/THEME_AND_COLOR_GUIDE.md`

---

## Özet

Tüm site genelinde (~46 dosya) hardcoded renk class'ları (`purple-X`, `pink-X`) kaldırılarak CSS değişkenlerine dayalı design token sistemi kuruldu. Artık renk değişimi **tek dosyadan** (`app/globals.css`) yapılıyor.

---

## Faz 1 — Token Altyapısı

### `app/globals.css`
- `--primary`, `--brand-2`, `--accent`, `--ring` token'ları eklendi (HSL formatında)
- Aktif palet: **Teal → Cyan** (çocuk dostu, macera/deniz teması)
- 5 hazır palet alternatifi comment olarak hazır:
  - 🟣 Purple → Pink (eski varsayılan)
  - 🔵 Indigo → Blue (güven/teknoloji)
  - 🟠 Orange → Amber (sıcak/enerjik)
  - 🟢 Emerald → Green (doğa/büyüme)
- Dark mode karşılıkları da aynı yapıyla hazır

### `tailwind.config.ts`
- `primary` token'ına `<alpha-value>` desteği eklendi (`bg-primary/5` gibi opacity varyantları için)
- `brand-2` yeni Tailwind rengi olarak eklendi
- `accent` token'ına `<alpha-value>` desteği eklendi

---

## Faz 2 — Bileşen Migrasyonu

### Migrasyon kapsamı (46 dosya)

| Kategori | Dosyalar |
|----------|---------|
| **Layout** | `Header.tsx`, `Footer.tsx`, `CookieConsentBanner.tsx` |
| **Sections** | `Hero.tsx`, `HeroBookTransformation.tsx`, `HowItWorks.tsx`, `FeaturesSection.tsx`, `PricingSection.tsx`, `FAQSection.tsx`, `ExampleBooksCarousel.tsx`, `CampaignBanners.tsx` |
| **Auth** | `login/page.tsx`, `register/page.tsx`, `forgot-password/page.tsx`, `verify-email/page.tsx`, `callback/page.tsx` |
| **Create Wizard** | `step1–6/page.tsx`, `from-example/page.tsx` |
| **App Pages** | `dashboard/page.tsx`, `dashboard/settings/page.tsx`, `examples/page.tsx`, `examples/loading.tsx`, `pricing/page.tsx`, `cart/page.tsx`, `checkout/success/page.tsx`, `draft-preview/page.tsx`, `books/[id]/settings/page.tsx` |
| **Book Viewer** | `book-viewer.tsx`, `book-page.tsx`, `page-thumbnails.tsx`, `EditHistoryPanel.tsx`, `ImageEditModal.tsx`, `RegenerateImageModal.tsx` |
| **Checkout** | `CheckoutForm.tsx`, `CartSummary.tsx`, `PlanSelectionModal.tsx` |
| **Debug** | `DebugQualityPanel.tsx` |

### Dönüşüm kuralları uygulandı

| Eski | Yeni |
|------|------|
| `from-purple-500 to-pink-500` | `from-primary to-brand-2` |
| `text-purple-600 dark:text-purple-400` | `text-primary` |
| `bg-purple-50 dark:bg-purple-900/20` | `bg-primary/5` |
| `border-purple-200 dark:border-purple-800` | `border-primary/20` |
| `ring-purple-500` | `ring-primary` |
| `from-purple-50 via-white to-pink-50` | `from-primary/5 via-white to-brand-2/5` |

---

## Faz 3 — Doğrulama + Dokümantasyon + Palet Örnekleri

- ✅ TypeScript kontrolü: yeni TS hatası yok (mevcut pre-existing hatalar değişmedi)
- ✅ Kalan hardcoded renk taraması: `text-red-*`, `text-green-*`, `text-yellow-*` → semantik (hata/başarı/uyarı) olduğu için korundu; bunlar brand rengi değil
- ✅ `docs/guides/THEME_AND_COLOR_GUIDE.md` yazıldı
- ✅ `public/palette-preview.html` → `docs/palette-preview.html` taşındı (dev tool, public'te gerekmez)

---

## Dokunulmayan Dosyalar (kasıtlı)

- `components/ui/` — shadcn'in 17 bileşeni; zaten semantic token kullanıyor, otomatik güncellenir
- `lib/prompts/` — AI prompt metinleri; renk referansları hikaye içeriği (marka rengi değil)
- `lib/config/hero-transformation.ts` — intentional gradient config
- `app/books/[id]/view/` — TTS/viewer sayfası; renk bağımlılığı yok

---

## Teknik Notlar

- `<alpha-value>` Tailwind sözdizimi, CSS değişkeninden otomatik opacity türetmeyi sağlar. Örnek: `bg-primary/20` → `hsl(var(--primary) / 0.2)`
- Dark mode: Token'lar `.dark` CSS selector altında ayrı HSL değerleri alıyor. Bileşenlerde ayrıca `dark:text-*` class yazmaya gerek yok.
- Palet değiştirme: `globals.css`'deki aktif satırları comment'le, alternatif satırları uncomment et. Hem `:root` hem `.dark` bloklarını güncelle. Detay: `THEME_AND_COLOR_GUIDE.md`
