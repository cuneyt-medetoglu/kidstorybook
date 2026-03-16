import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { getAdminBookById } from '@/lib/db/admin'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminBookEditForm } from '@/components/admin/book-edit-form'
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  Globe,
  Palette,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react'

const STATUS_ICON: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  generating: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
  failed: <AlertCircle className="h-4 w-4 text-red-500" />,
  draft: <Clock className="h-4 w-4 text-muted-foreground" />,
  archived: <Clock className="h-4 w-4 text-muted-foreground" />,
}

const STATUS_COLOR: Record<string, string> = {
  completed: 'text-green-600',
  generating: 'text-blue-600',
  failed: 'text-red-600',
  draft: '',
  archived: '',
}

function formatDate(date: Date | null, locale: string) {
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

export default async function AdminBookDetailPage({ params }: PageProps) {
  const { locale, id } = params
  const book = await getAdminBookById(id)
  if (!book) notFound()

  const t = await getTranslations({ locale, namespace: 'admin.books.detail' })
  const tStatus = await getTranslations({ locale, namespace: 'admin.books.status' })
  const statusLabel = tStatus(book.status as any)
  const statusIcon = STATUS_ICON[book.status] ?? STATUS_ICON['draft']
  const statusColor = STATUS_COLOR[book.status] ?? ''
  const pages: any[] = book.story_data?.pages ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Link href="/admin/books">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold">{book.title}</h2>
            <div className="flex items-center gap-1.5">
              {statusIcon}
              <span className={`text-sm font-medium ${statusColor}`}>{statusLabel}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{book.id}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {t('user')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm font-medium">{book.user_name ?? '—'}</p>
            <p className="text-xs text-muted-foreground truncate">{book.user_email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {t('createdAt')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm font-medium">{formatDate(book.created_at, locale)}</p>
            {book.completed_at && (
              <p className="text-xs text-muted-foreground">
                {t('completedAt')}: {formatDate(book.completed_at, locale)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> {t('languageAge')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm font-medium uppercase">{book.language}</p>
            <p className="text-xs text-muted-foreground">{book.age_group ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5" /> {t('themeStyle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm font-medium capitalize">{book.theme}</p>
            <p className="text-xs text-muted-foreground capitalize">{book.illustration_style}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> {t('cover')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full max-w-[180px] mx-auto rounded-lg shadow object-cover"
              />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
                {t('noCover')}
              </div>
            )}
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>{t('pageCount')}</span>
                <span className="font-medium text-foreground">{book.total_pages}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('viewCount')}</span>
                <span className="font-medium text-foreground">{book.view_count ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('editQuota')}</span>
                <span className="font-medium text-foreground">
                  {book.edit_quota_used ?? 0} / {book.edit_quota_limit ?? '∞'}
                </span>
              </div>
              {book.pdf_url && (
                <a
                  href={book.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline pt-1"
                >
                  <FileText className="h-3.5 w-3.5" /> {t('downloadPdf')}
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t('pageContents')} ({t('pageCountLabel', { count: pages.length })})</CardTitle>
          </CardHeader>
          <CardContent>
            {pages.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('noPageData')}</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {pages.map((p: any, i: number) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {i + 1}
                    </span>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {p.text ?? p.content ?? JSON.stringify(p).slice(0, 120)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            {t('adminEdit')}
            <Badge variant="outline" className="text-xs">{t('adminOnly')}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminBookEditForm book={book} />
        </CardContent>
      </Card>
    </div>
  )
}
