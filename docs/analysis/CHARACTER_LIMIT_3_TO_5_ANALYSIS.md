# Kitap Oluşturma Karakter Limiti: 3 → 5 Analiz

**Tarih:** 2026-03-01  
**Konu:** Kitap oluşturma sürecinde maksimum karakter sayısının 3’ten 5’e çıkarılması — etkilenen yerler ve dokümantasyon güncellemeleri.  
**Durum:** ✅ İmplementasyon tamamlandı (1 Mart 2026).

---

## 1. Özet

- **Mevcut limit:** Maksimum **3** karakter (1 ana + 2 ek).
- **Hedef limit:** Maksimum **5** karakter (1 ana + 4 ek).
- **PRD/ARCHITECTURE/FEATURES:** Zaten “5 karaktere kadar” yazıyor; **kodda** limit hâlâ 3 (sadece Create flow Step 2’de).

---

## 2. Kodda Etkilenen Yerler

### 2.1 Ana kısıt: Create Book Step 2 (tek gerçek limit)

| Dosya | Satır | Mevcut | Yapılacak |
|-------|--------|--------|-----------|
| `app/create/step2/page.tsx` | 517 | `if (characters.length >= 3) return` | `>= 5` (veya sabit `MAX_CHARACTERS`) |
| `app/create/step2/page.tsx` | 1359 | `{characters.length < 3 && (` (“Add Another Character” butonu) | `characters.length < 5` (veya sabit) |

**Not:** Projede `MAX_CHARACTERS` benzeri merkezi bir sabit yok; değer doğrudan 3 olarak kullanılıyor. İstenirse `MAX_CHARACTERS = 5` gibi bir sabit (ör. `lib/constants.ts` veya step2 içi) tanımlanıp her iki yerde de kullanılabilir.

### 2.2 API ve backend

- **`app/api/books/route.ts`:** `characters` dizisi kullanılıyor; `characters.length` veya `characters.slice(1)` için üst sınır kontrolü **yok**. Yani 5 karakter gönderilirse backend şu anki haliyle kabul eder; değişiklik gerekmez (isterseniz güvenlik için `characters.length <= 5` gibi bir validasyon eklenebilir).
- **`app/api/ai/generate-story/route.ts`**, **`app/api/ai/generate-images/route.ts`:** Karakter sayısı üst limiti yok; gelen karakter listesine göre çalışıyor.

### 2.3 Diğer create/step ve from-example

- **`app/create/step6/page.tsx`:** Sadece `formData.characters.length` ile çoğul/tekil metin ve koşullu render; sayı sabiti yok. 5 karaktere çıkınca da aynı mantıkla çalışır.
- **`app/create/from-example/page.tsx`:** Örnek kitabın `characterCount`’ına göre karakter slot’ları açılıyor; global max burada sabit değil. Örnekler 3 karaktere göre tanımlı olsa bile, limit 5’e çıkınca “from-example” tarafında ek bir değişiklik gerekmez (örneklerde 5 karakter kullanılmak istenirse içerik tarafında örnek tanımları güncellenir).

### 2.4 Prompt ve görsel pipeline

- **`lib/prompts/story/base.ts`:** `characters.length` ile dinamik metin (kaç karakterin hikayede olması gerektiği vb.); sabit 3 yok. 5 karaktere otomatik uyum sağlar.
- **`lib/prompts/image/scene.ts`**, **`lib/prompts/image/character.ts`:** `additionalCharactersCount` / `additionalCharacters.length` ile çalışıyor; sabit 3 yok. 5 karaktere kadar mevcut mantıkla çalışır.

**Sonuç:** Limitin 5’e çıkarılması için **kod tarafında zorunlu değişiklik sadece** `app/create/step2/page.tsx` içindeki iki yerde (517 ve 1359). İsteğe bağlı: merkezi `MAX_CHARACTERS` sabiti ve API’da `characters.length <= 5` validasyonu.

---

## 3. Dokümantasyon Güncellemeleri (project-manager kurallarına göre)

Aşağıdaki dosyalar “3 karakter” veya “maksimum 3” ifadelerini içeriyor; limit 5 yapıldığında tutarlılık için güncellenmeli.

### 3.1 Güncellenecek dosyalar (aktif dokümantasyon)

| Dosya | İçerik / Önerilen değişiklik |
|-------|------------------------------|
| `docs/roadmap/NOTLAR_VE_FIKIRLER.md` | “3 karaktere kadar”, “maksimum 3 karakter”, “Add Character (maksimum 3)” → 5 karaktere kadar / maksimum 5 olarak güncelle. “Multi-karakter desteği genişletme (5 karaktere kadar) - Post-MVP” maddesi implementasyon sonrası tamamlandı olarak işaretlenebilir veya kaldırılabilir. |
| `docs/roadmap/PHASE_2_FRONTEND.md` | “3 karaktere kadar”, “maksimum 3 karakter” → “5 karaktere kadar”, “maksimum 5 karakter”. |

