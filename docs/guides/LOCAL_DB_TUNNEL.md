# Local'de Prod AWS DB'ye Bağlanma (SSH Tüneli)

**Son güncelleme:** 13 Şubat 2026

## Özet

Local'de `npm run dev` çalıştırırken veritabanı istekleri (örn. `/api/examples`) **AWS EC2'deki PostgreSQL**'e gitmesi için **SSH tüneli** gerekir. Tünel açık değilse `ECONNREFUSED` (localhost:5432) hatası alırsınız.

## Doğru kullanım (iki terminal)

| Terminal | Komut | Açıklama |
|----------|--------|----------|
| **1** | `npm run ssh:tunnel` | Port 5432'yi EC2'deki PostgreSQL'e yönlendirir. Açık kalsın. |
| **2** | `npm run dev` | Next.js uygulaması; DB'ye localhost:5432 üzerinden (tünel sayesinde EC2'ye) bağlanır. |

## Önemli ayrım

- **`npm run ssh:tunnel`** → Sadece **tünel** (port yönlendirme). Shell açmaz. Local'de DB kullanmak için **bunu** çalıştırın.
- **`npm run ssh:server`** → Sunucuya **SSH ile giriş** (shell). Port yönlendirmesi **yapmaz**. Tünel yerine geçmez.

Tünel açılmadan sadece `npm run dev` çalıştırırsanız, DB kullanan sayfalar (ör. Examples) 500 ve log'da `ECONNREFUSED ::1:5432` / `127.0.0.1:5432` görürsünüz.

## .env

`DATABASE_URL=postgresql://kidstorybook:SIFRE@localhost:5432/kidstorybook`  
(Tünel açıkken localhost:5432, EC2'deki PostgreSQL'e gider.)

## Manuel tünel komutu

```bash
ssh -i kidstorybook-key.pem -L 5432:localhost:5432 -N ubuntu@EC2_IP
```

## Referanslar

- README → "Veritabanı bağlantısı (Local / Production)"
- `docs/implementation/FAZ5_5_IMPLEMENTATION.md` → İlerleme logu (13 Şubat 2026)
- `docs/plans/AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md` → SSH tüneli referansı
