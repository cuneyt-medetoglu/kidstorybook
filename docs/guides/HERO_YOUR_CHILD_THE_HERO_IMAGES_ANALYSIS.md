# "Your Child, The Hero" – Real Photo & Story Character Görselleri Analizi

**Tarih:** 27 Ocak 2026  
**İlgili ROADMAP:** 2.2.1.1  
**Component:** `components/sections/HeroBookTransformation.tsx`

---

## 📋 Yapılacaklar Özeti

| # | İş | Açıklama |
|---|-----|----------|
| 1 | **Config yapısı** | `realPhoto → [story1, story2, …]` şeklinde konfigüratif veri; 1 real photo’ya X adet story character. |
| 2 | **Görsel klasörü** | `public/hero-transformation/` altında `real/` ve `stories/` (veya config’e göre isimlendirme). |
| 3 | **Config dosyası** | `lib/config/hero-transformation.ts` (veya `content/`) — sadece buradan ekle/çıkar; kod değişikliği minimale inse. |
| 4 | **Component refactor** | `HeroBookTransformation` mevcut `themes[]` yerine yeni config’i okuyacak; Real Photo sabit, Story Character config’teki sırayla değişecek. |
| 5 | **Altyazı/caption** | Real photo için config’ten `name`, `age` (opsiyonel); story için `themeName` veya `label`. |
| 6 | **Pagination** | Noktalar: toplam “çift” sayısına göre (1 real + X story = X adet gösterim). |
| 7 | **Görsel rehberi** | Aşağıdaki “Görsel Format ve Verme Rehberi” bölümü — format, boyut, isimlendirme, nereye koyulacağı. |

---

## 1. Mevcut Durum (Kısa)

- **Bölüm:** Ana sayfa `HeroBookTransformation` — “Your Child, The Hero” / Real Photo | Story Character.
- **Veri:** `themes[]` — her theme: `childPhoto`, `characterArt`; tümü `childPhoto: "/placeholder-child.jpg"`; `characterArt`: `example-book-{space|ocean|forest|castle}.jpg`.
- **Caption:** Real photo altında “Emma, Age 7” sabit; story’de `theme.name`.
- **Pagination:** 4 theme = 4 nokta; theme değişince hem “real” hem “story” değişiyor (real aslında hep aynı dummy).

---

## 2. Hedef Yapı (Konfigüratif)

- **Birim:** “Gösterim” = 1 real photo + 1 story character.  
- **Kural:** 1 real photo’ya N adet story eşlenir:  
  `[ Real1, Story1 ], [ Real1, Story2 ], [ Real1, Story3 ], [ Real2, Story1 ], …`
- **Config örneği (TS):**

```ts
// lib/config/hero-transformation.ts
export type HeroTransformationItem = {
  realPhoto: { src: string; name?: string; age?: string }
  storyCharacter: { src: string; themeName: string }
}

export const heroTransformationConfig: HeroTransformationItem[] = [
  { realPhoto: { src: "/hero-transformation/real/child1.jpg", name: "Emma", age: "7" },
    storyCharacter: { src: "/hero-transformation/stories/child1-forest.jpg", themeName: "Forest Journey" } },
  { realPhoto: { src: "/hero-transformation/real/child1.jpg", name: "Emma", age: "7" },
    storyCharacter: { src: "/hero-transformation/stories/child1-space.jpg", themeName: "Space Adventure" } },
  { realPhoto: { src: "/hero-transformation/real/child2.jpg", name: "Ali", age: "5" },
    storyCharacter: { src: "/hero-transformation/stories/child2-ocean.jpg", themeName: "Ocean Explorer" } },
  // …
]
```

- **Pagination:** `heroTransformationConfig.length` = nokta sayısı.

---

## 3. Component Değişiklikleri (Özet)

- `themes` kaldırılır; `heroTransformationConfig` import edilir.
- `currentThemeIndex` → `currentIndex`; `config[currentIndex]` ile `realPhoto` ve `storyCharacter` alınır.
- Real Photo: `realPhoto.src`, alt yazı: `realPhoto.name` + `realPhoto.age` (opsiyonel).
- Story Character: `storyCharacter.src`, alt yazı: `storyCharacter.themeName`.
- Gradient/icon: `themeName`’e göre mevcut `themes` eşlemesi yapılabilir veya config’e `gradient`/`icon` eklenir.
- Noktalar: `config.map((_, i) => …)`; tıklanınca `setCurrentIndex(i)`.

---

## 4. Klasör Yapısı Önerisi

```
public/
  hero-transformation/
    real/
      child1.jpg
      child2.jpg
    stories/
      child1-forest.jpg
      child1-space.jpg
      child2-ocean.jpg
```

- İsimlendirme zorunlu değil; config’te `src` ile path verilir. Tutarlılık için `{slug}-{tema}.jpg` gibi kullanılabilir.

---

## 5. Görsel Format ve Verme Rehberi (Senin İçin)

Bu bölüm, görselleri **senin üretip/yükleyip nereye ve hangi formatta vereceğini** netleştirir.

### 5.1 Real Photo (Gerçek Çocuk Fotoğrafı)

