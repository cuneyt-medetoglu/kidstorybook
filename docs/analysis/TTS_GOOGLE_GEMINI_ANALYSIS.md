## Google / Gemini TTS – Analiz ve Plan

**Tarih:** 9 Şubat 2026  

---

### Özet – Ne Yapıyoruz, Şu An Hangi Aşamadayız

| Aşama | Konu | Durum |
|-------|------|--------|
| **1** | TTS çalışmıyor (S3 erişim) | ✅ Çözüldü: signed URL kullanılıyor. |
| **1.5** | Admin TTS config (ses, ton/prompt, dil) + kullanıcıya görünürlük | ✅ Yapıldı. |
| **2** | Kitap oluşturulurken TTS önceden üretimi | ✅ Yapıldı (prewarm). |
| **3** | Kitap okuma UI – sesli okuma deneyimi | ✅ 3.1–3.3, 3.5 yapıldı; 3.4 atlandı. |

**Kısa özet:**  
TTS’i önce çalışır hale getirdik (1). Şimdi **admin’in ses adı, okuma tonu (prompt) ve dili global olarak yapılandırabilmesi** ve **son kullanıcının bu ayarları (sadece görüntüleyerek) görebilmesi** işini planlıyoruz (1.5). Sonra kitap oluşturma anında TTS üretimi (2) ve UI iyileştirmesi (3) gelecek.

---

### 0. Kapsam

- **Madde 1 – Google TTS çalışmıyor (bug analizi)**  
  - Mevcut akışın çıkarılması (backend `/api/tts/generate`, S3 cache, frontend `useTTS` + `BookViewer`).  
  - Olası kök nedenler ve çözüm (signed URL uygulandı).  

- **Madde 1.5 – Admin TTS konfigürasyonu (ses, ton/prompt, dil) + kullanıcı görünürlüğü**  
  - Admin: ses adı, okuma tonu (prompt), dil (ve istenirse model/hız) global varsayılan olarak ayarlanabilir; sadece admin bu ayarları görür ve değiştirir (sağ üst ayar menüsü veya admin sayfası).  
  - Son kullanıcı: admin’in belirlediği “hangi ses / hangi ton” bilgisini okuma ekranında sadece görür (read-only).  
  - Analiz bu dokümanda; uygulama onay sonrası yapılacak.

- **Madde 2 – Kitap oluşturulurken TTS’in önceden üretilmesi (henüz analiz YOK)**  
  - Trigger / event akışı, cache stratejisi ve performans analizi yapılacak.

- **Madde 3 – Kitap okuma UI’da sesli okuma deneyimi (henüz analiz YOK)**  
  - “Sesli kitap” vurgusu, kontrol tasarımı ve UX önerileri yapılacak.

---

## 1. Google TTS Çalışmıyor – Bug Analizi

### 1.1. Semptom Özeti

- Backend loglarında:
  - İlk çağrıda:  
    - `[TTS] Cache miss, generating audio: 600ba5a3`  
    - `[S3] Uploaded: tts-cache/600ba5a3...mp3`  
    - `POST /api/tts/generate 200 in 47526ms`
  - Sonraki çağrılarda:  
    - `[TTS] Cache hit: 600ba5a3`  
    - `POST /api/tts/generate 200 in ~100–180ms`
- AWS S3 konsolunda `tts-cache/` altında ilgili `.mp3` objeleri görünüyor.
- Kullanıcı tarafında ise **ses oynatılmıyor** (Google TTS “çalışmıyor” algısı).
- Log’lardan görülenler:
  - TTS isteği Google’a gidiyor, cevap dönüyor, buffer oluşturuluyor.  
  - S3’e upload başarılı (log var).  
  - API 200 dönüyor ve frontend’e bir `audioUrl` gönderiliyor.

**Çıkarım:** Sorun büyük ihtimalle **“ses üretilmiyor” değil**,  
**frontend’in dönen `audioUrl` üzerinden sesi başarılı şekilde çalamaması** ile ilgili.

---

### 1.2. Mevcut Teknik Akış (Kod Üzerinden)

