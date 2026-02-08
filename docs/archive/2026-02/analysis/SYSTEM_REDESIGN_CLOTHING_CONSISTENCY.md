# Kıyafet Tutarsızlığı – Sistem Tasarımı Analizi (Üst Düzey)

**Tarih:** 1 Şubat 2026  
**Bağlam:** Kıyafet tutarsızlığı sadece bir belirti; asıl problem **sorumluluk ayrımı** ve **single source of truth** olmayışı. Sistem tasarımını yeniden ele alıyoruz.

---

## 1. Ne yapmaya çalışıyoruz? (Asıl hedef)

1. Kullanıcı **karakter(ler)** yükler (fotoğraf).
2. Sistem bir **hikaye** üretir.
3. Hikayedeki **tüm önemli ögeler** (karakterler, önemli objeler) **tutarlı** olmalı.
   - Aynı karakter her sayfada aynı görünmeli (yüz, vücut, kıyafet).
   - Önemli obje (top, tavşan, vb.) her görünümde aynı olmalı.

**Çözüm:** Master illustration sistemi — her önemli öge için **bir** canonical referans; tüm sayfalarda bu referans kullanılır.

---

## 2. Şu an ne yapıyoruz? (Mevcut yaklaşım)

### Akış (şu an)

```
1. CHARACTER UPLOAD
   ↓
2. MASTER GENERATION (karakterler için)
   ↓
3. STORY GENERATION
   - Story prompt'a: "kıyafet = macera kıyafetleri", "mavi kırmızı yasak", "clothing field zorunlu"
   - GPT çıktısı: text, imagePrompt, sceneDescription, clothing (her sayfa için)
   ↓
4. SUPPORTING ENTITY MASTERS (hikayeden çıkan objeler için)
   ↓
5. PAGE IMAGE GENERATION
   - sceneDescription = imagePrompt || sceneDescription || text (kıyafet betimlemesi olabilir)
   - Strip: "mavi kırmızı" gibi ifadeleri metinden sil
   - Görsel üret: master + stripped scene text
```

### Sorunlar

1. **Story'ye görsel kural yükü:**  
   "Mavi kırmızı yasak", "macera kıyafetleri zorunlu", "clothing field her sayfa için" → Story'nin işi **iyi hikaye yazmak**; kıyafet veya görsel detay yönetmek değil.

2. **Tutarsızlık engellenemiyor:**  
   Clothing field "macera kıyafetleri" olsa da, story metni (`text`, `imagePrompt`, `sceneDescription`) içinde "mavi ve kırmızı elbiseleriyle" gibi ifadeler üretiliyor. Çünkü prompt "detaylı betimle" diyor, GPT de kıyafeti betimliyor.

3. **Strip = band-aid:**  
   Dönen veriyi filtre ile temizlemek sürdürülemez; yarın "sarı yeşil" olursa yine sorun.

4. **Sorumluluk karmaşası:**  
   - Story: "clothing field üret, ama mavi kırmızı yasak"  
   - Master: "Karakter kıyafetini fotoğraftan al"  
   - Page generation: "Master'a bak ama story'den gelen metinde kıyafet geçerse strip et"  
   → Üç yer kıyafet ile ilgileniyor; hiçbiri tek kaynak değil.

---

## 3. Ne yapmalıyız? (Doğru yaklaşım)

### Temel prensip: Sorumluluk ayrımı + Single source of truth

| Bileşen | Sorumluluğu | Sorumlu OLMAMALI |
|---------|-------------|-------------------|
| **Story Generation** | İyi hikaye metni (anlatı, diyalog, duygu). Hikayede geçen önemli ögeler (karakter isimleri, obje isimleri). | Görsel detay (kıyafet rengi, obje şekli, sahne composition vb.). |
| **Master System** | Tüm önemli ögelerin canonical görsel tanımı (karakterler: yüz/vücut/kıyafet; objeler: renk/şekil/detay). | Hikaye metni. |
| **Page Image Generation** | Master + hikaye metni → görsel üret. Sahne composition, karakter pose, ortam. | Kıyafet/obje detayını story'den çıkarmaya çalışmak (master zaten var). |

### Akış (olması gereken)

