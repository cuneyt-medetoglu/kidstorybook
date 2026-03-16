# HeroKidStory — Logo Brief & AI Prompt Set

Bu dosya, HeroKidStory için logo üretirken kullanılabilecek proje özeti, tasarım dili ve farklı varyasyonları hedefleyen **İngilizce 8 adet prompt** içerir. Prompt’lar **Gemini** veya benzeri görsel üretici modellerde kullanılmak üzere hazırlanmıştır.

---

## 1. Proje Özeti

| Alan | Açıklama |
|------|----------|
| **Ürün adı** | HeroKidStory |
| **Kısa tanım** | AI destekli, kişiselleştirilmiş çocuk hikaye kitapları oluşturma platformu. |
| **Hedef kitle** | 2–10 yaş çocuğu olan ebeveynler (TR, EN ve diğer pazarlar). |
| **Temel değerler** | Kişiselleştirme, hikaye/kitap, çocuk kahraman, sihir/AI, aile ve güven. |
| **Rakip farkı** | Çocuğun fotoğrafından karakter; dakikalar içinde özel kitap; dijital + basılı. |

Logo’nun ileteceği duygular: **sıcak, güvenilir, yaratıcı, çocuk dostu, modern (teknoloji) ama kitap/hikaye odaklı.**

---

## 2. Tasarım Dili (Mevcut)

- **Renk paleti (aktif):** Teal → Cyan — çocuk dostu, macera/deniz hissi.
  - Primary: **Teal** `#14b8a6` (hsl 174 72% 40%)
  - İkincil marka: **Cyan** `#06b6d4` (hsl 189 94% 43%)
  - Accent: Açık teal `#f0fdfa` (teal-50)
- **Dark mode:** Aynı palet, daha açık tonlar (teal-400, cyan-400).
- **UI:** Tailwind CSS, shadcn/ui, yuvarlatılmış köşeler (`--radius: 0.5rem`), Framer Motion ile hafif animasyonlar.
- **İllüstrasyon stilleri (ürün içi):** 3D Animation (Pixar), Comic Book, Geometric, Kawaii, Watercolor, Clay, Collage, Block World, Sticker Art — logo bu ekosistemle uyumlu ama daha sade kalabilir.
- **Mevcut marka kullanımı:** Header/Footer’da sadece metin “HeroKidStory”; ikon/amblem yok.

Logo için öneri: **Teal ve/veya cyan** ağırlıklı; beyaz/açık zemin ve koyu zemin (dark) için tek renk versiyonu düşünülebilir.

---

## 3. Logo Kullanım Gereksinimleri

- **Bağlamlar:** Header, favicon, splash, sosyal medya, basılı materyal (kapak/ambalaj).
- **Boyutlar:** Küçük (favicon ~32px) ile büyük (hero, billboard) arasında okunaklı ve tanınabilir olmalı.
- **Çıktı:** Vektör (SVG) tercih; AI’dan alınan görsel sonradan vektöre çevrilebilir veya “flat, simple shapes” ile tarif edilerek vektör benzeri sonuçlar istenebilir.
- **Dil:** Marka adı “HeroKidStory” (İngilizce); logo metinli versiyonlarda bu isim kullanılacak.

---

## 4. İngilizce Logo Prompt’ları (8 Varyasyon)

Aşağıdaki prompt’lar doğrudan kopyalanıp **Gemini** (veya Midjourney, DALL·E, Ideogram vb.) ile kullanılabilir. İstediğiniz çıktıya göre “logo only” / “logo + wordmark” / “icon only” seçeneklerini netleştirebilirsiniz.

---

### Prompt 1 — Kitap + Çocuk Silüeti (Sıcak, Hikaye + AI Vurgulu)

**Not:** Çocuk figürü 3–5 yaş, normal bebek silüeti; ne erkek ne kız. Wordmark "Hero · Kid · Story" zarif; AI vurgusu hafif.

