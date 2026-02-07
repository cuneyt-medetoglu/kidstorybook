"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Mail, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"

function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    // Send email (mock)
    if (orderId && !emailSent) {
      // Call email API
      fetch("/api/email/send-ebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          // In real implementation, this would come from the order data
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setEmailSent(true)
          }
        })
        .catch((error) => {
          console.error("[Success] Error sending email:", error)
        })
    }
  }, [orderId, emailSent])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl">
            <CardContent className="p-8 md:p-12">
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>

              {/* Success Message */}
              <div className="mb-6 text-center">
                <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                  Order Confirmed!
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Thank you for your purchase
                </p>
              </div>

              {/* Order ID */}
              {orderId && (
                <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Order ID</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
                    {orderId}
                  </p>
                </div>
              )}

              {/* Email Status */}
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {emailSent ? "Email sent successfully" : "Sending confirmation email..."}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {emailSent
                      ? "Check your inbox for download links"
                      : "Please wait while we send your order confirmation"}
                  </p>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-6 space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  What's Next?
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <span>Your order has been confirmed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <span>Check your email for download links (if applicable)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <span>View your books in My Library</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    View in My Library
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" /></div>}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
