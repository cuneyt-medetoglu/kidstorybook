# Create Book Test Analizi (Kısa Özet)

**Tarih:** 2 Şubat 2026 (başlangıç) → 3 Şubat 2026 (devam)  
**Geçici doküman** – Commit öncesi silinecek.

---

## 📊 GENEL DURUM ve İLERLEME

### Tespit Edilen Ana Sorun
- **Yüz ifadeleri sürekli "ağzı açık gülümseme"**: Master referans + tek kelime ifade ("happy/curious/joyful") → her sayfa aynı ifade; hikaye anlatmıyor, sanal kalıyor.
- **Kameraya sürekli bakma**: Doğal/sinematik değil.
- **Çok karakterde tek ifade**: Herkes aynı şekilde gülüyor; farklı tepkiler yok.

### Çözüm Yaklaşımı
1. **Master nötr**: Gülümseme kilidini kır
2. **Story → görsel senaryo**: "happy" değil, "eyes wide, brows raised, mouth open" (çizgi film senaryosu gibi)
3. **Karakter başına ifade**: Çok karakterde her biri ayrı (şaşırmış/sakin/üzgün)
4. **Prompt vurgusu**: "Do not copy reference expression; match only face + outfit"

### Uygulama İlerlemesi

| # | Adım | Durum | Dosya |
|---|------|-------|-------|
| 1 | Master: nötr ifade | ✅ Tamamlandı | `app/api/books/route.ts` |
| 2 | Story şeması: `characterExpressions` | ✅ Tamamlandı | `lib/prompts/story/base.ts` |
| 3 | Story talimatları | ✅ Tamamlandı | `lib/prompts/story/base.ts` |
| 4 | Sayfa gen: story → scene input | ✅ Tamamlandı | `app/api/books/route.ts` |
| 5 | Image: `[CHARACTER_EXPRESSIONS]` | ✅ Tamamlandı | `lib/prompts/image/scene.ts` |
| 6 | "Do not copy reference expr" | ✅ Tamamlandı | `lib/prompts/image/scene.ts` |
| 7 | Log: karakter ifadeleri | ✅ Tamamlandı | `app/api/books/route.ts` |
| 8 | Doküman + linter + roadmap | ✅ Tamamlandı | Çeşitli |

**Son güncelleme:** 3 Şubat 2026, 12:40

**✅ TÜM ADIMLAR TAMAMLANDI!**
- Linter temiz (no errors)
- Roadmap güncellendi (3.5.28)
- Story prompt: v1.8.0 → v1.9.0
- Scene prompt: v1.10.0 → v1.11.0
- Test custom promptları hazır (4 senaryo)

---

## 1. "AI Analysis failed" log

**Sorun:** Log’da bu mesaj görünüyor; kullanıcı ne olduğunu bilmiyor.

**Durum:** AI Analysis 25 Ocak’ta kaldırıldı; Step 1 verisi kullanılıyor. Mesaj muhtemelen eski kod/log kalıntısı.

**Yapılacak:**
- Projede "AI Analysis" / "AI Analysis failed" string’lerini ara (frontend + backend).
- Bu mesajları kaldır veya "Uploading photo..." gibi net bir metinle değiştir.
- Gereksiz console.log’ları temizle.

---

## 2. Kıyafet: A gibi olsun (tek kıyafet, tutarlı)

**İstenen:** Her sayfada aynı kıyafet (A). C gibi olunca sayfa sayfa farklı kıyafet çıkıyor, tutarlılık bozuluyor.

**Doğru akış (kod böyle – route.ts):**
1. **Story API önce çalışır** → JSON döner; içinde **suggestedOutfits** var (karakter ID → tek satır İngilizce kıyafet).
2. **Bu bilgi master’dan önce elimizde:** `storyData.suggestedOutfits` story cevabından gelir; master üretimine geçmeden önce okunur.
3. **Master’lar bu kıyafetle oluşturulur:** `charOutfit = suggestedOutfits[char.id] || themeClothing`; `generateMasterCharacterIllustration(..., charOutfit)` ile master’a verilir.
4. Cover ve sayfalar: `clothing: 'match_reference'` (master referans = aynı kıyafet).

