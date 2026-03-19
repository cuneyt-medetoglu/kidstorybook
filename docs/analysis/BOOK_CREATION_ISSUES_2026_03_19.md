# Kitap Oluşturma Sorunları — Analiz (19 Mart 2026)

> **Son güncelleme:** 20 Mart 2026 — P2 kapanışları + progress/log iyileştirmeleri işlendi.

## Güncel Durum (20 Mart 2026)

Bu doküman tarihsel analiz içermeye devam eder; aşağıdaki maddeler mevcut kod durumunu özetler:

- ✅ `%90` aşamasında yanlışlıkla `completed` olma sorunu çözüldü. `completed` yalnızca TTS bitince (100%) set ediliyor.
- ✅ `from-example` akışında tüm karakterlerin `Child` olması sorunu çözüldü. Slot bazlı orijinal `characterType` korunuyor.
- ✅ Hayvan/pet master üretiminde insan-çocuk promptu kullanılmıyor; `Pets` için ayrı master prompt akışı aktif.
- ✅ `isExample` oluşturma akışı generating sayfasına yönleniyor.
- ✅ Progress UI geri sıçrama/ani sıçrama etkisi azaltıldı (`Math.max`, daha sık ama kontrollü polling, UI smooth interpolation).
- ✅ Auth debug log spam'i varsayılan kapatıldı (`AUTH_DEBUG_LOGS=1` ile açılabilir).

### Açık kalanlar (bu dokümanda)

- ℹ️ `tailwind.config.ts` ESM warning (dev-only, non-blocking).
- ℹ️ `favicon.ico` 404 (opsiyonel temizlik).
- ℹ️ Dokümandaki bazı eski bölümler tarihsel bağlam için korunuyor; karar verirken bu “Güncel Durum” bloğu esas alınmalı.

## Oturum özeti (log referansları)

| Oturum | Kitap ID | Worker job | Not |
|--------|----------|------------|-----|
| 1 | `cbe4dd81-...` (Mert & Bal) | Job 1 | Örnek kitap / admin akışı |
| 2 | `da7e2aa6-21b7-464f-839b-bbde0d7ab34a` (Melih & Poo) | Job 2 | Normal full book, `isExample=false` |

**Oturum 2 — app log kanıtları:**
- `POST /api/books 200 in 79779ms` — story ~74.7 sn
- `GET /tr/books/da7e2aa6-21b7-464f-839b-bbde0d7ab34a 404` — **yanlış path**
- `GET /tr/books 404` — liste route’u da yok (kullanıcı manuel denemiş olabilir)

**Oturum 2 — worker:** Pipeline başarılı (master → cover → 12 sayfa → TTS), hata yok.

---

## 1. Log Kontrolü

### Durum: GENEL SAĞLIKLI — küçük uyarı var

**Worker logu** (image pipeline):
- Tüm aşamalar temiz tamamlandı: Master ✅ → Cover ✅ → Pages (12/12) ✅ → TTS (12/12, cache hit) ✅
- Hata yok.

**App (dev) logu**:
- `tailwind.config.ts` ES module uyarısı: `Failed to load the ES module`. Kritik değil, sadece IDE/dev-server warning. `tailwind.config.ts` → `.mjs` dönüştürülmesi veya `package.json`'a `"type":"module"` eklenmesiyle çözülür ama şu an fonksiyonellik etkilenmiyor.
- `POST /api/books 200 in 70624ms` — **Ciddi performans sorunu**: Story generation ~68 saniye (gpt-4o, 14529 karakter prompt). Kullanıcı bu süre boyunca step6 sayfasında "Creating..." ekranında bekledi. Bu konu → Soru 4.

**Vurgu:** Log'da hiçbir hata veya exception yok. Pipeline tarafında sağlıklı.

---

## 2. Generating Sayfasına Neden Atılmadı?

### Durum: BEKLENEN DAVRANIŞIN SONUCU — ama UX problemi

Kullanıcı step6'da **"Create as Example Book" (admin) butonunu** kullandı.  
Log kanıtı:
```
[Create Book] 🔧 Story model override: gpt-4o (isExample=true, canDebug=true)
[Create Book] 📋 Mode: Full Book
```

`step6/page.tsx` içindeki yönlendirme mantığı:

| Akış | Yönlendirme |
|------|-------------|
| Normal kullanıcı → Satın Al | `/cart` |
| Admin debug → "Create without payment" | `/create/generating/${bookId}` |
| **Admin → "Create as Example"** | **`/dashboard`** ← bu akış tetiklendi |

