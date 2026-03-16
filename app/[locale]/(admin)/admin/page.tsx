import { auth } from '@/auth'
import { getAdminStats } from '@/lib/db/admin'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen, Users, ShoppingCart, TrendingUp, Activity,
  CheckCircle2, AlertCircle, Loader2, Clock,
} from 'lucide-react'

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins || 1}d`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}s`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} gün`
  return `${Math.floor(days / 30)} ay`
}

export default async function AdminDashboardPage({ params }: { params: { locale: string } }) {
  const session = await auth()
  const stats = await getAdminStats()
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.dashboard' })

  const kpiCards = [
    {
      titleKey: 'kpi.totalUsers' as const,
      value: stats.totalUsers.toLocaleString(params.locale === 'tr' ? 'tr-TR' : 'en-US'),
      icon: Users,
      description: t('kpi.last8Users'),
      live: true,
    },
    {
      titleKey: 'kpi.totalBooks' as const,
      value: stats.totalBooks.toLocaleString(params.locale === 'tr' ? 'tr-TR' : 'en-US'),
      icon: BookOpen,
      description: t('kpi.booksBreakdown', {
        completed: stats.totalCompletedBooks,
        generating: stats.totalGeneratingBooks,
        failed: stats.totalFailedBooks,
      }),
      live: true,
    },
    {
      titleKey: 'kpi.totalOrders' as const,
      value: '—',
      icon: ShoppingCart,
      description: t('kpi.stripePlaceholder'),
      live: false,
    },
    {
      titleKey: 'kpi.totalRevenue' as const,
      value: '—',
      icon: TrendingUp,
      description: t('kpi.stripePlaceholder'),
      live: false,
    },
  ]

  const statusIcon = {
    completed: <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />,
    generating: <Loader2 className="h-3.5 w-3.5 text-blue-500 animate-spin shrink-0" />,
    failed: <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />,
    draft: <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />,
    archived: <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />,
  } as Record<string, React.ReactNode>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t('welcome', { name: session?.user?.name ?? 'Admin' })}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">{t('subtitle')}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="gap-1 text-xs text-green-600 border-green-200">
          <CheckCircle2 className="h-3 w-3" />
          {t('badgePhase0')}
        </Badge>
        <Badge variant="outline" className="gap-1 text-xs text-blue-600 border-blue-200">
          <Activity className="h-3 w-3" />
          {t('badgePhaseA1')}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((stat) => (
          <Card key={stat.titleKey} className={stat.live ? '' : 'opacity-50'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(stat.titleKey)}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom grid: Recent Books + Recent Users */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t('recentBooks')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentBooks.length === 0 && (
              <p className="text-xs text-muted-foreground">{t('noBooks')}</p>
            )}
            {stats.recentBooks.map((book) => (
              <div key={book.id} className="flex items-start gap-2">
                {statusIcon[book.status] ?? statusIcon['draft']}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{book.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {book.user_email} · {book.theme}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {timeAgo(book.created_at)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('recentUsers')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentUsers.length === 0 && (
              <p className="text-xs text-muted-foreground">{t('noUsers')}</p>
            )}
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-2 text-[10px] font-semibold text-white shrink-0">
                  {(user.name ?? user.email).slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name ?? '—'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium">{t('booksCount', { count: user.book_count })}</p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(user.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">{t('phaseProgress')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { labelKey: 'phaseA1' as const, done: true },
            { labelKey: 'phaseA2' as const, done: false },
            { labelKey: 'phaseA3' as const, done: false },
          ].map((item) => (
            <div key={item.labelKey} className="flex items-center gap-2 text-sm">
              {item.done
                ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                : <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
              }
              <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>
                {t(item.labelKey)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