Yani **kıyafet bilgisi Story API’den geliyor ve master oluşturulmadan önce elimizde.** Master, bu bilgiyle çiziliyor; sonra sayfalarda “match_reference” ile aynı kıyafet kullanılıyor. Tasarım **A**.

**Olası problemler (C’ye düşme nedenleri):**
1. Story `suggestedOutfits` dönmüyor veya yanlış ID/format.
2. Sayfa prompt’unda "match_reference" yeterince vurgulanmıyor; model kıyafeti değiştiriyor.

**Yapılacak:** suggestedOutfits’in story’den gelip master’da kullanıldığını doğrula; image prompt’ta “Clothing: match reference exactly; same outfit every page” net olsun.

---

## 3. Yüz ifadeleri: Story’den gelen bilgi image’a gitmeli (AI’a bırakılacak)

**İstenen:** Hikaye metninde “Arya çok şaşkın” gibi ifade varsa, o sayfa için image prompt’a şaşkın yüz ifadesi bilgisi gitsin. Yani **story response’ta sayfa bazlı ifade/duygu olmalı**, image pipeline bunu kullanmalı.

**Eksik:** Şu an story çıktısında sayfa bazlı böyle bir alan yok; image tarafı bu bilgiyi alamıyor, hep “gülümseme” benzeri çıkıyor.

**Çözüm – genel, AI’a bırakılan tasarım:**
- **Story output:** Her sayfa için **tek, genel bir alan** (örn. `expression` veya `mood`). Değer: Story modelinin o sayfadaki metne göre yazdığı **kısa İngilizce ifade** (tek kelime veya kısa cümle). Örnekler: "surprised", "worried", "happy", "curious", "determined", "Arya looks surprised and a little worried" vb. Sabit bir liste yok; model ne uygunsa onu yazar.
- **Story prompt:** “Her sayfa için o sayfadaki duygu/ifadeyi çıkar; [alan adı] alanına İngilizce yaz (tek kelime veya kısa ifade).” Detaylı örnek listesi verme; AI’a bırak.
- **Image pipeline:** Story’den gelen değeri **olduğu gibi** image prompt’a ekle. Örn. “Facial expression: [story’den gelen değer]”. Bizim tarafta “surprised → wide eyes, mouth open” gibi 50 farklı ifade tanımı **yok**; tek yapılan, story’nin yazdığı metni image’a taşımak.

Özet: **Story AI sayfa bazlı ifadeyi üretir, biz sadece o alanı image prompt’a ekleriz. Hardcoded ifade listesi yok.**

---

## 4. Dede / yetişkin: Çocuk–yetişkin boy farkı

**Sorun:** Dede (veya yetişkin) seçildiğinde karakter çocuk gibi (kısa boy, çocuk oranları) çıkıyor.

**Amaç:** Her yaşlıyı kambur, belli bir “yaşlı tipi” gibi çizmek değil. Amaç: **Bebek/çocuk ile yetişkin (örn. dede) arasındaki boy ve vücut farkını** net gösterebilmek. Yani birkaç temel şey: yetişkin çocuktan **belirgin şekilde uzun**, yetişkin **çocuk vücut oranlarında değil**.

**İstenmeyen:** “Her yaşlı 6–7 kafa, kambur, bacakları kısa” gibi sabit, hardcoded kurallar. Her yaşlı aynı tip olmak zorunda değil.

**Öneri – genel, hardcoded olmayan direktifler:**
- **Çocuk–yetişkin aynı sahnede:** “Adult character clearly taller than the child; visible height/size difference.” (Yetişkin çocuktan açıkça uzun; boy farkı görünür.)
- **Yetişkin tek başına:** “Adult body proportions (not child proportions).” (Çocuk vücut oranı değil, yetişkin vücut oranı.)
- **Negatif (genel):** “NOT child body proportions; NOT same height as child when adult and child are in the same scene.”

Yaş, kamburluk, kafa sayısı vb. sabit sayılar yazmadan; sadece “yetişkin–çocuk farkı” ve “yetişkin oranları” vurgulanır. Detayı model çizer.

---

## Öncelik ve kısa aksiyon