| Özellik | Değer |
|--------|--------|
| **Format** | JPG veya PNG (JPG tercih, dosya boyutu için). |
| **Oran** | 1:1 (kare) ideal; component `aspect-square` + `object-cover` kullanıyor. Dikey/yatay da çalışır, kırpılır. |
| **Çözünürlük** | En az **600×600 px**; 800×800–1000×1000 iyi. Retina için 1200×1200 yeterli. |
| **İçerik** | Yüz net, iyi aydınlatma; mümkünse yalnız veya önde çocuk. |
| **Dosya boyutu** | 200 KB – 1 MB arası hedeflenebilir. |
| **Nereye** | `public/hero-transformation/real/` — örn. `child1.jpg`, `ayse.jpg`. |
| **Config’e ekleme** | `realPhoto: { src: "/hero-transformation/real/child1.jpg", name: "Emma", age: "7" }`. |

---

### 5.2 Story Character (Hikaye Karakteri Görseli)

| Özellik | Değer |
|--------|--------|
| **Format** | JPG veya PNG. |
| **Oran** | 1:1 (kare) ideal; `object-cover` ile kırpılır. |
| **Çözünürlük** | En az **600×600 px**; 800×800–1024×1024 uygun. |
| **Stil** | Kitap illüstrasyonu (ör. 3D animasyon, watercolor, vb.); çocuk karakter önde, tema (orman, uzay, okyanus, vb.) ile uyumlu. |
| **Dosya boyutu** | 150 KB – 800 KB. |
| **Nereye** | `public/hero-transformation/stories/` — örn. `child1-forest.jpg`, `child2-space.jpg`. |
| **Config’e ekleme** | `storyCharacter: { src: "/hero-transformation/stories/child1-forest.jpg", themeName: "Forest Journey" }`. |

#### 5.2.1 Story Character için AI ile Üretim (Script)

Gerçek fotoğraftan story character üretmek için **`scripts/generate-hero-transformation.ts`** kullanılabilir. Girdi: 1 fotoğraf + dönüşüm prompt’u. Çıktı: 1024×1024 story character görseli (`scripts/hero-transformation-output/`); dosyayı `public/hero-transformation/stories/` altına taşıyıp config’e ekle.

**Örnek:**
```bash
npx tsx scripts/generate-hero-transformation.ts --input=child.jpg --prompt="In a magical forest, holding a compass and map" --style=3d_animation --output-name=child1-forest
```

**10 örnek --prompt (sahne):**
1. In a magical forest, holding a compass and map.
2. Space adventure, astronaut suit, stars and planets.
3. Under the ocean with colorful fish and a submarine.
4. In a fairy-tale castle, wearing a crown and holding a magic wand.
5. On a pirate ship, looking through a telescope at the sea.
6. In a snowy mountain village, holding a snow globe.
7. In a dinosaur jungle, next to a friendly dinosaur.
8. On a flying carpet over a desert city at sunset.
9. In a candy land with giant lollipops and a gingerbread house.
10. In a robot workshop, building a friendly little robot.

`--style`: `3d_animation`, `geometric`, `watercolor`, `block_world`, `collage`, `clay_animation`, `kawaii`, `comic_book`, `sticker_art` (generate-style-examples ile aynı).

Bkz. `scripts/README.md` (generate-hero-transformation) ve `scripts/generate-hero-transformation.ts` başlık yorumları.

---

### 5.3 Yeni Görsel Eklerken Yapılacaklar (Özet)

1. Görseli uygun formatta hazırla (1:1, yeterli çözünürlük).
2. `public/hero-transformation/real/` veya `stories/` içine koy.
3. `lib/config/hero-transformation.ts` (veya seçilen config dosyası) içinde `heroTransformationConfig` dizisine bir eleman ekle:
   - `realPhoto`: `src` (+ istenirse `name`, `age`)
   - `storyCharacter`: `src`, `themeName`
4. Aynı real photo’ya birden fazla story eklemek için aynı `realPhoto` objesini, farklı `storyCharacter` ile birden fazla kez kullan (yukarıdaki örnekteki gibi).

---

## 6. Opsiyonel: Gradient / İkon

- Şu an gradient ve ikon `themes[]` içindeki `id` (space, ocean, forest, castle) ile seçiliyor.
- Seçenekler:
  - **A)** Config’e `themeId?: "space"|"ocean"|"forest"|"castle"` ekle; mevcut `themes` lookup’u sadece bu id için kullan.
  - **B)** Config’e `gradient: string`, `icon: "Rocket"|"Fish"|"TreePine"|"Castle"` ekle; `themes` tamamen kaldırılır.

---

## 7. Uygulama Sırası Önerisi

1. `public/hero-transformation/real/` ve `stories/` klasörlerini oluştur.
2. `lib/config/hero-transformation.ts` (veya eşdeğer) config’i yaz; en az 2–3 dummy/gerçek çift ile dene.
3. `HeroBookTransformation` içinde `themes`’i config’e geçir; real/story + caption + pagination’ı bağla.
4. Gradient/ikonu config veya `themeId` ile eşle.
5. Görselleri sen hazırladıkça `hero-transformation/` altına ekle ve config’i güncelle.

---

## 8. Dokümantasyon ve Basit Güncelleme

- Bu analiz, görsel formatını ve config’i tanımlar.
- Yeni görsel eklemek = **sadece dosyayı doğru klasöre koy + config’e 1 satır ekle**.
- Kod tarafında yalnızca config import’u ve `HeroBookTransformation` refactor’u; sonrası tamamen config + dosya yönetimi.

---

**İlgili dosyalar**

- `components/sections/HeroBookTransformation.tsx`
- `docs/ROADMAP.md` (2.2.1.1)
