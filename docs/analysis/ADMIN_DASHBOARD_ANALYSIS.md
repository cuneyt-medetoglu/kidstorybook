# Admin Dashboard — Analiz Dokümanı

**Tarih:** 15 Mart 2026  
**Son güncelleme:** 18 Mart 2026 — **Faz A.3 tamamlandı.** Job Queue Monitor ve Progress Sayfası canlı. Tüm Faz A adımları tamamlandı.  
**Durum:** AKTIF — Faz B devam ediyor (Kullanıcı Yönetimi ✅, Sipariş bekliyor).  
**Roadmap Referansı:** 5.8.x (Admin Panel / Dashboard)  
**Agent:** Admin panel planı ve ilerlemeden sorumlu agent: **@admin-panel-manager** (`.cursor/rules/admin-panel-manager.mdc`)

---

## 1. Kapsam Özeti

HeroKidStory admin paneli; sipariş takibi, kullanıcı yönetimi, kitap yönetimi, sistem izleme (job queue, worker), analytics ve sistem ayarlarını tek bir arayüzde sunan dahili bir operasyon aracıdır. Dış kullanıcıya açık değil; yalnızca admin rolüne sahip kullanıcılar erişir.

---

## 2. Özellik Listesi (Tüm Maddeler)

### 2.1 Ana Dashboard (Özet Ekran)
- Toplam kullanıcı, kitap, sipariş, gelir kartları (bugün / bu hafta / bu ay)
- Trend grafikleri (günlük kitap üretimi, günlük satış)
- Son 5 sipariş, son 5 kayıt olan kullanıcı
- Sistem sağlığı özeti (job queue durumu, hata sayısı)
- Anlık sitede kaç aktif kullanıcı var (online user count)

### 2.2 Sipariş Yönetimi
- Tüm siparişler listesi (TanStack Table; sıralama, filtreleme, sayfalama)
- Filtreler: durum, tarih aralığı, kullanıcı, tutar, ödeme sağlayıcısı (Stripe / İyzico)
- Arama: sipariş no, kullanıcı email, kitap adı
- Sipariş detay: ödeme bilgileri, kitap bilgileri, kullanıcı bilgileri
- Durum güncelleme: pending → processing → completed / cancelled / refunded
- Toplu işlem: çoklu seçim, durum güncelleme
- İade/iptal yönetimi
- Sipariş geçmişi log
- CSV/Excel export
- Ödeme başarısız / bekleyen takibi

### 2.3 Kullanıcı Yönetimi
- Tüm kullanıcılar listesi (filtreleme, arama)
- Kullanıcı detay sayfası:
  - Profil bilgileri
  - Oluşturduğu kitaplar
  - Sipariş geçmişi
  - Karakterleri
  - Aktivite logları
  - Ödeme geçmişi
  - Ücretsiz kapak hakkı durumu
- Kullanıcı durumu: aktif, pasif, ban
- Email gönderme (kullanıcıya iletişim)
- Kullanıcı notları / etiket ekleme
- Kullanıcı istatistikleri (toplam kitap, toplam harcama, son aktivite)

### 2.4 Kitap Yönetimi
- Tüm kitaplar listesi (filtreleme, arama)
- Filtreler: durum (draft, generating, completed, failed), tema, yaş grubu, tarih
- Kitap detay: sayfalar, karakterler, sipariş bilgisi
- Kitap durumu yönetimi
- Kitap silme / arşivleme
- Generating durumundaki kitapları izleme
- En çok oluşturulan temalar / yaş grubu istatistikleri
- **Destek / kullanıcı şikayeti — Kitap bulma ve düzenleme:**
  - Kullanıcı “kitabımda hata var” diye iletişime geçtiğinde admin panelden ilgili kitabı bulma
  - Arama: kullanıcı **email**, kitap adı, kitap ID, sipariş no ile arama
  - Bulunan kitabı açıp **düzenleme**: sayfa metinleri, görseller (regenerate), kapak, TTS vb. — mevcut kitap düzenleme yeteneklerinin admin tarafında kullanılması
  - Gerekirse kullanıcıya “düzeltme yapıldı” bilgisi (email veya uygulama içi bildirim) iletilmesi
  - Bu akış Kitap Yönetimi içinde “Kitap ara / düzenle (destek)” sayfası veya Kitap detay sayfasındaki “Admin düzenleme” aksiyonu olarak yer alacak

