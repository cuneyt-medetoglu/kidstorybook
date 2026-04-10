# Ödeme ve sipariş — manuel test listesi

**Amaç:** Sunucu / sandbox testlerinde yapılacak adımlar ve beklenen sonuçlar. Tamamladığınız satırları işaretleyin; bitince ekip ile “done” kontrolü yapılabilir.

**İlgili dokümanlar:** [PAYMENT_ROADMAP.md](PAYMENT_ROADMAP.md) · [FAZ1_IYZICO.md](FAZ1_IYZICO.md) (test kartları) · [FAZ6_TEST_VE_CANLIYA_ALIS.md](FAZ6_TEST_VE_CANLIYA_ALIS.md)

**Ön koşullar**

- `REDIS_URL` erişilebilir ve **book-generation worker** çalışıyor olmalı (`npm run worker` / `npm run worker:dev` veya deploy’daki `herokidstory-worker`). Aksi halde ödeme sonrası kitap `generating`’e geçer ama kuyruk işlenmez.
- iyzico sandbox anahtarları `.env` içinde.
- Callback URL’in iyzico sandbox ayarında uygulamanın gerçek adresine işaret etmesi.

---

## Test tablosu

| # | Yapılacak işlem | Beklenen sonuç | Tamam |
|---|-----------------|------------------|-------|
| **Fiyat** |
| 1 | Step 6’da e-kitap fiyatı ile ödeme adımı tutarı | İkisi de katalog fiyatıyla aynı (ör. TRY 299) | ☐ |
| 2 | TRY dışı para biriminde Step 6 | Hardcover “₺250 indirim” metni görünmez | ☐ |
| **Sepet / UUID** |
| 3 | Taslak önizlemeden veya wizard’dan sepet → ödeme | `order_items.book_id` geçerli UUID; `invalid input syntax for type uuid` hatası yok | ☐ |
| **iyzico sandbox** |
| 4 | [Test kartı](https://docs.iyzico.com/ek-bilgiler/test-kartlari) ile başarılı ödeme (örn. `5528790000000008`) | `/payment/success?orderId=...`; `orders.status = paid` | ☐ |
| 5 | Hata kartı (örn. `4111111111111129`) | `/payment/failure`; `orders.status = failed` | ☐ |
| **Ödeme sonrası kitap üretimi** |
| 6 | Başarılı ödeme sonrası (wizard veya taslak planı) | İlgili kitap birkaç saniye içinde `generating` → worker bitince `completed` (Redis + worker açıkken) | ☐ |
| 7 | Örnek kitaptan satın alma + ödeme | Aynı şekilde üretim başlar; başlık örnek hikâyeye uygun güncellenir | ☐ |
| 8 | Worker kapalıyken ödeme | Sipariş `paid` kalır; kitap `draft` veya `generating`’de takılı kalabilir — worker’ı açıp kuyruğu doğrulayın | ☐ |
| **Başlık (UI)** |
| 9 | Yeni oluşturulan sepet satırı başlığı | `E-Kitap – {isim}` (parantezde sayfa yok) | ☐ |
| **Kullanıcı siparişleri** |
| 10 | `/orders` listesi | Ödenen siparişler görünür | ☐ |
| 11 | `/orders/[id]` detay | Tutar, kalemler, durum doğru | ☐ |
| 12 | `GET /api/orders/{id}/download` (oturum, `paid`) | `downloads[]` ve `pdfUrl` / viewer URL | ☐ |
| **Admin** |
| 13 | `/admin/orders` + export | Liste ve CSV çalışır | ☐ |
| 14 | Sipariş detayında durum / iade (iyzico `paid`) | PATCH ve iade akışı beklendiği gibi | ☐ |
| **Post-payment e-posta** |
| 15 | `EMAIL_ENABLED=false` | Konsolda `[email:mock]`; gerçek mail yok | ☐ |
| 16 | `EMAIL_ENABLED=true` + `RESEND_API_KEY` (opsiyonel) | Sipariş onayı gider | ☐ |

---

## Notlar

- Eski siparişlerde oluşturulmuş “E-Kitap (10 sayfa) – …” başlıkları veritabanında kalır; yeni checkout’tan sonra gelen kayıtlar yeni formatta olur.
- Üretim sunucusunda worker süreçlerinin PM2/systemd ile tanımlı olduğundan emin olun.

---

**Son güncelleme:** 10 Nisan 2026
