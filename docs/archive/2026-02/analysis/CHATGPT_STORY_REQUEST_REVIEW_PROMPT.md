# ChatGPT’e Hikaye Request İncelemesi İçin Prompt

Aşağıdaki metni kopyalayıp ChatGPT’e yapıştır; sonra **storyrequest.json** dosyasının içeriğini (veya Debug modal’dan kopyaladığın request JSON’unu) ekte / aşağıya ekle. “Bu request yapısı ve prompt için yorum ve önerilerin neler?” diye sorabilirsin.

---

## Kopyalanacak prompt (Türkçe)

```
Biz çocuklar için kişiselleştirilmiş resimli hikaye kitapları üreten bir uygulama geliştiriyoruz (KidStoryBook).

**Yapı ve amaç:**
- Kullanıcı kendi çocuğunun fotoğrafından bir “karakter” oluşturuyor (isim, yaş, cinsiyet + yüz/vücut analizi: ten, saç, göz vb.).
- Kitap oluştururken tema (macera, fantazi, hayvanlar vb.), illüstrasyon stili (3d_animation, suluboya vb.) ve dil seçiyor.
- İlk adım: Bir LLM’e (GPT-4o-mini) hikaye metni + her sayfa için görsel prompt’ları (imagePrompt, sceneDescription, characterExpressions, supportingEntities vb.) ürettiriyoruz. Çıktı katı bir JSON şeması (sayfa sayısı, characterIds, characterExpressions, suggestedOutfits, supportingEntities zorunlu).
- Sonraki adımlar: Bu JSON’a dayanarak önce “master” illüstrasyonlar (karakter + hikayedeki hayvan/nesneler) üretiliyor, sonra kapak ve her sayfa görseli oluşturuluyor. Görsel tutarlılığı için karakter görünümü (saç, göz, ten) hem hikaye prompt’unda hem master/sayfa görsel prompt’larında kullanılıyor; hikaye metninde görsel detay yazmıyoruz (anlatı odaklı).

**Paylaştığım request:** Bizim hikaye üretim API’sine giden ve LLM’e iletilen tam isteğin debug çıktısı. İçinde:
- apiRequest: API’ye giden ham body (characterId, theme, illustrationStyle, language, pageCount vb.)
- characterResolved: characterId ile veritabanından çözülen karakter (isim, yaş, cinsiyet)
- aiRequest: LLM’e giden gerçek istek (model, systemMessage, userMessage). userMessage = tam hikaye prompt’u (karakter bilgisi, sayfa sayısı, tema, dil, güvenlik kuralları, JSON şeması, karakter ifadeleri vb.).

Lütfen bu request yapısı ve özellikle aiRequest.userMessage (hikaye prompt’u) için:
1. Netlik ve tutarlılık: Talimatlar anlaşılır mı, çelişen kısım var mı?
2. Eksik veya gereksiz tekrarlar: Eklenmesi veya kısaltılması gereken bölümler neler?
3. JSON çıktı kalitesi: Modelin doğru formatta ve zorunlu alanlarla dönmesi için prompt yeterince güçlü mü?
4. Çocuk kitabı kalitesi: Yaşa uygunluk, güvenlik, dil (ör. Türkçe hikaye / İngilizce görsel prompt) ayrımı doğru mu?
5. İyileştirme önerileri: Kısa, uygulanabilir 3–5 madde.

Yanıtını Türkçe ver; teknik terimleri (JSON, prompt, LLM) olduğu gibi bırakabilirsin.
```

---

## Kullanım

1. Yukarıdaki bloktaki metni kopyala.
2. ChatGPT’e yapıştır.
3. Hemen altına veya “Ekteki request:” diyerek `storyrequest.json` içeriğini yapıştır (veya sadece `aiRequest.userMessage` kısmını).
4. İstersen ek soru ekle: “Özellikle characterExpressions ve supportingEntities kısımlarını incele” gibi.

Bu prompt, yapımızı ve amacımızı özetleyip request’i bağlamına oturttuğu için ChatGPT’den doğrudan uygulanabilir yorum ve öneri almanı kolaylaştırır.
