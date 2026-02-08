# GPT’ye Gönderilecek: IllustrationStyle + Sinematik / Karakter Odaklı Sorun

**Kullanım:** Aşağıdaki metni kopyalayıp GPT’ye yapıştır. Önceki konuşmada story request/response ve pipeline’ı anlattın; bu mesajla stilleri ve “kocaman karakter” konusunu netleştiriyorsun.

---

## Kopyalanacak metin

```
İki konuda daha senden bilgi ve öneri istiyorum.

---

**1) IllustrationStyle’larımız**

Kullanıcı kitap oluştururken bir “illüstrasyon stili” seçiyor. Bu stil hem hikaye LLM prompt’unda hem master hem kapak hem sayfa görseli prompt’larında kullanılıyor. Teknik olarak şu an şöyle:

- **Stil listesi (frontend’de seçilen):** 3d_animation, geometric, watercolor, block_world, collage, clay_animation, kawaii, comic_book, sticker_art (bazılarında tire/alt çizgi varyantı var). Bu stillerin hepsini tutuyoruz; sayıyı azaltmak gibi bir hedef yok.
- **Hikaye (LLM):** Prompt’ta "Illustration Style: 3d_animation" gibi geçiyor; model imagePrompt/sceneDescription’ı buna göre İngilizce üretiyor.
- **Master (karakter):** lib/prompts/image/style-descriptions.ts’teki STYLE_DESCRIPTIONS[styleKey] kullanılıyor (örn. 3d_animation = "Pixar-style 3D animation, Toy Story/Finding Nemo..., cartoonish, vibrant saturated colors, rounded shapes...").
- **Master (entity):** Aynı stil açıklaması + hayvan/nesne tarifi; text-only generations.
- **Kapak ve sayfa:** generateFullPagePrompt / buildCoverPrompt içinde getStyleDescription(illustrationStyle) ve getStyleSpecificDirectives(illustrationStyle) ile stil metne ekleniyor; ayrıca negative prompt’ta stil dışı terimler (STYLE_NEGATIVE) var.

Yani tüm pipeline aynı style key ile çalışıyor; tek kaynak style-descriptions.ts.

**İhtiyacım:** Sorun stillerin çokluğu değil — çıktı yeterince kaliteli ve sinematik animasyon hissi vermiyor (düz, “zayıf animasyon” havası). Bu yapıda (stil sayısı sabit, tek kaynak tanımlar) çıktı kalitesini ve sinematik hissi nasıl artırabiliriz? Stil tanımlarını mı güçlendirmeliyiz (örn. lighting, color grade, depth), prompt sırası veya art direction blokları mı, yoksa başka pratik adımlar mı önerirsin?

---

**2) Görseller çok karakter odaklı / “kocaman karakter”**

İlk konuşmada sana farklı örnek görseller atmıştım — daha sinematik, ortadaki konuya odaklanan, karakterin sahne içinde dengeli olduğu kompozisyonlar. Bizim ürettiğimiz görseller ise şu an çoğunlukla: kocaman karakter, etrafta nesneler, zayıf bir “animasyon havası” — yani karakter frame’i dolduruyor, ortam ikinci planda kalıyor.

Kod tarafında zaten şunlar var:
- "character 25-35% of frame, environment 65-75%"
- "character must NOT exceed 35% of frame"
- "wider shot, character smaller in frame"
- Rule of thirds, character on left/right third, "character NOT centered"
- getCharacterPlacementForPage, getAdvancedCompositionRules

Buna rağmen çıktı hâlâ karakter ağırlıklı. Olası sebepler sence neler olabilir?
- Reference (master) görseli çok büyük/dominant verildiği için model karakteri büyük mü çiziyor?
- Prompt’ta “match reference face/outfit” vurgusu, modeli karakteri öne almak için mi itiyor?
- 25–35% ifadesi yeterince vurgulu değil mi, yoksa shot type (wide / medium) ve kamera açısı (low-angle, eye-level) gibi daha net “sinematik” talimatlar mı eksik?

Senin önerdiğin globalArtDirection + shotPlan (shotType, cameraAngle, timeOfDay, layout) bu “kocaman karakter” problemini çözmek için uygulanabilir mi? Başka pratik adım önerir misin — örneğin prompt sırası (önce ortam, sonra karakter), negative prompt’a “character filling frame, character too large” eklemek, vb.?
```

---

Bu mesajı gönderdikten sonra GPT’nin cevaplarını (kalite/sinematik his için öneriler + “kocaman karakter” sebep/çözüm) STORY_PROMPT_ACTION_PLAN.md veya bu dosyaya not alabilirsin; 3.1 ve 3.2 maddeleri buna göre netleştirilebilir.
