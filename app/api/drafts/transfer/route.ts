import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/api-auth"
import { getDraftById, createDraft, updateDraft } from "@/lib/db/drafts"
import type { DraftData } from "@/lib/draft-storage"

/**
 * POST /api/drafts/transfer
 * Transfer draft from localStorage to database (login sonrası)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()

    const body: { drafts: DraftData[] } = await request.json()

    if (!body.drafts || !Array.isArray(body.drafts)) {
      return NextResponse.json(
        { success: false, error: "Invalid drafts array" },
        { status: 400 }
      )
    }

    // Transfer each draft to database
    const transferredDrafts = []
    const errors = []

    for (const draft of body.drafts) {
      try {
        // Check if draft already exists
        const existingDraft = await getDraftById(draft.draftId)

        if (existingDraft) {
          // Update existing draft with user_id
          const updated = await updateDraft(draft.draftId, {
            user_id: user.id,
            character_ids: draft.characterData?.characterIds || [],
            theme: draft.theme,
            sub_theme: draft.subTheme ?? '',
            illustration_style: draft.style,
          })

          if (updated) transferredDrafts.push(updated)
        } else {
          // Create new draft
          const created = await createDraft({
            draft_id: draft.draftId,
            user_id: user.id,
            user_email: user.email,
            character_ids: draft.characterData?.characterIds || [],
            theme: draft.theme,
            sub_theme: draft.subTheme ?? '',
            age_group: draft.characterData?.ageGroup || '3-5',
            illustration_style: draft.style,
            language: 'tr',
          })

          transferredDrafts.push(created)
        }
      } catch (error) {
        console.error(`[Drafts Transfer] Error transferring draft ${draft.draftId}:`, error)
        errors.push({ draftId: draft.draftId, error: String(error) })
      }
    }

    return NextResponse.json({
      success: true,
      transferred: transferredDrafts.length,
      drafts: transferredDrafts,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("[Drafts Transfer] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
