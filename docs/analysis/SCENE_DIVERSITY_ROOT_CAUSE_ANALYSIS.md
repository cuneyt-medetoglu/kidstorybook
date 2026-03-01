# Sahne Tekrarı ve Görsel Monotonluk – Kök Neden + Çözüm Planı

**Tarih:** 2026-03-01  
**Durum:** Kritik – Ürün kalitesini doğrudan etkiliyor  
**Referans Kitap:** `8c29dcc3-afcb-4c49-9e87-bd02f3836878` (Arya ve Sihirli Ateşböceği, GPT-4o ile)

---

## Sorunun Özeti

12 sayfalık kitaplarda tüm görseller neredeyse aynı sahneyi (aynı dış mekan, aynı ışık, aynı karakter pozu) tekrar ediyor. Model (4o vs 4o-mini) değişse de sorun devam ediyor.

---

## Tam Akış – Sorun Nerede Başlıyor?

```
[A] story-ideas-helper.html
    → Gemini/ChatGPT'ye gönderilir
    → Döner: "Arya's Starry Chase – In the cool night air of her backyard..."
    → Kullanıcı bu paragrafı customRequests'e yapıştırır

[B] Story Generation (books/route.ts)
    → customRequests = STORY SEED bölümüne eklenir
    → Prompt: "Build the ENTIRE 12-page narrative around it"
    → GPT tüm 12 sayfayı bu tek sahne üzerine inşa eder
    → Sonuç: 12 sayfa = gece bahçe + ateşböceği

[C] Image Generation (generateFullPagePrompt)
    → Her sayfa için imagePrompt = GPT'nin ürettiği sahne
    → 12 imagePrompt neredeyse aynı → 12 görsel neredeyse aynı
```

---

## Kök Neden Analizi

### Sorun 1 – Story Seed "Tek Sahne" tanımlıyor, hikaye bunu 12 sayfaya yayıyor

`story-ideas-helper.html` → Gemini prompt'u:
```
"One compelling narrative paragraph"
"One clear premise"
"Maximum 450 characters (strict)"
```

Bu kasıtlı tasarım: Gemini bir **tek sahne anı** üretiyor.

Örnek çıktı (ekrandan):
> "In the cool night air of her backyard, Arya spotted a glowing firefly..."

Bu paragraf **1 sahneyi** tanımlıyor: Gece, bahçe, ateşböceği. Sadece budur.

Sonra `STORY SEED` bölümü story prompt'ta şunu söylüyor (`lib/prompts/story/base.ts`):
```
"You MUST build the entire 12-page narrative around it."
"Maintain its core scenes, mood, atmosphere."
```

GPT bu direktifi harfi harfine uyguluyor:
- Sahne: gece + bahçe + ateşböceği → 12 sayfa boyunca bu sahne
- Arya pijamalarıyla çıplak ayakla bahçede → hiç yerinden ayrılmıyor

**Story-ideas-helper'ın kendisi sorun değil.** Doğru çalışıyor — iyi bir açılış sahnesi üretiyor. **Sorun, story generation'ın bu tek sahneyi 12 sayfa boyunca "backbone" olarak kullanması.**

---

### Sorun 2 – Hikayede YOLCULUK zorunluluğu yok

Rakip (Lisa & Poco hikayesi) nasıl çalışıyor?

| Sayfa | Sahne | Lokasyon |
|-------|-------|----------|
| 1-2 | Lisa odada çanta hazırlıyor | Oda (iç mekan) |
| 3 | Bahçe kapısından çıkış | Bahçe (sabah) |
| 4-5 | Ormana giriş | Orman yolu |
| 6 | Yıkık ağaç (engel) | Orman içi |
| 7 | Dere kenarı | Dere |
| 8-9 | Meşe ağacı keşfi | Orman açıklığı |

Lisa ve Poco **fiziksel olarak yolculuk yapıyor**. Her sahne bir öncekinden farklı bir yerde.

Bizim hikayemizde Arya **yerinden kımıldamıyor**. Story prompt'ta "Vary locations" yazıyor ama bu sadece bir **tavsiye**. GPT bunu seed'in lokasyonu baskın olduğu için görmezden geliyor.

---

### Sorun 3 – `imagePrompt` çeşitliliği doğrulanmıyor

Story generation sonrası 12 `imagePrompt` birbirinin kopyası olabilir. Sistem bunu kontrol etmiyor. `books/route.ts` satır 2076:
```ts
let sceneDescription = page.imagePrompt || page.sceneDescription || page.text
```

GPT'nin ürettiği `imagePrompt` doğrudan image generation'a gidiyor. 12 kez "child in backyard at night with glowing firefly" yazsa bile hiç itiraz edilmiyor.

---

### Sorun 4 – `books/route.ts`'te kelime tamiri kaldırılmış (sadece log)

```ts
// Sıra 17: Kelime sayısı kontrolü – sadece log (repair kaldırıldı)
console.log(`[Create Book] 📊 Word count (min ${wordMin}):`, ...)
```

Terminal'deki kitapta: `p1=25, p2=19, p3=15, p4=17, p5=14, p6=16, p7=12...`

12 sayfa, ortalama 16 kelime. Hiç repair yapılmadı. Kısa metin = zayıf imagePrompt = zayıf görsel.

---

## Özet Tablo

