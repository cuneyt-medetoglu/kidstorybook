import { NextResponse } from "next/server"
import { getUserCurrency, getCurrencyConfig } from "@/lib/currency"

export async function GET(request: Request) {
  try {
    // Get headers from request
    const headers = request.headers
    
    // Detect currency from headers (Vercel geolocation or fallback)
    const currency = getUserCurrency(headers)
    
    // Get currency configuration
    const config = getCurrencyConfig(currency)
    
    return NextResponse.json({
      success: true,
      ...config,
    })
  } catch (error) {
    console.error("Error detecting currency:", error)
    
    // Fallback to USD
    return NextResponse.json({
      success: false,
      currency: "USD",
      symbol: "$",
      price: "$7.99",
    })
  }
}