| # | Konu              | Öncelik | Kısa aksiyon                                      |
|---|-------------------|--------|---------------------------------------------------|
| 1 | AI Analysis log   | Orta   | Grep → mesajları kaldır / düzelt                  |
| 2 | Kıyafet A         | Yüksek | suggestedOutfits + match_reference zincirini doğrula, prompt’u güçlendir |
| 3 | Yüz ifadesi       | Yüksek | Story’ye expression alanı + image’da kullanım      |
| 4 | Çocuk–yetişkin boy farkı | Yüksek | Genel direktifler: yetişkin çocuktan uzun, yetişkin oranları; hardcoded yaşlı tipi yok |

**Not:** Bu doküman sadece analiz ve plan; geliştirme yapılmadı. İşler bitince doküman silinecek, özet ilgili implementation dokümanlarına geçirilecek.

---

## Güncellemeler (2 Şubat 2026 – devam)

### Kıyafet (madde 2) – Doğrulandı
- Ekran görüntüleri ve log: `suggestedOutfits` story’den geliyor; master ve sayfa görsellerinde aynı kıyafet kullanılıyor (Arya: outdoor clothing, sandals; Dede: casual shirt and pants, sneakers). **Kod değişikliği yok.**

### Yüz ifadesi (madde 3) – Log eklendi
- **Yapılan:** Sayfa görselleri üretimine başlarken her sayfa için story’den gelen `expression` değeri loglanıyor: `[Create Book] Page N expression: <değer veya (empty)>`. Böylece bir sonraki testte “hangi yüz duruşu isteniyor” logdan görülebilir.

### Sinematik ve doğal ortam (yeni madde – kameraya bakma)
- **Sorun:** Karakterler sürekli kameraya bakıyor; doğal değil.
- **Yapılan:** İç sayfalar (cover hariç) için `getCinematicNaturalDirectives()` eklendi (`lib/prompts/image/scene.ts` v1.10.0):
  - Sinematik, storybook anı – sahnenin bir anı gibi, poz verme hissi yok.
  - Karakterler sahne ve birbirleriyle meşgul; izleyiciye poz vermiyor.
  - Karakterler **doğrudan izleyiciye/kameraya bakmasın**; sahneye, birbirine veya nesnelere (ateş, gökyüzü, yol, ufuk) baksın.
  - Doğal kompozisyon, sürükleyici atmosfer, doğal ışık ve derinlik.
- Referans: Kamp ateşi / gün batımı tarzı görsel – karakterler sahneye, birbirine veya nesnelere bakıyor.

---

## Analiz: “Sürekli Ağzı Açık / Sanal Hissi / Hikaye Anlatmıyor” (3 Şubat 2026)

**İstenen:** Görseller sinematik ve doğal olsun; yüz ifadeleri hikayeye göre değişsin (örn. çöp görünce üzülmüş yüz). Referans: başka sistemde çöp toplama sahnesinde üzüntü yüzden belli; bizde hep aynı açık ağız gülümseme.

### 1) Loglardan ne görüyoruz?

Terminal çıktısı (satır 127–129):

- `Page 1 expression: happy`
- `Page 2 expression: curious`
- `Page 3 expression: joyful`

Yani **story tarafı sayfa bazlı farklı ifadeler üretiyor** (happy, curious, joyful). Ama çıkan görsellerde hep benzer, geniş ağız açık gülümseme var. Sonuç: sorun büyük ölçüde **görsel pipeline’da** – ya prompt yetersiz, ya referans (master) ifadeyi kilitlemiş.

### 2) Neden “hep ağzı açık” çıkıyor? (Kök nedenler)

- **Tek kelime ifade:** Prompt’a sadece “Facial expression: happy” / “curious” / “joyful” gidiyor. Modeller bu kelimeleri çoğu zaman “geniş, ağız açık gülümseme” ile eşleştiriyor. Yani **ifade talimatı çok genel**; net görsel karşılık yok.
- **Master referans baskın:** Master illüstrasyon tek bir “mutlu” referansla (çoğunlukla gülümseyen) üretiliyor. Sayfa görselleri bu master’a referansla üretildiği için **referansın yüz ifadesi korunuyor**, prompt’taki “curious” / “joyful” aynı “gülümseme”ye dönüşüyor. Edits/consistency API’leri yüz kimliğini korurken ifadeyi yeterince değiştirmiyor.
- **Prompt’ta ifade zayıf:** “Facial expression: X” uzun prompt içinde kaynıyor; model önceliği referans + genel “çocuk kitabı = mutlu” önyargısına veriyor. **İfade talimatı ne kadar somut (göz, ağız, kaş) olursa o kadar uygulanıyor.**