- **Backend – `app/api/tts/generate/route.ts`**
  - Cache hash:  
    - `text + voiceId + speed + prompt` → `SHA-256` → `hash`.
  - Cache kontrolü:
    - `fileExists('tts-cache/{hash}.mp3')` → `true` ise  
      - `getPublicUrl(key)` ile **doğrudan public URL** üretiliyor.  
      - Response: `{ audioUrl, cached: true }`.
  - Cache miss:
    - `TextToSpeechClient` ile `gemini-2.5-pro-tts` modeli çağrılıyor.  
    - `response.audioContent` buffer’a çevrilip  
      - `uploadFile('tts-cache', '{hash}.mp3', buffer, 'audio/mpeg')` ile S3’e yazılıyor.  
      - Sonra yine `getPublicUrl(key)` ile URL üretilip response’a konuyor.

- **Storage – `lib/storage/s3.ts`**
  - Bucket ve region:
    - `bucket = process.env.AWS_S3_BUCKET`  
    - `region = process.env.AWS_REGION || 'eu-central-1'`
  - Upload:
    - `PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType })`
    - **ACL veya public-read ataması YOK.**  
    - Sadece `DEBUG_LOGGING === 'true'` iken `[S3] Uploaded: key` log’u yazılıyor  
      (terminal çıktısında bu log’u görüyoruz → debug açık).
  - Public URL hesaplama:
    - `https://${bucket}.s3.${region}.amazonaws.com/${key}`
    - Bu URL, **objenin herkese açık (public) olduğunu varsayıyor.**

- **Frontend – `hooks/useTTS.ts` ve `components/book-viewer/book-viewer.tsx`**
  - `useTTS().play(text, { voiceId, speed, language })`  
    - `/api/tts/generate` çağrısını yapıyor.  
    - Response’taki `data.audioUrl`’i `HTMLAudioElement.src` olarak atıyor.  
    - `canplaythrough` event’i gelmezse veya `error` event’i gelirse:
      - Hata mesajını `"Ses yüklenemedi. Ağ veya CORS hatası olabilir."` veya
        `"Ses yükleme zaman aşımı."` şeklinde state’e yazıyor.
  - `BookViewer`:
    - Sayfadaki metni alıp `play(...)` ile TTS’i tetikliyor.  
    - Autoplay modunda sayfa sonlarında tekrar `play(...)` çağrılıyor.

**Sonuç:** Backend, S3 ve frontend zinciri kod olarak doğru birbirine bağlı görünüyor;  
**sorun büyük ihtimalle S3 tarafındaki erişim/policy ile ilgili.**

---

### 1.3. Olası Kök Nedenler (Önceliklendirilmiş)

1. **S3 objeleri public değil (en güçlü aday)**
   - `uploadFile` içinde `ACL: 'public-read'` veya benzeri bir ayar yok.  
   - Bucket policy tarafında da `tts-cache/*` için public read izni verilmediyse,  
     `https://{bucket}.s3.{region}.amazonaws.com/tts-cache/{hash}.mp3`  
     adresi anonim kullanıcı için **403 Forbidden** döner.
   - Bu durumda:
     - Backend ve S3 log’ları başarılı görünür.  
     - Frontend’de `<audio src="...">` yüklenirken `error` event’i tetiklenir.  
     - `useTTS` hook’u `"Audio playback error"` veya `"Ses yüklenemedi. Ağ veya CORS hatası olabilir."`
       benzeri bir hata state’i üretir; ama bu hata şu an UI’da görünür bir şekilde gösterilmiyor.

2. **Bucket/region uyumsuzluğu (daha zayıf aday)**
   - `AWS_REGION` env değeri bucket’ın gerçek region’ı ile uyumsuzsa;  
     - S3 genelde 3xx redirect ile doğru region’a yönlendirir,  
       `<audio>` çoğu durumda redirect’i takip edebilir.  
     - Bu nedenle tamamen “çalışmama” değil, nadiren hata üretmesi beklenir.  
   - Semptomlar tamamen “hiç ses gelmiyor” olduğu için bu ihtimal düşük.

