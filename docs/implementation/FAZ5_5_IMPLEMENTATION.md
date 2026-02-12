# Faz 5.5: Deployment (AWS EC2) – İmplementasyon Takibi

**Tarih:** 10 Şubat 2026  
**Son Güncelleme:** 12 Şubat 2026  
**Durum:** 🟢 5.5.1 tamamlandı; 5.5.6 checklist hazır (eksikler sonra); sırada 1.2.7  
**Kaynak:** `docs/roadmap/PHASE_5_LAUNCH.md` (5.5), `docs/analysis/DEPLOYMENT_SERVER_ANALYSIS.md`

---

## 1. Adım sırası (Domain/SSL sonraya alındı)

| Sıra | ID | Başlık | Durum |
|------|-----|--------|--------|
| 1 | 5.5.1 | EC2'de Next.js uygulaması deploy | ✅ Tamamlandı (12 Şubat 2026) |
| 2 | 5.5.6 | Production Environment Variables kontrolü | 🟡 Checklist hazır (eksikler sonra) |
| 3 | 1.2.7 | Database backup sistemi | ⬜ Sırada |
| 4 | 5.5.10 | Production veritabanı migration akışı | ⬜ Bekliyor |
| 5 | 5.5.4 / 5.5.5 | Monitoring + Sentry | ⬜ Bekliyor |
| 6 | 5.5.8 | CI/CD pipeline (opsiyonel) | ⬜ Bekliyor |
| — | 5.5.2 | Domain bağlantısı | 🔜 Daha sonra |
| — | 5.5.3 | SSL (Let's Encrypt + Nginx) | 🔜 Domain sonrası |

---

## 2. İlerleme logu (kısa)

- **10 Şubat 2026:** Faz 5.5 implementasyon dokümanı oluşturuldu. Öncelik sırası netleştirildi (domain/SSL sonraya). 5.5.1 ilk adım olarak belirlendi.
- **10 Şubat 2026:** 5.5.7 (AWS production makine kurulumu) önceden tamamlanmış; rehber: `docs/plans/AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md`.
- **12 Şubat 2026:** 5.5.1 tamamlandı. EC2’de Node 20, git clone, `npm run deploy:build`, `npm run start`/start:prod; uygulama http://EC2_IP:3000 üzerinden erişilebilir. Port 3000 güvenlik grubunda açıldı; NEXTAUTH_URL/NEXT_PUBLIC_APP_URL production IP ile ayarlandı. **Not:** IP ile erişimde Auth.js “UntrustedHost” log’u çıkıyor; giriş/session domain alındıktan sonra tam çalışacak. Bu haliyle IP ile test ve kullanım mümkün.

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

## 3b. Sıradaki adım ve kısa özet

| Ne | Açıklama |
|----|----------|
| **Sıradaki adım** | **1.2.7** – Database backup sistemi (production PostgreSQL için yedekleme stratejisi ve araçları). |
| **Sonra** | 5.5.10 migration akışı → 5.5.4/5.5.5 monitoring/Sentry → 5.5.8 CI/CD (opsiyonel). 5.5.6 eksik env’ler sonra tamamlanacak. |
| **Domain sonrası** | 5.5.2 Domain → 5.5.3 SSL (Nginx + Let’s Encrypt); NEXTAUTH_URL ve NEXT_PUBLIC_APP_URL’i https://domain.com yap. |

---

## 4. Geliştirme sürecinde kullanılabilecek analiz dokümanları

Aşağıdakiler ihtiyaç halinde açılacak; kalıcı olanlar burada listelenir, geçici olanlar "Geçici dosyalar" bölümüne alınır.

| Doküman | Amaç | Konum |
|---------|------|--------|
| **DEPLOYMENT_SERVER_ANALYSIS.md** | Deployment kapsamı, roadmap eşlemesi, önerilen sıra | `docs/analysis/` |
| **EC2 build/hata analizi** | Build veya runtime hatalarının kök neden incelemesi | Gerekirse `docs/analysis/` veya geçici not |
| **PRODUCTION_ENV_5_5_6.md** | 5.5.6 için env değişkenleri checklist | `docs/checklists/` |
| **Migration runbook** | 5.5.10 için production migration adımları | Gerekirse `docs/guides/` veya `docs/plans/` |

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
