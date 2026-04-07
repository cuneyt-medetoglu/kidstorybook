/**
 * @file Sipariş onayı e-posta şablonu.
 *
 * Dil desteği: TR / EN (order_currency veya locale üzerinden belirlenir).
 * Domain yokken `APP_URL` yerine `NEXT_PUBLIC_APP_URL` env kullanılır.
 */

// ============================================================================
// Tipler
// ============================================================================

export interface OrderConfirmationData {
  orderShortId: string
  userEmail: string
  userName: string | null
  totalAmount: number
  currency: string
  locale: 'tr' | 'en'
  items: Array<{
    bookTitle: string | null
    itemType: 'ebook' | 'hardcopy' | 'bundle'
    unitPrice: number
    quantity: number
  }>
  hasEbook: boolean
}

// ============================================================================
// Yardımcılar
// ============================================================================

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

function itemTypeLabel(type: string, locale: 'tr' | 'en'): string {
  const labels: Record<string, Record<'tr' | 'en', string>> = {
    ebook:    { tr: 'E-Kitap', en: 'E-Book' },
    hardcopy: { tr: 'Basılı Kitap', en: 'Printed Book' },
    bundle:   { tr: 'E-Kitap + Basılı', en: 'E-Book + Printed' },
  }
  return labels[type]?.[locale] ?? type
}

// ============================================================================
// Şablon
// ============================================================================

export function buildOrderConfirmationEmail(data: OrderConfirmationData): {
  subject: string
  html: string
  text: string
} {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://herokidstory.com'
  const { locale } = data
  const isTr = locale === 'tr'

  const greeting = isTr
    ? `Merhaba${data.userName ? ` ${data.userName}` : ''},`
    : `Hi${data.userName ? ` ${data.userName}` : ''}!`

  const subject = isTr
    ? `Siparişiniz Onaylandı — HeroKidStory #${data.orderShortId}`
    : `Order Confirmed — HeroKidStory #${data.orderShortId}`

  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.bookTitle ?? '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${itemTypeLabel(item.itemType, locale)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${formatCurrency(item.unitPrice * item.quantity, data.currency)}</td>
    </tr>`
    )
    .join('')

  const dashboardBtn = data.hasEbook
    ? `<p style="margin:24px 0;text-align:center;">
        <a href="${appUrl}/dashboard"
           style="background:#6366f1;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
          ${isTr ? 'Kitaplığıma Git →' : 'Go to My Library →'}
        </a>
       </p>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:32px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
    <div style="background:#6366f1;padding:28px 32px;">
      <h1 style="color:#fff;margin:0;font-size:22px;">🎉 ${isTr ? 'Siparişiniz Onaylandı!' : 'Order Confirmed!'}</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="margin:0 0 16px;">${greeting}</p>
      <p style="margin:0 0 24px;color:#374151;">
        ${isTr
          ? `<strong>#${data.orderShortId}</strong> numaralı siparişiniz başarıyla alındı.`
          : `Your order <strong>#${data.orderShortId}</strong> has been confirmed.`}
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;">${isTr ? 'Kitap' : 'Book'}</th>
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;">${isTr ? 'Tür' : 'Type'}</th>
            <th style="padding:8px 12px;text-align:right;font-size:12px;color:#6b7280;">${isTr ? 'Tutar' : 'Amount'}</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr style="background:#f9fafb;">
            <td colspan="2" style="padding:10px 12px;font-weight:700;">${isTr ? 'Toplam' : 'Total'}</td>
            <td style="padding:10px 12px;font-weight:700;text-align:right;">${formatCurrency(data.totalAmount, data.currency)}</td>
          </tr>
        </tfoot>
      </table>

      ${dashboardBtn}

      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
        ${isTr
          ? `Sipariş geçmişinize <a href="${appUrl}/orders" style="color:#6366f1;">buradan</a> ulaşabilirsiniz.`
          : `You can view your order history <a href="${appUrl}/orders" style="color:#6366f1;">here</a>.`}
      </p>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;text-align:center;font-size:12px;color:#9ca3af;">
      HeroKidStory — ${isTr ? 'Çocuğunuzun hikayesi' : 'Your child\'s story'}
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
      ? `Sipariş No: #${data.orderShortId}`
      : `Order ID: #${data.orderShortId}`,
    '',
    ...data.items.map(
      (i) =>
        `- ${i.bookTitle ?? '—'} (${itemTypeLabel(i.itemType, locale)}): ${formatCurrency(i.unitPrice * i.quantity, data.currency)}`
    ),
    '',
    `${isTr ? 'Toplam' : 'Total'}: ${formatCurrency(data.totalAmount, data.currency)}`,
    '',
    data.hasEbook
      ? (isTr ? `Kitaplığınız: ${appUrl}/dashboard` : `Library: ${appUrl}/dashboard`)
      : '',
    '',
    'HeroKidStory',
  ]
    .join('\n')
    .trim()

  return { subject, html, text }
}