3. **Yanlış bucket ismi veya env konfigürasyonu (lokal/prod farkı)**
   - `AWS_S3_BUCKET` farklı bir bucket’a işaret ediyorsa:  
     - Log’da `[S3] Uploaded: tts-cache/...` görsek bile  
       aslında beklediğimiz bucket’tan farklı bir bucket’a yazıyor olabiliriz.  
   - Ancak ekran görüntüsünde beklenen prefix ile dosyalar göründüğü için  
     bu da birincil kök neden adayı değil.

4. **Gerçek TTS hatası (credentials / quota) – şu anki loglara göre düşük ihtimal**
   - `TextToSpeechClient.synthesizeSpeech` hata verseydi:  
     - `catch` bloğu `"TTS Error:"` ile log yazıp 500 dönerdi.  
     - Terminal çıktısında 500 yerine 200 gördüğümüz için  
       bu senaryo mevcut semptomlarla uyuşmuyor.

**Özet:** En olası kök neden, **S3 `tts-cache` objelerinin public olmaması**  
ve buna rağmen kodun `getPublicUrl` ile herkese açık URL üretmesi.

---

### 1.4. Önerilen Doğrulama Adımları

Bu adımlar kod değişikliği yapmadan, sadece gözlemle kök nedeni kesinleştirmek için:

1. **DevTools üzerinden `audioUrl`’i kontrol et**
   - `Network` tabında `/api/tts/generate` response’unu aç.  
   - `audioUrl` alanını kopyalayıp yeni sekmede aç:
     - Eğer **403 Forbidden** veya benzeri bir hata görüyorsan → bucket/ACL problemi teyit.

2. **S3 üzerinde objenin izinlerini kontrol et**
   - AWS konsolda ilgili `.mp3` objesini aç:
     - **Permissions → Object permissions** kısmında  
       - “Public access” kısmı **blocked** ise → URL ile public erişim yoktur.

3. **Bucket policy’yi kontrol et**
   - `Bucket policy` içinde `tts-cache/*` için  
     `s3:GetObject` izni, `Principal: "*"` olacak şekilde tanımlı mı?

4. **Frontend hata mesajını kısa süreliğine UI’da göster**
   - Test için: `BookViewer` içinde `useTTS`’ten gelen `error` state’ini  
     geçici bir `<div>` ile ekrana yazdırmak, sorunun gerçekten playback sırasında mı  
     çıktığını görmemize yardımcı olur (örn. “Audio playback error”).

Bu kontrollerden özellikle **1 ve 2** yapılırsa, sorunun  
public erişim / ACL kaynaklı olup olmadığı neredeyse kesinleşir.

---

### 1.5. Çözüm Önerileri

#### 1.5.1. Kısa Vadeli Fix – Public Okuma Yetkisi Ver (En Az Kod Değişikliği)

- **Amaç:** Şu anki mimariyi bozmadan, `getPublicUrl` ile üretilen URL’lerin gerçekten çalışmasını sağlamak.
- **Yapılacaklar (infra tarafı):**
  - S3 bucket policy’de `tts-cache/*` prefix’i için:
    - `s3:GetObject` iznini anonim kullanıcıya (`Principal: "*"`) açmak  
      (veya sadece bu prefix’e özel public bucket yapmak).
  - Alternatif olarak, `PutObjectCommand`’a `ACL: 'public-read'` eklemek  
    (bucket policy ile birlikte veya ayrı kullanılabilir).
- **Artıları:**
  - Kod tarafında sadece gerekirse küçük bir ek (ACL) ile çözülür.  
  - Mevcut `getPublicUrl` fonksiyonu aynen çalışmaya devam eder.
- **Eksileri:**
  - `tts-cache` objeleri public hale gelir (cache içeriği gizlilik açısından kabul edilebilir olmalı).

Bu çözüm, ürün tarafında **en hızlı şekilde “Google TTS çalışıyor”** hissini geri getirecek yaklaşım.

#### 1.5.2. Orta Vadeli İyileştirme – Signed URL Kullan (Daha Güvenli Mimari)

