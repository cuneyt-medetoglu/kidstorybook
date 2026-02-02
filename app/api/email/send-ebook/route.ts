import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/email/send-ebook
 * Mock email API for sending ebook download links
 * 
 * ROADMAP: 4.3.6 Email bildirimleri - integrate SendGrid/Resend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      )
    }

    // Mock email sending
    console.log("[Email API] Mock email sent for order:", orderId)
    console.log("[Email API] Email template would include:")
    console.log("  - Order confirmation")
    console.log("  - Ebook download links (if applicable)")
    console.log("  - Order details")

    // ROADMAP: 4.3.6 - real email (SendGrid/Resend)
    // const emailService = new EmailService()
    // await emailService.sendEbookConfirmation({
    //   orderId,
    //   email: userEmail,
    //   downloadLinks: [...],
    // })

    return NextResponse.json({
      success: true,
      message: "Email sent successfully (mock)",
      orderId,
    })
  } catch (error) {
    console.error("[Email API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    )
  }
}
