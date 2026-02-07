import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/api-auth"
import { getUserDrafts, getDraftById, createDraft, updateDraft } from "@/lib/db/drafts"
import type { DraftData } from "@/lib/draft-storage"

/**
 * GET /api/drafts
 * Get user's drafts (authenticated users only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()

    const drafts = await getUserDrafts(user.id)

    return NextResponse.json({
      success: true,
      drafts: drafts || [],
    })
  } catch (error) {
    console.error("[Drafts API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/drafts
 * Save draft to database (authenticated users only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()

    const body: DraftData = await request.json()

    // Validate required fields
    if (!body.draftId || !body.coverImage || !body.characterData) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const characterIds = body.characterData?.characterIds ?? []
    const ageGroup = body.characterData?.ageGroup ?? "3-5"
    const customRequests = JSON.stringify({
      coverImage: body.coverImage,
      characterData: body.characterData,
      expiresAt: body.expiresAt,
    })

    const existingDraft = await getDraftById(body.draftId)

    if (existingDraft) {
      const updated = await updateDraft(body.draftId, {
        character_ids: characterIds,
        theme: body.theme,
        sub_theme: body.subTheme ?? '',
        illustration_style: body.style,
        custom_requests: customRequests,
      })

      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Failed to update draft" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        draft: updated,
      })
    }

    const created = await createDraft({
      draft_id: body.draftId,
      user_id: user.id,
      user_email: user.email,
      character_ids: characterIds,
      theme: body.theme,
      sub_theme: body.subTheme ?? '',
      age_group: ageGroup,
      illustration_style: body.style,
      language: "tr",
      custom_requests: customRequests,
    })

    return NextResponse.json({
      success: true,
      draft: created,
    })
  } catch (error) {
    console.error("[Drafts API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
