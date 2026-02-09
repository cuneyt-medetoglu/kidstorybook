# EC2'de Migration Çalıştırma Rehberi

Bu rehber, `migrations/20260204_add_nextauth_support.sql` dosyasını EC2 (veya PostgreSQL'in çalıştığı sunucu) üzerinde nasıl çalıştıracağınızı anlatır.

---

## 1. PostgreSQL nerede çalışıyor?

- **EC2 üzerinde:** EC2'ye SSH ile bağlanıp orada `psql` kullanırsınız.
- **RDS veya başka sunucuda:** O sunucuya erişebilen bir yerden (EC2 veya SSH tüneli) bağlanırsınız.

---

## 2. Yöntem A: EC2'ye SSH, sonra psql

```bash
ssh -i kidstorybook-key.pem ubuntu@<EC2_IP>
# Migration dosyası proje dizinindeyse:
psql "$DATABASE_URL" -f migrations/20260204_add_nextauth_support.sql
```

SCP ile dosya kopyalama: `scp -i key.pem migrations/20260204_add_nextauth_support.sql ubuntu@<IP>:~/`

---

## 3. Yöntem B: DBeaver / pgAdmin ile SSH tüneli

- Host: 127.0.0.1, Port: 5433 (lokal tünel), Database: kidstorybook, User/Password: .env'deki DATABASE_URL'den.
- SSH: EC2 public IP, port 22, user ubuntu, key: .pem dosyası.
- Bağlandıktan sonra SQL Editor'de migration içeriğini yapıştırıp Execute.

---

## 4. Çalıştırılacak SQL (özet)

- `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;`
- `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`

Tam metin migration dosyasında. Bu rehber Şubat 2026 sonrası arşive taşındı. Güncel kurulum: docs/plans/AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md, README (Veritabanı bağlantısı).
