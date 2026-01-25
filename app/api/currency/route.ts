import { NextRequest, NextResponse } from "next/server"
import { getUserCurrency, getCurrencyConfig } from "@/lib/currency"

/**
 * API route to detect user's currency based on IP geolocation
 * This works on Vercel (production) with automatic geolocation headers
 * For local development, falls back to browser locale
 */
export async function GET(request: NextRequest) {
  try {
    // Get currency from headers (Vercel provides X-Vercel-IP-Country)
    const currency = getUserCurrency(request.headers)
    const config = getCurrencyConfig(currency)

    return NextResponse.json({
      success: true,
      currency: config.currency,
      symbol: config.symbol,
      price: config.price,
    })
  } catch (error) {
    console.error("[Currency API] Error:", error)
    
    // Fallback to USD
    const defaultConfig = getCurrencyConfig("USD")
    return NextResponse.json({
      success: true,
      currency: defaultConfig.currency,
      symbol: defaultConfig.symbol,
      price: defaultConfig.price,
    })
  }
}
