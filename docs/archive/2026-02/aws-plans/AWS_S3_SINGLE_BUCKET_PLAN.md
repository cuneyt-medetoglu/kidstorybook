# S3: Tek Bucket + Klasör (Prefix) Planı – Adım Adım

**Tarih:** 6 Şubat 2026  
**Yöntem:** Tek bucket; içinde prefix’ler (photos, books, pdfs, covers). Supabase’deki 4 bucket mantığı aynı yapıda tutulur.  
**İlgili:** [SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md](SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md) Faz 4

---

## Özet yapı

| Supabase bucket | S3’te karşılık | Public read? |
|-----------------|----------------|---------------|
| photos          | `photos/`      | Hayır (private) |
| books           | `books/`       | Evet          |
| pdfs            | `pdfs/`        | Evet          |
| covers          | `covers/`      | Evet          |

- **1 bucket** adı: global benzersiz (örn. `kidstorybook` veya `kidstorybook-xxxx`).
- **4 prefix (klasör):** `photos/`, `books/`, `pdfs/`, `covers/`.
- Uygulama: aynı bucket adı + ilgili prefix ile yazar/okur.

---

## Adım 1 – Tek bucket oluştur

1. AWS Console → **S3** → **Create bucket**.
2. **Bucket name:** `kidstorybook` dene. “Already taken” gelirse `kidstorybook-` + hesap id’nin son 8 hanesi veya rastgele suffix ekle (örn. `kidstorybook-a1b2c3d4`).
3. **Region:** eu-central-1 (Frankfurt) — Faz 1’deki bölge.
4. **Block Public Access:** Şimdilik **tümünü açık bırak** (Block all). Public erişimi Adım 3’te bucket policy ile prefix bazlı açacağız.
5. **Bucket Versioning:** İsteğe bağlı (şimdilik Kapalı yeterli).
6. **Create bucket** ile oluştur.

**Kontrol:** S3 listesinde tek bucket görünmeli. Bucket adını not et (örn. `kidstorybook-a1b2c3d4`).  
✅ **Yapıldı:** bucket adı `kidstorybook`, bölge eu-central-1 (Frankfurt).

---

## Adım 2 – Prefix’leri (klasörleri) oluştur

S3’te klasör diye bir nesne yok; prefix’ler ilk dosya yüklendiğinde “klasör” gibi görünür. İstersen boş “klasör” oluşturmak için dummy object yükleyebilirsin; uygulama doğrudan `photos/userId/dosya.jpg` gibi key ile yazdığı için zorunlu değil.

**Seçenek A – Hiçbir şey yapma:** Uygulama ilk kez `photos/...`, `books/...` path’ine dosya atınca prefix’ler otomatik oluşur.

**Seçenek B – Boş prefix’leri şimdi oluştur:** AWS Console’da bucket’a gir → **Create folder** (veya **Upload** → **Create folder**):

- `photos`
- `books`
- `pdfs`
- `covers`

Her biri bucket kökünde bir “klasör” gibi görünür (arka planda `photos/`, `books/` vb. key prefix’i).

**Bu adım sonrası:** Bucket içinde bu dört prefix’i (istersen sadece isimlendirme olarak) not et; uygulama kodunda aynı isimleri kullanacaksın.

---

## Adım 3 – Public read (sadece books, pdfs, covers)

Amaç: `books/`, `pdfs/`, `covers/` altındaki dosyalar herkese açık okunabilsin; `photos/` private kalsın.

1. Bucket’a gir → **Permissions** sekmesi.
2. **Block public access (bucket settings):** **Edit** → “Block all public access”i **kapat**, değişikliği **Save** et. (Bucket policy ile sadece belirli prefix’lere izin vereceğiz.)
3. **Bucket policy** bölümünde **Edit** ile aşağıdaki policy’yi yapıştır. `BUCKET_ADI` yerine kendi bucket adını yaz (örn. `kidstorybook-a1b2c3d4`):

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

4. **Save changes.**

Sonuç: Sadece `books/*`, `pdfs/*`, `covers/*` public okunur; `photos/*` ve bucket listesi public değildir.  
✅ **Yapıldı:** Block all public access Off; bucket policy (PublicReadBooksPdfsCovers) kaydedildi.

---

## Adım 4 – EC2’den S3 erişimi (IAM Instance Role)

Uygulama EC2’den S3’e erişecek; bunun için EC2’ye bir IAM role bağlanır (access key kullanmadan).

### 4.1 – IAM policy (S3 için)

1. **IAM** → **Policies** → **Create policy**.
2. **JSON** sekmesi; `BUCKET_ADI` yerine kendi bucket adını yaz:

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

3. **Next** → Policy adı: `kidstorybook-s3-policy` (veya benzeri) → **Create policy**.

### 4.2 – IAM role (EC2 için)

1. **IAM** → **Roles** → **Create role**.
2. **Trusted entity:** "AWS service" seçili kalsın. **"Service or use case"** açılır listesinden **EC2** seç (EC2’nin AWS servislerini çağırması için). Sonra **Next**.
3. **Permissions:** Az önce oluşturduğun `kidstorybook-s3-policy`’yi seç → **Next**.
4. **Role name:** `kidstorybook-ec2-s3` (veya benzeri) → **Create role**.

### 4.3 – Role’ü EC2’ye ata

1. **EC2** → **Instances** → instance’ını seç.
2. **Actions** → **Security** → **Modify IAM role**.
3. Açılan listeden `kidstorybook-ec2-s3` (veya verdiğin ad) seç → **Update IAM role**.

---

## Adım 5 – EC2’den test

1. EC2’ye SSH ile bağlan.
2. AWS CLI yoksa: `sudo apt update && sudo apt install -y awscli`
3. Test (role atandığı için access key gerekmez):

```bash
aws s3 ls s3://BUCKET_ADI/
```

Boş veya az önce oluşturduğun prefix’ler görünmeli. Yükleme testi:

```bash
echo "test" | aws s3 cp - s3://BUCKET_ADI/books/test.txt
aws s3 ls s3://BUCKET_ADI/books/
```

Hata alırsan: IAM role’ün instance’a atandığını ve policy’de bucket adının doğru olduğunu kontrol et.

---

## Uygulama tarafında kullanım (referans)

- **Bucket adı:** Tek değişken (env: `AWS_S3_BUCKET` veya `NEXT_PUBLIC_S3_BUCKET`).
- **Path örnekleri:**
  - Fotoğraf: `photos/${userId}/ref.jpg`
  - Kitap görseli: `books/${userId}/${bookId}/page-1.jpg`
  - PDF: `pdfs/${userId}/${bookId}/kitap.pdf`
  - Kapak: `covers/${userId}/${bookId}/cover.jpg`
- **Public URL:** `https://BUCKET_ADI.s3.eu-central-1.amazonaws.com/books/...` (region’a göre değişir; veya CloudFront kullanılıyorsa onun domain’i).

---

## Özet checklist

- [x] Adım 1: Tek bucket oluşturuldu. Bucket adı: **kidstorybook** (eu-central-1).
- [x] Adım 2: Prefix’ler (photos, books, pdfs, covers) oluşturuldu.
- [x] Adım 3: Block public access Off; bucket policy (books/, pdfs/, covers/ public read) eklendi.
- [x] Adım 4: IAM policy + EC2 role oluşturuldu, role EC2’ye atandı.
- [x] Adım 5: EC2’den `aws s3 ls` ve (isteğe bağlı) `aws s3 cp` testi başarılı.

Bu planı tamamladıktan sonra [SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md](SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md) içinde Faz 4’ü işaretleyebilirsin.
