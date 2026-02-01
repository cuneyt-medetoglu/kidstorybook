# Image Generation Prompt Template

**Kod referansları:** `lib/prompts/image/scene.ts`, `character.ts`, `negative.ts`, `style-descriptions.ts` (tek kaynak; doküman bu kodla eşleşir)

---

## Hızlı Akış Özeti

1. **Master Generation** → İnsan karakterler + hayvan/obje için master görseller üret
   - İnsan: Referans foto + prompt → master
   - Hayvan/Obje: Sadece prompt (story'den description) → master
2. **Cover Generation** → Tüm master'lar referans + scene prompt → kapak görseli
3. **Page Generation** → O sayfadaki entity master'ları referans + scene prompt → sayfa görseli
4. **Tutarlılık:** Her varlık için bir kez master, sonra hep o master referans

---

## Overview

Bu template, **gpt-image-1.5** (default) / **1024x1536** (portrait) / **quality: low** ayarları için optimize edilmiş görsel üretim prompt'larını içerir. Karakter tutarlılığına özel vurgu yapar.

**Production Defaults:**
- Model: `gpt-image-1.5`
- Size: `1024x1536` (portrait)
- Quality: `low`
- Rate Limit: 5 images per 90 seconds (Tier 1: 5 IPM)

**Kritik Hedef:** Yüklenen çocuk fotoğrafındaki çocuğa mümkün olduğunca benzeyen karakterler üretmek.

**Cover-as-Reference:** Cover oluşturulduktan sonra tüm sayfalarda hem orijinal fotoğraflar hem de cover referans olarak kullanılır. Cover'da TÜM karakterler görünmeli.

---

## Core Principles

1. **Karakter Tutarlılığı:** Her sayfada aynı çocuk görünmeli
2. **Detaylı Talimatlar:** Prompt ne kadar detaylı olursa sonuç o kadar iyi
3. **Stil Tutarlılığı:** Tüm görseller aynı illustration style'da
4. **Yaş Uygunluğu:** Age-appropriate scenes ve content
5. **Kalite:** Print-ready, professional children's book illustrations
6. **Cover-as-Reference:** Cover tüm sayfalarda referans olarak kullanılır

---

## Cover-as-Reference Yaklaşımı

- **Sorun:** Her sayfa için referans gönderiliyor ama model her seferinde yeniden yorumluyor; tutarlılık %60–70.
- **Çözüm:** Cover oluşturulduktan sonra Pages 2–10’da hem fotoğraflar hem cover referans olarak kullanılıyor.
- **Cover kalitesi kritik:** Tüm sayfalarda referans; cover’daki hata tüm kitaba yansır. TÜM karakterler cover’da görünmeli.
- **Cover vs Page 1 (first interior):** Kapak ile ilk iç sayfa açıkça farklı olmalı (kamera, kompozisyon).
- **Cover:** Epic wide, poster-like; karakter max 30–35% frame; environment-dominant.

---

## Template Structure

Base template, karakter tutarlılığı (hair length/style, eye color, skin tone, facial features), çoklu karakter referans eşlemesi, cover talimatları (flat illustration, NO TEXT in image), interior sayfa talimatları ve JSON çıktı formatı için `lib/prompts/image/` altındaki kodlara bakın.

---

## Illustration Style Descriptions

**Toplam Stil Sayısı:** 9 stil

- 3D Animation (Pixar Style), Geometric, Watercolor, Comic Book, Block World, Clay Animation, Kawaii, Collage, Sticker Art

Detaylı açıklamalar ve negative/positive direktifler `lib/prompts/image/style-descriptions.ts` ve ilgili dosyalarda.

---

## Implementation Notes

- **Story Text:** Kullanıcı diline göre (Türkçe/İngilizce)
- **Image Prompts:** HER ZAMAN İngilizce

**Template Variables:** CHARACTER_NAME, AGE, CHARACTER_FEATURES_ENGLISH, THEME, SUBTHEME, ILLUSTRATION_STYLE_DESCRIPTION, AGE_GROUP, LANGUAGE, TITLE, MORAL, PAGES_WITH_TEXT_AND_IMAGE_DESCRIPTIONS

---

## Best Practices

1. Image prompts için her zaman İngilizce kullan
2. Karakter özelliklerini detaylı belirt (saç rengi, uzunluk, stil, göz rengi)
3. Hair length’a özel dikkat (yaygın hata)
4. 3D Animation için photorealistic olmamalı vurgusu
5. Kitap kapağı: flat illustration, book mockup değil
6. Karakter tutarlılığını her sayfada vurgula
7. Cinematic elements (lighting, depth, composition)
8. Foreground/Midground/Background layer sistemi
9. Kıyafet tutarlılığı (hikayede değişim yoksa aynı kıyafet)
10. Anatomik doğruluk (5 parmak, doğru limb sayısı)

---

## Cinematic Quality / Clothing Consistency / Anatomical Correctness

- **Depth & Layers:** Foreground, midground, background; character ratio 25–35%; environment sharp.
- **Clothing Consistency:** Hikayede kıyafet değişikliği yoksa aynı kıyafet.
- **Anatomical:** Negative prompts (el/parmak/kol/bacak hataları); positive: 5 parmak, 2 el, 2 kol, 2 bacak, doğru oranlar.

Detaylar `lib/prompts/image/scene.ts`, `negative.ts` içinde.

---

## İlgili dokümanlar

- `STORY_PROMPT_TEMPLATE.md` – Hikaye üretimi prompt şablonu
