# Master Illustration – OpenAI Safety Engeli Analizi

**Tarih:** 1 Mart 2026  
**Bağlam:** Create Book akışında karakter master illüstrasyonu üretilirken GPT-image API’den `safety_violations=[sexual]` ile 400 dönmesi. Çözüm bu dokümanda değil; analiz ve seçenekler aşağıda. Çözüm uygulaması analiz onayı sonrası yapılacak.

---

## Faz 1: Problem Tanımı

### Ne oluyor?

- **Adım:** Create Book → Story hazır → **Master character illustration** (her karakter için referans fotoğraftan “canonical” illüstrasyon).
- **API:** OpenAI `/v1/images/edits` (gpt-image-1.5), tek referans görsel + metin prompt.
- **Girdi:** Kullanıcının yüklediği **gerçek çocuk fotoğrafı** (örn. Arya) + İngilizce prompt (stil, poz, kıyafet, “child from head to toe” vb.).
- **Sonuç:** HTTP 400, `code: "moderation_blocked"`, `safety_violations: ["sexual"]`.

### Hata mesajı (özet)

```json
{
  "error": {
    "message": "Your request was rejected by the safety system. ... safety_violations=[sexual].",
    "type": "image_generation_user_error",
    "code": "moderation_blocked"
  }
}
```

### Mevcut davranış

- Master illüstrasyon isteği bu hata ile reddedilince ilgili karakter için **fallback:** orijinal fotoğraf kullanılıyor; kitap oluşturma devam ediyor.
- Log: `[Create Book] ❌ Master illustration generation failed for character ... (Arya): Error: GPT-image API error: 400 ... safety_violations=[sexual]`
- Ardından: `[Create Book] ⚠️ No master illustrations created - all characters will use original photos`

### Nerede tetikleniyor?

- **Kod:** `app/api/books/route.ts` → `generateMasterCharacterIllustration()` → `lib/ai/images.ts` (imageEditWithLog) → OpenAI `/v1/images/edits`.
- **Prompt yapısı:** `lib/prompts/image/character.ts` (buildCharacterPrompt) + route içinde master prompt: ANATOMY, STYLE, EXPRESSION, “Full body, standing, feet visible, neutral pose. **Child from head to toe.**” + characterPrompt + outfit + “Plain neutral background. Illustration style (NOT photorealistic). Match reference photos for face and body.”

---

## Faz 2: Kök Neden

### OpenAI tarafı

- Görsel API’lerinde **content moderation** var; özellikle **çocuk içeren görseller** için politikalar çok sıkı.
- “Sexual” etiketi burada büyük ihtimalle **genel güvenlik kategorisi**: çocuk görüntüsü üretme/düzenleme riskine karşı **koruma amaçlı** (false positive olabilir).
- Yani: Prompt veya görsel gerçekten uygunsuz olmasa da, **gerçek çocuk fotoğrafı + “child” + “full body”** gibi kombinasyonlar politikaya takılıp bloklanıyor.

### Bizim kullanım

- **Amaç:** Kullanıcının çocuğunun fotoğrafından, aynı yüz/vücut özelliklerini koruyan **illüstrasyon** (çizgi film tarzı) üretmek; tamamen masum, kişiselleştirilmiş çocuk kitabı için.
- **Tetikleyici kombinasyon (özet):**
  - Referans = **gerçek çocuk fotoğrafı**
  - Prompt’ta “**Child from head to toe**”, “full body”, “feet visible” gibi ifadeler
  - Yaş/cinsiyet/saç/göz/ten + “Character wearing exactly: comfortable outdoor clothing, red boots”
- Moderation, bu üçlüyü (çocuk fotoğrafı + çocuk betimi + tam vücut) riskli kategoride değerlendirip “sexual” ile işaretleyebiliyor.

### Özet

- **Kod hatası değil;** prompt da kasıtlı olarak uygunsuz değil.
- **OpenAI’nin çocuk görseli politikası** + **false positive** sonucu bloklama.
- Hedef: Bu politikayla çakışmadan, mümkün olan en iyi şekilde master illüstrasyon üretmek veya makul bir fallback’e sahip olmak.

