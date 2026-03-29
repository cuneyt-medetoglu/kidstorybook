# Hazır hikayeler ve “fikir → kitap” hattı — kısa plan

**Durum:** Tasarım / kurgu notu. Kod veya arayüz geliştirmesi bu dokümana bağlı değildir.

## Bağlam

- `tum_hikayeler.json` (örnek kaynak): Çok sayıda giriş; her birinde kabaca **başlık**, **kaynak URL** ve **kısa örnek metin** (`example_story`) var. Amaç bu metinleri kopyalamak değil; **aynı türde bir mantığı** (fikir + ton + kısa özet hissi) anlamak ve kendi üretimimizi buna göre yapılandırmak.

## Hedef

1. **Yaş kategorisi** ve **karakter** (ve diğer girdiler) ile tutarlı, **özgün** hikayeler üretebilmek.
2. Üretimi denemek için ileride **basit bir HTML arayüz** ve API üzerinden model seçimi düşünülebilir.
3. Çıktılar, **Examples** sayfasında kullanılacak **hazır hikayeler** için ham / yarı mamül içerik üretmeye hizmet edecek.

### Model (Examples — kalite öncelikli)

- **Examples** için hazır hikâye üretiminde **kalite en önemli kriter**; bu iş **tek seferlik / düşük hacim** ve **yayınlanacak örnekler** olduğundan maliyet ikincil planda.
- **OpenAI `gpt-4o`** kullanılacak: mini sınıfına göre daha yüksek maliyet, **tek seferlik** iş için kabul edilir; **en yüksek metin kalitesi** hedeflenir.
- Geliştirme sırasında düşük maliyetli denemeler için ayrıca **mini** sınıfı modeller kullanılabilir; **Examples’a girecek son içerik** için varsayılan **4o**.

## Beklenti (12 sayfalık kitap)

- Mevcut **adım (step) akışı**ndaki **custom request** alanına eklenecek yönergelerle, **12 sayfalık kitabın** kalitesinin yükselmesi bekleniyor.
- Bu, tek seferlik “kısa örnek paragraf” değil; **sayfa sayfa** yapı, ton, yaş uyumu ve karakter sürekliliğini hedefleyen bir **prompt / kısıt zinciri** ile desteklenmeli.

## Önerilen kurgu (yüksek seviye)

| Katman | Rol |
|--------|-----|
| **Girdi** | Yaş grubu, karakter adı/özellikleri, tema veya “fikir” (referanstaki başlık benzeri), **üretim/görüntüleme dili** (TR / EN). |
| **Konu / fikir katmanı** | **Tam hikâye değil:** çalışma başlığı + **konu özeti** (logline / 2–4 cümle veya referanstaki `example_story`ye benzer **tek kısa paragraf üst sınırı**). **Düz metin yeterli** (ayrıca JSON şeması zorunlu değil). Çıktı **custom request** ile birleştirilir. |
| **Genişletme** | Aynı konunun **12 sayfaya** yayılması (`story_generation` ve takip adımları): baş, gelişme, dönüşüm, kapanış; sayfa başına 1 ana sahne veya duygu odağı. |
| **Custom request / step entegrasyonu** | Üretim pipeline’ındaki ilgili adımda: yaş uyumu, kelime seçimi, korku/şiddet sınırları, mesaj (ör. dostluk, cesaret) ve marka tonu için **net ek talimatlar**. |
| **Examples kullanımı** | Onaylanan çıktılar Examples için **sabit içerik** olarak işlenir (slug, başlık, özet, tam metin veya sayfa JSON’u). |

## Referans dosya ile ilişki

- JSON’daki girdiler **esin kaynağı**; üretilen metinler **aynı olmamalı**, sadece “başlık + kısa örnek” formatının verdiği **ürün hissi** hedeflenir.

### `tum_hikayeler.json` — ne kopyalanmadı?

- Üretim aracında **harici JSON’dan kopya metin yok**.
- Araç: `public/dev/story-idea-generator.html` — kullanıcı yalnızca **geniş tema kartı + yaş** seçer; somut fikir / kahraman / ton **tek API çağrısında model tarafından** türetilir.

## Dil: TR / EN (üretim ve arayüz)

- **Konu brief** düz metindir; **TR ve EN ayrı ayrı** görüntülenebilir / seçilebilir (HTML arayüzde dil sekmesi veya iki alan yeterli).
- **İki uygulama yolu** — ikisi de geçerli:
  1. **Seçilen dilde tek üretim:** Kullanıcı TR veya EN seçer; model **o dilde** başlık + konu özeti üretir → **tek API çağrısı**, **en düşük maliyet** (aynı fikir için ikinci dil gerekmiyorsa).
  2. **İki dil:** Örn. önce EN üretilir, sonra **çeviri** ile TR (veya tersi); veya iki ayrı üretim. **İki çağrı** (üretim + çeviri) veya iki tam üretim → maliyet daha yüksek; kalite/ tutarlılık tercihine bağlı.
- **Özet:** Sadece bir dilde içerik üreteceksen **seçtiğin dilde tek üretim** en ekonomik; Examples’ta hem TR hem EN sabit içerik gerekiyorsa **çeviri veya ikinci üretim** bütçelenir.

## Geliştirme öncesi değerlendirme (eksik / risk)

| Konu | Durum |
|------|--------|
| **Konu → 12 sayfa zinciri** | Mantık tamam: önce **konu brief** (başlık + kısa özet, düz metin), sonra **custom request** ile `story_generation`. |
| **Format** | **Düz metin yeterli**; JSON şeması zorunlu değil. |
| **TR + EN** | Üretim **seçilen dilde** veya EN+çeviri / iki üretim — ürün kararı; teknik engel yok. |
| **Referans ile çelişki** | Referanstaki kısa paragraf **üst sınır** olabilir; **tam kitap metni** yazılmaz. |
| **Sözleşme** | Konu üretiminde net olmalı: **yaş bandı**, **kahraman**, **ton** (korku yok, vb.). |

## Custom request üretebilir miyiz? (özet)

- **Evet.** **Çalışma başlığı** + **konu özeti** (seçilen dilde veya TR/EN iki alan), isteğe bağlı **ana mesaj / mekân**; hepsi düz metin, `custom request` ile birleştirilir. Tam hikâye değil; **12 sayfalık üretimin hammaddesi**.

## Analiz durumu

- **Tamamlandı** (bu doküman kapsamı: konu → custom request → 12 sayfa beklentisi, dil seçenekleri, `gpt-4o` Examples kalitesi, düz metin).
- **Bloklayıcı sorun yok.** Uygulama aşamasında dikkat edilecekler: çeviri kullanıyorsanız **özel isimlerin** iki dilde tutarlı kalması; 12 sayfalık adımda **hangi dilde kitap** üretileceğinin net seçilmesi.

## Sonraki adımlar (ileride, ayrı iş)

- HTML prototip + API çağrısı; **Examples / hazır kitap içeriği** üretiminde model: **`gpt-4o`**.
- Custom request metinlerinin step’lere göre şablonlaştırılması ve test seti.
- Examples sayfası için içerik şeması (hangi alanlar, hangi dil, versiyonlama).

---

*Bu doküman, paylaşılan niyeti tek yerde toplamak için oluşturulmuştur.*
