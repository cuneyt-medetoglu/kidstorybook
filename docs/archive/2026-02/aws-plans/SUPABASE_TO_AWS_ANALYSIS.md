# Supabase → AWS Geçiş Analizi (Düşünme / Anlaşma Aşaması)

**Tarih:** 4 Şubat 2026  
**Durum:** Tartışma – Karar sonrası detaylı plan ve uygulama yapılacak  
**İlgili:** [ARCHITECTURE.md](../ARCHITECTURE.md), [SCHEMA.md](../database/SCHEMA.md)

---

## 1. Neden Geçiş?

- **Supabase free tier limitleri** (DB, storage, bandwidth) doldu / dolmaya yakın.
- Maliyet veya limit aşımı nedeniyle **kendi altyapımızda devam etmek** isteniyor.
- **Tüm uygulama AWS’ye taşınacak:** Şu an uygulama sadece local’de çalışıyor; geçişten sonra hem uygulama hem veritabanı hem depolama AWS’de olacak (her şey AWS).

---

## 2. Supabase’de Şu An Ne Kullanılıyor?

| Bileşen | Kullanım |
|--------|----------|
| **PostgreSQL** | `public.users`, `characters`, `books`; auth.users; migration’lar (001–003, 015). |
| **Auth** | Supabase Auth (login, register, JWT, middleware). |
| **Storage** | 4 bucket: `photos`, `books`, `pdfs`, `covers` (public/private, 10–50 MB limit). |
| **RLS** | Row Level Security politikaları (kullanıcı bazlı erişim). |

Uygulama: Next.js, **şu an sadece local’de** çalışıyor; API Routes Supabase client ile DB/Auth/Storage’a bağlanıyor.

---

## 3. AWS’de Ne Açılacak? (Yüksek Seviye)

- **Uygulama:** Next.js uygulaması AWS’de çalışacak (EC2 üzerinde).
- **Veritabanı:** PostgreSQL (tek makine seçilirse aynı EC2’de; ayrı makineler seçilirse RDS).
- **Depolama:** **S3** – tüm dosya depolama (photos, books, pdfs, covers) S3 bucket’larında.
- **Auth:** Supabase Auth’un yerini alacak çözüm (Clerk / Auth0 / Keycloak / custom JWT).

---

## 4. Tek Makine mi, Birden Fazla Makine mi?

**Not:** Depolama her iki seçenekte de **S3** (ayrı bir “makine” değil, AWS managed service). Karar sadece **uygulama + veritabanı** için: aynı sunucuda mı, ayrı mı?

| Seçenek | Açıklama | Artı | Eksi |
|---------|----------|------|------|
| **Tek makine (EC2)** | **Hem PostgreSQL hem Next.js uygulaması aynı EC2 üzerinde.** Storage = S3. | Kurulum basit, maliyet düşük, yönetim kolay | DB ve uygulama aynı kaynakları (CPU, RAM) paylaşır; yedekleme/ölçekleme daha manuel |
| **Ayrı makineler** | 1× EC2 (sadece Next.js app) + RDS (PostgreSQL) + S3 | DB izole, yedekleme/ölçekleme daha iyi, best practice’e yakın | Kurulum ve operasyon daha karmaşık, maliyet daha yüksek |

**Öneri (tartışma için):**  
- **MVP / hızlı geçiş:** **Tek EC2** – aynı makinede hem veritabanı hem uygulama; storage S3.  
- **Uzun vadede / büyüme:** Ayrı RDS + ayrı EC2 + S3.

Yani evet: Tek makine önerisi = **DB ve uygulama aynı EC2’de**; S3 sadece dosya depolama için (ayrı servis). Karar sonrası seçilen modele göre detaylı mimari ve uygulama planı yazılacak.

---

## 4.1. DB ve uygulama aynı makinede – sorun yaratır mı?

**Kısa cevap:** Küçük / MVP ölçekte genelde **sorun olmaz**; trafik ve veri büyüdükçe **risk artar**. “Kesin sorun olmaz” diyemeyiz, bu bir **tradeoff**.

