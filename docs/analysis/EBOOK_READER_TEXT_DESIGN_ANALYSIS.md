# Ebook Reader — Metin & Arka Plan Tasarım Analizi

> **Durum:** Uygulandı — 11 Nisan 2026

---

## Problem

PDF export'ta metin sayfaları şu özelliklere sahip:
- Cümle cümle bölünmüş `<p>` etiketleri
- Alegreya serif font, 17pt, line-height 1.85
- `yildizli-kiyi-p48.svg` arka plan deseni (full-bleed SVG katmanı)

Ebook reader'da (BookPage) ise:
- Tüm metin tek `<p>` bloğu — duvar gibi
- Sistem sans-serif fontu
- Düz beyaz arka plan, dekoratif eleman yok

---

## Uygulanan Çözüm

### 1. Paylaşımlı Metin Bölme Utility'si
**Dosya:** `lib/utils/story-text.ts`

`splitStoryText()` fonksiyonu — PDF generator'daki `formatText()` ile aynı mantık:
- Satır sonlarına böl → her blok içinde cümle sonlarına böl
- `string[]` döndürür (React rendering için)

### 2. Alegreya Font Entegrasyonu
**Dosyalar:** `app/[locale]/layout.tsx`, `tailwind.config.ts`

- `next/font/google` ile Alegreya yüklendi (`--font-story` CSS variable)
- Tailwind'de `font-story` utility class'ı tanımlandı
- `display: 'swap'` — performans için font-display stratejisi

### 3. StoryTextPanel Bileşeni
**Dosya:** `components/book-viewer/book-page.tsx`

Tüm layout modlarında (landscape, flip, stacked) kullanılan dahili bileşen:

| Özellik | Eski | Yeni |
|---|---|---|
| Metin bölünmesi | Tek `<p>` | Cümle başına `<p>` |
| Font | System sans | Alegreya serif (`font-story`) |
| Satır yüksekliği | leading-relaxed (1.625) | `leading-[1.85]` |
| Max genişlik | Sınırsız | `max-w-[38ch]` |
| Arka plan | Yok | `yildizli-kiyi-p48.svg` |
| Dark mode | — | `opacity-[0.10]`, `brightness-150`, `contrast-75` |

### 4. Dark Mode Uyumu
- Light: SVG `opacity-[0.30]` — belirgin ama okunabilirliği bozmayan
- Dark: SVG `opacity-[0.10]` + `brightness-150` + `contrast-75` — loş, zarif

---

## Değiştirilen Dosyalar

| Dosya | Değişiklik |
|---|---|
| `lib/utils/story-text.ts` | **Yeni** — metin bölme utility |
| `components/book-viewer/book-page.tsx` | StoryTextPanel + tüm layout modları güncellendi |
| `app/[locale]/layout.tsx` | Alegreya font yüklemesi |
| `tailwind.config.ts` | `fontFamily.story` eklendi |

## Referans Dosyalar (değişmedi)

| Dosya | Konu |
|---|---|
| `lib/pdf/generator.ts` | PDF `formatText()` — referans alınan mantık |
| `lib/pdf/templates/book-styles.css` | PDF tipografi değerleri |
| `public/pdf-backgrounds/yildizli-kiyi-p48.svg` | Ortak arka plan SVG |
