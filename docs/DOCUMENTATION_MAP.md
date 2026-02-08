# 📋 KidStoryBook - Dokümantasyon Haritası

**Tarih:** 2 Şubat 2026  
**FAZ 1 Çıktısı:** Tüm MD dosyalarının kategorisi ve özeti  
**Amaç:** Hangi dokümanın nerede olduğunu, güncel mi eski mi olduğunu tek bakışta görmek

---

## 📌 Kategori Açıklamaları

| Kategori | Açıklama |
|----------|----------|
| ✅ **AKTİF** | Güncel, sık kullanılan, referans alınan dokümanlar |
| 📝 **GÜNCELLENECEK** | Değerli ama kısaltılması/güncellenmesi gereken (PRD, ROADMAP, FEATURES, ARCHITECTURE) |
| ⏳ **ESKİ** | Tamamlanmış işlere ait veya tek seferlik analiz; archive'a taşınabilir |
| 🗑️ **GEREKSİZ** | Silinebilir veya başka dosyayla birleştirilebilir (şu an yok) |

---

## 📁 docs/ (Kök)

| Dosya | Kategori | Son Güncelleme | Özet |
|-------|----------|----------------|------|
| PRD.md | ✅ AKTİF | 2 Şubat 2026 | Ürün gereksinimleri (kısa, ~133 satır). Teknik detay: technical/PRD_TECHNICAL_DETAILS.md. |
| ROADMAP.md | ✅ AKTİF | 2 Şubat 2026 | Proje yol haritası (özet + docs/roadmap/ faz dosyalarına linkler). Detaylar roadmap/ altında. |
| FEATURES.md | ✅ AKTİF | 2 Şubat 2026 | Özellik listesi ve önceliklendirme. Kullanım rehberi + ROADMAP ilişkisi (FAZ 4). |
| ARCHITECTURE.md | ✅ AKTİF | 2 Şubat 2026 | Mimari kararlar. Proje yapısı, 29 API, Prompt/TTS/Currency/Cart/Image Edit/Multi-char (FAZ 5). |
| DOCUMENTATION.md | ✅ AKTİF | 7 Şubat 2026 | Dokümantasyon indeksi. |
| ROADMAP_CSV_README.md | ✅ AKTİF | - | roadmap.csv ve HTML viewer kullanım rehberi. |
| DOCUMENTATION_MAP.md | ✅ AKTİF | 7 Şubat 2026 | Bu dosya – doküman haritası. |
| COMPLETED_FEATURES.md | ✅ AKTİF | 2 Şubat 2026 | Tamamlanan özellikler changelog (PRD'den taşındı). |
| API_KEYS.md | ✅ AKTİF | - | API key'ler (gitignore'da – referans için .env.example). |

---

## 📁 docs/roadmap/

| Dosya | Kategori | Özet |
|-------|----------|------|
| PHASE_1_FOUNDATION.md | ✅ AKTİF | Faz 1: Temel altyapı (iş listesi). |
| PHASE_2_FRONTEND.md | ✅ AKTİF | Faz 2: Frontend (iş listesi). |
| PHASE_3_BACKEND_AI.md | ✅ AKTİF | Faz 3: Backend ve AI (iş listesi). |
| PHASE_4_ECOMMERCE.md | ✅ AKTİF | Faz 4: E-ticaret (iş listesi). |
| PHASE_5_LAUNCH.md | ✅ AKTİF | Faz 5: Polish ve lansman (iş listesi). |
| PHASE_6_PWA.md | ✅ AKTİF | Faz 6: PWA (iş listesi). |
| roadmap.csv | ✅ AKTİF | Faz dosyalarından üretilen CSV (npm run roadmap). |
| roadmap-viewer.html | ✅ AKTİF | HTML tablo görüntüleyici (Gizli). |
| V0_APP_PROMPT_GUIDE.md | ✅ AKTİF | v0.app prompt rehberi. |
| NOTLAR_VE_FIKIRLER.md | ✅ AKTİF | Notlar ve fikirler. |
| ILERLEME_TAKIBI.md | ✅ AKTİF | İlerleme takibi. |

---

## 📁 docs/ai/

