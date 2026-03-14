# EC2'de Proje Klasörünü kidstorybook → herokidstory Yapma

Sunucuda repo klasörü hâlâ `kidstorybook` ise aşağıdaki adımlarla `herokidstory` yapılır. **Kısa kesinti** olur (PM2 durdurulup yeniden başlatılacak).

---

## 1. Sunucuya bağlan

```bash
ssh -i herokidstory-key.pem ubuntu@EC2_IP
```

---

## 2. Uygulamayı durdur (PM2)

```bash
pm2 stop kidstorybook
# veya tüm process'leri durduruyorsan:
# pm2 stop all
```

Eğer PM2'de uygulama farklı bir isimle kayılıysa önce listele:

```bash
pm2 list
```

Gördüğün isme göre `pm2 stop <isim>` kullan.

---

## 3. Klasörü yeniden adlandır

```bash
cd ~
mv kidstorybook herokidstory
cd herokidstory
```

---

## 4. Git remote kontrolü (opsiyonel)

Repo zaten herokidstory ise remote doğru olabilir. Kontrol et:

```bash
git remote -v
```

Çıktıda `herokidstory.git` görünmeli. Eski `kidstorybook.git` ise güncelle:

```bash
git remote set-url origin https://github.com/cuneyt-medetoglu/herokidstory.git
```

---

## 5. PM2'yi yeni klasör ve isimle başlat

Eski kayıtı silip yeni isimle başlatmak en temizi:

```bash
pm2 delete kidstorybook
cd ~/herokidstory
pm2 start npm --name herokidstory -- run start:prod
pm2 save
```

(İlk kurulumda zaten `herokidstory` ismiyle başlattıysan sadece `pm2 start npm --name herokidstory -- run start:prod` yeterli.)

---

## 6. Cron / backup script yolu (varsa)

Günlük DB yedekleme cron'u kullanıyorsan yolu güncelle:

```bash
crontab -e
```

İçinde `kidstorybook` geçen satırları `herokidstory` yap. Örnek:

- Eski: `cd /home/ubuntu/kidstorybook` → Yeni: `cd /home/ubuntu/herokidstory`
- Eski: `.../kidstorybook/logs/db-backup.log` → Yeni: `.../herokidstory/logs/db-backup.log`

Log klasörü yoksa:

```bash
mkdir -p ~/herokidstory/logs
```

---

## 7. Kontrol

```bash
pm2 list
pm2 logs herokidstory --lines 20
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

200 dönmeli. Tarayıcıdan da EC2 IP:3000 (veya domain) ile dene.

---

## Özet komutlar (kopyala-yapıştır)

```bash
# 1. Durdur
pm2 stop kidstorybook

# 2. Yeniden adlandır
cd ~ && mv kidstorybook herokidstory && cd herokidstory

# 3. Git remote (gerekirse)
git remote set-url origin https://github.com/cuneyt-medetoglu/herokidstory.git

# 4. Eski PM2 kaydını sil, yeniden başlat
pm2 delete kidstorybook
pm2 start npm --name herokidstory -- run start:prod
pm2 save

# 5. Cron varsa: crontab -e ile kidstorybook → herokidstory değiştir
```

Bu adımlardan sonra sunucudaki repo ve çalışan uygulama **herokidstory** olarak geçer.