```
Create a minimal, friendly logo for an AI-powered children's storytelling app called "HeroKidStory". Main elements: (1) A small child figure (age 3–5, toddler) as the hero, integrated with an open book or book pages. CRITICAL — use only a normal baby/toddler silhouette: round head, chubby cheeks, minimal or no hair (one simple neutral shape at most; no pigtails, bows, spiky or styled hair). Simple rounded body, no gender-specific clothing. Do NOT make it look like a boy. Do NOT make it look like a girl. The figure must be a generic, universal 3–5 year old — no male or female cues. Think "neutral baby shape", not boy or girl. (2) A subtle AI/magic cue: small sparkles, a few tiny stars, or a soft glow around the book or child — enough to suggest "AI-powered" and personalization, but still child-friendly and minimal (no robots, no circuits). (3) Wordmark: display the name as three clearly separate words with an elegant, intentional design. Use one of these approaches: (a) "Hero" · "Kid" · "Story" with equal, generous spacing and a small dot or star between words in teal/cyan; or (b) same spacing, with "Hero" and "Story" in teal (#14b8a6) and "Kid" in cyan (#06b6d4), same font and weight throughout. The wordmark must look polished and cohesive — one strong brand line, not three words clumsily stuck together. Use a clean, modern sans-serif; avoid cramped or uneven gaps. Colors: teal and cyan only on white. Style: flat, rounded shapes, no fine details, works at favicon and large size. Square or horizontal format, transparent or white background, vector-style illustration.
```

---

### Prompt 2 — Abstrakt Kitap + Yıldız/Sihir (Marka İkonu)

```
Design a simple, memorable app icon logo for "HeroKidStory" — an AI-powered platform where parents create personalized storybooks for kids. Combine a book shape with a subtle sparkle or star to suggest magic and personalization. Palette: teal and cyan only, flat design, rounded corners, no gradients. Icon should work as a single mark without text. Style: modern, child-friendly, geometric but soft. Square canvas, transparent background, suitable for favicon and app store.
```

---

### Prompt 3 — Wordmark Odaklı (Tipografi + Küçük İkon)

```
Create a logo for "HeroKidStory" with emphasis on the wordmark. The name must be shown as three distinct words with elegant separation: "Hero" · "Kid" · "Story" — use equal spacing and a small dot or star between words, or color the middle word "Kid" in cyan (#06b6d4) and "Hero" / "Story" in teal (#14b8a6), same font and weight. One cohesive, polished line — not three words badly stuck together. Friendly, rounded sans-serif, bold but not heavy. Optional: tiny book icon or small sparkle to suggest AI/stories. Clean, minimal, professional and child-safe. White background, horizontal layout, vector-style.
```

---

### Prompt 4 — Karakter + Kitap (Kahraman Çocuk Vurgusu)

```
Logo design for "HeroKidStory": a stylized child character (age 3–5, normal baby/toddler silhouette) as a hero (e.g. cape or simple crown) holding or standing on an open book. CRITICAL — gender-neutral only: do NOT look like a boy or a girl. Round head, minimal or no hair, no pigtails/bows/spiky hair, simple rounded body. Flat, 2D, friendly cartoon style — not realistic. Colors: teal (#14b8a6) and cyan (#06b6d4), white or light background. The mark should read clearly at 32px and 256px. No wordmark in this version — icon only. Style: kawaii or modern cartoon, suitable for kids and parents, vector-like simplicity.
```

---

### Prompt 5 — Sadece Sembol (Amblem / Favicon)

```
Minimal emblem for "HeroKidStory" — a single symbol that suggests both "hero" and "story/book". Ideas: book with a small star or crown, or letter "H" merged with a book spine. Strict two-color: teal (#14b8a6) and white (or teal and cyan). No text. Geometric, flat, works in one color (teal on white) for favicon. Square format, transparent background, vector-style, no shadows or gradients.
```

---

### Prompt 6 — AI + Hikaye Vurgulu (Logo Üstte, Altında HeroKidStory)

**Not:** Hikaye = kitap dışında da düşün (konuşma balonu, yıldız, parıltı, yol, sihir). Üstte logo, altta "HeroKidStory".

```
Create a logo for an AI-powered children's storytelling app. Layout: one logo mark on top, and directly below it the wordmark "HeroKidStory" in a clean sans-serif. The logo mark must emphasize two things: (1) Story — do NOT default to a book. Think of story in other ways: a speech bubble, stars (stories in the sky), a winding path or journey, a scroll, a quill, magic sparkles, an open door or light (idea), or a simple silhouette that suggests "tale" or "hero". A book is optional, not required. (2) AI — e.g. small sparkles, soft glow, subtle stars, gentle "magic" or digital aura, connected dots, or a crystal-like glow; child-friendly, no robots or circuits. Combine one story motif (book or non-book) and one AI/magic motif in a single, simple icon. Colors: teal (#14b8a6) and cyan (#06b6d4) only, on white or transparent background. Style: minimal, flat, rounded shapes, vector-style. No child figure required. Output: square or vertical format, logo icon centered on top, "HeroKidStory" text centered below the icon, one cohesive lockup.
```