### 3) İnternet / literatür özeti

- **DALL·E / tutarlı karakter:** Tek kelime duygu (“happy”) yerine **göz, ağız, kaş için somut betimleme** kullanılması öneriliyor (örn. “eyes crinkled at corners, soft smile” vs “wide open mouth, teeth showing”). Böyle “default smile” tekrarı azalıyor.
- **Referans + ifade:** Referans görsel kullanırken “identity koru, ifadeyi bu sahneye göre değiştir” demek gerekiyor; sadece “Facial expression: curious” yetmiyor. **Açıkça “reference’taki ifadeyi kopyalama; bu sahnenin ifadesi: …”** gibi talimatlar etkili.
- **Çocuk kitabı / sinematik:** Duygu hem yüzde (kaş, göz, ağız) hem vücut dilinde; sahne sahne **duygu geçişi** (mutlu → meraklı → üzgün) hikaye anlatımını güçlendiriyor. “Cinematic” = sadece kameraya bakmamak değil; **anın duygusunun net yansıması**.

### 4) Genel çözüm yaklaşımı (ufak fix değil, sistem tasarımı)

**A) İfadeyi somutlaştır (tek kelime → kısa görsel tarif)**

- Story çıktısında sadece “happy/curious/joyful” değil, **o duyguya karşılık gelen kısa yüz betimlemesi** de olsun (story modeli yazsın veya biz sabit bir “emotion → prompt cümlesi” eşlemesi kullanalım).
- Örnekler:
  - happy → “warm smile, eyes slightly crinkled at corners, relaxed eyebrows”
  - curious → “eyebrows slightly raised, eyes wide and attentive, mouth closed or slightly open”
  - joyful / excited → “big smile” kabul edilebilir ama “teeth visible, eyes bright” gibi netleştirilebilir.
  - sad / worried → “downturned mouth, furrowed or raised inner eyebrows, eyes looking down or concerned”
- Amaç: Modelin “happy = her zaman aynı açık ağız gülümseme” yapmasını kırmak; **her duygu için farklı göz/ağız/kaş kombinasyonu** talep etmek.

**B) Master + sayfa prompt’unda “ifade referansı kopyalama”yı kır**

- Sayfa prompt’unda açıkça yazılmalı: **“Character expression for THIS scene: [somut tarif]. Do not copy the reference image’s expression; match only face identity and outfit.”** Böylece referans “yüz + kıyafet” için kullanılır, ifade sahneye bırakılır.
- İsteğe bağlı: Master illüstrasyonu **nötr veya hafif ifade** ile üretmek (örn. “neutral or gentle closed-mouth smile”). Böylece referans varsayılan olarak “büyük gülümseme” kilidi taşımaz.

**C) İfade talimatını prompt’ta öne çıkar**

- “Facial expression: X” tek cümle içinde kaybolmasın. **Ayrı bir blok veya cümle** (örn. “[CHARACTER_EXPRESSION] … [/CHARACTER_EXPRESSION]” veya “CRITICAL: This scene’s expression: …”) ve mümkünse prompt’un başında veya sonunda tekrarlanması; modelin öncelik vermesi için.

**D) Negatif / sınırlayıcı ifade**

- “No generic open-mouthed smile unless the scene is clearly joy or laughter; expression must match the scene mood.” gibi bir kural ile “her sayfada aynı gülümseme” engellenebilir.

**E) Story tarafında çeşitlilik**