| Dosya | Kategori | Özet |
|-------|----------|------|
| README.md | ✅ AKTİF | Klasör açıklaması (FAZ 6). |
| AI_STRATEGY.md | ✅ AKTİF | AI stratejisi ve prompt mühendisliği. |
| CHARACTER_CREATION_FLOW.md | ✅ AKTİF | Karakter oluşturma akışı (referans görsel + kullanıcı girdileri). |
| (AI_TOOLS_COMPARISON.md) | → archive/2026-q1/ai/ | FAZ 6 ile taşındı. |

---

## 📁 docs/analysis/

| Dosya | Kategori | Son Güncelleme | Özet |
|-------|----------|----------------|------|
| STORY_AND_IMAGE_AI_FLOW.md | ✅ AKTİF | 1 Şubat 2026 | Story ve Image AI request/response akışı. |
| CREATE_YOUR_OWN_FROM_EXAMPLE.md | ✅ AKTİF | - | Create Your Own from Example: akış, characterIds, kapak Vision. |
| DEBUG_QUALITY_IMPLEMENTATION_SUMMARY.md | ✅ AKTİF | 7 Şubat 2026 | Debug kalite butonları (admin, trace export). |
| STORY_PROMPT_ACTION_PLAN.md | ✅ AKTİF | 7 Şubat 2026 | Hikaye + görsel kalite aksiyon planı. |
| (7 dosya) | → archive/2026-02/analysis/ | 7 Şubat 2026 | CHATGPT_STORY_REQUEST_REVIEW_PROMPT, CLOTHING_CONSISTENCY_ROOT_CAUSE_ANALYSIS, SYSTEM_REDESIGN_CLOTHING_CONSISTENCY, GPT_FOLLOWUP_AND_PLAN, GPT_ILLUSTRATION_AND_CINEMATIC_MESSAGE, GPT_TRACE_CEVAPLARI_AKSIYON, GPT_TRACE_QUESTIONS_2026-02-07. |

---

## 📁 docs/api/

| Dosya | Kategori | Son Güncelleme | Özet |
|-------|----------|----------------|------|
| API_DOCUMENTATION.md | ✅ AKTİF | - | API endpoint'leri ve kullanım. |
| POSTMAN_COLLECTION.md | ✅ AKTİF | - | Postman collection kullanımı. |
| TESTING_CHECKLIST.md | ✅ AKTİF | - | API test kontrol listesi. |

---

## 📁 docs/archive/

| Not | İçerik |
|-----|--------|
| README.md | Arşiv yapısı (FAZ 6). |
| 2026-02/analysis/ | 7 Şubat 2026: analysis’ten taşınan 7 dosya (GPT trace, clothing, ChatGPT prompt, vb.). |
| 2026-q1/ | FAZ 6 ile taşınan 17 dosya: implementation (4), guides (7), reports (3), strategies (2), ai (1). |
| (kök) | 13 dosya: FAZ1 test/checklist/raporlar, sahne/kıyafet analizleri, UNIFIED_ANALYSIS, vb. |

---

## 📁 docs/database/

| Dosya | Kategori | Özet |
|-------|----------|------|
| SCHEMA.md | ✅ AKTİF | Veritabanı şeması, RLS, storage bucket'ları. |

---

## 📁 docs/guides/ (27 dosya)

