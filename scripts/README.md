# Scripts

Bu klasör, proje için yardımcı script'leri içerir.

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
