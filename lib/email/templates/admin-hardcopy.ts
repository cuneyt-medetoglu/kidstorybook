/**
 * @file Admin bildirimi — yeni basılı kitap siparişi.
 *
 * Hardcopy sipariş ödeme sonrasında admin e-posta adresine gönderilir.
 * ADMIN_EMAIL env değişkeni tanımlıysa kullanılır.
 */

export interface AdminHardcopyData {
  orderId: string
  orderShortId: string
  userEmail: string
  userName: string | null
  items: Array<{
    bookTitle: string | null
    quantity: number
    unitPrice: number
    currency: string
  }>
  billingAddress?: Record<string, unknown> | null
  totalAmount: number
  currency: string
}

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

export function buildAdminHardcopyEmail(data: AdminHardcopyData): {
  to: string
  subject: string
  html: string
  text: string
} {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://herokidstory.com'
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.EMAIL_FROM ?? ''

  const subject = `[Yeni Sipariş] Basılı Kitap — #${data.orderShortId}`

  const itemRows = data.items
    .map(
      (item) => `<li>${item.bookTitle ?? '—'} × ${item.quantity} — ${formatCurrency(item.unitPrice * item.quantity, item.currency)}</li>`
    )
    .join('')

  const adminOrderUrl = `${appUrl}/admin/orders/${data.orderId}`

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:24px;">
  <h2 style="color:#dc2626;">🖨️ Yeni Basılı Kitap Siparişi</h2>
  <p><strong>Sipariş No:</strong> #${data.orderShortId}</p>
  <p><strong>Müşteri:</strong> ${data.userName ?? '—'} &lt;${data.userEmail}&gt;</p>
  <p><strong>Toplam:</strong> ${formatCurrency(data.totalAmount, data.currency)}</p>

  <h3>Ürünler:</h3>
  <ul>${itemRows}</ul>

  ${data.billingAddress
    ? `<h3>Teslimat Adresi:</h3>
       <pre style="background:#f3f4f6;padding:12px;border-radius:6px;font-size:13px;">${JSON.stringify(data.billingAddress, null, 2)}</pre>`
    : ''}

  <p style="margin-top:24px;">
    <a href="${adminOrderUrl}"
       style="background:#6366f1;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">
      Admin Panelde Görüntüle →
    </a>
  </p>
</body>
</html>`

  const text = [
    subject,
    '',
    `Sipariş No: #${data.orderShortId}`,
    `Müşteri: ${data.userName ?? '—'} <${data.userEmail}>`,
    `Toplam: ${formatCurrency(data.totalAmount, data.currency)}`,
    '',
    'Ürünler:',
    ...data.items.map((i) => `  - ${i.bookTitle ?? '—'} × ${i.quantity}`),
    '',
    `Admin panel: ${adminOrderUrl}`,
  ]
    .join('\n')
    .trim()

  return { to: adminEmail, subject, html, text }
}
