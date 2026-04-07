import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getOrderDetailForAdmin } from '@/lib/db/orders'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import OrderActions from '@/components/admin/order-actions'
import {
  ArrowLeft,
  ShoppingCart,
  Calendar,
  CreditCard,
  Package,
  User,
  ExternalLink,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  paid: 'default',
  pending: 'secondary',
  processing: 'secondary',
  failed: 'destructive',
  cancelled: 'outline',
  refunded: 'outline',
  partially_refunded: 'outline',
}

const PROVIDER_STYLE: Record<string, string> = {
  iyzico: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  stripe: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
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

function formatDate(date: Date | string | null, locale: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface PageProps {
  params: { locale: string; id: string }
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { locale, id } = params
  const order = await getOrderDetailForAdmin(id)

  if (!order) notFound()

  const t = await getTranslations({ locale, namespace: 'admin.orders' })
  const td = await getTranslations({ locale, namespace: 'admin.orders.detail' })
  const tStatus = await getTranslations({ locale, namespace: 'admin.orders.status' })

  const shortId = order.id.slice(0, 8).toUpperCase()
  const cur = order.order_currency

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            {td('back')}
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold">{td('orderId')}: {shortId}</h2>
            <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'}>
              {tStatus(order.status)}
            </Badge>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${PROVIDER_STYLE[order.payment_provider] ?? ''}`}>
              {t(`provider.${order.payment_provider}`)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-1">{td('fullId')}: {order.id}</p>
        </div>
      </div>

      {/* Top row: summary + customer */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {td('date')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <p className="text-sm font-medium">{formatDate(order.created_at, locale)}</p>
            {order.paid_at && (
              <p className="text-xs text-muted-foreground">{td('paidAt')}: {formatDate(order.paid_at, locale)}</p>
            )}
            {order.cancelled_at && (
              <p className="text-xs text-destructive">{td('cancelledAt')}: {formatDate(order.cancelled_at, locale)}</p>
            )}
            {order.refunded_at && (
              <p className="text-xs text-muted-foreground">{td('refundedAt')}: {formatDate(order.refunded_at, locale)}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" /> {td('total')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <p className="text-2xl font-bold">{formatCurrency(order.total_amount, cur)}</p>
            {order.discount_amount > 0 && (
              <p className="text-xs text-green-600">
                {td('discount')}: -{formatCurrency(order.discount_amount, cur)}
              </p>
            )}
            <p className="text-xs text-muted-foreground">{td('subtotal')}: {formatCurrency(order.subtotal, cur)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {td('customer')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <p className="text-sm font-medium">{order.user_name ?? '—'}</p>
            <p className="text-xs text-muted-foreground">{order.user_email}</p>
            <Link href={`/admin/users/${order.user_id}`}>
              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 px-0 mt-1">
                <ExternalLink className="h-3 w-3" />
                {td('viewUser')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Failure reason */}
      {order.failure_reason && (
        <Card className="border-destructive">
          <CardContent className="py-3 px-4">
            <p className="text-sm text-destructive">
              <span className="font-medium">{td('failureReason')}:</span> {order.failure_reason}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            {td('items')} ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">—</th>
                  <th className="px-4 py-2 font-medium">{t('table.products')}</th>
                  <th className="px-4 py-2 font-medium">{td('quantity')}</th>
                  <th className="px-4 py-2 font-medium">{td('unitPrice')}</th>
                  <th className="px-4 py-2 font-medium">{td('totalPrice')}</th>
                  <th className="px-4 py-2 font-medium">{td('fulfillment')}</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-2">
                      {item.book_cover_url ? (
                        <Image
                          src={item.book_cover_url}
                          alt={item.book_title ?? ''}
                          width={24}
                          height={32}
                          className="h-8 w-6 rounded object-cover"
                          sizes="24px"
                        />
                      ) : (
                        <div className="h-8 w-6 rounded bg-muted flex items-center justify-center">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <p className="font-medium text-xs">{item.book_title ?? '—'}</p>
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {t(`status.${item.item_type}`) || item.item_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-xs">{item.quantity}</td>
                    <td className="px-4 py-2 text-xs">{formatCurrency(item.unit_price, cur)}</td>
                    <td className="px-4 py-2 text-xs font-medium">{formatCurrency(item.total_price, cur)}</td>
                    <td className="px-4 py-2">
                      <Badge variant="outline" className="text-[10px]">
                        {item.fulfillment_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment record */}
      {order.payments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {td('paymentRecord')} ({order.payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.payments.map((p) => (
                <div key={p.id} className="rounded-lg border p-3 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground">{td('paymentId')}</span>
                      <p className="font-mono">{p.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{td('paymentStatus')}</span>
                      <p className="font-medium">{p.status}</p>
                    </div>
                    {p.provider_payment_id && (
                      <div>
                        <span className="text-muted-foreground">{td('providerPaymentId')}</span>
                        <p className="font-mono truncate">{p.provider_payment_id}</p>
                      </div>
                    )}
                    {p.provider_session_id && (
                      <div>
                        <span className="text-muted-foreground">{td('providerSessionId')}</span>
                        <p className="font-mono truncate">{p.provider_session_id}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">{td('paymentAmount')}</span>
                      <p className="font-medium">{formatCurrency(p.amount, p.payment_currency)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{td('date')}</span>
                      <p>{formatDate(p.created_at, locale)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Actions */}
      <OrderActions
        orderId={order.id}
        currentStatus={order.status}
        paymentProvider={order.payment_provider}
        locale={locale}
      />

      {/* Payment events */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {td('events')} ({order.events.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.events.length === 0 ? (
            <p className="text-sm text-muted-foreground">{td('noEvents')}</p>
          ) : (
            <div className="space-y-2">
              {order.events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-start gap-3 rounded-lg border p-3 text-xs"
                >
                  {ev.processed ? (
                    ev.error_message ? (
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    )
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{ev.event_type}</span>
                      <span className="text-muted-foreground">{formatDate(ev.received_at, locale)}</span>
                    </div>
                    {ev.error_message && (
                      <p className="text-destructive">{ev.error_message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
