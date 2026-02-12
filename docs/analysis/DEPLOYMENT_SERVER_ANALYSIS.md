# Sunucuda Çalıştırma ve Deployment – Analiz

**Tarih:** 10 Şubat 2026  
**Amaç:** Sunucuda DB kuruldu; projeyi sunucuda çalıştırıp deployment süreçlerine başlamak.  
**Odak:** Roadmap 5.5 (Deployment) ve ilgili maddeler.

**İlerleme takibi:** Tüm adımlar ve kısa ilerleme logu → **`docs/implementation/FAZ5_5_IMPLEMENTATION.md`**. Analiz dokümanları ve geçici dosyalar da orada listelenir.

---

## 1. Roadmap’te Olan Konular (ID’li)

Aşağıdaki başlıklar roadmap’te **zaten var**; ID’leriyle listeleniyor.

| ID | Kısa başlık |
|----|-------------|
| **5.5.1** | EC2’de Next.js uygulaması deploy |
| **5.5.2** | Domain bağlantısı |
| **5.5.3** | SSL sertifikası (Let’s Encrypt + Nginx) |
| **5.5.4** | Monitoring kurulumu |
| **5.5.5** | Error tracking (Sentry) |
| **5.5.6** | Production Environment Variables kontrolü |
| **5.5.7** | AWS’de production makine kurulumu ✅ (Tamamlandı) |
| **5.5.8** | CI/CD pipeline (otomatik deployment) |
| **5.5.9** | Docker ile deployment (opsiyonel) |
| **5.3.1** | HTTPS sertifikası (Nginx + Let’s Encrypt; bkz. 5.5.3) |
| **1.2.7** | Database backup sistemi |

**Not:** 5.5.1, “sunucuda projeyi çalıştırma” hedefiyle doğrudan örtüşüyor. Önce 5.5.1, sonra 5.5.2 / 5.5.3 / 5.5.6 sırası mantıklı.

---

## 2. Roadmap’te Olmayan Konular (Eklenebilir)

Önceki ilk analizde listelenen bazı başlıklar (Node.js kurulumu, PM2, Nginx reverse proxy, build/start, env ayarları) aslında **5.5.1 ve 5.5.3 altında zaten mevcut**.  
Gerçekten eksik olan ve roadmap’e eklenmesi anlamlı görünen başlık:

| Kısa başlık | Açıklama |
|-------------|----------|
| Production’da migration çalıştırma | Production PostgreSQL için migration akışı, backup + rollback stratejisi ile birlikte netleştirilecek ayrı iş maddesi |

---

## 3. Önerilen Sıra (Kısa – Domain/SSL Hariç)

1. **5.5.1** – EC2’de Next.js deploy (runtime, build, PM2; uygulamanın gerçekten production makinede ayağa kalkması).
2. **5.5.6** – Production env değişkenleri kontrolü.
3. **1.2.7** – DB backup sistemi (production veritabanı için yedekleme stratejisi).
4. **5.5.10 (öneri)** – Production’da migration çalıştırma akışı (eklenecek yeni madde).
5. **5.5.4 / 5.5.5** – Monitoring + Sentry.
6. **5.5.8** – CI/CD (opsiyonel, sonra).

---

## 4. Daha Sonra Yapılacaklar (Domain + SSL)

- **5.5.2** – Domain bağlantısı (domain satın alma/DNS; daha sonra).  
- **5.5.3** – SSL sertifikası (Let’s Encrypt + Nginx; domain sonrasında).

Roadmap’te yapılacak değişiklikler faz dosyalarına (özellikle `PHASE_5_LAUNCH.md`) işlenecek; `roadmap.csv` ise bu faz dosyalarından **script ile otomatik üretildiği için** elle düzenlenmeyecek.

---

## 5. İlgili dokümanlar

| Doküman | İçerik |
|---------|--------|
| **FAZ5_5_IMPLEMENTATION.md** | Adım sırası, ilerleme logu, 5.5.1 alt adımları, analiz/geçici dosya listesi |
| **PHASE_5_LAUNCH.md** | Roadmap 5.5 maddeleri (kaynak) |
| **AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md** | EC2 + PG + S3 kurulum rehberi |
| **ENVIRONMENT_SETUP.md** | Env değişkenleri rehberi |
