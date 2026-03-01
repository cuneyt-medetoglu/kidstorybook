# Pet Karakter Eklerken characters_gender_check Hatası – Kök Neden Analizi

**Tarih:** 2026-03-01  
**Konu:** Step 2'de 4. karakter olarak Köpek (Pet) eklenirken `characters_gender_check` constraint ihlali.  
**Durum:** ✅ Çözüm uygulandı (migration 021).

---

## 1. Gözlemlenen Hata

**Log:**
```
Error creating character: error: new row for relation "characters" violates check constraint "characters_gender_check"
...
detail: 'Failing row contains (..., Luna, 5, other, brown, brown, ...
constraint: 'characters_gender_check'
```

- **Akış:** Create → Step 2 → 4. karakter olarak Köpek (Luna) ekleniyor, foto yükleniyor, AI analiz yapılıyor, `/api/characters` POST ile kayıt deniyor.
- **Sonuç:** INSERT sırasında PostgreSQL `characters_gender_check` constraint’i ihlal ediyor; istek 500 dönüyor.

---

## 2. Kök Neden

### 2.1 Uygulama tarafı

- **Tip tanımı:** `lib/db/characters.ts` içinde `gender: 'boy' | 'girl' | 'other'` kullanılıyor.
- **API:** `app/api/characters/route.ts` içinde:
  - Sadece **Child** ve **Family Members** için cinsiyet düzeltmesi var (Mom→girl, Dad→boy vb.).
  - **Pets**, **Toys**, **Other** için böyle bir dal yok; bu yüzden `validatedGender` boş kalıyor veya AI’dan gelen değer kullanılıyor.
  - Pet/Toys için AI analiz veya fallback ile `gender: 'other'` atanıyor (satır 107, 148, 176–177, 198: `validatedGender || 'other'`).
- **Sonuç:** Pet (Luna) için INSERT’e giden değer **`gender = 'other'`**.

### 2.2 Veritabanı tarafı

- Hata mesajı: constraint adı **`characters_gender_check`**.
- Bu constraint büyük ihtimalle tablo ilk oluşturulurken sadece **çocuk** karakteri düşünülerek tanımlandı ve yalnızca **`'boy'`** ile **`'girl'`** kabul ediyor.
- Repo’daki `migrations/` içinde `characters` tablosunun ilk `CREATE TABLE` tanımı yok; tablo muhtemelen Supabase/ilk kurulumda oluşturuldu. Mevcut migration’lar bu constraint’i değiştirmiyor.
- **Dokümantasyon:** `docs/database/SCHEMA.md` içinde ise şu an şöyle yazıyor:
  ```sql
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('boy', 'girl', 'other')),
  ```
  Yani dokümanda **'other'** var; ancak **gerçek veritabanındaki** constraint büyük ihtimalle **'other' içermiyor**.

### 2.3 Özet

| Katman        | gender için izin verilenler | Pet (Luna) için gönderilen |
|---------------|-----------------------------|-----------------------------|
| Uygulama/API  | 'boy', 'girl', 'other'      | **'other'**                 |
| DB constraint | Muhtemelen sadece 'boy', 'girl' | **'other'** → **reddediliyor** |

**Kök neden:** Veritabanındaki `characters_gender_check` constraint’i **'other'** değerine izin vermiyor; uygulama ise Pet/Toys/Other için bilinçli olarak **'other'** gönderiyor. Bu uyumsuzluk INSERT’in constraint ihlali ile fail etmesine neden oluyor.

---

## 3. Neden Sadece 4. Karakterte (Köpek) Görünüyor?

- 1. karakter (Ela – Child): Frontend’den boy/girl gelir; constraint’i ihlal etmez.
- 2. karakter (Mom): API’de “Family Members → girl” düzeltmesi var; `gender = 'girl'` gider.
- 3. karakter (Dad): API’de “Family Members → boy” düzeltmesi var; `gender = 'boy'` gider.
- 4. karakter (Luna – Dog): **Pet** için cinsiyet düzeltmesi yok; AI/fallback **'other'** atıyor → DB reddediyor.

Yani hata, “4. karakter”den ziyade **ilk Pet (veya ilk Toys/Other)** eklendiği anda ortaya çıkıyor; sıra 4 olduğu için 4. karakterde görünüyor.

---

## 4. Olası Çözümler

### A) Veritabanı constraint’ini güncellemek (önerilen)

- Mevcut check constraint kaldırılır, **'other'** dahil edilerek yeniden eklenir.
- Böylece hem dokümantasyon hem uygulama hem DB aynı kurala gelir; Pet/Toys/Other için `gender = 'other'` kalabilir.
- **Araç:** Yeni bir migration (örn. `021_characters_gender_allow_other.sql`).

### B) Sadece uygulama tarafında Pet/Toys için gender’ı boy veya girl yapmak

- Pet/Toys/Other için INSERT öncesi `gender` zorla `'boy'` veya `'girl'` yapılır (örn. sabit `'girl'`).
- DB değişmez ama “cinsiyet” alanı bu tipler için anlamsız olduğundan semantik olarak yanıltıcı; ileride TTS/çeviri vb. bu alana bakarsa karışıklık çıkabilir.

---

## 5. Sonuç

- **Neden:** DB’deki `characters_gender_check` muhtemelen sadece `('boy','girl')` kabul ediyor; uygulama Pet için `'other'` gönderiyor.
- **Ne zaman:** İlk Pet (veya Toys/Other) karakteri kaydedilirken.
- **Önerilen çözüm:** Migration ile constraint’i `('boy','girl','other')` olacak şekilde güncellemek.

Onay verirseniz çözüm adımına (migration metni + gerekirse API tarafında netleştirme) geçebilirim.

**Uygulama (1 Mart 2026):** Migration `migrations/021_characters_gender_allow_other.sql` eklendi. Constraint `('boy','girl','other')` olacak şekilde güncelleniyor. Migration'ı veritabanında çalıştırmanız gerekir (örn. `psql -f migrations/021_characters_gender_allow_other.sql` veya mevcut migration akışınız).
