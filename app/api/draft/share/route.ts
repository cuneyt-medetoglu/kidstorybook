import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/draft/share
 * Share draft via email (mock implementation)
 * 
 * ROADMAP: 4.3.6 Email bildirimleri - integrate SendGrid/Resend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, draftId } = body

    if (!email || !draftId) {
      return NextResponse.json(
        { success: false, error: "Email and draftId are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Generate draft preview link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const draftPreviewLink = `${baseUrl}/draft-preview?draftId=${draftId}`

    // Mock email sending
    console.log("[Draft Share API] Mock email sent:")
    console.log("  To:", email)
    console.log("  Draft ID:", draftId)
    console.log("  Preview Link:", draftPreviewLink)
    console.log("  Email template would include:")
    console.log("    - Subject: 'Your Draft Cover is Ready!'")
    console.log("    - Preview link")
    console.log("    - Instructions to view and purchase")

    // ROADMAP: 4.3.6 - real email (SendGrid/Resend)
    // const emailService = new EmailService()
    // await emailService.sendDraftShare({
    //   to: email,
    //   draftId,
    //   previewLink: draftPreviewLink,
    // })

    return NextResponse.json({
      success: true,
      message: "Email sent successfully (mock)",
      previewLink: draftPreviewLink,
    })
  } catch (error) {
    console.error("[Draft Share API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    )
  }
}
