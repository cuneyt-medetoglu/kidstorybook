# 🗺️ KidStoryBook - Proje Yol Haritası

**Versiyon:** 2.0  
**Tarih:** 2 Şubat 2026  
**Durum:** AKTİF – Modüler yapı (detaylar `docs/roadmap/` altında)

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Faz Dosyaları (Detaylı İş Listesi)](#faz-dosyaları-detaylı-iş-listesi)
3. [Yardımcı Dokümanlar](#yardımcı-dokümanlar)
4. [Güncel Durum Özeti](#güncel-durum-özeti)
5. [CSV ve Görüntüleyici](#csv-ve-görüntüleyici)

---

## 🎯 Genel Bakış

Proje **6 faz**da ilerliyor: Temel Altyapı → Frontend → Backend/AI → E-ticaret → Polish/Lansman → PWA.  
Tüm iş maddeleri, açıklamalar ve notlar **faz dosyalarında** tutulur; ana ROADMAP sadece özet ve yönlendirme içerir.

---

## 📂 Faz Dosyaları (Detaylı İş Listesi)

| Faz | Dosya | Açıklama |
|-----|-------|----------|
| **Faz 1** | [PHASE_1_FOUNDATION.md](roadmap/PHASE_1_FOUNDATION.md) | Temel altyapı (Next.js, Supabase, env) |
| **Faz 2** | [PHASE_2_FRONTEND.md](roadmap/PHASE_2_FRONTEND.md) | Frontend (layout, ana sayfa, auth, wizard, e-book viewer, dashboard, statik sayfalar) |
| **Faz 3** | [PHASE_3_BACKEND_AI.md](roadmap/PHASE_3_BACKEND_AI.md) | Backend ve AI (API, karakterler, kitaplar, PDF, webhook) |
| **Faz 4** | [PHASE_4_ECOMMERCE.md](roadmap/PHASE_4_ECOMMERCE.md) | E-ticaret ve ödeme (Stripe, İyzico, sipariş, fiyatlandırma) |
| **Faz 5** | [PHASE_5_LAUNCH.md](roadmap/PHASE_5_LAUNCH.md) | Polish ve lansman (SEO, analytics, güvenlik, test, deployment, admin, PDF) |
| **Faz 6** | [PHASE_6_PWA.md](roadmap/PHASE_6_PWA.md) | Mobil uygulama (PWA, Android TWA, iOS) |

---

## 📄 Yardımcı Dokümanlar

- **[V0_APP_PROMPT_GUIDE.md](roadmap/V0_APP_PROMPT_GUIDE.md)** – v0.app prompt rehberi  
- **[NOTLAR_VE_FIKIRLER.md](roadmap/NOTLAR_VE_FIKIRLER.md)** – Notlar ve fikirler  
- **[ILERLEME_TAKIBI.md](roadmap/ILERLEME_TAKIBI.md)** – İlerleme takibi

---

## 📊 Güncel Durum Özeti

- **Faz 1:** ✅ Tamamlandı (proje kurulumu, Supabase, env)  
- **Faz 2:** 🟡 Büyük oranda tamamlandı (layout, ana sayfa, auth, wizard, e-book viewer, dashboard); statik sayfalar ve birkaç iyileştirme açık  
- **Faz 3:** 🟡 Büyük oranda tamamlandı (API, AI, kitaplar, PDF); webhook ve bazı iyileştirmeler açık  
- **Faz 4:** ⬜ Bekliyor (Stripe, İyzico, sipariş, fiyatlandırma)  
- **Faz 5:** ⬜ Kısmen (PDF tasarım iyileştirmeleri yapıldı); SEO, analytics, admin, lansman açık  
- **Faz 6:** ⬜ Bekliyor (PWA, mağaza yayını)

Detaylı görev listesi ve checkbox’lar için ilgili **faz dosyasına** bakın.

---

## 📁 CSV ve Görüntüleyici

- **roadmap.csv** ve **roadmap-viewer.html** artık `docs/roadmap/` klasöründe.  
- CSV, faz dosyalarından otomatik üretilir: `npm run roadmap`  
- Kullanım: [ROADMAP_CSV_README.md](ROADMAP_CSV_README.md)
