# GPT Trace Cevabı – Kodla Karşılaştırmalı Değerlendirme (8 Şubat 2026)

**Amaç:** GPT’nin trace yorumlarını koda göre doğrulamak; hangi maddeleri haklı bulduğumuzu, hangilerini tartışmalı bıraktığımızı ve **Sıra 13 sonrası** plana nasıl ekleyeceğimizi netleştirmek. Onay sonrası ilgili özet PROMPT_OPTIMIZATION_GUIDE.md’ye eklenecek.

---

## 1. GPT’nin “bloklayıcı bug” iddiası: Sayfa prompt’una Türkçe metin girmesi

**GPT:** Page prompt’larında FOREGROUND altında Türkçe sayfa metni (page.text) var; bu stil/renk kontrolünü bozuyor.

**Kod kontrolü (route.ts + scene.ts):**

- `route.ts` ~1916: `sceneDescription = page.imagePrompt || page.sceneDescription || page.text` → sceneDescription için fallback doğru (önce İngilizce alanlar).
- `route.ts` ~1922: **`characterActionRaw = page.text || sceneDescription || ''`** → Burada **öncelik page.text**. Yani karakter aksiyonu için doğrudan **Türkçe sayfa metni** kullanılıyor.
- `sceneInput.characterAction` bu değerle dolduruluyor ve `generateLayeredComposition(sceneInput, sceneInput.characterAction, ...)` ile **FOREGROUND** satırına gidiyor: `FOREGROUND: ${characterAction}, main character in sharp focus...` (`scene.ts` ~830).

**Sonuç:** **GPT haklı.** Sayfa görsel prompt’unda FOREGROUND, fiilen Türkçe öykü metni (page.text) ile dolduruluyor. Bu hem “no text” beklentisiyle çelişir hem token’ı şişirir hem de stil direktiflerini zayıflatır.

**Önerilen fix (koda göre):** `characterActionRaw` için **page.text yerine İngilizce kaynak** kullanmak: örn. `page.sceneContext` veya `page.sceneDescription` (veya imagePrompt’tan türetilmiş tek cümle). Sadece bunlar yoksa fallback olarak page.text düşünülebilir; ancak tercih İngilizce olmalı.

**Rehbere eklenecek:** Evet – “Bloklayıcı: Sayfa prompt’unda FOREGROUND’a Türkçe page.text yerine İngilizce sceneContext/sceneDescription kullanılmalı” (Sıra 13 sonrası aksiyon).

---

## 2. Prompt’ta çelişkili stil ifadeleri (vibrant vs controlled, soft vs dramatic)

**GPT:** Aynı prompt’ta “controlled saturation” ile “vibrant saturated”, “soft cinematic” ile “high contrast dramatic shadows” birlikte; model ortalama bir sonuça kaçıyor.

**Kod kontrolü:**

- `style-descriptions.ts` – 3d_animation: **“vibrant saturated colors”** geçiyor.
- `getCinematicPack()`: **“controlled saturation”** var.
- `getEnhancedAtmosphericDepth()`: **“foreground: … vibrant saturated colors, rich textures, high contrast”** (scene.ts ~627).
- GLOBAL_ART_DIRECTION: “rich but **controlled** color grading”.

Yani aynı sayfa prompt’unda hem “vibrant saturated” hem “controlled” hem “high contrast” (foreground) hem “soft” (başka bloklar) bir arada.

**Sonuç:** **GPT haklı.** Özellikle 3D animation için renk/ton hedefi (ör. “Magicalchildrensbook” tarzı) net değil; çelişkili ifadeler var.

**Rehbere eklenecek:** Evet – “Stil tutarlılığı: Tek bir FILMIC_WARM_3D (veya eşdeğeri) profil; ‘vibrant saturated’ ile ‘controlled saturation’ ve ‘high contrast dramatic’ ile ‘soft cinematic’ aynı anda kullanılmamalı; çelişen cümleler temizlenmeli” (Sıra 13 sonrası).

---

## 3. Story JSON şeması (eksik alanlar, kelime sayısı)

**GPT:** summary, characterIds, characterExpressions, suggestedOutfits, supportingEntities trace’te yok/boş; sayfa metni word-count hedefini tutmuyor (örn. 26–29 kelime).

**Kod kontrolü:**

