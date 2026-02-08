# GPT Konuşma Özeti + Aksiyon Planı Bağlantısı

**Tarih:** 7 Şubat 2026

Bu dosya, story request/response ve pipeline hakkında GPT ile yapılan soru-cevabın özetini tutar. **Yapılacaklar listesi ve kararlar** artık **`STORY_PROMPT_ACTION_PLAN.md`** dosyasında; onay sonrası oradan uygulanacak.

---

## Ne paylaştık, ne sorduk

- **storyrequest.json / storyresponse.json:** Hikaye LLM’e giden tam istek (apiRequest, characterResolved, aiRequest) ve dönen JSON.
- **Pipeline:** Master → cover → sayfa hepsi reference + /v1/images/edits kullandığımız açıklandı.
- **Sorular:** Cover vs pages, CHARACTER MAPPING formatı, yaş/kelime çakışması, imagePrompt kuralları, tek aşama edits yeterli mi, Structured Outputs mümkün mü.

---

## GPT’nin cevapları (kısa)

1. **Cover vs pages:** Cover ayrı, pages = interior only, EXACTLY N. pageType şimdilik ekleme.
2. **CHARACTER MAPPING:** Hem liste (id | name | age | gender) hem map `CHARACTER_ID_MAP: { "uuid": "Arya" }`.
3. **Yaş/kelime:** Yaş bandına göre targetWordsPerPage; mikro “3–5 words” kaldır; “kısa cümle, basit fiiller, tekrar”.
4. **imagePrompt:** Işık/kompozisyon serbest, appearance yasak; outfitKey opsiyonel.
5. **Tek aşama edits:** Yeterli; iki aşama şart değil.
6. **Structured Outputs:** response_format json_schema + strict mümkün; validator yine semantik için kalsın.
7. **Ek:** Entity master’lara global art direction ekle; JSON’da globalArtDirection + shotPlan standart olsun.

---

## Bizim yapı (referans)

| Adım | Ne yapılıyor | API |
|------|----------------|-----|
| 1. Hikaye | LLM → JSON (pages, supportingEntities, suggestedOutfits, characterExpressions) | GPT-4o-mini |
| 2a. Karakter master | Foto + kıyafet → tam vücut | /v1/images/edits |
| 2b. Entity master | Text-only → hayvan/nesne | /v1/images/generations |
| 3. Kapak | Tüm master’lar referans + sahne prompt | /v1/images/edits |
| 4. Sayfa görselleri | Sayfa master’ları referans + sayfa prompt | /v1/images/edits |

---

## İlgili dosyalar

- **Aksiyon planı (onay sonrası uygulama):** `STORY_PROMPT_ACTION_PLAN.md`
- **GPT’ye illustrationStyle + sinematik mesajı:** `GPT_ILLUSTRATION_AND_CINEMATIC_MESSAGE.md`
- **ChatGPT’e ilk inceleme prompt’u:** `CHATGPT_STORY_REQUEST_REVIEW_PROMPT.md`
