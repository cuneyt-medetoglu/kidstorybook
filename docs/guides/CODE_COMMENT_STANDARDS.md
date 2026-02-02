# 📝 Kod Yorum Standardı

**Tarih:** 2 Şubat 2026  
**Amaç:** Tutarlı JSDoc ve satır içi yorumlar; TODO'ların ROADMAP ile eşleşmesi.

---

## 1. JSDoc (Fonksiyon / API route)

### Genel şablon

```typescript
/**
 * Kısa açıklama (bir cümle).
 *
 * @param param1 - Açıklama
 * @param param2 - Açıklama (opsiyonel)
 * @returns Dönüş değeri açıklaması
 *
 * @example
 * const result = myFunction('value')
 */
```

### API route dosyaları

- Dosyanın en üstünde route’un amacı: **POST/GET ne yapar, hangi body/query beklenir.**
- Karmaşık bloklarda kısa satır içi yorum (neden yapıldığı).

Örnek:

```typescript
/**
 * POST /api/books/purchase-from-draft
 * Taslak kitabı satın alma (ödeme Faz 4.1/4.2'de; şu an mock).
 * Body: { draftId, planType: "10"|"15"|"20" }
 */
```

---

## 2. Satır içi yorumlar

- **Neden** yazıldığını açıkla; **ne** yaptığını değil (kod zaten gösteriyor).
- Türkçe veya İngilizce tutarlı kullan.
- ROADMAP referansı: ileride yapılacak iş için `// ROADMAP: Faz X.Y.Z` veya `// ROADMAP: 4.3.6 Email bildirimleri`.

---

## 3. TODO / FIXME / HACK

- **TODO:** İleride yapılacak → ROADMAP’te ilgili madde varsa `// ROADMAP: Faz X.Y` ile değiştir; yoksa ROADMAP’e ekle ve koddaki TODO’yu kaldır.
- **FIXME:** Bilinen hata → Mümkünse hemen düzelt; değilse ROADMAP veya issue’ya taşı.
- **HACK:** Geçici çözüm → Kısa açıklama bırak, ROADMAP’te kalıcı çözüm maddesi olsun.

Yeni TODO eklerken mutlaka ROADMAP maddesi veya NOTLAR_VE_FIKIRLER referansı ver.

---

## 4. Dosya başlığı (opsiyonel)

Karmaşık modüllerde dosyanın amacını tek cümleyle yaz:

```typescript
/**
 * @file Book CRUD ve PDF üretimi için veritabanı yardımcıları.
 */
```

---

## 5. Referanslar

- İş listesi: [ROADMAP.md](../ROADMAP.md), [docs/roadmap/](../roadmap/)
- TODO → ROADMAP eşlemesi: FAZ 7 sırasında güncellendi (CLEANUP_PLAN.md FAZ 7 çıktıları)