- **Amaç:** Bucket’ı private bırakıp, sadece ihtiyacı olan istemcilere süreli erişim vermek.
- **Yapı:**
  - `lib/storage/s3.ts` içinde `getPublicUrl` yerine:
    - `GetObjectCommand` + `getSignedUrl` (`@aws-sdk/s3-request-presigner`) kullanarak  
      belirli süreli (örn. 1 saat) signed URL üretmek.
  - TTS cache:
    - `getCachedAudio` ve `saveCachedAudio` fonksiyonları signed URL dönecek şekilde güncellenir.
- **Artıları:**
  - Bucket tamamen private kalır.  
  - Güvenlik ve kontrol daha yüksek.
- **Eksileri:**
  - Kod tarafında daha fazla değişiklik gerekir.  
  - Signed URL süresi bittiğinde eski `audioUrl`’ler geçersiz olur  
    (okuma sayfasında yeniden TTS çağrısı tetiklenerek çözülebilir).

---

### 1.6. Önerilen Log İyileştirmeleri

Analizi ve olası future debugging’i kolaylaştırmak için, kod değişikliği yapılırken şu log’lar eklenebilir:

- **Backend (`/api/tts/generate`):**
  - Cache hit durumunda:
    - `console.log('[TTS] Cache hit URL:', cachedUrl)`
  - Cache miss sonrasında:
    - `console.log('[TTS] Generated audio, cacheUrl:', savedCacheUrl || 'DATA_URL_FALLBACK')`

- **Frontend (`useTTS`):**
  - `catch` bloğunda:
    - Hata mesajını `console.error("[TTS] Playback error:", err)` ile loglamak  
      (şu an sadece state’e yazılıyor, konsola basılmıyor).

Bu log’lar sayesinde, ileride S3 veya TTS ile ilgili başka problemler çıktığında  
tek başına terminal / browser konsolu üzerinden root cause’a daha hızlı gidilebilir.

---

## 1.5. Admin TTS Konfigürasyonu (Ses, Ton, Dil) + Kullanıcı Görünürlüğü

**Amaç:** Google Cloud TTS’te beğenilen davranışı (ör. `input.prompt`: "heyecanlı çocuk hikayesi tonunda", `voice.name`: Achernar, `languageCode`: tr-tr) **yapılandırılabilir** yapmak. Ayarlar **sadece admin** tarafından yapılsın, **global** (tüm kullanıcılar için) geçerli olsun; **son kullanıcı** ise hangi ses / ton / dil kullanıldığını **görebilsin** (değiştiremesin).

### 1.5.1. Google Cloud Tarafı – Referans İstek

Senin test ettiğin örnek:

- **Endpoint:** `https://texttospeech.googleapis.com/v1beta1/text:synthesize`
- **Önemli alanlar:**
  - `input.prompt`: okuma tonu (örn. "heyecanlı çocuk hikayesi tonunda") → **configurable**
  - `voice.name`: ses adı (örn. Achernar) → **configurable**
  - `voice.languageCode`: dil (örn. tr-tr) → **configurable**
  - `voice.modelName`: model (örn. gemini-2.5-flash-tts) → istenirse configurable
  - `audioConfig.speakingRate`, `audioConfig.pitch` → istenirse configurable

Şu an uygulamamızda: prompt sadece cache hash’te kullanılıyor, **API’ye `input.prompt` gönderilmiyor**; ses ve dil ise sabit/tek seçenek (Achernar, dil kodu dil parametresinden). Bunları admin’in seçtiği **global varsayılanlara** bağlamak gerekiyor.

### 1.5.2. Neyi Konfigüre Edeceğiz (Admin)

| Parametre | Açıklama | Örnek |
|-----------|----------|--------|
| **Ses (voice name)** | Gemini TTS ses adı | Achernar, (ileride diğer sesler) |
| **Okuma tonu (prompt)** | API’deki `input.prompt` | "heyecanlı çocuk hikayesi tonunda", "uykuya hazırlık sakin ton" vb. |
| **Dil (language code)** | Varsayılan dil kodu | tr-tr, en-us vb. |
| (Opsiyonel) Model | gemini-2.5-flash-tts / gemini-2.5-pro-tts | İleride dropdown |
| (Opsiyonel) Hız / pitch | speakingRate, pitch | İleride slider/select |

