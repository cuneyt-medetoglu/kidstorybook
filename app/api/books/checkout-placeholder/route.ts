/**
 * POST /api/books/checkout-placeholder
 *
 * Ödeme öncesi sipariş satırı için geçerli bir books.id üretir (order_items.book_id FK).
 * Wizard / örnek kitap akışında kitap henüz üretilmemiş olsa da satır oluşturulur (status: draft).
 */

import { type NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/api-auth'
import { createBook } from '@/lib/db/books'
import { CommonErrors, handleAPIError, successResponse } from '@/lib/api/response'
import { UUID_RE } from '@/lib/utils/uuid'

interface Body {
  title: string
  theme: string
  illustrationStyle: string
  language?: string
  totalPages: number
  characterId?: string
  /** Çoklu karakter — ödeme sonrası kuyruk için (sıra önemli) */
  characterIds?: string[]
  /** Örnek kitaptan satın alma — metadata; FK değil */
  sourceExampleBookId?: string
}

function validateBody(raw: unknown): raw is Body {
  if (typeof raw !== 'object' || raw === null) return false
  const b = raw as Record<string, unknown>
  if (typeof b.title !== 'string' || !b.title.trim()) return false
  if (typeof b.theme !== 'string' || !b.theme.trim()) return false
  if (typeof b.illustrationStyle !== 'string' || !b.illustrationStyle.trim()) return false
  if (typeof b.totalPages !== 'number' || !Number.isFinite(b.totalPages)) return false
  if (b.totalPages < 1 || b.totalPages > 64) return false
  if (b.characterId !== undefined && typeof b.characterId !== 'string') return false
  if (
    typeof b.characterId === 'string' &&
    b.characterId &&
    !UUID_RE.test(b.characterId)
  )
    return false
  if (
    b.sourceExampleBookId !== undefined &&
    typeof b.sourceExampleBookId === 'string' &&
    b.sourceExampleBookId &&
    !UUID_RE.test(b.sourceExampleBookId)
  )
    return false
  if (b.characterIds !== undefined) {
    if (!Array.isArray(b.characterIds)) return false
    if (b.characterIds.length > 5) return false
    for (const id of b.characterIds) {
      if (typeof id !== 'string' || !UUID_RE.test(id)) return false
    }
  }
  return true
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return CommonErrors.unauthorized()

    let raw: unknown
    try {
      raw = await request.json()
    } catch {
      return CommonErrors.badRequest('Geçersiz JSON')
    }

    if (!validateBody(raw)) {
      return CommonErrors.badRequest(
        'title, theme, illustrationStyle ve totalPages (1–64) zorunludur; characterId isteğe bağlı UUID olmalıdır.'
      )
    }

    const {
      title,
      theme,
      illustrationStyle,
      language = 'tr',
      totalPages,
      characterId,
      characterIds: bodyCharacterIds,
      sourceExampleBookId,
    } = raw

    const paidCheckoutCharacterIds: string[] | undefined =
      bodyCharacterIds && bodyCharacterIds.length > 0
        ? bodyCharacterIds
        : undefined

    const { data: book, error } = await createBook(user.id, {
      character_id: characterId || paidCheckoutCharacterIds?.[0] || undefined,
      title: title.trim().slice(0, 500),
      theme: theme.trim().slice(0, 200),
      illustration_style: illustrationStyle.trim().slice(0, 200),
      language: typeof language === 'string' && language.trim() ? language.trim().slice(0, 8) : 'tr',
      age_group: 'preschool',
      story_data: {},
      total_pages: Math.round(totalPages),
      custom_requests: undefined,
      images_data: [],
      status: 'draft',
      generation_metadata: {
        checkoutPlaceholder: true,
        pendingPaidCheckout: true,
        ...(paidCheckoutCharacterIds ? { paidCheckoutCharacterIds } : {}),
        ...(sourceExampleBookId ? { sourceExampleBookId } : {}),
      },
      ...(sourceExampleBookId
        ? { source_example_book_id: sourceExampleBookId }
        : {}),
    })

    if (error || !book) {
      console.error('[checkout-placeholder] createBook:', error)
      return NextResponse.json(
        { success: false, error: 'Kitap kaydı oluşturulamadı' },
        { status: 500 }
      )
    }

    return successResponse({ bookId: book.id }, undefined, undefined, 200)
  } catch (err) {
    return handleAPIError(err)
  }
}
