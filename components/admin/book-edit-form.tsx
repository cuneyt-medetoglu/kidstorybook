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
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import type { AdminBookDetail } from '@/lib/db/admin'

interface Props {
  book: AdminBookDetail
}

export function AdminBookEditForm({ book }: Props) {
  const t = useTranslations('admin.books.edit')
  const tStatus = useTranslations('admin.books.status')
  const router = useRouter()
  const [title, setTitle] = useState(book.title)
  const [status, setStatus] = useState(book.status)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const hasChanges = title !== book.title || status !== book.status

  const handleSave = async () => {
    if (!hasChanges) return
    setSaving(true)
    setResult('idle')

    try {
      const res = await fetch(`/api/admin/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status }),
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="book-title">{t('bookTitle')}</Label>
          <Input
            id="book-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('bookTitlePlaceholder')}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t('status')}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">{tStatus('completed')}</SelectItem>
              <SelectItem value="generating">{tStatus('generating')}</SelectItem>
              <SelectItem value="failed">{tStatus('failed')}</SelectItem>
              <SelectItem value="draft">{tStatus('draft')}</SelectItem>
              <SelectItem value="archived">{tStatus('archived')}</SelectItem>
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
          {saving ? t('saving') : t('saveChanges')}
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

      <p className="text-xs text-muted-foreground">{t('note')}</p>
    </div>
  )
}
