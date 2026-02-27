# Kitap Oluşturma: Paralel İşleme Analizi

**Dosya:** `app/api/books/route.ts`  
**Tarih:** Şubat 2026

---

## Mevcut Akış

```
[1] Hikaye Metni Üretimi     → Sıralı  (OpenAI GPT-4o-mini)
         ↓
[2] Master Karakter Görseli  → Sıralı  (GPT-image-1 edits, karakter başına)
         ↓
[3] Kapak Görseli            → Sıralı  (GPT-image-1 edits)
         ↓
[4] Sayfa Görselleri         → ✅ Paralel Batch  (15'erli gruplar, batch arası 90s bekleme)
         ↓
[5] TTS Ses Dosyaları        → ❌ Sıralı  (sayfa sayfa, await ile for döngüsü)
```

**Tipik süre (10 sayfalı kitap):**
| Adım | Süre (tahmini) |
|------|---------------|
| Hikaye üretimi | ~15s |
| Master görseller (2 karakter) | ~20s |
| Kapak görseli | ~15s |
| Sayfa görselleri (10 sayfa, paralel) | ~60–90s |
| TTS ses (10 sayfa, **sıralı**) | ~30–50s |
| **Toplam** | **~2.5–3 dakika** |

---

## Sorun: TTS Sıralı Çalışıyor

`app/api/books/route.ts` — yaklaşık satır 2600:

```typescript
// ❌ MEVCUT: Sıralı
for (let i = 0; i < pages.length; i++) {
  await generateTts(text, { language: bookLanguage })
}
```

Her sayfa bir öncekinin bitmesini bekliyor. 10 sayfa için ~4–5s/sayfa = **~40–50s ekstra süre**.

---

## Çözüm Seçenekleri

### Seçenek A — Tam Paralel (Basit)

```typescript
// ✅ Tüm sayfalar aynı anda
await Promise.allSettled(
  pages.map((p) => generateTts(p.text, { language: bookLanguage }))
)
```

- **Avantaj:** En hızlı (~5s sabit)  
- **Risk:** Google TTS API rate limit aşılabilir (çok sayfa varsa)

---

### Seçenek B — Batch Paralel (Önerilen)

```typescript
// ✅ Görsel üretimiyle aynı pattern, daha güvenli
const TTS_BATCH_SIZE = 5

for (let i = 0; i < pages.length; i += TTS_BATCH_SIZE) {
  const batch = pages.slice(i, i + TTS_BATCH_SIZE)
  await Promise.allSettled(
    batch.map((p) => generateTts(p.text, { language: bookLanguage }))
  )
}
```

- **Avantaj:** Rate limit riski düşük, görsel batch mantığıyla tutarlı  
- **Tasarruf:** ~40–50s → ~10–15s (%70 azalma)

---

### Seçenek C — Görsellerle Eş Zamanlı TTS

```typescript
// ✅ En agresif optimizasyon
// Görsel üretimi ve TTS aynı anda başlar (her sayfa tamamlandıkça)
```

- **Avantaj:** TTS neredeyse sıfır ek süre ekler  
- **Risk:** Görsel üretim ve TTS API'leri aynı anda yük oluşturur  
- **Zorluk:** Mimari değişiklik gerektirir (event-based veya streaming)

---

## Öneri

**Seçenek B** — Batch Paralel TTS uygulanmalı.

- Minimal kod değişikliği (`for` döngüsü → batch `Promise.allSettled`)
- Mevcut görsel batch mantığıyla tutarlı
- Rate limit güvenli
- **~40s tasarruf** (10 sayfalı kitapta)

---

## Ek Not: S3 Cache Zaten Var

`lib/tts/generate.ts` — TTS sonuçları S3'te cache'leniyor.  
Aynı metin + dil kombinasyonu için ikinci istekte API çağrısı yapılmıyor.  
Batch paralel yapı bu cache mekanizmasıyla tam uyumlu çalışır.

---

## Uygulama Geçmişi

| Tarih | Değişiklik | Dosya |
|-------|-----------|-------|
| Şub 2026 | TTS sıralı `for` döngüsü → 5'erli batch `Promise.allSettled` | `app/api/books/route.ts` |
| Şub 2026 | Adım bazlı zamanlama değişkenleri (`storyMs`, `masterMs`, `coverMs`, `pageImagesMs`, `ttsMs`) | `app/api/books/route.ts` |
| Şub 2026 | Süreç sonunda `⏱️ TIMING SUMMARY` log bloğu eklendi | `app/api/books/route.ts` |
| Şub 2026 | TTS pipeline örtüştürme: story biter bitmez TTS arka planda başlatılıyor; masters/cover/sayfa görselleri ile aynı anda çalışıyor; response öncesi await. (Seçenek C benzeri.) Ref: CREATE_BOOK_TIMING_ANALYSIS.md | `app/api/books/route.ts` |
| Şub 2026 | Entity master’lar paralel: `Promise.allSettled(supportingEntities.map(...))` | `app/api/books/route.ts` |

**Log Örneği (beklenen çıktı):**
```
[Create Book] ━━━━━━ ⏱️  TIMING SUMMARY ━━━━━━
[Create Book]   📖 Story generation :    14.2s
[Create Book]   🎨 Master illust.   :    22.1s
[Create Book]   🖼️  Cover image      :    18.3s
[Create Book]   🗂️  Page images      :    75.4s  [parallel batch]
[Create Book]   🔊 TTS audio        :    11.2s  [parallel batch]
[Create Book]   ⚙️  Other/overhead   :     4.8s
[Create Book]   ──────────────────────────────
[Create Book]   🏁 TOTAL            :   146.0s
[Create Book] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Özet

| | Mevcut | Seçenek A | Seçenek B (Önerilen) | Seçenek C |
|---|---|---|---|---|
| TTS Süresi (10s) | ~45s | ~5s | ~10–15s | ~0s ek |
| Risk | — | Yüksek | Düşük | Orta |
| Değişiklik zorluğu | — | Kolay | Kolay | Zor |