```
1. CHARACTER UPLOAD
   - Kullanıcı fotoğraf yükler
   ↓
2. CHARACTER ANALYSIS
   - AI fotoğrafı analiz eder: yaş, cinsiyet, saç/göz rengi, kıyafet
   - Sonuç: characterDescription (görsel detaylar dahil)
   ↓
3. MASTER GENERATION (karakterler için)
   - characterDescription + foto → master illustration üret
   - Master = yüz + vücut + kıyafet (tek canonical referans)
   ↓
4. STORY GENERATION
   - Input: karakter isimleri, yaş, ilişki (görsel detay YOK)
   - Prompt: "Write a story. Do NOT describe physical appearance or clothing. 
              Focus on actions, emotions, dialogue, scenes."
   - Output: 
     * pages[]: { text, sceneContext } (sadece sahne/aksiyon/duygu; görsel detay yok)
     * supportingEntities: [{ name, type, description }] (hikayede geçen önemli objeler)
   ↓
5. SUPPORTING ENTITY MASTERS
   - Story'den gelen entity listesi → her biri için master illustration üret
   - Örn: "Fluffy the Rabbit", "Magic Ball" → her birinin master'ı
   ↓
6. PAGE IMAGE GENERATION
   - Her sayfa için:
     * Hangi master'lar o sayfada? (karakterler + entities)
     * Hikaye metninden: sahne/aksiyon/duygu (görsel detay değil)
     * Görsel prompt: master references + scene context → görsel üret
     * Kıyafet/obje detayı: SADECE master'dan gelir
```

### Kritik farklar

| Eski | Yeni |
|------|------|
| Story'ye "clothing field üret, mavi kırmızı yasak" talimatı | Story hiç kıyafetten bahsetmez; sadece hikaye |
| Her sayfa için "clothing: macera kıyafetleri" | Clothing bilgisi yok; master'da zaten var |
| Story metni içinde "Arya mavi elbiseyle..." | Story metni: "Arya topa yaklaştı, merakla baktı..." (kıyafet yok) |
| Strip: "mavi kırmızı" cümlesini sil | Strip gereksiz; story'de zaten yok |
| Görsel prompt: stripped scene + "match reference" | Görsel prompt: master + pure scene context (aksiyon/duygu) |

---

## 4. Story generation prompt'u nasıl olmalı?

### ❌ Şu anki (yanlış)

```
- clothing field ZORUNLU, her sayfa için
- "mavi ve kırmızı rahat giysiler" YASAK
- "macera kıyafetleri" kullan
- imagePrompt: "SPECIFIC character clothing for this scene"
```

→ Story GPT'ye "kıyafet üret ama şunu yapma bunu yap" diyoruz; karışık ve etkisiz.

### ✅ Olması gereken (doğru)

```
STORY GENERATION RULES:

1. FOCUS ON NARRATIVE:
   - Character actions, emotions, dialogue, relationships
   - Scene setting (location, time, mood)
   - Plot progression and educational value

2. DO NOT DESCRIBE:
   - Character physical appearance (hair color, eye color, face)
   - Character clothing or outfit
   - Object visual details (color, shape, size)
   
   WHY? Visual details are handled by the master illustration system.
   Your job is to write an engaging story, not to design visuals.

3. OUTPUT FORMAT:
   pages: [
     {
       text: "Story text (actions, emotions, dialogue)",
       sceneContext: "Location, time, character action (NO clothing, NO appearance)"
     }
   ]
   
   supportingEntities: [
     { name: "Fluffy", type: "animal", description: "rabbit (visual details will be generated)" }
   ]
```

Böylece:
- Story sadece **anlatı** üretir
- Kıyafet/görsel detay story'nin işi değil
- Master system tüm görsel detayı tutar
- Tutarsızlık kaynağı kurutulur

---

## 5. Master system nasıl olmalı?

### Şu an (kısmi)

- Karakter master'ı var
- Entity master'ı var (tavşan, top için)
- Ama story'den "clothing" field geliyor, bu master'a aktarılıyor → tutarsızlık

### Olması gereken

```
CHARACTER MASTER:
- Input: foto + AI analizi (saç, göz, kıyafet VB. hepsi fotodaki gibi)
- Output: master illustration (yüz + vücut + kıyafet, tek referans)
- NOT: Story'den "clothing" değil; SADECE fotoğraftan

ENTITY MASTER:
- Input: story'den entity listesi (isim, tip, kısa açıklama)
- Output: her entity için master illustration
- Örn: "Fluffy the Rabbit" → beyaz tavşan, uzun kulaklar, mavi gözler (bir master)

PAGE GENERATION:
- Input: master'lar (karakter + entity) + story text (sadece aksiyon/duygu)
- Prompt: "Show [character] doing [action] in [scene]. Use reference images for all visual details."
- Output: görsel (master'lara göre)
```

**Önemli:** Story çıktısında `clothing` alanı YOK. Kıyafet bilgisi sadece **master'da**.

---

## 6. Kod tarafında değişiklikler (üst düzey)

### Kaldırılacaklar

1. **Story prompt'taki tüm clothing direktifleri:**
   - "mavi kırmızı yasak"
   - "macera kıyafetleri zorunlu"
   - "clothing field her sayfa"
   - `getClothingDirectives` fonksiyonu
   - Few-shot clothing örnekleri

2. **stripClothingFromSceneText:**
   - Story zaten kıyafet üretmeyecek; strip gereksiz

3. **Story JSON'da `clothing` alanı:**
   - `pages[].clothing` kaldır; zaten master'da var

### Eklenecek / Değişecekler

