import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { auth } from '@/auth'
import { getOrdersByUserWithItems } from '@/lib/db/orders'
import { getTranslations } from 'next-intl/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag, BookOpen, ChevronRight } from 'lucide-react'

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
  return new Date(date).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

interface PageProps {
  params: { locale: string }
}

export default async function OrdersPage({ params }: PageProps) {
  const { locale } = params
  const session = await auth()

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`)
  }

  const [orders, t] = await Promise.all([
    getOrdersByUserWithItems(session.user.id),
    getTranslations({ locale, namespace: 'orders' }),
  ])

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t('empty')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const shortId = order.id.slice(0, 8).toUpperCase()
            const cur = order.order_currency

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    {/* Book covers */}
                    <div className="flex -space-x-2 shrink-0">
                      {order.items.slice(0, 3).map((item) =>
                        item.book_cover_url ? (
                          <Image
                            key={item.id}
                            src={item.book_cover_url}
                            alt={item.book_title ?? ''}
                            width={36}
                            height={48}
                            className="h-12 w-9 rounded border-2 border-background object-cover"
                            sizes="36px"
                          />
                        ) : (
                          <div
                            key={item.id}
                            className="h-12 w-9 rounded border-2 border-background bg-muted flex items-center justify-center"
                          >
                            <BookOpen className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {t('orderNumber', { id: shortId })}
                        </span>
                        <Badge
                          variant={STATUS_VARIANT[order.status] ?? 'outline'}
                          className="text-[10px]"
                        >
                          {t(`status.${order.status}`)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(order.created_at, locale)}
                        {' · '}
                        {order.items.length === 1
                          ? order.items[0].book_title ?? '—'
                          : t('multipleItems', { count: order.items.length })}
                      </p>
                    </div>

                    {/* Amount + link */}
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-sm font-bold">
                        {formatCurrency(order.total_amount, cur)}
                      </p>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                          {t('viewDetail')}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
