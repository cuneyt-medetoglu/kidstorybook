# Scripts

Bu klasör, proje için yardımcı script'leri içerir.

## generate-roadmap-csv.js

ROADMAP.md dosyasından CSV oluşturma script'i. Google Sheets'e import edilebilir veya HTML viewer'da görüntülenebilir.

### Kullanım

```bash
npm run roadmap
```

veya doğrudan:

```bash
node scripts/generate-roadmap-csv.js
```

### Ne Yapar?

- `docs/ROADMAP.md` dosyasını okur
- Tüm işleri parse eder (ID, Faz, Durum, Öncelik, vb.)
- `docs/roadmap.csv` dosyasını oluşturur/günceller
- HTML viewer (`docs/roadmap-viewer.html`) ile görüntülenebilir
- Google Sheets'e import edilebilir

### Çıktı

- `docs/roadmap.csv` - CSV dosyası (10 kolon: ID, Faz, Alt Faz, Başlık, Durum, Öncelik, Kategori, Notlar, Tarih, Link)

### Notlar

- CSV her çalıştırmada yeniden oluşturulur (mevcut dosya üzerine yazılır)
- ID kolonunun başında tab karakteri var (Excel/Google Sheets'te tarih olarak algılanmaması için)
- Detaylı kullanım için `docs/ROADMAP_CSV_README.md` dosyasına bakın

## generate-style-examples.ts

9 farklı illustration style için örnek görseller üretir. Aynı sahne, farklı stiller.

### Kullanım

1. **tsx paketini yükle** (eğer yoksa):
```bash
npm install --save-dev tsx
```

2. **Script'i çalıştır**:
```bash
npm run generate-style-examples
```

veya doğrudan:
```bash
npx tsx scripts/generate-style-examples.ts
```

### Ne Yapar?

- 9 illustration style için aynı sahne prompt'unu kullanır
- GPT-image-1.5 API'ye istek atar
- Görselleri `public/illustration-styles/` klasörüne kaydeder
- Rate limiting'e dikkat eder (90 saniyede max 4 görsel)

### Çıktı

Görseller şu formatta kaydedilir:
- `public/illustration-styles/3d_animation.jpg`
- `public/illustration-styles/geometric.jpg`
- `public/illustration-styles/watercolor.jpg`
- `public/illustration-styles/block_world.jpg`
- `public/illustration-styles/collage.jpg`
- `public/illustration-styles/clay_animation.jpg`
- `public/illustration-styles/kawaii.jpg`
- `public/illustration-styles/comic_book.jpg`
- `public/illustration-styles/sticker_art.jpg`

### Referans Görsel Kullanımı (Opsiyonel)

**Referans görsel OPSIYONEL - yoksa random oluşturur, varsa ona göre oluşturur!**

**İki Mod:**

1. **Referans Görsel VARSA (Önerilen):**
   - Daha tutarlı sonuçlar için referans görsel kullan
   - Örneğin kawaii stilindeki görseli referans olarak kullanabilirsin
   - Görseli `scripts/reference.jpg` veya `scripts/reference.png` olarak kaydet
   - Alternatif: `public/illustration-styles/reference.jpg`
   - Script `/v1/images/edits` API'sini kullanır (referans görsel + prompt)
   - **Sonuç:** Aynı sahne kompozisyonu, sadece stil değişir

2. **Referans Görsel YOKSA:**
   - Script `/v1/images/generations` API'sini kullanır (sadece text prompt)
   - Her stil için aynı prompt ile random varyasyonlar üretir
   - **Sonuç:** Her stil farklı kompozisyonlar üretebilir (ama aynı prompt)

**Referans Görsel Formatı (varsa):**
- JPG veya PNG
- Önerilen: 1024x1536 veya benzer aspect ratio
- İçerik: Aynı sahne (kız + köpek, çiçekli yol, ağaçlar)

### Notlar

- Script çalışmadan önce `.env` dosyasında `OPENAI_API_KEY` olmalı
- Toplam süre: ~3-4 dakika (rate limiting nedeniyle)
- Görseller step4 sayfasında otomatik olarak gösterilir
- **Referans görsel OPSIYONEL** - yoksa random oluşturur, varsa ona göre oluşturur
- Referans görsel kullanımı daha tutarlı sonuçlar verir (önerilir ama zorunlu değil)

## generate-hero-transformation.ts

Ana sayfadaki **"Your Child, The Hero"** hero bölümü için: Bir gerçek çocuk fotoğrafını alıp, **--prompt** (sahne/tema) ve **--style** (illustration style) ile **story character** versiyonunu üretir. `generate-style-examples` ile aynı mantık: OpenAI `/v1/images/edits` + `getStyleDescription` / `getStyleSpecificDirectives`. Çıktı: `scripts/hero-transformation-output/`.

### Kullanım

```bash
npx tsx scripts/generate-hero-transformation.ts --input=photo.jpg --prompt="In a magical forest with a compass" --style=3d_animation
```

```bash
npm run generate-hero-transformation -- --input=scripts/arya_1024x1024.png --prompt="Space adventure, astronaut" --style=watercolor --output-name=arya-space
```

### Argümanlar

| Argüman | Zorunlu | Açıklama |
|---------|---------|----------|
| `--input` | Evet | Girdi görsel yolu (örn. 1024x1024 çocuk fotoğrafı) |
| `--prompt` | Evet | Sahne/tema: nerede, ne yapıyor. Örn: `"In a magical forest, holding a compass and map."` |
| `--style` | Evet | Illustration style. Geçerli: `3d_animation`, `geometric`, `watercolor`, `block_world`, `collage`, `clay_animation`, `kawaii`, `comic_book`, `sticker_art` |
| `--output-name` | Hayır | Çıktı dosya adı (uzantısız). Varsayılan: `hero-story-YYYYMMDDHHmmss` |
| `--output-dir` | Hayır | Çıktı klasörü. Varsayılan: `scripts/hero-transformation-output/` |
| `--size` | Hayır | Çıktı boyutu. Varsayılan: `1024x1024` |
| `--quality` | Hayır | `low`, `medium`, `high`, `auto`. Varsayılan: `low` |

### Örnek --prompt (sahne) – 10 adet

1. `"In a magical forest, holding a compass and map."`
2. `"Space adventure, astronaut suit, stars and planets."`
3. `"Under the ocean with colorful fish and a submarine."`
4. `"In a fairy-tale castle, wearing a crown and holding a magic wand."`
5. `"On a pirate ship, looking through a telescope at the sea."`
6. `"In a snowy mountain village, holding a snow globe."`
7. `"In a dinosaur jungle, next to a friendly dinosaur."`
8. `"On a flying carpet over a desert city at sunset."`
9. `"In a candy land with giant lollipops and a gingerbread house."`
10. `"In a robot workshop, building a friendly little robot."`

### Çıktı

- `scripts/hero-transformation-output/{output-name}.jpg` (veya belirttiğin `--output-dir`)
- Bu dosyayı `public/hero-transformation/stories/` altına taşıyıp `heroTransformationConfig`’e ekle. Bkz. `docs/guides/HERO_YOUR_CHILD_THE_HERO_IMAGES_ANALYSIS.md`
