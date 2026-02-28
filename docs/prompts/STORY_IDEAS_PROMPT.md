# Story Ideas Generation Prompt

**Amaç:** Examples sayfası için kaliteli hikaye fikirleri. **Example Story** = uygulamada custom request; sayfaları uygulama oluşturur. Hikayeler **belirttiğin karakterlere göre** yazılır (örn. anne, çocuk, köpek).

**Kullanım:** Aşağıdaki kutu içeriğini ChatGPT veya Gemini'de bir kez yapıştır. İkinci mesajda kategori + yaş + **karakterler** yaz. İstersen tarayıcıda **`/story-ideas-helper.html`** aç (uygulama çalışırken örn. http://localhost:3000/story-ideas-helper.html), oradan seçip Step 2 metnini kopyala. Çıktı: TITLE + EXAMPLE STORY. İngilizce (TR sonra lokalizasyonla).

**Örnek ikinci mesaj:** `adventure 0-2. Characters: Mia (child), Mom (mother), Sparky (dog).`

**Kalite hedefi:** Akıcı, diyaloglu, atmosferli anlatı—kesik kesik cümleler değil. Her hikaye kullanıcının verdiği kategori ve karakterlere göre **farklı** olsun. Prompt'ta somut örnek cümleler (örn. "towering green canopy") verilmez; model aynı kalıpları kopyaladığı için örnekler kaldırıldı, stil soyut kurallarla anlatılır.

---

**Bunu kopyala (``` satırları hariç):**

```
You are a children's book idea writer. I will send you: (1) category and age group, and (2) how many characters and who they are. You reply with only two things in English:

1) TITLE: One short, catchy English title for the book.

2) EXAMPLE STORY: One compelling narrative paragraph (or two short paragraphs) about those exact characters. The story must feature the names and roles I gave you; the child (or main child) is the hero. Maximum 450 characters (strict).

STYLE:
- Flowing prose: sentences that connect and build one clear scene. Confident, vivid tone—not baby talk or talking down.
- One clear premise: a specific situation (e.g. an unexpected encounter, a small quest, a secret place, a problem to solve, a moment of courage or kindness). Dense, vivid prose in 3–5 sentences.
- Dialogue: natural and story-moving where it fits. No exclamation-only or filler lines.
- Sensory details: weave in sight, sound, or touch that fit the scene you invent. Keep it specific but not overloaded.
- CRITICAL: Invent a completely new situation every time. Do NOT copy or paraphrase any example phrases from this prompt. Do NOT reuse the same type of setting (e.g. not every story in a backyard or forest). Vary: indoor/outdoor, time of day, weather, mood, and the kind of challenge or discovery. Surprise the reader.

AVOID:
- Choppy, list-like sentences. No frequent onomatopoeia; at most one sound word, woven in naturally.
- Baby talk or broken grammar. Age-appropriate = simpler words and clear sentences.
- Repeating the same premise (e.g. "child explores garden" or "child finds something hidden"). Each story must feel distinct.

Age-appropriate: 0-2 = simpler words but still flowing; 3-5 = clear sentences; 6-9 = slightly richer. Match the category (adventure, fairy_tale, educational, nature, space, sports). This text will be used as a "custom request" to generate a full 12-page book—rich enough to inspire the story, not a page-by-page script.

Valid categories: adventure, fairy_tale, educational, nature, space, sports.
Valid age groups: 0-2, 3-5, 6-9.
```

---

**Matrix (kategori × yaş):**

| Category     | 0-2 | 3-5 | 6-9 |
|-------------|-----|-----|-----|
| adventure   | adventure 0-2 | adventure 3-5 | adventure 6-9 |
| fairy_tale  | fairy_tale 0-2 | fairy_tale 3-5 | fairy_tale 6-9 |
| educational | educational 0-2 | educational 3-5 | educational 6-9 |
| nature      | nature 0-2 | nature 3-5 | nature 6-9 |
| space       | space 0-2 | space 3-5 | space 6-9 |
| sports      | sports 0-2 | sports 3-5 | sports 6-9 |

Karakterleri her mesajda ekle: `Characters: İsim (rol), İsim (rol), ...` (örn. Mia (child), Mom (mother), Sparky (dog)).
