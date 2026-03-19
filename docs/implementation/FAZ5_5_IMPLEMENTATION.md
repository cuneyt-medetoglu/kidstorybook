# Faz 5.5: Deployment (AWS EC2) – İmplementasyon Takibi

**Tarih:** 10 Şubat 2026  
**Son Güncelleme:** 20 Mart 2026  
**Durum:** 🟢 Faz 5.5 şimdilik tamamlandı (5.5.1, 1.2.7, 5.5.10). Kalan maddeler (5.5.4, 5.5.5, 5.5.6 eksikler, 5.5.8, 5.5.2, 5.5.3) daha sonra bakılacak.  
**Kaynak:** `docs/roadmap/PHASE_5_LAUNCH.md` (5.5), `docs/analysis/DEPLOYMENT_SERVER_ANALYSIS.md`

---

## 1. Adım sırası (Domain/SSL sonraya alındı)

| Sıra | ID | Başlık | Durum |
|------|-----|--------|--------|
| 1 | 5.5.1 | EC2'de Next.js uygulaması deploy | ✅ Tamamlandı (12 Şubat 2026) |
| 2 | 5.5.6 | Production Environment Variables kontrolü | 🟡 Checklist hazır (eksikler sonra) |
| 3 | 1.2.7 | Database backup sistemi | ✅ Tamamlandı (script + runbook) |
| 4 | 5.5.10 | Production veritabanı migration akışı | ✅ Tamamlandı (runbook) |
| 5 | 5.5.4 / 5.5.5 | Monitoring + Sentry | 🔜 Daha sonra |
| 6 | 5.5.8 | CI/CD pipeline (opsiyonel) | 🔜 Daha sonra |
| — | 5.5.2 | Domain bağlantısı | 🔜 Daha sonra |
| — | 5.5.3 | SSL (Let's Encrypt + Nginx) | 🔜 Domain sonrası |

---

## 2. İlerleme logu (kısa)

- **10 Şubat 2026:** Faz 5.5 implementasyon dokümanı oluşturuldu. Öncelik sırası netleştirildi (domain/SSL sonraya). 5.5.1 ilk adım olarak belirlendi.
- **10 Şubat 2026:** 5.5.7 (AWS production makine kurulumu) önceden tamamlanmış; rehber: `docs/plans/AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md`.
- **12 Şubat 2026:** 5.5.1 tamamlandı. EC2’de Node 20, git clone, `npm run deploy:build`, `npm run start`/start:prod; uygulama http://EC2_IP:3000 üzerinden erişilebilir. Port 3000 güvenlik grubunda açıldı; NEXTAUTH_URL/NEXT_PUBLIC_APP_URL production IP ile ayarlandı. **Not:** IP ile erişimde Auth.js “UntrustedHost” log’u çıkıyor; giriş/session domain alındıktan sonra tam çalışacak. Bu haliyle IP ile test ve kullanım mümkün.
- **12 Şubat 2026:** 1.2.7 Database backup sistemi tamamlandı. `scripts/db-backup.sh` (pg_dump → S3, retention 14 gün), `docs/guides/DB_BACKUP_RUNBOOK.md` (kurulum, cron, restore). S3 prefix: backups/db.
- **13 Şubat 2026:** 1.2.7 cron kuruldu (EC2’de günlük 03:00); manuel backup ve S3 yükleme başarılı.
- **13 Şubat 2026:** 5.5.10 Production migration runbook eklendi. `docs/guides/PRODUCTION_MIGRATION_RUNBOOK.md` — migration öncesi backup, prod’da psql -f, rollback/restore.
- **13 Şubat 2026:** Faz 5.5 şimdilik tamamlandı kabul edildi. Kalan maddeler (5.5.4, 5.5.5, 5.5.6 eksikler, 5.5.8, 5.5.2, 5.5.3) daha sonra bakılacak.
- **13 Şubat 2026:** Local'de prod AWS DB'ye bağlanma netleştirildi. `npm run ssh:tunnel` (tünel) ile `npm run ssh:server` (sadece shell) ayrımı README'ye yazıldı; `package.json`'a `ssh:tunnel` script'i eklendi. Tünel açılmadan local'de DB istekleri ECONNREFUSED (localhost:5432) veriyordu; iki terminalde sırayla tünel + dev kullanımı dokümante edildi.
- **20 Mart 2026:** `migrations/024_books_timestamps_timestamptz.sql` — `books.created_at` / `updated_at` / `completed_at` için `TIMESTAMP` → `TIMESTAMPTZ` (UTC naive → doğru anlık). `lib/db/pool.ts` oturum `timezone=UTC`. Admin kitap detayında tarihler `Europe/Istanbul`, üretim süresi; tutarsız satırlarda AI istek zaman aralığından tahmini süre. Prod’da migration: `docs/guides/PRODUCTION_MIGRATION_RUNBOOK.md`.

---

## 3. Adım 1: 5.5.1 – EC2'de Next.js deploy ✅ Tamamlandı

- [x] **3.1** Node.js 20 LTS kurulumu (EC2 üzerinde)
- [x] **3.2** Proje dosyalarını EC2'ye alma (git clone)
- [x] **3.3** Bağımlılıklar ve build: `npm run deploy:build` veya `npm ci` + `npm run build`
- [x] **3.4** Uygulama: `npm run start` veya `npm run start:prod` (port 3000; PM2 opsiyonel)
- [x] **3.5** EC2'de `.env` (NEXTAUTH_URL, NEXT_PUBLIC_APP_URL, NODE_ENV=production; prodenv.ini referans)
- [x] **3.6** Erişim: http://EC2_IP:3000 (güvenlik grubunda TCP 3000 açık)

**Referans:** `docs/plans/AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md`, `docs/guides/ENVIRONMENT_SETUP.md`

---

## 3c. Adım 2: 5.5.6 – Production Environment Variables kontrolü

**Kontrol yeri:** Sunucudaki `.env` (EC2’de `cat .env` çıktısı) veya local’deki `prodenv.ini` şablonu.

**Checklist:** `docs/checklists/PRODUCTION_ENV_5_5_6.md`

- Zorunlu değişkenler (DATABASE_URL, NEXTAUTH_*, NEXT_PUBLIC_APP_URL, NODE_ENV, OPENAI_API_KEY, AWS_*) doğru mu?
- Placeholder kalanlar (Google/Facebook OAuth, Stripe, İyzico) kullanılacaksa gerçek değerlerle güncellenecek.
- Güvenlik: secret’lar sadece .env’de, .env izinleri kısıtlı; EC2’de IAM role varsa AWS key’ler .env’de olmayabilir.
- İsteğe bağlı: DEBUG_LOGGING, SHOW_DEBUG_QUALITY_BUTTONS production’da false.

Checklist’i doldurup gerekli düzeltmeleri yaptıktan sonra bu maddeyi tamamlandı işaretle.

---

## 3d. Adım 3: 1.2.7 – Database backup sistemi ✅ Tamamlandı

- **Script:** `scripts/db-backup.sh` — pg_dump (custom format), S3’e yükleme, yerel dosyayı silme, S3’te retention (varsayılan 14 gün).
- **Runbook:** `docs/guides/DB_BACKUP_RUNBOOK.md` — kurulum, manuel/cron yedek, S3 listeleme/indirme, restore adımları.
- **S3:** `s3://BUCKET/backups/db/` (backups prefix public değil).
- **Cron:** EC2’de kuruldu — günlük 03:00; log: `~/herokidstory/logs/db-backup.log`. `.pgpass` ile şifre verildi.

EC2’de ilk kez (yapıldı): `chmod +x scripts/db-backup.sh`, `.pgpass` veya `PGPASSWORD` ayarla, bir kez `./scripts/db-backup.sh` dene, sonra crontab ekle.

---

## 3e. Adım 4: 5.5.10 – Production veritabanı migration akışı ✅ Tamamlandı

- **Runbook:** `docs/guides/PRODUCTION_MIGRATION_RUNBOOK.md`
- **İçerik:** Yeni migration (şema değişikliği) eklenince prod’da nasıl çalıştırılır; önce backup (1.2.7), sonra `psql -f`, hata olursa restore.
- **Not:** Veri taşıma değil; sadece şema migration’larının prod’da güvenli uygulanması.

---

## 3b. Kalan maddeler (daha sonra bakılacak)

Faz 5.5’te yapılanlar bitti; aşağıdakiler ileride yapılacak.

| Ne | Açıklama |
|----|----------|
| **5.5.6** | Production env eksiklerini tamamla (checklist: `docs/checklists/PRODUCTION_ENV_5_5_6.md`). |
| **5.5.4 / 5.5.5** | Monitoring (CloudWatch / UptimeRobot) + Sentry error tracking. |
| **5.5.8** | CI/CD pipeline (opsiyonel). |
| **5.5.2** | Domain bağlantısı (DNS → EC2). |
| **5.5.3** | SSL (Let’s Encrypt + Nginx); domain sonrası. NEXTAUTH_URL / NEXT_PUBLIC_APP_URL → https. |

---

## 4. Geliştirme sürecinde kullanılabilecek analiz dokümanları

Aşağıdakiler ihtiyaç halinde açılacak; kalıcı olanlar burada listelenir, geçici olanlar "Geçici dosyalar" bölümüne alınır.

| Doküman | Amaç | Konum |
|---------|------|--------|
| **DEPLOYMENT_SERVER_ANALYSIS.md** | Deployment kapsamı, roadmap eşlemesi, önerilen sıra | `docs/analysis/` |
| **EC2 build/hata analizi** | Build veya runtime hatalarının kök neden incelemesi | Gerekirse `docs/analysis/` veya geçici not |
| **PRODUCTION_ENV_5_5_6.md** | 5.5.6 için env değişkenleri checklist | `docs/checklists/` |
| **DB_BACKUP_RUNBOOK.md** | 1.2.7 DB yedekleme ve restore | `docs/guides/` |
| **PRODUCTION_MIGRATION_RUNBOOK.md** | 5.5.10 Production’da şema migration çalıştırma, backup öncesi, rollback | `docs/guides/` |

---

## 5. Geçici dosyalar

Geliştirme sürecinde oluşturulup iş bitince silinebilecek veya arşivlenecek dosyalar:

| Dosya / İçerik | Açıklama | Sonrasında |
|----------------|----------|------------|
| EC2'de geçici test script'leri (curl, health check) | Tek seferlik doğrulama | Silinebilir veya rehberde örnek olarak bırakılır |
| Yerel notlar (deploy komutları, IP, port) | Kişisel/geçici not; secret içermemeli | `docs/archive/` veya silinir |
| Build log çıktıları (hata ayıklama için kopyalanan log) | Hata analizi için | Analiz dokümanına özet yazılıp asıl log silinir |

**Kural:** Gizli bilgi (şifre, key, IP vb.) dokümana yazılmaz; sadece "EC2'de .env kullanıldı" gibi referans yazılır.

---

## 6. Referanslar

- **Roadmap (detay):** `docs/roadmap/PHASE_5_LAUNCH.md` → 5.5 Deployment
- **Analiz (kapsam/sıra):** `docs/analysis/DEPLOYMENT_SERVER_ANALYSIS.md`
- **AWS kurulum rehberi:** `docs/plans/AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md`
- **Env rehberi:** `docs/guides/ENVIRONMENT_SETUP.md`
- **Dokümantasyon indeksi:** `docs/DOCUMENTATION.md`
