# 📖 E-book Viewer Stratejisi ve Planlama

**Proje:** KidStoryBook  
**Bölüm:** 2.5 E-book Viewer  
**Durum:** 🔴 Kritik - Planlama Aşaması  
**Tarih:** 4 Ocak 2026  
**Önem Derecesi:** ⭐⭐⭐⭐⭐ (En Yüksek)

---

## 🎯 Neden Bu Kadar Önemli?

E-book viewer, kullanıcının ürünümüzle **en çok etkileşimde bulunacağı** ve **en çok zaman geçireceği** bölümdür. Kullanıcı deneyimi burada belirlenir. Bu yüzden:

1. **İlk İzlenim:** Kullanıcı kitabını buradan okuyacak
2. **Dönüşüm Oranı:** İyi bir deneyim = daha fazla satış
3. **Retention:** Kötü deneyim = kullanıcı geri gelmez
4. **Word-of-Mouth:** Harika deneyim = kullanıcılar paylaşır
5. **PWA/Mobil:** Mobil uygulama deneyiminin kalbi

**Sonuç:** Bu bölüm mükemmel olmalı. Acele etmemeliyiz.

---

## 📱 Platform ve Cihaz Gereksinimleri

### Desktop
- **Screen Size:** 1920x1080 (standart), 2560x1440 (2K), 3840x2160 (4K)
- **Layout:** Çift sayfa gösterimi (kitap formatı)
- **Input:** Mouse, keyboard shortcuts, trackpad gestures
- **Features:** Zoom, fullscreen, print, download PDF

### Tablet (iPad, Android Tablet)
- **Screen Size:** 768x1024 (portrait), 1024x768 (landscape)
- **Layout:** 
  - Portrait: Tek sayfa
  - Landscape: Çift sayfa (bir taraf görsel, bir taraf yazı)
- **Input:** Touch gestures (swipe, pinch, tap)
- **Features:** Zoom, fullscreen, share, sesli okuma

### Mobile (iPhone, Android Phone)
- **Screen Size:** 375x667 (iPhone SE), 390x844 (iPhone 12), 393x852 (Pixel 7)
- **Layout:** 
  - Portrait: Tek sayfa (varsayılan)
  - Landscape: Çift sayfa veya büyütülmüş tek sayfa
- **Input:** Touch gestures (swipe, tap, hold)
- **Features:** Zoom, fullscreen, share, sesli okuma, autoplay

### PWA (Progressive Web App)
- **Offline Support:** Cache edilen kitaplar offline okunabilmeli
- **Install Prompt:** "Ana ekrana ekle" önerisi
- **Native Feel:** Tam ekran, splash screen, app icon
- **Performance:** Hızlı yükleme, smooth animasyonlar

---

## 🎨 Kullanıcı Gereksinimleri

### Kullanıcının İstediği (Explicit)
1. **Kolay navigasyon:** İleri/geri sayfa kolayca geçilmeli
2. **Görsel kalitesi:** Görseller net ve güzel görünmeli
3. **Sesli okuma:** Çocuklar için hikaye dinleme
4. **Hızlı yükleme:** Kitap açılışı hızlı olmalı
5. **Mobil uyumluluk:** Telefonda rahat okunmalı

### Kullanıcının Beklediği (Implicit)
1. **Smooth animasyonlar:** Sayfa geçişleri akıcı olmalı
2. **Sezgisel kontroller:** Nasıl kullanılacağı açık olmalı
3. **Nerede kaldı:** Son okuduğu yeri hatırlamalı
4. **Tam ekran:** Dikkatin dağılmaması için
5. **Accessibility:** Herkes kullanabilmeli (büyük font, kontrast, vb.)

### Çocuklar İçin Özel Gereksinimler
1. **Büyük butonlar:** Kolay dokunma
2. **Görsel odaklı:** Yazıdan çok görseller ön planda
3. **Eğlenceli animasyonlar:** Sayfa çevirme eğlenceli olmalı
4. **Sesli okuma:** Henüz okumayı bilmeyenler için
5. **Otomatik ilerleme:** Ellerini kullanmadan dinleyebilmeli

---

## 🔧 Teknik Gereksinimler

### Frontend Library Seçimi

#### Seçenek 1: react-pageflip
**Avantajlar:**
- ✅ React entegrasyonu kolay
- ✅ Gerçekçi sayfa çevirme animasyonu
- ✅ Touch ve mouse desteği
- ✅ Responsive
- ✅ Açık kaynak

**Dezavantajlar:**
- ⚠️ Son güncelleme eskiyebilir (kontrol edilmeli)
- ⚠️ Özelleştirme sınırlı olabilir