**Olası riskler:**

| Risk | Açıklama |
|------|----------|
| **Kaynak yarışı** | DB yoğun sorgu yaparken veya uygulama PDF (Puppeteer) üretirken CPU/RAM aynı makinede paylaşılır; biri diğerini yavaşlatabilir. |
| **Tek nokta arızası** | Makine veya disk arızalanırsa hem uygulama hem DB birlikte düşer; kurtarma tek sunucu üzerinden. |
| **Bağımsız ölçekleme yok** | Sadece uygulama ağırlaşıyorsa bile daha büyük tek makine almak gerekir; DB’yi ayrı büyütemezsin. |
| **Yedekleme / güncelleme** | DB backup veya OS/uygulama güncellemesi yaparken dikkatli olmak gerekir; aynı makinede her şey etkilenir. |

**Ne zaman aynı makine yeterli?**

- Kullanıcı sayısı ve istek hacmi düşük/orta.
- DB boyutu makul (birkaç GB civarı).
- PDF üretimi sık değil veya kuyruklanabiliyor.

**Ne zaman ayırmak mantıklı?**

- Trafik veya DB boyutu belirgin şekilde arttığında.
- DB’yi uygulamadan bağımsız yedekleyip ölçeklendirmek istediğinde.
- Uygulama güncellemesi ile DB’yi etkilemek istemediğinde.

**Sonuç:** Tek makine **MVP / ilk canlı aşama için makul bir seçim**; “emin misin?” sorusuna cevap: Evet, bu ölçekte mantıklı. İleride sorun hissedilirse RDS’e taşımak mümkün (migration planına eklenebilir).

---

## 4.2. Önerilen EC2 instance (tek makine için)

Projede **Next.js (Node) + PostgreSQL + Puppeteer (PDF)** birlikte çalışacak. Puppeteer/Chromium bellek tüketir; bu yüzden çok küçük instance yeterli olmaz.

| Instance | vCPU | RAM | Kullanım | Kabaca aylık maliyet (on-demand, bölgeye göre değişir) |
|----------|------|-----|----------|--------------------------------------------------------|
| **t3.small** | 2 | 2 GB | Sadece test / çok düşük trafik; production için sıkı kalabilir. | ~15–20 USD |
| **t3.medium** | 2 | 4 GB | **Önerilen başlangıç:** Küçük/orta trafik, az sayıda eşzamanlı PDF. | ~30–40 USD |
| **t3.large** | 2 | 8 GB | Daha rahat; sık PDF üretimi veya biraz daha trafik için. | ~60–80 USD |

**Öneri:**  
- **İlk canlı / MVP:** **t3.medium** (2 vCPU, 4 GB RAM) ile başlamak makul.  
- PDF üretimi veya eşzamanlı kullanıcı artarsa **t3.large**’a geçmek kolay (instance type değiştirilir).  
- Bölge seçerken **eu-central-1 (Frankfurt)** veya kullanıcıya yakın bir bölge düşünülebilir (gecikme + maliyet).

**Not:** Spot instance kullanılırsa maliyet düşer ama kesinti riski vardır; ilk aşamada on-demand tercih edilebilir. Detaylı kurulum planında disk boyutu (örn. 20–30 GB gp3) ve güvenlik grubu da netleştirilecek.

---

## 4.3. t3.medium ile ortalama aylık maliyet (her şey dahil)

Verdiğin saatlik fiyatlara göre (on-demand): **t3.medium = 0,0418 USD/saat** → ayda ~730 saat = **~30,50 USD** (sadece EC2).

Aşağıda **EC2 + disk + S3 + kabaca data transfer** birlikte düşünülmüş ortalama aylık tahmin var. Bölge: örn. eu-central-1 (Frankfurt); fiyatlar bölgeye ve kullanıma göre değişir.