- Story prompt’unda zaten “sayfa bazlı expression” var; ek olarak **“Vary expression by scene: not every page should be ‘happy’ or ‘joyful’; use sad, worried, surprised, focused, gentle where the text implies it.”** gibi talimat ile çöp/üzüntü gibi sahnelerde gerçekten “sad” veya “concerned” dönmesi teşvik edilir.
- İstenirse story’den **kısa görsel ipucu** da istenebilir (örn. “sad: downturned mouth, furrowed brows”) ama bu opsiyonel; önce tek kelime + bizim eşleme tablosu da yeterli olabilir.

**F) Sinematik = ifade + bakış + kompozisyon birlikte**

- Zaten eklenen “kameraya bakma, sahneye odaklan” direktifleri doğru yönde. “Sinematik ve doğal” his için:
  - **İfade:** Sahnenin duygusuna göre (üzgün / meraklı / neşeli) somut yüz tarifi.
  - **Bakış:** Sahneye, birbirine, nesneye (çöp, kuş, ateş); kameraya değil.
  - **Kompozisyon:** “Anın yakalanması”, poz verme hissi olmaması.
- Yani **ifade çeşitliliği olmadan** sadece bakışı düzeltmek “sanal” hissi tam kırmaz; ikisi birlikte ele alınmalı.

### 5) Özet: Ne yapılmalı?

| Adım | Ne | Neden |
|------|----|--------|
| 1 | **Expression’ı somutlaştır** | “happy/curious/joyful” → göz/kaş/ağız tarifi (story veya sabit eşleme). |
| 2 | **Sayfa prompt’unda “referans ifadesini kopyalama”** | “Do not copy reference expression; this scene’s expression: [tarif]. Match only face and outfit.” |
| 3 | **İfade talimatını vurgula** | Ayrı blok veya CRITICAL cümle; gerekirse tekrarla. |
| 4 | **Opsiyonel negatif** | “No generic open-mouthed smile unless scene is joy/laughter.” |
| 5 | **Story’de çeşitlilik** | Üzüntü/endişe gerektiren sahnelerde sad, worried, concerned dönmesi. |
| 6 | **Master ifadesi (opsiyonel)** | Nötr/hafif ifade ile üretmek; referansın “hep gülümseme” kilidini zayıflatmak. |

Bu yaklaşım **tek bir ufak fix değil**: story çıktısı (veya emotion→prompt eşlemesi), sayfa prompt metni, referans kullanım talimatı ve isteğe bağlı master politikasının birlikte güncellenmesiyle “hikaye anlatan, sinematik, ifade çeşitliliği olan” görseller hedeflenir.

**Not:** Bu bölümde sadece analiz ve çözüm yaklaşımı anlatıldı; kod değişikliği yapılmadı. Onay sonrası plan çıkarılıp uygulama adımlarına geçilebilir.

---

## UYGULAMA PLANI: İfade Çeşitliliği ve Sinematik Hikaye Anlatımı

### A) Master Karakterin Gülmesi Sorunu

**Durum:** Master illüstrasyon oluşturulurken kullanıcının yüklediği fotoğraf (genellikle gülümseyen) + "neutral pose" talimatı var ama **yüz ifadesi için talimat yok**. Sonuç: referans fotoğrafı güldüyse master de güler; bu ifade sayfalara taşınır.

**Çözüm:**
- Master prompt'una **açık ifade talimatı** ekle: `"Neutral or gentle facial expression, closed mouth or soft closed-mouth smile, calm and relaxed face."`
- Bu sayede master referans gülümseyen fotoğraftan üretilse bile **nötr/kapalı ağız** olur; sayfalarda ifade değiştirme serbestliği artar.
- **Dosya:** `app/api/books/route.ts` → `generateMasterCharacterIllustration` fonksiyonu (satır ~160 masterPrompt).

---

### B) Story Çıktısını Görsel Senaryo Haline Getir

**Hedef:** Story çıktısı "çizgi film senaryosu" gibi kısa ama **somut görsel betimleme** olsun; tek kelime değil, göz/kaş/ağız tarifi. Çok karakterli sahnelerde **her karakter için ayrı ifade**.

#### B.1) Story Şeması Güncelleme

**Şu anki story output (her sayfa için):**
```json
{
  "expression": "happy"  // tek kelime
}
```