Yani **aynı "Oluştur" akışında iki farklı destination var**: Normal debug kitap `/generating` sayfasına giderken, örnek kitap (isExample) `dashboard`'a gidiyor. Generating sayfasına atılmamasının nedeni bu.

**Sorun mu?** Kısmen evet: Admin example oluşturduğunda da oluşturma ilerlemesini görmek mantıklı olabilir. Ama fonksiyonel açıdan "beklenen" davranış.

---

## 3. Köpeğin (Bal) Referans Fotoğrafa Benzememesi

### Durum: KÖK NEDEN HENÜ BELLI DEĞİL — araştırma gerekli

**Logdan ne görülüyor:**
```
[Pipeline] 📤 MASTER REQUEST sent (model, prompt length: 801)
[Pipeline] ✅ Master created for a6cd7723... (Bal)
```
Master üretimi başarılı. Ama sonuç fotoğrafa benzemiyor.

**Şüpheli 1: from-example sayfasında characterType sabit "Child"**  
`from-example/page.tsx` (231. satır civarı):
```ts
characterType: { group: "Child", value: "Child", displayName: c.name.trim() }
```
Bu kod tüm karakterlere (köpek dahil) `Child` tipi veriyor. Master illustration için gönderilen prompt'ta köpek/hayvan bilgisi olmayabilir; AI'ye "insan çocuk" gibi davranılıyor.

**Ama bu sefer from-example akışı değil!** Log'a bakılırsa step1→step6 normal akışından gelindi. Yani `step2/page.tsx` üzerinden köpek karakteri oluşturuldu. Oradaki `characterType` doğru mu?

**Şüpheli 2: Uncommitted değişiklikler**  
`git diff --stat HEAD` çıktısı şunu gösteriyor:
```
lib/queue/workers/book-generation.worker.ts  (+90 -4 satır)
lib/queue/client.ts                          (+46 satır)  
app/api/books/route.ts                       (+40 satır)
```
Bu 3 kritik dosyada commit edilmemiş değişiklikler var. `book-generation.worker.ts`'deki büyük değişiklik master/prompt mantığını etkilemiş olabilir.

**Şüpheli 3: Master prompt kalitesi**  
Prompt length sadece 801 karakter. Hayvan karakterler için master kalitesi doğası gereği daha düşük (AI hayvanları tutarlı üretmekte zorlanır).

**Eylem gerekiyor:** `book-generation.worker.ts` ve `app/api/books/route.ts` diff'ini inceleyerek master prompt'undaki değişiklikler kontrol edilmeli.

---

## 4. Story Generation Job'da Gösterilmiyor (~1 dk bekleme)

### Durum: MİMARİ EKSİKLİK — kasıtlı ama kullanıcı dostu değil

Mevcut mimari:
```
POST /api/books
  ├── Story generation (senkron, ~68 sn, gpt-4o)  ← worker YOK, progress YOK
  ├── TTS prewarm (async, background)
  └── enqueueBookGeneration() → worker
        ├── 0%  Master
        ├── 20% Cover  
        ├── 40% Pages
        ├── 90% TTS
        └── 100% Done
```

**Problem:** Story generation API request içinde senkron çalışıyor. Kullanıcı 1 dakika boyunca step6 ekranında "Creating..." göstergesiyle bekliyor. `/create/generating/${bookId}` sayfasına henüz geçilmemiş olduğundan progress UI yok.

**Neden böyle?**  
Story generation `bookId` üretmeden önce tamamlanması gerekiyor çünkü hikaye içeriği DB'ye yazılıp ardından job kuyruğa ekleniyor. Queue sadece image pipeline'ı biliyor; hikayesiz image üretemez.

**Potansiyel çözümler:**
1. Story generation'ı da worker'a taşı → API anında `bookId` dönsün, kullanıcı `/generating` sayfasına gitsin, ilk adım "story_generating" olsun.
2. API response süresi kabul edilebilir kılınamazsa → step6'dan `/generating` sayfasına daha erken geç, o sayfada polling ile bookId'yi bekle.

---

## 5. Full Book vs From-Example Akışı Farkları

### Durum: BAZI TUTARSIZLIKLAR VAR

