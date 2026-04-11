import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"

// ============================================================================
// Metadata
// ============================================================================

export const metadata: Metadata = {
  title: "Privacy Policy / Gizlilik Politikası — HeroKidStory",
  description:
    "HeroKidStory privacy policy covering KVKK, GDPR and COPPA compliance for our personalized children's storybook platform.",
  robots: { index: true },
}

// ============================================================================
// Versiyon
// ============================================================================

const POLICY_VERSION  = "1.1-draft"
const LAST_UPDATED_TR = "11 Nisan 2026"
const LAST_UPDATED_EN = "April 11, 2026"

// ============================================================================
// Satıcı sabiti
// ============================================================================

const SELLER = {
  name:    "Cüneyt Medetoğlu",
  title:   "Şahıs İşletmesi",
  address: "Atatürk Mah. Merkez İsimsiz91 Sk. Dema İnş B Blok No: 4/1 İç Kapı No: 3 Merkez / Tunceli, Türkiye",
  email:   "info@herokidstory.com",
  web:     "https://herokidstory.com",
}

// ============================================================================
// Sayfa — Global (TR + EN)
// ============================================================================

export default function PrivacyPolicyPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const isTr = locale === "tr"

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-background dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto max-w-3xl px-4 py-12">

        {/* Başlık / Title */}
        <div className="mb-8">
          <div className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            ⚠️ {isTr ? "TASLAK — Henüz avukat tarafından onaylanmamıştır" : "DRAFT — Not yet reviewed by legal counsel"} · v{POLICY_VERSION}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
            {isTr ? "Gizlilik Politikası" : "Privacy Policy"}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isTr
              ? `KVKK · GDPR · COPPA kapsamında · Son güncelleme: ${LAST_UPDATED_TR}`
              : `KVKK · GDPR · COPPA · Last updated: ${LAST_UPDATED_EN}`}
          </p>
        </div>

        {isTr ? <PrivacyTR /> : <PrivacyEN />}

      </div>
    </main>
  )
}

// ============================================================================
// TR içerik
// ============================================================================

