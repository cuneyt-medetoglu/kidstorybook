# Faz 4 — Uygulama İçi Oynatıcı

**Durum:** Beklemede  
**Bağımlılık:** Faz 3 (karaoke + motion bileşenleri)  
**Çıktı:** BookViewer'da çalışan read-along modu

---

## Amaç

Faz 2 ve 3'ün çıktılarını birleştirip **BookViewer içinde tam ekran read-along deneyimi** sunmak. Kullanıcı butona basar → kitap sesli, senkron metinli, hareketli olarak oynar.

---

## Yapılacaklar

### 1. ReadAlongPlayer Bileşeni

BookViewer'a entegre veya tam ekran modda ayrı bileşen:
- Tüm sayfaları sırayla oynatır
- Her sayfa: görsel motion + karaoke metin + TTS ses
- Sayfa bitince otomatik geçiş

### 2. Kontroller

- Play / Pause
- İleri / geri (sayfa atlama)
- Hız ayarı (0.8x, 1.0x, 1.2x)
- Ses açma/kapama
- Tam ekran toggle

### 3. Sayfa Geçiş Yönetimi

- Bir sayfanın sesi bitince → fade geçiş → sonraki sayfa
- Sonraki sayfanın görseli ve sesi preload
- Son sayfada bitiş ekranı

### 4. Performans

- Mobil cihazlarda akıcı oynatma (≥ 24fps)
- Preload stratejisi: mevcut + sonraki sayfa
- `prefers-reduced-motion` desteği: motion kapatılabilir

### 5. Entegrasyon

- BookViewer'da "Read Along" butonu
- Mevcut TTS otomatik oynatma ile ilişki (bu onun gelişmiş versiyonu)
- Parent Settings'ten hız/ses tercihleri

---

## Çıktı

- Çalışan read-along modu (web)
- Mobil + masaüstü test sonuçları
- Kullanıcı geri bildirimi → Faz 5 kararı (video export gerekli mi?)
