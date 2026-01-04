# 📚 KidStoryBook - Dokümantasyon

Bu klasör projenin tüm dokümantasyonunu içerir.

---

## 📁 Klasör Yapısı

```
docs/
├── DOCUMENTATION.md             # Bu dosya - Dokümantasyon indeksi
├── ROADMAP.md                   # Ana proje planı ve iş listesi
├── PRD.md                       # Ürün gereksinimleri
├── FEATURES.md                  # Özellik listesi ve önceliklendirme
├── ARCHITECTURE.md              # Mimari kararlar ve yapı
│
├── implementation/              # İmplementasyon takip dosyaları (Faz bazlı)
│   ├── FAZ1_IMPLEMENTATION.md  # Faz 1 implementasyon takibi
│   ├── FAZ2_IMPLEMENTATION.md  # Faz 2 implementasyon takibi (gelecek)
│   └── ...
│
├── checklists/                 # Kontrol listeleri
│   ├── FAZ1_2_CHECKLIST.md     # Faz 1.2 kontrol listesi
│   └── ...
│
├── guides/                     # Rehberler ve talimatlar
│   ├── SUPABASE_TEST_GUIDE.md  # Supabase test rehberi
│   └── ...
│
├── reports/                    # Raporlar
│   ├── FAZ1_2_FINAL_REPORT.md  # Faz 1.2 final raporu
│   └── ...
│
├── strategies/                 # Strateji dokümanları
│   ├── GIT_STRATEGY.md         # Git branching stratejisi
│   └── ...
│
├── ai/                          # AI ile ilgili dokümanlar
│   ├── AI_STRATEGY.md           # AI prompt stratejisi
│   ├── AI_TOOLS_COMPARISON.md   # AI tool karşılaştırması (test sonuçları)
│   └── CHARACTER_CREATION_FLOW.md # Karakter oluşturma akışı
│
├── planning/                    # Planlama dokümanları
│   ├── FEATURE_NOTES.md         # Özellik notları
│   ├── POC_PLAN.md              # POC planı
│   ├── PROJECT_PLAN.md          # Proje planı
│   └── QUESTIONS_AND_DECISIONS.md
│
├── prompts/                     # AI prompt template'leri
│   ├── PROMPT_STORY.md          # Hikaye prompt template
│   ├── PROMPT_IMAGE.md          # Görsel prompt template
│   ├── PROMPT_FINAL.md          # Final birleştirilmiş prompt
│   └── ...
│
└── technical/                   # Teknik dokümanlar
    ├── TECHNICAL_DECISIONS.md   # Teknik kararlar (Next.js, Supabase, vb.)
    ├── TECHNICAL_RESEARCH.md    # Teknik araştırma
    ├── DATABASE_COMPARISON.md   # Veritabanı karşılaştırması
    └── PLATFORM_EXPLANATION.md  # Platform açıklamaları
```

### 📋 Ana Dosyalar (docs/ root)

**Sadece şu 5 dosya docs/ root'unda olmalı:**
1. **DOCUMENTATION.md** - Bu dosya (dokümantasyon indeksi)
2. **ROADMAP.md** - Ana proje planı ve iş listesi
3. **PRD.md** - Ürün gereksinimleri
4. **FEATURES.md** - Özellik listesi ve önceliklendirme
5. **ARCHITECTURE.md** - Mimari kararlar ve yapı

**Diğer tüm dosyalar alt klasörlerde:**
- `implementation/` - Faz bazlı implementasyon takibi
- `checklists/` - Kontrol listeleri
- `guides/` - Rehberler
- `reports/` - Raporlar
- `strategies/` - Strateji dokümanları

---

## 🎯 Önemli Dosyalar

### Başlamak İçin
1. **ROADMAP.md** - Tüm işlerin listesi, buradan takip et
2. **PRD.md** - Ürün gereksinimleri
3. **FEATURES.md** - Özellik listesi ve önceliklendirme

### Teknik Kararlar
1. **technical/TECHNICAL_DECISIONS.md** - Next.js 14, Supabase seçimleri
2. **technical/TECHNICAL_RESEARCH.md** - Detaylı teknik araştırma

### AI ve Prompt'lar
1. **ai/AI_STRATEGY.md** - AI stratejisi ve prompt engineering
2. **ai/AI_TOOLS_COMPARISON.md** - AI tool karşılaştırması ve test planı
3. **ai/CHARACTER_CREATION_FLOW.md** - Karakter oluşturma akışı (referans görsel + kullanıcı girdileri)
4. **prompts/** - Tüm prompt template'leri

---

## 📝 Dokümantasyon Kuralları

- Her dosya kendi klasöründe olmalı
- Süre/tahmin belirtilmemeli
- Sürekli güncellenmeli
- Türkçe yazılmalı (kod yorumları İngilizce olabilir)

---

## 🔄 Güncelleme

Dokümantasyon sürekli güncellenir. Son güncellemeler:
- **4 Ocak 2026:** 
  - Dokümantasyon yapısı yeniden düzenlendi
  - `implementation/` klasörü oluşturuldu (faz bazlı implementasyon takibi)
  - `checklists/`, `guides/`, `reports/`, `strategies/` klasörleri oluşturuldu
  - Geçici dosyalar uygun klasörlere taşındı
  - IMPLEMENTATION.md → `docs/implementation/FAZ1_IMPLEMENTATION.md` olarak taşındı
  - Faz 1.2: Supabase kurulumu dokümantasyonu eklendi
  - ARCHITECTURE.md oluşturuldu (mimari kararlar)
  - AI dokümanları `ai/` klasörüne taşındı
  - Ücretsiz kapak hakkı eklendi
  - OAuth girişleri eklendi
  - AI tool seçenekleri eklendi
  - Referans görsel sistemi eklendi

---

**Son Güncelleme:** 4 Ocak 2026