### 2.5 Job Queue İzleme (Bull Board — Laravel Horizon Karşılığı)
- BullMQ tabanlı background job takibi
- Ekranlar:
  - **Waiting:** Kuyrukta bekleyen kitaplar
  - **Active:** Şu an işlenen kitaplar (hangi kullanıcı, % kaç tamamlandı)
  - **Completed:** Tamamlananlar (son N saat/gün)
  - **Failed:** Başarısız joblar + hata mesajı + stack trace
- Retry butonu (her başarısız job için)
- Job silme
- Concurrency ayarı görüntüleme
- Queue istatistikleri (işlenen/başarısız oran, ortalama süre)
- `/admin/queues` rotasında; admin middleware ile korunur
- Referans: `.cursor/plans/book_generation_progress_ab3e0559.plan.md`

### 2.6 Gerçek Zamanlı Analytics
- Anlık online kullanıcı sayısı
- Son 30 dakikada yapılan eylemler (kitap başlatıldı, ödeme yapıldı vs.)
- Aktif job sayısı
- Hata oranı (son 1 saat)
- Veri kaynağı seçenekleri: Vercel Analytics, Plausible, özel DB sorguları
- **Not (15 Mart 2026):** Henüz veri kaynağı/net iş akışı belli değil. Bu bölüm **yeri yapılıp boş bırakılacak**; ileride “Gerçek Zamanlı Analytics Analizi” yapılıp implement edilecek.

### 2.7 Finansal Metrikler
- Günlük / haftalık / aylık / yıllık gelir grafiği
- Gelir ödeme sağlayıcısına göre (Stripe / İyzico)
- Ortalama sipariş değeri
- En çok satılan paketler / fiyat noktaları
- Dönüşüm oranları: ziyaretçi → kayıt → kitap → satın alma
- **Not (15 Mart 2026):** Stripe/İyzico gelene kadar **yeri olsun ama boş**. Entegrasyon sonrası doldurulacak.

### 2.8 Sistem Yönetimi
- **Ayarlar:** Fiyatlandırma, özellik açma/kapama (feature flags), TTS konfigürasyonu
- **Email şablonları:** Sipariş onayı, kitap hazır bildirimi vb. — **yeri olsun ama şimdilik boş** (15 Mart 2026).
- **Log görüntüleme:** Sistem logları, hata logları (tail view ya da filtrelenmiş liste)
- **API kullanım takibi:** OpenAI API çağrı sayısı + maliyet tahmini (günlük/aylık)
- **Storage takibi:** S3 kullanımı (toplam dosya sayısı, boyut, maliyet)
- **DB sağlık:** Bağlantı sayısı, yavaş sorgu uyarısı
- **Backup durumu:** Son backup tarihi, S3'te kaç backup var

### 2.9 İçerik ve Prompt Yönetimi *(Post-MVP, isteğe bağlı)*
- Aktif story/image prompt sürümü görüntüleme
- Prompt version geçmişi
- A/B test sonuçları (hangi prompt daha iyi kitap üretiyor)
- Örnek kitap kütüphanesi (sayfada gösterilen örnekleri yönetme)

### 2.10 Bildirim / Alert Sistemi *(Post-MVP)*
- Job başarısızlık uyarısı (email / Slack)
- Ödeme başarısızlık uyarısı
- OpenAI API hata oranı yükseldiğinde uyarı
- Sunucu kaynak kullanımı eşik aşımında uyarı

---

## 3. İlerleme Süreci ve Faz Sıralaması

Fazlar, **altyapı → temel içerik → yönetim → analytics → ileri** mantığıyla sıralanmıştır. Her faz bir öncekine dayanır.

### 3.1 Faz Özet Tablosu

| Faz | İçerik | Bağımlılık / Not |
|-----|--------|-------------------|
| **Faz 0 — İskelet** ✅ | Route groups, auth.ts role, middleware, admin layout, sidebar, placeholder dashboard | **TAMAMLANDI — 15 Mart 2026** |
| **Faz A — Temel İçerik** ✅ | 2.1 Ana Dashboard, 2.4 Kitap Yönetimi, 2.3 Kullanıcı Yönetimi, 2.5 Job Queue Monitor, BullMQ Progress Sayfası | **TAMAMLANDI — 18 Mart 2026** |
| **Faz B — Yönetim** | 2.2 Sipariş Yönetimi, 2.8 kısmi (TTS ayarları, sistem logları) | Stripe/İyzico entegrasyonu; 2.8 kısmi bağımsız eklenebilir |
| **Faz C — Analytics** | 2.6 Gerçek zamanlı analytics, 2.7 Finansal metrikler, 2.8 tam | Stripe/İyzico ve veri kaynağı kararları sonrası |
| **Faz D — İleri** | 2.9 Prompt Yönetimi, 2.10 Alert Sistemi | Post-MVP |

