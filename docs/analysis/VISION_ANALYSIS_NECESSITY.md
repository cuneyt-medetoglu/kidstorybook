# OpenAI Vision Analizi — Gerekli mi?

**Tarih:** 2026-03-01  
**Konu:** `POST /api/characters`'daki GPT-4o Vision çağrısı kaldırılmalı mı?  
**Durum:** ✅ **Uygulandı** (2026-03-01) — Vision kaldırıldı, tüm karakterler form verisiyle oluşturuluyor.

---

## 1. Şu an ne oluyor?

### Child (ana karakter)
- Vision çağrısı **yok**
- Step 1 formundan gelen `hairColor`, `eyeColor`, `age`, `gender` ile `characterDescription` doğrudan oluşturuluyor
- Sonra `buildCharacterPrompt(description)` bu bilgileri metin prompt'a dönüştürüyor
- Master illüstrasyon: referans fotoğraf + metin prompt → `/v1/images/edits`

### Family Members + Pets (yan karakterler)
- Vision çağrısı **var** (`needsAIAnalysis = photoBase64 && characterType.group !== 'Child'`)
- GPT-4o'ya fotoğraf + uzun analiz promptu gönderiliyor
- Dönen JSON'dan: skinTone, hairColor, hairLength, eyeShape, faceShape, build, defaultClothing vb. çıkarılıyor
- Bu veriden `characterDescription` oluşturuluyor
- Sonrası Child ile **aynı**: `buildCharacterPrompt(description)` + referans fotoğraf → `/v1/images/edits`

---

## 2. Vision ne sunuyor — kritik analiz

### Vision'ın çıktısı nerede kullanılıyor?

```
characterDescription → buildCharacterPrompt() → metin parçası → image edits prompt'una ekleniyor
```

`buildCharacterPrompt()` şu alanları kullanıyor:

| Alan | Child'da kaynak | Yan karakterde kaynak |
|------|----------------|----------------------|
| `age` | Form | Form (veya Vision'dan) |
| `gender` | Form | Form (veya Vision'dan) |
| `hairColor` | Form | **Vision** (formda da var) |
| `hairLength` | Yaşa göre default | **Vision** |
| `hairStyle` | "natural" default | **Vision** |
| `eyeColor` | Form | **Vision** (formda da var) |
| `skinTone` | "fair" default | **Vision** |
| `uniqueFeatures` | Boş | **Vision** (gözlük, çil vb.) |
| `clothingStyle` | "casual" default | **Vision** |

Sonuç: `buildCharacterPrompt()` yaklaşık 250–350 karakterlik kısa bir metin üretiyor, ör.:
```
"35yo girl, medium brown wavy hair, green eyes, fair skin"
```

### Ama model zaten referans görseli görüyor

Image edits API'ye (`/v1/images/edits`):
- **Referans fotoğraf** gönderiliyor (gerçek görsel)
- + Metin prompt (yukarıdaki kısa betim dahil)

Model, **gerçek fotoğrafa bakarak** ilgili karakteri çiziyor. Metin betim, modelin zaten gördüğü fotoğraftaki özellikleri **tekrar söylemek** oluyor.

**Sonuç: Vision'ın çıkardığı bilgiler, modelin referans görselden zaten gördüğü bilgilerle örtüşüyor.**

---

## 3. Vision'ı kaldırırsak ne değişir?

### Değişmeyen
- Referans fotoğraf yine gönderilecek → model yüz, saç, renk vb. görecek
- Metin prompt kısalacak ama temel bilgiler (yaş, cinsiyet, saç/göz) formdan zaten geliyor

### Azalan
- Child'dakiyle aynı mantık: form verisi + basit `characterDescription` build etme
- Child'da `hairColor` ve `eyeColor` formdan gelir ve bu yeterli çalışıyor

### Kayıp
- `skinTone` artık "fair" default — ama model fotoğraftan görüyor
- `uniqueFeatures` artık boş — ama model fotoğraftan görüyor (gözlük, çil vb.)
- `defaultClothing` artık yok — zaten kitap üretiminde kıyafet `storyClothing`/tema'dan geliyor, `defaultClothing` kullanılmıyor

---

## 4. `defaultClothing` kullanılıyor mu?

```typescript
// app/api/books/route.ts, satır 1244
const charOutfit = (suggestedOutfits?.[char.id]?.trim()) || themeClothing
```

Kıyafet önceliği:
1. Hikayedeki `suggestedOutfits[char.id]`
2. Tema'ya göre `themeClothingForMaster`
3. Fallback: `'age-appropriate casual clothing'`

**`defaultClothing` bu zincirde yok.** Vision'dan çıkan kıyafet bilgisi hiçbir yerde kullanılmıyor.

---

## 5. Yan karakterlerin neden tutarsız göründüğüne dair hipotez

Sık gözlemlenen sorun: Ana karakter fotoğrafa benziyorken yan karakterler benzemiyor.

**Asıl neden:** Master illüstrasyon adımında **yan karakterler de referans fotoğrafıyla** `/v1/images/edits`'e gönderiliyordu (Vision çağrısının bir etkisi yok). Ama şu an logda görülen sorun farklı:

- Terminaldeki örnek logda `Mom` için Vision `"No analysis result from OpenAI"` hatasıyla başarısız oluyor
- Sonra `console.warn` → fallback basic description
- Yani Vision hata verse de kitap devam ediyor ama `description` eksik kalıyor

**Bu Vision'ın gereksizliğini kanıtlar:** Vision başarısız olduğunda fallback description'la devam ediliyor ve kitap üretiliyor — fark fark edilmez, çünkü model zaten referans fotoğrafa bakıyor.

---

## 6. Vision'ı kaldırmanın avantajları

| Avantaj | Açıklama |
|---------|----------|
| **Süre** | Karakter başına ~10–20 sn kazanç (3 yan karakter → ~45 sn daha hızlı) |
| **Maliyet** | GPT-4o Vision çağrısı her yan karakter için ~0.01–0.03$ |
| **Hata riski** | Vision API zaman zaman hata dönüyor (logda görüldü). Kaldırınca bu hata yok |
| **Tutarlılık** | Tüm karakterler aynı pipeline'dan geçer (Child mantığıyla) |
| **Basitlik** | Gereksiz karmaşıklık kalkıyor |

---

## 7. Karar önerisi

**Vision kaldırılmalı.**

Child'ın zaten Vision olmadan iyi çalışması, Vision'ın çıktısının model tarafından görülen fotoğrafla zaten örtüşmesi, `defaultClothing`'in kullanılmaması ve Vision'ın bazen hata dönmesi göz önünde alındığında, bu çağrıdan elde edilen net fayda **sıfıra yakın**.

Yan karakterler için `characterDescription` Child ile aynı yöntemle oluşturulacak:
- `age`, `gender`: Form'dan
- `hairColor`, `eyeColor`: Form'dan
- Diğerleri: Child'daki gibi sabit default'lar
- Kıyafet: Hikaye / tema'dan (zaten bu şekilde çalışıyor)

---

## 8. Uygulama kapsamı (onay sonrası)

**Tek dosya:** `app/api/characters/route.ts`

- `needsAIAnalysis` koşulunu kaldır
- Vision bloğunu (satır 89–180) kaldır
- `characterDescription` her zaman form verisiyle oluşturulsun (Child'daki `else` bloğu)
- `aiAnalysisData`, `analysisConfidence` → DB'ye `null` girecek (şema değişikliği yok)
- OpenAI import'u + `generateCharacterAnalysisPrompt` import'u kaldırılabilir (kullanılmıyorsa)

---

*Doküman sahibi: @project-manager*

**Uygulama:** `app/api/characters/route.ts` — Vision bloğu kaldırıldı; OpenAI ve generateCharacterAnalysisPrompt import'ları kaldırıldı; `characterDescription` her zaman form verisiyle (name, age, gender, hairColor, eyeColor) oluşturuluyor; `ai_analysis`, `analysis_confidence` artık gönderilmiyor (null).
