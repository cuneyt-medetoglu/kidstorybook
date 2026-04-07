import { getAdminOrders } from '@/lib/db/orders'
import { OrdersTable } from '@/components/admin/orders-table'
import { getTranslations } from 'next-intl/server'
import { ShoppingCart } from 'lucide-react'
import { ExportCsvButton } from '@/components/admin/export-csv-button'

interface PageProps {
  params: { locale: string }
  searchParams: {
    search?: string
    status?: string
    provider?: string
    page?: string
  }
}

export default async function AdminOrdersPage({ params, searchParams }: PageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.orders' })

  const result = await getAdminOrders({
    search: searchParams.search,
    status: searchParams.status,
    provider: searchParams.provider,
    page: parseInt(searchParams.page ?? '1'),
    limit: 20,
  })

  const exportParams = new URLSearchParams()
  if (searchParams.search)   exportParams.set('search',   searchParams.search)
  if (searchParams.status)   exportParams.set('status',   searchParams.status)
  if (searchParams.provider) exportParams.set('provider', searchParams.provider)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <ShoppingCart className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <ExportCsvButton
          href={`/api/admin/orders/export?${exportParams.toString()}`}
          label={t('orderStats.export')}
          loadingLabel={t('orderStats.exporting')}
        />
      </div>

      <OrdersTable
        {...result}
        initialSearch={searchParams.search ?? ''}
        initialStatus={searchParams.status ?? ''}
        initialProvider={searchParams.provider ?? ''}
      />
    </div>
  )
}
