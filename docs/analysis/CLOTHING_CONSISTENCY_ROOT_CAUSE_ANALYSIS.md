# Kıyafet Tutarsızlığı – Kök Neden Analizi

**Tarih:** 1 Şubat 2026  
**Bağlam:** Master ve kapak doğru kıyafette; sayfa 1 (bazen diğer sayfalar) “mavi ve kırmızı elbise” ile çıkıyor. Sorunun **kaynakta** nerede oluştuğu ve **mimari** nasıl düşünülmeli – sadece analiz, çözüm önerisi; kod değişikliği yok.

---

## 1. "Mavi ve kırmızı" tam nerede oluşuyor?

### Veri akışı (kısa)

1. **Story API (GPT)** her sayfa için JSON döner:
   - `text` – okuma metni (narrative)
   - `imagePrompt` – görsel için uzun prompt
   - `sceneDescription` – sahne özeti
   - `clothing` – tema/kilitli kıyafet (örn. "macera kıyafetleri")

2. **Books route** sayfa görseli için `sceneDescription` değerini şöyle alıyor:
   ```ts
   sceneDescription = page.imagePrompt || page.sceneDescription || page.text
   ```
   Yani öncelik: imagePrompt → sceneDescription → page.text. Hangisi doluysa o kullanılıyor.

3. Bu metin **olduğu gibi** görsel prompt’a giriyor:
   - `lib/prompts/image/scene.ts`: `getEnvironmentDescription(theme, sceneDescription)` → SCENE_ESTABLISHMENT ve BACKGROUND’a tam metin gidiyor.
   - `generateLayeredComposition(sceneInput, ...)` → MIDGROUND’a `sceneInput.sceneDescription` gidiyor.
   - `generateScenePrompt` içinde de `sceneDescription` kullanılıyor.

4. Görsel tarafında ayrıca şu var:
   - "CRITICAL: Character MUST wear EXACTLY: macera kıyafetleri" (veya match_reference).
   - Ama aynı prompt’ta sahne metninden gelen cümle de var: "Arya, mavi ve kırmızı dış giyim giymekte" vb.

**Sonuç:** "Mavi ve kırmızı" ifadesi **story çıktısında** oluşuyor. Yani kaynak **story generation (GPT)**. Hangi alanda göründüğü sayfaya göre değişir; genelde:

- **page.text** – narrative’te (“Mavi ve kırmızı elbiseleriyle mutlu görünüyordu”),
- **page.imagePrompt** veya **page.sceneDescription** – sahne betimlemesinde (“Arya, mavi ve kırmızı dış giyim giymekte”).

Bu üç alandan biri (veya birden fazlası) görsel prompt’a `sceneDescription` olarak aktarıldığı için, “mavi ve kırmızı” görsel prompt’a taşınıyor.

---

## 2. Neden story böyle üretiyor?

### Story prompt’ta ne var, ne yok?

- **Var:**  
  - `defaultClothing` (örn. "macera kıyafetleri") “DEFAULT OUTFIT (LOCKED)” olarak veriliyor; “use this EXACT outfit on EVERY page”, “clothing field MUST be identical”.
  - “mavi ve kırmızı rahat giysiler” **clothing field** için yasak; tema bazlı örnekler (astronaut, swimwear, outdoor gear) var.

- **Yok / Zayıf:**  
  1. **Page text (narrative):**  
     “Sayfa metninde kıyafeti renk veya tip olarak betimleme (mavi/kırmızı, elbise, giymekte vb. yazma). Kıyafet sabit; sadece aksiyon, duygu, ortam anlat.” gibi bir kural **yok**.  
     GPT detaylı, betimleyici metin isteniyor diye kıyafeti de anlatıyor ve “mavi ve kırmızı elbiseleriyle” gibi ifadeler üretebiliyor.

  2. **imagePrompt / sceneDescription:**  
     Şema diyor: “SPECIFIC character clothing for this scene” / “for this moment (match story/setting; e.g. astronaut suit, swimwear, outdoor gear)”.  
     Yani GPT’den **doğal dille kıyafet cümlesi** isteniyor. Model de “Arya, mavi ve kırmızı dış giyim giymekte” gibi kendi ürettiği bir cümleyi yazıyor; “macera kıyafetleri” ile tutarlı olma zorunluluğu metin düzeyinde net değil.

  3. **Tek kaynak kuralı:**  
     “Kıyafet bilgisi sadece `clothing` alanında olsun; text / imagePrompt / sceneDescription içinde kıyafet betimlemesi yazma” gibi bir mimari kural story prompt’ta **yok**.

Özet: GPT’ye “clothing field = macera kıyafetleri, aynı kalsın” deniyor ama **metin ve sahne alanlarında kıyafet betimlemesi yapmaması** söylenmiyor; hatta imagePrompt/sceneDescription için “SPECIFIC character clothing” ile kıyafet cümlesi üretmesi teşvik ediliyor. Bu yüzden “mavi ve kırmızı” story çıktısında (text veya imagePrompt veya sceneDescription) oluşuyor.

---

## 3. Neden “sadece strip” yeterli değil?