| # | Sorun | Nerede | Etki |
|---|-------|--------|------|
| 1 | Story seed tek sahne tanımlıyor | story-ideas-helper prompt | GPT 12 sayfayı aynı lokasyonda geçiriyor |
| 2 | "Build ENTIRE narrative around seed" çok bağlayıcı | `buildStorySeedSection()` | Seed'in lokasyonu 12 sayfa boyunca dominant |
| 3 | Fiziksel yolculuk zorunlu değil | `buildStoryStructureSection()` | Hikaye hareketsiz kalıyor |
| 4 | imagePrompt çeşitliliği kontrol edilmiyor | `books/route.ts` story sonrası | Tekrarlayan görseller geçiyor |
| 5 | Kelime tamiri `books/route.ts`'te yok | `books/route.ts:1024` | Metin kısa → imagePrompt zayıf |

---

## Çözüm Planı

### Seçenek A – Story Seed'i "Yolculuk Odaklı" Yap (story-ideas-helper'da)

**Ne değişir:** Gemini'ye gönderilen prompt, tek sahne yerine açılış + yolculuk yönü üretsin.

Mevcut prompt çıktısı:
> "In the cool night air of her backyard, Arya spotted a glowing firefly..."
> (Tek sahne, 1 lokasyon)

Yeni prompt çıktısı (hedef):
> "Arya heard a strange rustling outside her window and tiptoed downstairs. What began as a quiet peek turned into a moonlit chase through the garden, past the old oak gate, and into the dewy meadow — where something magical was waiting."
> (Açılış sahnesi + nereye gidileceğine dair ipucu: bahçe → kapı → çayır)

**Nasıl yapılır:** STYLE bölümüne ekle:
```
- Journey arc: begin with a starting point (indoor or specific outdoor location), 
  then hint at where the adventure leads next (at least 2 different settings implied).
  Do NOT confine the story to a single location.
```

---

### Seçenek B – Story Generation'da SCENE DIVERSITY (Sabit şablon değil)

**Hedef:** Her sayfa farklı bir **an** olsun — tekrarlayan sahne olmasın. Lokasyon zorunluluğu yok; bazen yolculuk, bazen aynı yerde farklı anlar.

**Yapılan (v2.6.0):**
- **SCENE DIVERSITY** bloğu: "Her sayfa ayrı bir an; aynı sahneyi tekrarlama. Seed sadece açılış (1–2). Sonraki sayfalar farklı olsun — ister mekân değişimi, ister aynı yerde farklı aktivite/an."
- **Zorunlu kaldırıldı:** "En az 3 lokasyon", "gün 2 kez değişmeli", "journeyMap" JSON alanı. Bunlar tek tip sonuç üretir diye çıkarıldı.
- **Verification:** "Her sayfanın imagePrompt'u ayrı bir anı tanımlasın; çoğu sayfa aynı sahneye düşmesin" — sayı/lokasyon kotası yok.

---

### Seçenek C – `STORY SEED` Direktifini Gevşet

Mevcut (`buildStorySeedSection()`):
```
"You MUST build the entire 12-page narrative around it."
"Maintain its core scenes, mood, atmosphere."
```

Değiştirilecek:
```
"Use this seed to establish the story's OPENING TONE, character voice, and starting scene 
 (pages 1-2 only). Do NOT confine the entire story to this seed's location.
 Pages 3+ must move to different locations as the journey develops."
```

---

### Seçenek D – `books/route.ts`'e imagePrompt Çeşitlilik Kontrolü

Story generation'dan dönen 12 `imagePrompt`'un lokasyon çeşitliliğini kontrol et. Eğer 10+ sayfada aynı lokasyon varsa, bir repair pass yap.

```ts
// Lokasyon çeşitlilik kontrolü (basit versiyon)
const locationKeywords = storyData.pages.map(p => 
  extractSceneElements(p.imagePrompt || '', p.text || '').location || 'unknown'
)
const uniqueLocations = new Set(locationKeywords.filter(l => l !== 'unknown'))
if (uniqueLocations.size < 3) {
  // Repair: story'yi yeniden üret veya ek lokasyon direktifi ile güncelle
}
```

---

## Önerilen Uygulama Sırası

| Öncelik | Değişiklik | Etki | Zorluk |
|---------|-----------|------|--------|
| 1 | **Seçenek C** – STORY SEED direktifini gevşet | Hemen etkili | 5 dakika |
| 2 | **Seçenek B** – SCENE DIVERSITY (sabit şablon yok) | Çeşitlilik odaklı | Yapıldı |
| 3 | **Seçenek A** – story-ideas-helper prompt iyileştirme | İyi tohum = iyi hikaye | 15 dakika |
| 4 | **Seçenek D** – imagePrompt çeşitlilik kontrolü | Güvenlik ağı | 1 saat |

**Seçenek C + B birlikte uygulanırsa** sorunun %80'i çözülür.

---

## Tartışma Soruları

1. **SCENE DIVERSITY** kuralları modeli yeterince çeşitlendiriyor mu, yoksa ek validasyon gerekli mi?
2. **story-ideas-helper** için yolculuk ipucu yeterli mi, yoksa doğrudan 3 sahne mi istenmeli?
3. `books/route.ts`'teki word count repair kaldırılması (Sıra 17) kasıtlıydı mı? Geri eklenmeli mi?
