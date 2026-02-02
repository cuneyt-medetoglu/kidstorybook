# 🧹 KidStoryBook - Proje Temizlik ve Toparlama Planı

**Tarih:** 2 Şubat 2026  
**Durum:** PLANLAMA - Uygulamaya Hazır  
**Amaç:** Proje dokümantasyonunu anlaşılır hale getirmek, gereksiz bölümleri temizlemek, kod kalitesini artırmak

---

## 📊 Mevcut Durum Özeti

### Dokümantasyon
- **97 MD dosyası** (docs/ klasöründe)
- **PRD.md:** 762 satır (çok uzun!)
- **ROADMAP.md:** 2991 satır (çok uzun!)
- **FEATURES.md:** 348 satır (orta, güncellenebilir)
- **ARCHITECTURE.md:** 403 satır (eski olabilir)
- **DOCUMENTATION.md:** 330 satır (iyi durumda)

### Kod
- **69 TypeScript dosyası** (.ts)
- **67 TSX dosyası** (.tsx)
- **707 console.log kullanımı** (61 dosyada) ⚠️
- **17 dosyada TODO/FIXME** var
- **Yorum Oranı:** Genel olarak iyi (2508+ yorum satırı)

### Klasör Yapısı
- **docs/** → 10+ alt klasör (ai, analysis, api, archive, database, guides, implementation, plans, prompts, reports, strategies, technical)
- **archive/** → 13 dosya (iyi!)
- **public/** → Test görselleri ve örnek dosyalar
- **scripts/** → Bazı test script'leri

### Sorunlar
1. ❌ PRD ve ROADMAP çok uzun, anlaşılması zor
2. ❌ Console.log'lar production kodu kirleti yor
3. ❌ Dokümantasyon çok dağınık, hangi dokümanın güncel olduğu belli değil
4. ❌ FEATURES.md uzun zamandır güncellenmemiş
5. ❌ Bazı analiz ve rehber dosyaları archive'a taşınmalı
6. ❌ Test görselleri ve araştırma notları (gpt-arastirma.txt) düzenlenmeli

---

## 🎯 Hedefler

1. **PRD.md** → Maksimum 300 satır (mevcut 762 satırdan kısalt)
2. **ROADMAP.md** → Maksimum 1000 satır (mevcut 2991 satırdan kısalt) veya bölümlere ayır
3. **FEATURES.md** → Güncel duruma göre güncelle, ROADMAP ile ilişkisini netleştir
4. **ARCHITECTURE.md** → Son teknoloji stack'e göre güncelle
5. **docs/** → Gereksiz dosyaları archive'a taşı
6. **Kod** → Console.log'ları temizle, eksik yorumları ekle
7. **README.md** → Gerekirse güncelle ve sadeleştir

---

## 📋 10 FAZDA TEMİZLİK PLANI

### **FAZ 1: Dokümantasyon Analizi ve Mapping** 🔍 ✅ TAMAMLANDI (2 Şubat 2026)
**Süre:** ~  
**Hedef:** Tüm dokümanları kategorize et, hangilerinin güncel/eski/gereksiz olduğunu belirle

**Görevler:**
1. [x] Tüm MD dosyalarını listele ve son düzenleme tarihlerini kontrol et
2. [x] Her dokümanın içeriğini kısaca özetle
3. [x] Dokümanları kategorize et:
   - ✅ **AKTİF** (güncel, sık kullanılan)
   - ⏳ **ESKİ** (eski ama değerli, archive'a taşınacak)
   - 🗑️ **GEREKSİZ** (silinecek veya birleştirilecek)
   - 📝 **GÜNCELLENECEK** (değerli ama güncel değil)
4. [x] Dokümantasyon haritası oluştur (DOCUMENTATION_MAP.md)
5. [x] Archive edilecek dosyaların listesini çıkar

**Çıktılar:**
- `docs/DOCUMENTATION_MAP.md` (tüm dokümanların durumu) ✅
- `docs/ARCHIVE_LIST.md` (taşınacak 17 dosya) ✅

---

### **FAZ 2: PRD Kısaltma ve Yeniden Yapılandırma** 📄 ✅ TAMAMLANDI (2 Şubat 2026)
**Süre:** ~  
**Hedef:** PRD.md'yi 762 satırdan ~300 satıra indir

**Görevler:**
1. [x] PRD.md'yi oku ve ana bölümleri belirle
2. [x] Detaylı teknik bilgileri ayrı dosyaya taşı:
   - Teknik detaylar → `docs/technical/PRD_TECHNICAL_DETAILS.md` ✅
   - (AI detayları PRD_TECHNICAL_DETAILS içinde)
3. [x] PRD.md'de sadece özet kaldı: Executive Summary, Problem & Solution, Hedef Kitle, MVP Özellikleri (kısa), Teknik Özet, UX/KPI/Out of Scope/Riskler/Referanslar
4. [x] Version history kısaltıldı (son 5 major change + link)
5. [x] Gereksiz tekrarlar temizlendi
6. [x] Tamamlanan özellikler → `docs/COMPLETED_FEATURES.md` ✅

**Çıktılar:**
- `docs/PRD.md` (~133 satır) ✅
- `docs/technical/PRD_TECHNICAL_DETAILS.md` (teknik detaylar) ✅
- `docs/COMPLETED_FEATURES.md` (tamamlanan özellikler changelog) ✅

---

### **FAZ 3: ROADMAP Kısaltma ve Modülerleştirme** 🗺️
**Süre:** ~  
**Hedef:** ROADMAP.md'yi yönetilebilir hale getir (2991 satırdan kısalt)

**Görevler:**
1. [ ] ROADMAP.md'yi faz bazında ayrı dosyalara böl:
   - `docs/roadmap/PHASE_1_FOUNDATION.md`
   - `docs/roadmap/PHASE_2_FRONTEND.md`
   - `docs/roadmap/PHASE_3_BACKEND_AI.md`
   - `docs/roadmap/PHASE_4_ECOMMERCE.md`
   - `docs/roadmap/PHASE_5_LAUNCH.md`
   - `docs/roadmap/FUTURE_FEATURES.md`
2. [ ] Ana ROADMAP.md'de sadece:
   - Genel bakış (50 satır)
   - Faz listesi ve linkleri
   - Hızlı özet (checkbox listesi)
   - Son durum (hangi fazda olduğumuz)
3. [ ] Tamamlanan fazları archive'a taşı
4. [ ] "Gelecek Özellikler" bölümünü ayrı dosyaya taşı
5. [ ] roadmap.csv ve roadmap-viewer.html'i docs/roadmap/ altına taşı

**Çıktılar:**
- `ROADMAP.md` (max 500 satır, sadece özet)
- `docs/roadmap/` klasörü (faz dosyaları)
- `docs/roadmap/FUTURE_FEATURES.md`

---

### **FAZ 4: FEATURES Güncelleme ve Netleştirme** ✨ ✅ TAMAMLANDI (2 Şubat 2026)
**Süre:** ~  
**Hedef:** FEATURES.md'yi güncel hale getir, ROADMAP ile ilişkisini netleştir

**Görevler:**
1. [x] FEATURES.md'yi oku ve mevcut durumla karşılaştır
2. [x] Şu soruları yanıtla ve dokümana ekle:
   - **Ne için kullanılır?** → Özellik önceliklendirme ve planlama
   - **ROADMAP ile farkı?** → ROADMAP: ne yapılacak (tasks), FEATURES: neyin öncelikli olduğu (prioritization)
   - **Nasıl kullanılır?** → MVP kararlarında, özellik seçiminde
3. [x] Tamamlanan özellikleri işaretle (✅) ve tablolarda "Durum" kolonu eklendi
4. [x] Yeni eklenen özellikleri ekle (TTS, Multi-character, Currency Detection, Image Edit, Cart, 8 dil, Pet/oyuncak, Pricing)
5. [x] Öncelikleri güncelle (mevcut duruma göre)
6. [x] ROADMAP.md ve COMPLETED_FEATURES.md'ye link eklendi

**Çıktılar:**
- `FEATURES.md` (güncel, v2.0)
- Başına "Kullanım Rehberi" bölümü eklendi

---

### **FAZ 5: ARCHITECTURE Güncelleme** 🏗️ ✅ TAMAMLANDI (2 Şubat 2026)
**Süre:** ~  
**Hedef:** Mimari dokümanı son teknoloji stack'e göre güncelle

**Görevler:**
1. [x] ARCHITECTURE.md'yi oku
2. [x] Eski olan bölümleri güncelle:
   - Mevcut klasör yapısı (app/, components/, lib/) – güncel ağaç
   - API route'ları (29 endpoint) – gruplu tablo
   - Database schema – docs/database/SCHEMA.md referansı
   - Storage stratejisi (Supabase Storage) – aynen
   - Teknoloji stack (package.json versions)
3. [x] Yeni eklenen bölümler:
   - Prompt Management System (lib/prompts/)
   - TTS Architecture (api/tts, lib/prompts/tts)
   - Currency Detection (lib/currency.ts, api/currency)
   - Cart System (api/cart, app/cart, checkout components)
   - Image Edit Feature (api/ai/edit-image, revert-image, ImageEditModal)
   - Multi-character Support (characters tablosu, API, wizard)
4. [x] Mimari kararların gerekçeleri her bölümde "Gerekçe" altında eklendi
5. [ ] Diyagramlar (opsiyonel) – ertelendi

**Çıktılar:**
- `ARCHITECTURE.md` (güncel, 2 Şubat 2026)
- Opsiyonel: `docs/architecture/` (diyagramlar) – yapılmadı

---

### **FAZ 6: Docs Klasörü Temizliği** 🗂️ ✅ TAMAMLANDI (2 Şubat 2026)
**Süre:** ~  
**Hedef:** docs/ klasöründeki dosyaları organize et, gereksizleri archive'a taşı

**Görevler:**
1. [x] FAZ 1'deki ARCHIVE_LIST.md'yi kullanarak 17 dosyayı taşı (docs/archive/2026-q1/)
2. [x] implementation, guides, reports, strategies, ai klasörlerinden arşivlenecek dosyalar taşındı
3. [x] Her klasör için README.md eklendi (implementation, guides, reports, strategies, ai, archive, archive/2026-q1)
4. [x] DOCUMENTATION.md güncellendi (yeni yapı, archive/2026-q1 referansı)
5. [x] Archive alt klasörü oluşturuldu: docs/archive/2026-q1/ (implementation, guides, reports, strategies, ai)

**Çıktılar:**
- 17 dosya docs/archive/2026-q1/ altına taşındı
- implementation, guides, reports, strategies, ai, archive için README.md eklendi
- DOCUMENTATION.md ve ARCHIVE_LIST.md güncellendi
- Organize archive/ (2026-q1 ile tarih bazlı alt klasör)

---

### **FAZ 7: Kod Yorumları ve TODO Temizliği** 💻 ✅ TAMAMLANDI (2 Şubat 2026)
**Süre:** ~  
**Hedef:** Eksik yorumları ekle, TODO'ları organize et

**Görevler:**
1. [x] TODO/FIXME/HACK listelendi (22 eşleşme, 17 dosya)
2. [x] Her TODO için karar uygulandı:
   - ROADMAP referansı ile değiştirildi (örn. `// ROADMAP: 4.1 Stripe`) veya kaldırıldı
   - OAuth (login/register): Gerçek signInWithOAuth entegre edildi; placeholder kaldırıldı
3. [x] Yorum standardı: `docs/guides/CODE_COMMENT_STANDARDS.md` oluşturuldu
4. [x] Örnek JSDoc: generate-story route, lib/db/books.ts dosya başlığı güncellendi
5. [x] Tüm TODO/FIXME/HACK koddan temizlendi (ROADMAP yorumu veya uygulama ile değiştirildi)

**Çıktılar:**
- `docs/guides/CODE_COMMENT_STANDARDS.md` (yorum standardı)
- TODO'lar ROADMAP referansına dönüştürüldü; OAuth login/register gerçek entegrasyonla güncellendi

---

### **FAZ 8: Console.log ve Logging Yönetimi** 🧹 ✅ TAMAMLANDI (2 Şubat 2026)
**Süre:** ~  
**Hedef:** Console.log'ları merkezi bir logger ile yönet; development'ta açık, production'da kapalı (env flag ile açılabilir)

**📌 NOT (Kullanıcı talebi):** Env'de log açık/kapalı flag veya NODE_ENV ile kontrol tercih edildi; logger bu şekilde uygulandı.

**Görevler:**
1. [x] `.env.example` güncellendi: Logging bölümü (NEXT_PUBLIC_ENABLE_LOGGING, DEBUG_LOGGING açıklaması)
2. [x] console.log/warn/error listelendi (~702 kullanım, 60 dosya)
3. [x] Logger: `logger.info`/`debug` → development veya env flag; `logger.warn`/`error` → her zaman
4. [x] `lib/logger.ts` oluşturuldu (NODE_ENV + NEXT_PUBLIC_ENABLE_LOGGING client, DEBUG_LOGGING server)
5. [x] Örnek geçiş: `lib/config.ts`, `app/api/books/purchase-from-draft/route.ts` → logger kullanıyor
6. [x] `docs/guides/LOGGING_GUIDE.md` yazıldı (env, kullanım, kademeli geçiş)

**Çıktılar:**
- `lib/logger.ts` – merkezi logger (NODE_ENV + opsiyonel env flag)
- `.env.example` – Logging bölümü eklendi
- `docs/guides/LOGGING_GUIDE.md` – kullanım ve env rehberi
- Kalan console kullanımları kademeli olarak logger'a çevrilebilir (yeni kodda logger kullanın)

---

### **FAZ 9: Test ve Araştırma Dosyaları Organizasyonu** 🧪 ✅ TAMAMLANDI (2 Şubat 2026)
**Süre:** ~  
**Hedef:** Test görselleri ve araştırma notlarını düzenle

**Görevler:**
1. [x] `gpt-arastirma.txt` → `docs/research/GPT_ANATOMICAL_RESEARCH.md` olarak taşı ve formatla
2. [x] `scripts/hero-transformation-prompts.txt` → `docs/prompts/HERO_TRANSFORMATION_PROMPTS.md` olarak taşı
3. [x] `public/` klasöründeki test görsellerini organize et:
   - Test karakterler → `public/test-images/characters/` (boy/girl/arya fotoğrafları)
   - Örnek kitaplar → `public/test-images/books/` (children-s-book-cover-*)
   - Hero transformation → `public/hero-transformation/` (zaten var)
   - Dashboard ve examples referansları `/test-images/...` yollarına güncellendi
4. [x] `scripts/` klasörünü organize et:
   - Aktif script'ler → kaldı
   - `scripts/output/` oluşturuldu (README ile); hero-transformation varsayılanı `hero-transformation-output/` bırakıldı
   - `scripts/README.md` güncellendi (output klasörü, prompt listesi → docs/prompts)
5. [x] `.gitignore`'a eklendi: `scripts/output/` (script çıktıları; test görselleri repoda kalır)

**Çıktılar:**
- `docs/research/` klasörü (GPT_ANATOMICAL_RESEARCH.md, README.md)
- `docs/prompts/HERO_TRANSFORMATION_PROMPTS.md`
- `public/test-images/characters/`, `public/test-images/books/`
- `scripts/output/README.md`
- Güncel `.gitignore`

---

### **FAZ 10: README ve Ana Dokümantasyon Güncellemesi** 📖 ✅ TAMAMLANDI (2 Şubat 2026)
**Süre:** ~  
**Hedef:** README.md ve DOCUMENTATION.md'yi final güncelleme

**Görevler:**
1. [x] README.md'yi gözden geçir:
   - Proje tanımı ve özellikler güncellendi (TTS, Multi-character, Currency Detection, 8 dil)
   - Teknoloji stack güncel (Next.js 14, Supabase, GPT-image/DALL-E, TTS, Stripe/İyzico)
   - Kurulum adımları: port 3001, .env.example, ENVIRONMENT_SETUP linki
   - Proje yapısı güncel (app/, components/, lib/, docs/, scripts/, public/test-images)
   - Dokümantasyon linkleri: DOCUMENTATION.md, DOCUMENTATION_MAP.md, ROADMAP, PRD, FEATURES, ARCHITECTURE, guides
2. [x] README.md'ye eklendi:
   - Önemli özellikler (TTS, Multi-character, Currency Detection)
   - Quick start (gereksinimler, kurulum, localhost:3001)
   - Dokümantasyon yapısı tablosu (ne arıyorsanız → dosya)
3. [x] DOCUMENTATION.md güncellendi:
   - Son güncelleme tarihi (2 Şubat 2026)
   - Archive stratejisi notu (Dokümantasyon Kuralları altında)
   - Şubat 2026 FAZ 10 maddesi (Güncelleme bölümünde)
4. [x] Root `.cursorrules` gözden geçirildi ve güncellendi:
   - Proje yapısı (app/, components/, lib/, docs/, scripts/, .cursor/rules/)
   - Teknoloji stack (TTS, GPT-image)
   - Önemli dosyalar (ROADMAP, DOCUMENTATION_MAP, PRD, FEATURES, ARCHITECTURE, ENVIRONMENT_SETUP)
   - Logger kullanımı (lib/logger.ts, LOGGING_GUIDE)
5. [x] Son kontroller: README ve DOCUMENTATION linkleri mevcut dosyalara yönlendirildi; POC bölümü kaldırıldı (ana uygulama app/ ile çalışıyor)

**Çıktılar:**
- Güncel `README.md`
- Güncel `docs/DOCUMENTATION.md`
- Güncel `.cursorrules`

---

## 📊 Faz Öncelik Matrisi

| Faz | Öncelik | Etki | Zorluk | Tahmini Süre |
|-----|---------|------|--------|--------------|
| FAZ 1: Analiz | 🔴 Yüksek | Yüksek | Düşük | ~ |
| FAZ 2: PRD | 🔴 Yüksek | Yüksek | Orta | ~ |
| FAZ 3: ROADMAP | 🔴 Yüksek | Yüksek | Orta | ~ |
| FAZ 4: FEATURES | 🟡 Orta | Orta | Düşük | ~ |
| FAZ 5: ARCHITECTURE | 🟡 Orta | Orta | Orta | ~ |
| FAZ 6: Docs Temizlik | 🟡 Orta | Yüksek | Orta | ~ |
| FAZ 7: Kod Yorumları | 🟢 Düşük | Orta | Orta | ~ |
| FAZ 8: Console.log | 🔴 Yüksek | Yüksek | Düşük | ~ |
| FAZ 9: Test Dosyaları | 🟢 Düşük | Düşük | Düşük | ~ |
| FAZ 10: README | 🟡 Orta | Orta | Düşük | ~ |

**Önerilen Sıralama:**
1. FAZ 1 (Analiz) → Önce ne yapacağımızı belirle
2. FAZ 8 (Console.log) → Production için kritik
3. FAZ 2 (PRD) → En çok şikayet edilen
4. FAZ 3 (ROADMAP) → En çok şikayet edilen
5. FAZ 6 (Docs Temizlik) → Büyük etki
6. FAZ 4 (FEATURES) → ROADMAP ile ilişkili
7. FAZ 5 (ARCHITECTURE) → Teknik ekip için
8. FAZ 7 (Kod Yorumları) → Kod kalitesi
9. FAZ 9 (Test Dosyaları) → Düşük öncelik
10. FAZ 10 (README) → Final touches

---

## ✅ Başarı Kriterleri

### Dokümantasyon
- [ ] PRD.md max 300 satır
- [ ] ROADMAP.md max 500 satır (veya modüler)
- [ ] FEATURES.md güncel ve kullanım rehberi var
- [ ] ARCHITECTURE.md güncel
- [ ] docs/ klasöründe <70 aktif dosya (27 dosya archive'a taşınmış)
- [ ] Her alt klasörde README.md var

### Kod
- [ ] Console.log'lar koşullu veya kaldırılmış (<50 kalmalı)
- [ ] TODO'lar organize edilmiş (ROADMAP'te veya çözülmüş)
- [ ] Önemli dosyalarda JSDoc yorumları var
- [ ] Logger utility oluşturulmuş

### Organizasyon
- [ ] Test görselleri organize
- [ ] Araştırma notları docs/research/ klasöründe
- [ ] Archive klasörü tarih bazlı organize
- [ ] README.md güncel

---

## 🚨 Riskler ve Dikkat Edilmesi Gerekenler

1. **Git History:** Archive'a taşırken `git mv` kullan (history korunur)
2. **Linkler:** Dosya taşırken tüm linkleri güncelle
3. **Bağımlılıklar:** Bazı dokümanlar birbirine referans verebilir
4. **Yedek:** Her fazdan önce branch oluştur veya commit at
5. **Test:** Her fazdan sonra proje çalışıyor mu kontrol et
6. **Ekip:** Değişiklikleri ekiple paylaş (eğer ekip varsa)

---

## 📝 Notlar

- Bu plan proje durumuna göre esnek olmalı
- Her faz tamamlandıkça bu dosya güncellenebilir
- Öncelikler değişebilir
- Bazı fazlar paralel yapılabilir (örn: FAZ 7 ve FAZ 8)

---

## 🎯 Sonraki Adımlar

1. Bu planı kullanıcıyla gözden geçir
2. Öncelikleri onayla
3. FAZ 1'i başlat (Dokümantasyon Analizi)
4. Her faz bitince checkpoint oluştur
5. Son durumu README.md'ye yaz

---

**Plan Oluşturma Tarihi:** 2 Şubat 2026  
**Son Güncelleme:** 2 Şubat 2026  
**Durum:** PLANLAMA TAMAMLANDI - Onay Bekleniyor

---

## 📞 Sorular ve Cevaplar

**S: Tüm fazları yapmak zorunda mıyız?**  
C: Hayır, önceliklere göre seçim yapabilirsiniz. Önce FAZ 1 (Analiz) yapın, sonra hangilerinin daha kritik olduğuna karar verin.

**S: Bu işlem ne kadar sürer?**  
C: Tam olarak bilerek süre vermedik, çünkü kullanıcının ne kadar vakit ayıracağına bağlı. Ama her faz ayrı ayrı yapılabilir.

**S: Mevcut çalışan kodu bozar mı?**  
C: Hayır, sadece dokümantasyon ve console.log temizliği yapıyoruz. Kod mantığına dokunmuyoruz. Ama yine de her fazdan sonra test etmek iyi olur.

**S: Archive'a taşınan dosyaları silebilir miyiz?**  
C: Şimdilik archive'a taşıyın. 3-6 ay sonra eğer hiç kullanılmadıysa silebilirsiniz.

**S: ROADMAP.md'yi parçalara bölelim mi yoksa kısaltalım mı?**  
C: İkisini de yapabiliriz: Ana ROADMAP.md kısa özet olsun, detaylar docs/roadmap/ alt klasöründe olsun.

---

**Bu dokümanı tamamladıktan sonra silebilirsiniz (veya archive'a taşıyabilirsiniz).**
