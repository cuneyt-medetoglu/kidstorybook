# GPT'ye Gönderilecek Sorular – Trace Analizi (7 Şubat 2026)

**Ekte:** `kidstorybook-trace-2026-02-07T21-54-35.json`  
Bu dosya, tek bir kitap oluşturma akışında tüm adımların (story → masters → cover → page_1 … page_N) **request** ve **response** çıktılarını içeriyor. Ekteki JSON'u inceleyerek aşağıdaki dört konuda somut öneri istiyorum.

---

## Kopyalanacak metin (GPT'ye yapıştır + dosyayı ekle)

```
Merhaba. Çocuklar için kişiselleştirilmiş resimli hikaye kitapları üreten bir uygulama (KidStoryBook) geliştiriyoruz. Ekteki JSON dosyası, tek bir kitap oluşturma akışının tam trace'i: hikaye LLM isteği/cevabı, karakter ve entity master görselleri, kapak, ve her sayfa görseli için giden request ve gelen response. Tüm adımlar "steps" dizisinde; her eleman { step, request, response } içeriyor.

Bu trace'e bakarak aşağıdaki dört konuda somut önerilerini istiyorum (mümkünse prompt değişikliği, API kullanımı veya veri yapısı önerisi olarak).

---

**1) El / parmak anatomisi**

Model (GPT Image 1.5) bazen el parmaklarını 5'ten fazla veya az çiziyor; parmaklar birbirine girmiş veya deforme görünüyor. Bu konuda prompt tarafında ne iyileştirilebilir?

- Şu an pozitif prompt'ta kullandığımız: [ANATOMY] 5 fingers each hand separated, arms at sides, 2 arms 2 legs, symmetrical face [/ANATOMY]; ayrıca "Preferred hand poses: hands at sides, simple wave, behind back".
- Negatif prompt'ta: "deformed", "extra limbs", "holding hands" (spesifik "6 fingers" gibi ifadeleri araştırma sonucu eklemiyoruz; modeli priming yapıp hatayı tetiklediği gerekçesiyle).
- Sorum: Bu sınırlar içinde, hem pozitif hem negatif tarafta el/parmak hatasını azaltacak ek veya değiştirilmiş cümleler önerebilir misin? Ya da modelin bu davranışı büyük ölçüde limitasyonu mu, prompt ile ne kadar iyileştirilebilir?

---

**2) Görsel ve hareket tekrarı (sayfa çeşitliliği)**

Bazı kitaplarda sayfalar birbirine çok benziyor: aynı tip hareketler (örneğin sayfa 6 ve 7'de "elleri açmış atlama"), aynı kompozisyon hissi. Hikaye metni farklı olsa bile görsel tekrar oluşuyor.

- Trace'te "story" step'inde LLM çıktısında her sayfa için imagePrompt, sceneDescription, characterExpressions vb. var. "page_1", "page_2" step'lerinde ise bu metinler + master referansları ile görsel isteği yapılıyor.
- Sorum: Bu tekrarı azaltmak için (a) hikaye prompt'unda (LLM'e verdiğimiz talimatlarda) "her sayfada farklı hareket, farklı sahne türü, kompozisyon çeşitliliği" gibi kuralları nasıl netleştirebiliriz? (b) Görsel (image) prompt'unda, "önceki sayfadan farklı ol: farklı kamera açısı / hareket / ortam" gibi bir direktif eklemek işe yarar mı, nasıl formüle edilmeli?

---

**3) customRequests olmadan zayıf sonuç**

Kullanıcı "custom requests" (özel istekler) alanına bir şey yazmazsa hikaye ve görsel kalitesi daha düşük oluyor; yazınca daha iyi sonuç alıyoruz.

- Şu an customRequests doğrudan hikaye prompt'una "Special Requests: …" olarak ekleniyor; boşsa "None" yazıyoruz.
- Sorum: customRequests boş olduğunda kaliteyi yükseltmek için ne yapmalıyız? Örneğin: (a) Veritabanında yaş grubu + tema/kategoriye göre varsayılan "örnek istekler" tutup bunları otomatik enjekte etmek mantıklı mı? (b) Ya da prompt'ta "eğer kullanıcı özel istek belirtmediyse şu alanları zenginleştir: …" gibi bir talimat vermek işe yarar mı? (c) Başka bir yaklaşım önerir misin?

---

**4) Yaşa göre metin (kelime) miktarı – basılı kitap için yetersiz**

Kitabı basılı kullanacağız: bir taraf tam sayfa görsel, diğer taraf tam sayfa yazı. Şu an özellikle küçük yaş gruplarında sayfa başı metin çok az (ör. ~10 kelime); yazı tarafı bomboş kalıyor, hikaye de akıcı okunmuyor.

- Mevcut hedefler (sayfa başı kelime aralığı): toddler 10–25, preschool 25–45, early-elementary 45–70, elementary 70–90, pre-teen 70–90.
- İstediğim: En küçük yaşın bile minimum hedefini kabaca şu anki değerin yaklaşık 3 katına çıkarmak; en büyük yaş grubu için ekte paylaştığım örnek sayfadaki gibi daha dolu metin (yaklaşık 150–180 kelime/sayfa civarı). Ara yaşları bu iki uç arasında oranlamak.
- Sorum: (a) Yaş bandına göre sayfa başı kelime hedefini (min–max) nasıl kademelendirelim? Somut sayı önerisi verir misin (toddler, preschool, early-elementary, elementary, pre-teen)? (b) LLM prompt'unda bu hedefleri nasıl net yazalım ki model tutarlı biçimde bu aralıklara uysun (ör. "Each page: X–Y words for this age group")?

---

Özet: Ekteki trace'i kullanarak yukarıdaki dört madde için mümkün olduğunca somut, uygulanabilir öneriler bekliyorum (prompt metni örnekleri, veri yapısı fikri veya "model limiti" gibi açıklama). Teşekkürler.
```