### 3.2 Fazların Detaylı Sırası

**Faz 0 — İskelet (Altyapı)** ✅ **TAMAMLANDI — 15 Mart 2026**  
- Route group yapısına geçildi: `app/[locale]/(public)/` ve `app/[locale]/(admin)/` — URL değişmedi.  
- `auth.ts` güncellendi: `role` JWT token ve session a eklendi. `types/next-auth.d.ts` oluşturuldu.  
- `middleware.ts`: /admin için `role === admin` kontrolü; yetkisiz kullanıcı dashboard a yönlendiriliyor.  
- Admin layout, collapsible sidebar, header bileşenleri oluşturuldu.  
- `app/[locale]/(admin)/admin/page.tsx`: Placeholder dashboard (KPI, badge, sıradaki adımlar).  
- **URL:** `/tr/admin` — sadece `role === admin` olan kullanıcılar erişebilir.  

**Faz A — Temel İçerik** ✅ **TAMAMLANDI — 18 Mart 2026 (tüm A adımları bitti)**  
1. **A.1 Ana Dashboard (2.1)** ✅ **TAMAMLANDI — 15 Mart 2026**
   - `lib/db/admin.ts` → `getAdminStats()` — toplam kullanıcı, kitap, son 8 kitap, son 8 kullanıcı.  
   - `app/api/admin/stats/route.ts` → admin-only API endpoint (401/403 korumalı).  
   - Dashboard page: gerçek KPI kartları (canlı), son kitaplar + son kullanıcılar tablosu, faz ilerleme durumu.  
   - Sipariş ve gelir kartları placeholder olarak kaldı (Stripe/İyzico gelince).  
2. **A.2 Kitap Yönetimi (2.4)** ✅ **TAMAMLANDI — 15 Mart 2026**
   - `lib/db/admin.ts` → `getAdminBooks()` (arama/filtre/pagination) + `getAdminBookById()`.  
   - `app/api/admin/books/` → GET (liste) + PATCH (düzenleme), admin-only.  
   - `/admin/books` — Kitap listesi: başlık/email/ID arama, durum filtresi, pagination.  
   - `/admin/books/[id]` — Detay: meta, kapak, sayfa ön izleme, başlık+durum düzenleme.  
   - Sidebar: “Ana Dashboard’a Dön” linki eklendi.  
3. **A.3 Kullanıcı Yönetimi (2.3)** ✅ **TAMAMLANDI — 15 Mart 2026**
   - `lib/db/admin.ts` → `getAdminUsers()` (arama/rol filtresi/pagination) + `getAdminUserById()`.  
   - `app/api/admin/users/` → GET (liste) + GET/PATCH `/[id]` (ad + rol düzenleme), admin-only.  
   - `/admin/users` — Kullanıcı listesi: isim/email/ID arama, rol filtresi, pagination.  
   - `/admin/users/[id]` — Detay: istatistikler, son kitaplar (admin/kitap detay linki), ad+rol düzenleme.  
   - Sidebar: “Kullanıcılar” aktif hale getirildi.  
4. **A.4 Job Queue Monitor / BullMQ (2.5)** ✅ **TAMAMLANDI — 18 Mart 2026**  
   - `app/api/admin/queues/route.ts` → GET (istatistik + job listesi), POST (retry), DELETE (job sil), admin-only.  
   - `app/[locale]/(admin)/admin/queues/page.tsx` → Canlı monitoring UI; 5s auto-refresh; aktif joblar için progress bar.  
   - `components/admin/admin-sidebar.tsx` → “Job Queue Monitor” linki aktif edildi.  
   - `hooks/useBookGenerationStatus.ts` → Frontend polling hook (4s aralıklı, tamamlanınca otomatik duran).  
   - `app/[locale]/(public)/create/generating/[bookId]/page.tsx` → Kullanıcıya yönelik progress sayfası (kapatılabilir, arka planda devam).  
   - BullMQ worker `lib/queue/workers/book-generation.worker.ts` tam implemente edildi; PM2 ile yönetiliyor.  
   - **Gereksinimler:** Redis (localhost:6379) + PM2 worker (`herokidstory-worker`) çalışır olmalı.  

