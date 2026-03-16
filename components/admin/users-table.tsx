'use client'

import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { Link } from '@/i18n/navigation'
import type { AdminUserRow } from '@/lib/db/admin'
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
  Users,
  ExternalLink,
  ShieldCheck,
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

function UserAvatar({ name, email }: { name: string | null; email: string }) {
  const initials = (name ?? email).slice(0, 2).toUpperCase()
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-2 text-[11px] font-semibold text-white">
      {initials}
    </div>
  )
}

interface UsersTableProps {
  users: AdminUserRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  initialSearch?: string
  initialRole?: string
}

export function UsersTable({
  users,
  total,
  page,
  totalPages,
  initialSearch = '',
  initialRole = '',
}: UsersTableProps) {
  const t = useTranslations('admin.users')
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
          {(initialSearch || initialRole) && (
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
          value={initialRole || '__all__'}
          onValueChange={(v) => updateParams({ role: v === '__all__' ? undefined : v })}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder={t('table.role')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('allRoles')}</SelectItem>
            <SelectItem value="admin">{t('roleAdmin')}</SelectItem>
            <SelectItem value="user">{t('roleUser')}</SelectItem>
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-muted-foreground">{t('count', { count: total })}</span>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">{t('table.user')}</th>
              <th className="px-4 py-3 font-medium">{t('table.role')}</th>
              <th className="px-4 py-3 font-medium">{t('table.totalBooks')}</th>
              <th className="px-4 py-3 font-medium">{t('table.completed')}</th>
              <th className="px-4 py-3 font-medium">{t('table.registered')}</th>
              <th className="px-4 py-3 font-medium w-10" />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  <Users className="mx-auto h-8 w-8 mb-2 opacity-30" />
                  {t('table.noUsers')}
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} email={user.email} />
                    <div>
                      <p className="font-medium">{user.name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {user.role === 'admin' ? (
                    <Badge className="gap-1 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                      <ShieldCheck className="h-3 w-3" />
                      {t('roleAdmin')}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">{t('roleUser')}</Badge>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{user.book_count}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.completed_book_count}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {timeAgo(user.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${user.id}`}>
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
