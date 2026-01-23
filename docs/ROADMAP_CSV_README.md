# 📊 ROADMAP CSV Kullanım Rehberi

Bu dosya, `ROADMAP.md`'den otomatik oluşturulan `roadmap.csv` dosyasının kullanım rehberidir.

## 📁 Dosyalar

- **`roadmap.csv`** - Google Sheets'e import edilebilir CSV dosyası
- **`scripts/generate-roadmap-csv.js`** - CSV oluşturma script'i
- **`roadmap-viewer.html`** - HTML tablo görüntüleyici (filtreleme, sıralama, arama) - **Gizli (docs/ klasöründe)**

## 🚀 Kullanım

### 1. CSV Oluşturma

```bash
npm run roadmap
# veya
node scripts/generate-roadmap-csv.js
```

Bu komut CSV dosyasını `docs/roadmap.csv` olarak oluşturur/günceller.

### 2. HTML Viewer Kullanımı (Önerilen) ⭐

**Daha kolay ve hızlı! Excel açmaya gerek yok.**

1. `docs/roadmap-viewer.html` dosyasını tarayıcıda aç (dosya sisteminden doğrudan açabilirsin)
2. CSV dosyası otomatik yüklenir (aynı klasörde `roadmap.csv` varsa)
3. Veya "📁 CSV Yükle" butonuna tıklayarak manuel yükle
4. Filtreleme, sıralama ve arama yap!

**Özellikler:**
- ✅ CSV import (drag & drop veya dosya seçimi)
- ✅ Otomatik CSV yükleme (aynı klasörde `roadmap.csv` varsa)
- ✅ Filtreleme (Durum, Öncelik, Faz, Kategori)
- ✅ Sıralama (kolonlara tıklayarak)
- ✅ Arama (başlık ve notlarda)
- ✅ İstatistikler (toplam, tamamlanan, bekleyen)
- ✅ Renklendirme (Durum ve Öncelik bazlı)
- ✅ Responsive tasarım (mobil uyumlu)

**Güvenlik:** HTML viewer `docs/` klasöründe olduğu için son kullanıcılar erişemez. Sadece geliştiriciler için.

### 3. Google Sheets'e Import (Alternatif)

1. Google Sheets'i aç
2. **Dosya → İçe Aktar → Dosya yükle**
3. `roadmap.csv` dosyasını seç
4. **Ayırıcı:** Virgül (`,`) seç
5. **İçe aktarma konumu:** Yeni sayfa oluştur
6. **ID kolonunu metin olarak formatla** (tarih olarak algılanmaması için)
   - CSV'de ID kolonunun başında tab karakteri var (Excel/Google Sheets'te metin olarak algılanması için)
   - Eğer hala tarih olarak algılanıyorsa, ID kolonunu seçip "Metin" formatına çevir

### 4. Filtreleme ve Sıralama

#### HTML Viewer'da

HTML Viewer'da şu özellikler mevcut:
- **Filtreleme:** Durum, Öncelik, Faz, Kategori dropdown'ları
- **Arama:** Başlık ve Notlar kolonlarında arama
- **Sıralama:** Kolon başlıklarına tıklayarak sıralama (asc/desc)
- **İstatistikler:** Toplam, Tamamlanan, Bekleyen, Gösterilen sayıları
- **Renklendirme:** Durum ve Öncelik badge'leri

#### Google Sheets'te

Google Sheets'te şu filtreleri kullanabilirsin:

#### Durum Filtreleri
- **Tamamlandı** - Bitmiş işler
- **Bekliyor** - Yapılacak işler
- **Ertelendi** - Sonraya bırakılan işler
- **Draft** - Taslak fikirler

#### Öncelik Filtreleri
- **Kritik** - Acil işler
- **Önemli** - Önemli işler
- **Düşük** - Düşük öncelikli işler

#### Faz Filtreleri
- **Faz 1** - Temel Altyapı
- **Faz 2** - Frontend Geliştirme
- **Faz 3** - Backend ve AI Entegrasyonu
- **Faz 4** - E-ticaret ve Ödeme
- **Faz 5** - Polish ve Lansman
- **Faz 6** - Mobil Uygulama (PWA)

## 📋 CSV Kolonları