| Kalem | Kabaca aylık (USD) | Not |
|-------|---------------------|-----|
| **EC2 t3.medium** (on-demand) | ~30–31 | 0,0418 USD/saat × 730 saat |
| **EC2 t3.medium** (1 yıl Reserved) | ~18–19 | 0,025 USD/saat × 730 saat |
| **EBS (disk)** 30 GB gp3 | ~2,5 | ~0,08 USD/GB-ay |
| **S3 storage** (örn. 20–50 GB) | ~0,5–1,5 | ~0,023 USD/GB-ay; PUT/GET istekleri küçük tutarda |
| **Data transfer OUT** (ilk 100 GB/ay ücretsiz, sonrası ücretli) | 0–5 | Düşük trafikte çoğu ay 0; biraz trafikte birkaç USD |
| **Elastic IP** (çalışan instance’a bağlı 1 adet) | 0 | Ücretsiz; kullanılmıyorsa ücretlenir |

**Ortalama aylık toplam (tahmini):**

- **On-demand:** **~35–45 USD/ay** (EC2 + EBS + S3 + az data transfer).
- **1 yıl Reserved EC2:** **~22–28 USD/ay** (EC2 Reserved + EBS + S3 + az data transfer).

Yani **t3.medium + S3 + disk dahil**, kabaca **ayda 35–45 USD** (on-demand) veya **22–28 USD** (1 yıl taahhüt) düşünebilirsin. Trafik ve S3 kullanımı artarsa S3 + data transfer birkaç USD daha eklenir; büyük artış yoksa bu aralık makul kalır.

---

## 5. Fazlar (Özet – Detay Karar Sonrası)

Geçiş süreci kabaca şu fazlara bölünebilir:

| Faz | İçerik (özet) |
|-----|----------------|
| **Kurulum** | AWS hesap, bölge, IAM, VPC, güvenlik grupları; S3 bucket’lar; (RDS veya EC2) PostgreSQL kurulumu. |
| **Makine(ler)** | EC2/RDS oluşturma, işletim sistemi, disk, backup ayarları; tek makine vs ayrı makineler kararına göre dağılım. |
| **Veri ve uygulama** | DB migration (schema + veri), Auth alternatifi entegrasyonu, storage’ı S3’e taşıma, uygulamayı EC2’de çalıştırma (Next.js), env ve kod güncellemeleri. |
| **Testler** | Smoke test, auth akışı, CRUD, PDF üretimi, storage okuma/yazma; staging ortamında uçtan uca test. |
| **Alarm ve izleme** | Disk, CPU, bellek, DB bağlantı sayısı; hata oranı; (opsiyonel) log toplama. Alarmlar e-posta/SMS/Slack. |
| **Kesinti / rollback** | Kısa kesinti penceresi, rollback planı (Supabase’e geri dönüş senaryosu). |

Her faz için **karar sonrası** ayrı bir detaylı plan (adımlar, komutlar, kontrol listeleri) yazılacak.

---

## 6. Sonraki Adımlar

1. **Bu dokümanı** paylaşarak tek makine / çoklu makine ve Auth alternatifi üzerinde **anlaşmak**.  
2. **Kararları** bu dosyaya kısa madde olarak eklemek (örn. “Seçim: Tek EC2 + S3” veya “RDS + EC2 + S3”).  
3. **Adım adım uygulama planı** ayrı dokümanda hazır: **[SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md](SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md)** — her adımda yapılacaklar ve "bana ne bildireceğin" yazıyor; ilerlemeyi oradan takip edeceğiz.  
4. Uygulama sırasında **yapılanları ve sapmaları** o plana veya implementasyon notlarına işlemek.

---

**İlgili dokümanlar:**  
- **Uygulama planı (adım adım):** [SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md](SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md)  
- Mimari: `docs/ARCHITECTURE.md`  
- Veritabanı şeması: `docs/database/SCHEMA.md`  
- Storage stratejisi: `docs/ARCHITECTURE.md` (Storage Stratejisi bölümü)