function PrivacyTR() {
  return (
    <div className="space-y-8 text-slate-700 dark:text-slate-300">

      <Section title="1. Giriş">
        <p>
          HeroKidStory, yapay zeka destekli kişiselleştirilmiş çocuk hikaye kitapları
          oluşturma hizmeti sunan bir platformdur. Bu Gizlilik Politikası; hangi kişisel
          verileri topladığımızı, neden topladığımızı, nasıl kullandığımızı ve bu veriler
          üzerindeki haklarınızı açıklamaktadır.
        </p>
        <InfoTable rows={[
          ["Veri Sorumlusu",  SELLER.name],
          ["İşletme Türü",    SELLER.title],
          ["Adres",           SELLER.address],
          ["E-posta",         SELLER.email],
          ["Web Sitesi",      SELLER.web],
        ]} />
        <Note>
          HeroKidStory 2–10 yaş hedef kitlesi için tasarlanmıştır. Platform yalnızca
          <strong> ebeveynler ve yasal veliler</strong> tarafından kullanılabilir.
          Çocuklar doğrudan kayıt yapamaz.
        </Note>
      </Section>

      <Section title="2. Toplanan Veriler">
        <SubSection title="2.1 Hesap ve Profil Verileri (Ebeveyn/Kullanıcı)">
          <InfoTable rows={[
            ["E-posta adresi",    "Kayıt / Google / Facebook OAuth — kimlik doğrulama, bildirimler"],
            ["Şifre",             "bcrypt hash olarak saklanır; düz metin asla saklanmaz"],
            ["Ad Soyad",          "Profil / ödeme formu — hesap yönetimi, fatura"],
            ["Profil fotoğrafı",  "Opsiyonel — Google/Facebook OAuth otomatik alır"],
            ["Uygulama tercihleri", "Çocuk modu, dil, tema — kullanıcı deneyimi"],
          ]} />
        </SubSection>

        <SubSection title="2.2 Çocuk Karakter Verileri">
          <p>Bu veriler ebeveyn/veli tarafından, çocuk adına sağlanmaktadır.</p>
          <InfoTable rows={[
            ["Ad",                    "Karakter formu — hikayede kullanım"],
            ["Yaş",                   "Karakter formu — yaş grubu içeriği"],
            ["Cinsiyet",              "Karakter formu — karakter özellikleri"],
            ["Saç rengi, göz rengi",  "Karakter formu — AI görsel prompt"],
            ["AI karakter açıklaması","Otomatik üretilir — tutarlı karakter temsili"],
          ]} />
          <Callout type="info" title="Referans Fotoğraf Hakkında">
            Karakter oluşturma sırasında referans fotoğraf yüklenebilir. Bu fotoğraf
            <strong> yalnızca illüstrasyon üretimi sırasında geçici olarak işlenir</strong> —
            kitap üretimi tamamlandıktan sonra sistemden kalıcı olarak silinir.
            Platformda saklanan görsel, gerçek fotoğrafın değil; yapay zeka tarafından
            üretilmiş çizgi film tarzı illüstrasyonun kendisidir.
          </Callout>
        </SubSection>

        <SubSection title="2.3 Sipariş ve Ödeme Verileri">
          <InfoTable rows={[
            ["Fatura adı/soyadı",    "Ödeme formu — fatura düzenleme"],
            ["Fatura adresi",        "Ödeme formu — fatura ve muhasebe"],
            ["Kargo adresi",         "Basılı kitap siparişlerinde — teslimat"],
            ["Sipariş bilgileri",    "Otomatik — sipariş yönetimi, fatura"],
            ["Ödeme referans no",    "İyzico tarafından iletilir — muhasebe"],
          ]} />
          <Note>
            Kredi/banka kartı bilgileri HeroKidStory tarafından <strong>görülmez veya saklanmaz.</strong>{" "}
            Tüm ödeme işlemleri İyzico&apos;nun PCI-DSS uyumlu altyapısında gerçekleştirilir.
          </Note>
        </SubSection>

        <SubSection title="2.4 Teknik Veriler (Otomatik)">
          <InfoTable rows={[
            ["IP adresi",           "Her oturumda — güvenlik, para birimi tespiti"],
            ["Tarayıcı / cihaz",    "Otomatik — teknik uyumluluk"],
            ["Oturum verileri",     "NextAuth — kimlik doğrulama"],
            ["Çerezler",            "Oturum, tercihler (onayınıza göre)"],
            ["Hata logları",        "Otomatik — teknik sorun giderme"],
          ]} />
        </SubSection>
      </Section>

      <Section title="3. Verilerin Kullanım Amaçları">
        <InfoTable rows={[
          ["Hesap oluşturma ve yönetimi",           "E-posta, şifre, ad — Sözleşme ifası"],
          ["Kişiselleştirilmiş kitap üretimi",      "Karakter verileri, geçici fotoğraf — Açık rıza"],
          ["Sipariş ve fatura işleme",              "Fatura bilgileri — Sözleşme ifası + Kanuni"],
          ["Ödeme işleme",                          "İyzico'ya iletilir — Sözleşme ifası"],
          ["Kargo ve teslimat",                     "Kargo adresi — Sözleşme ifası"],
          ["Sipariş bildirimleri",                  "E-posta — Sözleşme ifası"],
          ["Güvenlik / dolandırıcılık önleme",      "IP, cihaz — Meşru menfaat"],
          ["Para birimi tespiti",                   "IP adresi — Meşru menfaat"],
          ["Yasal yükümlülükler",                   "Fatura kayıtları — Kanuni yükümlülük"],
        ]} />
      </Section>

      <Section title="4. Verilerin Paylaşımı">
        <p>Kişisel verileriniz ticari amaçla üçüncü taraflara <strong>satılmamaktadır.</strong></p>

        <SubSection title="4.1 Ödeme Hizmeti">
          <InfoTable rows={[
            ["İyzico (TR)", "Ad/soyad, fatura adresi, tutar — BDDK lisanslı, KVKK uyumlu"],
          ]} />
        </SubSection>

        <SubSection title="4.2 Barındırma ve Altyapı">
          <InfoTable rows={[
            ["Amazon AWS (ABD)", "Şifreli hesap ve sipariş verileri — sunucu barındırma"],
            ["Amazon S3 (ABD)",  "Üretilen görseller ve PDF'ler — dosya depolama"],
            ["Vercel (ABD/Global)", "IP, istek logları — CDN"],
          ]} />
          <Note>Orijinal çocuk fotoğrafları S3&apos;te saklanmaz — üretim sonrası silinir.</Note>
        </SubSection>

        <SubSection title="4.3 Yapay Zeka Hizmetleri">
          <InfoTable rows={[
            ["OpenAI (ABD)",        "Referans fotoğraf (geçici) + hikaye parametreleri — AI illüstrasyon + metin"],
            ["Google Gemini (ABD)", "Hikaye metni (geçici) — TTS sesli okuma üretimi"],
          ]} />
          <Callout type="info" title="OpenAI Aktarımı Hakkında">
            Referans fotoğraf, illüstrasyon üretimi için OpenAI API&apos;sine iletilir.
            OpenAI&apos;ın API politikasına göre bu veriler model eğitiminde kullanılmaz.
            Üretim tamamlandıktan sonra fotoğraf hem HeroKidStory&apos;den hem de API sürecinden silinir.
            Bu aktarım için karakter oluşturma sırasında açık onayınız alınmaktadır.
          </Callout>
        </SubSection>

        <SubSection title="4.4 Kimlik Doğrulama">
          <InfoTable rows={[
            ["Google OAuth (ABD)",   "E-posta, ad, profil fotoğrafı — yalnızca Google ile girişte"],
            ["Facebook OAuth (ABD)", "E-posta, ad — yalnızca Facebook ile girişte"],
          ]} />
        </SubSection>

        <SubSection title="4.5 E-posta Hizmeti">
          <InfoTable rows={[
            ["Resend (ABD/EU)", "E-posta adresi, sipariş bilgileri — sipariş onayı, bildirimler"],
          ]} />
        </SubSection>
      </Section>

      <Section title="5. Veri Saklama Süreleri">
        <InfoTable rows={[
          ["Hesap bilgileri",             "Hesap aktif olduğu sürece; silme sonrası 30 gün içinde kalıcı silinir"],
          ["Çocuk karakter verileri",     "Kullanıcı veya hesap silinene kadar"],
          ["Referans fotoğraf",           "Kitap üretimi tamamlandıktan sonra otomatik silinir"],
          ["Üretilen görseller / PDF",    "Kullanıcı kitabı siler veya hesabı kapatana kadar"],
          ["Sipariş ve fatura kayıtları", "10 yıl (VUK Madde 253 — yasal zorunluluk)"],
          ["IP ve teknik loglar",         "90 gün"],
          ["AI üretim logları",           "1 yıl (maliyet takibi)"],
          ["E-posta kayıtları",           "3 yıl"],
        ]} />
        <Note>
          Hesabınızı silseniz dahi fatura ve sipariş kayıtları Türk Vergi Usul Kanunu gereği
          10 yıl saklanmak zorundadır. Bu kayıtlar yalnızca ad/soyad ve fatura adresi gibi
          sipariş için zorunlu olan verileri içerir.
        </Note>
      </Section>

      <Section title="6. Çocukların Gizliliği">
        <SubSection title="6.1 Fotoğraf Tasarım Tercihi">
          <p>
            HeroKidStory, çocuk fotoğraflarını uzun süreli depolamamayı bilinçli bir gizlilik
            önlemi olarak benimsemiştir. Orijinal fotoğraf yalnızca AI üretim sürecinde anlık
            olarak kullanılır ve üretim tamamlandıktan sonra kalıcı olarak silinir.
          </p>
        </SubSection>
        <SubSection title="6.2 Çocuk Verisi Onayı">
          <p>
            Karakter oluşturmada çocuğa ait veri işlemeden önce ebeveyn/veliden açık onay alınır:
          </p>
          <blockquote className="mt-2 rounded-lg border-l-4 border-primary/40 bg-slate-100 px-4 py-3 text-sm italic dark:bg-slate-800">
            &quot;Çocuğuma ait fotoğraf ve bilgilerin, kişiselleştirilmiş hikaye kitabı üretimi
            amacıyla OpenAI&apos;a geçici olarak iletileceğini, üretim sonrası orijinal fotoğrafın
            silineceğini anlıyor ve onay veriyorum.&quot;
          </blockquote>
        </SubSection>
        <SubSection title="6.3 COPPA (ABD Kullanıcıları)">
          <p>
            13 yaş altı çocuklara ait tüm veriler yalnızca ebeveyn açık onayıyla işlenmektedir.
            Veri silinmesi talebi için:{" "}
            <a href="mailto:info@herokidstory.com" className="text-primary underline underline-offset-2">
              info@herokidstory.com
            </a>
          </p>
        </SubSection>
        <SubSection title="6.4 GDPR Çocuk Verileri (AB Kullanıcıları)">
          <p>16 yaş altı çocuklar için ebeveyn onayı zorunludur. HeroKidStory bu onayı karakter oluşturma adımında almaktadır.</p>
        </SubSection>
      </Section>

      <Section title="7. Haklarınız">
        <SubSection title="KVKK Madde 11 — Türk Kullanıcılar">
          <ul className="space-y-1.5 text-sm list-disc pl-4">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
            <li>KVKK Madde 7 çerçevesinde silinmesini veya yok edilmesini isteme</li>
            <li>Otomatik sistemler ile analiz edilmesi sonucu ortaya çıkan karara itiraz etme</li>
            <li>Kanuna aykırı işlenmesi sebebiyle zarara uğranılması halinde giderim talep etme</li>
          </ul>
        </SubSection>
        <SubSection title="GDPR — AB Kullanıcıları">
          <ul className="space-y-1.5 text-sm list-disc pl-4">
            <li><strong>Erişim</strong> — işlenen verilerinizin kopyasını talep etme</li>
            <li><strong>Düzeltme</strong> — yanlış verilerin düzeltilmesini isteme</li>
            <li><strong>Silme</strong> — belirli koşullarda verilerinizin silinmesi</li>
            <li><strong>Kısıtlama</strong> — işlemenin kısıtlanmasını talep etme</li>
            <li><strong>Taşınabilirlik</strong> — verilerinizi yapılandırılmış formatta alma</li>
            <li><strong>İtiraz</strong> — meşru menfaate dayalı işlemelere itiraz</li>
            <li><strong>Rızayı geri çekme</strong> — rıza verdiğiniz her işlem için onayı geri alma</li>
            <li><strong>Şikayet</strong> — ülkenizdeki Veri Koruma Otoritesi&apos;ne başvurma</li>
          </ul>
        </SubSection>
        <SubSection title="Hesap Silme">
          <p>
            <strong>Dashboard → Ayarlar → Hesabımı Sil</strong> adımlarını izleyerek
            hesabınızı silebilirsiniz. Silme işleminde şunlar gerçekleşir:
          </p>
          <ul className="mt-2 space-y-1 text-sm list-disc pl-4">
            <li>E-posta, ad, tercihler ve profil bilgileri silinir</li>
            <li>Oluşturduğunuz tüm kitaplar ve görseller silinir</li>
            <li>Tüm karakter verileri silinir</li>
            <li>Referans fotoğraf zaten üretim sonrası silinmiş olduğundan ayrıca işlem gerekmez</li>
            <li className="text-slate-500">
              <em>İstisna: Sipariş ve fatura kayıtları VUK Madde 253 gereği 10 yıl saklanmaya devam eder</em>
            </li>
          </ul>
        </SubSection>
        <SubSection title="Başvuru Yöntemi">
          <p>
            <strong>E-posta:</strong>{" "}
            <a href="mailto:info@herokidstory.com" className="text-primary underline underline-offset-2">
              info@herokidstory.com
            </a>{" "}
            — konu satırına &quot;KVKK Başvurusu&quot; yazınız.
            Başvurular <strong>30 iş günü</strong> içinde yanıtlanır.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Türk kullanıcılar: Kişisel Verileri Koruma Kurulu&apos;na (kvkk.gov.tr) şikayet hakkınız saklıdır.
          </p>
        </SubSection>
      </Section>

      <Section title="8. Güvenlik">
        <ul className="space-y-1.5 text-sm list-disc pl-4">
          <li>Veriler AWS&apos;de AES-256 şifreli olarak saklanır</li>
          <li>Aktarımda TLS/HTTPS kullanılır</li>
          <li>Şifreler bcrypt ile hashlenir, düz metin asla saklanmaz</li>
          <li>Ödeme verileri PCI-DSS uyumlu İyzico altyapısında işlenir</li>
          <li>Erişim kontrolleri ve rol tabanlı yetkilendirme uygulanır</li>
        </ul>
        <Note>
          Güvenlik ihlali durumunda KVKK ve GDPR kapsamında 72 saat içinde yetkili kurumlara
          ve etkilenen kullanıcılara bildirim yapılacaktır.
        </Note>
      </Section>

      <Section title="9. Çerezler">
        <p>
          Çerez kullanımı hakkında ayrıntılı bilgi için:{" "}
          <Link href="/cookies" className="text-primary underline underline-offset-2">
            Çerez Politikası
          </Link>
        </p>
        <InfoTable rows={[
          ["Zorunlu çerezler",  "Oturum yönetimi, güvenlik — her zaman aktif"],
          ["Tercih çerezleri",  "Dil, tema, kullanıcı tercihleri"],
          ["Analitik çerezler", "Yalnızca onay vermeniz halinde"],
        ]} />
      </Section>

      <Section title="10. Politika Değişiklikleri">
        <p>
          Önemli değişikliklerde &quot;Son Güncelleme&quot; tarihi güncellenir ve kayıtlı
          kullanıcılara e-posta bildirimi yapılır. Politikayı kullanmaya devam etmek,
          güncellenmiş versiyonu kabul ettiğiniz anlamına gelir.
        </p>
      </Section>

      <Section title="11. İletişim">
        <InfoTable rows={[
          ["E-posta",      "info@herokidstory.com"],
          ["Adres",        SELLER.address],
          ["Yanıt Süresi", "30 iş günü"],
        ]} />
      </Section>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
        ⚠️ Bu metin <strong>v{POLICY_VERSION}</strong> taslak sürümdür.
      </div>
    </div>
  )
}