| Özellik | Normal Step1-6 | From-Example |
|---------|---------------|--------------|
| Story generation | ✅ AI yazar | ❌ Mevcut hikaye kullanılır, karakterler swap edilir |
| Character type (hayvan, çocuk vb.) | ✅ Step2'de seçilir | ❌ Her zaman `"Child"` gönderilir |
| Age alanı | ✅ Anlamlı | ❌ Hayvanlar için anlamsız, zorunlu |
| Generating sayfası | ✅ bookId'ye yönlendirme | ✅ `/create/generating/${newBookId}` çağrılıyor |
| Theme/style/custom seçimi | ✅ Var | ❌ Örnek kitabın değerleri kullanılır |
| Debug (skip payment) | ✅ Var | ✅ Var ama label İngilizce ("Create without payment") |

**Kritik fark:** `from-example/page.tsx` satır ~239:
```ts
characterType: { group: "Child", value: "Child", displayName: c.name.trim() }
```
Bu köpek, kedi gibi hayvan karakterleri yanlış tipte işliyor. Master illustration prompt'una "Child" tipi gönderilince hayvan için yanlış davranış üretilebilir.

---

## 6. Yeni Kitap Kartı Daha Kısa

### Durum: usedPhotos SORUNUNUN YAN ETKİSİ (→ Soru 7 ile aynı kök neden)

`ExampleBooksCarousel` içindeki `BookCard` bileşeni photo alanını şöyle render ediyor:
- `usedPhotos.length >= 2` → `7rem x 7rem` grid
- `usedPhotos.length === 1` → `h-28 w-28` büyük fotoğraf
- `usedPhotos.length === 0` → `📷` placeholder + minimum yükseklik

Yeni oluşturulan kitapta `usedPhotos` boş diziye düştüğü için (bkz. Soru 7) placeholder görünüyor, bu da kartın daha sıkışık/kısa görünmesine yol açıyor.

Ek olarak: Book Cover için kullanılan `h-40 w-28` ile Photo için `h-28 w-28` → Photo kısmı kısalınca visual dengesizlik oluşuyor.

---

## 7. Kullanılan Fotoğraflar Bölümü Çıkmamış

### Durum: S3 PRESIGN BAŞARISIZ veya CHARACTER DELETED — araştırma gerekli

`/api/examples` route'u `usedPhotos`'u şu sırayla çözüyor:
1. `generation_metadata.usedPhotos` (saklı dizi) → presign
2. `generation_metadata.characterIds` → `characters` tablosundan `reference_photo_url` → presign
3. [] fallback

