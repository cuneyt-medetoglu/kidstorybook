import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/drafts/[draftId]
 * Get draft by ID (public access for anonymous users)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { draftId: string } }
) {
  try {
    const supabase = await createClient(request)
    const { draftId } = params

    if (!draftId) {
      return NextResponse.json(
        { success: false, error: "Draft ID is required" },
        { status: 400 }
      )
    }

    // Get draft from database (public access by draft_id)
    const { data: draft, error } = await supabase
      .from("drafts")
      .select("*")
      .eq("draft_id", draftId)
      .gte("expires_at", new Date().toISOString()) // Only non-expired drafts
      .single()

    if (error || !draft) {
      return NextResponse.json(
        { success: false, error: "Draft not found or expired" },
        { status: 404 }
      )
    }

    // Format response to match DraftData interface
    return NextResponse.json({
      success: true,
      draft: {
        draftId: draft.draft_id,
        coverImage: draft.cover_image,
        characterData: draft.character_data,
        theme: draft.theme,
        subTheme: draft.sub_theme,
        style: draft.style,
        createdAt: draft.created_at,
        expiresAt: draft.expires_at,
      },
    })
  } catch (error) {
    console.error("[Drafts API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