| Dosya | Kategori | Son Güncelleme | Özet |
|-------|----------|----------------|------|
| CODE_COMMENT_STANDARDS.md | ✅ AKTİF | 2 Şubat 2026 | Kod yorum standardı (JSDoc, TODO→ROADMAP) – FAZ 7. |
| LOGGING_GUIDE.md | ✅ AKTİF | 2 Şubat 2026 | Logger kullanımı, env (NODE_ENV, NEXT_PUBLIC_ENABLE_LOGGING, DEBUG_LOGGING) – FAZ 8. |
| ENVIRONMENT_SETUP.md | ✅ AKTİF | 4 Ocak 2026 | Environment variables kurulumu. |
| API_TESTING_GUIDE.md | ✅ AKTİF | - | API test rehberi (Postman). |
| SUPABASE_MIGRATION_GUIDE.md | ✅ AKTİF | 10 Ocak 2026 | Supabase migration uygulama. |
| SUPABASE_TEST_GUIDE.md | ✅ AKTİF | - | Supabase test rehberi. |
| MIGRATION_ORDER_GUIDE.md | ✅ AKTİF | 10 Ocak 2026 | Migration sırası. |
| AUTHENTICATION_ISSUES.md | ✅ AKTİF | 10 Ocak 2026 | Auth sorunları ve geçici çözümler. |
| PDF_GENERATION_GUIDE.md | ✅ AKTİF | 25 Ocak 2026 | PDF üretimi (A4, double-page). |
| PDF_GENERATION_TEST_GUIDE.md | ✅ AKTİF | 17 Ocak 2026 | PDF test rehberi. |
| SUPABASE_PDFS_BUCKET_SETUP.md | ✅ AKTİF | 17 Ocak 2026 | PDFs bucket kurulumu. |
| IMAGE_EDIT_FEATURE_GUIDE.md | ✅ AKTİF | - | Image edit (mask-based) rehberi. |
| CURRENCY_DETECTION.md | ✅ AKTİF | - | Para birimi tespiti. |
| STEP6_PAY_AND_GUEST_FREE_COVER_SPEC.md | ✅ AKTİF | - | Step 6 ödeme + misafir ücretsiz kapak spec. |
| BOOK_VIEWER_IMPROVEMENTS_GUIDE.md | ⏳ ESKİ | 12 Ocak 2026 | Kitap görüntüleyici iyileştirmeleri – tamamlandı, archive'a taşınabilir. |
| COLOR_PALETTE.md | ✅ AKTİF | - | Renk paleti. |
| V0_APP_WORKFLOW.md | ✅ AKTİF | - | v0.app kullanım akışı. |
| PRICING_PAGE_V0_PROMPT.md | ✅ AKTİF | 25 Ocak 2026 | Pricing sayfası v0 prompt. |
| EXAMPLES_PAGE_README.md | ✅ AKTİF | 25 Ocak 2026 | Examples sayfası tasarım. |
| EXAMPLES_PAGE_V0_PROMPT.md | ✅ AKTİF | 25 Ocak 2026 | Examples sayfası v0 prompt. |
| SALES_AND_CART_TESTING_GUIDE.md | ✅ AKTİF | 26 Ocak 2026 | Sepet ve satış test planı. |
| HERO_YOUR_CHILD_THE_HERO_IMAGES_ANALYSIS.md | ✅ AKTİF | 27 Ocak 2026 | Hero "Your Child The Hero" görselleri. |
| HERO_TRANSFORMATION_CORNER_ARTIFACTS_ANALYSIS.md | ✅ AKTİF | 27 Ocak 2026 | Hero köşe artefakt analizi. |
| PROMPT_OPTIMIZATION_GUIDE.md | ✅ AKTİF | 18 Ocak 2026 | Prompt iyileştirme rehberi. |
| ANATOMICAL_PROMPT_IMPROVEMENTS_GUIDE.md | ✅ AKTİF | 18 Ocak 2026 | Anatomik prompt iyileştirmeleri. |
| CHATGPT_IMAGE_TEST_PROMPTS.md | ⏳ ESKİ | - | Test prompt'ları – referans için archive'a taşınabilir. |
| WIZARD_TEST_FLOW.md | ⏳ ESKİ | - | Wizard test akışı – tek seferlik test dokümanı. |
| PRICING_PAGE_ANALYSIS.md | ⏳ ESKİ | 25 Ocak 2026 | Fiyatlandırma sayfası analizi – tamamlandı, archive'a taşınabilir. |
| IMAGE_API_REFACTOR_ANALYSIS.md | ⏳ ESKİ | 24 Ocak 2026 | Image API refactor – uygulandı (v1.7.0), archive'a taşınabilir. |
| STORY_API_REFACTOR_RECOMMENDATIONS.md | ⏳ ESKİ | 24 Ocak 2026 | Story API refactor – uygulandı (v1.4.0), archive'a taşınabilir. |
| KAPAK_BOS_KARAKTER_ODAKLI_ANALIZ.md | ⏳ ESKİ | 24 Ocak 2026 | Kapak/boş karakter analizi – tek seferlik, archive'a taşınabilir. |