- Story prompt’ta **summary** zorunlu değil; bizde “summary” alanı yok. **characterIds, suggestedOutfits, characterExpressions** REQUIRED olarak geçiyor (base.ts). **supportingEntities** boş array olabilir (hikâyede hayvan/obje yoksa).
- Kelime sayısı: v2.1.0’da getWordCountRange (toddler 30–45 vb.) ve “Each page text at least X words” var; yine de model bazen 26–29 kelime üretebiliyor.

**Sonuç:** **Kısmen haklı.** Şema tarafında “summary” bizde yok; diğer alanlar gerçekten REQUIRED. Trace’te bunların eksik/boş gelmesi **model uyumsuzluğu**; JSON Schema / structured output veya retry ile sıkılaştırılabilir. Kelime sayısı için de validation + kısa “repair” önerisi mantıklı.

**Rehbere eklenecek:** Evet – “Story çıktısı: characterIds, suggestedOutfits, characterExpressions zorunlu; eksikse validation/retry; sayfa metni kelime sayısı kontrolü ve gerekirse repair” (Sıra 13 sonrası). “summary” alanı bizde olmadığı için rehberde “summary” zorunluluğu eklenmeyebilir; sadece mevcut REQUIRED alanlar vurgulanır.

---

## 4. Master: quality low, input_fidelity

**GPT:** Master’da quality: low; A12 (input_fidelity: high) trace’te yok.

**Kod kontrolü:**

- `route.ts`: Master için **quality: 'low'** ve **input_fidelity: 'high'** gönderiliyor (formData.append, ~235–236). Yani **input_fidelity zaten var.**

**Sonuç:** **Kısmen.** Quality gerçekten low; A12’nin “input_fidelity: high” kısmı **kodda uygulanmış**. Trace’te görünmemesi export/versiyon farkı veya eski bir trace olabilir.

**Rehbere eklenecek:** Master quality için “A6: quality low → medium/high A/B test” zaten planda; ek yorum: “Master’da input_fidelity: high mevcut; trace’te görünmeyebilir.” A12 maddesi “gpt-image-1 + input_fidelity denemesi” olarak kalabilir (model farkı).

---

## 5. “Relighting” ve referans kullanımı

**GPT:** “Use reference for face/hair/outfit only; do NOT copy lighting/background; allow relighting.” ekleyin.

**Kod kontrolü:** Zaten “Use reference image ONLY for character identity (same face, body proportions, and outfit). Do NOT copy pose, expression, or gaze…” var; “allow relighting” / “do NOT copy lighting” açık yok.

**Sonuç:** **Mantıklı.** Kimlik korunur, ışık/atmosfer sayfaya göre serbest kalır; Magical tarzı için faydalı olabilir.

**Rehbere eklenecek:** Evet – “Referans: identity only; prompt’a ‘do NOT copy lighting/background; allow relighting’ (veya eşdeğeri) eklenebilir” (Sıra 13 sonrası).

---

## 6. Style anchor image (referans olarak tek “renk dünyası” görseli)

**GPT:** Karaktersiz bir “style keyframe” üretip cover/page’de 2. referans olarak kullanmak; “Image[0]=identity, Image[1]=style/color grade only.”

**Kod kontrolü:** Şu an böyle bir akış yok; tüm referanslar karakter/entity master.

**Sonuç:** **Ürün/akış fikri;** doğruladığımız bir bug değil. Etkisi yüksek ama implementasyon maliyeti de yüksek (ek üretim, sıra, API).

**Rehbere eklenecek:** Evet – “İleride (opsiyonel): Style anchor image – tek görsel ile renk/grade referansı; Image[0]=identity, Image[1]=style” şeklinde not (Sıra 13 sonrası, düşük öncelik).

---

## 7. Prompt linter / tek STYLE, tek AVOID, tek SHOT_PLAN

**GPT:** Prompt linter; tek STYLE, tek AVOID, tek SHOT_PLAN; “scene establishment” gibi blokların şartlı/opsiyonel olması.

**Kod kontrolü:** A1/A7 ile zaten tek GLOBAL_ART_DIRECTION, tek SHOT PLAN, tek AVOID short var; ancak aynı prompt içinde hâlâ buildStyleSection, getCinematicPack, getEnhancedAtmosphericDepth vb. ayrı bloklar var ve bunlar çelişen sıfatlar içerebiliyor.

