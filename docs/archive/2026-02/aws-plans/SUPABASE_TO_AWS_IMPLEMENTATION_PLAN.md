# Supabase → AWS Geçiş – Adım Adım Uygulama Planı

**Tarih:** 4 Şubat 2026  
**İlerleme:** Bu dokümandan takip edilecek. Her adım sonrası “Bana ne bildireceksin” kısmını yapıp ilgili kutucuğu işaretleyeceksin.  
**Üst doküman (arşiv):** [SUPABASE_TO_AWS_ANALYSIS.md](../archive/2026-02/aws-plans/SUPABASE_TO_AWS_ANALYSIS.md) (kararlar, maliyet, tek makine özeti)

---

## İlerleme özeti

| Faz | İçerik | Durum | Adım sonrası bana bildirdin |
|-----|--------|--------|-----------------------------|
| **1** | AWS hesap, bölge, IAM | ✅ | ✅ |
| **2** | EC2 makine, disk, güvenlik grubu | ✅ | ✅ |
| **3** | PostgreSQL kurulumu (aynı EC2) | ✅ | ✅ |
| **4** | S3 (tek bucket + prefix'ler) | ✅ | ✅ |
| **5** | Auth alternatifi (karar + kurulum) | ⬜ | ⬜ |
| **6** | Uygulama deploy (Next.js, EC2) | ⬜ | ⬜ |
| **7** | Veri migration (DB + storage → S3) | ⬜ | ⬜ |
| **8** | Testler (smoke, auth, CRUD, PDF, storage) | ⬜ | ⬜ |
| **9** | Alarm ve izleme | ⬜ | ⬜ |
| **10** | Kesinti / go-live / rollback planı | ⬜ | ⬜ |

**Durum açıklaması:** ⬜ Yapılmadı | ✅ Yapıldı | 🔄 Devam ediyor

---

## Faz 1: AWS hesap, bölge, IAM

**Amaç:** AWS’de çalışacak hesap, bölge ve güvenli erişim (IAM) hazır olsun.

### Adım 1.1 – AWS hesabı ve bölge

- [x] **Yapılacak:** AWS hesabı aç (yoksa). Giriş yap.
- [x] **Yapılacak:** Bölge seç (örn. **eu-central-1 / Frankfurt**). Konsolda sağ üstten bölgeyi ayarla; tüm kaynakları bu bölgede açacağız.
- [ ] **Yapılacak:** Faturalandırma uyarısı (Billing Alerts) isteniyorsa bir budget uyarısı ekle (opsiyonel ama önerilir).

**Bu adım sonrası bana şunu bildir:**
- AWS hesap açık mı? (Evet/Hayır)
- Hangi bölgeyi kullanıyorsun? (örn. eu-central-1)
- (İstersen) Bölge adını yaz; sonraki adımlarda “BÖLGE” diye referans vereceğim.

- [x] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.** — Bölge: **eu-central-1 (Frankfurt)**

---

### Adım 1.2 – IAM kullanıcı (konsol yerine CLI/terraform için)

- [ ] **Yapılacak:** Root ile günlük iş yapma. Mümkünse bir IAM kullanıcı oluştur (örn. `kidstorybook-admin`), konsol ve programatik erişim için.
- [ ] **Yapılacak:** Bu kullanıcıya EC2, S3, CloudWatch (alarm için) yetkisi ver (gerekirse “PowerUser” veya ilgili policy’leri ekle).
- [ ] **Yapılacak:** Erişim anahtarı (Access Key) oluşturup güvenli yerde sakla; `aws configure` ile local’de kullanacaksan yapılandır.

**Bu adım sonrası bana şunu bildir:**
- IAM kullanıcı oluşturuldu mu? (Evet/Hayır)
- CLI kullanacak mısın? (Evet/Hayır) — Evet dersen sonraki adımlarda `aws` komutları verebilirim.

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 1 tamamlandı mı?** Tüm alt adımlar ✅ ve “bana bildirdim” işaretlendiyse bu satırı güncelle:

- [x] **Faz 1 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 1’i işaretledim.** (1.2 IAM opsiyonel; CLI kullanacaksan ileride yapılabilir.)

---

## Faz 2: EC2 makine, disk, güvenlik grubu

**Amaç:** Tek EC2 (t3.medium), disk (EBS gp3), güvenlik grubu ve (isteğe bağlı) Elastic IP hazır olsun.

### Adım 2.1 – VPC / ağ (varsayılan kullan)

- [x] **Yapılacak:** VPC kullan: Varsayılan default VPC yeterli. Özel mimari istemiyorsan “default VPC” ve “default subnet” ile devam et.

**Bu adım sonrası bana şunu bildir:**
- Varsayılan VPC ile mi gidiyorsun? (Evet/Hayır)

- [x] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.** — Varsayılan VPC.

---

### Adım 2.2 – Güvenlik grubu

- [ ] **Yapılacak:** Yeni güvenlik grubu oluştur (örn. `kidstorybook-sg`).
- [ ] **Yapılacak:** Inbound kurallar:
  - SSH (22) — sadece senin IP’nden (mümkünse).
  - HTTP (80) — 0.0.0.0/0 (web).
  - HTTPS (443) — 0.0.0.0/0 (web).
- [ ] **Yapılacak:** Outbound: Tüm trafik (varsayılan) kalabilir.

**Bu adım sonrası bana şunu bildir:**
- Güvenlik grubu adı veya ID’si (örn. `sg-xxxxx` veya `kidstorybook-sg`).

- [x] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.** — Launch wizard'da New security group (SSH + HTTP + HTTPS).

---

### Adım 2.3 – EC2 instance (t3.medium)

- [ ] **Yapılacak:** EC2 → Launch Instance.
- [ ] **Yapılacak:** AMI: **Ubuntu Server 22.04 LTS veya 24.04 LTS** (Quick Start → Ubuntu; planla uyumlu, SSH kullanıcı: `ubuntu`).
- [ ] **Yapılacak:** Instance type: **t3.medium**.
- [ ] **Yapılacak:** Key pair: Yeni oluştur veya mevcut seç; `.pem` dosyasını güvenli sakla.
- [ ] **Yapılacak:** Network: default VPC, public subnet. Güvenlik grubu: 2.2’de oluşturduğun (veya Launch wizard’da oluşturulan yeni SG).
- [ ] **Yapılacak:** Storage: 30 GB gp3 (veya en az 20 GB); 8 GB ile başlanıp sonra genişletilebilir.
- [ ] **Yapılacak:** Instance’ı başlat; public IP veya Elastic IP ile erişebildiğini not et.

**Bu adım sonrası bana şunu bildir:**
- Instance ID (örn. `i-xxxxx`).
- Public IP (veya Elastic IP).
- SSH ile bağlanabildin mi? (Evet/Hayır) — Ubuntu için: `ssh -i key.pem ubuntu@<IP>`.

- [x] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.** — Public IP: 18.184.150.1, SSH OK (ubuntu@ip-172-31-45-145).

---

### Adım 2.4 – Elastic IP (opsiyonel ama önerilir)

- [ ] **Yapılacak:** EC2 → Elastic IPs → Allocate. Yeni IP’yi bu instance’a “Associate” et. Böylece instance yeniden başlasa bile IP değişmez.

**Bu adım sonrası bana şunu bildir:**
- Elastic IP kullandın mı? (Evet/Hayır). Kullandıysan artık kullanacağın adres bu IP mi?

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 2 tamamlandı mı?**

- [x] **Faz 2 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 2’yi işaretledim.**

---

## Faz 3: PostgreSQL kurulumu (aynı EC2)

**Amaç:** Aynı EC2 üzerinde PostgreSQL kurulu ve güvenli erişime hazır olsun.

### Adım 3.1 – PostgreSQL kurulumu (Ubuntu)

- [x] **Yapılacak:** EC2’ye SSH ile bağlan.
- [x] **Yapılacak:** `sudo apt update && sudo apt install -y postgresql postgresql-contrib`
- [x] **Yapılacak:** `sudo systemctl enable postgresql && sudo systemctl start postgresql` — servisin çalıştığını kontrol et.

**Bu adım sonrası bana şunu bildir:**
- PostgreSQL kuruldu ve servis “active” mı? (Evet/Hayır)
- `psql --version` çıktısı (istersen).

- [x] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.** — PostgreSQL 16.11, servis active.

---

### Adım 3.2 – Veritabanı ve kullanıcı

- [x] **Yapılacak:** Uygulama için bir DB kullanıcısı ve veritabanı oluştur (örn. kullanıcı: `kidstorybook`, DB: `kidstorybook`). Şifreyi güvenli belirle.
- [x] **Yapılacak:** `pg_hba.conf` ile sadece local (127.0.0.1) veya instance içinden erişime izin ver; dışarıya 5432 açma (güvenlik).

**Bu adım sonrası bana şunu bildir:**
- Veritabanı adı ve kullanıcı adı (şifreyi **gönderme**, sadece “oluşturuldu” de).
- Uygulama bu kullanıcı ile localhost üzerinden bağlanacak; bunu onaylıyor musun? (Evet/Hayır)

- [x] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.** — DB ve kullanıcı: kidstorybook, localhost.

---

### Adım 3.3 – Schema ve migration’lar

- [ ] **Yapılacak:** Projedeki `supabase/migrations` (veya mevcut schema) ile PostgreSQL’e schema uygula. Supabase’den export edilmiş SQL veya migration dosyalarını bu DB’de çalıştır.
- [ ] **Yapılacak:** `public.users`, `characters`, `books` ve auth ile uyumlu tabloların oluştuğunu kontrol et.

**Bu adım sonrası bana şunu bildir:**
- Schema uygulandı mı? (Evet/Hayır)
- Bir hata aldıysan (ör. trigger, extension) hata mesajını paylaş; birlikte düzeltiriz.

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 3 tamamlandı mı?**

- [ ] **Faz 3 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 3’ü işaretledim.**

---

## Faz 4: S3 bucket'lar

**Amaç:** Supabase’deki bucket’lara karşılık S3 bucket’ları oluşturulsun (photos, books, pdfs, covers). **Yöntem: Tek bucket + içinde prefix'ler (klasörler).** Adım adım (arşiv): **[AWS_S3_SINGLE_BUCKET_PLAN.md](../archive/2026-02/aws-plans/AWS_S3_SINGLE_BUCKET_PLAN.md)**; özet: [AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md](AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md).

### Adım 4.1 – Tek bucket + prefix'ler

- [ ] **Yapılacak:** Aynı bölgede (Faz 1’deki BÖLGE) 4 bucket oluştur. İsimler global benzersiz olmalı (örn. `kidstorybook-photos-XXXX`, `kidstorybook-books-XXXX` — XXXX = hesap/randomsuffix).
- [ ] **Yapılacak:** Public read gereken bucket’lar (books, pdfs, covers) için “Block public access” ayarlarını ihtiyaca göre kaldır veya bucket policy ile sadece belirli path’lere public read ver.
- [ ] **Yapılacak:** photos bucket’ı private kalsın.

**Bu adım sonrası bana şunu bildir:**
- 4 bucket’ın tam isimleri (photos, books, pdfs, covers için).
- Hangi bucket’lar public read? (books, pdfs, covers / hepsi private / özel bir liste)

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

### Adım 4.2 – IAM / erişim (EC2’den S3’e)

- [ ] **Yapılacak:** EC2 instance’ın S3’e erişebilmesi için: Instance Role (IAM role) oluştur, gerekli S3 policy’sini ekle (GetObject, PutObject, ListBucket vb.), bu role’ü EC2’ye ata. Böylece EC2 içinde AWS SDK/CLI, access key olmadan S3’e erişir.

**Bu adım sonrası bana şunu bildir:**
- EC2’ye S3 için bir IAM role atandı mı? (Evet/Hayır)
- EC2’den test: `aws s3 ls` veya bir bucket’a dosya atabildin mi? (Evet/Hayır)

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 4 tamamlandı mı?**

- [x] **Faz 4 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 4’ü işaretledim.**

---

## Faz 5: Auth alternatifi (karar + kurulum)

**Amaç:** Supabase Auth yerine kullanılacak çözüm seçilsin ve projeye entegre edilsin.

### Adım 5.1 – Auth çözümü kararı

- [ ] **Yapılacak:** Seçenekler: Clerk, Auth0, Keycloak (self-hosted), veya custom JWT. Birini seç.
- [ ] **Yapılacak:** Seçtiğin çözümün dokümantasyonuna göre hesap/proje oluştur (Clerk/Auth0 ise); Keycloak ise EC2’de veya ayrı container’da çalıştırma planı yap.

**Bu adım sonrası bana şunu bildir:**
- Hangi auth çözümünü kullanacaksın? (Clerk / Auth0 / Keycloak / Custom)
- (Clerk/Auth0 ise) Proje/tenant adı veya dashboard linki paylaşma; sadece “kuruldu” de. API key’leri **gönderme**.

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

### Adım 5.2 – Proje kodu ve env

- [ ] **Yapılacak:** Next.js projesinde Supabase Auth çağrılarını seçilen auth çözümüyle değiştir (login, register, session, middleware).
- [ ] **Yapılacak:** `public.users` ve auth.users senkronizasyonunu yeni auth’a göre güncelle (user id, email vb.).
- [ ] **Yapılacak:** Gerekli env değişkenlerini dokümante et (örn. `AUTH_ISSUER`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` vb.); .env.example güncelle.

**Bu adım sonrası bana şunu bildir:**
- Auth entegrasyonu kodda bitti mi? (Evet/Hayır)
- Local’de login/register akışı çalışıyor mu? (Evet/Hayır)
- Takıldığın bir adım varsa (örn. middleware, callback URL) kısaca yaz.

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 5 tamamlandı mı?**

- [ ] **Faz 5 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 5’i işaretledim.**

---

## Faz 6: Uygulama deploy (Next.js, EC2)

**Amaç:** Next.js uygulaması EC2’de çalışsın (Node/PM2 veya Docker), DB ve S3’e bağlansın.

### Adım 6.1 – EC2’de ortam (Node, PM2)

- [ ] **Yapılacak:** EC2’de Node.js (LTS) kur. `nvm` veya doğrudan `apt` ile.
- [ ] **Yapılacak:** PM2 veya systemd ile uygulamanın sürekli çalışmasını sağla. Build: `npm run build` veya `pnpm build`. Start: `node .next/standalone/server.js` (standalone kullanıyorsan) veya `npm start`.
- [ ] **Yapılacak:** Env değişkenlerini EC2’de ayarla (DB URL, S3 bucket isimleri, Auth key’leri vb.); dosya veya PM2 ecosystem ile.

**Bu adım sonrası bana şunu bildir:**
- Node sürümü (örn. 20 LTS). PM2 mi systemd mi kullanıyorsun?
- Uygulama EC2’de “listen” ediyor mu? Hangi port? (örn. 3000)
- `curl http://localhost:3000` (veya ilgili port) EC2 içinden cevap veriyor mu? (Evet/Hayır)

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

### Adım 6.2 – Reverse proxy (Nginx) ve HTTPS (opsiyonel)

- [ ] **Yapılacak:** Nginx kur; 80/443’ten geleni Node portuna yönlendir. Domain’in bu EC2’nin IP’sine (veya Elastic IP) işaret etmesi gerekir.
- [ ] **Yapılacak:** HTTPS için Let’s Encrypt (certbot) kullanılabilir. Domain yoksa önce HTTP ile test edilebilir.

**Bu adım sonrası bana şunu bildir:**
- Nginx kuruldu mu? (Evet/Hayır)
- Domain kullanıyor musun? (Evet/Hayır). Evet ise domain adı (örn. app.kidstorybook.com).
- HTTPS aktif mi? (Evet/Hayır / Henüz değil)

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 6 tamamlandı mı?**

- [ ] **Faz 6 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 6’yı işaretledim.**

---

## Faz 7: Veri migration (DB + storage → S3)

**Amaç:** Supabase’deki mevcut veriler (DB + dosyalar) AWS’e taşınsın.

### Adım 7.1 – DB veri export / import

- [ ] **Yapılacak:** Supabase’den veri export et (pg_dump veya Supabase dashboard export). Gerekirse sadece `public.users`, `characters`, `books` ve ilgili tablolar.
- [ ] **Yapılacak:** Auth kullanıcıları yeni auth sistemine taşınacaksa: e-posta listesi, şifre hash’leri veya “yeniden kayıt” stratejisi belirle (Clerk/Auth0 genelde import veya invite ile).
- [ ] **Yapılacak:** Export edilen SQL’i EC2’deki PostgreSQL’e import et. Schema zaten Faz 3’te uygulandı; veri import’ta constraint/foreign key hataları varsa dokümanda not et.

**Bu adım sonrası bana şunu bildir:**
- DB verisi import edildi mi? (Evet/Hayır)
- Satır sayıları kabaca (users, characters, books) — istersen. Hata aldıysan hata mesajını paylaş.

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

### Adım 7.2 – Storage (Supabase → S3)

- [ ] **Yapılacak:** Supabase Storage’daki dosyaları indirip S3’e yükle. Script (örn. Node/aws-sdk) veya manuel: bucket’lara göre (photos, books, pdfs, covers) path’leri eşle.
- [ ] **Yapılacak:** DB’deki URL/path alanlarını S3 URL’leri (veya path’ler) ile güncelle; uygulama S3’ten okuyacak şekilde.

**Bu adım sonrası bana şunu bildir:**
- Tüm bucket’lar S3’e taşındı mı? (Evet/Hayır)
- DB’deki referanslar (URL/path) S3’e güncellendi mi? (Evet/Hayır)
- Eksik veya hatalı dosya var mı? (Evet/Hayır — varsa kısaca sayı veya örnek)

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 7 tamamlandı mı?**

- [ ] **Faz 7 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 7’yi işaretledim.**

---

## Faz 8: Testler

**Amaç:** Smoke, auth, CRUD, PDF, storage uçtan uca doğrulansın.

### Adım 8.1 – Smoke ve auth

- [ ] **Yapılacak:** Tarayıcıdan site açılıyor mu? (HTTP/HTTPS)
- [ ] **Yapılacak:** Login / register / logout akışı çalışıyor mu?
- [ ] **Yapılacak:** Session korumalı sayfalar (dashboard, kitaplarım) erişilebiliyor mu?

**Bu adım sonrası bana şunu bildir:**
- Smoke test geçti mi? (Evet/Hayır)
- Auth akışı sorunsuz mu? (Evet/Hayır)
- Bir test senaryosu başarısızsa hangisi? (kısaca)

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

### Adım 8.2 – CRUD ve PDF, storage

- [ ] **Yapılacak:** Karakter oluşturma/düzenleme, kitap oluşturma, kitaplarım listesi.
- [ ] **Yapılacak:** Kitap oluşturma akışında görsel ve PDF üretimi tetikleniyor mu? PDF indirilebiliyor mu?
- [ ] **Yapılacak:** Görseller ve PDF’ler S3’ten mi geliyor? (URL’ler doğru mu?)

**Bu adım sonrası bana şunu bildir:**
- CRUD testleri geçti mi? (Evet/Hayır)
- PDF üretimi ve indirme çalışıyor mu? (Evet/Hayır)
- Storage (S3) üzerinden görsel/PDF erişimi doğru mu? (Evet/Hayır)
- Varsa hata veya eksik davranış (kısaca).

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 8 tamamlandı mı?**

- [ ] **Faz 8 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 8’i işaretledim.**

---

## Faz 9: Alarm ve izleme

**Amaç:** Disk, CPU, bellek, hata oranı için basit alarmlar tanımlansın.

### Adım 9.1 – CloudWatch alarmları

- [ ] **Yapılacak:** CloudWatch’ta EC2 için alarmlar: Disk kullanımı (veya EBS), CPU utilization, bellek (custom metric gerekebilir). Eşik: örn. CPU > %80, Disk > %85.
- [ ] **Yapılacak:** Alarm tetiklenince e-posta (SNS topic + subscription) veya istenirse Slack.

**Bu adım sonrası bana şunu bildir:**
- Kaç alarm tanımladın? (örn. CPU, Disk)
- Bildirim nereye gidiyor? (E-posta / Slack / Henüz yok)

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 9 tamamlandı mı?**

- [ ] **Faz 9 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 9’u işaretledim.**

---

## Faz 10: Kesinti / go-live / rollback planı

**Amaç:** Supabase’i kapatmadan önce kesinti penceresi ve geri dönüş planı net olsun.

### Adım 10.1 – Kesinti ve DNS / trafik

- [ ] **Yapılacak:** “Go-live” tarihi ve kısa kesinti penceresi belirle. DNS’i (varsa) AWS EC2/IP’ye yönlendir; veya kullanıcılara yeni URL duyur.
- [ ] **Yapılacak:** Supabase’i hemen kapatma; bir süre read-only veya yedek olarak bırakıp sonra kapat.

**Bu adım sonrası bana şunu bildir:**
- Go-live tarihi (veya “henüz belirsiz”).
- Rollback planı: Sorun olursa DNS’i tekrar Supabase’e mi alacaksın, yoksa sadece bakım penceresi mi? (Kısaca)

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

### Adım 10.2 – Doküman güncellemesi

- [ ] **Yapılacak:** Bu plan dokümanında “İlerleme özeti” tablosunu güncelle; ARCHITECTURE.md veya README’de “Production: AWS (EC2 + S3 + PostgreSQL)” notunu ekle.

**Bu adım sonrası bana şunu bildir:**
- Doküman güncellemesi yapıldı mı? (Evet/Hayır)

- [ ] **Ben bu adımı tamamladım ve yukarıdaki bilgiyi sana bildirdim.**

---

**Faz 10 tamamlandı mı?**

- [ ] **Faz 10 tamamlandı; üstteki “İlerleme özeti” tablosunda Faz 10’u işaretledim.**

---

## Özet: Her adım sonrası bana ne bildireceksin?

| Faz | Bana bildireceğin (kısa) |
|-----|--------------------------|
| 1 | Bölge, IAM kullanıcı var mı, CLI kullanacak mısın |
| 2 | SG adı, Instance ID, Public/Elastic IP, SSH çalışıyor mu |
| 3 | PostgreSQL kuruldu mu, DB/kullanıcı adı, schema uygulandı mı |
| 4 | 4 bucket ismi, hangileri public, EC2’den S3 erişimi var mı |
| 5 | Hangi auth (Clerk/Auth0/…), entegrasyon bitti mi, local’de login çalışıyor mu |
| 6 | Node/PM2, hangi port, Nginx/domain/HTTPS durumu |
| 7 | DB import bitti mi, storage S3’e taşındı mı, URL’ler güncellendi mi |
| 8 | Smoke/auth/CRUD/PDF/storage test sonuçları |
| 9 | Kaç alarm, bildirim nereye |
| 10 | Go-live tarihi, rollback planı, doküman güncellendi mi |

İlerlemeyi bu dokümandan takip edeceğiz: hangi faz/adımda olduğunu söylediğinde, bir sonraki adımı ve “bana ne bildireceğini” buradan okuyacağım.
