# 5.5.6 Production Environment Variables – Kontrol Listesi

**Amaç:** EC2’deki `.env` dosyasındaki tüm değişkenlerin doğru, tutarlı ve güvenli olduğundan emin olmak.  
**Referans:** Sunucuda `cat .env` çıktısı veya prodenv.ini şablonu.

---

## 1. Zorunlu (uygulama çalışması için)

| Değişken | Beklenen (production) | Kontrol | Not |
|----------|------------------------|--------|-----|
| `DATABASE_URL` | `postgresql://kidstorybook:***@localhost:5432/kidstorybook` | ☐ | EC2’de DB aynı makinede; şifre güçlü ve sadece .env’de. |
| `NEXTAUTH_SECRET` | Uzun, rastgele base64 string | ☐ | Değiştirilmiş olmalı (varsayılan değil). |
| `NEXTAUTH_URL` | `http://EC2_IP:3000` (veya https://domain.com) | ☐ | IP ile test: IP:3000; domain sonrası https. |
| `NEXT_PUBLIC_APP_URL` | NEXTAUTH_URL ile aynı | ☐ | Build öncesi set; değişince yeniden build. |
| `NODE_ENV` | `production` | ☐ | Sunucuda mutlaka production. |
| `OPENAI_API_KEY` | `sk-proj-...` (geçerli key) | ☐ | Hikaye/görsel üretimi için zorunlu. |
| `AWS_S3_BUCKET` | Bucket adı (örn. kidstorybook) | ☐ | EC2 IAM role ile erişim varsa ACCESS_KEY/SECRET opsiyonel. |
| `AWS_REGION` | `eu-central-1` (veya bucket bölgesi) | ☐ | Bucket ile aynı bölge. |

---

## 2. Opsiyonel / Özelliğe göre

| Değişken | Durum | Kontrol | Not |
|----------|--------|--------|-----|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google ile giriş için | ☐ | Placeholder (`your_google_client_id`) ise Google giriş çalışmaz. |
| `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` | Facebook ile giriş için | ☐ | Placeholder ise Facebook giriş çalışmaz. |
| `GOOGLE_CLOUD_PROJECT_ID` | TTS için | ☐ | Proje adı (örn. kidstorybook). |
| `GOOGLE_APPLICATION_CREDENTIALS` | TTS JSON key dosya yolu | ☐ | Dosya EC2’de bu yolda olmalı (örn. `./kidstorybook-xxx.json`). |
| `NEXT_PUBLIC_STRIPE_*` / `STRIPE_*` | Ödeme (Stripe) | ☐ | Placeholder ise Stripe ödeme çalışmaz. |
| `IYZICO_*` | Ödeme (İyzico) | ☐ | Placeholder ise İyzico çalışmaz. |
| `GROQ_API_KEY` / `GOOGLE_AI_API_KEY` | Alternatif AI (opsiyonel) | ☐ | Boş/placeholder kabul edilebilir. |

---

## 3. Güvenlik

| Kontrol | ☐ |
|---------|---|
| Secret’lar (şifre, API key) sadece .env’de; repoda veya public yerde yok. | |
| .env ve prodenv.ini .gitignore’da (prodenv.ini zaten ignore’da). | |
| EC2’de .env dosya izinleri kısıtlı (örn. `chmod 600 .env`). | |
| AWS: Mümkünse EC2 IAM role kullan; ACCESS_KEY/SECRET key’leri .env’de tutma (role yeterli). | |

---

## 4. Production davranışı (önerilen)

| Değişken | Öneri |
|----------|--------|
| `NEXT_PUBLIC_ENABLE_LOGGING` | `false` (veya sadece hata ayıklama için true). |
| `DEBUG_LOGGING` | `false`. |
| `SHOW_DEBUG_QUALITY_BUTTONS` | `false` (veya sadece admin kullanıcılar için true). |

---

## 5. Mevcut durum özeti (sunucu .env’e göre – 12 Şubat 2026)

- **Doğru / kullanıma hazır:** DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_APP_URL, NODE_ENV, OPENAI_API_KEY, AWS_*, GOOGLE_CLOUD_PROJECT_ID, GOOGLE_APPLICATION_CREDENTIALS (dosya sunucuda olmalı).
- **Placeholder (özellik kapalı):** GOOGLE_CLIENT_ID/SECRET, FACEBOOK_*, STRIPE_*, IYZICO_*, GROQ_*, GOOGLE_AI_* — Bunlar kullanılacaksa gerçek değerlerle değiştirilmeli.
- **İsteğe bağlı sıkılaştırma:** NEXT_PUBLIC_ENABLE_LOGGING, DEBUG_LOGGING, SHOW_DEBUG_QUALITY_BUTTONS production’da false yapılabilir.

Checklist tamamlandığında FAZ5_5_IMPLEMENTATION.md’de 5.5.6 tamamlandı olarak işaretlenir.