- Strip (route’ta metinden kıyafet cümlesi silmek) **belirtiyi** düzeltiyor: görsel prompt’a “mavi ve kırmızı” girmiyor.
- Ama **kaynak** hâlâ aynı: story yine narrative/sahne alanlarında kıyafet uyduruyor.  
- Yarın “sarı yeşil”, “pembe çizgili” vb. dönerse aynı tutarsızlık tekrarlanır; her yeni kalıp için yeniden filtre eklemek sürdürülemez.
- Ayrıca okuma metninde (page text) “mavi ve kırmızı elbiseleriyle” kalırsa, kitabı okuyan çocuk metinde bir kıyafet görür, görselde başka bir kıyafet görür; tutarsızlık sadece görsele değil, metne de taşınmış olur.

Bu yüzden doğru yaklaşım: **story’nin hiç bu tür kıyafet betimlemesi üretmemesi**; filtre ise güvenlik ağı olarak kalabilir ama asıl çözüm kaynakta.

---

## 4. Mimari nasıl olmalı? (Bütüncül bakış)

### Tek kaynak (single source of truth)

- **Kıyafet bilgisi** tek yerde tanımlı olmalı:  
  `defaultClothing` (veya eşdeğer: tema + kullanıcı / karakter analizi).  
  Bu değer:
  - Story’ye input olarak girer (“sadece bu kıyafet; başka kıyafet betimleme”),
  - Görsel pipeline’da **sadece** bu değer (veya “match reference”) kullanılır; sahne metninden kıyafet çıkarılmaya çalışılmaz.

### Story’nin sorumluluğu

- **clothing** alanı:** Zaten var; her sayfada aynı (defaultClothing ile uyumlu) kalmalı.
- **page text:** Kıyafet betimlemesi **yapmamalı** (renk, “elbise”, “giymekte”, “şort”, “tişört” vb.). Sadece aksiyon, duygu, ortam, diyalog.
- **imagePrompt / sceneDescription:** Bu alanlarda da **kıyafet cümlesi olmamalı**. “SPECIFIC character clothing” yerine: “Do NOT describe what the character is wearing. Describe only: location, time, weather, character action/pose, environment. Clothing is fixed by the system.”

Böylece story çıktısında hiçbir yerde “mavi ve kırmızı” veya başka bir uydurma kıyafet metni üretilmez; tutarsızlık kaynağı kurutulur.

### Görsel pipeline’ın sorumluluğu

- Sahne içeriği için story’den gelen **text / imagePrompt / sceneDescription** kullanılabilir ama **sadece sahne/aksiyon/ortam** için.
- Kıyafet bilgisi **sadece** canonical kaynaktan gelmeli: `page.clothing` veya defaultClothing veya “match reference”.  
- İleride istersen: story’den gelen metin “clothing-safe” olacak şekilde tasarlandığı için, görsel tarafında ekstra strip’e gerek kalmaz; yine de savunma olarak “eğer metinde kıyafet geçerse kullanma” gibi bir katman tutulabilir.

---

## 5. Özet ve önerilen yön

| Soru | Cevap |
|------|--------|
| "Mavi ve kırmızı" nerede oluşuyor? | **Story generation çıktısında:** `page.text`, `page.imagePrompt` veya `page.sceneDescription` içinde. |
| Neden oluşuyor? | Story prompt’ta narrative ve sahne alanlarında **kıyafet betimlemesi yapma** kuralı yok; imagePrompt/sceneDescription için “SPECIFIC character clothing” ile doğal dil kıyafet cümlesi isteniyor; GPT de kendi cümlesini (mavi/kırmızı vb.) yazıyor. |
| Nerede “filtre” uygulandı? | Books route’ta `stripClothingFromSceneText` ile **görsele giden** sceneDescription temizleniyor (band-aid). Story çıktısı ve okuma metni değişmiyor. |
| Doğru çözüm neresi? | **Kaynak:** Story prompt’u netleştir – (1) page text’te kıyafet betimlemesi yok, (2) imagePrompt/sceneDescription’da kıyafet cümlesi yok; kıyafet sadece `clothing` alanında. **Mimari:** Kıyafette tek kaynak (defaultClothing); story ve görsel pipeline bu kaynağa uyar. |

**Öneri:** Önce story prompt ve JSON şemasını bu mantığa göre güncelle (narrative + imagePrompt + sceneDescription’dan kıyafet betimlemesini kaldır; sadece `clothing` kullan). Gerekirse görsel tarafında “clothing-safe” kullanımı netleştir. Strip’i ise geçiş sürecinde veya güvenlik ağı olarak tutabilirsin; asıl çözüm kaynağı düzeltmek.

---

**İlgili dosyalar:**  
`lib/prompts/story/base.ts` (getClothingDirectives, output format, CRITICAL REMINDERS),  
`app/api/books/route.ts` (sceneDescription = imagePrompt || sceneDescription || text; stripClothingFromSceneText),  
`app/api/ai/generate-story/route.ts` (defaultClothing story’ye nasıl veriliyor),  
`lib/prompts/image/scene.ts` (getEnvironmentDescription, generateLayeredComposition).