**Faz B — Yönetim** *(Sipariş Yönetimi bekliyor)*  
- **B.1 Sipariş Yönetimi (2.2):** Sipariş listesi, filtreleme, arama, detay, durum güncelleme, export — **Stripe/İyzico entegrasyonu sonrası** anlamlı hale gelir.  
- **B.2 TTS + Sistem Ayarları (2.8 kısmi):** TTS konfigürasyonu (zaten API var), feature flags, log görüntüleme (hata logları) — bağımsız eklenebilir, Stripe beklemiyor.  

**Faz C — Analytics ve Sistem Tam**  
- **2.6 Gerçek zamanlı analytics:** Yer bırakılacak; veri kaynağı kararı sonrası doldurulacak.  
- **2.7 Finansal metrikler:** Stripe/İyzico entegrasyonu sonrası gelir grafikleri, dönüşüm oranları.  
- **2.8 tam:** Email şablonları yönetimi, API kullanım/maliyet takibi, storage, DB sağlık, backup durumu.  

**Faz D — İleri (Post-MVP)**  
- **2.9** İçerik ve prompt yönetimi (sürüm görüntüleme, A/B test, örnek kitap kütüphanesi).  
- **2.10** Bildirim / alert (job başarısızlık, ödeme hataları, API hata oranı, sunucu uyarıları).  

### 3.3 İlerleme Takibi

- Faz 0 ve Faz A adımları tamamlandıkça `docs/implementation/ADMIN_PANEL_IMPLEMENTATION.md` (oluşturulduğunda) ve @admin-panel-manager kural dosyasındaki “Yapılan işler” / “Sıradaki adımlar” güncellenir.  
- ROADMAP’taki 5.8.x maddeleri @project-manager tarafından işaretlenir; detay ilerleme @admin-panel-manager alanındadır.

---

## 4. UI Yaklaşımı: Hazır Tema / Şablon Seçenekleri

*next-shadcn-dashboard-starter değerlendirildi; daha sektörde kullanılan, daha zengin alternatifler aşağıda.*

### 4.1 Önerilen Alternatifler (Sektörde Kullanılan)

| Seçenek | Açıklama | Artı | Eksi | Uyum |
|--------|----------|------|------|------|
| **Studio Admin (Vercel resmi)** | [arhamkhnz/next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) — Vercel template, ~1.8k ⭐ | Default + CRM + Finance 3 dashboard varyantı; RBAC; tema preset’leri (Tangerine, Neo Brutalist, Soft Pop); collapsible sidebar; Next 16 + Tailwind v4 + shadcn | Next 16 — proje Next 14 ise archive/next14-tailwindv3 branch kullanılabilir | shadcn, Tailwind, App Router ✅ |
| **NextAdmin** | Next.js 15, 200+ component, PostgreSQL, NextAuth | eCommerce / Analytics / Stock dashboard varyantları; auth, tablolar, grafikler hazır; production odaklı | Proje Next 14 → major upgrade veya uyarlama gerekebilir | Next, Tailwind, Postgres ✅ |
| **TailAdmin V2** | 400+ component, 6 varyant (eCommerce, SaaS, Stock, Analytics, CRM, Marketing) | Çok sayfa, temiz tasarım; Next/React/Vue/HTML seçenekleri | shadcn değil, kendi Tailwind component seti — projeye entegre etmek farklı | Tailwind ✅, shadcn ile birleştirmek ek iş |
| **Refine** | Headless admin framework (refine.dev) — UI’ı sen seçiyorsun (MUI, Ant, Chakra, Mantine) | CRUD/auth/routing hazır; data-intensive panel için hızlı; Next.js entegrasyonu var | Kendi UI’ını (shadcn) bağlamak ek konfigürasyon; “template” değil framework | Next.js + custom UI ile kullanılabilir |
| **Taxonomy** | [shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy) — shadcn’in kendi demo projesi, ~19k ⭐ | Stripe, MDX, App Router örnekleri; referans kalitesi yüksek | Next 13, “experiment” amaçlı; production template değil, örnek kod kaynağı olarak iyi | Eski Next; pattern’leri kopyalamak için uygun |
| **v0.app (Hibrit)** | Hazır tema yerine sadece v0.app ile sayfa sayfa üretmek | Tam kontrol, proje özelinde tasarım | Çok iş, tutarlılık ve layout’u kendin sağlamalısın | Mevcut shadcn/Tailwind ile uyumlu |

### 4.2 Kısa Öneri