### 3.2 Zaten “5 karakter” diyen dosyalar (değişiklik gerekmez)

- `docs/PRD.md` — “5 karaktere kadar”, “5 karakter kotası” ✅  
- `docs/ARCHITECTURE.md` — “5 karakter kotası”, “5 karaktere kadar” ✅  
- `docs/FEATURES.md` — “5 karakter”, “5 karakter kotası” ✅  
- `docs/COMPLETED_FEATURES.md` — “5 karaktere kadar” ✅  

Bunlar limit 5’e çıktığında kodla uyumlu kalır; ek güncelleme gerekmez.

### 3.3 Referans / arşiv dokümanları (isteğe bağlı)

- `docs/roadmap/PHASE_3_BACKEND_AI.md` — Karakter API listesi; sayı limiti geçmiyor, gerekmez.
- `docs/archive/2026-q1/strategies/STEP_1_2_MERGE_STRATEGY.md` — “3 karakter = çok scroll” notu; tarihsel bağlam için olduğu gibi bırakılabilir.
- `docs/archive/2026-q1/implementation/FAZ2_4_KARAKTER_GRUPLAMA_IMPLEMENTATION.md` — “1–3 karakter”, “3 karakter”, “Maksimum 3 karakter” geçiyor; arşiv olduğu için güncelleme zorunlu değil, istenirse “tarihsel: 3, güncel limit: 5” notu eklenebilir.
- `docs/reports/MULTI_CHARACTER_FEATURE_SUMMARY.md` — “Maksimum 3 karakter”, “3 karakter”; rapor geçmiş durumu anlattığı için isteğe bağlı güncelleme veya “Güncel limit 5” dipnotu.

### 3.4 DOCUMENTATION.md

- Yeni analiz dosyası eklendiğinde `docs/DOCUMENTATION.md` içinde “AI ve Prompt'lar” (veya uygun) bölümüne madde eklenmeli.  
- Örnek:  
  `14. **analysis/CHARACTER_LIMIT_3_TO_5_ANALYSIS.md** - Kitap oluşturma karakter limiti 3→5 analizi; etkilenen yerler ve dokümantasyon güncellemeleri`

### 3.5 project-manager.mdc ile uyum

- **ROADMAP.md:** Karakter limitiyle doğrudan ilgili bir madde yoksa ekleme zorunlu değil; varsa “maksimum 3” → “maksimum 5” yapılır.
- **PRD/FEATURES/ARCHITECTURE:** Zaten 5; senkronizasyon için ek iş yok.
- **İmplementasyon sonrası:** Limit 5 yapıldığında ilgili faz implementasyon dosyasına (örn. `docs/implementation/FAZ3_IMPLEMENTATION.md`) kısa not: “Karakter limiti 3→5 (Step 2; tarih).”

---

## 4. Uygulama Özeti (implementasyon yapılırken)

| Öncelik | Ne yapılacak |
|---------|-------------------------------|
| Zorunlu | `app/create/step2/page.tsx`: 517 ve 1359. satırlarda 3 → 5 (veya `MAX_CHARACTERS` sabiti). |
| İsteğe bağlı | `lib/constants.ts` (veya uygun yer) içinde `MAX_CHARACTERS = 5`; Step 2’de bu sabiti kullan. |
| İsteğe bağlı | `app/api/books/route.ts`: body’de `characters.length <= 5` validasyonu. |
| Doküman | `docs/roadmap/NOTLAR_VE_FIKIRLER.md`, `docs/roadmap/PHASE_2_FRONTEND.md`: “3” → “5”. |
| Doküman | `docs/DOCUMENTATION.md`: Bu analiz dosyasına referans ekle. |
| Doküman | İmplementasyon notu: ilgili FAZ implementasyon dosyasına kısa satır. |

Bu belge analiz + implementasyon özetidir. Yapılan değişiklikler:
- `app/create/step2/page.tsx`: MAX_CHARACTERS=5 sabiti, handleAddCharacter ve "Add Another Character" butonu koşulu.
- `app/api/books/route.ts`: MAX_CHARACTERS=5 sabiti, characters.length > MAX_CHARACTERS için badRequest validasyonu.
- Doküman: NOTLAR_VE_FIKIRLER.md, PHASE_2_FRONTEND.md (3→5), FAZ3_IMPLEMENTATION.md notu.
