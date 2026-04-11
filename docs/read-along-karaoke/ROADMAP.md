# Read-Along Karaoke Video — Yol Haritası

**Tarih:** 2026-04-11  
**Durum:** Planlama  
**Önceki analiz:** `docs/analysis/READ_ALONG_VIDEO_MOTION_AND_KARAOKE_ANALYSIS.md`

---

## Ne yapıyoruz?

Mevcut hikaye **görselleri** ve **TTS sesleri** üzerinden **karaoke tarzı bir read-along video** üretiyoruz.

**Girdi:** Sayfa görseli (PNG/WebP) + TTS ses (MP3)  
**Çıktı:** Görselin üzerinde sesle senkron ilerleyen metin vurgusu + hafif motion = video deneyimi

---

## Neden?

- Elimizde zaten yüksek kaliteli illüstrasyonlar ve TTS ses var
- Generative video (Veo vb.) pahalı ve tutarsız — biz **mevcut varlıklardan** üretiyoruz
- Karaoke/read-along, çocuk eğitiminde kanıtlanmış bir format

---

## Fazlar

| # | Faz | Ne yapılacak | Durum | Doküman |
|---|-----|-------------|-------|---------|
| 1 | **Araştırma & Teknoloji Seçimi** | Kelime zamanlama yöntemleri, render teknikleri, mevcut altyapı analizi | Tamamlandı | [faz-1.md](./faz-1.md) |
| 2 | **Audio–Metin Senkronizasyonu** | Whisper ile kelime bazlı zaman damgaları elde etme | Tamamlandı | [faz-2.md](./faz-2.md) |
| 3 | **Karaoke Metin & Görsel Motion** | Metin vurgulama overlay + görsele hafif hareket (Ken Burns vb.) | Beklemede | [faz-3.md](./faz-3.md) |
| 4 | **Uygulama İçi Oynatıcı** | BookViewer'da read-along modu: ses + metin + motion birlikte | Beklemede | [faz-4.md](./faz-4.md) |
| 5 | **Video Export** | MP4 dosya üretimi, indirme, paylaşım | Beklemede | [faz-5.md](./faz-5.md) |

---

## Bağımlılık Akışı

```
Faz 1 → Faz 2 → Faz 3 → Faz 4 → Faz 5
```

Her faz bir öncekinin çıktısını kullanır. Faz 1 (araştırma) tamamlanmadan kod yazılmaz.

---

## Mevcut Altyapı

| Bileşen | Durum |
|---------|-------|
| TTS ses üretimi (Google Cloud) | Aktif |
| Sayfa görselleri (AI-üretilmiş) | Aktif |
| BookViewer | Aktif |
| Kelime bazlı zamanlama | Yok — Faz 2 |
| Karaoke render | Yok — Faz 3 |
| Video export | Yok — Faz 5 |

---

## Kapsam Dışı

- Generative video (Veo, Sora vb.)
- Kullanıcının kendi sesiyle okuma
- Gerçek zamanlı AR/kamera deneyimi
