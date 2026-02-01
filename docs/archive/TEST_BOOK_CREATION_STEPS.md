# Kitap Oluşturma – Adım Adım Test

**Amaç:** Kitap oluşturma sürecini baştan sona adım adım test etmek. Her adımda logu incele, sonucu buraya yaz, sorun yoksa OK.

**STOP_AFTER kullanımı:** `.env` içine `STOP_AFTER=<adım>` yaz → kitap oluştur → logda giden/dönen **ham JSON** objesi görünür (yorum yok, limit yok). Logu paylaştıktan sonra bu dokümana ekleyebilirsin.

---

## Adım 1 – Story request

- **Giden:** Logda `[Create Book] 📤 STORY REQUEST (raw):` satırından sonra tam request objesi (model, messages, response_format, temperature, max_tokens) ham JSON olarak yazdırılır.
- **Dönen:** Bu adımda STOP_AFTER ile API çağrılmadan duruyorsan dönen yok. `story_response` adımında `📥 STORY RESPONSE (raw):` altında tam response objesi ham JSON olarak yazdırılır.

### Test kaydı – Adım 1 (story_request)

**Ortam:** Full Book, 3 sayfa, theme: adventure, karakter: Arya (22d1dac8-e6d2-494c-8b6a-d38a86d5a213). `STOP_AFTER=story_request` ile test edildi.

**Sonuç:** Giden REQUEST ham JSON olarak logda göründü. CHARACTER / PHYSICAL APPEARANCE bölümünde **"Clothing style" satırı yok** (v1.6.0 – kıyafet sadece master'dan).

**v1.7.0 (Prompt Slim):** Story request kısaltıldı. System: dil tek cümle. User: açılış tekrarı yok; PERSONALITY bloğu yok; Theme-Specific Examples yok; LANGUAGE bölümü tek satır; STORY STRUCTURE kısa (cover/interior/farklı sahne); diğer bölümler sadeleştirildi. Tam REQUEST: logda `📤 STORY REQUEST (raw):` sonrası ham JSON.

---

## Adım 2 – Story response (sonraki aşama)

- **Yapılacak:** `.env` içine `STOP_AFTER=story_response` yaz, kitap oluşturmayı tekrar çalıştır.
- **Dönen:** `📥 STORY RESPONSE (raw):` altında AI'dan dönen story JSON'u (title, pages, supportingEntities vb.) ham JSON, limitsiz.
- **Kontrol:** title, pages (sayı = istenen sayfa), her sayfada characterIds, sceneContext, imagePrompt, text; supportingEntities; metadata.

---

## Adım 3 – Master request

- **Giden:** `📤 MASTER REQUEST (raw):` altında model, prompt (tam metin), size, quality, input_fidelity ham JSON.

---

## Adım 4 – Master response

- **Dönen:** `📥 MASTER RESPONSE (raw):` altında API cevabı ham JSON (data[].b64_json dahil, limitsiz).

---

## Adımlar tablosu

| # | Adım | STOP_AFTER değeri | Test sonucum | OK |
|---|------|-------------------|--------------|-----|
| 1 | Story request (AI'a giden obje) | `story_request` | Test edildi; PHYSICAL APPEARANCE'ta Clothing yok. | ✓ |
| 2 | Story response (AI'dan dönen JSON) | `story_response` | Sonraki: STOP_AFTER=story_response ile test | |
| 3 | Master request (master prompt objesi) | `master_request` | | |
| 4 | Master response (master API cevabı) | `master_response` | | |
| 5 | Cover image (kapak üretimi) | — | | |
| 6 | Sayfa 1 görseli | — | | |
| 7 | Sayfa 2 görseli | — | | |
| 8 | Sayfa N görseli | — | | |
| 9 | Kitap tamamlandı (tüm sayfalar + kapak) | — | | |

---

## Notlar (senin test sonuçların)

Buraya her adımda gördüklerini, hataları veya "şu iyi, şu kötü" notlarını yaz. OK yaptıkça tabloda OK işaretle.

---

## Hızlı referans

- **Giden:** `📤 ... REQUEST (raw):` sonrası tam obje, ham JSON, limit yok.
- **Dönen:** `📥 ... RESPONSE (raw):` sonrası tam obje, ham JSON, limit yok.
- **Durdurmak için:** `.env` → `STOP_AFTER=story_request` (veya yukarıdaki değerlerden biri) → kaydet → kitap oluştur.
