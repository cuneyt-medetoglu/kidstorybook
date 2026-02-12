# AWS Ortamı Sıfırdan Kurulum Rehberi (KidStoryBook)

**Amaç:** Yeni bir AWS hesabında veya bölgede, KidStoryBook için kullanılan ortamı (EC2 + PostgreSQL + S3) baştan kurmak. Bu doküman tek başına takip edilerek aynı ortam oluşturulabilir.  
**Bölge:** eu-central-1 (Frankfurt)  
**Mimari:** Tek EC2 (Ubuntu 24.04, t3.medium); aynı makinede PostgreSQL; tek S3 bucket + prefix’ler (photos, books, pdfs, covers).

---

## Değiştirmen Gereken Değerler

Kurulumda aşağıdakileri kendi değerlerinle değiştir:

| Değişken | Örnek | Açıklama |
|----------|--------|----------|
| `BUCKET_ADI` | kidstorybook | S3 bucket adı (global benzersiz) |
| `DB_SIFRE` | (güçlü şifre) | PostgreSQL kullanıcı `kidstorybook` şifresi |
| `EC2_IP` | 18.184.150.1 | EC2 public IP (veya Elastic IP) |
| `KEY_PEM` | kidstorybook-key.pem | Key pair dosya adı |

---

# 1. AWS Hesap ve Bölge

- AWS Console’a gir.
- Sağ üstten **bölge** seç: **Europe (Frankfurt) / eu-central-1**. Tüm kaynakları bu bölgede oluştur.

---

# 2. EC2 Instance

## 2.1 Güvenlik grubu

- **EC2** → **Security Groups** → **Create security group**.
- **Name:** kidstorybook-sg (veya benzeri).
- **Inbound rules:**
  - SSH (22) — Kaynak: My IP (veya 0.0.0.0/0 geçici).
  - HTTP (80) — 0.0.0.0/0.
  - HTTPS (443) — 0.0.0.0/0.
  - **Custom TCP (3000)** — 0.0.0.0/0 *(Next.js uygulaması IP ile test için; domain + Nginx sonra 80/443 kullanacak)*.
- **Create security group**.

## 2.2 Instance’ı başlat

- **EC2** → **Launch instance**.
- **Name:** kidstorybook-app (veya benzeri).
- **AMI:** Ubuntu Server 24.04 LTS (Quick Start → Ubuntu).
- **Instance type:** t3.medium.
- **Key pair:** Create new key pair → isim ver (örn. kidstorybook-key), .pem indir, güvenli sakla.
- **Network:** Default VPC. **Security group:** 2.1’de oluşturduğun.
- **Storage:** 8 GB gp3 (veya 20–30 GB).
- **Launch instance**.

Not: Public IP’yi (veya Elastic IP) not et. SSH: `ssh -i KEY_PEM ubuntu@EC2_IP`.

---

# 3. PostgreSQL (EC2 üzerinde)

EC2’ye SSH ile bağlan: `ssh -i KEY_PEM ubuntu@EC2_IP`.

## 3.1 Kurulum

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql && sudo systemctl start postgresql
```

## 3.2 Veritabanı ve kullanıcı

`DB_SIFRE` yerine güçlü bir şifre yaz (uygulama .env’de kullanacak).

```bash
sudo -u postgres psql -c "CREATE USER kidstorybook WITH PASSWORD 'DB_SIFRE';"
sudo -u postgres psql -c "CREATE DATABASE kidstorybook OWNER kidstorybook;"
sudo -u postgres psql -d kidstorybook -c "GRANT ALL ON SCHEMA public TO kidstorybook;"
```

## 3.3 auth şeması (migration’lar için)

```bash
sudo -u postgres psql -d kidstorybook << 'EOF'
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (id UUID PRIMARY KEY);
CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
  SELECT NULL::UUID;
$$ LANGUAGE sql STABLE;
GRANT USAGE ON SCHEMA auth TO kidstorybook;
GRANT SELECT, REFERENCES ON auth.users TO kidstorybook;
EOF
```

## 3.4 Migration’ları çalıştır

**3.4.1** Migration dosyalarını EC2’ye kopyala (laptop’tan):

```bash
scp -i KEY_PEM -r migrations ubuntu@EC2_IP:~/migrations
```

**3.4.2** EC2’de sırayla (şifreyi `DB_SIFRE` ile değiştir):

```bash
export PGPASSWORD='DB_SIFRE'
cd ~/migrations

