import { NextRequest, NextResponse } from "next/server"
import { getDraftById } from "@/lib/db/drafts"

/**
 * GET /api/drafts/[draftId]
 * Get draft by ID (public access for anonymous users)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { draftId: string } }
) {
  try {
    const { draftId } = params

    if (!draftId) {
      return NextResponse.json(
        { success: false, error: "Draft ID is required" },
        { status: 400 }
      )
    }

    const draft = await getDraftById(draftId)

    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Draft not found or expired" },
        { status: 404 }
      )
    }

    const custom = draft.custom_requests ? JSON.parse(draft.custom_requests) : {}
    return NextResponse.json({
      success: true,
      draft: {
        draftId: draft.draft_id,
        coverImage: custom.coverImage ?? null,
        characterData: custom.characterData ?? { characterIds: draft.character_ids },
        theme: draft.theme,
        subTheme: draft.sub_theme,
        style: draft.illustration_style,
        createdAt: draft.created_at,
        expiresAt: custom.expiresAt ?? null,
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
