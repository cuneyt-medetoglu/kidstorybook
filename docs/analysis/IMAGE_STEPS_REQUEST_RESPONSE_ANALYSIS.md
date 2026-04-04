# Görsel adımları — request / response analizi ve aksiyon planı

**Son güncelleme:** 3 Şubat 2026  
**Amaç:** Story generation için kurulan **request/response disiplinini** master illustration, entity master ve (planlı) diğer görsel/TTS adımlarına aynı profesyonellikte uygulamak. Bu dosya **analiz ve aksiyon planıdır**; implementasyon ayrı iş paketlerinde yapılır.

**İlgili kod:** `lib/book-generation/image-pipeline.ts` · `lib/book-generation/supporting-entities.ts` · `lib/prompts/image/style-descriptions.ts` · `lib/ai/images.ts` · `lib/debug/step-runner-sanitize.ts` · `components/debug/StepRunnerPanel.tsx`

---

## 1) Story generation (referans seviye)

| Boyut | Durum |
|--------|--------|
| Request | System/user ayrımı, şema ile hizalı user içerik, merkezi model config |
| Response | `prepareStoryResponseForUse`: normalizasyon + sınırlı repair + assert; örnek kayıt: Step-Runner story `aiLog` / panoya kopyala |
| Gözlemlenebilirlik | Step-Runner `aiLog`, JSON kopyala |

**Sonuç:** Bu faz için “iyi denilebilecek yer” hedefi karşılandı; aşağıdaki adımlar bu çubuğa yaklaşmayı hedefler.

---

## 2) Master illustration — ne var, neye bakılır, ne çıkar?

**M1 (sözleşme):** Alan sözlüğü + Child vs Pet prompt kaynakları — tek kaynak: [`MASTER_ILLUSTRATION_CONTRACT.md`](./MASTER_ILLUSTRATION_CONTRACT.md).

**M2 (arşiv):** Örnek JSON adlandırma + regresyon profili P1 — [`MASTER_ILLUSTRATION_CONTRACT.md`](./MASTER_ILLUSTRATION_CONTRACT.md) §9.

### 2.1 Teknik gerçeklik (request)

- **API:** OpenAI Images **edits** (`POST /v1/images/edits`) — referans fotoğraf (multipart) + metin `prompt`.
- **Kitap başına çağrı sayısı:** Referansı olan her karakter için **bir** master (ana + yan karakterler).
- **İstek gövdesi (mantıksal):** `model`, `prompt`, `size`, `quality`, `input_fidelity`, `image[]` (dosya).
- **Prompt kaynağı:** `generateMasterCharacterIllustration` — **çocuk** vs **evcil (Pets)** dalları; `getStyleDescription(illustrationStyle)`; çocukta ANATOMY + EXPRESSION + `suggestedOutfits` / tema yedek kıyafet; evcilte `buildPetCharacterBrief` + style-first talimatlar.
- **Yanıt:** `b64_json` (veya API varyantı) → S3 `books/.../masters/` → public URL.

### 2.2 Response / izlenebilirlik (bugün)

- **Worker / üretim:** Ham yanıt işlenir; istemciye tam trace her zaman gitmez.
- **Step-Runner:** `aiLog` içinde sanitize edilmiş kayıt (`formDataToDebugRecord`: prompt açık, dosya = meta; URL/b64 çıkarılmış). `debugTracePush` ile özet `request` (model, prompt, size, quality, characterId) ve kısa `response` notu.
- **Arşiv örneği:** Step-Runner **Master Illustrations** + takım içi saklanan sanitize JSON (adlandırma: `MASTER_ILLUSTRATION_CONTRACT.md` §9).

### 2.3 Story ile karşılaştırmalı boşluklar (iyileştirme ihtiyacı)