1. **Story prompt:**
   - "Do NOT describe appearance/clothing" kuralı ekle
   - `sceneContext` = sadece yer/zaman/aksiyon (görsel detay yok)

2. **Master generation:**
   - Karakter master'ı: foto → analiz (kıyafet dahil) → master
   - defaultClothing story'ye GİTMEZ; sadece master'da kalır

3. **Page image prompt:**
   - `sceneDescription` = story'den gelen pure scene context (kıyafet yok, zaten)
   - Master reference + scene context → görsel

---

## 7. Örnek akış (yeni sistem)

### Input
- Kullanıcı: Arya'nın fotoğrafı (pembe tişört, sarı yelek, yeşil pantolon)
- Tema: Adventure
- Yaş: 1

### 1. Master üretimi
```
AI Analysis: 1yo, girl, dark blonde hair, hazel eyes, outfit = pink tshirt + yellow vest + green pants
Master illustration: Arya (pembe tişört, sarı yelek, yeşil pantolon) → canonical reference
```

### 2. Story generation
```
Prompt: "Write story for Arya (1yo girl). Do NOT describe clothing/appearance."

Output:
{
  "pages": [
    {
      "text": "Arya sabah bahçede oynarken büyük bir top gördü. Merakla yaklaştı...",
      "sceneContext": "sunny garden, morning, Arya approaching a ball with curiosity"
      // NO clothing field!
    }
  ],
  "supportingEntities": [
    { "name": "Big Ball", "type": "object", "description": "large colorful ball" }
  ]
}
```

### 3. Entity master üretimi
```
"Big Ball" → master illustration (kırmızı-mavi çizgili top) → canonical reference
```

### 4. Page 1 görsel üretimi
```
Master references: Arya master + Ball master
Scene context: "sunny garden, morning, Arya approaching ball with curiosity"
Görsel prompt: "Show character approaching ball in sunny garden. Morning light. Use references for all visual details."
→ Görsel: Arya (pembe tişört/sarı yelek/yeşil pantolon) + kırmızı-mavi top + bahçe sahnesi
```

**Sonuç:** Tutarlı. Çünkü:
- Story kıyafet üretmedi (sadece aksiyon)
- Kıyafet sadece master'dan geldi
- Filtre gerekmedi

---

## 8. Özet: Ne değişmeli?

| Konu | Şu an (yanlış) | Olmalı (doğru) |
|------|----------------|----------------|
| **Story sorumluluğu** | Hikaye + kıyafet yönetimi | Sadece hikaye |
| **Story çıktısı** | text + clothing field + imagePrompt (kıyafet betimli) | text + sceneContext (kıyafet yok) |
| **Kıyafet kaynağı** | Story ("macera kıyafetleri") + Master + Strip | Sadece Master (fotodaki kıyafet) |
| **Story prompt** | "Kıyafet üret ama mavi kırmızı yasak" | "Kıyafet betimleme; sadece hikaye yaz" |
| **Tutarsızlık engeli** | Strip (reactive) | Story hiç üretmez (proactive) |

---

## 9. Sonuç ve öneri

**Problem:** Sorumluluk ayrımı net değil; story, master ve page generation hepsi kıyafet ile ilgileniyor. Story'ye görsel kural yüklüyoruz, sonra dönen veriyi filtre ile temizliyoruz.

**Çözüm:** 
1. **Story = sadece anlatı.** Kıyafet/görsel detay story'nin işi değil.
2. **Master = tek görsel kaynak.** Karakter + entity master'ları tüm detayı tutar.
3. **Page generation = master + story.** Görsel detay master'dan, aksiyon story'den.

**İlk adım (öneri):**  
Story prompt'u yeniden yaz:
- Tüm clothing direktiflerini kaldır (`getClothingDirectives`, few-shot örnekleri, "mavi kırmızı yasak" vb.).
- "Do NOT describe appearance/clothing/visual details" ekle.
- `clothing` alanını story JSON'dan kaldır.
- `imagePrompt` → `sceneContext` (sadece aksiyon/yer/zaman; görsel detay yok).

**Test:** Yeni prompt ile story üret; çıktıda "mavi", "kırmızı", "elbise", "giymekte" vb. olmamalı. Tutarlılık master'dan gelecek.

---

**İlgili dosyalar:**  
`lib/prompts/story/base.ts` (v1.6.0: getClothingDirectives kaldırıldı, DO NOT DESCRIBE eklendi),  
`app/api/books/route.ts` (stripClothingFromSceneText kaldırıldı; clothing validasyonu kaldırıldı),  
`lib/prompts/image/scene.ts` (sceneDescription kullanımı → pure context olarak kalacak).

**See also:** [STORY_AND_IMAGE_AI_FLOW.md](./STORY_AND_IMAGE_AI_FLOW.md) – Story/Image için AI’a ne gönderildiği ve ne döndüğü (request/response akışı, inceleme için).
