# KidStoryBook → herokidstory Marka/Proje Adı Değişikliği Analizi

**Hedef:** Tüm projede "KidStoryBook" / "kidstorybook" → **herokidstory** (ve gerektiğinde **HeroKidStory** marka görünümü).  
**Tarih:** 8 Mart 2026  
**Dosya:** `docs/analysis/BRAND_RENAME_KIDSTORYBOOK_TO_HEROKIDSTORY_ANALYSIS.md`

---

## 1. Özet

| Kategori | Eski | Yeni | Öncelik |
|----------|------|------|---------|
| Marka (UI/metin) | KidStoryBook | HeroKidStory (veya herokidstory) | Faz 2 |
| Repo / paket adı | kidstorybook | herokidstory | Faz 1 |
| Domain (varsayılan) | kidstorybook.com | herokidstory.com (veya mevcut domain) | Faz 1 |
| S3 bucket | kidstorybook | herokidstory (veya herokidstory-xxx) | Faz 1 |
| DB / kullanıcı adı | kidstorybook | herokidstory | Faz 1 |
| localStorage key prefix | kidstorybook_ | herokidstory_ | Faz 2 |
| Env / script / key dosyaları | kidstorybook | herokidstory | Faz 1–2 |

**Önemli:** S3 ve DB adı değişince **yeni kaynak oluşturup veri/erişim geçişi** gerekir; sadece kod değişikliği değil.

---

## 2. Fazlama (Öncelik Sırası)

### Faz 1 — Altyapı ve Dış Kaynaklar (Önce)

Yapılmadan kodda kalıcı değişiklik yapmak tutarsız olur.

| # | Öğe | Aksiyon | Not |
|---|-----|---------|-----|
| 1.1 | **GitHub repo** | Repo adını `herokidstory` yap veya yeni repo aç + local remote güncelle | Clone URL, package.json repository/homepage/issues |
| 1.2 | **Domain** | Varsayılan domain: `herokidstory.com` (veya karar verilen domain) | DNS, SSL, NEXT_PUBLIC_APP_URL |
| 1.3 | **S3 bucket** | Yeni bucket: `herokidstory` (veya `herokidstory-xxx`); policy/IAM aynı mantık | Mevcut bucket'tan veri kopyalama gerekebilir; next.config.js hostname |
| 1.4 | **PostgreSQL** | Yeni DB: `herokidstory`, kullanıcı: `herokidstory` (veya migration ile rename) | Backup → create new / rename → restore; DATABASE_URL, backup script |
| 1.5 | **Env / EC2 / key dosyaları** | `.env`, `.env.example`, EC2'deki env, `herokidstory-key.pem`, Google credentials adı | GOOGLE_APPLICATION_CREDENTIALS=./herokidstory-credentials.json vb. |

### Faz 2 — Kod ve Uygulama

| # | Öğe | Dosya/yer | Not |
|---|-----|-----------|-----|
| 2.1 | **package.json** | name, repository.url, homepage, bugs.url, scripts (ssh: server/tunnel) | `"name": "herokidstory"`, github URL'leri |
| 2.2 | **next.config.js** | images.remotePatterns hostname | `herokidstory.s3.eu-central-1.amazonaws.com` |
| 2.3 | **Varsayılan URL** | lib/metadata.ts, app/sitemap.ts | BASE_URL fallback: `https://herokidstory.com` |
| 2.4 | **localStorage key'leri** | Tüm `kidstorybook_*` → `herokidstory_*` | Aşağıda liste |
| 2.5 | **UI metin / marka** | Header, Footer, auth sayfaları, i18n (siteName, title, ogTitle vb.) | "KidStoryBook" → "HeroKidStory" (veya tercih edilen yazım) |
| 2.6 | **Debug / trace** | TraceViewerModal source ve trace dosya adı prefix | kidstorybook-trace → herokidstory-trace |
| 2.7 | **Postman** | Collection/environment dosya adı ve içindeki "KidStoryBook" referansları | postman/KidStoryBook_* → HeroKidStory_* veya herokidstory_* |