Bu alanlar **sadece admin** tarafından, **sağ üstteki mevcut ayar menüsü** içinde (veya admin’e özel bir “TTS ayarları” sayfasında) düzenlenebilir. Kaydedildiğinde **global varsayılan** olarak saklanır; tüm kullanıcıların TTS istekleri bu varsayılanlarla üretilir.

### 1.5.3. Config Nerede Saklanacak

- **Seçenek A:** Veritabanında tek satır (örn. `app_settings` veya `tts_defaults` tablosu: `voice_name`, `prompt`, `language_code`, `updated_at`). Admin UI bu kaydı günceller.
- **Seçenek B:** Başlangıçta env / config dosyası (daha az esnek; admin UI ile değiştirmek için ek iş gerekir).

Öneri: **Veritabanı (A)**. Böylece admin panelden anlık güncelleme ve “global herkese set” davranışı net olur.

### 1.5.4. Son Kullanıcı Görünürlüğü

- **Gereksinim:** Son kullanıcı, admin’in koyduğu TTS ayarlarını **görebilmeli** (hangi ses, hangi ton kullanılıyor).
- **Uygulama fikri:**
  - Okuma ekranında (kitap viewer) sesli okuma bölümünde kısa bir bilgi metni veya ikon + tooltip: örn. “Ses: Achernar”, “Ton: Heyecanlı hikaye”.
  - Ayarlar global olduğu için bu bilgi bir “TTS bilgisi” endpoint’inden (örn. `GET /api/tts/settings`) veya mevcut bir config endpoint’inden dönülebilir; frontend sadece okur, değiştirmez.
- **Son kullanıcı ses/ton değiştiremez;** sadece play/pause, hız (ve varsa volume) gibi mevcut kontroller kalabilir. Ses adı ve ton metni **read-only** gösterilir.

### 1.5.5. Akış Özeti

1. Admin, sağ üst ayar menüsünde (sadece admin görür) “TTS varsayılanları” alanını açar: ses adı, prompt metni, dil kodu (ve istenirse model/hız) girer, kaydeder.
2. Backend bu değerleri DB’de global varsayılan olarak saklar.
3. `/api/tts/generate` çağrıldığında: istekte explicit parametre yoksa **bu global varsayılanlar** kullanılır (voice, prompt, language); cache hash’e prompt ve voice zaten dahil.
4. İstemci, “şu an hangi TTS ayarları geçerli?” bilgisini `GET /api/tts/settings` (veya benzeri) ile alır; kitap okuma UI’da “Ses: …”, “Ton: …” olarak **sadece gösterir**.

### 1.5.6. Teknik Notlar

- **API uyumu:** Şu an `@google-cloud/text-to-speech` kullanılıyor; `input.prompt` desteklenmiyorsa `v1beta1` REST çağrısı (fetch/axios) ile prompt gönderilebilir. Vertex AI / Cloud Console’da kullandığın istek formatı (input.prompt, voice.modelName) backend’e taşınmalı.
- **Cache:** Hash’e zaten `prompt` ve `voiceId` dahil; global prompt/voice değişince yeni hash’ler üretilir, eski cache’ler yeni ayarla tekrar üretilmez (doğru davranış).
- **Dil:** Kitap bazlı dil hâlâ kullanılabilir; global “varsayılan dil” sadece dil bilgisi gelmediğinde devreye girer. İstersen tüm kitaplar için tek dil zorunlu da yapılabilir (ürün kararı).

Bu bölüm **sadece analiz**dir; uygulama adımları (DB şeması, API route’ları, admin UI, kullanıcı görünürlüğü) onay sonrası yapılacak.

---

## 2. Kitap Oluşturma Anında TTS Üretimi ✅ Uygulandı

