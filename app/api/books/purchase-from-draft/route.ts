import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/api-auth"
import { getDraftFromLocalStorage } from "@/lib/draft-storage"
import { updateBook } from "@/lib/db/books"
import logger from "@/lib/logger"

/**
 * POST /api/books/purchase-from-draft
 * Purchase full book from draft (mock payment - real payment will be in Faz 4.1/4.2)
 * Generates remaining pages after payment confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()

    const body = await request.json()
    const { draftId, planType }: { draftId: string; planType: "10" | "15" | "20" } = body

    if (!draftId || !planType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: draftId and planType" },
        { status: 400 }
      )
    }

    // Get draft data
    let draft = getDraftFromLocalStorage(draftId)
    if (!draft) {
      // Try API
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/drafts/${draftId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          draft = data.draft
        }
      }
    }

    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Draft not found" },
        { status: 404 }
      )
    }

    // ROADMAP: 4.1/4.2 Payment verification - for now mock success
    logger.info("[Purchase From Draft] Mock payment successful for draft:", draftId)
    logger.info("[Purchase From Draft] Plan type:", planType)

    // Find book by draft (if exists)
    // For now, we'll create a new book or update existing draft book
    // This is a simplified version - full implementation would:
    // 1. Find existing draft book (if created via free cover)
    // 2. Generate remaining pages
    // 3. Update book status to 'generating' → 'completed'

    // Calculate page count (planType: "10" = 10 pages, "15" = 15 pages, "20" = 20 pages)
    const pageCount = parseInt(planType)

    // ROADMAP: Gerçek ödeme entegrasyonu tamamlanınca:
    // 1. Ödemeyi doğrula (Stripe/iyzico)
    // 2. POST /api/books ile kitabı oluştur (enqueueBookGeneration)
    // 3. { bookId } ile /create/generating/{bookId} sayfasına yönlendir
    // Şimdilik mock: orderId döner, frontend progress sayfasına yönlendirilmez
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      orderId,
      message: "Purchase successful (mock). Real payment + book generation pending Faz 4.1/4.2.",
      draftId,
      planType,
      pageCount,
      // TODO Faz 4.1: bookId ekle, frontend /create/generating/{bookId} sayfasına yönlendirsin
    })
  } catch (error) {
    logger.error("[Purchase From Draft] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
