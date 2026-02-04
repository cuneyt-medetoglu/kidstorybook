# Create Your Own from Example

**Tarih:** 3 Şubat 2026

---

## Ne?

Kullanıcı Examples’ta bir kitap görür → **Create Your Own Book** ile kendi karakterini girer → aynı hikaye, kullanıcının karakteriyle yeni kitap oluşturulur.

---

## Akış (yapılan)

1. **Create Your Own** → `/create/from-example?exampleId=...`
2. **Kitap:** Örnek kitabın `story_data` + metadata kopyalanır; karakter **isimleri** kullanıcının girdiği isimlerle değiştirilir.
3. **Master:** Her kullanıcı karakteri için master illüstrasyon üretilir; `generation_metadata.masterIllustrations`’a yazılır.
4. **Görseller:** Kapak ve sayfa görselleri **normal kitap pipeline’ı** ile üretilir: örnek kitabın `story_data`’sındaki `imagePrompt` / `sceneDescription` / `characterExpressions` + kullanıcının master’ları. Edits API kullanılmıyor; re-generation (aynı prompt + master ref).
5. **Ödeme/onay** normal create flow ile aynı.

---

## Teknik

| Konu | Not |
|------|-----|
| **API** | `POST /api/books` + `fromExampleId`. Kitap + master bu route’ta; kapak/sayfa aynı route’taki normal cover/page pipeline’ı kullanır (`masterIllustrations` üst kapsamda). |
| **Görsel** | Edits (sayfa görseli + master → swap) **denendi, vazgeçildi**. Şu an: story_data + master ile **generations** (normal akış). Sahne orijinale çok yakın; piksel birebir aynı değil. |
| **characterIds eşleştirmesi** | `story_data.pages` içindeki örnek karakter ID'leri, sayfa görsellerinde master kullanılsın diye kullanıcı karakter ID'leri ile değiştirilir (aynı sıra: exampleCharOrder[i] → characterIds[i]). |
| **Kapak sahne** | From-example'da örnek kapak görseli Vision (GPT-4o-mini) ile betimlenir; "top, tavşan, kulübe" vb. prompt'a eklenir. Timeout/hatada ek metin eklenmez, normal prompt kullanılır. |
| **Karakter sayısı** | Örnek kitaptaki benzersiz karakter sayısı `story_data.pages` → `characterIds` birleşiminden; o kadar karakter formu gösterilir. |

---

## UX

- **Yaş:** Number input (0–12), ana wizard ile aynı.
- **Karakter:** Örnekte kaç karakter varsa o kadar form; “karakter ekle” yok.

---

## Dosyalar

- UI: `app/create/from-example/page.tsx`, `app/examples/page.tsx`
- API: `app/api/books/route.ts` (from-example bloğu + ortak cover/page)
- Strateji: `docs/strategies/EXAMPLES_REAL_BOOKS_AND_CREATE_YOUR_OWN.md`
