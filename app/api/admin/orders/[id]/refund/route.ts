/**
 * POST /api/admin/orders/[id]/refund
 *
 * Admin tarafından tetiklenen tam iade işlemi.
 * İade yalnızca iyzico sağlayıcısı için desteklenmektedir;
 * Stripe desteği ilerideki fazda eklenecektir.
 *
 * İşlem adımları:
 *  1. Admin yetkisi kontrolü
 *  2. Sipariş ve ödeme kaydı doğrulama
 *  3. iyzico cancel.create çağrısı
 *  4. DB'de sipariş + ödeme durumu güncelleme
 *  5. Audit log: payment_events'e kayıt
 */

import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { getOrderDetailForAdmin, getPaymentByOrderId, updateOrderStatus, updatePaymentRecord, savePaymentEvent } from '@/lib/db/orders'
import { cancelIyzicoPayment } from '@/lib/payment/iyzico/refund'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((token as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orderId = params.id

  try {
    const order = await getOrderDetailForAdmin(orderId)
    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    if (order.status === 'refunded') {
      return NextResponse.json(
        { error: 'Bu sipariş zaten iade edilmiş.' },
        { status: 409 }
      )
    }

    if (order.status !== 'paid' && order.status !== 'processing') {
      return NextResponse.json(
        { error: `İade yalnızca "paid" veya "processing" durumundaki siparişler için yapılabilir. Mevcut durum: ${order.status}` },
        { status: 422 }
      )
    }

    if (order.payment_provider !== 'iyzico') {
      return NextResponse.json(
        { error: 'Stripe iadesi henüz desteklenmiyor. Stripe Dashboard üzerinden manuel iade yapın.' },
        { status: 422 }
      )
    }

    const payment = await getPaymentByOrderId(orderId, 'iyzico')
    if (!payment?.provider_payment_id) {
      return NextResponse.json(
        { error: 'iyzico ödeme ID bulunamadı. Manuel iade gerekebilir.' },
        { status: 422 }
      )
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'

    const refundResult = await cancelIyzicoPayment({
      paymentId: payment.provider_payment_id,
      conversationId: orderId,
      ip,
    })

    await savePaymentEvent({
      provider: 'iyzico',
      eventType: refundResult.success ? 'cancel_success' : 'cancel_failed',
      rawPayload: refundResult.rawResult,
      orderId,
      paymentId: payment.id,
    })

    if (!refundResult.success) {
      return NextResponse.json(
        { error: refundResult.errorMessage ?? 'İade başarısız' },
        { status: 502 }
      )
    }

    const now = new Date()

    await Promise.all([
      updateOrderStatus(orderId, {
        status: 'refunded',
        refundedAt: now,
      }),
      updatePaymentRecord(payment.id, { status: 'refunded' }),
    ])

    return NextResponse.json({ success: true, refundedAt: now.toISOString() })
  } catch (err) {
    console.error('[POST /api/admin/orders/[id]/refund] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
