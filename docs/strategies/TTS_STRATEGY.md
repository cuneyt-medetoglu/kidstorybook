# 🎤 Text-to-Speech (TTS) - Strateji ve Gereksinimler Dokümanı

**Tarih:** 15 Ocak 2026  
**Versiyon:** 2.0  
**Durum:** ✅ Gemini Pro TTS ile Güncellendi

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Mevcut Özellikler](#mevcut-özellikler)
3. [Teknik Detaylar](#teknik-detaylar)
4. [Cache Mekanizması](#cache-mekanizması)
5. [Çok Dilli Destek](#çok-dilli-destek)
6. [Maliyet Analizi](#maliyet-analizi)
7. [Gelecek Geliştirmeler](#gelecek-geliştirmeler)

---

## 🎯 Genel Bakış

### Amaç
HeroKidStory platformunda, çocukların oluşturduğu hikaye kitaplarını sesli olarak dinleyebilmelerini sağlamak. Hikaye anlatıcı tonunda, doğal ve çocuk dostu bir ses deneyimi sunmak.

### Hedef Kitle
- **Birincil:** 3-10 yaş arası çocuklar
- **İkincil:** Ebeveynler (çocuklarına hikaye okurken)
- **Üçüncül:** Eğitimciler (sınıf içi kullanım)

### Temel Gereksinimler
- ✅ Doğal, hikaye anlatıcı tonu
- ✅ Çocuk dostu ses seçenekleri
- ✅ Çok dilli destek (8 dil: TR, EN, DE, FR, ES, PT, RU, ZH)
- ✅ Cache mekanizması (maliyet optimizasyonu)
- ✅ Prompt sistemi (dil bazlı özelleştirme)

---

## ✅ Mevcut Özellikler

### 1. Gemini Pro TTS Entegrasyonu
- ✅ Google Cloud Gemini Pro TTS API
- ✅ Backend API endpoint: `/api/tts/generate`
- ✅ Frontend hook: `hooks/useTTS.ts`
- ✅ Book Viewer entegrasyonu
- ✅ Prompt sistemi (`lib/prompts/tts/v1.0.0/`)

### 2. Ses Seçenekleri
**Mevcut Ses:**
- `Achernar`: Natural, storytelling voice (Gemini Pro TTS)
  - Tüm dillerde kullanılabilir
  - Çocuk dostu ton
  - Enerjik ve sıcak anlatım

**Eski sesler kaldırıldı:**
- WaveNet sesleri (en-US-Wavenet-*, tr-TR-Wavenet-*)
- Standard sesler (en-US-Standard-*, tr-TR-Standard-*)

### 3. Kontroller
- ✅ Play/Pause butonu
- ✅ Ses hızı kontrolü (0.75x, 1.0x, 1.25x)
- ✅ Settings dropdown'da ses seçimi
- ✅ Otomatik sayfa ilerleme (ses bittiğinde)
- ✅ Autoplay modları (TTS Synced, Timed)
- ⏳ Volume kontrolü (hook'ta mevcut, UI'da yok)

### 4. Teknik Özellikler
- ✅ Audio format: MP3
- ✅ Cache mekanizması (Supabase Storage)
- ✅ Error handling ve retry
- ✅ Loading states
- ✅ Sayfa değiştiğinde otomatik durdurma
- ✅ Dil bazlı prompt sistemi

---

## 🔧 Teknik Detaylar

### API Endpoint

**Request:**
```typescript
POST /api/tts/generate

Body: {
  text: string,                    // Okunacak metin
  voiceId?: string,               // Ses (default: "Achernar")
  speed?: number,                 // Hız (default: 1.0, range: 0.25-4.0)
  language?: string               // PRD dil kodu (default: "en")
}
```

**Response:**
```typescript
{
  audioUrl: string,               // Public URL (cache) veya data URL
  voiceId: string,
  speed: number,
  language: string,               // Gemini TTS language code
  textLength: number,
  cached: boolean                 // Cache'den mi döndü?
}
```

### Frontend Hook
```typescript
const { 
  isPlaying, 
  isPaused, 
  isLoading, 
  play, 
  pause, 
  resume, 
  stop,
  setVolume,
  setSpeed,
  onEnded
} = useTTS()

// Kullanım
await play(text, {
  voiceId: "Achernar",
  speed: 1.0,
  language: "tr"  // PRD dil kodu (tr, en, de, fr, es, pt, ru, zh)
})
```

---

## 💾 Cache Mekanizması

### Amaç
Aynı metin tekrar okutulduğunda API çağrısı yapmadan cache'den döndürmek, maliyeti sıfırlamak.

### Nasıl Çalışır?

1. **Hash Hesaplama:** 
   - `text + voiceId + speed + prompt` kombinasyonu SHA-256 ile hash'lenir

2. **Cache Kontrolü:** 
   - Supabase Storage'da `tts-cache/{hash}.mp3` dosyası var mı kontrol edilir

3. **Cache Hit:** 
   - Varsa, public URL döndürülür (ücretsiz, hızlı)

4. **Cache Miss:** 
   - Yoksa, Gemini Pro TTS API'den ses oluşturulur
   - Supabase Storage'a kaydedilir
   - Public URL döndürülür

### Faydalar
- Aynı metin tekrar okutulduğunda: **$0 maliyet**
- İlk okuma: Normal maliyet (API + storage)
- Hız: Cache'den çok daha hızlı yükleme
- Storage maliyeti: Supabase Storage (500MB ücretsiz, sonrası $0.021/GB/ay)

### Storage Bucket
- **Bucket:** `tts-cache` (public)
- **Path:** `{hash}.mp3`
- **File size limit:** 10MB
- **Cleanup:** 30 günden eski dosyalar otomatik silinir (`cleanup_old_tts_cache` fonksiyonu)

---

## 🌍 Çok Dilli Destek

### Desteklenen Diller (8 Dil)

| PRD Kodu | Gemini TTS Kodu | Durum | Prompt Dosyası |
|----------|-----------------|-------|----------------|
| `tr` | `tr-TR` | GA | `lib/prompts/tts/v1.0.0/tr.ts` |
| `en` | `en-US` | GA | `lib/prompts/tts/v1.0.0/en.ts` |
| `de` | `de-DE` | GA | `lib/prompts/tts/v1.0.0/de.ts` |
| `fr` | `fr-FR` | GA | `lib/prompts/tts/v1.0.0/fr.ts` |
| `es` | `es-ES` | GA | `lib/prompts/tts/v1.0.0/es.ts` |
| `pt` | `pt-BR` | GA | `lib/prompts/tts/v1.0.0/pt.ts` |
| `ru` | `ru-RU` | GA | `lib/prompts/tts/v1.0.0/ru.ts` |
| `zh` | `cmn-CN` | Preview | `lib/prompts/tts/v1.0.0/zh.ts` |

### Prompt Sistemi

Her dil için özel prompt'lar hazırlanmıştır. Prompts çocuk hikayesi anlatıcı tonunu vurgular:

**Türkçe Prompt Örneği:**
```
Türkçe (Türkiye) oku. Çocuk hikâyesi anlatır gibi enerjik, heyecanlı ve sıcak bir tonda konuş. Tempo orta, diksiyon net. Önemli kelimeleri vurgula, sürprizlerde kısa durakla; cümle aralarında kısa, paragrafta biraz daha uzun duraklama yap. Bağırma, korkutucu ton kullanma.
```

**İngilizce Prompt Örneği:**
```
Read in English (United States). Speak in an energetic, excited, and warm tone like telling a children's story. Medium tempo, clear diction. Emphasize important words, pause briefly at surprises; short pauses between sentences, slightly longer pauses between paragraphs. Don't shout or use a scary tone.
```

### Dil Mapping
```typescript
// PRD dil kodu → Gemini TTS language code
const mapping = {
  'tr': 'tr-TR',
  'en': 'en-US',
  'de': 'de-DE',
  // ...
}

// Kullanım
const languageCode = getLanguageCode('tr')      // 'tr-TR'
const prompt = getPromptForLanguage('tr')       // Türkçe prompt
```

---

## 💰 Maliyet Analizi

### Gemini 2.5 Pro TTS Fiyatlandırması

**Token Bazlı Fiyatlandırma:**
- **Input Tokens:** $1.00 / 1 milyon text token
- **Output Tokens:** $20.00 / 1 milyon audio token
- **Audio tokens:** 25 token / saniye ses

**Limitler:**
- Max input: 8,192 token
- Max output: 16,384 token
- Context window: 32,000 token

### Maliyet Örnekleri

**Türkçe hikaye (~500 karakter, ~10 saniye ses):**
- Input: ~125 token → $0.000125
- Output (10 saniye): ~250 token → $0.005
- **Toplam:** ~$0.005125 / okuma

**10 sayfalık kitap (250 karakter/sayfa, toplam 2500 karakter):**
- İlk okuma: ~$0.05
- Sonraki okumalar: **$0 (cache'den)**

**Aylık kullanım (100 kitap, 10 sayfa, 1 okuma/kitap):**
- İlk okumalar: ~$5.00
- Cache hit oranı %50 → **~$2.50/ay**

### Cache ile Tasarruf

Cache mekanizması sayesinde aynı metin tekrar okutulduğunda API çağrısı yapılmaz:

| Senaryo | Cache Yok | Cache Var |
|---------|-----------|-----------|
| İlk okuma | $0.05 | $0.05 |
| 2. okuma | $0.05 | **$0** |
| 10. okuma | $0.05 | **$0** |
| **Toplam (10 okuma)** | $0.50 | **$0.05** |

---

## 🔮 Gelecek Geliştirmeler

### Planlanan Özellikler

1. **Otomatik Dil Algılama**
   - Kitap dilini otomatik tespit et (`book.language`)
   - Uygun prompt ve ses seçimini otomatik yap
   - Faz 5 (Localization) ile birlikte

2. **Yaş Grubuna Göre Özelleştirme**
   - 3-5 yaş: Yavaş hız (0.75x), yüksek pitch
   - 6-8 yaş: Normal hız (1.0x), orta pitch
   - 9-12 yaş: Hızlı (1.1x), doğal pitch

3. **Modlar (Uyku, Neşeli, Samimi)**
   - Uyku Modu: Yavaş, yumuşak ton
   - Neşeli Mod: Hızlı, enerjik ton
   - Samimi Mod: Normal, sıcak ton

4. **Gelişmiş Özellikler**
   - Word highlighting (kelime vurgulama)
   - SSML desteği (duraklamalar, vurgular)
   - Emotion kontrolü (mutlu, heyecanlı, sakin)
   - Background music entegrasyonu

5. **Alternatif Sesler**
   - Gemini Pro TTS'de mevcut diğer 30 sesi ekle
   - Kullanıcı tercihine göre ses seçimi

---

## 📚 İlgili Dokümanlar

- `docs/ROADMAP.md` - Ana proje planı
- `docs/PRD.md` - Ürün gereksinimleri
- `lib/prompts/tts/v1.0.0/` - TTS prompt'ları
- `app/api/tts/generate/route.ts` - TTS API endpoint
- `hooks/useTTS.ts` - TTS frontend hook
- `supabase/migrations/008_create_tts_cache_bucket.sql` - Cache bucket migration

---

**Son Güncelleme:** 15 Ocak 2026  
**Değişiklikler:**
- Gemini Pro TTS'e geçiş yapıldı
- WaveNet ve Standard sesler kaldırıldı
- Cache mekanizması eklendi
- 8 dil desteği eklendi
- Prompt sistemi kuruldu