---

## Agent notu (GPT'ye göndermene gerek yok – senin bilgin için)

- **Parmak:** Kodda pozitif prompt'ta `[ANATOMY] 5 fingers each hand separated, arms at sides...`, safe poses: `hands at sides, simple wave, behind back`. Negatifte `deformed, extra limbs, holding hands` var; "6 fingers" gibi ifade bilinçli eklenmemiş (priming riski). GPT'den: ek güvenli pozitif/negatif ifade veya "model limiti" yorumu.
- **Tekrar:** Story tarafında "Each page = different scene", "Vary location, time of day, perspective, composition, action" var; görsel tarafında `getSceneDiversityDirectives(previousScene)` ile "DIVERSITY: Change location/perspective/composition" ekleniyor. Buna rağmen tekrar varsa: LLM'e sayfa bazlı "action type" çeşitliliği ve görsel prompt'a "previous page was X, this page use different Y" türü net direktif önerisi alınabilir.
- **customRequests:** Şu an sadece "Special Requests: …" ile geçiyor; boşsa "None". DB'de yaş+tema bazlı varsayılan metin tutup boşken enjekte etmek mantıklı bir seçenek; GPT'den yapı ve örnek cümle önerisi istenebilir.
- **Kelime:** Şu an toddler 10–25, preschool 25–45, early-elementary 45–70, elementary/pre-teen 70–90. Sen ~3x artış + büyük yaş 150–180 kelime istiyorsun; GPT'den kademeli aralık ve prompt formülasyonu isteniyor.

Bu dosyayı ve ekteki JSON'u GPT'ye gönderip cevapları aynı klasöre (veya STORY_PROMPT_ACTION_PLAN.md) not alabilirsin; istersen bir sonraki adımda bu cevaplara göre prompt ve kelime hedeflerini koda uyarlayacak maddeleri çıkarabilirim.

---

## GPT’nin kapsam sorusuna cevap (kopyala-yapıştır)

GPT şunu sordu: Sadece prompt mu, prompt + API stratejisi mi, yoksa veri yapısı/mimari de dahil mi? Aşağıdaki metni GPT’ye yapıştır.

```
Kapsamı şöyle netleştireyim; üç katmanın hepsini istiyoruz, önerileri buna göre verirsen çok işimize yarar:

1) **Prompt metni (LLM + görsel):** Evet. Her dört madde için ilgili prompt’larda ne ekleyelim / ne değiştirelim, mümkünse doğrudan örnek cümle veya blok ver (kopyala-yapıştır kullanabileceğimiz şekilde).

2) **API kullanımı ve strateji:** Evet. Örneğin: el/parmak için görsel API’ye ek parametre veya metadata kullanımı (hand pose vb.) varsa söyle; sayfa çeşitliliği için “önceki sayfa” bilgisini görsel prompt’a nasıl geçireceğimiz (hangi alan, nasıl formüle); kelime sayısı için LLM çıktısında sayfa başı kelime kontrolü veya doğrulama adımı öner. Bunlar uygulayabileceğimiz somut adımlar olsun.

3) **Veri yapısı / mimari:** Evet. Örneğin: customRequests boşken kullanılacak varsayılan metinler için yaş + tema bazlı tablo/yapı önerisi; sayfa geçmişiyle karşılaştırma (tekrar tespiti) için story veya sayfa verisinde tutulacak alanlar; kelime sayısı için post-process (sayfa metnini sayıp hedef aralığa uymuyorsa repair/uyarı) gibi. Kısa ve uygulanabilir mimari/veri önerisi yeterli.

Özet: Yalnızca prompt değil; prompt + API/strateji + veri yapısı/mimari üçünü de kapsayan, uygulamaya hazır örneklerle somut öneriler bekliyorum. Trace’teki mevcut request/response yapısına uygun öneriler verirsen doğrudan koda taşıyabiliriz.
```