**Yapılanlar:**
- **`lib/tts/generate.ts`:** TTS üretim mantığı (cache kontrolü, Google TTS, S3 cache) paylaşılabilir `generateTts(text, options)` fonksiyonuna taşındı.
- **`POST /api/tts/generate`:** Bu lib’i kullanacak şekilde sadeleştirildi.
- **Kitap tamamlanınca prewarm:** `POST /api/books` içinde, tüm sayfa görselleri üretilip kitap `completed` yapıldıktan hemen sonra her sayfa metni için `generateTts(page.text, { language: bookLanguage })` çağrılıyor. Böylece kullanıcı kitabı açtığında sesler zaten cache’de olur (ilk dinlemede bekleme azalır).
- **Hata toleransı:** Bir sayfa TTS’i hata verse bile diğerleri üretilmeye devam eder; kitap oluşturma başarısız sayılmaz, sadece log’a yazılır.

- **İncelenecek başlıklar:**
  - Kitap oluşturma akışı (`/api/books` pipeline’ı) ve event noktaları.  
  - Kitap/sayfa bazlı TTS stratejisi (tek dosya mı, sayfa sayfa mı?).  
  - Cache hash tasarımı (bookId, pageNumber, language, voice vs.).  
  - Background job / queue ihtiyacı ve zamanlama (senkron vs. asenkron üretim).  
  - Maliyet ve performans etkisi (ilk oluşturma süresi, kullanıcı bekleme deneyimi).  
  - Hata toleransı (TTS üretimi başarısız olursa kitabın kendisinin etkilenmemesi).

- **Yeni eklenecek analiz başlığı (okuyan kişi / anlatıcı konfigürasyonu):**
  - “Anlatıcı profili” (reader persona) kavramının tanımı:
    - Örnekler: “Neşeli hikâye anlatıcısı”, “Uykuya hazırlık, sakin anlatıcı”, “Macera modu, heyecanlı anlatıcı”.  
  - Bu profilin hangi parametrelerle temsil edileceği:
    - `voiceId` (hangi Gemini Pro sesi), `speed`, olası `pitch` ve dil bazlı prompt seçimi.  
  - Profili nerede konfigüre edeceğimiz:
    - Kitap seviyesinde (kitap oluşturulurken seçilen profil) mi,
    - Kullanıcı/çocuk profili seviyesinde (hesap ayarı) mi,
    - Yoksa okuma anında seçilebilen mod (UI’de “Uyku modu / Neşeli modu” toggle’ları) mı.  
  - TTS cache hash’ine bu profil bilgisinin nasıl ekleneceği:
    - Örneğin: `text + voiceId + speed + prompt + personaId`.  
  - PRD ve `docs/strategies/TTS_STRATEGY.md` içindeki “Modlar (Uyku, Neşeli, Samimi)” maddesiyle  
    bu yeni profil konseptinin nasıl hizalanacağı.

Detaylı analiz ve çözüm tasarımı, **Madde 1’in fix’i netleştikten sonra** bu bölüm altında doldurulacak.

---

## 3. Kitap Okuma UI – Sesli Okuma Deneyimi

### 3.0 Analiz (İlk tur – 9 Şubat 2026)

**Hedef:** Çocuklar kullanacak → okuyucu ekranı **sade**; ses/config işleri **Parent Settings**’e taşınsın veya oraya eklensin. İlerleme adım adım, tartışarak dokümanda notlanacak.

---

#### Mevcut durum özeti

| Yer | Ses / TTS ile ilgili ne var |
|-----|-----------------------------|
| **BookViewer header** | Dişli (Settings) dropdown: Autoplay (off / TTS synced / timed), Timed hızı (5–20s), **Ses/Ton** (read-only), **TTS hız** (0.75 / 1 / 1.25), Admin için TTS varsayılanları dialog. |
| **BookViewer footer** | Sol: Önceki sayfa. Ortada: **Autoplay** (aç/kapa) + **Play/Pause** (sadece autoplay kapalıyken). Sağ: Sonraki, thumbnails, bookmark, share, **Parent Settings** linki. |
| **Parent Settings** (`/books/[id]/settings`) | Kitap bilgisi, Edit Images, Edit History, Actions (PDF, Share, Delete). **Ses / TTS ayarı yok.** |
| **Metin vurgusu** | TTS oynarken hangi metnin okunduğu vurgulanmıyor (sayfa bazlı veya kelime bazlı highlight yok). |

