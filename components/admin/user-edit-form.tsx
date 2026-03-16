'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, AlertCircle, Loader2, ShieldAlert } from 'lucide-react'
import type { AdminUserDetail } from '@/lib/db/admin'

interface Props {
  user: AdminUserDetail
  currentAdminId: string
}

export function UserEditForm({ user, currentAdminId }: Props) {
  const t = useTranslations('admin.users.edit')
  const tRole = useTranslations('admin.users')
  const router = useRouter()
  const [name, setName] = useState(user.name ?? '')
  const [role, setRole] = useState(user.role ?? 'user')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isSelf = user.id === currentAdminId
  const hasChanges = name !== (user.name ?? '') || role !== (user.role ?? 'user')

  const handleSave = async () => {
    if (!hasChanges) return
    setSaving(true)
    setResult('idle')

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || null, role }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Request failed')
      }

      setResult('success')
      router.refresh()
    } catch (err: any) {
      setResult('error')
      setErrorMsg(err.message ?? 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {isSelf && (
        <div className="flex items-center gap-2 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          {t('selfWarning')}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="user-name">{t('userName')}</Label>
          <Input
            id="user-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('userNamePlaceholder')}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t('role')}</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">{tRole('roleUser')}</SelectItem>
              <SelectItem value="admin">{tRole('roleAdmin')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          size="sm"
          className="gap-1.5"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? t('saving') : t('save')}
        </Button>

        {result === 'success' && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            {t('saved')}
          </div>
        )}
        {result === 'error' && (
          <div className="flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  )
}