// ============================================================================
// EN içerik
// ============================================================================

function PrivacyEN() {
  return (
    <div className="space-y-8 text-slate-700 dark:text-slate-300">

      <Section title="1. Introduction">
        <p>
          HeroKidStory is a platform offering AI-powered personalized children&apos;s storybooks.
          This Privacy Policy explains what personal data we collect, why we collect it,
          how we use it, and your rights over that data.
        </p>
        <InfoTable rows={[
          ["Data Controller", SELLER.name],
          ["Business Type",   SELLER.title],
          ["Address",         SELLER.address],
          ["Email",           SELLER.email],
          ["Website",         SELLER.web],
        ]} />
        <Note>
          HeroKidStory is designed for children aged 2–10. The platform is used exclusively
          by <strong>parents or legal guardians.</strong> Children cannot register directly.
        </Note>
      </Section>

      <Section title="2. Data We Collect">
        <SubSection title="2.1 Account and Profile Data (Parent/User)">
          <InfoTable rows={[
            ["Email address",   "Registration / Google / Facebook OAuth — authentication, notifications"],
            ["Password",        "Stored as bcrypt hash — plain text is never stored"],
            ["Full name",       "Profile / payment form — account management, invoicing"],
            ["Profile photo",   "Optional — auto-imported from Google/Facebook OAuth"],
            ["App preferences", "Kid mode, language, theme — user experience"],
          ]} />
        </SubSection>

        <SubSection title="2.2 Child Character Data">
          <p>This data is provided by a parent/guardian on behalf of the child.</p>
          <InfoTable rows={[
            ["Name",                   "Character form — used in the story"],
            ["Age",                    "Character form — age-appropriate content"],
            ["Gender",                 "Character form — character attributes"],
            ["Hair color, eye color",  "Character form — AI visual prompt"],
            ["AI character description","Auto-generated — consistent character representation"],
          ]} />
          <Callout type="info" title="About the Reference Photo">
            A reference photo may be uploaded during character creation. This photo is
            <strong> temporarily processed only during illustration generation</strong> —
            after book production is complete, the original photo is permanently deleted
            from our systems. What is stored in your library is the AI-generated cartoon
            illustration, not the original photo.
          </Callout>
        </SubSection>

        <SubSection title="2.3 Order and Payment Data">
          <InfoTable rows={[
            ["Billing name",      "Payment form — invoice generation"],
            ["Billing address",   "Payment form — invoicing and accounting"],
            ["Shipping address",  "Payment form (printed books only) — delivery"],
            ["Order details",     "Automatic — order management, invoicing"],
            ["Payment reference", "Provided by Iyzico — accounting"],
          ]} />
          <Note>
            Credit/debit card details are <strong>never seen or stored</strong> by HeroKidStory.
            All payments are processed through Iyzico&apos;s PCI-DSS compliant infrastructure.
          </Note>
        </SubSection>

        <SubSection title="2.4 Technical Data (Automatic)">
          <InfoTable rows={[
            ["IP address",         "Every session — security, currency detection"],
            ["Browser / device",   "Automatic — technical compatibility"],
            ["Session data",       "NextAuth — authentication"],
            ["Cookies",            "Session, preferences (subject to your consent)"],
            ["Error logs",         "Automatic — technical debugging"],
          ]} />
        </SubSection>
      </Section>

      <Section title="3. How We Use Your Data">
        <InfoTable rows={[
          ["Account creation and management",    "Email, password, name — Contract performance"],
          ["Personalized book production",       "Character data, temporary photo — Explicit consent"],
          ["Order processing and invoicing",     "Billing data — Contract + Legal obligation"],
          ["Payment processing",                 "Forwarded to Iyzico — Contract performance"],
          ["Delivery",                           "Shipping address — Contract performance"],
          ["Order notifications",                "Email — Contract performance"],
          ["Security / fraud prevention",        "IP, device — Legitimate interest"],
          ["Currency detection",                 "IP address — Legitimate interest"],
          ["Legal obligations",                  "Invoice records — Legal obligation"],
        ]} />
      </Section>

      <Section title="4. Data Sharing">
        <p>Your personal data is <strong>never sold</strong> to third parties for commercial purposes.</p>

        <SubSection title="4.1 Payment Processing">
          <InfoTable rows={[["Iyzico (Turkey)", "Name, billing address, amount — BDDK licensed, KVKK compliant"]]} />
        </SubSection>

        <SubSection title="4.2 Hosting and Infrastructure">
          <InfoTable rows={[
            ["Amazon AWS (USA)",    "Encrypted account and order data — server hosting"],
            ["Amazon S3 (USA)",     "Generated images and PDFs — file storage"],
            ["Vercel (USA/Global)", "IP, request logs — CDN"],
          ]} />
          <Note>Original child photos are not stored in S3 — they are deleted after production.</Note>
        </SubSection>

        <SubSection title="4.3 AI Services">
          <InfoTable rows={[
            ["OpenAI (USA)",        "Reference photo (temporary) + story params — AI illustration + text"],
            ["Google Gemini (USA)", "Story text (temporary) — TTS audio generation"],
          ]} />
          <Callout type="info" title="About OpenAI Transfer">
            The reference photo is sent to the OpenAI API for illustration generation.
            Per OpenAI&apos;s API policy, data sent via the API is not used to train their models.
            Once production is complete, the photo is permanently deleted from HeroKidStory
            and is no longer accessible via the API pipeline.
            Your explicit consent for this transfer is obtained during character creation.
          </Callout>
        </SubSection>

        <SubSection title="4.4 Authentication">
          <InfoTable rows={[
            ["Google OAuth (USA)",   "Email, name, profile photo — Google login users only"],
            ["Facebook OAuth (USA)", "Email, name — Facebook login users only"],
          ]} />
        </SubSection>

        <SubSection title="4.5 Email Service">
          <InfoTable rows={[["Resend (USA/EU)", "Email address, order info — order confirmations, notifications"]]} />
        </SubSection>
      </Section>

      <Section title="5. Data Retention">
        <InfoTable rows={[
          ["Account data",          "While account is active; permanently deleted within 30 days of account deletion"],
          ["Child character data",  "Until user deletes character or closes account"],
          ["Reference photo",       "Automatically deleted after book production completes"],
          ["Generated images / PDFs","Until user deletes book or closes account"],
          ["Order and invoice data", "10 years (Turkish Tax Law obligation — VUK Article 253)"],
          ["IP and technical logs",  "90 days"],
          ["AI production logs",     "1 year (cost tracking)"],
          ["Email records",          "3 years"],
        ]} />
        <Note>
          Even after account deletion, invoice and order records must be retained for 10 years
          under Turkish Tax Procedure Law. These records contain only the minimum data
          required for invoicing (name and billing address).
        </Note>
      </Section>

      <Section title="6. Children's Privacy">
        <SubSection title="6.1 Photo Design Choice">
          <p>
            HeroKidStory has made a deliberate privacy decision not to store child photos
            long-term. The original photo is used only momentarily during the AI generation
            process and is permanently deleted once production is complete.
          </p>
        </SubSection>
        <SubSection title="6.2 Child Data Consent">
          <p>Before processing child data, we obtain explicit consent from the parent/guardian during character creation:</p>
          <blockquote className="mt-2 rounded-lg border-l-4 border-primary/40 bg-slate-100 px-4 py-3 text-sm italic dark:bg-slate-800">
            &quot;I understand and consent that my child&apos;s photo and information will be
            temporarily transferred to an AI service (OpenAI) for the purpose of generating
            a personalized storybook, and that the original photo will be deleted after production.&quot;
          </blockquote>
        </SubSection>
        <SubSection title="6.3 COPPA (US Users)">
          <p>
            All processing of data related to children under 13 is performed with explicit
            parental consent. US parents may request deletion of their child&apos;s data by
            contacting{" "}
            <a href="mailto:info@herokidstory.com" className="text-primary underline underline-offset-2">
              info@herokidstory.com
            </a>.
          </p>
        </SubSection>
        <SubSection title="6.4 GDPR Child Data (EU Users)">
          <p>Parental consent is required for children under 16 in EU member states. HeroKidStory obtains this consent during character creation.</p>
        </SubSection>
      </Section>

      <Section title="7. Your Rights">
        <SubSection title="GDPR Rights (EU Users)">
          <ul className="space-y-1.5 text-sm list-disc pl-4">
            <li><strong>Access</strong> — request a copy of your data</li>
            <li><strong>Rectification</strong> — correct inaccurate data</li>
            <li><strong>Erasure</strong> — request deletion under certain conditions</li>
            <li><strong>Restriction</strong> — restrict processing</li>
            <li><strong>Portability</strong> — receive your data in a structured format</li>
            <li><strong>Objection</strong> — object to legitimate interest processing</li>
            <li><strong>Withdraw consent</strong> — at any time, for consent-based processing</li>
            <li><strong>Lodge a complaint</strong> — with your national Data Protection Authority</li>
          </ul>
        </SubSection>
        <SubSection title="Account Deletion">
          <p>
            Go to <strong>Dashboard → Settings → Delete My Account</strong>.
            Upon deletion: all account data, books, images, and character data are permanently
            deleted. Invoice records are retained for 10 years as required by law.
          </p>
        </SubSection>
        <SubSection title="How to Exercise Your Rights">
          <p>
            Email:{" "}
            <a href="mailto:info@herokidstory.com" className="text-primary underline underline-offset-2">
              info@herokidstory.com
            </a>{" "}
            — subject: &quot;GDPR Request&quot;. Response within <strong>30 days.</strong>
          </p>
        </SubSection>
      </Section>

      <Section title="8. Security">
        <ul className="space-y-1.5 text-sm list-disc pl-4">
          <li>Data stored encrypted (AES-256) on AWS infrastructure</li>
          <li>TLS/HTTPS encryption in transit</li>
          <li>Passwords hashed with bcrypt — plain text never stored</li>
          <li>Payment data processed via PCI-DSS compliant Iyzico</li>
          <li>Role-based access controls applied</li>
        </ul>
        <Note>
          In the event of a security breach, we will notify relevant authorities and
          affected users within 72 hours as required by GDPR and KVKK.
        </Note>
      </Section>

      <Section title="9. Cookies">
        <p>
          For full details, see our{" "}
          <Link href="/cookies" className="text-primary underline underline-offset-2">
            Cookie Policy
          </Link>.
        </p>
        <InfoTable rows={[
          ["Essential cookies",  "Session management, security — always active"],
          ["Preference cookies", "Language, theme, user preferences"],
          ["Analytics cookies",  "Only if you give consent"],
        ]} />
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We will update the &quot;Last Updated&quot; date on changes and notify registered
          users by email for significant updates. Continued use of the platform constitutes
          acceptance of the updated policy.
        </p>
      </Section>

      <Section title="11. Contact">
        <InfoTable rows={[
          ["Email",         "info@herokidstory.com"],
          ["Address",       SELLER.address],
          ["Response time", "30 days"],
        ]} />
      </Section>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
        ⚠️ This is <strong>v{POLICY_VERSION}</strong> draft. Not yet reviewed by legal counsel.
      </div>

    </div>
  )
}

// ============================================================================
// Yardımcı bileşenler
// ============================================================================

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 border-b border-slate-200 pb-2 text-base font-bold text-slate-900 dark:border-slate-700 dark:text-slate-100">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-3">
      <h3 className="mb-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      {children}
    </div>
  )
}

function InfoTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="mt-2 w-full text-sm">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="border-b border-slate-100 dark:border-slate-800">
            <td className="whitespace-nowrap py-1.5 pr-4 font-medium text-slate-700 dark:text-slate-300">
              {label}
            </td>
            <td className="py-1.5 text-slate-600 dark:text-slate-400">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
      {children}
    </p>
  )
}

function Callout({
  type,
  title,
  children,
}: {
  type: "info" | "warning"
  title: string
  children: ReactNode
}) {
  const colors =
    type === "info"
      ? "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300"
      : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300"

  return (
    <div className={`mt-2 rounded-lg border p-3 text-sm ${colors}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{children}</p>
    </div>
  )
}
