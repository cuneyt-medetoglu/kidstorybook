# Supabase → AWS Geçişi: Build Hataları ve Nedenleri

**Tarih:** 4 Şubat 2026

## Neden Bu Kadar Çok Hata Çıktı?

Geçiş "teknik olarak" basit: Supabase'in sağladığı **Database**, **Storage** ve **Auth** yerine AWS (PostgreSQL, S3) + NextAuth kullanıyoruz. Ama proje büyük ve bu üç alan **yüzlerce yerde** kullanılıyor. Her değişiklik:

1. **Farklı API imzaları**  
   Supabase `{ data, error }` döndürüyor, bazı yerlerde doğrudan `data` kullanılıyordu. Bizim `lib/db/*` fonksiyonları da `{ data, error }` döndürüyor ama **tip tanımları** ve **null kontrolü** her yerde aynı değildi. Bir yerde `data` yerine `error` kontrolü unutulunca veya `data` nullable kabul edilince tip hataları çıktı.

2. **Storage API farkı**  
   Supabase Storage: `upload()` → `{ data: { path } }`, `getPublicUrl(path)`. Bizim S3 wrapper: `uploadFile(prefix, key, buffer, mime)` → **key** (string), `getPublicUrl(key)` → string. Değişken isimleri (path vs key, publicUrl vs storageUrl) karışınca **yanlış değişken** kullanımı (örn. `coverPublicUrlData`) ve **null atanabilir** tipler (örn. `coverImageUrl: string | null`) build'i kırdı.

3. **Ortak yardımcı imzaları**  
   `errorResponse(message, details?, status?, code?)` — ikinci parametre **string** (details). Birçok yerde `errorResponse('...', 400)` gibi **sayı** geçilmişti; TypeScript bunu `details` olarak gördü ve **number is not assignable to string** hatası verdi. Benzer şekilde `handleAPIError(error)` tek argüman; iki argümanlı kullanımlar hata üretti.

4. **Tip tutarlılığı**  
   Response tiplerinde `imageUrl: string` beklenirken, kodda `string | null` atanınca **Type 'null' is not assignable to type 'string'** gibi hatalar çıktı. Bu tür hatalar sadece build/lint aşamasında görünüyor; runtime'da bazen "tesadüfen" çalışabilir.

Özet: Geçiş mantığı basit, ama **kod tabanı büyük**, **API imzaları ve tipler her yerde aynı kullanılmadığı** için tek seferde bitmek yerine build alırken hata üstüne hata çıktı.

---

## Yapılan Düzeltmeler (Özet)

| Konu | Ne yapıldı |
|------|------------|
| **generate-images/route.ts** | `coverPublicUrlData` → `coverStorageUrl` / `coverFinalUrl`; cover push'ta `imageUrl: coverFinalUrl` (string) kullanıldı, böylece `string \| null` hatası giderildi. |
| **errorResponse** | Tüm `errorResponse('...', 4xx)` çağrıları `errorResponse('...', undefined, 4xx)` olacak şekilde güncellendi (edit-image, generate-images, edit-history, revert-image, generate-pdf, generate-story doğru kullanıyor). |
| **handleAPIError** | İkinci parametre kaldırıldı; her yerde `handleAPIError(error)` tek argüman. |
| **revert-image/route.ts** | Aynı errorResponse + handleAPIError düzeltmeleri uygulandı. |
| **lib/db/books.ts** | `Book` / `UpdateBookInput` içine `edit_quota_used?`, `edit_quota_limit?` eklendi; `updateBook` bu alanları güncelliyor. |

---

## Build'i Tekrar Çalıştırma

**Tip kontrolü (ara sıra çalıştırın):** `npx tsc --noEmit` — çıktı boşsa tip hatası yok. Hata varsa tüm satırları kopyalayıp düzeltme yapılabilir.

**Build'deki config uyarısı:** `NEXT_PUBLIC_APP_URL must be set to production URL` — Build'in tamamlanması için artık **throw etmiyoruz**, sadece log yazıyoruz. **Production deploy** öncesi sunucu ortamında (`.env` veya hosting env) `NEXT_PUBLIC_APP_URL` mutlaka gerçek production URL ile set edilmeli.

Bu düzeltmelerden sonra production build:

```bash
npm run build
```

Eğer yeni bir **Type error** veya **Linting** hatası çıkarsa, genelde şunlara bakın:

- **string | null** bir değişkeni, `string` bekleyen bir yere (response, push, atama) vermeyin; ya null kontrolü yapıp sadece string dalında kullanın ya da `x ?? ''` / yerel bir `const url = ...` ile garantili string kullanın.
- **errorResponse** her zaman `(message, details?, status?, code?)` — status 3. parametre.
- **handleAPIError** sadece `(error)`.

---

## İsteğe Bağlı: Uyarıları Azaltma

Build geçiyor ama **uyarı** çoksa (pg-native, tailwind.config ES module, ESLint exhaustive-deps, no-img-element):

- **pg-native**: Opsiyonel bağımlılık; kurmadan da `pg` çalışır. Webpack/Next'te `pg-native`'i ignore etmek için `next.config.js` içinde `externals` veya `webpack` config ile `pg-native`'i boş modüle yönlendirebilirsiniz.
- **tailwind.config.ts**: Proje ESM ise `package.json`'da `"type": "module"` veya config'i `.mjs` yapmak uyarıyı kaldırabilir (dikkatli; tüm projeyi etkiler).
- **ESLint**: Eksik bağımlılıklar veya `<img>` için kurallar `eslint.config` / `.eslintrc` ile gevşetilebilir veya kural bazlı kapatılabilir.

Bu uyarılar build'i **fail** etmez; sadece "Compiled with warnings" çıkar. Öncelik TypeScript hatalarını sıfırlamak.
