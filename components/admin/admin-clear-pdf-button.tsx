'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

type Props = {
  bookId: string
  hasPdf: boolean
}

export function AdminClearPdfButton({ bookId, hasPdf }: Props) {
  const t = useTranslations('admin.books.detail')
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (!hasPdf) return null

  async function onClear() {
    if (!window.confirm(t('clearPdfConfirm'))) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/books/${bookId}/clear-pdf`, { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error || res.statusText)
      }
      router.refresh()
    } catch {
      window.alert(t('clearPdfError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClear}
      disabled={loading}
      className="gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {loading ? t('clearPdfLoading') : t('clearPdfCache')}
    </Button>
  )
}
