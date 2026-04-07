'use client'

/**
 * Admin sipariş detay sayfası için aksiyon bölümü.
 * - Manuel durum güncelleme (status update)
 * - iyzico tam iade (refund)
 * - Admin notu
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, RefreshCw, Undo2 } from 'lucide-react'
import type { OrderStatus } from '@/lib/payment/types'

// ============================================================================
// Tipler
// ============================================================================

interface OrderActionsProps {
  orderId: string
  currentStatus: OrderStatus
  paymentProvider: 'iyzico' | 'stripe'
  locale: string
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Bekliyor',
  processing: 'İşleniyor',
  paid: 'Ödendi',
  failed: 'Başarısız',
  cancelled: 'İptal',
  refunded: 'İade Edildi',
  partially_refunded: 'Kısmi İade',
}

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'paid',
  'failed',
  'cancelled',
  'refunded',
  'partially_refunded',
]

// ============================================================================
// Bileşen
// ============================================================================

export default function OrderActions({
  orderId,
  currentStatus,
  paymentProvider,
  locale,
}: OrderActionsProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus)
  const [notes, setNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRefunding, setIsRefunding] = useState(false)
  const [refundConfirm, setRefundConfirm] = useState(false)

  const canRefund =
    (currentStatus === 'paid' || currentStatus === 'processing') &&
    paymentProvider === 'iyzico'

  async function handleStatusUpdate() {
    if (selectedStatus === currentStatus && !notes.trim()) {
      toast({ title: 'Herhangi bir değişiklik yapılmadı.', variant: 'default' })
      return
    }

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus !== currentStatus ? selectedStatus : undefined,
          notes: notes.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast({ title: data.error ?? 'Güncelleme başarısız', variant: 'destructive' })
        return
      }

      toast({ title: 'Sipariş güncellendi.' })
      setNotes('')
      router.refresh()
    } catch {
      toast({ title: 'Sunucuyla bağlantı kurulamadı.', variant: 'destructive' })
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleRefund() {
    if (!refundConfirm) {
      setRefundConfirm(true)
      return
    }

    setIsRefunding(true)
    setRefundConfirm(false)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
      })

      const data = await res.json()
      if (!res.ok) {
        toast({ title: data.error ?? 'İade başarısız', variant: 'destructive' })
        return
      }

      toast({ title: 'İade başarıyla tamamlandı.' })
      router.refresh()
    } catch {
      toast({ title: 'Sunucuyla bağlantı kurulamadı.', variant: 'destructive' })
    } finally {
      setIsRefunding(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Admin Aksiyonları
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Status update */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">
            Durum Güncelle
          </p>
          <div className="flex items-center gap-3">
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as OrderStatus)}
            >
              <SelectTrigger className="w-[200px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStatus !== currentStatus && (
              <Badge variant="outline" className="text-[10px]">
                {STATUS_LABELS[currentStatus]} → {STATUS_LABELS[selectedStatus]}
              </Badge>
            )}
          </div>

          <Textarea
            placeholder="Admin notu (isteğe bağlı)…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="text-xs resize-none"
          />

          <Button
            size="sm"
            variant="outline"
            onClick={handleStatusUpdate}
            disabled={isUpdating}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Güncelleniyor…' : 'Güncelle'}
          </Button>
        </div>

        {/* Refund */}
        {canRefund && (
          <div className="space-y-2 border-t pt-4">
            <p className="text-xs font-medium text-muted-foreground">İade İşlemi</p>
            <p className="text-xs text-muted-foreground">
              iyzico üzerinden tam iade başlatır. Bu işlem geri alınamaz.
            </p>
            {refundConfirm ? (
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-destructive">
                  Emin misiniz? Bu işlem geri alınamaz.
                </p>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRefund}
                  disabled={isRefunding}
                  className="gap-1.5"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  {isRefunding ? 'İade yapılıyor…' : 'Evet, İade Et'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRefundConfirm(false)}
                  disabled={isRefunding}
                >
                  İptal
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRefund}
                disabled={isRefunding}
                className="gap-1.5"
              >
                <Undo2 className="h-3.5 w-3.5" />
                İade Başlat
              </Button>
            )}
          </div>
        )}

        {paymentProvider === 'stripe' && (
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Stripe iadesi için Stripe Dashboard&apos;u kullanın.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
