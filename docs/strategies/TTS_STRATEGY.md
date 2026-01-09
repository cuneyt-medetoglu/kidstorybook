# 🎤 Text-to-Speech (TTS) - Strateji ve Gereksinimler Dokümanı

**Tarih:** 6 Ocak 2026  
**Versiyon:** 1.0  
**Durum:** ✅ MVP Tamamlandı, Geliştirmeler Planlanıyor

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Mevcut Özellikler (MVP)](#mevcut-özellikler-mvp)
3. [Planlanan Özellikler](#planlanan-özellikler)
4. [Teknik Detaylar](#teknik-detaylar)
5. [Kullanım Senaryoları](#kullanım-senaryoları)
6. [Maliyet Analizi](#maliyet-analizi)
7. [Gelecek Geliştirmeler](#gelecek-geliştirmeler)

---

## 🎯 Genel Bakış

### Amaç
KidStoryBook platformunda, çocukların oluşturduğu hikaye kitaplarını sesli olarak dinleyebilmelerini sağlamak. Hikaye anlatıcı tonunda, doğal ve çocuk dostu bir ses deneyimi sunmak.

### Hedef Kitle
- **Birincil:** 3-10 yaş arası çocuklar
- **İkincil:** Ebeveynler (çocuklarına hikaye okurken)
- **Üçüncül:** Eğitimciler (sınıf içi kullanım)

### Temel Gereksinimler
- ✅ Doğal, hikaye anlatıcı tonu
- ✅ Çocuk dostu ses seçenekleri
- ✅ Çok dilli destek (TR, EN)
- ✅ Yaş grubuna göre özelleştirme
- ✅ Uyku zamanı, neşeli, samimi gibi modlar

---

## ✅ Mevcut Özellikler (MVP)

### 1. Temel TTS Entegrasyonu
- ✅ Google Cloud Text-to-Speech API entegrasyonu
- ✅ Backend API endpoint: `/api/tts/generate`
- ✅ Frontend hook: `hooks/useTTS.ts`
- ✅ Book Viewer entegrasyonu

### 2. Ses Seçenekleri
**Şu anki sesler (EN-US):**
- `en-US-Wavenet-C`: Female, natural storytelling (Varsayılan)
- `en-US-Wavenet-D`: Male, natural storytelling
- `en-US-Wavenet-E`: Female, child-friendly
- `en-US-Wavenet-F`: Female, warm and gentle
- `en-US-Standard-C`: Female, warm and friendly
- `en-US-Standard-D`: Male, warm and friendly
- `en-US-Standard-E`: Female, child-friendly
- `en-US-Standard-F`: Female, warm and gentle

**Not:** Şu an sadece İngilizce (EN-US) sesler mevcut. Türkçe (TR) desteği planlanıyor.

### 3. Kontroller
- ✅ Play/Pause butonu
- ✅ Ses hızı kontrolü (0.75x, 1.0x, 1.25x)
- ✅ Settings dropdown'da ses seçimi (şu an sağ üstte - debug için)
- ✅ Otomatik sayfa ilerleme (ses bittiğinde)
- ⏳ Volume kontrolü (hook'ta mevcut, UI'da yok)
- ⏳ Settings UI iyileştirmesi: Daha sonra daha güzel bir yere taşınacak ve daha sade/anlaşılır hale getirilecek

### 4. Teknik Özellikler
- ✅ Audio format: MP3
- ✅ Base64 encoded data URL
- ✅ Error handling
- ✅ Loading states
- ✅ Sayfa değiştiğinde otomatik durdurma

---

## 🚀 Planlanan Özellikler

### 1. Çok Dilli Destek (TR/EN)
**Öncelik:** 🔴 YÜKSEK  
**Durum:** ✅ Sesler Eklendi, ⏳ Otomatik Dil Algılama Planlanıyor

**Mevcut Durum:**
- ✅ Türkçe (TR-TR) ses seçenekleri eklendi
- ✅ İngilizce (EN-US) ses seçenekleri mevcut
- ✅ Settings dropdown'da manuel ses seçimi yapılabiliyor
- ⏳ Otomatik dil algılama: Localization altyapısı ile birlikte implement edilecek

**Türkçe Ses Seçenekleri (Mevcut):**
- `tr-TR-Standard-A`: Female, warm (Önerilen - 4M ücretsiz/ay)
- `tr-TR-Standard-C`: Female, warm (Alternatif)
- `tr-TR-Standard-E`: Female, warm (Alternatif 2)
- `tr-TR-Standard-B`: Male, warm
- `tr-TR-Standard-D`: Male, warm (Alternatif)
- `tr-TR-Wavenet-A`: Female, natural storytelling (Premium - 1M ücretsiz/ay)
- `tr-TR-Wavenet-C`: Female, natural storytelling (Premium)
- `tr-TR-Wavenet-E`: Female, natural storytelling (Premium)
- `tr-TR-Wavenet-B`: Male, natural storytelling (Premium)
- `tr-TR-Wavenet-D`: Male, natural storytelling (Premium)

**Otomatik Dil Algılama (Localization ile):**
- **Planlanan:** Localization altyapısı (i18n) yapılınca, hikayenin diline göre otomatik ses seçilecek
- **Implementasyon:**
  - Hikaye dilini tespit et (book.language veya metadata'dan)
  - Dil'e göre varsayılan ses seç:
    - Türkçe (TR) → `tr-TR-Standard-A` (Female, warm)
    - İngilizce (EN) → `en-US-Standard-E` (Female, child-friendly)
  - Kullanıcı isterse manuel olarak değiştirebilir
- **Zamanlama:** Faz 5 (Localization) ile birlikte implement edilecek
- **Not:** Şu an manuel ses seçimi yapılabiliyor. Otomatik seçim localization altyapısı hazır olunca eklenecek.

**Not:** "Achernar" sesi Gemini Pro TTS modelinde mevcut, ancak ücretli. Şu an WaveNet kullanıyoruz. Achernar'ı default yapmak için Gemini Pro TTS entegrasyonu gerekli (Post-MVP).

### 2. Yaş Grubuna Göre Özelleştirme
**Öncelik:** 🟡 ORTA  
**Durum:** ⏳ Planlanıyor

**Yaş Grupları:**
- **3-5 yaş:** Daha yavaş hız (0.75x), daha yüksek pitch, daha neşeli ton
- **6-8 yaş:** Normal hız (1.0x), orta pitch, samimi ton
- **9-12 yaş:** Biraz daha hızlı (1.1x), doğal pitch, hikaye anlatıcı ton

**Implementasyon:**
- [ ] Yaş grubu seçimi (Book Creation Wizard'da)
- [ ] Otomatik pitch/speed ayarları
- [ ] Ses tonu özelleştirme

### 3. Modlar (Uyku, Neşeli, Samimi)
**Öncelik:** 🟡 ORTA  
**Durum:** ⏳ Planlanıyor

**Modlar:**
- **Uyku Modu:**
  - Yavaş hız (0.7x)
  - Düşük pitch (-5)
  - Yumuşak ton
  - Uzun duraklamalar (SSML)
  
- **Neşeli Mod:**
  - Normal hız (1.0x)
  - Yüksek pitch (+5)
  - Enerjik ton
  - Kısa duraklamalar

- **Samimi Mod:**
  - Normal hız (1.0x)
  - Orta pitch (0)
  - Sıcak, güven veren ton
  - Doğal duraklamalar

**Implementasyon:**
- [ ] Mod seçimi (Settings dropdown)
- [ ] SSML desteği (duraklamalar, vurgular)
- [ ] Pitch kontrolü (-20 to +20)

### 4. Gelişmiş Özellikler
**Öncelik:** 🟢 DÜŞÜK  
**Durum:** ⏳ Post-MVP

- [ ] Word highlighting (kelime kelime vurgulama)
- [ ] SSML desteği (duraklamalar, vurgular, karakter sesleri)
- [ ] Emotion kontrolü (mutlu, üzgün, heyecanlı)
- [ ] Karakter bazlı ses değişimi (farklı karakterler için farklı sesler)
- [ ] Background music entegrasyonu

### 5. Cache Mekanizması
**Öncelik:** 🔴 YÜKSEK  
**Durum:** ⏳ Planlanıyor

**Gereksinimler:**
- [ ] Text'i SHA-256 hash'le
- [ ] Supabase Storage'da cache (`/tts-cache/{hash}.mp3`)
- [ ] İlk okuma: API'den al, storage'a kaydet
- [ ] Sonraki okumalar: Storage'dan çek (ücretsiz)

**Faydalar:**
- Aynı metin tekrar okutulduğunda ücretsiz
- Daha hızlı yükleme
- API kullanımını azaltır (maliyet tasarrufu)

---

## 🔧 Teknik Detaylar

### API Endpoint
```
POST /api/tts/generate
Body: {
  text: string,
  voiceId?: string (default: "en-US-Standard-E"),
  speed?: number (default: 1.0, range: 0.25-4.0)
}
Response: {
  audioUrl: string (base64 data URL),
  voiceId: string,
  speed: number,
  textLength: number
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
  setSpeed 
} = useTTS()
```

### Ses Seçenekleri Yapısı
```typescript
{
  "en-US-Wavenet-C": "Female, natural storytelling",
  "en-US-Wavenet-D": "Male, natural storytelling",
  // ... diğer sesler
}
```

### Environment Variables
```bash
GOOGLE_CLOUD_PROJECT_ID=kidstorybook
GOOGLE_APPLICATION_CREDENTIALS=./kidstorybook-xxxxx.json
# Veya production için:
GOOGLE_SERVICE_ACCOUNT_JSON={...}
```

---

## 📖 Kullanım Senaryoları

### Senaryo 1: Temel Kullanım
1. Kullanıcı kitabı açar
2. Play butonuna tıklar
3. TTS mevcut sayfayı okumaya başlar
4. Sayfa bittiğinde otomatik olarak sonraki sayfaya geçer

### Senaryo 2: Yaş Grubuna Göre Özelleştirme
1. Kullanıcı kitap oluştururken yaş grubunu seçer (3-5 yaş)
2. TTS otomatik olarak yavaş hız (0.75x) ve yüksek pitch kullanır
3. Çocuk daha rahat anlar ve dinler

### Senaryo 3: Uyku Modu
1. Kullanıcı Settings'ten "Uyku Modu" seçer
2. TTS yavaş hız (0.7x), düşük pitch (-5) ve uzun duraklamalarla okur
3. Çocuk uykuya daha kolay dalar

### Senaryo 4: Çok Dilli Kullanım (Şu anki - Manuel)
1. Kullanıcı Türkçe bir kitap oluşturur
2. Settings dropdown'dan Türkçe ses seçer (`tr-TR-Standard-A`)
3. TTS Türkçe ses ile okur

### Senaryo 5: Çok Dilli Kullanım (Gelecek - Otomatik)
1. Kullanıcı Türkçe bir kitap oluşturur
2. Localization altyapısı hikayenin dilini tespit eder (TR)
3. TTS otomatik olarak Türkçe ses seçer (`tr-TR-Standard-A`)
4. İngilizce kitap için otomatik olarak İngilizce ses kullanır (`en-US-Standard-E`)
5. Kullanıcı isterse Settings'ten manuel olarak değiştirebilir

---

## 💰 Maliyet Analizi

### Google Cloud TTS Fiyatlandırması

**WaveNet Sesleri (Şu an kullandığımız):**
- İlk 1 milyon karakter/ay: **ÜCRETSİZ**
- Sonrası: **$16.00 / 1 milyon karakter**

**Standart Sesler (Alternatif):**
- İlk 4 milyon karakter/ay: **ÜCRETSİZ**
- Sonrası: **$4.00 / 1 milyon karakter**

**Gemini Pro TTS (Achernar için):**
- Ücretli (fiyatlandırma bilgisi güncellenecek)

### Örnek Hesaplamalar

**10 sayfalık kitap (ortalama 250 karakter/sayfa):**
- Toplam: ~2,500 karakter
- 100 kitap/ay: ~250,000 karakter → **ÜCRETSİZ**
- 500 kitap/ay: ~1,250,000 karakter → 250K ücretli = **$4.00/ay**

**20 sayfalık kitap (ortalama 300 karakter/sayfa):**
- Toplam: ~6,000 karakter
- 100 kitap/ay: ~600,000 karakter → **ÜCRETSİZ**
- 200 kitap/ay: ~1,200,000 karakter → 200K ücretli = **$3.20/ay**

### Cache Mekanizması ile Tasarruf
- Aynı metin tekrar okutulduğunda: **ÜCRETSİZ** (storage'dan)
- API çağrısı yok → Maliyet tasarrufu
- Storage maliyeti: Supabase Storage (500MB ücretsiz, sonrası $0.021/GB/ay)

---

## 🔮 Gelecek Geliştirmeler

### Post-MVP Özellikler

1. **ElevenLabs Entegrasyonu (Alternatif)**
   - Daha doğal, hikaye anlatıcı tonu
   - Emotion ve tone kontrolü
   - Daha pahalı: Starter $5/ay (30K karakter), Creator $22/ay (100K karakter)
   - **Geçiş Kriteri:** Google Cloud TTS kalitesi yetersiz kalırsa

2. **Gemini Pro TTS Entegrasyonu**
   - Achernar gibi özel sesler
   - Daha gelişmiş prompt desteği
   - Ücretli model

3. **Karakter Bazlı Ses Değişimi**
   - Farklı karakterler için farklı sesler
   - SSML ile karakter diyalogları

4. **Background Music**
   - Hikaye türüne göre arka plan müziği
   - Volume balance (ses + müzik)

5. **Offline TTS (PWA)**
   - İnternet olmadan çalışma
   - Web Speech API fallback

---

## 📝 Notlar

### Mevcut Durum
- ✅ MVP tamamlandı (EN-US sesler)
- ✅ TR dil desteği eklendi (TR-TR sesler mevcut)
- ⏳ Otomatik dil algılama: Localization altyapısı ile birlikte (Faz 5)
- ⏳ Yaş grubuna göre özelleştirme planlanıyor
- ⏳ Modlar (uyku, neşeli, samimi) planlanıyor
- ⏳ Cache mekanizması planlanıyor

### Achernar Ses Hakkında
- Gemini Pro TTS modelinde mevcut
- Ücretsiz değil (ücretli model)
- Şu an WaveNet kullanıyoruz (ücretsiz tier mevcut)
- Achernar'ı default yapmak için Gemini Pro TTS entegrasyonu gerekli (Post-MVP)

### Dil Desteği
- **Şu an:** İngilizce (EN-US) ve Türkçe (TR-TR) sesler mevcut, manuel seçim yapılabiliyor
- **Otomatik Dil Algılama (Planlanan):** Localization altyapısı (i18n) yapılınca, hikayenin diline göre otomatik ses seçilecek
  - Türkçe hikaye → `tr-TR-Standard-A` (Female, warm)
  - İngilizce hikaye → `en-US-Standard-E` (Female, child-friendly)
  - Kullanıcı isterse Settings'ten manuel olarak değiştirebilir
- **Zamanlama:** Faz 5 (Localization) ile birlikte implement edilecek
- **Planlanan:** Diğer diller (Post-MVP)

---

## 📚 İlgili Dokümanlar

- `docs/ROADMAP.md` - Ana proje planı
- `docs/strategies/EBOOK_VIEWER_STRATEGY.md` - E-book Viewer stratejisi
- `docs/guides/ENVIRONMENT_SETUP.md` - Environment setup rehberi
- `app/api/tts/generate/route.ts` - TTS API endpoint
- `hooks/useTTS.ts` - TTS frontend hook

---

**Son Güncelleme:** 6 Ocak 2026

