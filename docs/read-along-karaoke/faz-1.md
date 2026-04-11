# Faz 1 — Araştırma & Teknoloji Seçimi

**Durum:** Araştırma tamamlandı  
**Tarih:** 2026-04-11

---

## Amaç

Karaoke read-along video için temel teknoloji kararlarını almak.

---

## 1. Kelime Zamanlama — Bulgular

Karaoke için en kritik veri: **hangi kelime hangi milisaniyede söyleniyor?**

### Mevcut Durum

- TTS modeli: **`gemini-2.5-pro-tts`** (Google Cloud TTS üzerinden)
- `lib/tts/generate.ts` → `client.synthesizeSpeech()` → sadece **MP3 blob** dönüyor
- `hooks/useTTS.ts` → `currentWordIndex` var ama **eşit bölme** (`duration / wordCount`) — gerçek zamanlama değil, UI'a da bağlı değil
- Response'tan **hiçbir zaman bilgisi** alınmıyor

### Gemini TTS → Timepoint Yok

Google Cloud TTS'te standart modeller için `SSML_MARK` ile timepoint alınabiliyor. **Ama Gemini TTS modelleri (`gemini-2.5-pro-tts`) SSML desteklemiyor.** Bu modeller `prompt` + `text` + `speaker` parametreleri ile çalışıyor. Timepoint, mark veya word boundary özelliği **bulunmuyor**.

**Sonuç: Google TTS'ten doğrudan kelime zamanlaması almak şu anda mümkün değil.**

### Alternatifler

| Yöntem | Nasıl çalışır | Artı | Eksi |
|--------|--------------|------|------|
| **Whisper (lokal)** | Python kütüphanesi, `word_timestamps=True` ile ses dosyasından kelime bazlı `{start, end}` döndürür | Yüksek doğruluk, çok dil (TR dahil), ücretsiz | Sunucuda Python + model gerekir (~1.5GB RAM), işlem süresi |
| **Whisper API (OpenAI)** | Bulut transcription | Kolay entegrasyon | Kelime bazlı timestamp **desteklemiyor** — sadece segment düzeyinde |
| **Heuristik** | `sesSüresi / kelimeSayısı` ile eşit bölme | Sıfır bağımlılık, anında | Düşük kalite, noktalama/duraklamaları yok sayar |
| **Cümle bazlı TTS** | Her cümleyi ayrı TTS çağrısı ile üret, başlangıç zamanını biliyorsun | Kelime değil ama cümle senkronu doğru | API çağrı sayısı artar, cümle içi zamanlama yok |

### Önerilen Karar

**Birincil: Whisper lokal** — sunucuda Python sidecar veya Node child process olarak çalıştırılır. TTS sesi üretildikten sonra aynı ses dosyası Whisper'a verilir → kelime bazlı timeline JSON elde edilir.

**Fallback: Gelişmiş heuristik** — Whisper yokken veya hızlı prototip için. Mevcut eşit bölme yerine karakter ağırlıklı + noktalama duraklaması eklenmiş versiyon.

---

## 2. Render Teknolojisi — Bulgular

### Mevcut Altyapı

- **Görseller:** `1024×1536` PNG (portrait), AI-üretilmiş, S3'te
- **BookViewer:** React + Framer Motion, `AnimatePresence` ile sayfa geçişleri (flip, slide, fade, curl, zoom)
- **TTS oynatma:** `HTMLAudioElement`, `audio.currentTime` erişilebilir
- **Sayfa senkron:** TTS `onended` → sonraki sayfa (zaten çalışıyor)

### Uygulama İçi Oynatma

Ek kütüphane gerektirmeyen yaklaşım:

- Metin overlay: **DOM/CSS** — `<span>` elementleri, aktif gruba class toggle
- Motion: **Framer Motion** (zaten projede) veya CSS `transform` animasyonları
- Senkron: `requestAnimationFrame` + `audio.currentTime` → aktif chunk belirleme

Bu yaklaşım BookViewer'ın mevcut yapısına uyumlu. Yeni büyük dependency yok.

### Video Export

İki aday:

| | Remotion | FFmpeg |
|--|---------|--------|
| **Ne:** | React bileşenleriyle video tanımla, sunucuda render | Komut satırı video birleştirme |
| **Artı:** | React/Next.js uyumlu, aynı bileşenler kullanılabilir, Lambda desteği | Basit, hafif, kanıtlanmış |
| **Eksi:** | Yeni dependency, öğrenme eğrisi | Metin overlay kalitesi düşük (ASS subtitle), motion sınırlı |
| **Uygun:** | Yüksek kalite export istiyorsak | Basit MVP export yeterliyse |

### Önerilen Karar

- **Uygulama içi:** DOM/CSS + Framer Motion + `audio.currentTime` senkronu
- **Video export:** Faz 5'e bırakılsın. O aşamada talep ve kalite beklentisine göre Remotion veya FFmpeg seçilir.

---

## 3. Mevcut Kodda Değişmesi Gerekenler

| Alan | Şu an | Yapılacak |
|------|-------|-----------|
| `lib/tts/generate.ts` | Sadece MP3 üretip S3'e yüklüyor | Üretilen MP3'ü Whisper'a gönderip timeline JSON'ı da saklamak |
| `hooks/useTTS.ts` | Eşit bölme ile `currentWordIndex` (UI'a bağlı değil) | `audio.currentTime` + gerçek `WordTimeline` ile karaoke senkronu |
| `components/book-viewer/` | Statik metin, TTS sayfa bazlı | Karaoke overlay modu, motion layer |
| Yeni modül | — | `lib/read-along/` — timeline, chunking, sync |

---

## 4. Maliyet Tahmini

| Kalem | Tahmin |
|-------|--------|
| Whisper çalıştırma (sunucu) | Mevcut EC2'de ek CPU/RAM; kitap başına ~10–30sn işlem |
| Ek TTS maliyeti | Yok (mevcut ses kullanılıyor) |
| Ek depolama (timeline JSON) | Kitap başına ~5–20KB — ihmal edilebilir |
| Video export (Faz 5) | O aşamada değerlendirilecek |

---

## Özet Kararlar

| Konu | Karar |
|------|-------|
| Kelime zamanlama | **Whisper lokal** (birincil) + heuristik (fallback) |
| Uygulama içi render | **DOM/CSS + Framer Motion** + `audio.currentTime` |
| Video export | Faz 5'e ertelendi |
| Veri formatı | `WordTimeline[]` → JSON, kitap verisiyle birlikte S3'te |

→ **Sonraki adım: Faz 2** — Whisper entegrasyonu ve timeline üretim modülü