psql -h localhost -U kidstorybook -d kidstorybook -f 00001_initial_schema.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 001_create_characters_table.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 002_update_books_table.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 003_create_books_table.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 007_add_pdf_columns.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 009_add_character_type.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 011_add_image_edit_feature.sql
```

**3.4.3** auth stub’ı 3.3’te zaten oluşturduysan aynı kalır. 012’den önce REFERENCES vermek için (eğer 012 hata verirse):

```bash
sudo -u postgres psql -d kidstorybook -c "GRANT REFERENCES ON auth.users TO kidstorybook;"
```

**3.4.4** Kalan migration’lar:

```bash
psql -h localhost -U kidstorybook -d kidstorybook -f 012_create_drafts_table.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 013_add_free_cover_to_users.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 014_guest_free_cover_used.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 015_add_user_role.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 016_add_is_example_to_books.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 017_tts_settings.sql
```

**Atlanan migration’lar:** 004, 005, 006, 008_add_pdf_mime_type, 008_create_tts_cache_bucket, 010 (Supabase storage/auth’a özel).

**Opsiyonel – RLS kapatma (uygulama tarafında yetki kullanacaksan):**

```bash
psql -h localhost -U kidstorybook -d kidstorybook << 'EOF'
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts DISABLE ROW LEVEL SECURITY;
EOF
```

## 3.5 Local'den prod DB'ye bağlantı

Local'de uygulama veya DBeaver ile prod DB'ye bağlanmak için **SSH tüneli** kullan (5432'yi açmak/pg_hba gerekmez; IP değişse de aynı). Adımlar: **README.md → "Veritabanı bağlantısı (Local / Production)"**.

---

# 4. S3 (Tek Bucket + Prefix’ler)

## 4.1 Bucket oluştur

- **S3** → **Create bucket**.
- **Bucket name:** BUCKET_ADI (örn. kidstorybook; alınmışsa kidstorybook-xxxx).
- **Region:** eu-central-1.
- **Block Public Access:** İlk aşamada açık bırakılabilir; 4.3’te kapatılacak.
- **Create bucket**.

## 4.2 Prefix’ler (klasörler)

- Bucket’a gir → **Create folder** (veya Upload → Create folder): `photos`, `books`, `pdfs`, `covers`.

## 4.3 Public read (sadece books, pdfs, covers)

- Bucket → **Permissions** → **Block public access** → **Edit** → “Block all public access” **Off** → Save.
- **Bucket policy** → **Edit**; aşağıdaki JSON’da `BUCKET_ADI` yerine kendi bucket adını yaz:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadBooksPdfsCovers",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": [
        "arn:aws:s3:::BUCKET_ADI/books/*",
        "arn:aws:s3:::BUCKET_ADI/pdfs/*",
        "arn:aws:s3:::BUCKET_ADI/covers/*"
      ]
    }
  ]
}
```

- **Save changes.**

## 4.4 IAM policy (S3 erişimi)