**Yeni story output (her sayfa için):**
```json
{
  "characterExpressions": {
    "character-id-1": "eyes wide with surprise, eyebrows raised high, mouth slightly open in astonishment",
    "character-id-2": "calm and gentle smile, eyes crinkled at corners, relaxed eyebrows",
    "character-id-3": "concerned frown, eyebrows furrowed, looking down sadly at the trash"
  }
}
```

**Nasıl:**
- `lib/prompts/story/base.ts` → `buildOutputFormatSection`:
  - Tek `expression` alanı kaldırılır.
  - Yeni `characterExpressions` objesi eklenir (key = character ID, value = kısa İngilizce görsel tarif).
- `buildIllustrationSection`:
  - "For each page: describe each character's facial expression separately (eyes, eyebrows, mouth). Use specific visual details, not just emotion words (e.g. 'eyes wide, eyebrows raised, mouth open' instead of just 'surprised')."
- `buildCriticalRemindersSection`:
  - "characterExpressions REQUIRED per page: one entry per character ID, value = short English visual description of face (eyes, brows, mouth)."

#### B.2) Story Prompt Talimatları

- **Çeşitlilik:** "Vary expressions by page and by character. Not every character should be 'happy' or 'smiling' on every page. Use different expressions that match the scene: sad (downturned mouth, furrowed brows), worried (raised inner brows, tense face), curious (eyes wide, brows raised), angry (furrowed brows, tight mouth), focused (narrowed eyes, neutral mouth), surprised (wide eyes, open mouth), etc."
- **Görsel betimleme:** "For each character expression, describe specific facial features: eye shape (wide, narrowed, crinkled), eyebrow position (raised, furrowed, relaxed), mouth (open, closed, curved up/down, teeth showing). Make it visual, like a film director's note."
- **Çok karakter:** "If multiple characters are in the scene, each can have a different expression. Example: child surprised while adult is calm; or one character laughing while another looks concerned."

**Dosyalar:**
- `lib/prompts/story/base.ts` → `buildOutputFormatSection`, `buildIllustrationSection`, `buildCriticalRemindersSection`
- Story prompt versiyonu: v1.8.0 → v1.9.0

---

### C) Image Pipeline: Karakter Başına İfade

#### C.1) SceneInput Güncelleme

**Şu an:**
```ts
SceneInput {
  expression?: string  // tek ifade
}
```

**Yeni:**
```ts
SceneInput {
  characterExpressions?: Record<string, string>  // character ID → görsel tarif
}
```

#### C.2) Sayfa Prompt Oluşturma

**`app/api/books/route.ts` → sayfa generation döngüsü (satır ~1578):**
- Story'den `page.characterExpressions` al.
- Sayfa karakterleri (`pageCharacters`) ile eşleştir:
  ```ts
  const characterExpressions: Record<string, string> = {}
  pageCharacters.forEach(charId => {
    const expr = (page as any).characterExpressions?.[charId]
    if (expr?.trim()) {
      characterExpressions[charId] = expr.trim()
    }
  })
  const sceneInput = {
    ...
    characterExpressions,  // yeni alan
  }
  ```

**`lib/prompts/image/scene.ts` → `generateFullPagePrompt`:**
- `sceneInput.characterExpressions` varsa, her karakter için ayrı ifade talimatı ekle:
  ```
  [CHARACTER_EXPRESSIONS]
  - Character 1 (Arya): eyes wide with surprise, eyebrows raised, mouth slightly open
  - Character 2 (Grandpa): calm gentle smile, eyes crinkled, relaxed
  [/CHARACTER_EXPRESSIONS]
  ```
- **Kritik talimat:** "CRITICAL: Do not copy the reference image's facial expression. Match only face identity (features, skin, eyes, hair) and outfit. Each character's expression for THIS scene is specified above; use those exact descriptions."

**`lib/prompts/image/character.ts` → `buildMultipleCharactersPrompt`:**
- Çok karakterli sahnelerde her karakterin ifadesi varsa prompt'a ekle.

#### C.3) Log İyileştirmesi