### Faz 3 — Dokümantasyon

| # | Öğe | Konum | Not |
|---|-----|--------|-----|
| 3.1 | Ana dokümanlar | DOCUMENTATION.md, ROADMAP.md, PRD.md, FEATURES.md, ARCHITECTURE.md, database/SCHEMA.md | Başlık ve içerikte KidStoryBook → HeroKidStory / herokidstory |
| 3.2 | Cursor/agent kuralları | .cursor/rules/*.mdc, .cursorrules | description ve başlıklarda proje adı |
| 3.3 | docs/ içi | roadmap/, guides/, strategies/, reports/, checklists/, implementation/, api/, technical/, analysis/ | Metin ve örnek (bucket, DB, URL, key adları) |
| 3.4 | HTML/özel sayfalar | docs/roadmap/roadmap-viewer.html, docs/palette-preview.html | Title ve marka metni |

### Faz 4 — Arşiv ve Opsiyonel

| # | Öğe | Konum | Not |
|---|-----|--------|-----|
| 4.1 | docs/archive/ | Tüm alt klasörler | İsteğe bağlı toplu replace; referans dokümanlar |
| 4.2 | .gitignore | kidstorybook-key.pem | herokidstory-key.pem |

---

## 3. Kod İçi Referans Listesi (Kısa)

### 3.1 localStorage key'leri (hepsi `kidstorybook_` → `herokidstory_`)

- `kidstorybook_wizard` — app/[locale]/create/step1..step6, step2'de ayrıca `kidstorybook_character_id`
- `kidstorybook_character_id` — step2, step6, DebugQualityPanel
- `kidstorybook_drafts` — lib/draft-storage.ts (DRAFT_STORAGE_KEY)
- `kidstorybook_tts_prefs` — lib/tts-prefs.ts (STORAGE_KEY)
- `kidstorybook_cart` — contexts/CartContext.tsx (CART_STORAGE_KEY)
- `kidstorybook_wizard_state` — lib/wizard-state.ts (WIZARD_STATE_KEY)
- `kidstorybook_wizard_draft_id` — lib/wizard-state.ts (WIZARD_DRAFT_ID_KEY)

**Not:** Key değişince mevcut kullanıcıların wizard/draft/cart/tts verisi okunmaz (yeni key'e geçiş). İstenirse tek seferlik migration (eski key'den okuyup yeni key'e yaz) eklenebilir.

### 3.2 Sabit URL / hostname

- `lib/metadata.ts`: BASE_URL fallback `https://kidstorybook.com`
- `app/sitemap.ts`: aynı fallback
- `next.config.js`: hostname `kidstorybook.s3.eu-central-1.amazonaws.com`

### 3.3 UI'da "KidStoryBook" metni

- `components/layout/Header.tsx` (2 yerde)
- `components/layout/Footer.tsx` (2 yerde)
- `app/[locale]/auth/login/page.tsx`
- `app/[locale]/auth/register/page.tsx`
- `app/[locale]/auth/verify-email/page.tsx`
- `app/[locale]/auth/forgot-password/page.tsx`
- `app/[locale]/auth/callback/page.tsx`
- `messages/tr.json`, `messages/en.json`: siteName, metadata.title/ogTitle/description (çok sayıda)

### 3.4 Debug / trace

- `components/debug/TraceViewerModal.tsx`: source string, trace filename prefix `kidstorybook-trace-`
- `components/debug/DebugQualityPanel.tsx`: localStorage key (yukarıda)

### 3.5 Script ve env örnekleri

- `scripts/db-backup.sh`: PGUSER, PGDATABASE, S3_BUCKET default, DUMP_NAME prefix
- `.env.example`: DATABASE_URL, AWS_S3_BUCKET, GOOGLE_CLOUD_PROJECT_ID, GOOGLE_APPLICATION_CREDENTIALS
- `package.json`: name, repository, homepage, bugs, scripts (ssh: server/tunnel)

---

## 4. Dokümantasyon Dosya Listesi (Faz 3)

Aşağıdaki dosyalarda "KidStoryBook" veya "kidstorybook" geçiyor; toplu replace veya manuel güncelleme yapılacak.

**Docs root / ana:** DOCUMENTATION.md, ROADMAP.md, PRD.md, FEATURES.md, ARCHITECTURE.md  
**database:** SCHEMA.md  
**roadmap:** roadmap-viewer.html, NOTLAR_VE_FIKIRLER.md, V0_APP_PROMPT_GUIDE.md  
**guides:** DB_BACKUP_RUNBOOK.md, SALES_AND_CART_TESTING_GUIDE.md, EXAMPLES_PAGE_V0_PROMPT.md, PRICING_PAGE_V0_PROMPT.md, PROMPT_OPTIMIZATION_GUIDE.md  
**strategies:** TTS_STRATEGY.md, EBOOK_VIEWER_STRATEGY.md  
**reports:** MULTI_CHARACTER_FEATURE_SUMMARY.md  
**checklists:** PRODUCTION_ENV_5_5_6.md  
**implementation:** FAZ3_IMPLEMENTATION.md  
**api:** POSTMAN_COLLECTION.md  
**technical:** TECHNICAL_RESEARCH.md  
**analysis:** LOCALIZATION_ANALYSIS.md, TTS_GOOGLE_GEMINI_ANALYSIS.md, COVER_PATH_FLOWERS_ANALYSIS.md  
**features:** EXAMPLES_USED_PHOTOS_FEATURE.md  
**Diğer:** docs/palette-preview.html  
**Cursor:** .cursor/rules/project-manager.mdc, localization-agent.mdc, api-manager.mdc, database-manager.mdc, prompt-manager.mdc, .cursorrules  
**Archive:** docs/archive/ altındaki ilgili dosyalar (Faz 4)

---

## 5. Dikkat Edilecekler

1. **S3:** Bucket adı global benzersiz. `herokidstory` alınamazsa `herokidstory-<suffix>` kullan; next.config ve env'i buna göre güncelle.
2. **DB:** Production'da DB rename veya yeni DB = backup, kesinti planı, DATABASE_URL güncelleme.
3. **localStorage:** Key değişince mevcut cihazlarda wizard/draft/cart/tts sıfırlanır; gerekirse tek seferlik migration script (eski key → yeni key) yazılabilir.
4. **Domain:** Gerçek domain (kidstorybook.com → herokidstory.com veya başka) ayrı karar; NEXT_PUBLIC_APP_URL production'da buna göre ayarlanır.
5. **.next:** Build çıktıları path içerebilir; proje klasör adı değişirse `kidstorybook` → `herokidstory` olarak yeni clone'da build temiz olur.

---

## 6. Uygulama Sırası Özeti

1. **Faz 1** bitir (repo, domain kararı, S3, DB, env ve key dosyaları).
2. **Faz 2** uygula (package.json, next.config, metadata/sitemap, localStorage key'leri, UI metinleri, debug, Postman).
3. **Faz 3** ile docs ve Cursor kurallarını güncelle.
4. **Faz 4** ile arşiv ve .gitignore'u isteğe bağlı güncelle.

Bu sıra, altyapıyı önce sabitlediği için tekrar ve tutarsızlık riskini azaltır.

---

## 7. Faz 1 İlerleme Logu

| Tarih | Adım | Durum | Not |
|-------|------|--------|-----|
| 2026-03-08 | **1.1 GitHub repo** | ✅ Tamamlandı | Repo adı GitHub'da `herokidstory` olarak değiştirildi. URL: https://github.com/cuneyt-medetoglu/herokidstory |
| 2026-03-08 | **1.1 Local** | ✅ Yapıldı | package.json: name→herokidstory, repository/homepage/bugs URL'leri, ssh:server/tunnel→herokidstory-key.pem. .gitignore: herokidstory-key.pem |
| 2026-03-08 | **1.1 Senin yapacakların** | ✅ Tamamlandı | git remote set-url origin → herokidstory.git; PEM dosyası herokidstory-key.pem olarak yeniden adlandırıldı |
| 2026-03-08 | **1.2 Domain** | ⏸️ Sonraya bırakıldı | Projede henüz domain bağlı değil. Domain alınıp bağlanınca: DNS + SSL + production'da NEXT_PUBLIC_APP_URL ayarlanacak. Kodda varsayılan URL Faz 2'de herokidstory.com yapılacak. |
| 2026-03-08 | **1.3 S3 bucket** | ✅ Tamamlandı | Yeni bucket herokidstory oluşturuldu (eu-central-1). İçi boş; veri taşıma istenirse sonra yapılacak. |
| 2026-03-08 | **1.4 PostgreSQL** | ✅ Tamamlandı | herokidstory user+DB oluşturuldu; kidstorybook'dan pg_dump → herokidstory'e pg_restore. Local .env DATABASE_URL güncellendi. |
| 2026-03-08 | **1.5 Env / EC2 / key** | ✅ Tamamlandı | .env.example güncellendi. Local ve EC2 .env herokidstory (DB, S3). IAM: herokidstory-s3-policy, herokidstory-ec2-s3 role, herokidstory user + access key. .gitignore: *accessKeys*.csv, herokidstory_accessKeys.csv |

**Faz 1 tamamlandı.** Sıradaki: **Faz 2** (kod: next.config S3 hostname, metadata/sitemap URL, localStorage key'leri, UI marka metinleri).

---

## 7b. Faz 2 ve S3/DB Geçiş İlerleme Logu

| Tarih | Adım | Durum | Not |
|-------|------|--------|-----|
| 2026-03-08 | **Faz 2 kod** | ✅ Tamamlandı | next.config, metadata/sitemap/robots, localStorage key'leri, UI/i18n HeroKidStory, TraceViewerModal, package-lock |
| 2026-03-08 | **S3 sync** | ✅ Tamamlandı | Local'de aws s3 sync s3://kidstorybook → s3://herokidstory (herokidstory IAM key ile) |
| 2026-03-08 | **DB URL güncelleme** | ✅ Tamamlandı | scripts/update-s3-urls-to-herokidstory.sql EC2'de herokidstory DB'de çalıştırıldı (books, characters, story_data, image_edit_history) |
| 2026-03-08 | **S3 bucket policy** | ✅ Tamamlandı | herokidstory bucket'a PublicReadGetObject policy eklendi; next/image 403 hatası giderildi |
| | **Eski bucket silme** | ✅ Tamamlandı | S3 konsol → kidstorybook Empty + Delete yapıldı. |
| | **Faz 3 dokümantasyon** | ✅ Tamamlandı | Ana dokümanlar (PRD, FEATURES, ARCHITECTURE, DOCUMENTATION, SCHEMA), Cursor kuralları (localization, api-manager, database-manager, prompt-manager, architecture-manager, .cursorrules), docs/ (roadmap viewer, palette-preview, guides, strategies, api, technical, ai, NOTLAR_VE_FIKIRLER, PHASE_5_LAUNCH, GIT_STRATEGY, DOCUMENTATION_MAP). |
| | **Faz 4 arşiv** | ✅ Tamamlandı | docs/archive/ altında marka güncellemeleri (KidStoryBook/kidstorybook → HeroKidStory/herokidstory). .gitignore zaten herokidstory-key.pem (Faz 1'de yapıldı). |

---

## 8. S3 veri taşıma ve eski bucket silme

next.config'ten kidstorybook kaldırıldı. **(1) S3 sync** local'de yapıldı. **(2) DB URL güncellemesi** scripts/update-s3-urls-to-herokidstory.sql ile yapıldı. **(3) herokidstory bucket policy** (PublicReadGetObject) eklendi. **(4) Eski bucket silme:** S3 konsol → kidstorybook → Empty → Delete (isteğe bağlı, test sonrası).
