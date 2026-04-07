import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { auth } from '@/auth'
import { getOrderDetailForUser } from '@/lib/db/orders'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ShoppingBag,
  Calendar,
  CreditCard,
  Package,
  Download,
  BookOpen,
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

export default async function UserOrderDetailPage({ params }: PageProps) {
  const { locale, id } = params
  const session = await auth()

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`)
  }

  const order = await getOrderDetailForUser(id, session.user.id)

  const t = await getTranslations({ locale, namespace: 'orders' })
  const td = await getTranslations({ locale, namespace: 'orders.detail' })

  if (!order) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{td('notFound')}</p>
        <Link href="/dashboard/settings?section=orders">
          <Button variant="outline">{td('backToOrders')}</Button>
        </Link>
      </div>
    )
  }

  const shortId = order.id.slice(0, 8).toUpperCase()
  const cur = order.order_currency

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/settings?section=orders">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            {td('back')}
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold">{t('orderNumber', { id: shortId })}</h1>
            <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'}>
              {t(`status.${order.status}`)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-1">{order.id}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {td('date')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm font-medium">{formatDate(order.created_at, locale)}</p>
            {order.paid_at && (
              <p className="text-xs text-muted-foreground mt-1">
                {td('paidAt')}: {formatDate(order.paid_at, locale)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> {td('provider')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm font-medium">{t(`provider.${order.payment_provider}`)}</p>
            <p className="text-xs text-muted-foreground">{td('currency')}: {cur}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" /> {td('total')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{formatCurrency(order.total_amount, cur)}</p>
            {order.discount_amount > 0 && (
              <p className="text-xs text-green-600">
                {td('discount')}: -{formatCurrency(order.discount_amount, cur)}
              </p>
            )}
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
            <ShoppingBag className="h-4 w-4" />
            {td('items')} ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border">
                {item.book_cover_url ? (
                  <Image
                    src={item.book_cover_url}
                    alt={item.book_title ?? ''}
                    width={40}
                    height={56}
                    className="h-14 w-10 rounded object-cover shrink-0"
                    sizes="40px"
                  />
                ) : (
                  <div className="h-14 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.book_title ?? '—'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">
                      {t(`itemType.${item.item_type}`)}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {t(`fulfillment.${item.fulfillment_status}`)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{formatCurrency(item.total_price, cur)}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {formatCurrency(item.unit_price, cur)}
                    </p>
                  )}
                </div>
                {(item.item_type === 'ebook' || item.item_type === 'bundle') &&
                  order.status === 'paid' && (
                    <Button variant="outline" size="sm" className="shrink-0">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      {t('downloadEbook')}
                    </Button>
                  )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price breakdown */}
      {(order.discount_amount > 0 || order.items.length > 1) && (
        <Card>
          <CardContent className="py-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{td('subtotal')}</span>
              <span>{formatCurrency(order.subtotal, cur)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>{td('discount')}</span>
                <span>-{formatCurrency(order.discount_amount, cur)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold border-t pt-2">
              <span>{td('total')}</span>
              <span>{formatCurrency(order.total_amount, cur)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