---

## 📁 docs/implementation/ (6 dosya)

| Dosya | Kategori | Son Güncelleme | Özet |
|-------|----------|----------------|------|
| FAZ3_IMPLEMENTATION.md | ✅ AKTİF | 25 Ocak 2026 | Faz 3 implementasyon takibi – MVP hazır. |
| FAZ4_4_5_IMPLEMENTATION.md | ✅ AKTİF | 27 Ocak 2026 | Faz 4/5 implementasyon – tamamlandı. |
| IMAGE_QUALITY_IMPROVEMENT_PLAN.md | ✅ AKTİF | 31 Ocak 2026 | Görsel kalite iyileştirme planı (Faz 1–2 tamamlandı). |
| FAZ1_IMPLEMENTATION.md | ⏳ ESKİ | 4 Ocak 2026 | Faz 1 takibi – tamamlandı, archive'a taşınabilir. |
| FAZ2_IMPLEMENTATION.md | ⏳ ESKİ | 27 Ocak 2026 | Faz 2 takibi – çok uzun, büyük oranda tamamlandı, archive'a taşınabilir. |
| FAZ2_4_KARAKTER_GRUPLAMA_IMPLEMENTATION.md | ⏳ ESKİ | 25 Ocak 2026 | Karakter gruplama – tamamlandı, archive'a taşınabilir. |
| FAZ3_PDF_GENERATION_PLAN.md | ⏳ ESKİ | 10 Ocak 2026 | PDF generation planı – uygulandı, archive'a taşınabilir. |

---

## 📁 docs/plans/

| Dosya | Kategori | Özet |
|-------|----------|------|
| README.md | ✅ AKTİF | Plans klasörü açıklaması. |

---

## 📁 docs/prompts/

| Dosya | Kategori | Özet |
|-------|----------|------|
| STORY_PROMPT_TEMPLATE.md | ✅ AKTİF | Hikaye prompt şablonu (kod ile senkron). |
| IMAGE_PROMPT_TEMPLATE.md | ✅ AKTİF | Görsel prompt şablonu (kod ile senkron). |
| HERO_TRANSFORMATION_PROMPTS.md | ✅ AKTİF | Hero "Your Child, The Hero" sahne prompt örnekleri (FAZ 9; eskiden scripts/hero-transformation-prompts.txt). |

---

## 📁 docs/research/

| Dosya | Kategori | Özet |
|-------|----------|------|
| README.md | ✅ AKTİF | Araştırma klasörü açıklaması (FAZ 9). |
| GPT_ANATOMICAL_RESEARCH.md | ✅ AKTİF | GPT-4 Vision / DALL·E parmak/anatomik hata araştırması ve çözümleri (FAZ 9; eskiden gpt-arastirma.txt). |

---

## 📁 docs/reports/ (7 dosya)

| Dosya | Kategori | Son Güncelleme | Özet |
|-------|----------|----------------|------|
| MULTI_CHARACTER_FEATURE_SUMMARY.md | ✅ AKTİF | 25 Ocak 2026 | Multi-character özellik özeti. |
| QUALITY_AND_CONSISTENCY_ANALYSIS.md | ✅ AKTİF | 31 Ocak 2026 | Kalite ve tutarlılık analizi. |
| PAYMENT_FLOW_UX_ANALYSIS.md | ✅ AKTİF | 26 Ocak 2026 | Ödeme akışı UX analizi. |
| SALES_AND_CART_STRATEGY_ANALYSIS.md | ✅ AKTİF | 26 Ocak 2026 | Sepet/satış strateji analizi. |
| IMAGE_QUALITY_ANALYSIS.md | ✅ AKTİF | 15 Ocak 2026 | Görsel kalite analizi. |
| CURRENT_STATUS_ANALYSIS.md | ⏳ ESKİ | 10 Ocak 2026 | Eski durum analizi – güncel değil, archive'a taşınabilir. |
| MISSING_IMPLEMENTATIONS_ANALYSIS.md | ⏳ ESKİ | 15 Ocak 2026 | Eksik implementasyonlar – birçoğu tamamlandı, archive'a taşınabilir. |
| GPT_IMAGE_COVER_GENERATION_ERROR_ANALYSIS.md | ⏳ ESKİ | 10 Ocak 2026 | GPT-image hata analizi – verification sonrası referans için archive'a taşınabilir. |

