/**
 * @file E-posta gönderim servisi.
 *
 * Feature-flag tabanlı:
 *  - EMAIL_ENABLED=false (varsayılan) → mail atılmaz, console.log ile loglanır.
 *  - EMAIL_ENABLED=true + RESEND_API_KEY tanımlı → Resend API (önerilir, domain zorunlu).
 *
 * SMTP (Nodemailer) desteği: Domain + SMTP sunucu hazır olduğunda eklenecek.
 * Şu an sadece Resend (fetch tabanlı, bağımlılık gerektirmez) ve mock desteklenir.
 */

// ============================================================================
// Tipler
// ============================================================================

export interface EmailMessage {
  to: string
  subject: string
  html: string
  /** Düz metin alternatifi (isteğe bağlı — HTML'den otomatik türetilebilir) */
  text?: string
}

export interface EmailResult {
  sent: boolean
  /** Sağlayıcının döndürdüğü mesaj ID (başarıysa) */
  messageId?: string
  /** Loglamak için: "resend" | "mock" */
  provider: 'resend' | 'mock'
}

// ============================================================================
// Feature flag kontrolü
// ============================================================================

function isEmailEnabled(): boolean {
  return process.env.EMAIL_ENABLED === 'true'
}

function hasResend(): boolean {
  return !!process.env.RESEND_API_KEY
}

// ============================================================================
// Mock gönderici (dev / e-posta kapalı)
// ============================================================================

async function sendMock(msg: EmailMessage): Promise<EmailResult> {
  console.log(
    `[email:mock] ATILMADI (EMAIL_ENABLED=false)\n` +
      `  To:      ${msg.to}\n` +
      `  Subject: ${msg.subject}`
  )
  return { sent: false, provider: 'mock' }
}

// ============================================================================
// Resend gönderici (fetch tabanlı — bağımlılık gerektirmez)
// ============================================================================

async function sendResend(msg: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY!
  const from   = process.env.EMAIL_FROM ?? 'noreply@herokidstory.com'

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to:      [msg.to],
      subject: msg.subject,
      html:    msg.html,
      text:    msg.text,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend API hatası (${res.status}): ${err}`)
  }

  const data = (await res.json()) as { id?: string }
  console.log(`[email:resend] Gönderildi → ${msg.to} | id: ${data.id}`)
  return { sent: true, messageId: data.id, provider: 'resend' }
}

// ============================================================================
// Ana gönderici — dış dünyaya açık tek fonksiyon
// ============================================================================

/**
 * E-posta gönderir.
 *
 * - EMAIL_ENABLED=false  → mock (loglar, atmaz)
 * - EMAIL_ENABLED=true + RESEND_API_KEY → Resend
 *
 * Her zaman resolve eder; hata fırlatmak yerine `sent: false` döner ve loglar.
 * Post-payment gibi kritik akışları bloke etmemesi için tasarlandı.
 */
export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  if (!isEmailEnabled()) {
    return sendMock(msg)
  }

  try {
    if (hasResend()) return await sendResend(msg)

    console.warn(
      '[email] EMAIL_ENABLED=true ama RESEND_API_KEY tanımlı değil. Mock kullanılıyor.'
    )
    return sendMock(msg)
  } catch (err) {
    console.error('[email] Gönderim hatası:', err)
    return { sent: false, provider: 'resend' }
  }
}
