# Örnek Hikaye Fikirleri Üretimi – Analiz

**Tarih:** 14 Şubat 2026  
**Referans:** [Magical Children's Book – Ideas](https://magicalchildrensbook.com/ideas) benzeri yaklaşım  
**Amaç:** Example story’ler üretip kitaplar oluşturacak; üretimde kullanılan prompt’ları kaydedip Custom Request adımında veya “aynı örnekten” isteyen kullanıcıya sunacağız.

---

## 1. Ne yapıyoruz?

- **Örnek kitap fikirleri** (Magical Children's Book Ideas sayfası gibi, aynısı değil ama yaklaşım benzeri): Her fikir için kısa konsept + örnek hikaye metni.
- Bu hikayelerden **kitaplar** oluşturulacak.
- Her fikir için kullanılan **GPT prompt’ları saklanacak**; böylece:
  - Custom Request adımında kullanıcıya örnek/fikir olarak sunulabilir,
  - “Bu örnekten istiyorum” diyene aynı prompt ile kitap üretilebilir.

**Şu anki odak:** Hikaye fikirleri üretmek (içerik + prompt tasarımı).

---

## 2. GPT ile nasıl üretebiliriz? (Prompt yaklaşımı)

- **Tek bir “meta-prompt”** ile: “Kategori X, yaş Y için 12 sayfalık çocuk kitabı senaryosu ve örnek hikaye metni üret; çıktıyı şu formatta ver.”  
- **İki aşamalı:** (1) Önce fikir/senaryo üret (başlık, özet, 12 sayfalık olay örgüsü); (2) Sonra bu senaryoya göre tam hikaye + sayfa metinleri üret.  
- Mevcut **story generation** prompt yapımız (`lib/prompts/story/base.ts`, `STORY_PROMPT_TEMPLATE.md`) zaten karakter + tema + sayfa sayısı + dil alıyor; “örnek fikir” üretimi için ya bu yapıyı **sadece konsept/senaryo çıktısı** verecek şekilde kullanırız ya da **ayrı bir prompt seti** yazarız (sadece fikir/senaryo + örnek paragraf, kitap oluşturmadan).

**Karar noktası:** Önce “sadece fikir + örnek story parçası” mı üretilecek, yoksa doğrudan “12 sayfalık tam story JSON” mı? Analiz için ikisi de mümkün; 12 sayfa için güçlü senaryo şart.

**Hazır prompt:** `docs/prompts/STORY_IDEAS_PROMPT.md` – GPT'ye verilecek meta-prompt (kategori, yaş grubu, çıktı formatı: başlık, konsept, 12 sayfa senaryo, örnek parça, custom request özeti). Kopyala-yapıştır ile kullanılabilir.

---

## 3. Farklı kategoriler

- Fikirler **kategori bazlı** olacak (Adventure, Animals, Fantasy, Nature, Holiday, Family, vb. – Magical’daki kategorilere benzer, kendi setimiz).
- Her kategori için en az bir örnek fikir (başlık + konsept + örnek metin) hedeflenebilir.
- Kategoriler, wizard’daki **tema seçenekleri** ve **Custom Request örnekleri** (2.4.5.1) ile uyumlu olmalı.

---

## 4. 12 sayfa hikayeye yetecek güçlü senaryo

- Üretilen her fikir, **12 sayfalık** kitaba yayılabilecek net bir **olay örgüsü** içermeli (giriş, gelişme, sonuç; sayfa bazlı kısa beat’ler).
- Mevcut story prompt’ta sayfa sayısı ve kelime hedefleri var; “örnek fikir” prompt’unda da “12 sayfa için yeterli olay ve sahne” talimatı açık yazılmalı.
- Çıktı: Ya (A) 12 sayfalık plan + örnek 1–2 sayfa metni, ya (B) doğrudan 12 sayfalık tam story (JSON) üretimi.

---

## 5. Yaş aralıklarına göre farklı üretim

- Mevcut yaş grupları: **0–2, 3–5, 6–9** (wizard’da kullanılıyor).
- Aynı “fikir” (örn. “Yeşil Ormanın Sırrı”) için **yaş grubuna göre** farklı dil karmaşıklığı, cümle uzunluğu ve temalar verilmeli.
- GPT prompt’una **yaş aralığı** parametresi eklenmeli; çıktı yaş grubuna göre işaretlenip saklanmalı (ileride DB’de yaş etiketli kullanım için).

---

## 6. Dil: İngilizce üretim, sonra lokalizasyon (TR ve diğer diller)

- **Şu an:** Hikaye fikirleri ve örnek metinler **İngilizce** üretilecek (GPT/LLM kalitesi ve format tutarlılığı için).
- **Sonra:** Lokalizasyon işi yapıldığında bu içerikler çeviri ile Türkçe ve diğer dillere taşınacak; DB’de desteklenen dillerle ilişkilendirilecek.
- Kaynak dil: en; saklamada `language: en` kullanılır. TR ve diğer diller çeviri tablolarından gelir.

---

## 7. Özet – Şu anki ihtiyaç

| Madde | Açıklama |
|-------|----------|
| **Çıktı** | Sadece TITLE + EXAMPLE STORY (tek anlatı paragrafı). Bu metin = custom request; sayfaları uygulama oluşturur. |
| **GPT** | Nasıl bir prompt ile üretileceği netleştirilmeli (meta-prompt veya mevcut story prompt’un fikir modu). |
| **Kategoriler** | Farklı kategorilerde fikir; tema/Custom Request ile uyumlu. |
| **Kalite** | Example Story, full kitabı besleyecek kadar zengin; sayfa senaryosu değil. |
| **Yaş** | 0–2, 3–5, 6–9’a göre farklı üretim. |
| **Dil** | Üretim İngilizce; TR ve diğer diller lokalizasyon (çeviri) ile eklenecek. |
| **Prompt saklama** | Üretilen her fikir için kullanılan prompt kaydedilecek; Custom Request’te veya “aynı örnekten” akışında kullanılacak. |

---

## 8. Roadmap bağlantısı

- **İlgili iş:** [Örnek hikaye fikirleri havuzu (2.4.5.x)](../roadmap/PHASE_2_FRONTEND.md) – roadmap’te ilgili yere iş eklendi.
- **İlişkili maddeler:** 2.4.5.1 (Custom request örnekleri), 2.4.3.1 (Custom theme / Other).