#### Seçenek 2: turn.js
**Avantajlar:**
- ✅ Çok gerçekçi sayfa çevirme
- ✅ Zoom desteği
- ✅ Olgun library (uzun süredir kullanılıyor)
- ✅ jQuery based (Next.js'te kullanılabilir)

**Dezavantajlar:**
- ⚠️ jQuery bağımlılığı (modern değil)
- ⚠️ React entegrasyonu daha zor
- ⚠️ Ücretli versiyon gerekebilir

#### Seçenek 3: Custom Implementation (Framer Motion)
**Avantajlar:**
- ✅ Tam kontrol
- ✅ Zaten Framer Motion kullanıyoruz
- ✅ Özelleştirme sınırsız
- ✅ Modern, performanslı

**Dezavantajlar:**
- ⚠️ Daha fazla geliştirme süresi
- ⚠️ Flip effect'i kendimiz implement etmeliyiz

**Öneri:** Önce react-pageflip deneyelim. Yetersiz kalırsa custom implementation'a geçeriz.

### Text-to-Speech (TTS) Seçenekleri

#### Seçenek 1: Web Speech API (Browser Native)
**Avantajlar:**
- ✅ Ücretsiz
- ✅ Browser native (ekstra yükleme yok)
- ✅ Kolay entegrasyon

**Dezavantajlar:**
- ⚠️ Ses kalitesi düşük
- ⚠️ Sınırlı ses seçenekleri
- ⚠️ Her browser'da farklı

#### Seçenek 2: ElevenLabs API
**Avantajlar:**
- ✅ Çok yüksek kalite (AI ses)
- ✅ Birçok ses seçeneği
- ✅ Farklı diller ve aksanlar

**Dezavantajlar:**
- ⚠️ Ücretli (character başına)
- ⚠️ API call gerektirir
- ⚠️ Latency olabilir

#### Seçenek 3: Google Cloud Text-to-Speech
**Avantajlar:**
- ✅ Yüksek kalite
- ✅ Birçok ses ve dil
- ✅ Makul fiyat

**Dezavantajlar:**
- ⚠️ Ücretli
- ⚠️ API call gerektirir

**Öneri:** MVP için Web Speech API kullanarak başlayalım. Kullanıcı geri bildirimine göre ElevenLabs veya Google TTS'e geçebiliriz.

### Performance Gereksinimleri
- **İlk Yükleme:** < 2 saniye (kitap açılışı)
- **Sayfa Geçişi:** < 100ms (animasyon süresi)
- **TTS Başlatma:** < 500ms
- **Zoom:** 60fps (smooth)
- **Bundle Size:** Viewer component < 50KB gzipped

---

## 📐 Layout ve Tasarım

### Portrait Mode (Dikey)
```
┌─────────────┐
│   Header    │ ← Progress, fullscreen, settings
├─────────────┤
│             │
│    Page 1   │ ← Tek sayfa göster
│   (Image +  │
│    Text)    │
│             │
├─────────────┤
│  Controls   │ ← Prev, Play, Next, TTS
└─────────────┘
```

### Landscape Mode (Yatay)
```
┌─────────────────────────────────────┐
│              Header                 │
├──────────────────┬──────────────────┤
│                  │                  │
│   Page 1 (Left)  │  Page 2 (Right)  │
│    [Image]       │     [Text]       │
│                  │                  │
├──────────────────┴──────────────────┤
│            Controls                 │
└─────────────────────────────────────┘
```

### Header Elements
- Progress indicator: "Page 3 of 10" + progress bar
- Fullscreen button
- Settings dropdown (voice, speed, theme)
- Close/Back button

### Controls (Bottom Bar)
- Previous page button (ArrowLeft icon)
- Play/Pause button (TTS + Autoplay)
- Next page button (ArrowRight icon)
- Page thumbnails button (grid icon)
- Bookmark button (bookmark icon)
- Share button (share icon)

---

## 🎭 Animasyonlar ve Geçişler

### Sayfa Çevirme Animasyonları (User Seçebilmeli)
1. **Flip (Varsayılan):** Gerçek kitap gibi sayfa çevirme
2. **Slide:** Sağdan sola/soldan sağa kayma
3. **Fade:** Solma efekti
4. **Curl:** Sayfa kıvrılma efekti (advanced)

### Animasyon Özellikleri
- **Duration:** 400-600ms (orta hız)
- **Easing:** ease-in-out (smooth)
- **FPS Target:** 60fps
- **Reduced Motion:** Accessibility için basit animasyon seçeneği

### Loading States
- **İlk Yükleme:** Skeleton screen + kitap kapağı
- **Sayfa Yükleme:** Blur placeholder
- **TTS Loading:** Spinner + "Preparing audio..."

---

## 🎤 Sesli Okuma (TTS) Detayları

### Ses Seçenekleri (Minimum 3 Ses)
1. **Female Adult:** Kadın ses (anne sesi)
2. **Male Adult:** Erkek ses (baba sesi)
3. **Child Voice:** Çocuk sesi (akran etkisi)
4. *(Opsiyonel)* **Story Teller:** Profesyonel hikaye anlatıcı sesi

### TTS Kontrolleri
- **Play/Pause:** Tek buton (toggle)
- **Stop:** TTS'i durdurup başa döndür
- **Speed:** 0.5x, 0.75x, 1x (normal), 1.25x, 1.5x, 2x
- **Volume:** 0-100% slider
- **Voice Selection:** Dropdown menü

### TTS Davranışları
1. **Sayfa Vurgulama:** Okunan kelime/cümle vurgulanır (highlight)
2. **Otomatik İlerleme:** Sayfa sonu gelince sonraki sayfaya geç
3. **Pause on Touch:** Ekrana dokunulunca TTS duraklasın
4. **Resume:** Play'e basılınca kaldığı yerden devam etsin

### TTS Implementasyon Stratejisi
**Faz 1 (MVP):**
- Web Speech API kullan
- 2-3 temel ses
- Basit kontroller (play/pause, speed)

**Faz 2 (Post-MVP):**
- ElevenLabs/Google TTS entegrasyonu
- 5+ farklı ses
- Gelişmiş kontroller (pitch, emphasis, vb.)

---

## 🔄 Otomatik Oynatma (Autoplay)

### Autoplay Modları
1. **Manual:** Kullanıcı manuel olarak sayfa çevirir
2. **Timed:** Her X saniyede bir otomatik sayfa geçişi (kullanıcı ayarlar)
3. **TTS Synced:** Sesli okuma ile senkronize (ses bitince sayfa geç)

### Autoplay Kontrolleri
- **Start Autoplay:** Play button (with autoplay icon)
- **Pause Autoplay:** Pause button veya ekrana dokunma
- **Resume Autoplay:** Play button'a tekrar basma
- **Speed Control:** 5s, 10s, 15s, 20s per page (dropdown)

### Autoplay UX
- **Visual Indicator:** Autoplay aktifken bir indicator göster (örn: "Auto-playing...")
- **Countdown:** Sonraki sayfaya kaç saniye kaldığını göster (progress ring)
- **Easy Pause:** Ekranın herhangi bir yerine dokunarak duraklat

---

## 🔖 Bookmark ve Progress Tracking

### Bookmark Özellikleri
- **Save Bookmark:** Mevcut sayfayı bookmark'a ekle
- **Bookmark List:** Tüm bookmark'ları listele
- **Jump to Bookmark:** Bookmark'a tıklayınca o sayfaya git
- **Remove Bookmark:** Bookmark'ı sil

### Progress Tracking
- **Auto-Save:** Son okunan sayfa otomatik kaydedilir
- **Resume Reading:** Kitap açılınca son okunan sayfadan devam et
- **Progress Percentage:** "65% completed" gibi gösterim
- **Reading Time:** Ne kadar süre okudu (opsiyonel)

### Database Schema
```sql
-- bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  book_id UUID NOT NULL REFERENCES books(id),
  page_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- reading_progress table
CREATE TABLE reading_progress (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  book_id UUID NOT NULL REFERENCES books(id),
  current_page INTEGER NOT NULL,
  total_pages INTEGER NOT NULL,
  last_read_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);
```

---

## ♿ Accessibility (Erişilebilirlik)

### WCAG 2.1 AA Uyumluluğu
- **Keyboard Navigation:** Tüm özellikler klavye ile erişilebilir
- **Screen Reader:** ARIA labels, semantic HTML
- **Color Contrast:** Minimum 4.5:1 ratio
- **Font Size:** Kullanıcı ayarlayabilir (16px-24px)
- **Focus Indicators:** Görünür focus rings

### Özel Erişilebilirlik Özellikleri
1. **High Contrast Mode:** Yüksek kontrast tema
2. **Font Size Control:** Metin boyutu ayarı
3. **Dyslexia-Friendly Font:** Disleksi dostu font seçeneği
4. **Reduced Motion:** Animasyonları azalt/kapat
5. **TTS:** Görme engelliler için sesli okuma

---

## 📊 Analytics ve Metrics

### Kullanıcı Davranışları (Track Edilecek)
1. **Reading Time:** Ortalama okuma süresi
2. **Completion Rate:** Kaç sayfa okundu / toplam sayfa
3. **TTS Usage:** TTS kullanım oranı
4. **Autoplay Usage:** Autoplay kullanım oranı
5. **Bookmark Usage:** Bookmark kullanım oranı
6. **Share Rate:** Paylaşma oranı
7. **Bounce Rate:** Kitabı açıp hemen kapama oranı

### Performance Metrics
1. **Load Time:** İlk yükleme süresi
2. **Page Turn Time:** Sayfa geçiş süresi
3. **TTS Latency:** Sesli okuma başlama süresi
4. **Error Rate:** Hata oranı

---

## 🚀 Implementasyon Planı

### Faz 1: MVP (Temel Özellikler)
**Süre:** 2-3 gün  
**Özellikler:**
- [ ] Temel sayfa gösterimi (tek/çift sayfa)
- [ ] Sayfa navigasyonu (ileri/geri)
- [ ] Basit animasyon (slide veya fade)
- [ ] Progress indicator
- [ ] Fullscreen mode
- [ ] Responsive (mobile/tablet/desktop)

### Faz 2: Gelişmiş Özellikler
**Süre:** 2-3 gün  
**Özellikler:**
- [ ] Flipbook animasyonu (react-pageflip)
- [ ] Touch gestures (swipe, pinch)
- [ ] Zoom functionality
- [ ] Page thumbnails
- [ ] Landscape/Portrait mode switching

### Faz 3: Sesli Okuma
**Süre:** 2-3 gün  
**Özellikler:**
- [ ] Web Speech API entegrasyonu
- [ ] TTS kontrolleri (play/pause/stop)
- [ ] Ses seçenekleri (2-3 ses)
- [ ] Speed control
- [ ] Volume control
- [ ] Otomatik sayfa ilerleme

### Faz 4: Autoplay ve UX İyileştirmeleri
**Süre:** 1-2 gün  
**Özellikler:**
- [ ] Autoplay functionality
- [ ] Bookmark system
- [ ] Reading progress tracking
- [ ] Share functionality
- [ ] Keyboard shortcuts

### Faz 5: Polish ve Optimizasyon
**Süre:** 1-2 gün  
**Özellikler:**
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Animation fine-tuning
- [ ] Loading state improvements
- [ ] Error handling

**Toplam Tahmini Süre:** 8-13 gün (1.5-2.5 hafta)

---

## ✅ Başlamadan Önce Yapılacaklar

### 1. Technical Research
- [ ] react-pageflip alternatives araştır (turn.js, custom, vb.)
- [ ] TTS libraries karşılaştır (Web Speech API vs paid options)
- [ ] Performance benchmarks hazırla
- [ ] PWA offline strategies araştır

### 2. Design Mockups (v0.app veya Figma)
- [ ] Desktop layout (çift sayfa)
- [ ] Tablet landscape layout (bir taraf görsel, bir taraf yazı)
- [ ] Mobile portrait layout (tek sayfa)
- [ ] Control panel tasarımı
- [ ] Settings modal tasarımı
- [ ] TTS kontrol panel

### 3. User Testing Plan
- [ ] Beta kullanıcı listesi hazırla
- [ ] Test scenarios oluştur
- [ ] Feedback form hazırla
- [ ] Success metrics belirle

### 4. v0.app Prompt Hazırlığı
- [ ] Detaylı component breakdown
- [ ] Interaction patterns tanımla
- [ ] Animation specifications
- [ ] State management gereksinimleri

---

## 🎯 Success Criteria

### Kullanıcı Memnuniyeti
- [ ] Kullanıcı rating: 4.5+/5.0
- [ ] Completion rate: >80% (kullanıcılar kitabı bitiriyorlar)
- [ ] Return rate: >60% (kullanıcılar tekrar geliyor)

### Performance
- [ ] Load time: <2s (first paint)
- [ ] Page turn: <100ms (animation duration)
- [ ] TTS latency: <500ms
- [ ] Lighthouse score: >90

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation: 100% kullanılabilir
- [ ] Screen reader: Tüm özellikler erişilebilir

---

## 📝 Notlar

1. **Öncelik:** Kullanıcı deneyimi > Görsel şıklık > Ekstra özellikler
2. **Performans:** Mobile-first, her zaman performansı ön planda tut
3. **Test:** Her özellik implement edildikten sonra gerçek cihazlarda test et
4. **Iteration:** v0.app'de birkaç versiyon denemeyi planla, ilk seferde mükemmel olmayabilir
5. **Feedback:** Beta kullanıcılardan erken feedback al

---

**Son Güncelleme:** 4 Ocak 2026  
**Durum:** Planlama tamamlandı, implementation başlayabilir (kullanıcı onayı sonrası)

