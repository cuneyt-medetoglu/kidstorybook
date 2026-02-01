# Görsel Kompozisyon ve Derinlik Analizi

**Tarih:** 25 Ocak 2026  
**Amaç:** Uygulamada oluşturulan görsellerdeki sahne derinliği eksikliği ve karakter hâkimiyeti sorunlarının analizi  
**Durum:** Analiz - Plan aşamasına geçilecek

---

## 📋 İçindekiler

1. [Sorun Tespiti](#sorun-tespiti)
2. [Örnek Görseller Analizi](#örnek-görseller-analizi)
3. [Mevcut Prompt Yapısı İncelemesi](#mevcut-prompt-yapısı-incelemesi)
4. [Sorunların Nedenleri](#sorunların-nedenleri)
5. [Teknik Kısıtlar](#teknik-kısıtlar)
6. [Çözüm Önerileri Temel Bulguları](#çözüm-önerileri-temel-bulguları)
7. [Sonuç ve Sonraki Adımlar](#sonuç-ve-sonraki-adımlar)

---

## 🎯 Sorun Tespiti

### Mevcut Durum

Uygulamada oluşturulan görsellerde şu sorunlar gözlemlenmektedir:

1. **Sahne Derinliği Eksikliği**
   - Ön plan, orta plan ve arka plan net bir şekilde ayrılmıyor
   - Atmosferik perspektif (atmospheric perspective) yetersiz
   - Depth of field (alan derinliği) etkisi zayıf
   - Görseller "düz" ve "iki boyutlu" görünüyor

2. **Karakter Hâkimiyeti**
   - Karakterler görselin çoğu zaman büyük bir bölümünü kaplıyor
   - Çevre (environment) yeterince görünmüyor veya detaylandırılmamış
   - Karakter-çevre oranı dengesiz
   - Karakterler sahneye entegre olmaktan çok, sahneyi "yutuyor"

3. **Kompozisyon Sorunları**
   - Sinematik sahne kurulumu eksik
   - Kamera açısı ve perspektif çeşitliliği yetersiz
   - Işıklandırma (lighting) detayları yetersiz
   - Renk paleti ve atmosfer zenginliği eksik

### Beklenen Kalite

Örnek görsellerde gözlemlenen kalite standartları:

- ✅ **Mükemmel Alan Derinliği:** Ön, orta ve arka planın net ayrımı
- ✅ **Dengeli Kompozisyon:** Karakterler sahnenin önemli bir parçası ama çevreyi domine etmiyor
- ✅ **Sinematik Atmosfer:** Altın saat ışıklandırması, güneş ışınları, zengin renk paleti
- ✅ **Çevre Zenginliği:** Geniş gökyüzü, detaylı arka plan, atmosferik unsurlar

---

## 🖼️ Örnek Görseller Analizi

### Örnek 1: Orman Yolu Sahnesi

**Gözlemlenen Özellikler:**

1. **Kompozisyon ve Alan Derinliği:**
   - **Ön Plan:** Köpek ve kız çocuğu net odakta, keskin detaylar
   - **Orta Plan:** Erkek çocuk, anne ve araba - dengeli yerleşim
   - **Arka Plan:** Yoğun orman, güneş ışığı süzülmesi, atmosferik perspektif
   - **Patika:** Ön plandan arka plana doğru derinlik hissi yaratan leading line

2. **Işıklandırma:**
   - Altın saat (golden hour) ışıklandırması
   - Ağaçların arasından süzülen güneş ışınları (god rays)
   - Karakterlerin arkasından gelen backlighting
   - Derin gölgeler ve parlak vurgular

3. **Karakter-Çevre Dengesi:**
   - Karakterler ön planda ama görselin %30-40'ını kaplıyor (dengeli)
   - Orman ve gökyüzü geniş alan kaplıyor (%60-70)
   - Karakterler çevreye entegre, ayrı durmuyor

### Örnek 2: Kamp Ateşi Sahnesi

**Gözlemlenen Özellikler:**

1. **Kompozisyon:**
   - **Ön Plan:** Köpek ve kamp ateşi - net odak
   - **Orta Plan:** Karakterler kütük üzerinde - dengeli grup kompozisyonu
   - **Arka Plan:** Su yüzeyi, gün batımı gökyüzü - atmosferik zenginlik
   - **Gökyüzü:** Tüm üst kısmı kaplayan dramatik gün batımı

2. **Atmosfer:**
   - Gün batımının sıcak renkleri (turuncu, pembe, mor)
   - Su yüzeyindeki yansımalar
   - Ateşin sıcak ışığı ile gökyüzünün soğuk renkleri kontrastı
   - Duygusal derinlik (warmth, coziness)

3. **Karakter-Çevre Dengesi:**
   - Karakterler merkezi odak ama çevre geniş alan kaplıyor
   - Gökyüzü ve su yüzeyi görselin %50+ alanını kaplıyor
   - Karakterler sahneye entegre, doğal duruş

### Örnek 3: Çöp Toplama Sahnesi

**Gözlemlenen Özellikler:**

1. **Alan Derinliği:**
   - **Ön Plan:** Patika başlangıcı, çiçekler, köpek - hafif bulanık (bokeh)
   - **Orta Plan:** Karakterler keskin odakta
   - **Arka Plan:** Uzaktaki ağaçlar yumuşak, atmosferik perspektif
   - **Odak Düzlemi:** Karakterler üzerinde yoğunlaşmış

2. **Işıklandırma:**
   - Ağaçların arasından süzülen güneş ışığı
   - Karakterlerin arkasından gelen backlighting
   - Yapraklar ve çiçekler üzerindeki parlamalar (highlights)
   - Doğal gölge-ışık dengesi

3. **Kompozisyon:**
   - Patika leading line olarak kullanılmış
   - Üçte bir kuralı (rule of thirds) uygulanmış
   - Hafif alçak kamera açısı (çocuk perspektifi)

### Örnek 4: Odun Toplama Sahnesi (Kontrol - Mevcut Sorunlar)

**Gözlemlenen Sorunlar:**

1. **Derinlik Eksikliği:**
   - Katmanlı düzenleme var ama ışıklandırma eşit ve yumuşak
   - Dramatik gölgeler veya vurgular yok
   - Üç boyutluluk hissi zayıf
   - "Sinematik" etki yok

2. **Karakter Hâkimiyeti:**
   - Köpek ve karakterler çerçevenin önemli bölümünü kaplıyor
   - Arka plan ve sahne atmosferi daha az ön plana çıkıyor
   - Karakterler çok yakın plan ve büyük ölçekte

3. **Işıklandırma:**
   - Doğal ve yaygın ışık kaynakları
   - Güçlü gölge/ışık oyunları eksik
   - Dramatik atmosfer yok

---

## 🔍 Mevcut Prompt Yapısı İncelemesi

### Mevcut Prompt Bileşenleri

**Dosya:** `lib/prompts/image/v1.0.0/scene.ts`

#### 1. `generateFullPagePrompt()` Fonksiyonu

**Mevcut Yapı:**
```typescript
1. Anatomical directives (en başta)
2. Style description
3. Layered composition (FOREGROUND/MIDGROUND/BACKGROUND)
4. Scene prompt
5. Age rules
6. Multiple characters note
7. Cover/consistency notes
8. Clothing consistency
9. No text directive
```

**Sorunlar:**
- ✅ Layered composition var ama yeterince detaylandırılmamış
- ❌ Depth of field direktifleri eksik
- ❌ Kamera açısı ve perspektif detayları yetersiz
- ❌ Işıklandırma detayları minimal
- ❌ Atmosferik perspektif direktifleri yok
- ❌ Karakter-çevre oranı belirtilmemiş

#### 2. `getCinematicElements()` Fonksiyonu

**Mevcut Kod:**
```typescript
export function getCinematicElements(pageNumber: number, mood: string): string {
  const lighting = mood === 'exciting' ? 'dynamic lighting' : mood === 'calm' ? 'soft ambient' : 'warm natural light'
  const angle = pageNumber === 1 ? 'hero shot' : 'varied perspective'
  return `layered depth, rule of thirds, ${lighting}, ${angle}, cinematic quality`
}
```

**Sorunlar:**
- ❌ Çok genel ve yüzeysel
- ❌ Spesifik ışıklandırma teknikleri yok (golden hour, backlighting, god rays)
- ❌ Kamera açısı çeşitliliği yetersiz
- ❌ Depth of field detayları yok

#### 3. `generateLayeredComposition()` Fonksiyonu

**Mevcut Kod:**
```typescript
export function generateLayeredComposition(
  sceneInput: SceneInput,
  characterAction: string,
  environment: string
): string {
  const layers: string[] = []
  
  layers.push(`FOREGROUND: ${characterAction}, main character in clear focus with detailed features visible`)
  layers.push(`MIDGROUND: ${sceneInput.sceneDescription || 'story elements and contextual objects'}`)
  layers.push(`BACKGROUND: ${environment}, providing depth and atmosphere`)
  
  return layers.join('. ')
}
```

**Sorunlar:**
- ❌ Depth of field (bokeh, focus plane) detayları yok
- ❌ Atmosferik perspektif direktifleri yok
- ❌ Karakter-çevre oranı belirtilmemiş
- ❌ Ön plan bulanıklığı (foreground bokeh) yok

#### 4. `getCompositionRules()` Fonksiyonu

**Mevcut Kod:**
```typescript
function getCompositionRules(focus: string, pageNumber: number): string {
  const base = focus === 'character' ? 'character centered, clear face' :
               focus === 'environment' ? 'wide environmental shot' :
               'balanced composition'
  const special = pageNumber === 1 ? ', inviting opening' : pageNumber >= 10 ? ', conclusion' : ''
  return base + special
}
```

**Sorunlar:**
- ❌ Çok basit ve genel
- ❌ Kamera açısı çeşitliliği yok
- ❌ Leading lines, symmetry, diagonal composition gibi teknikler yok
- ❌ Karakter-çevre oranı belirtilmemiş

#### 5. `getLightingDescription()` Fonksiyonu

**Mevcut Kod:**
```typescript
function getLightingDescription(timeOfDay: string, mood: string): string {
  const lighting: Record<string, string> = {
    morning: 'soft morning light', 
    afternoon: 'bright daylight',
    evening: 'golden hour', 
    night: 'moonlight',
  }
  return lighting[timeOfDay] || 'bright daylight'
}
```

**Sorunlar:**
- ❌ Çok minimal - sadece zaman belirtiyor
- ❌ Işık yönü (backlighting, side lighting) yok
- ❌ Işık kalitesi (hard/soft) yok
- ❌ Özel efektler (god rays, rim lighting) yok
- ❌ Gölge detayları yok

### Mevcut Environment Templates

**Dosya:** `lib/prompts/image/v1.0.0/scene.ts`

**Mevcut Kod:**
```typescript
const ENVIRONMENT_TEMPLATES: Record<string, string[]> = {
  adventure: ['lush forest, dappled sunlight, wildflowers', 'mountain path, colorful wildflowers, distant peaks'],
  sports: ['sunny playground, colorful equipment', 'sports field, bright cones, goal posts'],
  // ...
}
```

**Sorunlar:**
- ❌ Çok kısa ve yüzeysel
- ❌ Arka plan detayları yetersiz
- ❌ Atmosferik unsurlar (gökyüzü, hava durumu) minimal
- ❌ Derinlik yaratacak unsurlar (uzak ağaçlar, ufuk çizgisi) yok

---

## 🔎 Sorunların Nedenleri

### 1. Prompt Detay Eksikliği

**Ana Sorun:** Prompt'larda kompozisyon, kamera açısı, karakter-çevre oranı, ışıklandırma detayları, alan derinliği gibi sinematik ve sanatsal öğeler yeterince detaylandırılmamış.

**Örnek Eksiklikler:**
- Depth of field direktifleri yok
- Atmosferik perspektif direktifleri yok
- Spesifik ışıklandırma teknikleri yok (backlighting, god rays, rim lighting)
- Kamera açısı çeşitliliği yetersiz
- Karakter-çevre oranı belirtilmemiş

### 2. Model Ayarları

**Mevcut Ayarlar:**
- Model: `gpt-image-1.5` (sabit)
- Size: `1024x1536` (portrait) (sabit)
- Quality: `low` (sabit)

**Not:** Model ve ayarlar sabitlenmiş durumda. Quality `low` olması detay ve derinlik için yeterli performansı sağlamıyor olabilir, ancak prompt iyileştirmesi öncelikli olmalıdır.

### 3. Prompt Optimizasyonu (18 Ocak 2026)

**Yapılan Optimizasyon:**
- Style directives: 1500→200 chars (%87 azalma)
- Cinematic elements: 50→5 lines (%90 azalma)
- Environment templates: 90→15 lines (%83 azalma)
- Composition rules: 28→7 lines (%75 azalma)
- **Toplam: ~%70 azalma**

**Sorun:** Bu optimizasyon token bütçesi için iyi ama kalite için kritik detayların kaybına neden olmuş olabilir.

### 4. Karakter Odaklı Yaklaşım

**Mevcut Yaklaşım:**
- Prompt'larda karakter detayları çok vurgulanıyor
- Çevre ve atmosfer ikinci planda kalıyor
- Karakter-çevre dengesi kurulmamış

---

## ⚙️ Teknik Kısıtlar

### 1. Model ve Ayarlar

**Mevcut Durum:**
- Model: `gpt-image-1.5` (sabit - override yok)
- Size: `1024x1536` (portrait) (sabit)
- Quality: `low` (sabit)
- Rate Limit: 4 images/90s

**Kısıtlar:**
- Quality `low` olması detay ve derinlik için yeterli performansı sağlamıyor olabilir
- Ancak prompt iyileştirmesi ile bu kısıt aşılabilir
- Model değişikliği şu an mümkün değil (sabit değerler)

### 2. Prompt Uzunluk Limiti

**Mevcut Limit:**
- OpenAI dokümantasyonu: 32,000 karakter (GPT-image-1.5)

**Durum:**
- Mevcut prompt'lar bu limitin çok altında
- Daha detaylı prompt'lar eklenebilir
- Token bütçesi yeterli

### 3. Backend Altyapı

**Mevcut Durum:**
- ✅ Queue sistemi mevcut (`lib/queue/image-generation-queue.ts`)
- ✅ Paralel batch processing (4 görsel)
- ✅ Rate limiting aktif
- ✅ Cover-as-reference yaklaşımı mevcut

**Sonuç:** Backend altyapısında bir sorun yok. Sorun prompt kalitesinde.

---

## 💡 Çözüm Önerileri Temel Bulguları

### 1. Prompt İyileştirme Önceliği

**Ana Bulgu:** Sorunun temel nedeni prompt kalitesi. Model ve ayarlar sabit olsa da, doğru prompt'lar ile kaliteli sonuçlar alınabilir.

**Öncelik Sırası:**
1. **Kompozisyon ve Alan Derinliği Direktifleri** (en kritik)
2. **Işıklandırma Detayları** (çok önemli)
3. **Kamera Açısı ve Perspektif** (önemli)
4. **Karakter-Çevre Oranı** (önemli)
5. **Atmosferik Perspektif** (önemli)

### 2. Örnek Görsellerden Çıkarılan Teknikler

**Kompozisyon:**
- Leading lines (patika, yol)
- Rule of thirds
- Layered depth (ön/orta/arka plan)
- Balanced character-environment ratio

**Işıklandırma:**
- Golden hour / sunset lighting
- Backlighting (karakterlerin arkasından)
- God rays (ağaçların arasından süzülen ışınlar)
- Rim lighting (karakter kenarlarında parlaklık)
- Atmospheric haze (uzak planlarda sisli görünüm)

**Kamera ve Perspektif:**
- Wide shot (geniş açı)
- Medium shot (orta plan)
- Low angle (alçak açı - çocuk perspektifi)
- Eye-level (göz seviyesi)
- Varied perspectives (sayfa sayfa değişen açılar)

**Depth of Field:**
- Shallow depth of field (sığ alan derinliği)
- Foreground bokeh (ön plan bulanıklığı)
- Background bokeh (arka plan bulanıklığı)
- Focus plane (odak düzlemi) karakterler üzerinde

**Atmosferik Perspektif:**
- Uzak planlarda renklerin açılması
- Kontrastın azalması
- Detayların yumuşaması
- Haze/fog efekti

### 3. Karakter-Çevre Dengesi

**Hedef Oran:**
- Karakterler: %30-40 (ön plan + orta plan)
- Çevre: %60-70 (orta plan + arka plan + gökyüzü)

**Direktifler:**
- "Character occupies 30-40% of frame, environment 60-70%"
- "Wide environmental context, character integrated into scene"
- "Expansive background with sky, trees, landscape visible"

### 4. Prompt Yapısı İyileştirmesi

**Önerilen Yapı:**
1. Anatomical directives (mevcut - korunmalı)
2. **NEW: Composition & Depth Directives** (yeni - eklenecek)
3. **NEW: Lighting & Atmosphere Directives** (yeni - eklenecek)
4. **NEW: Camera & Perspective Directives** (yeni - eklenecek)
5. Style description (mevcut - korunmalı)
6. Character prompt (mevcut - korunmalı)
7. Environment description (mevcut - genişletilecek)
8. Layered composition (mevcut - detaylandırılacak)

### 5. Fonksiyon İyileştirmeleri

**Güncellenecek Fonksiyonlar:**
- `getCinematicElements()` → Daha detaylı ışıklandırma ve kamera direktifleri
- `generateLayeredComposition()` → Depth of field ve atmosferik perspektif ekle
- `getCompositionRules()` → Kamera açısı çeşitliliği ve karakter-çevre oranı ekle
- `getLightingDescription()` → Spesifik ışıklandırma teknikleri ekle
- `getEnvironmentDescription()` → Arka plan detaylarını genişlet

**Yeni Fonksiyonlar:**
- `getDepthOfFieldDirectives()` → Depth of field direktifleri
- `getAtmosphericPerspectiveDirectives()` → Atmosferik perspektif direktifleri
- `getCameraAngleDirectives()` → Kamera açısı direktifleri
- `getCharacterEnvironmentRatio()` → Karakter-çevre oranı direktifleri

---

## ✅ Sonuç ve Sonraki Adımlar

### Ana Bulgular

1. **Sorunun Temel Nedeni:** Prompt kalitesi - detay eksikliği
2. **Teknik Kısıt Yok:** Backend altyapısı yeterli, model sabit ama prompt ile aşılabilir
3. **Çözüm:** Prompt iyileştirmesi - kompozisyon, derinlik, ışıklandırma direktifleri

### Sonraki Adımlar

1. **Plan Oluşturma:** Bu analize dayanarak detaylı bir iyileştirme planı oluşturulacak
2. **Prompt Güncellemeleri:** Yeni direktifler eklenecek, mevcut fonksiyonlar genişletilecek
3. **Test ve İterasyon:** İyileştirmeler test edilecek, sonuçlar değerlendirilecek
4. **Dokümantasyon:** Güncellenmiş prompt yapısı dokümante edilecek

### Beklenen İyileştirmeler

- ✅ Daha iyi sahne derinliği (ön/orta/arka plan net ayrımı)
- ✅ Dengeli karakter-çevre oranı (karakterler %30-40, çevre %60-70)
- ✅ Sinematik atmosfer (altın saat, backlighting, god rays)
- ✅ Zengin çevre detayları (gökyüzü, arka plan, atmosferik unsurlar)
- ✅ Daha profesyonel görsel kalitesi

---

## 🌐 Web Araştırması Bulguları (2026 Best Practices)

### 1. Depth of Field ve Kompozisyon Teknikleri

**Kaynak:** gpt-image.com, reelmind.ai, appiqa.com (2026 best practices)

**Önemli Bulgular:**

1. **Kamera Parametreleri Belirtmek:**
   - Lens tipi, odak uzaklığı ve diyafram açıklığı belirtmek kritik
   - Örnek: "50 mm prime lens, f/1.4" veya "wide-angle 24 mm, f/16 deep focus"
   - Düşük f-numaraları (f/1.4, f/2.8) → sığ alan derinliği (shallow DoF)
   - Yüksek f-numaraları (f/11, f/16) → derin alan derinliği (deep focus)

2. **Odak Düzlemlerini Tanımlamak:**
   - "sharp focus on subject's eyes"
   - "foreground blur"
   - "background softly out-of-focus"
   - "middle ground in sharp detail"
   - Spesifik odak noktaları belirtmek (kenar, merkez, belirli element)

3. **Işıklandırma ve Ruh Hali:**
   - "soft golden-hour light from behind"
   - "volumetric rays"
   - "dramatic backlight with rim lighting"
   - "even, diffuse overhead light"
   - Işıklandırma, algılanan keskinlik ve derinliği etkiler

4. **Kompozisyon ve Çerçeveleme Terimleri:**
   - Kamera açıları: "low-angle", "top-down", "wide shot", "close-up"
   - Çerçeveleme: "rule of thirds", "centered subject", "symmetrical", "negative space"
   - Ölçek: Karakter çerçevede büyük mü küçük mü?
   - Ön plan / orta plan / arka plan ilişkileri derinliği tanımlar

5. **Doku, Kusur ve Gerçekçi Detaylar:**
   - "slight blemishes", "gritty textures", "tiny imperfections"
   - "micro-scratches"
   - Mükemmel temiz yüzeyler yapay görünüm yaratır

6. **Prompt Yapısı:**
   - İyi bir yapı: Subject → Action/Composition → Lighting & Environment → Camera/Depth details → Style/Textural/Color details
   - Bu sıralama modelin öncelikleri doğru ayarlamasına yardımcı olur

### 2. Sinematik Işıklandırma Teknikleri

**Kaynak:** hailiuoai.video, reddit.com (2026 best practices)

**Önemli Bulgular:**

1. **Işıklandırma Elementleri:**
   - Zaman: golden hour, sunrise, sunset, late afternoon
   - Işık yönü: backlight, rim lighting, low-angle sun
   - Atmosfer: mist, fog, dust particles, volumetric light, atmospheric haze
   - Gölge özellikleri: soft-edged long shadows, diffused shadows, dramatic contrast
   - Lens stili: shallow depth of field, creamy bokeh, film stock look
   - Renk ruh hali: warm amber tones, golden glow, subtle lens flare, halo effect

2. **"Source → Obstacle → Medium" Yapısı:**
   - Fiziksel olarak mantıklı ışık efektleri için
   - Örnek: "sunlight (source) through slatted fence (obstacle) into morning mist (medium)"

3. **Spesifik Renk Sıcaklıkları:**
   - "amber, honeyed, terracotta glow" gibi spesifik terimler
   - Sadece "warm light" demek yeterli değil

4. **Gölge Davranışı:**
   - "elongated, soft, directional, creating silhouettes or side-lighting"
   - Alçak açılı güneş genellikle uzun yumuşak gölgeler verir

5. **Atmosferik Parçacıklar:**
   - Mist, dust, haze - god rays / volumetric lighting için kritik

6. **Kamera Detayları:**
   - Lens tipi, diyafram, odak uzaklığı, aspect ratio, çözünürlük
   - Gerçekçiliği destekler

### 3. Karakter-Çevre Dengesi Teknikleri

**Kaynak:** kalon.ai, reddit.com, glweb.eu, promptsty.com (2026 best practices)

**Önemli Bulgular:**

1. **Karakter + Çevre Sırası:**
   - Önce karakteri belirt: "a young woman...", "an old wizard..."
   - Sonra ortamı: "in a ruined cathedral at twilight"
   - Bu sıralama karakterin ana odak olduğunu garanti eder

2. **Perspektif ve Yerleşim:**
   - "close-up portrait", "full-body wide shot", "distant silhouette"
   - "foreground, midground, background" derinlik düzenlemesi için
   - Çerçeveleme ipuçları: "rule of thirds", "centered", "asymmetrical", "low-angle view"

3. **Ölçek ve Orantıyı Açıkça Tanımlamak:**
   - Karakter büyük istiyorsan: "towering cathedral dwarfing the lone figure" veya "character occupies ~30% of frame"
   - Çevre ağırlıklı sahneler için: "tiny figure walking through vast desert dunes at dawn"
   - Karşılaştırmalı dil AI'ın göreceli boyutları anlamasına yardımcı olur

4. **Doğru Aspect Ratio Seçimi:**
   - Geniş oranlar (16:9, 21:9): manzara, epik ölçek, panoramik görünümler
   - Kare (1:1): dengeli, merkezi kompozisyon - portreler için iyi
   - Dikey (9:16, 4:5): tam vücut, dikey yapılar, dramatik yükseklik
   - Aspect ratio'yu prompt'ta açıkça belirtmek önemli

5. **Odak için Detay, Işıklandırma ve Kontrast Dengesi:**
   - Işıklandırma ile dikkat çek: "rim light", "backlight", "spotlight on character"
   - Karakter için daha zengin detay belirt: "hyper-detailed armor, muted forest background"
   - Çevre şekilleri karakteri tamamlasın ama rekabet etmesin

### 4. Araştırma ve Teknolojik İçgörüler

**Kaynak:** arxiv.org (2026 research papers)

1. **Bokeh Diffusion:**
   - Modern araştırma, diffusion modellerinde bulanıklığı ("defocus blur parameter") açıkça kontrol edebileceğimizi gösteriyor
   - Prompt'ta doğrudan bulanıklık istemek giderek daha etkili hale geliyor

2. **ComposeAnything:**
   - Derinlik bilgisiyle zenginleştirilmiş layout'lar
   - Model'e nesnelerin 3D uzayda birbirine göre nerede oturması gerektiğini söylemek
   - Gerçekçi uzaysal derinlik ve kompozisyon için yardımcı

---

## 📖 Hikaye Oluşturma Kalitesi Analizi

### Mevcut Durum

**Model Seçenekleri:**
- **GPT-4o** (default, en kaliteli) - ~$0.035 per story
- **GPT-4o-mini** (daha hızlı, daha ucuz) - ~$0.01-0.02 per story
- **GPT-3.5-turbo** (legacy, en ucuz) - ~$0.005 per story

**Mevcut Prompt Yapısı:**
- ✅ Yaş grubuna uygun direktifler
- ✅ Güvenlik kuralları
- ✅ Eğitici temalar
- ✅ Detaylı sayfa yapısı
- ✅ Görsel çeşitlilik gereksinimleri
- ✅ Metin uzunluk gereksinimleri
- ✅ Karakter tutarlılığı
- ✅ Çoklu dil desteği

### Web Araştırması Bulguları (2026 Best Practices)

**Kaynak:** medium.com, techtarget.com, saasprompts.com, hostinger.com, godofprompt.ai

**Önemli Bulgular:**

1. **Spesifik ve Somut Olmak:**
   - ❌ Kötü: "Write a story about friendship"
   - ✅ İyi: "Write a story about two forest animals who disagree and learn to share"
   - Net, somut prompt'lar belirsiz veya genel içeriği azaltır

2. **Pozitif Talimatlar Kullanmak:**
   - ❌ Kötü: "Don't use difficult words"
   - ✅ İyi: "Use simple words"
   - Pozitif çerçeveleme LLM'ler tarafından daha kolay anlaşılır

3. **Örnek veya Modeller Dahil Etmek:**
   - "Here's how I like it: [short sample]. Now write something similar."
   - Bu stil rehberliği sağlar

4. **Belirsizliği Sınırlamak:**
   - ❌ Kötü: "something fun", "nice adventure"
   - ✅ İyi: "a scary thunderstorm", "a race against time", "saving the rainbow"
   - Bağlam olmadan belirsiz terimlerden kaçınmak

5. **Delimiter ve Yapı Kullanmak:**
   - Talimatlar ve örnek metin arasında net ayrım
   - Tag'ler, tırnak işaretleri veya satır sonları kullanmak

6. **İterasyon: Test + İyileştirme:**
   - Daha basit bir prompt ile başla
   - Eksik veya fazla olanları gözden geçir
   - Eklenen detaylar, daraltılmış odak veya stil ayarlamaları ile düzelt

7. **Derinlik ve Pacing Kontrolü:**
   - Çocuklar için pacing önemli
   - Güçlü bir hook erken, kısa sahneler, öngörülebilir kalıplar
   - Sayfa sayfa breakdown iste

8. **Ton, Kelime Dağarcığı ve Duygu Yönetimi:**
   - "warm", "encouraging", "not scary", "silly", "calm bedtime voice" gibi rehberlik
   - Daha genç yaşlar için: "no words longer than 5 letters" veya "use repetition"

9. **Görsel ve Duyusal Detayları Teşvik Etmek:**
   - "describe what the forest looks like", "what sounds", "what smells", "colors", "textures"
   - İllüstrasyon ve hayal gücünü destekler

10. **Birden Fazla Versiyon İstemek:**
    - Farklı açılarla iki veya üç versiyon iste
    - Bir komik, bir duygusal, bir macera
    - Varyantları karşılaştırmak daha güçlü bir versiyon seçmeye veya güçlü yönleri birleştirmeye yardımcı olur

### Model vs Prompt: Hangi Daha Önemli?

**Cevap: İkisi de önemli, ama prompt daha kritik**

**Model'in Rolü:**
- GPT-4o: En yüksek kalite, daha iyi anlama, daha yaratıcı çıktılar
- GPT-4o-mini: İyi kalite, daha hızlı, daha ucuz
- GPT-3.5-turbo: Temel kalite, en hızlı, en ucuz

**Prompt'un Rolü:**
- Model ne kadar iyi olursa olsun, kötü bir prompt kötü sonuç verir
- İyi bir prompt, daha düşük bir model ile bile iyi sonuçlar verebilir
- Prompt, modelin ne üreteceğini kontrol eder

**Öneri:**
1. **Önce prompt'u optimize et** - Mevcut prompt iyi ama web araştırması bulgularına göre iyileştirilebilir
2. **Sonra model seçimi** - GPT-4o zaten default, bu doğru seçim
3. **Test ve iterasyon** - Farklı prompt varyasyonlarını test et, en iyisini seç

### Mevcut Prompt'ta İyileştirilebilecek Alanlar

1. **Örnek Metin Ekleme:**
   - Mevcut prompt'ta örnek metin yok
   - Web araştırması: Örnek metin eklemek stil rehberliği sağlar

2. **Daha Spesifik Talimatlar:**
   - Mevcut prompt zaten detaylı ama bazı alanlar daha spesifik olabilir
   - Özellikle "show, don't tell" örnekleri genişletilebilir

3. **Pacing Kontrolü:**
   - Mevcut prompt'ta pacing direktifleri var ama daha detaylandırılabilir
   - "Güçlü bir hook erken" gibi spesifik talimatlar eklenebilir

4. **Duyusal Detaylar:**
   - Mevcut prompt'ta görsel detaylar var ama duyusal detaylar (ses, koku, dokunma) daha vurgulanabilir

5. **Birden Fazla Versiyon:**
   - Mevcut sistem tek versiyon üretiyor
   - İsteğe bağlı olarak birden fazla versiyon üretme seçeneği eklenebilir

### Sonuç ve Öneriler

**Hikaye Kalitesi İçin:**
1. ✅ **Model:** GPT-4o zaten kullanılıyor (doğru seçim)
2. 🔄 **Prompt:** Mevcut prompt iyi ama web araştırması bulgularına göre iyileştirilebilir:
   - Örnek metin ekleme
   - Daha spesifik "show, don't tell" örnekleri
   - Duyusal detayları daha fazla vurgulama
   - Pacing kontrolünü detaylandırma
3. 🧪 **Test:** Farklı prompt varyasyonlarını test et, en iyisini seç

**Öncelik:**
- **Kısa vadede:** Prompt iyileştirmeleri (düşük maliyet, yüksek etki)
- **Uzun vadede:** Model seçeneklerini test et (GPT-4o zaten en iyi, ama maliyet optimizasyonu için GPT-4o-mini de test edilebilir)

---

## 📚 Referanslar

- Örnek görseller analizi (kullanıcı tarafından paylaşılan)
- Mevcut prompt dosyaları (`lib/prompts/image/v1.0.0/`)
- GPT araştırma notları (`gpt-arastirma.txt`)
- Anatomical Prompt Improvements Guide (`docs/guides/ANATOMICAL_PROMPT_IMPROVEMENTS_GUIDE.md`)
- **Web Araştırması Kaynakları (2026):**
  - gpt-image.com - Depth of field ve kompozisyon best practices
  - reelmind.ai - Photorealistic image generation techniques
  - appiqa.com - AI image generation tutorial
  - hailiuoai.video - Cinematic lighting techniques
  - kalon.ai - Character-environment balance guide
  - medium.com - Prompt engineering best practices
  - techtarget.com - Prompt engineering tips
  - arxiv.org - Bokeh Diffusion ve ComposeAnything research papers

---

**Not:** Bu analiz, plan aşamasına geçmeden önce mevcut durumu anlamak için hazırlanmıştır. Plan aşamasında bu bulgulara dayanarak detaylı bir iyileştirme stratejisi oluşturulacaktır.

---

## ✅ Plan Tamamlandı (25 Ocak 2026)

Bu analize dayanarak detaylı bir iyileştirme planı oluşturuldu ve uygulandı:

**Görsel Prompt İyileştirmeleri:**
- ✅ 4 yeni fonksiyon eklendi (depth of field, atmospheric perspective, camera angles, character-environment ratio)
- ✅ 5 mevcut fonksiyon güncellendi (cinematic elements, layered composition, composition rules, lighting, environment)
- ✅ `generateFullPagePrompt()` yeniden düzenlendi ve yeni direktifler entegre edildi
- ✅ Versiyon: v1.1.0 → v1.2.0

**Hikaye Prompt İyileştirmeleri:**
- ✅ Örnek metin eklendi (yaş grubuna göre)
- ✅ "Show, don't tell" örnekleri genişletildi
- ✅ Duyusal detaylar vurgulandı (görsel, işitsel, dokunsal, koku)
- ✅ Pacing kontrolü detaylandırıldı
- ✅ Versiyon: v1.0.3 → v1.1.0

**Dokümantasyon:**
- ✅ docs/prompts template dokümanları güncellendi

**Detaylı plan:** `docs/guides/IMAGE_COMPOSITION_AND_DEPTH_ANALYSIS.md` analizine dayanarak oluşturuldu ve uygulandı.
