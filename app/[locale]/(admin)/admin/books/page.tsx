import { getAdminBooks } from '@/lib/db/admin'
import { BooksTable } from '@/components/admin/books-table'
import { getTranslations } from 'next-intl/server'
import { BookOpen } from 'lucide-react'

interface PageProps {
  params: { locale: string }
  searchParams: {
    search?: string
    status?: string
    theme?: string
    language?: string
    page?: string
  }
}

export default async function AdminBooksPage({ params, searchParams }: PageProps) {
  const page = parseInt(searchParams.page ?? '1')
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.books' })

  const result = await getAdminBooks({
    search: searchParams.search,
    status: searchParams.status,
    theme: searchParams.theme,
    language: searchParams.language,
    page,
    pageSize: 20,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      <BooksTable
        {...result}
        initialSearch={searchParams.search ?? ''}
        initialStatus={searchParams.status ?? ''}
      />
    </div>
  )
}