Özet: Ses kontrolleri (play/pause, autoplay) footer’da; hız/ses/ton ve bir sürü başka ayar tek bir Settings dropdown’da. Parent Settings sayfasında sesle ilgili hiçbir şey yok.

---

#### Kararlar (tartışmaya açık)

1. **Çocuk odaklı sade tasarım**  
   Okuyucuda çocuğun gördüğü: **büyük, anlaşılır** butonlar (oynat/durdur, sayfa ileri/geri, belki “sesli oku” modu). Karmaşık ayarlar (TTS hızı, ses seviyesi, animasyon türü vb.) çocuk arayüzünden çıkarılacak veya gizlenecek.

2. **Ses ve config → Parent Settings**  
   TTS hızı, ses seviyesi (volume), “varsayılan sesli okuma açık/kapalı” gibi ayarlar **Parent Settings** sayfasına taşınacak veya oraya eklenecek. Böylece okuyucu ekranı sade kalır; ebeveyn tek kitap için veya genel tercihleri oradan yönetir.

3. **Admin TTS varsayılanları**  
   Global ses/ton/dil (admin) şu an BookViewer Settings dropdown’da. Bu ya dashboard/admin sayfasına taşınır ya da Parent Settings’te “sadece admin görür” bir blok olarak kalır — sonra netleştirilecek.

---

#### Sonraki adımlar (sıra önerisi)

| Adım | Ne | Not |
|------|----|-----|
| **3.1** | Parent Settings’e “Sesli okuma” bölümü ekle | ✅ Yapıldı. Card “🔊 Sesli Okuma”: okuma hızı (Yavaş/Normal/Hızlı), ses seviyesi (slider 0–100%). Tercihler `lib/tts-prefs.ts` ile localStorage’ta (`kidstorybook_tts_prefs`), kullanıcı bazlı global. |
| **3.2** | BookViewer’ı sadeleştir | ✅ Yapıldı. Footer’a **Ses aç/kapa (mute)** butonu eklendi (Volume2/VolumeX). Hız ve ses seviyesi artık prefs’ten okunuyor. Settings dropdown’dan “Voice” ve “Speed” menüleri kaldırıldı; sadece admin için “TTS varsayılanları” kaldı. |
| **3.3** | “Bu kitap sesli” vurgusu | ✅ Done: Completed kitaplarda E-Book + "Read aloud" badge (Volume2). “Sesli” / “Sesli okunabilir” UI EN; localization later. |
| **3.4** | Metin vurgusu | ⏭️ Şimdilik atlandı. Çocuklar tablet/telefondan okuyacak; flip ile yazıya geçiliyor, sayfa vurgusu mobilde yeterince görünmüyor. İleride farklı bir çözüm düşünülebilir. |
| **3.5** | Çocuk UX iyileştirmesi | ✅ Yapıldı. Footer: mobilde min 44px dokunmatik alan (h-11 + min-h-[44px]), tüm butonlarda basınca hafif scale (active:scale-95), ikonlar md’de h-6. |

---

#### Tartışma notları / Alınan kararlar

- **Saklama:** Değişiklik varsa **o kullanıcı için global** — yani TTS hızı, ses seviyesi, “varsayılan sesli oku” gibi tercihler kullanıcı bazlı ve tüm kitaplar için geçerli. (Kitap bazlı tercih yok; ileride gerekirse eklenebilir.)
- **Ses açıp kapatma:** Okuyucuda **ses aç/kapa (mute)** de olacak — çocuk veya ebeveyn tek tıkla sesi kapatıp açabilsin. (Oynat/Durdur + Otomatik oku + Mute birlikte düşünülecek.)

Bu bölüm, her adım tamamlandıkça veya karar değiştikçe güncellenecek.