| Konu | Açıklama |
|------|-----------|
| **Çoklu örnek disiplini** | Story’de tek `request.json`/`response.json` net; master’da N karakter = N çift. “Paket” başına **numaralandırılmış şablon** (örn. `01_image-master_arya.md` veya json) dokümante edilmeli. |
| **Dal başına sözleşme** | Child / Pet / (ileride Family vb.) prompt blokları farklı; her dal için **beklenen alan listesi** (STYLE, ANATOMY, outfit, …) yazılı “contract” olmalı. |
| **`input_fidelity`** | Şu an `high`; stilize kitaplarda referans baskısı ürün kararı. Analiz: stil başına öneri veya konfigürasyon notu. |
| **Hata ve yeniden deneme** | Moderation’da `softMasterPrompt` var; diğer hatalar (ağ, boş `b64_json`) tek yol. Aksiyon: hangi hatalarda retry, hangilerinde kullanıcı mesajı — net tablo. |
| **Yan karakter başarısızlığı** | Pipeline ana karakterde fail → throw; yan karakterde warn. Aksiyon: ürün kuralları dokümante + log alanları tutarlı. |
| **Usage / maliyet** | Story’de token usage görünür; image adımında **resmi usage** (varsa) log’a bağlama — gözlemlenebilirlik. |
| **Regresyon seti** | En az: 1 çocuk + 1 evcil + seçilen stil (ör. `comic_book`); isteğe bağlı 3D / watercolor. Story’deki `d4:smoke` benzeri **image prompt assert’leri** (string içerik) ayrı script olarak düşünülebilir — kod değil, planda “önerilir”. |

### 2.4 Master — aksiyon özeti (çıktı: yapılacak iş listesi)

1. **Dokümantasyon:** Master request/response alan sözlüğü (edits çağrısı + Step-Runner’da görünen şekil).  
2. **Dal sözleşmeleri:** Child vs Pet prompt blokları için tek sayfalık şema (hangi cümle nereden geliyor: `suggestedOutfits`, tema, `character.description`).  
3. **Arşiv standardı:** ✅ [`MASTER_ILLUSTRATION_CONTRACT.md`](./MASTER_ILLUSTRATION_CONTRACT.md) §9 (M2) — isimlendirme, P1 regresyon profili.  
4. **Gözlemlenebilirlik:** ✅ M3 — `insertAIRequest` + `response_meta.usage`; Step-Runner’da usage özeti; ayrıntı [`MASTER_ILLUSTRATION_CONTRACT.md`](./MASTER_ILLUSTRATION_CONTRACT.md) §7.  
5. **Regresyon:** Belirlenen kitap profilleriyle periyodik kontrol (manuel veya otomatik prompt assert).  
6. **`input_fidelity`:** Stil veya env ile yönetim kararı dokümante edilsin.

---

## 3) Entity master — ne var, neye bakılır, ne çıkar?

### 3.1 Teknik gerçeklik (request)

- **API:** OpenAI Images **generations** (`POST /v1/images/generations`) — **referans görsel yok**, yalnızca metin `prompt`.
- **Kitap başına çağrı sayısı:** `storyData.supportingEntities` içindeki her geçerli varlık için bir üretim (pipeline’da `Promise.allSettled` — biri düşerse diğerleri sürebilir).
- **Prompt kaynağı:** `buildSupportingEntityMasterPrompt` — `getStyleDescription` + `getCinematicPack(illustrationStyle)` + İngilizce isim/açıklama + `type === 'animal' | 'object'` için kısa son cümleler + sanitize.

### 3.2 Response / izlenebilirlik (bugün)

- **Step-Runner:** `image_entity` için `aiLog`; `debugTracePush` isteğinde `model`, `prompt`, `size`, `entityId`, `type`, `name` ve kısa response notu.
- **Arşiv:** Entity için repo kökünde sabit klasör yok; istenirse master ile aynı adlandırma disiplini ve Step-Runner `image_entity` logu kullanılır.

### 3.3 Story / master ile karşılaştırmalı boşluklar

| Konu | Açıklama |
|------|-----------|
| **Referans yokluğu** | Karakter master’ı fotoğrafla sabitler; entity tamamen metinden çizilir — **story `description` kalitesi** kritik. Aksiyon: prompt’ta description uzunluğu/özellik zorunluluğu story tarafıyla hizalı mı, kontrol listesi. |
| **Stil tutarlılığı** | `getStyleDescription` + `getCinematicPack` kullanılıyor (D3 ile grafik profil uyumlu). Aksiyon: `comic_book` / `geometric` gibi stillerde **sayfa promptu** ile aynı dil yoğunluğunda mı — karşılaştırmalı inceleme. |
| **`appearsOnPages` prompt’ta yok** | Şu an yalnızca sayfa seçiminde kullanılıyor; entity master görseli sayfa-bağımsız “tek tip sheet”. Bu bilinçli tasarım olabilir; dokümante edilmeli (veya ileride “hangi sayfalarda görünür” ipucu eklenir — ürün kararı). |
| **Retry / moderation** | Master’daki gibi yumuşak ikinci prompt yolu entity’de **yok**. Aksiyon: entity için moderation veya kalite düşüşü senaryosu değerlendirmesi. |
| **Çoklu entity sırası** | Paralel üretim; sıra garantisi yok. Log ve S3 isimleri `entityId` ile ayırt ediliyor — yeterli mi, dokümante. |
| **Hayvan vs nesne** | İki kısa kalıp cümle; karmaşık varlıklar (ör. “büyülü pelerin”) için yeterlilik gözden geçirilecek. |