**`app/api/books/route.ts` → sayfa generation logları (satır ~127–129 sonrası):**
```ts
storyData.pages.forEach((p: any, idx: number) => {
  const num = p.pageNumber ?? idx + 1
  console.log(`[Create Book] Page ${num} character expressions:`)
  const exprs = p.characterExpressions || {}
  Object.entries(exprs).forEach(([charId, expr]) => {
    const char = characters.find(c => c.id === charId)
    console.log(`  - ${char?.name || charId}: ${expr}`)
  })
  if (Object.keys(exprs).length === 0) {
    console.log(`  (none)`)
  }
})
```

**Dosyalar:**
- `app/api/books/route.ts` → sayfa generation, log
- `lib/prompts/image/scene.ts` → `generateFullPagePrompt`, `SceneInput` interface
- `lib/prompts/image/character.ts` → `buildMultipleCharactersPrompt` (isteğe bağlı)
- Scene prompt versiyonu: v1.10.0 → v1.11.0

---

### D) Prompt Vurgusu ve Negatif Talimat

#### D.1) İfade Bloğunu Öne Çıkarma

**`lib/prompts/image/scene.ts` → `generateFullPagePrompt` içinde:**
- `[CHARACTER_EXPRESSIONS]` bloğu mümkünse **Scene Content Section'dan önce** veya hemen sonra eklensin (şu an 8. bölüm).
- İsteğe bağlı: `buildCharacterExpressionsSection` ayrı fonksiyon.

#### D.2) Negatif Talimat

- "No generic open-mouthed smile unless the scene text clearly indicates joy, laughter, or excitement. Expression must match the character's emotion in THIS scene."
- `buildFinalDirectives` veya `buildCharacterExpressionsSection` içine ekle.

**Dosya:** `lib/prompts/image/scene.ts`

---

### E) Test Custom Promptları

Uygulama bittiğinde story API'ye (veya test senaryosuna) aşağıdaki `characterExpressions` değerleri verilerek farklı ifadelerin çalışıp çalışmadığı test edilebilir:

#### Test 1: Mutlu + Şaşırmış (2 karakter)

```json
{
  "pageNumber": 1,
  "characterExpressions": {
    "arya-id": "bright wide eyes, eyebrows raised high, mouth open in surprise and delight, big smile showing teeth",
    "grandpa-id": "warm gentle closed-mouth smile, eyes crinkled with joy, relaxed eyebrows, calm expression"
  }
}
```

**Beklenen:** Arya ağzı açık şaşırırken, Dede sakin gülümsüyor.

---

#### Test 2: Üzgün + Endişeli (çöp sahnesi)

```json
{
  "pageNumber": 2,
  "characterExpressions": {
    "arya-id": "sad downturned mouth, eyebrows raised at inner corners with concern, eyes looking down at the trash with disappointment",
    "grandpa-id": "serious concerned frown, furrowed eyebrows, mouth pressed in a straight line, thoughtful and worried expression"
  }
}
```

**Beklenen:** İkisi de üzgün/endişeli; Arya aşağı bakıyor, Dede ciddi.

---

#### Test 3: Kızgın + Sakin + Gülen (3 karakter)

```json
{
  "pageNumber": 3,
  "characterExpressions": {
    "child-1-id": "angry furrowed eyebrows, narrowed eyes, mouth turned down in a frown, tense face",
    "child-2-id": "calm neutral expression, eyes looking straight ahead, mouth closed, relaxed face",
    "adult-id": "laughing joyfully, eyes closed in a big smile, mouth open wide showing teeth, head tilted back slightly"
  }
}
```

**Beklenen:** 3 farklı ifade aynı sahnede.

---

#### Test 4: Meraklı + Odaklı

```json
{
  "pageNumber": 4,
  "characterExpressions": {
    "arya-id": "curious wide eyes, eyebrows slightly raised, mouth closed or slightly open, head tilted to the side with interest",
    "grandpa-id": "focused narrowed eyes, eyebrows slightly furrowed in concentration, mouth closed in a neutral line, attentive expression"
  }
}
```

**Beklenen:** Arya meraklı, Dede odaklı; ikisi de farklı ağız/göz kombinasyonu.

---

### E.2) Custom Requests Alanına Yazılabilecek Örnekler (Doğal Dil)

