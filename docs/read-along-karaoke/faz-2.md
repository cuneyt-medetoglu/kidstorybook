# Faz 2 — Audio–Metin Senkronizasyonu

**Durum:** Tamamlandı  
**Tarih:** 2026-04-11

---

## Amaç

TTS ile üretilmiş ses dosyalarından **kelime bazlı zaman damgaları** elde etmek ve saklamak.

---

## Ne Yapıldı

### 1. Tip Tanımları — `lib/read-along/types.ts`

```typescript
WordTiming    { text, startMs, endMs }
TextChunk     { words[], displayText, startMs, endMs }
PageTimeline  { pageNumber, totalDurationMs, words[], chunks[] }
```

### 2. Heuristik Timeline — `lib/read-along/timeline-heuristic.ts`

Sıfır bağımlılıkla çalışan karakter ağırlıklı zamanlama:
- Uzun kelimeye daha fazla süre, kısa kelimeye daha az
- Noktalama sonrası doğal duraklama (`.` → 350ms, `,` → 150ms, `?` → 300ms vb.)
- Toplam süre ses süresine normalize edilir
- Mevcut `useTTS.ts`'teki eşit bölmeden belirgin şekilde iyi

### 3. Whisper Entegrasyonu — `scripts/whisper-align.py` + `lib/read-along/timeline-whisper.ts`

- Python script: `openai-whisper` ile `word_timestamps=True` → kelime bazlı JSON çıktı
- Node.js wrapper: ses dosyasını temp'e indir → Python child process → JSON parse
- Otomatik availability check: Whisper yoksa sessizce heuristiğe düşer
- EC2'de `pip install openai-whisper` ile aktive edilir

### 4. Metin Gruplama — `lib/read-along/chunker.ts`

Kelime timeline'ından karaoke chunk'ları oluşturma:
- Hedef boyut: yaş grubuna göre 2–4 kelime
- Cümle sonu (`.!?`) ve virgülde doğal kırılma
- 200ms+ boşluk olan yerlerde otomatik kesme

### 5. Timeline Orchestrator — `lib/read-along/timeline.ts`

- Strateji seçici: Whisper varsa → Whisper, yoksa → heuristik
- S3 cache: `tts-cache/{hash}_timeline.json` olarak saklar
- Cache hit'te yeniden üretim yok

### 6. API Endpoint — `POST /api/read-along/timeline`

```json
// İstek
{ "text": "Bir varmış bir yokmuş...", "audioUrl": "https://...", "language": "tr", "pageNumber": 1 }

// Yanıt
{ "timeline": { "pageNumber": 1, "totalDurationMs": 4500, "words": [...], "chunks": [...] }, "strategy": "heuristic", "cached": false }
```

---

## Dosya Haritası

```
lib/read-along/
  types.ts                 — Tip tanımları
  timeline-heuristic.ts    — Karakter ağırlıklı heuristik
  timeline-whisper.ts      — Whisper Node.js wrapper
  timeline.ts              — Orchestrator (strateji + cache)
  chunker.ts               — Kelime → karaoke chunk gruplama

scripts/
  whisper-align.py         — Whisper Python alignment script

app/api/read-along/
  timeline/route.ts        — Timeline API endpoint
```

---

## Sonraki Adım

**Faz 3:** Bu timeline verisini kullanan karaoke metin overlay + görsel motion bileşenleri.