- **Proje Next 14 + shadcn kalacaksa:** **Studio Admin**’in `archive/next14-tailwindv3` branch’i en mantıklı başlangıç (Vercel’de listelenen, tek resmi shadcn admin template). CRM/Finance sayfaları sipariş ve finans placeholder’ları için kullanılabilir.
- **Daha “hazır” çok sayfa istiyorsan:** **TailAdmin V2** veya **NextAdmin** — daha fazla ekran sunar ama Tailwind/component uyumu projeye göre test edilmeli.
- **Framework seviyesinde çözüm:** **Refine** — CRUD ve veri yönetimi ağırlıklı panel planlıyorsan, Refine + shadcn veya Refine + Mantine ile hızlı ilerlenebilir; Bull Board gibi özel ekranlar yine kendi sayfalarında kalır.

### 4.3 Hibrit Yol (Genel)

1. **Taban:** Seçilen bir şablon (örn. Studio Admin next14 branch) → layout, sidebar, auth, tablo yapısı.
2. **Özelleştirme:** Bull Board, kitap generating takibi, analytics/finans placeholder’ları v0.app veya elde koda ile eklenir.
3. **Entegrasyon:** Tümü `app/(admin)/admin/...` altında, mevcut admin kontrolü ile korunur.

---

## 5. Uygulama Planı — Studio Admin Entegrasyonu (KARAR)

**Seçilen şablon:** [Studio Admin (next-shadcn-admin-dashboard)](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) — ücretsiz, MIT lisans.

### 5.1 Nasıl Yapılacak

| Adım | Açıklama |
|------|----------|
| **Kaynak** | Repo: `https://github.com/arhamkhnz/next-shadcn-admin-dashboard` |
| **Branch** | Proje Next.js 14 kullandığı için **`archive/next14-tailwindv3`** kullanılacak (main = Next 16). |
| **Entegrasyon** | Şablonun layout, sidebar, sayfa yapısı HeroKidStory içine taşınacak; ayrı repo olarak çalıştırılmayacak. |
| **Route** | Tüm admin UI `app/[locale]/admin/...` (veya `app/(admin)/admin/...` route group) altında toplanacak. Örn. `/tr/admin`, `/en/admin` — locale ile uyumlu olup olmayacağı implementasyon sırasında netleştirilecek. |
| **Erişim** | **Sadece `user.role === 'admin'`** olan kullanıcılar girebilecek. Mevcut projede zaten `role === 'admin'` kontrolü API tarafında kullanılıyor; aynı mantık admin sayfaları için layout/middleware ile uygulanacak (giriş yoksa login’e yönlendir veya 403). |
| **İçerik** | İlk etapta iskelet kurulacak; sayfalar **zamanla doldurulacak**. Sipariş, finans, analytics placeholder’ları boş/örnek veri ile açılabilir. |

### 5.2 Ne Şekilde Olacak

- **Başlangıç:** Studio Admin’den layout (collapsible sidebar), default/CRM/Finance dashboard sayfaları, auth ekranları referans alınır; HeroKidStory auth (NextAuth + `role`) ile bağlanır.
- **Koruma:** Tüm `/admin` (ve altı) route’ları için server-side veya middleware ile oturum + `role === 'admin'` kontrolü. Admin değilse erişim reddedilir.
- **Zamanla doldurma:** Analiz dokümanındaki **Faz 0 → A → B → C → D** sırasıyla (Bölüm 3) içerik eklenecek: önce iskelet, sonra Ana Dashboard, Kitap Yönetimi, Bull Board, ardından Sipariş/Kullanıcı/Ayarlar, analytics ve ileri özellikler.
- **Takip:** İlerleme ve yapılan işler **@admin-panel-manager** agent’ı ve (ileride oluşturulacak) `docs/implementation/ADMIN_PANEL_IMPLEMENTATION.md` ile takip edilecek; agent yapılan işe göre kendi bilgisini güncelleyecek.

### 5.3 Referanslar

- Şablon README: https://github.com/arhamkhnz/next-shadcn-admin-dashboard  
- Next 14 branch: `archive/next14-tailwindv3`  
- Mevcut admin kontrolleri: `app/api/` içinde `role === 'admin'` kullanılan route’lar (tts/settings, debug, books skipPayment vb.)

---

## 6. Teknik Notlar