- **IAM** → **Policies** → **Create policy** → **JSON**.
- `BUCKET_ADI` yerine bucket adını yaz:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::BUCKET_ADI",
        "arn:aws:s3:::BUCKET_ADI/*"
      ]
    }
  ]
}
```

- **Next** → Policy name: kidstorybook-s3-policy → **Create policy**.

## 4.5 IAM role (EC2 için)

- **IAM** → **Roles** → **Create role**.
- **Trusted entity:** AWS service → **Service or use case** açılır listesinden **EC2** seç → **Next**.
- **Permissions:** kidstorybook-s3-policy’yi işaretle → **Next**.
- **Role name:** kidstorybook-ec2-s3 → **Create role**.

## 4.6 Role’ü EC2’ye ata

- **EC2** → **Instances** → instance seç → **Actions** → **Security** → **Modify IAM role** → kidstorybook-ec2-s3 seç → **Update IAM role**.

---

# 5. AWS CLI (EC2’de)

Ubuntu 24.04’te `apt install awscli` bazen yok; resmi kurulum:

```bash
cd /tmp
curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
sudo apt install -y unzip
unzip -q awscliv2.zip
sudo ./aws/install
rm -rf aws awscliv2.zip
```

Test (IAM role atandıysa access key gerekmez):

```bash
aws s3 ls s3://BUCKET_ADI/
```

Çıktıda `PRE books/`, `PRE covers/`, `PRE pdfs/`, `PRE photos/` görünmeli.

---

# 6. Node.js ve Proje (5.5.1 – EC2’de uygulama deploy)

EC2’ye SSH ile bağlıyken aşağıdaki sırayla ilerle. **Önce Node.js, sonra projeyi çek.**

## 6.1 Node.js 20 LTS kurulumu (Ubuntu)

```bash
# NodeSource repo ile Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kontrol
node -v   # v20.x.x
npm -v
```

## 6.2 Git kurulumu (yoksa)

```bash
sudo apt install -y git
git --version
```

## 6.3 Projeyi GitHub’dan EC2’ye çekme

**Seçenek A – Public repo:** Doğrudan clone.

```bash
cd ~
git clone https://github.com/KULLANICI_OR_ORG/kidstorybook.git
cd kidstorybook
```

**Seçenek B – Private repo:** SSH key veya token gerekir.

- GitHub’da **Settings → SSH and GPG keys** ile EC2’de oluşturduğun public key’i ekle; sonra:
  ```bash
  cd ~
  ssh-keygen -t ed25519 -C "ec2-kidstorybook" -f ~/.ssh/id_ed25519 -N ""
  cat ~/.ssh/id_ed25519.pub   # Bunu GitHub’a ekle
  git clone git@github.com:KULLANICI_OR_ORG/kidstorybook.git
  cd kidstorybook
  ```
- Veya **Personal Access Token** ile HTTPS:
  ```bash
  git clone https://TOKEN@github.com/KULLANICI_OR_ORG/kidstorybook.git
  cd kidstorybook
  ```

**KULLANICI_OR_ORG** ve repo adını kendi GitHub kullanıcı/org ve repo adınla değiştir.

## 6.4 Build ve çalıştırma (kısa)

Proje dizininde (`~/kidstorybook`):

```bash
npm ci
# .env dosyasını oluştur (8. bölümdeki örnek + diğer key'ler)
npm run build
npm run start
```

`.env` olmadan build/start hata verebilir; önce 8. bölümdeki gibi production `.env` oluştur. Process manager (PM2) için sonraki adım: `docs/implementation/FAZ5_5_IMPLEMENTATION.md` → 3.4.

## 6.5 Deploy ve sıfır kesinti (npm script’ler + PM2)

Projede hazır komutlar:

| Komut | Açıklama |
|--------|----------|
| `npm run clean` | Sadece `.next` (build çıktısı) siler |
| `npm run clean:all` | `node_modules` + `.next` siler |
| `npm run deploy:build` | Temiz kurulum: `clean:all` → `npm ci` → `build` (önerilen deploy öncesi) |
| `npm run deploy:build:fast` | Sadece `npm ci` + `build` (node_modules silinmez, daha hızlı) |
| `npm run start:prod` | `next start -p 3000` (PM2 ile kullanılacak komut) |

**Sıfır kesinti deploy akışı (EC2’de):**

1. Kodu çek: `git pull` (veya `git fetch && git checkout main`).
2. Temiz build: `npm run deploy:build` (node_modules + .next silinir, ci + build).
3. PM2 ile yeniden yükle (çalışan process’i yeniden başlatır, kesinti minimum):  
   `pm2 reload all` veya `pm2 reload kidstorybook`.

PM2 ilk kurulumda: `pm2 start npm --name kidstorybook -- run start:prod`. Sonraki deploy’larda sadece `git pull` → `npm run deploy:build` → `pm2 reload all`.

**Docker:** Docker ile deploy roadmap’te **5.5.9 (opsiyonel)** olarak sonraya alındı. Önce 5.5.1 (Node + PM2) tamamlanacak; istersen Docker’ı sonra ekleyebilirsin.

---

# 7. Özet Checklist (5.5.7 + 5.5.1 başlangıç)

- [ ] Bölge eu-central-1.
- [ ] EC2: Ubuntu 24.04, t3.medium, güvenlik grubu (22, 80, 443), key pair indirildi.
- [ ] PostgreSQL kuruldu; kidstorybook kullanıcı ve veritabanı oluşturuldu; auth stub (auth.users, auth.uid(), GRANT REFERENCES).
- [ ] Migration’lar sırayla uygulandı (00001, 001, 002, 003, 007, 009, 011 → auth stub → 012–016); 012 için gerekirse GRANT REFERENCES.
- [ ] S3: Tek bucket, prefix’ler (photos, books, pdfs, covers), bucket policy (public read books/pdfs/covers), IAM policy + EC2 role atandı.
- [ ] EC2’de AWS CLI kuruldu; `aws s3 ls s3://BUCKET_ADI/` başarılı.
- [ ] (5.5.1) Node.js 20 LTS kuruldu; proje `git clone` ile alındı; `npm ci && npm run build` çalıştı.

---

# 8. Uygulama .env Örnekleri

Ortam kurulduktan sonra uygulama tarafında kullanılacak değişkenler (örnek):

```bash
# PostgreSQL (EC2’deki DB)
DATABASE_URL=postgresql://kidstorybook:DB_SIFRE@localhost:5432/kidstorybook

# S3
AWS_S3_BUCKET=BUCKET_ADI
AWS_REGION=eu-central-1
# EC2’de IAM role kullanıldığı için AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY gerekmez (uygulama EC2’de çalışıyorsa).
```

---

**İlgili dokümanlar:**  
- [SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md](SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md) — Faz ilerlemesi (Faz 5–6 kaldı)  
- S3 / migration detay (referans): [archive/2026-02/aws-plans/](../archive/2026-02/README.md) — AWS_S3_SINGLE_BUCKET_PLAN, AWS_MIGRATIONS_ORDER