---

## Faz 3: Olası Çözümler (Sadece Analiz)

Aşağıdaki seçenekler **uygulama yapılmadan** listeleniyor; öncelik/uygulanabilirlik analiz onayı sonrası belirlenecek.

### Seçenek A: Prompt yumuşatma (master için)

- **Fikir:** “Child” kelimesini azaltmak veya değiştirmek; “full body”, “feet visible” gibi ifadeleri kısaltmak veya çıkarmak.
- **Risk:** Çıktı kalitesi veya tutarlılığı düşebilir; yine de aynı politikaya takılabilir.
- **Artı:** Sadece prompt değişikliği; API ve akış aynı kalır.

### Seçenek B: Master’da referans fotoğraf kullanmamak

- **Fikir:** Master illüstrasyonu **sadece metin prompt** ile üretmek (text-to-image); referans görsel göndermemek.
- **Eksi:** Karakter yüzü/fiziği kullanıcı fotoğrafına benzemez; kişiselleştirme amacı zayıflar.
- **Artı:** Çocuk fotoğrafı API’ye gitmediği için moderation tetiklenmeyebilir.

### Seçenek C: Retry / alternatif prompt

- **Fikir:** 400 + moderation_blocked gelince (sadece master adımında) bir kez daha denemek; ikinci denemede daha yumuşak bir prompt kullanmak (daha az “child/full body” vurgusu).
- **Artı:** İlk denemede geçenlerde değişiklik yok; sadece bloklananlarda ikinci şans.
- **Eksi:** Aynı politikaya yine takılabilir; ek maliyet/süre.

### Seçenek D: OpenAI ile iletişim

- **Fikir:** Bu kullanım senaryosunu (ebeveyn yüklediği çocuk fotoğrafı → illüstrasyon, çocuk kitabı) açıklayıp destek/istisna sormak (help.openai.com, request ID ile).
- **Artı:** Politika değişirse veya özel koşul tanınırsa kalite ve akış korunur.
- **Eksi:** Süre ve sonuç belirsiz; garanti yok.

### Seçenek E: Fallback’i netleştirmek (mevcut davranışı dokümante etmek)

- **Fikir:** Master başarısız olunca “orijinal fotoğraf kullanılır” davranışını kullanıcıya ve operasyona net açıklamak; gerekirse UI’da kısa bilgi metni.
- **Artı:** Beklenti yönetimi; “neden bazen gerçek fotoğraf?” sorusu cevaplanır.
- **Eksi:** Engeli kaldırmaz; sadece şeffaflık.

### Seçenek F: Farklı sağlayıcı / model

- **Fikir:** Master illüstrasyon için başka bir görsel API (çocuk politikası farklı olan) değerlendirmek.
- **Artı:** OpenAI politikasından bağımsız olma ihtimali.
- **Eksi:** Entegrasyon, maliyet, tutarlılık; ayrı araştırma gerekir.

---

## Özet tablo

| Seçenek | Açıklama | Zorluk | Etki |
|--------|----------|--------|------|
| A | Master prompt yumuşatma | Düşük | False positive’i azaltabilir |
| B | Master’da referans kullanmama | Orta | Kişiselleştirme zayıflar |
| C | Moderation’da retry + yumuşak prompt | Düşük–Orta | Bloklananlarda ikinci şans |
| D | OpenAI ile iletişim | Belirsiz | Uzun vadede politika/istisna |
| E | Fallback dokümantasyonu / UX | Düşük | Şeffaflık, beklenti yönetimi |
| F | Alternatif görsel API | Yüksek | OpenAI’den bağımsızlaşma |

---

## Sonraki adım

Analiz onaylandıktan sonra: Yukarıdaki seçeneklerden biri veya bir kombinasyonu (örn. A + C + E) uygulama planına alınacak; değişiklikler ilgili route/prompt/dokümanlara yansıtılacak.

**İlgili dosyalar:**  
`app/api/books/route.ts` (generateMasterCharacterIllustration), `lib/prompts/image/character.ts`, `lib/ai/images.ts`, `docs/guides/EXAMPLE_BOOK_CHILD_IMAGES.md`