---

## 📁 docs/strategies/ (10 dosya)

| Dosya | Kategori | Son Güncelleme | Özet |
|-------|----------|----------------|------|
| TTS_STRATEGY.md | ✅ AKTİF | 15 Ocak 2026 | TTS stratejisi ve gereksinimler. |
| CHARACTER_CONSISTENCY_STRATEGY.md | ✅ AKTİF | - | Master character, çoklu kitap tutarlılığı. |
| DEBUG_AND_FEATURE_FLAGS_ANALYSIS.md | ✅ AKTİF | 29 Ocak 2026 | Debug ve feature flags. |
| EXAMPLE_BOOKS_CUSTOM_REQUESTS.md | ✅ AKTİF | 31 Ocak 2026 | Example books özel istekler analizi. |
| EXAMPLES_REAL_BOOKS_AND_CREATE_YOUR_OWN.md | ✅ AKTİF | 30 Ocak 2026 | Examples sayfası stratejisi. |
| B2B_FEATURE_ANALYSIS.md | ✅ AKTİF | - | B2B özellik analizi. |
| EBOOK_VIEWER_STRATEGY.md | ✅ AKTİF | - | E-book viewer stratejisi. |
| GIT_STRATEGY.md | ✅ AKTİF | - | Git branching stratejisi. |
| STEP_1_2_MERGE_STRATEGY.md | ⏳ ESKİ | 25 Ocak 2026 | Step 1–2 merge – implementasyon başladı/tamamlandı, archive'a taşınabilir. |
| CHARACTER_CONSISTENCY_IMPROVEMENT.md | ⏳ ESKİ | 10 Ocak 2026 | Eski karakter tutarlılığı iyileştirme – CHARACTER_CONSISTENCY_STRATEGY güncel, archive'a taşınabilir. |

---

## 📁 docs/technical/ (4 dosya)

| Dosya | Kategori | Özet |
|-------|----------|------|
| TECHNICAL_DECISIONS.md | ✅ AKTİF | Next.js, Supabase vb. teknik kararlar. |
| PRD_TECHNICAL_DETAILS.md | ✅ AKTİF | 2 Şubat 2026 | PRD Bölüm 3 detayı (AI, E-Book, performans, güvenlik, debug). |
| TECHNICAL_RESEARCH.md | ✅ AKTİF | Teknik araştırma. |
| DATABASE_COMPARISON.md | ✅ AKTİF | Veritabanı karşılaştırması. |
| PLATFORM_EXPLANATION.md | ✅ AKTİF | Platform açıklamaları. |

---

## 📁 Diğer klasörlerdeki MD dosyaları

| Dosya | Kategori | Özet |
|-------|----------|------|
| README.md (root) | 📝 GÜNCELLENECEK | Proje ana README – FAZ 10'da güncellenecek. |
| CLEANUP_PLAN.md (root) | ✅ AKTİF | Temizlik planı – iş bitince silinecek/archive'a taşınacak. |
| scripts/README.md | ✅ AKTİF | Script'ler rehberi. |
| supabase/README.md | ✅ AKTİF | Supabase kurulum. |
| supabase/migrations/README.md | ✅ AKTİF | Migration rehberi. |
| public/pdf-backgrounds/README.md | ✅ AKTİF | PDF arka planları. |
| tests/api/README.md | ✅ AKTİF | API test senaryoları. |

---

## 📊 Özet İstatistikler

| Kategori | Dosya Sayısı (docs/ dahil tüm MD) |
|----------|------------------------------------|
| ✅ AKTİF | ~55 |
| 📝 GÜNCELLENECEK | 5 (PRD, ROADMAP, FEATURES, ARCHITECTURE, README) |
| ⏳ ESKİ (archive'da) | archive/2026-q1, 2026-02 (archive/ARCHIVE_LIST.md'de detay) |
| 🗑️ GEREKSİZ | 0 |

---

**Son Güncelleme:** 7 Şubat 2026  
**Oluşturan:** FAZ 1 - Dokümantasyon Analizi
