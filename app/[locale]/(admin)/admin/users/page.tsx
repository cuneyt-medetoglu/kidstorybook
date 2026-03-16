import { getAdminUsers } from '@/lib/db/admin'
import { UsersTable } from '@/components/admin/users-table'
import { getTranslations } from 'next-intl/server'
import { Users } from 'lucide-react'

interface PageProps {
  params: { locale: string }
  searchParams: {
    search?: string
    role?: string
    page?: string
  }
}

export default async function AdminUsersPage({ params, searchParams }: PageProps) {
  const page = parseInt(searchParams.page ?? '1')
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.users' })

  const result = await getAdminUsers({
    search: searchParams.search,
    role: searchParams.role,
    page,
    pageSize: 20,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      <UsersTable
        {...result}
        initialSearch={searchParams.search ?? ''}
        initialRole={searchParams.role ?? ''}
      />
    </div>
  )
}
