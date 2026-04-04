# Google Cloud: Yeni proje (herokidstory) — eski `kidstorybook` yerine

**Amaç:** Project ID değiştirilemediği için aynı faturalandırma ve benzer ayarlarla **yeni bir GCP projesi** açıp TTS (ve isteğe bağlı diğer GCP kaynaklarını) oraya taşımak; eski projeyi sonra kapatmak.

**HeroKidStory kodunda GCP tarafı:** öncelikle **Cloud Text-to-Speech** (`GOOGLE_CLOUD_PROJECT_ID` + service account JSON).

---

## Ön bilgi

| Konu | Durum |
|------|--------|
| Eski projede **Project name** “Herokidstory” yapıldı | İsteğe bağlı; **Project ID** yine `kidstorybook` kalır. |
| **Project ID** | Bir kez oluşturulunca **değişmez**; yeni proje = yeni ID. |
| **Fatura** | Yeni projeye **aynı Billing account** bağlanabilir (ayarlar aynı mantıkta). |

---

## Adımlar (checklist)

### 1) Yeni proje oluştur

- [ ] [Google Cloud Console](https://console.cloud.google.com/) → üstte proje seçici → **New project**.
- [ ] **Project name:** örn. `Herokidstory` (görünen ad).
- [ ] **Project ID:** müsaitse `herokidstory` (küçük harf, tire yok; alınmışsa benzersiz bir varyant seç, örn. `herokidstory-prod`).
- [ ] **Create** → yeni projeyi seçerek devam et.

### 2) Aynı ödeme hesabını bağla

- [ ] **Billing** → **My billing accounts** veya proje içinde **Billing** → **Link a billing account**.
- [ ] Eski `kidstorybook` projesinde kullandığın **aynı billing account**’u seç.

### 3) Gerekli API’yi aç

- [ ] **APIs & Services** → **Library**.
- [ ] **Cloud Text-to-Speech API** → **Enable**.

*(İleride başka GCP ürünü kullanırsan aynı menüden ilgili API’leri de açarsın.)*

### 4) Service account + JSON anahtar

- [ ] **IAM & Admin** → **Service Accounts** → **Create service account**.
- [ ] İsim: örn. `herokidstory-tts` → **Create and continue**.
- [ ] Role: TTS için genelde **`Cloud Text-to-Speech User`** (veya dar kapsam için dokümantasyona uygun rol) → **Done**.
- [ ] Oluşan service account’a tıkla → **Keys** → **Add key** → **Create new key** → **JSON** → indir.
- [ ] İndirilen dosyayı projende istediğin isimle kaydet, örn. `herokidstory-credentials.json` (içerik değişmez; sadece dosya adı).

### 5) Uygulama ortamını güncelle

- [ ] `.env` (local):  
  `GOOGLE_CLOUD_PROJECT_ID=<yeni Project ID>`  
  `GOOGLE_APPLICATION_CREDENTIALS=./herokidstory-credentials.json` (veya kullandığın dosya adı).
- [ ] **Sunucu (EC2):** Aynı JSON dosyasını uygulama köküne kopyala; sunucudaki `.env` / PM2 env’i yeni `GOOGLE_CLOUD_PROJECT_ID` ve dosya yolu ile güncelle.
- [ ] `pm2 reload` (veya restart) ile süreci yeniden başlat.

### 6) Doğrula

- [ ] Uygulamada sesli okuma / TTS tetikle → hata yok, ses üretiliyor.

### 7) Eski projeyi kapatma (dikkatli)

- [ ] Eski projede başka kullanılan kaynak yoksa (OAuth client, başka API key’ler, Vertex vb.) kontrol et.
- [ ] **Google ile giriş (OAuth)** eski projedeki OAuth client’a bağlıysa: ya client’ı yeni projede yeniden oluşturup `GOOGLE_CLIENT_ID` / `SECRET` güncelle, ya da geçişi planla.
- [ ] **IAM & Admin** → **Settings** → **Shut down** (veya kaynakları tek tek sil) — Google’ın uyarılarını oku; geri alınması zor olabilir.

---

## İlerleme / onay notları

| Tarih | Yapılan | Onay |
|-------|---------|------|
| *(doldur)* | Yeni proje oluşturuldu, billing bağlandı | ☐ |
| *(doldur)* | Text-to-Speech API etkin, service account + JSON | ☐ |
| *(doldur)* | Local + EC2 env ve key dosyası güncellendi, TTS test OK | ☐ |
| *(doldur)* | Eski `kidstorybook` proje kapatıldı / silinme planlandı | ☐ |

---

## Kısa not: OAuth (Google ile giriş)

TTS için yeni proje yeterli. **NextAuth Google OAuth** client’ı hangi GCP projesinde oluşturulduysa, tam taşıma istiyorsan yeni projede **OAuth consent screen + OAuth 2.0 Client ID** yeniden tanımlanıp redirect URI’lar kopyalanmalı; bu dokümanın ana kapsamı TTS’tir.
