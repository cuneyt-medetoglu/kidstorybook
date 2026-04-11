# Faz 3 — Karaoke Metin & Görsel Motion

**Durum:** Beklemede  
**Bağımlılık:** Faz 2 (zamanlama verisi)  
**Çıktı:** Karaoke overlay bileşeni + görsel motion şablonları

---

## Amaç

İki şeyi birlikte oluşturmak:
1. **Karaoke metin:** Sesle senkron vurgulanan kelime/kelime grupları
2. **Görsel motion:** Statik illüstrasyonlara hafif hareket (Ken Burns, zoom, pan)

---

## Yapılacaklar

### 1. Karaoke Metin Overlay

- Metin konumu: alt bant (görselin altı %15–20), yarı saydam backdrop
- Vurgulama: aktif grup highlight, diğerleri soluk
- Animasyon: yumuşak fade/geçiş (yanıp sönme yok)
- Yaş profilleri:

| Yaş | Font | Grup boyutu | Hız |
|-----|------|-------------|-----|
| 3–5 | 28–32px | 1–2 kelime | Yavaş |
| 5–8 | 22–26px | 2–3 kelime | Normal |
| 8–10 | 18–22px | 3–4 kelime | Normal+ |

### 2. Görsel Motion Şablonları

| Şablon | Efekt | Ne zaman |
|--------|-------|----------|
| Ken Burns | Yavaş zoom-in + hafif pan | Varsayılan |
| Slow Pan | Soldan sağa yavaş kayma | Geniş manzara görselleri |
| Gentle Pulse | Çok hafif nefes efekti | Yakın çekim / portre |
| Fade Transition | Sayfalar arası yumuşak geçiş | Her sayfa geçişinde |

Motion parametreleri:
- Süre = sayfa TTS süresi
- Ölçek değişimi: %5–12 (fark edilir ama rahatsız etmez)
- Easing: ease-in-out

### 3. Katman Yapısı

```
┌──────────────────────────┐
│  Görsel (motion)         │  alt katman
│  ┌────────────────────┐  │
│  │ Karaoke metin      │  │  overlay
│  │ (backdrop + text)   │  │
│  └────────────────────┘  │
└──────────────────────────┘
        + TTS ses               arka plan
```

### 4. Senkronizasyon

Tek kaynak: `audio.currentTime`
- → Aktif metin chunk'ı belirler
- → Motion progress'i belirler (0–1)
- Tüm katmanlar aynı zaman kaynağından beslenir

---

## Çıktı

- `KaraokeOverlay` bileşeni
- Motion şablon tanımları ve engine
- Yaş profili config dosyası
- Prototip: tek sayfa üzerinde çalışan karaoke + motion demo
