# Faz 0 — Senin Yapacakların (Redis + PM2)

Kod tarafı hazır (paketler, `lib/queue/client.ts`, worker stub, `ecosystem.config.cjs`). Aşağıdakileri **sen** yapacaksın.

---

## 1. EC2'de Redis kur

SSH ile EC2'ye bağlan (mevcut anahtarınla), sonra:

```bash
sudo apt update
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
sudo systemctl status redis-server   # active (running) olmali
```

Sadece localhost'tan erişilsin (güvenlik):

```bash
sudo nano /etc/redis/redis.conf
```

Şu satırı bul ve değiştir (yoksa ekle):

```
bind 127.0.0.1
```

Kaydet, sonra Redis'i yeniden başlat:

```bash
sudo systemctl restart redis-server
```

### 1.1 Madde 1 kontrolleri (EC2'de çalıştır)

Redis kurulduktan sonra **aynı SSH oturumunda** şunları sırayla çalıştır:

```bash
# Servis çalışıyor mu?
sudo systemctl status redis-server
```
**Beklenen:** `Active: active (running)` satırı görünmeli. Çıkmak için `q` bas.

```bash
# Redis yanıt veriyor mu?
redis-cli ping
```
**Beklenen:** `PONG`

```bash
# Port 6379 dinleniyor mu?
redis-cli -p 6379 info server | head -5
```
**Beklenen:** `redis_version` vb. bilgiler gelmeli.

```bash
# Sadece localhost'a mı bağlı? (güvenlik)
grep -E "^bind " /etc/redis/redis.conf
```
**Beklenen:** `bind 127.0.0.1` (veya `bind 127.0.0.1 ::1`). Başka bir IP yoksa güvendeyiz.

Hepsi tamamsa Madde 1 tamamlandı.

---

## 2. Ortam değişkeni (isteğe bağlı)

Redis varsayılan olarak `localhost:6379` kullanıyor. Farklı bir adres/port kullanacaksan EC2'de (veya `.env` içinde) tanımla:

```
REDIS_URL=redis://localhost:6379
```

PM2 ile çalıştırırken bu env'in yüklü olduğundan emin ol (`.env` kullanıyorsan PM2 aynı dizinde çalıştığı için `dotenv` yüklemesi gerekebilir; şu an worker env'i sistemden alıyor).

---

## 3. PM2 ile web + worker başlatma

İlk kez (veya yeni deploy sonrası):

```bash
cd /path/to/herokidstory
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # reboot sonrasi otomatik baslamasi icin (ciktiyi kopyala calistir)
```

Sadece web'i yeniden başlatmak (mevcut alışkanlığın):

```bash
pm2 restart herokidstory
```

Web + worker ikisini birden:

```bash
pm2 restart all
```

Durum kontrolü:

```bash
pm2 status
# herokidstory        ve herokidstory-worker  listede olmali
```

---

## 4. Yerel (local) kurulum ve test

Bilgisayarında Redis olmadan worker çalışmaz. Aşağıdaki seçeneklerden birini kullan.

### 4.1 Seçenek A: Docker (en pratik)

Docker kuruluysa:

```bash
docker run -d --name redis-herokidstory -p 6379:6379 redis:7-alpine
```

Redis artık `localhost:6379` adresinde. Durdurmak: `docker stop redis-herokidstory`. Tekrar başlatmak: `docker start redis-herokidstory`.

### 4.2 Seçenek B: WSL (Windows)

WSL içinde Ubuntu açıp EC2’deki gibi kur:

```bash
sudo apt update && sudo apt install -y redis-server
sudo service redis-server start
redis-cli ping   # PONG
```

Projeyi WSL’de açıp `npm run worker` çalıştırabilirsin; Redis WSL’de çalışıyor olacak.

### 4.3 Seçenek C: Redis Windows (resmi değil)

[Memurai](https://www.memurai.com/) veya eski [Redis Windows portları](https://github.com/tporadowski/redis/releases) kullanılabilir; kurulum sonrası `localhost:6379` olmalı.

### 4.4 Yerel worker testi

Redis çalışır durumdayken (Docker / WSL / Windows):

```bash
cd C:\Users\Cüneyt\Desktop\BL\cuno\herokidstory
npm run worker
```

**Beklenen çıktı:**

```
[Worker] Starting book-generation worker...
[Worker] Listening for jobs on queue: book-generation
```

Durdurmak: **Ctrl+C**.

Yerel Redis kullanıyorsan `.env`’e eklemen gerekmez; kod zaten `redis://localhost:6379` kullanıyor. Farklı host/port istersen:

```env
REDIS_URL=redis://localhost:6379
```

---

## Özet

| Ne | Kim | Durum |
|----|-----|--------|
| npm paketleri (bullmq, ioredis, @bull-board/api) | Agent | ✅ Yapıldı |
| lib/queue/client.ts, worker stub, worker.ts, ecosystem.config.cjs | Agent | ✅ Yapıldı |
| EC2'de Redis kurulumu | **Sen** | Bekliyor |
| PM2 ile `pm2 start ecosystem.config.cjs` | **Sen** | Deploy sırasında |
| Migration (Faz 1) | Agent | Sonraki faz |

Redis'i kurduktan sonra Faz 1'e geçebiliriz.
