import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getDraftFromLocalStorage } from "@/lib/draft-storage"
import { updateBook } from "@/lib/db/books"

/**
 * POST /api/books/purchase-from-draft
 * Purchase full book from draft (mock payment - real payment will be in Faz 4.1/4.2)
 * Generates remaining pages after payment confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient(request)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

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

    // TODO: Payment verification (will be implemented in Faz 4.1 and 4.2)
    // For now, mock payment success
    console.log("[Purchase From Draft] Mock payment successful for draft:", draftId)
    console.log("[Purchase From Draft] Plan type:", planType)

    // Find book by draft (if exists)
    // For now, we'll create a new book or update existing draft book
    // This is a simplified version - full implementation would:
    // 1. Find existing draft book (if created via free cover)
    // 2. Generate remaining pages
    // 3. Update book status to 'generating' → 'completed'

    // Calculate page count (planType: "10" = 10 pages, "15" = 15 pages, "20" = 20 pages)
    const pageCount = parseInt(planType)

    // TODO: Call book generation API to generate remaining pages
    // For now, return success with order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      orderId,
      message: "Purchase successful (mock). Book generation will start shortly.",
      draftId,
      planType,
      pageCount,
    })
  } catch (error) {
    console.error("[Purchase From Draft] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
