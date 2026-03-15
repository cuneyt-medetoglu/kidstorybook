# TTS Dil Akışı – Kısa Özet

**Soru:** Example ve book için seçili dil, ses üretiminde kullanılıyor mu?

**Cevap:** **Evet.** Ses, **kitabın diline** göre üretiliyor. UI locale (adres çubuğundaki tr/en) değil, **kitabın `language` alanı** kullanılıyor.

---

## Akış (flow)

```
[Book Viewer / Example sayfası]
    → Kitap yüklenir (book.language = "tr" | "en" | ...)
    → Kullanıcı "Oku" / TTS tetikler
    → play(sayfaMetni, { language: book?.language || "en", speed, volume })
           ↓
[useTTS hook]
    → POST /api/tts/generate { text, language, voiceId, speed }
           ↓
[API route]
    → generateTts(text, { language: bodyLanguage, ... })
           ↓
[lib/tts/generate.ts]
    → Dil: 1) istekteki language  2) yoksa global tts_settings.language_code  3) yoksa "en"
    → languageCode = getLanguageCode(language) → Google TTS’e gider
    → Ses o dilde üretilir (veya cache’ten döner)
```

**Özet:**  
- **Book:** Kitap oluşturulurken seçilen dil = `book.language` → TTS hep bu dilde.  
- **Example:** Example da bir kitap; `book.language` o example’ın dilidir (TR example → TR ses, EN kopyası → EN ses).  
Yani “hangi dil seçilmiş” = **kitabın dili**; UI dili değil.

---

## Dikkat: Cache hatası

Cache anahtarı **dil içermiyor** (`text | voiceId | speed | prompt`).  
Aynı metin önce bir dilde (örn. TR) cache’lenirse, başka dilde (EN) istekte **aynı ses** (TR) dönebilir.  
Düzeltme: Cache hash’e `languageCode` eklenmeli. Detay: `docs/analysis/TTS_LANGUAGE_MISMATCH_ANALYSIS.md`.

---

## İlgili dosyalar

| Yer | Ne yapıyor |
|-----|------------|
| `components/book-viewer/book-viewer.tsx` | `play(..., { language: book?.language \|\| "en" })` |
| `hooks/useTTS.ts` | `language`’i API body’de gönderir |
| `app/api/tts/generate/route.ts` | Body’den `language` alıp `generateTts`’e iletir |
| `lib/tts/generate.ts` | Dil önceliği + Google TTS + cache |