---

### Prompt 7 — Story + AI Odaklı (Kitap Yok; Logo Üstte, Altında HeroKidStory)

**Not:** Kitap motifi yok. Hikaye ve AI başka sembollerle: konuşma balonu, yıldızlar, parıltı, sihir, yol vb. Üstte logo, altta "HeroKidStory".

```
Create a logo for an AI-powered children's storytelling app. Do NOT use a book in the design. Layout: one logo mark on top, and directly below it the wordmark "HeroKidStory" in a clean sans-serif. The logo mark must emphasize two things using symbols other than a book: (1) Story — e.g. a speech bubble, a scroll, a quill, stars (stories in the sky), a winding path or journey, a magic sparkle, an open door or light (idea), or a simple character silhouette that suggests "tale" or "hero". (2) AI — e.g. soft glow, small sparkles, subtle connected dots or nodes, a gentle digital or magical aura, stars, or a crystal-like shape; child-friendly, no robots or circuits. Combine one clear story motif and one clear AI/magic motif in a single, simple icon. No book, no book pages. Colors: teal (#14b8a6) and cyan (#06b6d4) only, on white or transparent background. Style: minimal, flat, rounded shapes, vector-style. Output: square or vertical format, logo icon centered on top, "HeroKidStory" text centered below the icon, one cohesive lockup.
```

---

### Prompt 8 — Sadece Yazı (Wordmark; Hero + Story Teal, Kid Cyan)

**Not:** İkon yok. Sadece "HeroKidStory" metni: "Hero" ve "Story" #14b8a6, "Kid" #06b6d4.

```
Create a text-only logo (wordmark) for a children's storytelling app. No icon, no symbol — only the text "HeroKidStory". Typography: one line, clean modern sans-serif, friendly and rounded. Exact colors: the word "Hero" in teal #14b8a6, the word "Kid" in cyan #06b6d4, the word "Story" in teal #14b8a6. So the three words are visually distinct: Hero and Story same teal, Kid in cyan between them. Same font and same size for all three words; only the color changes. White or transparent background. Minimal, professional, suitable for header and print. Output: the wordmark only, centered, no other graphics.
```

---

## 5. Kullanım İpuçları

- **Gemini:** Prompt’u yapıştırıp “Generate image” ile deneyin; gerekirse “more cartoon”, “simpler shapes”, “no text” gibi ek cümleler ekleyin.
- **Çözünürlük:** Yüksek çözünürlük isteyin (örn. “high resolution, 1024x1024”); favicon için ayrıca 32x32’de test edin.
- **Vektör:** AI çıktısı genelde raster; vektör istiyorsanız Vectorizer.ai, Adobe Illustrator “Image Trace” veya manuel çizimle SVG’ye dönüştürün.
- **Marka tutarlılığı:** Seçtiğiniz logo versiyonunu `globals.css` ve Header/Footer’daki mevcut teal/cyan paleti ile birlikte kullanın.

---

## 6. Logo Üretebileceğiniz Araçlar

| Araç | Not |
|------|-----|
| **Google Gemini** | Siz planladığınız gibi; yukarıdaki prompt’ları doğrudan kullanabilirsiniz. |
| **Ideogram** | Logo ve tipografi için güçlü; “Logo” modu var. |
| **Midjourney** | `--style raw` veya `--v 6` ile daha tutarlı formlar; logo için birkaç deneme gerekebilir. |
| **DALL·E 3 (OpenAI)** | “Simple flat logo, teal and cyan…” gibi net tarifler iyi sonuç verir. |
| **Cursor / GenerateImage** | Bu ortamda da görsel üretim aracı var; prompt’ları burada deneyerek hızlı varyasyonlar üretebilirsiniz. |

İsterseniz bir sonraki adımda seçtiğiniz bir prompt’u Cursor içinde deneyip çıktıyı projeye `public/logo-*.png` olarak kaydedebiliriz.