- **Route yapısı:** `app/(admin)/admin/...` — route group ile diğer sayfalardan izole
- **Auth:** Mevcut `requireAdmin()` middleware yeterli; oturumun geçerli olup olmadığı server-side kontrol edilir
- **Bull Board:** `app/api/admin/queues/[[...slug]]/route.ts` — BullMQ plan dosyasında tanımlı (Faz 3)
- **Real-time:** Başlangıçta polling yeterli (3-5s); ilerleyen aşamada SSE veya WebSocket
- **Grafik kütüphanesi:** Recharts (shadcn şablonlarda yaygın; mevcut shadcn/ui ile uyumlu)
- **Tablo:** TanStack Table v8 (server-side pagination + filtering)
- **Analytics kaynağı:** İlk aşama — kendi PostgreSQL sorgularıyla; ileride Vercel Analytics veya Plausible eklenebilir

---

## 7. Karar / Notlar (Cevaplanan Sorular)

- **2.6 Gerçek zamanlı analytics:** Veri kaynağı henüz belli değil. Yeri yapılıp boş bırakılacak; ileride analiz yapılıp implement edilecek.
- **2.7 Finansal metrikler:** Şimdilik yer bırakılacak, boş; Stripe/İyzico gelince doldurulacak.
- **2.8 Email şablonları:** Şimdilik yer bırakılacak, boş; ileride yönetim eklenebilir.
- **Admin şablonu:** Studio Admin (next-shadcn-admin-dashboard), branch `archive/next14-tailwindv3` — Bölüm 5’e bakınız.

## 8. Açık Sorular

1. Log görüntüleme: sadece hata logları mı, yoksa tüm sistem logları mı?

## 9. Referans Dosyalar

- `docs/roadmap/PHASE_5_LAUNCH.md` → 5.8.x maddeleri
- `.cursor/plans/book_generation_progress_ab3e0559.plan.md` → Bull Board / BullMQ planı
- `app/api/admin/` → Mevcut admin API'leri (ileride admin panel API’leri de burada veya altında)
- Mevcut admin kontrolü: `role === 'admin'` — `app/api/tts/settings`, `app/api/debug/*`, `app/api/books` (skipPayment, isExample vb.)

## 10. Admin Panel Agent (@admin-panel-manager)

Admin panelden sorumlu Cursor agent’ı: **`.cursor/rules/admin-panel-manager.mdc`**

- **Görevleri:** Bu analiz dokümanını ve (oluşturulduğunda) `docs/implementation/ADMIN_PANEL_IMPLEMENTATION.md` dosyasını takip etmek; admin panel ile ilgili işleri biliyor olmak; yapılan işlere göre implementation dokümanını ve kendi kural dosyasındaki “yapılan işler” / “sıradaki adımlar” gibi bölümleri güncellemek.
- **Kendini geliştirmesi:** Her önemli implementasyon adımı (şablon entegrasyonu, sayfa ekleme, Bull Board bağlama vb.) tamamlandığında, agent’ın referans verdiği implementation dokümanı ve gerekirse kural dosyası güncellenir; böylece agent sürekli güncel plan ve ilerlemeden haberdar olur.
- **Koordinasyon:** @project-manager ROADMAP’taki 5.8.x checkbox’larını işaretler; detaylı ilerleme ve admin-panel kararları @admin-panel-manager alanındadır.

## 11. Sorun Giderme

### Admin’e girerken dashboard’a yönlendiriliyorum
- **Sebep:** JWT token’da `role` yok. `role`, sadece **giriş anında** `auth.ts` içinde DB’den okunup token’a yazılıyor; eski oturumda token güncellenmez.
- **Çözüm:** **Çıkış yapıp tekrar giriş yap.** Yeni token’da `role: 'admin'` olacaktır (DB’de ilgili kullanıcının `role` değeri `admin` ise).
- **Log ile kontrol:** Geliştirme ortamında `/admin` isteğinde middleware terminale şunu yazar:  
  `[Admin middleware] pathnameWithoutLocale: /admin | token?.role: undefined | token?.id: ...`  
  `token?.role` `undefined` ise çıkış yapıp tekrar giriş yap. `admin` görünüyorsa ve yine yönlendiriliyorsan başka bir neden araştırılır.

### Admin Panel butonu sadece admin kullanıcıda
- Header’daki kullanıcı menüsünde (Kitaplığım, Ayarlar’ın yanında) **Admin Panel** linki yalnızca `session.user.role === 'admin'` ise gösterilir. Çeviri: `nav.adminPanel` (TR: "Admin Panel", EN: "Admin Panel").

---

*Bu doküman plan onaylıdır. Implementasyon başladığında `docs/implementation/ADMIN_PANEL_IMPLEMENTATION.md` oluşturulacak ve @admin-panel-manager tarafından takip edilecektir.*
