/**
 * @file iyzico iade (cancel/refund) işlemleri.
 *
 * iyzico'da iade iki yöntemle yapılır:
 *  - `cancel.create`  — ödeme günü içinde tam iptal/iade (providerPaymentId yeterli)
 *  - `refund.create`  — sonraki günlere ait kısmi/tam iade (paymentTransactionId gerekir)
 *
 * Bu modül tam iade için `cancel.create` kullanır.
 * Kısmi iade gerekirse `refund.create` ayrı endpoint gerektirir.
 */

import { getIyzicoClient } from './client'

// ============================================================================
// Tipler
// ============================================================================

export interface IyzicoCancelRequest {
  /** iyzico tarafından döndürülen ödeme ID'si (payments.provider_payment_id) */
  paymentId: string
  /** Korelasyon / izleme için — orderId veya benzeri */
  conversationId: string
  /** İstek yapan IP (iyzico zorunlu kılar) */
  ip: string
}

export interface IyzicoCancelResult {
  success: boolean
  authCode?: string
  errorMessage?: string
  errorCode?: string
  rawResult: Record<string, unknown>
}

// ============================================================================
// cancel.create — tam iade
// ============================================================================

/**
 * iyzico ödeme iptal/iade isteği gönderir.
 *
 * Her zaman resolve eder (reject etmez).
 * Ağ ve SDK hatalar `success: false` olarak normalize edilir.
 */
export async function cancelIyzicoPayment(
  req: IyzicoCancelRequest
): Promise<IyzicoCancelResult> {
  const iyzico = getIyzicoClient()

  return new Promise<IyzicoCancelResult>((resolve) => {
    iyzico.cancel.create(
      {
        locale: 'TR',
        conversationId: req.conversationId,
        paymentId: req.paymentId,
        ip: req.ip,
      },
      (err, result) => {
        if (err) {
          return resolve({
            success: false,
            errorMessage: err.message,
            rawResult: { sdkError: err.message },
          })
        }

        const raw = result as unknown as Record<string, unknown>
        const isSuccess = typeof raw.status === 'string' && raw.status === 'success'

        resolve({
          success: isSuccess,
          authCode: typeof raw.authCode === 'string' ? raw.authCode : undefined,
          errorMessage: isSuccess
            ? undefined
            : (typeof raw.errorMessage === 'string' ? raw.errorMessage : 'İade başarısız'),
          errorCode:
            typeof raw.errorCode === 'string' ? raw.errorCode : undefined,
          rawResult: raw,
        })
      }
    )
  })
}
