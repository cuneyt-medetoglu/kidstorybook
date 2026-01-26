import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { DraftData } from "@/lib/draft-storage"

/**
 * POST /api/drafts/transfer
 * Transfer draft from localStorage to database (login sonrası)
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
        const { data: existingDraft } = await supabase
          .from("drafts")
          .select("id")
          .eq("draft_id", draft.draftId)
          .single()

        if (existingDraft) {
          // Update existing draft with user_id
          const { data, error } = await supabase
            .from("drafts")
            .update({
              user_id: user.id,
              cover_image: draft.coverImage,
              character_data: draft.characterData,
              theme: draft.theme,
              sub_theme: draft.subTheme,
              style: draft.style,
              expires_at: draft.expiresAt,
            })
            .eq("draft_id", draft.draftId)
            .select()
            .single()

          if (error) throw error
          transferredDrafts.push(data)
        } else {
          // Create new draft
          const { data, error } = await supabase
            .from("drafts")
            .insert({
              user_id: user.id,
              draft_id: draft.draftId,
              cover_image: draft.coverImage,
              character_data: draft.characterData,
              theme: draft.theme,
              sub_theme: draft.subTheme,
              style: draft.style,
              created_at: draft.createdAt,
              expires_at: draft.expiresAt,
            })
            .select()
            .single()

          if (error) throw error
          transferredDrafts.push(data)
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
