# 2.5.1.8 — Loading States & Skeleton Screens: Kod İncelemesi

**Tarih:** 11 Nisan 2026  
**Kapsam:** Tüm uygulama (özellikle E-book Viewer — roadmap 2.5.1.8'in asıl hedefi)  
**Sonuç:** ✅ Tamamlandı — 3 eksik giderildi (11 Nisan 2026)

---

## Özet Karar

> **Not kapatılabilir.** Eksikler giderildi (11 Nisan 2026): `book-page.tsx` image placeholder, `page-thumbnails.tsx` skeleton, `books/[id]/loading.tsx` skeleton layout — üçü de implement edildi.

---

## ✅ Ne Tamamlandı

| Yer | Ne yapıldı |
|-----|-----------|
| `books/[id]/loading.tsx` | Route-level Next.js loading fallback (Loader2 spinner) |
| `book-viewer.tsx` — `isLoadingBook` | Kitap verisi API'den gelene kadar tam sayfa spinner |
| `book-viewer.tsx` — TTS `isLoading` | Play butonu spinner'a dönüşüyor, `disabled` + `aria-label` doğru |
| `EditHistoryPanel.tsx` | Geçmiş yüklenirken Loader2 spinner |
| `RegenerateImageModal.tsx` / `ImageEditModal.tsx` | Submit butonlarında Loader2 |
| `dashboard/loading.tsx` | Skeleton component kullanan route fallback |
| `examples/page.tsx` — `BookCardSkeleton` | Kitap listesi yüklenirken animate-pulse grid |
| `cart/page.tsx` / `checkout/page.tsx` | `useCart().isLoading` → animate-pulse blokları |
| `CartContext`, `CurrencyContext` | Context seviyesinde `isLoading` expose ediliyor |
| `Button` componenti | `loading` prop → Loader2 + `aria-busy` |

---

## ❌ Eksik / Hatalı — 3 Madde

### 1. `book-page.tsx` — Sayfa görseli geçişlerinde placeholder yok ⚠️ ÖNEMLİ

Kullanıcı sayfalar arasında geçiş yaparken `<Image>` komponenti herhangi bir placeholder olmadan yükleniyor. Hızlı bağlantıda göze çarpmaz ama yavaş/mobil bağlantıda beyaz/boş alan görünüyor.

**Sorun:** Tüm `<Image>` öğeleri `priority` + `unoptimized` ile tanımlanmış ama `placeholder` veya manuel `onLoad` yönetimi yok.

**Çözüm (basit):**
```tsx
// book-page.tsx içinde her <Image>'a eklenecek
const [imgLoaded, setImgLoaded] = useState(false)

<div className="relative ...">
  {!imgLoaded && (
    <div className="absolute inset-0 animate-pulse bg-muted rounded-xl" />
  )}
  <Image
    ...
    onLoad={() => setImgLoaded(true)}
    className={cn("object-contain transition-opacity", imgLoaded ? "opacity-100" : "opacity-0")}
  />
</div>
```

---

### 2. `page-thumbnails.tsx` — Thumbnail grid'de skeleton yok ⚠️ ÖNEMLİ

Thumbnail paneli açıldığında 8–14 küçük görsel eş zamanlı yükleniyor, hiçbirinde placeholder yok. Görsel kirlilik yaratıyor.

**Çözüm (basit):**
```tsx
// Her thumbnail button içine
const [loaded, setLoaded] = useState(false)
{!loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
<Image ... onLoad={() => setLoaded(true)} />
```

Ya da `Skeleton` component kullanılabilir (zaten `components/ui/skeleton.tsx` var).

---

### 3. `books/[id]/loading.tsx` — Skeleton değil, generic spinner ℹ️ KÜÇÜK

Kitap sayfası yüklenirken tam layout'u yansıtan bir skeleton yerine sadece merkezi bir Loader2 gösteriliyor. Kullanıcı neyin yükleneceğini bilmiyor (CLS riski).

**Mevcut:**
```
[    Loader2 spinner    ]
```

**Olması gereken (ideal):**
```
[████████████] [░░░░░░░░░]   ← iki sütun (görsel + metin) pulse placeholder
```

Bu madde düşük öncelik — çalışıyor, sadece daha iyi olabilir.

---

## ⚠️ Uygulama Geneli Tutarsızlıklar

| Sorun | Nerede |
|-------|--------|
| `Skeleton` component hem kullanılıyor hem kullanılmıyor | Dashboard: `Skeleton` import ✅ / Examples + cart/checkout: raw `animate-pulse` div ❌ |
| Spinner stili karışık | `book-viewer.tsx` → CSS ring / Diğerleri → `Loader2` |
| Admin promo list → "Yükleniyor..." metin | Diğer admin sayfaları spinner gösteriyor — tutarsız |

Bu tutarsızlıklar fonksiyonel değil, görsel. Kritik değil ama temizlenebilir.

---

## Uygulanan Düzeltmeler (11 Nisan 2026)

| Madde | Durum | Değişen Dosya |
|-------|-------|---------------|
| `book-page.tsx` image placeholder | ✅ Yapıldı | `components/book-viewer/book-page.tsx` |
| `page-thumbnails.tsx` skeleton | ✅ Yapıldı | `components/book-viewer/page-thumbnails.tsx` |
| `books/[id]/loading.tsx` skeleton layout | ✅ Yapıldı | `app/[locale]/(public)/books/[id]/loading.tsx` |
| Uygulama geneli spinner/Skeleton tutarlılığı | 🟢 Backlog | — ayrı refactor notu |

**Teknik yaklaşım:**
- `book-page.tsx`: `ImageWithSkeleton` adlı küçük bir iç component çıkarıldı. `src` değiştiğinde `useEffect` ile `loaded` state sıfırlanıyor, `onLoad` ile görsel fade-in yapıyor. Tüm 3 layout moduna (landscape, flip, stacked) uygulandı.
- `page-thumbnails.tsx`: Her thumbnail için `ThumbnailItem` sub-component ile kendi `useState` yönetimi. Görsel yüklenene kadar `animate-pulse bg-muted`, yüklendikten sonra gradient overlay gösteriliyor.
- `loading.tsx`: Generic spinner yerine gerçek book viewer layout'unu yansıtan `Skeleton` blokları (top bar + image panel + text panel + bottom controls).

---

*Bu doküman 11 Nisan 2026 tarihli kod incelemesine dayanmaktadır.*