**Mevcut kitapta:**
- `generation_metadata.characterIds` = `["46b198cc-...", "a6cd7723-..."]` (log'dan görülüyor: oluşturuldu)
- `characters` tablosunda her iki karakter kayıtlı

**Neden boş geldi?**

Olasılık A: `presignPhotoUrl()` hata fırlattı → `null` döndü → filtreden geçemedi → `[]`
Olasılık B: `reference_photo_url` S3 key'i yanlış (S3 bucket private, key eksik/hatalı)
Olasılık C: Yeni kitap `is_example=true` olarak işaretlendi ama characters tablosundaki `reference_photo_url` S3 path'i presign edilebilir formatta değil

**Kanıt eksikliği:** API response'u log'da görünmüyor. `GET /api/examples/cbe4dd81-...` isteğine dönen JSON'daki `usedPhotos` içeriği bilinmiyor.

**Test adımı:** Browser DevTools → `/api/examples/cbe4dd81-f849-4a72-bb17-ab86b8bcb75e` response'unu inceleyip `usedPhotos` alanına bak.

---

## 8. Yüzde İlerlemenin Geri Atlaması (%73 → %64)

### Durum: KÖK NEDEN TESPİT EDİLDİ — yarış durumu (race condition)

**Gözlem:** “Sayfa görselleri” aşamasında `progress_percent` bazen azalıyor.

**Kök neden:** [`lib/book-generation/image-pipeline.ts`](../../lib/book-generation/image-pipeline.ts) içinde sayfa görselleri **paralel** üretiliyor (`Promise.all` / batch içi `map`). Her tamamlanan sayfa için doğrudan DB güncelleniyor:

```ts
// Yaklaşık satır 1288–1290 — batch içindeki indeks i, tamamlanma sırasına göre değil
const pageProgress = Math.round(40 + ((i + 1) / totalPages) * 50)
await updateBook(bookId, { progress_percent: pageProgress, progress_step: 'pages_generating' })
```

`i` = batch içindeki sayfa indeksi. Paralel tamamlanmada **önce** yüksek `i` (ör. 11/12 → ~%86) bitebilir, **sonra** düşük `i` (ör. 7/12 → ~%69) bitebilir; son yazan DB değeri daha düşük yüzde olur → kullanıcı “geri attı” görür.

**Geliştirmeye hazır çözüm seçenekleri:**
1. **Monotonik güncelleme:** `updateBook` öncesi mevcut `progress_percent` oku; yalnızca `newPercent >= current` ise yaz (veya SQL `GREATEST`).
2. **Tamamlanan sayfa sayacı:** Atomik `completedPageCount++`; yüzde = `40 + (completed/total)*50`.
3. **UI tarafı:** Hook’ta `setProgress(prev => Math.max(prev, data.progress_percent))` (DB düzeltmesi olmadan kısmi iyileştirme).

**Log önerisi (debug):** `updateBook` progress yazarken `bookId`, `pageNumber`, `i`, `pageProgress`, `Date.now()` tek satır log; yarışı logda görmek kolaylaşır.

---

## 9. Tamamlanınca “Missing required html tags” / Kitap Sayfası Hatası

### Durum: KÖK NEDEN TESPİT EDİLDİ — yanlış route + 404

**Gözlem:** Oluşturma bittikten sonra `http://localhost:3000/tr/books/<uuid>` açılınca hata (ekran: Missing `<html>`, `<body>`). Tekrar denemede aynı.

**Kök neden:**
1. Viewer route **sadece** `app/[locale]/(public)/books/[id]/view/page.tsx` altında — yani doğru path: **`/books/{id}/view`**.
2. [`app/[locale]/(public)/create/generating/[bookId]/page.tsx`](../../app/[locale]/(public)/create/generating/[bookId]/page.tsx) tamamlanınca şunu çağırıyor: `router.push(\`/books/${bookId}\`)` — **bu path için sayfa yok**.
3. App log: `GET /tr/books/da7e2aa6-... 404` — Next.js bazı 404 / özel durumlarda root layout uyarısı gösterebiliyor; asıl problem **404 + yanlış URL**.

**Geliştirmeye hazır düzeltme:**
- Generating sayfasındaki tüm `/books/${bookId}` yönlendirmelerini `/books/${bookId}/view` yap.
- İsteğe bağlı: `app/.../books/[id]/page.tsx` ile **kalıcı redirect** (`redirect` → `.../view`) — eski linkler kırılmasın.

---

## 10. Story Aşaması (~75–80 sn) — Boş Bekleme / Ne Olduğu Belli Değil

### Durum: DEVELOPMENT’A HAZIR ANALİZ (Soru 4 genişletmesi)

**Mevcut:** `POST /api/books` içinde story senkron; kullanıcı step6’da uzun süre bekliyor; worker / `generation-status` bu süreyi göstermiyor.

**Hedef UX:** “Hikaye yazılıyor…” aşaması görünür olsun (metin veya en azından spinner + tahmini süre / aşama adı).

**Seçenek A — Hızlı (API’de kalmaya devam):**
- Step6’da story başlamadan önce ayrı tam ekran veya modal: “Hikayeniz oluşturuluyor, ~1 dk sürebilir” + determinate olmayan progress.
- İsteğe bağlı: server-sent veya ayrı lightweight endpoint yok; sadece client-side süre / mesaj.

**Seçenek B — Orta:**
- Kitap kaydı “draft + story_pending” ile hemen oluşturulup story worker’da bitsin; kullanıcı `/create/generating/:id`’e hemen gitsin; ilk adım `story_generating` + polling’de `progress_step` / yüzde 0–10.

**Seçenek C — Tam:** Story + image tek worker zinciri; tek progress çizgisi.

**Log / metrik (öneri):** `[Create Book] story_phase_ms`, `prompt_tokens` özeti; yavaşlık şikayetlerini ölçmek için.

---

## 11. usedPhotos / Presign — Ek Log (Soru 7 için)

**Öneri:** [`app/api/examples/route.ts`](../../app/api/examples/route.ts) içinde `presignPhotoUrl` `null` döndüğünde (development’ta) `console.warn('[examples] presign failed', bookId, charId, urlPrefix)` — PII olmadan key prefix.

**Öneri:** `GET /api/examples/:id` response’unda `usedPhotos.length === 0` iken `debug` query (`?debug=1` + admin) ile presign hata kodu (sadece dev).

---

## Özet Tablo

| # | Konu | Durum | Öncelik |
|---|------|-------|---------|
| 1 | Log sorunu var mı? | Tailwind ES uyarısı; story ~68–80 sn | Düşük |
| 2 | Generating’e atılmama (önceki oturum) | isExample → dashboard (bilinçli) | Orta |
| 3 | Köpek / hayvan master benzerliği | Prompt + tip + diff incelemesi | Yüksek |
| 4 | Story aşaması görünmez | §10 — **Faz 2:** Step6 overlay (Seçenek A) | Yüksek |
| 5 | Full vs from-example | characterType "Child" bug (from-example) | Orta |
| 6 | Kart kısa | usedPhotos boş (§7 ile bağlı) | Düşük |
| 7 | Kullanılan fotoğraflar | §11 **Faz 2:** log + admin `?debug=1` (kök neden takibi) | Yüksek |
| **8** | **Yüzde geri atlama** | **§8 — paralel sayfa progress yarışı, çözüm net** | **Kritik** |
| **9** | **Kitap açılınca hata / 404** | **§9 — `/books/id` → `/books/id/view` düzeltmesi** | **Kritik** |
| 10 | Story UX (genişletme) | §10 — **Faz 2** (hızlı mesaj; B/C sonra) | Yüksek |
| 11 | usedPhotos debug log | §11 — **Faz 2** uygulandı | Orta |

---

## Önerilen Sonraki Adımlar (onay sonrası geliştirme sırası önerisi)

1. ~~**P0 — §9:** Generating sayfası redirect + isteğe bağlı `/books/[id]` → `/view` kalıcı yönlendirme.~~ **Uygulandı (Faz 1):** `create/generating/[bookId]/page.tsx` → `/books/:id/view`; `app/.../books/[id]/page.tsx` → `redirect(.../view)`; `DebugQualityPanel` yeni sekme linki.
2. ~~**P0 — §8:** Sayfa ilerlemesini monotonik veya tamamlanan sayfa sayacı ile güncelle.~~ **Uygulandı (Faz 1):** `lib/db/books.ts` → `updateBookProgressAtLeast` (SQL `GREATEST`); `image-pipeline.ts` sayfa adımında kullanımı.
3. ~~**P1 — §7 + §11:** Presign uyarı logları + DevTools ile `usedPhotos` doğrulama.~~ **Uygulandı (Faz 2):** `app/api/examples/route.ts` — `presignPhotoUrlLogged`, dev’de boş `usedPhotos` uyarısı, karakter map miss uyarısı; admin + `?debug=1` → her örnek kitapta `_debugUsedPhotos`.
4. ~~**P1 — §10:** Story aşaması için en az “mesaj + bekleme” (Seçenek A) veya worker entegrasyonu (B/C).~~ **Uygulandı (Faz 2 — A):** `create/step6` — `storyGeneratingUi` tam ekran overlay; `messages/tr.json` + `en.json` `create.step6.storyGenerating.*`. (Seçenek B/C ileride.)
5. **P2 (acil) — §10/B — Overlay Flash Fix (uygulandı):** `create/step6/page.tsx` — `willNavigate` flag ile `finally` içinde `storyGeneratingUi` sadece navigation olmayınca `false` yapılıyor. Aksi hâlde step6 kısa süre flash görünüyordu.
6. ~~**P3 — §10/C — Story Generating Seçenek B**~~ **Uygulandı:** API route `POST /api/books` artık hikaye beklemeden kitabı hemen oluşturur (`story_data: null`, `story_generating`), `bookId` ~1sn'de döner. Worker pipeline ilk adımda hikayeyi üretir (0→15%). Generating page `story_generating` adımını gösterir. Step6'daki overlay tamamen kaldırıldı. Progress eşikleri: story 15, master 30, cover 50, pages 90, tts 100. `handleCreateExampleBook` da artık generating sayfasına yönlendiriyor (§2 de giderildi).
7. ~~**P2 — §3, §5:** Hayvan master + from-example `characterType`.~~ **Uygulandı (20 Mart 2026):** `from-example` slot type taşındı; `Pets` için master prompt ayrıldı.
8. ~~**P2 — §2:** isExample için de generating sayfasına yönlendirme (ürün kararı).~~ **Uygulandı:** example oluşturma da generating akışına gidiyor.
