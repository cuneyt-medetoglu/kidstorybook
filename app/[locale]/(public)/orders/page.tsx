import { redirect } from 'next/navigation'

/**
 * /orders → /dashboard/settings?section=orders
 *
 * Siparişler artık Profil Ayarları içinde "Siparişlerim" sekmesinde gösterilmektedir.
 * Bu sayfa geriye dönük uyumluluk için yönlendirme yapar.
 */
export default function OrdersRedirectPage() {
  redirect('/dashboard/settings?section=orders')
}
