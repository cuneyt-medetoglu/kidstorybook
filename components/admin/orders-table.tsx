'use client'

import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { Link } from '@/i18n/navigation'
import type { AdminOrderRow } from '@/lib/db/orders'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ExternalLink,
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

function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}

function timeAgo(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString()
}

interface OrdersTableProps {
  rows: AdminOrderRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  initialSearch?: string
  initialStatus?: string
  initialProvider?: string
}

export function OrdersTable({
  rows,
  total,
  page,
  totalPages,
  initialSearch = '',
  initialStatus = '',
  initialProvider = '',
}: OrdersTableProps) {
  const t = useTranslations('admin.orders')
  const tPagination = useTranslations('admin.pagination')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v)
        else params.delete(k)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ search: search || undefined })
  }

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-72"
            />
          </div>
          <Button type="submit" size="sm">{t('search')}</Button>
          {(initialSearch || initialStatus || initialProvider) && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearch('')
                router.push(pathname)
              }}
            >
              {t('clear')}
            </Button>
          )}
        </form>

        <Select
          value={initialStatus || '__all__'}
          onValueChange={(v) => updateParams({ status: v === '__all__' ? undefined : v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('allStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('allStatuses')}</SelectItem>
            <SelectItem value="pending">{t('status.pending')}</SelectItem>
            <SelectItem value="paid">{t('status.paid')}</SelectItem>
            <SelectItem value="failed">{t('status.failed')}</SelectItem>
            <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
            <SelectItem value="refunded">{t('status.refunded')}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={initialProvider || '__all__'}
          onValueChange={(v) => updateParams({ provider: v === '__all__' ? undefined : v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('allProviders')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('allProviders')}</SelectItem>
            <SelectItem value="iyzico">{t('provider.iyzico')}</SelectItem>
            <SelectItem value="stripe">{t('provider.stripe')}</SelectItem>
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-muted-foreground">{t('count', { count: total })}</span>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">{t('table.orderId')}</th>
              <th className="px-4 py-3 font-medium">{t('table.customer')}</th>
              <th className="px-4 py-3 font-medium">{t('table.products')}</th>
              <th className="px-4 py-3 font-medium">{t('table.amount')}</th>
              <th className="px-4 py-3 font-medium">{t('table.provider')}</th>
              <th className="px-4 py-3 font-medium">{t('table.status')}</th>
              <th className="px-4 py-3 font-medium">{t('table.date')}</th>
              <th className="px-4 py-3 font-medium w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  <ShoppingCart className="mx-auto h-8 w-8 mb-2 opacity-30" />
                  {t('table.noOrders')}
                </td>
              </tr>
            )}
            {rows.map((order) => {
              const bookNames = order.items
                ?.map((i) => i.book_title || '—')
                .join(', ') || '—'
              const provider = order.payment_provider

              return (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">
                    {shortId(order.id)}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-xs">{order.user_name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{order.user_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[180px] truncate text-xs" title={bookNames}>
                    {bookNames}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-xs">
                    {formatCurrency(order.total_amount, order.order_currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${PROVIDER_STYLE[provider] ?? ''}`}>
                      {t(`provider.${provider}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'} className="text-[11px]">
                      {t(`status.${order.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                    {timeAgo(order.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button size="icon" variant="ghost" className="h-7 w-7" title={t('viewDetail')}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{tPagination('pageOf', { page, total: totalPages })}</span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('page', String(page - 1))
                router.push(`${pathname}?${params.toString()}`)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('page', String(page + 1))
                router.push(`${pathname}?${params.toString()}`)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