**Sonuç:** **Haklı.** Yapı tek bloklara yaklaştı ama **içerik** hâlâ çok kaynaktan geliyor; linter veya en azından “tek stil profili, çelişki yok” kuralı mantıklı.

**Rehbere eklenecek:** Evet – “Prompt linter veya manuel inceleme: tek STYLE mesajı, tek AVOID, tek SHOT_PLAN; çelişen sıfatların (vibrant/controlled, soft/dramatic) aynı prompt’ta olmaması” (Sıra 13 sonrası).

---

## 8. Öncelik sırası (hemen / A6 / A12 / renk / A5)

**GPT:** Önce Türkçe injection fix + prompt sadeleştirme; sonra A6, A12; renk için ayrı stil/grade veya style anchor; A5 en son.

**Değerlendirme:** Türkçe injection gerçek bir bug; önce onu düzeltmek mantıklı. Renk/ton için çelişkileri temizleyip tek profil (veya style anchor) planda “Sıra 13 sonrası” yapılacaklar listesine alınabilir. A5’i yüksek risk diye sona bırakmak planımızla uyumlu.

**Rehbere eklenecek:** Öncelik sırası özeti (bug fix → A6/A12 → renk/stil → A5) Sıra 13 sonrası bölümünde kısaca yazılabilir.

---

## 9. Sıra 13 sonrasına eklenmesi

**Senin tercihin:** “Her türlü 13. madde sonrasına eklenmeli.”

**Benim yorumum:** Aynı fikirdeyim. Bu maddeler:

- Ya yeni bulgu (Türkçe injection, çelişkili stil),
- Ya mevcut planın detayı (A6, A12, relighting),
- Ya da ileriye dönük fikir (style anchor, linter).

Hepsi “planın asıl 13 maddesi (A1–A12 + doküman eşitlemesi) bittikten sonra” yapılacak backlog olarak konumlandırılmalı. Böylece hem mevcut planda sıra karışmaz hem de GPT trace çıktıları tek yerde toplanır.

**Tek fark:** “Türkçe injection”ı **bloklayıcı bug** sayıp, istenirse 13’ten hemen önce tek istisna olarak yapılabilir; rehberde yine “Sıra 13 sonrası backlog”ta yer alır, uygulama önceliği ayrıca “öncelik sırası”nda vurgulanır.

---

## 10. Özet – Rehbere gidecek maddeler (onay sonrası)

| # | Konu | GPT’ye göre | Koda göre | Rehbere ekle? |
|---|------|-------------|-----------|----------------|
| 1 | FOREGROUND’a Türkçe page.text girmesi | Bug | Doğrulandı (characterActionRaw = page.text) | Evet – bloklayıcı fix (Sıra 13 sonrası, öncelik yüksek) |
| 2 | Çelişkili stil (vibrant/controlled, soft/dramatic) | Sorun | Doğrulandı (style-descriptions + cinematic + atmospheric depth) | Evet – tek stil profili, çelişkilerin kaldırılması |
| 3 | Story şema / kelime sayısı | Eksik alanlar, word count | characterIds/suggestedOutfits/characterExpressions REQUIRED; word count bazen kaçıyor | Evet – validation/retry + word-count kontrolü (summary opsiyonel) |
| 4 | Master quality low / input_fidelity | A6, A12 | quality low doğru; input_fidelity zaten high | Evet – A6 A/B; A12 notu (input_fidelity mevcut) |
| 5 | “Allow relighting” | Öneri | Identity only var, relighting açık yok | Evet – “do NOT copy lighting; allow relighting” benzeri |
| 6 | Style anchor image | Öneri | Yok | Evet – ileride/opsiyonel |
| 7 | Prompt linter / tek STYLE, tek AVOID | Öneri | Yapı var, içerik çok kaynaklı | Evet – linter veya çelişki kuralı |
| 8 | Öncelik sırası | Bug fix → A6/A12 → renk → A5 | — | Evet – Sıra 13 sonrası öncelik özeti |

Hepsi **Sıra 13 (Prompts doküman = kod eşitlemesi) sonrası** bölümüne “GPT trace incelemesi (8 Şubat 2026) – takip aksiyonları” başlığıyla eklenebilir. Onaylarsan PROMPT_OPTIMIZATION_GUIDE.md’ye bu özet + kısa aksiyon listesini ekleyeceğim.