Create Book ekranındaki **Custom Requests** alanına aşağıdaki gibi doğal dilde yazarsanız, hikaye ve yüz ifadeleri bu isteklere göre şekillenir. JSON veya teknik format gerekmez; placeholder’daki gibi cümleler yeterli.

**Placeholder tarzı (İngilizce):**
```
E.g., On the first page have the child look surprised and delighted with wide eyes and a big smile, and the grandparent with a calm gentle smile. When they find trash on the path, both should look sad and concerned—downturned mouths, worried eyebrows. Later, one character curious with head tilted, the other focused and attentive. Vary facial expressions by scene so each page feels different.
```

**Kısa örnek (Türkçe):**
```
İlk sayfada çocuk şaşkın ve heyecanlı olsun, dede sakin gülümsesin. Yolda çöp görünce ikisi de üzgün ve endişeli yüz ifadesi takınsın. Sonraki sahnede biri merakla baksın, diğeri odaklanmış olsun. Her sayfada yüz ifadeleri sahneye göre değişsin.
```

**Uzun örnek (detaylı, İngilizce):**
```
I want varied facial expressions per page. Page 1: child with wide eyes and open mouth in surprise and delight, grandparent with a warm closed-mouth smile. Page 2: if they see trash or something sad, both with downturned mouths and concerned eyebrows, eyes looking down. Page 3: one character curious (eyes wide, head tilted), the other calm or focused. Not every character smiling on every page—match the mood of the scene.
```

**Çok karakter (3 kişi):**
```
Include three characters with different reactions in one scene: one angry or upset (furrowed brows, frown), one calm and neutral, one laughing or happy. Each character’s face should show a different emotion so the scene feels natural and story-like.
```

Bu metinleri Custom Requests kutusuna olduğu gibi yapıştırabilir veya kısaltıp kendi cümlenizi yazabilirsiniz. Story AI bu istekleri okuyup `characterExpressions` alanlarını buna göre doldurur; görsel taraf da bu ifadeleri kullanır.

---

### F) Uygulama Sırası

| # | Dosya | İşlem | Amaç |
|---|-------|-------|------|
| 1 | `app/api/books/route.ts` | Master prompt: "neutral or gentle expression, closed mouth" ekle | Master gülümseme kilidini kır |
| 2 | `lib/prompts/story/base.ts` | `expression` → `characterExpressions` (char ID → görsel tarif) | Story çıktısı görsel senaryo haline gelsin |
| 3 | `lib/prompts/story/base.ts` | Story talimatları: çeşitlilik, somut betimleme, çok karakter | AI farklı ifadeler + görsel tarif üretsin |
| 4 | `app/api/books/route.ts` | Sayfa generation: `characterExpressions` al, `sceneInput`'a ekle | Her karakter ifadesi image pipeline'a gitsin |
| 5 | `lib/prompts/image/scene.ts` | `SceneInput.characterExpressions`, `[CHARACTER_EXPRESSIONS]` bloğu ekle | Karakter başına somut ifade talimatı |
| 6 | `lib/prompts/image/scene.ts` | "Do not copy reference expression" + negatif (no generic smile) | Referans yüz kimliği için; ifade sahneye göre |
| 7 | `app/api/books/route.ts` | Log: sayfa başına karakter ifadeleri | Debug ve doğrulama |
| 8 | Test | Yukarıdaki custom promptlar ile test | Farklı ifadeler çalışıyor mu? |

---

### G) Beklenen Sonuç

- **Master:** Nötr/hafif ifade; gülümseme kilidi yok.
- **Story:** "Arya's eyes wide, brows raised, mouth open in surprise" + "Grandpa's calm smile, crinkled eyes" → çizgi film senaryosu gibi somut tarif.
- **Görseller:** Her sayfa her karakter farklı ifade; hikayeye göre üzgün/meraklı/şaşırmış/kızgın. Çok karakterli sahnelerde her biri ayrı duygu.
- **Sinematik:** İfade + bakış (sahneye/nesneye) + kompozisyon → "anın yakalanması" hissi.

---

**Not:** Bu plan kod değişikliği içermiyor; sadece yapılacaklar ve test senaryoları. Onaylarsan uygulama adım adım geçilir.
