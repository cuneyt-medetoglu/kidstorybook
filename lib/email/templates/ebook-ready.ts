/**
 * @file E-kitap hazır bildirimi şablonu.
 *
 * Kitap üretimi tamamlandığında (status → completed + pdf_url mevcut)
 * kullanıcıya gönderilir.
 */

export interface EbookReadyData {
  userEmail: string
  userName: string | null
  bookTitle: string
  bookId: string
  pdfUrl: string | null
  locale: 'tr' | 'en'
}

export function buildEbookReadyEmail(data: EbookReadyData): {
  subject: string
  html: string
  text: string
} {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://herokidstory.com'
  const isTr = data.locale === 'tr'

  const subject = isTr
    ? `Kitabınız Hazır! "${data.bookTitle}" — HeroKidStory`
    : `Your Book is Ready! "${data.bookTitle}" — HeroKidStory`

  const greeting = isTr
    ? `Merhaba${data.userName ? ` ${data.userName}` : ''},`
    : `Hi${data.userName ? ` ${data.userName}` : ''}!`

  const readUrl = `${appUrl}/books/${data.bookId}`
  const downloadUrl = data.pdfUrl ?? `${appUrl}/api/orders/${data.bookId}/download`

  const html = `<!DOCTYPE html>
<html lang="${data.locale}">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:32px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
    <div style="background:#059669;padding:28px 32px;">
      <h1 style="color:#fff;margin:0;font-size:22px;">📚 ${isTr ? 'Kitabınız Hazır!' : 'Your Book is Ready!'}</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="margin:0 0 16px;">${greeting}</p>
      <p style="margin:0 0 24px;color:#374151;">
        ${isTr
          ? `"<strong>${data.bookTitle}</strong>" adlı kitabınız hazırlandı ve indirmeye/okumaya hazır.`
          : `Your book "<strong>${data.bookTitle}</strong>" is ready to read and download.`}
      </p>

      <div style="display:flex;gap:12px;justify-content:center;margin:28px 0;">
        <a href="${readUrl}"
           style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-right:12px;">
          ${isTr ? '📖 Kitabı Oku' : '📖 Read Book'}
        </a>
        <a href="${downloadUrl}"
           style="background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          ${isTr ? '⬇ PDF İndir' : '⬇ Download PDF'}
        </a>
      </div>

      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
        ${isTr
          ? `Tüm kitaplarınıza <a href="${appUrl}/dashboard" style="color:#6366f1;">kitaplığınızdan</a> ulaşabilirsiniz.`
          : `Access all your books from <a href="${appUrl}/dashboard" style="color:#6366f1;">your library</a>.`}
      </p>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;text-align:center;font-size:12px;color:#9ca3af;">
      HeroKidStory
    </div>
  </div>
</body>
</html>`

  const text = [
    subject,
    '',
    greeting,
    '',
    isTr
      ? `"${data.bookTitle}" kitabınız hazır!`
      : `Your book "${data.bookTitle}" is ready!`,
    '',
    isTr ? `Oku: ${readUrl}` : `Read: ${readUrl}`,
    isTr ? `İndir: ${downloadUrl}` : `Download: ${downloadUrl}`,
    '',
    'HeroKidStory',
  ]
    .join('\n')
    .trim()

  return { subject, html, text }
}
