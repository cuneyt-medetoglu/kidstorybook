# Faz 5 — Video Export

**Durum:** Beklemede  
**Bağımlılık:** Faz 4 (çalışan uygulama içi deneyim)  
**Çıktı:** İndirilebilir MP4 dosya + dağıtım pipeline

---

## Amaç

Read-along deneyimini **MP4 video dosyasına** dönüştürmek. "Video olarak indir" ve "sosyal medyada paylaş" senaryoları.

---

## Yapılacaklar

### 1. Render Pipeline

Faz 1'deki teknoloji kararına göre:

| Yaklaşım | Açıklama |
|----------|----------|
| FFmpeg (sunucu) | Görsel + ses + ASS subtitle → MP4 birleştirme |
| Remotion | React bileşenleriyle video sahnesi → sunucu veya Lambda render |
| Puppeteer | Headless tarayıcıda frame yakalama → FFmpeg birleştirme |

### 2. Çıktı Formatları

| Format | Süre | Kullanım |
|--------|------|----------|
| Tam kitap | 2–5 dk | İndirme, arşiv |
| Teaser | 15–30 sn (ilk 2–3 sayfa) | Sosyal medya |
| Kare (1:1) | Değişken | Instagram, sosyal |

### 3. İş Kuyruğu

- Video üretimi arka planda (BullMQ)
- Kullanıcı "İndir" tıklar → iş kuyruğa girer → hazır olunca bildirim
- Eşzamanlı iş limiti (sunucu koruma)

### 4. Depolama & Dağıtım

- S3'e yükleme + CloudFront CDN
- On-demand üretim (her kitap için önceden üretme yok)
- TTL: 30 gün sonra sil, tekrar istenirse yeniden üret

### 5. Maliyet Kontrolü

- 720p varsayılan (1080p opsiyonel premium)
- CPU maliyeti / video tahmini
- Depolama + transfer maliyeti takibi

---

## Çıktı

- Video export API endpoint
- Kuyruk sistemi (mevcut BullMQ genişletmesi)
- S3 depolama + CDN dağıtım
- Maliyet raporu (gerçek verilerle)
