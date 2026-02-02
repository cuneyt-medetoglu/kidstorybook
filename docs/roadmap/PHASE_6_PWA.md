## 📱 FAZ 6: Mobil Uygulama (PWA)
**Öncelik:** 🟢 Düşük (Post-MVP)  
**Durum:** 🔵 Bekliyor (Web tamamlandıktan sonra)  
**Not:** Şu an odağımız web uygulamasını tamamlamak. Mobil uygulama web tamamlandıktan sonra geliştirilecek.

### 6.1 PWA Temel Kurulumu
- [ ] **6.1.1** next-pwa paketi kurulumu
- [ ] **6.1.2** Manifest.json oluşturma (app name, icons, theme color)
- [ ] **6.1.3** Service Worker yapılandırması
- [ ] **6.1.4** App icon'ları oluştur (192x192, 512x512, iOS icon'ları)
- [ ] **6.1.5** Splash screen yapılandırması
- [ ] **6.1.6** Offline desteği (cache strategy)
- [ ] **6.1.7** Install prompt (PWA yükleme butonu)

### 6.2 Mobil Optimizasyon
- [ ] **6.2.1** Touch gesture desteği (swipe, pinch)
- [ ] **6.2.2** Mobil navigasyon iyileştirmeleri
- [ ] **6.2.3** Fotoğraf yükleme optimizasyonu (mobil kamera entegrasyonu)
- [ ] **6.2.4** Push notification desteği (opsiyonel)
- [ ] **6.2.5** Share API entegrasyonu (kitap paylaşma)
- [ ] **6.2.6** Responsive tasarım son kontrolleri
- [ ] **6.2.7** Çocuk Modu Telefon Kilidi Önleme (23 Ocak 2026)
  - Çocuk modunda hikaye okunurken uygulama yaparken telefon tuş kilidine girmesin diye bir özellik eklenebilir
  - Bunu mobil app zamanı bakacağız, acil değil
  - Screen wake lock API
  - Keep screen on during reading mode
  - Battery optimization considerations

### 6.3 Android (Play Store) - TWA Build
- [ ] **6.3.1** PWA Builder veya Bubblewrap ile TWA projesi oluştur
- [ ] **6.3.2** Android manifest yapılandırması
- [ ] **6.3.3** APK/AAB build alma
- [ ] **6.3.4** Google Play Console hesabı oluştur ($25 tek seferlik)
- [ ] **6.3.5** Store listing hazırlama (açıklama, ekran görüntüleri, icon)
- [ ] **6.3.6** Play Store'a yükleme ve yayınlama
- [ ] **6.3.7** Test ve inceleme süreci

### 6.4 iOS (App Store) - Capacitor Wrapper
- [ ] **6.4.1** Capacitor kurulumu ve yapılandırması
- [ ] **6.4.2** iOS platform ekleme
- [ ] **6.4.3** iOS native wrapper oluşturma
- [ ] **6.4.4** Xcode projesi yapılandırması
- [ ] **6.4.5** Apple Developer hesabı oluştur ($99/yıl)
- [ ] **6.4.6** App Store Connect'te uygulama oluşturma
- [ ] **6.4.7** Store listing hazırlama (açıklama, ekran görüntüleri, icon)
- [ ] **6.4.8** App Store'a yükleme ve yayınlama
- [ ] **6.4.9** Test ve inceleme süreci

### 6.5 Test ve Optimizasyon
- [ ] **6.5.1** PWA test (Lighthouse PWA audit)
- [ ] **6.5.2** Android cihazlarda test (farklı ekran boyutları)
- [ ] **6.5.3** iOS cihazlarda test (iPhone, iPad)
- [ ] **6.5.4** Performance optimizasyonu (bundle size, loading time)
- [ ] **6.5.5** Offline functionality test
- [ ] **6.5.6** Store'larda görünürlük ve kullanılabilirlik testi

### 6.6 Güncelleme ve Bakım
- [ ] **6.6.1** OTA (Over-The-Air) güncelleme stratejisi
- [ ] **6.6.2** Store güncelleme süreci dokümantasyonu
- [ ] **6.6.3** Kullanıcı geri bildirimi toplama sistemi
- [ ] **6.6.4** Crash reporting (Sentry veya benzeri)

**Not:** Bu faz web uygulaması tamamlandıktan ve production'da stabil çalıştıktan sonra başlatılacak. PWA yaklaşımı ile mevcut web kodunun %95'i kullanılabilir, sadece mobil optimizasyonlar ve store entegrasyonları eklenecek.

---

