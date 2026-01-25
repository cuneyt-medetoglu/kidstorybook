import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Rate limiting API for bot protection
 * Tracks free cover generation attempts per IP/session
 * 
 * Limits:
 * - 1 free cover generation per IP per 24 hours (unauthenticated)
 * - Unlimited for authenticated users (they can be tracked by user ID)
 */

interface RateLimitData {
  ip: string
  timestamp: number
  count: number
}

// In-memory store (for production, use Redis or database)
// This is a simple implementation - for production, use proper rate limiting service
const rateLimitStore = new Map<string, RateLimitData>()

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now()
  const oneDayAgo = now - 24 * 60 * 60 * 1000
  
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.timestamp < oneDayAgo) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 60 * 1000) // Every hour

function getClientIP(request: NextRequest): string {
  // Try various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  
  const realIP = request.headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }
  
  // Fallback
  return "unknown"
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action !== "check" && action !== "increment") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }

    // Check if user is authenticated
    const supabase = await createClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    // If authenticated, use user ID for tracking (unlimited for logged-in users)
    if (user) {
      return NextResponse.json({
        success: true,
        allowed: true,
        remaining: Infinity,
        authenticated: true,
      })
    }

    // For unauthenticated users, use IP-based rate limiting
    const clientIP = getClientIP(request)
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    const existing = rateLimitStore.get(clientIP)

    if (action === "check") {
      // Check if user has exceeded limit
      if (existing && existing.timestamp > oneDayAgo && existing.count >= 1) {
        return NextResponse.json({
          success: true,
          allowed: false,
          remaining: 0,
          authenticated: false,
          message: "Free cover generation limit reached. Please sign in for unlimited access.",
        })
      }

      return NextResponse.json({
        success: true,
        allowed: true,
        remaining: existing && existing.timestamp > oneDayAgo ? 1 - existing.count : 1,
        authenticated: false,
      })
    }

    if (action === "increment") {
      // Increment counter
      if (existing && existing.timestamp > oneDayAgo) {
        existing.count += 1
        rateLimitStore.set(clientIP, existing)
      } else {
        rateLimitStore.set(clientIP, {
          ip: clientIP,
          timestamp: now,
          count: 1,
        })
      }

      const current = rateLimitStore.get(clientIP)!
      const allowed = current.count <= 1

      return NextResponse.json({
        success: true,
        allowed,
        remaining: allowed ? 1 - current.count : 0,
        authenticated: false,
        message: allowed
          ? undefined
          : "Free cover generation limit reached. Please sign in for unlimited access.",
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[Rate Limit API] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