### 3.4 Entity master — aksiyon özeti

1. **Dokümantasyon:** Generations request alanları + örnek tam prompt (kişisel veri içermeyen).  
2. **Arşiv standardı:** Entity başına request/response özet dosyası (master ile aynı numaralandırma disiplini; kaynak: Step-Runner `image_entity` logu).  
3. **Prompt sözleşmesi:** `[STYLE]`, `[RENDER]`, İngilizce brief, type son satırları — beklenen sıra ve zorunlu anlam bileşenleri.  
4. **Story ile hizalama:** `supportingEntities[].description` için story prompt’taki kurallarla çapraz kontrol (çelişki var mı).  
5. **Ürün kararı dokümantasyonu:** `appearsOnPages`’in master görseline etkisi (şu an yok) veya gelecekte eklenecekse gereksinim.  
6. **Dayanıklılık:** Moderation / boş yanıt için master ile simetrik retry stratejisi değerlendirmesi.  
7. **Regresyon:** En az bir `animal` + bir `object` + seçilen stil ile uçtan uca Step-Runner kaydı.

---

## 4) Sonraki incelemeler (bu dosyada plan kaydı)

Aşağıdaki adımlar **henüz bu dokümanda derin analiz edilmedi**; story/master/entity ile aynı formatta genişletilecek.

| Adım | API / not | İnceleme odağı (özet) |
|------|-----------|------------------------|
| **Cover image** | Genelde edits veya generations + master referansları | Prompt birleşimi (`coverImagePrompt`, `coverEnvironment`, master URL’leri), çok karakter, kapak layout direktifleri, request/response arşivi |
| **Page images** | Sayfa başına görsel; sahne + master + entity referans seçimi | `generateFullPagePrompt`, `page-scene-contract`, batch paralellik, hata yeniden deneme, maliyet |
| **TTS** | Google Cloud TTS (OpenAI değil) | Metin kaynağı, dil, ses seçimi, request/response (veya SDK çıktısı) loglama, sayfa başı hata yönetimi |

Bu bölüm **roadmap’te “planlı çalışma”** olarak referans verilir; detaylı tablolar cover/page/TTS çalışması başladığında buraya veya alt başlıklara eklenir.

---

## 5) Özet tablo — hangi dosya ne işe yarar

| Çıktı | Amaç |
|--------|------|
| Bu analiz (`IMAGE_STEPS_REQUEST_RESPONSE_ANALYSIS.md`) | Master / entity / sonraki adımlar için **ortak sözlük ve aksiyon listesi** |
| `STORY_GENERATION_DEV_ROADMAP.md` | Üst seviye faz ve bu dosyaya **link** |
| Step-Runner `aiLog` + isteğe bağlı takım arşivi | Gerçek koşulardan örnek request/response (standartlar: `MASTER_ILLUSTRATION_CONTRACT.md` §9 ve ilgili sözleşme bölümleri) |

---

## 6) Profesyonel ilke (geçici çözüm yok)

- **Sözleşme önce:** Her adım için “hangi alanlar gider / gelir” yazılı olmadan kod genişletilmez.  
- **Gözlemlenebilirlik:** Üretim ve Step-Runner aynı olayın iki görünümü; log alanları bilinçli seçilir.  
- **Regresyon:** Story’deki gibi tekrarlanabilir minimum set (profil × stil).  
- **Ürün kararı ayrı:** `input_fidelity`, retry sayısı, entity’de referans görsel isteyip istememe — teknik öneri + ürün onayı.

Bu belge revize edildikçe **Son güncelleme** satırı ve ilgili bölüm notları güncellenir.