| Kolon | Açıklama | Örnek |
|-------|----------|-------|
| **ID** | İş numarası | `1.1.1`, `2.4.2`, `DRAFT-1` |
| **Faz** | Faz numarası | `1`, `2`, `3` |
| **Alt Faz** | Alt faz numarası | `1.1`, `2.4` |
| **Başlık** | İş başlığı | `Next.js 14 projesi oluştur` |
| **Durum** | İş durumu | `Tamamlandı`, `Bekliyor`, `Ertelendi`, `Draft` |
| **Öncelik** | Öncelik seviyesi | `Kritik`, `Önemli`, `Düşük` |
| **Kategori** | İş kategorisi | `İş`, `Fikir`, `Bug` |
| **Notlar** | Detaylı açıklama | `v0.app'den alındı ve entegre edildi` |
| **Tarih** | Tamamlanma/Ekleme tarihi | `2026-01-23` |
| **Link** | ROADMAP.md'deki anchor link | `#11-proje-kurulumu` |

## ✏️ Draft Fikirler Ekleme

Google Sheets'te yeni satır ekleyerek draft fikirler ekleyebilirsin:

1. En alta yeni satır ekle
2. **ID:** `DRAFT-1`, `DRAFT-2`, vb. (benzersiz olmalı)
3. **Faz:** Boş bırak veya ilgili faz numarası
4. **Alt Faz:** Boş bırak
5. **Başlık:** Fikir başlığı
6. **Durum:** `Draft`
7. **Öncelik:** `Kritik`, `Önemli`, `Düşük`
8. **Kategori:** `Fikir`
9. **Notlar:** Detaylı açıklama
10. **Tarih:** Eklenme tarihi (örn: `2026-01-23`)
11. **Link:** Boş bırak

## 🔄 Sync (Senkronizasyon)

### ROADMAP.md → CSV (Otomatik)
```bash
npm run roadmap
# veya
node scripts/generate-roadmap-csv.js
```

**Not:** CSV sadece `docs/` klasörüne yazılır (HTML Viewer aynı klasörde).

### CSV → ROADMAP.md (Manuel)
Şu an manuel yapılmalı. Gelecekte otomatik sync script'i eklenebilir.

**Not:** CSV'deki değişiklikler (draft fikirler, durum güncellemeleri) ROADMAP.md'ye otomatik yansımaz. Manuel olarak ROADMAP.md'yi güncellemen gerekir.

## 📊 Örnek Filtreler

### Sadece Bekleyen Kritik İşler
```
Durum = "Bekliyor" AND Öncelik = "Kritik"
```

### Faz 2'deki Tamamlanan İşler
```
Faz = "2" AND Durum = "Tamamlandı"
```

### Draft Fikirler
```
Kategori = "Fikir" AND Durum = "Draft"
```

## 💡 İpuçları

1. **Filtreleri Kaydet:** Google Sheets'te filtreleri kaydedip hızlı erişim için kullanabilirsin
2. **Renklendirme:** Durum kolonuna göre renklendirme yap (Tamamlandı = yeşil, Bekliyor = sarı, vb.)
3. **Grafikler:** İlerleme grafikleri oluştur (Faz bazlı tamamlanma yüzdesi)
4. **Sıralama:** Öncelik ve Faz kolonlarına göre sıralama yap

## 🔧 Sorun Giderme

### CSV boş görünüyor
- Script'i tekrar çalıştır: `npm run roadmap`
- ROADMAP.md dosyasının doğru konumda olduğundan emin ol

### Linkler çalışmıyor
- Linkler ROADMAP.md'deki anchor linklerdir
- Google Sheets'te tıklanabilir değildir, manuel olarak ROADMAP.md'de arama yapmalısın

### Öncelik bilgileri yanlış
- Script, faz başlıklarından öncelik bilgisini çıkarır
- Eğer faz başlığında öncelik yoksa varsayılan "Önemli" kullanılır
- Manuel olarak Google Sheets'te düzeltebilirsin

## 📝 Notlar

- CSV dosyası her çalıştırmada yeniden oluşturulur (mevcut dosya üzerine yazılır)
- CSV sadece `docs/` klasörüne yazılır (güvenlik için `public/` klasöründe değil)
- HTML Viewer `docs/roadmap-viewer.html` dosyası olarak `docs/` klasöründe (son kullanıcılar erişemez)
- ID kolonunun başında tab karakteri var (Excel/Google Sheets'te tarih olarak algılanmaması için)
- Draft fikirler CSV'ye manuel eklenmelidir
- ROADMAP.md'deki değişiklikler CSV'ye otomatik yansımaz, script'i tekrar çalıştırman gerekir
- HTML Viewer aynı klasördeki `roadmap.csv` dosyasını otomatik yükler (sayfa açıldığında)
