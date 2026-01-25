"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Download,
  Info,
  Shield,
  Award,
  Heart,
  BookOpen,
  Palette,
  FileText,
  Sparkles,
  Paintbrush,
} from "lucide-react"
import { PricingFAQSection } from "@/components/sections/PricingFAQSection"
import { useState, useEffect } from "react"
import Link from "next/link"
import type { CurrencyConfig } from "@/lib/currency"

export default function PricingPage() {
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>({
    currency: "USD",
    symbol: "$",
    price: "$7.99",
  })
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true)

  // Detect currency on mount
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch("/api/currency")
        const data = await response.json()
        
        if (data.success) {
          setCurrencyConfig({
            currency: data.currency,
            symbol: data.symbol,
            price: data.price,
          })
        }
      } catch (error) {
        console.error("[Pricing] Error fetching currency:", error)
        // Keep default USD
      } finally {
        setIsLoadingCurrency(false)
      }
    }

    fetchCurrency()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white py-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 md:py-24">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-500/10" />
          <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-500/10" />
        </div>

        <div className="container relative mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text pb-1 text-3xl font-bold leading-tight text-transparent dark:from-purple-400 dark:to-pink-400 md:mb-4 md:text-5xl md:leading-normal">
              Create Your Perfect Storybook
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
              Personalized children's books in minutes
            </p>
          </motion.div>

          {/* E-Book Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-[500px] md:mt-12"
          >
            <div className="relative h-full rounded-3xl bg-white p-4 shadow-xl transition-shadow duration-300 hover:shadow-2xl dark:bg-slate-900 md:p-8">
              {/* Icon container */}
              <div className="mb-2 flex items-center justify-center md:mb-6">
                <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-2 dark:from-purple-900/30 dark:to-pink-900/30 md:p-4">
                  <Download className="h-5 w-5 text-purple-600 dark:text-purple-400 md:h-8 md:w-8" />
                </div>
              </div>

              {/* Title */}
              <div className="mb-2 text-center md:mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                  E-Book
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 md:text-sm">
                  Digital
                </p>
              </div>

              {/* Price */}
              <div className="mb-2 text-center md:mb-4">
                {isLoadingCurrency ? (
                  <div className="mb-1 h-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 md:h-16" />
                ) : (
                  <div className="mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400 md:text-5xl">
                    {currencyConfig.price}
                  </div>
                )}
                {/* Pages badge */}
                <div className="mt-1.5 flex justify-center md:mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 md:text-sm"
                  >
                    12 pages
                  </Badge>
                </div>
              </div>

              {/* Features list - Compact (4 items, 2 columns on desktop) */}
              <ul className="mb-4 grid grid-cols-2 gap-1.5 md:mb-6 md:grid-cols-2 md:gap-3">
                {[
                  "Instant download",
                  "PDF format",
                  "High-quality illustrations",
                  "Personalized story",
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-1.5"
                  >
                    <div className="mt-0.5 flex-shrink-0 rounded-full bg-green-100 p-0.5 dark:bg-green-900/30">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 md:h-4 md:w-4" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 md:text-base">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href="/create/step1">
                <Button
                  size="lg"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-purple-600 dark:to-pink-600 md:py-6 md:text-lg"
                >
                  Start Creating
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Info Section - Compact, inline with hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-4 max-w-[500px] rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:from-purple-900/20 dark:to-pink-900/20 md:mt-6 md:p-6"
          >
            <div className="mb-3 flex flex-col items-center gap-2 md:mb-3 md:flex-row md:gap-3">
              <div className="rounded-full bg-purple-100 p-2.5 dark:bg-purple-900/30 md:p-3">
                <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 md:h-6 md:w-6" />
              </div>
              <h3 className="text-center text-base font-semibold text-slate-900 dark:text-white md:text-lg">
                Convert to hardcover in My Library
              </h3>
            </div>
            <p className="text-center text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
              Order printed books from{" "}
              <span className="whitespace-nowrap">completed E-Books</span>
            </p>
          </motion.div>
        </div>
      </section>


      {/* Appearance of the Book Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white py-16 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 md:py-24">
        <div className="container relative mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900 md:p-12"
          >
            {/* Section Title */}
            <h3 className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-center text-2xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400 md:text-4xl">
              Appearance of the Book
            </h3>

            {/* Two Column Layout */}
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              {/* Left: Book Illustration */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  {/* Book placeholder - gradient background */}
                  <div className="flex h-64 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 shadow-md dark:from-purple-900/30 dark:to-pink-900/30">
                    <BookOpen className="h-24 w-24 text-purple-400 dark:text-purple-500" />
                  </div>
                </div>
                {/* Dimensions */}
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  <div className="font-semibold">A4 Format</div>
                  <div>8.27 x 11.69 inches</div>
                  <div>(21 x 29.7 cm)</div>
                </div>
              </div>

              {/* Right: Quality Details */}
              <div>
                <h4 className="mb-6 text-lg font-bold text-slate-900 dark:text-white md:text-2xl">
                  Quality and Details
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-2 dark:from-purple-900/30 dark:to-pink-900/30">
                      <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 md:text-base">
                      <strong>Large A4 Format (8.27 x 11.69 inches):</strong>{" "}
                      Perfect for colorful illustrations and optimal reading
                      experience
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-2 dark:from-purple-900/30 dark:to-pink-900/30">
                      <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 md:text-base">
                      <strong>Durable Hardcover Finish:</strong> Remains
                      beautiful, even after countless page turns
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-2 dark:from-purple-900/30 dark:to-pink-900/30">
                      <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 md:text-base">
                      <strong>Premium Color Quality:</strong> Brilliant and
                      vibrant colors bring the story to life
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-2 dark:from-purple-900/30 dark:to-pink-900/30">
                      <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 md:text-base">
                      <strong>High-Quality Coated Paper:</strong> For a
                      luxurious appearance and extra protection
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-2 dark:from-purple-900/30 dark:to-pink-900/30">
                      <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 md:text-base">
                      <strong>12 Pages Full of Magic:</strong> Enough space for
                      a beautiful story and enchanting images
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-2 dark:from-purple-900/30 dark:to-pink-900/30">
                      <Paintbrush className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 md:text-base">
                      <strong>Matte or Glossy Cover:</strong> Choose the desired
                      finish for the hardcover cover
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white py-16 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <PricingFAQSection />
        </motion.div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-8 dark:bg-slate-950">
        <div className="container relative mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 text-center text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure payment</span>
              </div>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Money-back guarantee</span>
              </div>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Trusted by thousands of parents</span>
              </div>
            </div>

            {/* Payment logos */}
            <div className="flex items-center gap-4 opacity-50 grayscale">
              <svg
                className="h-8 w-12"
                viewBox="0 0 48 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="32" rx="4" fill="#1434CB" />
                <path
                  d="M18 21.5L20.5 10.5H23.5L21 21.5H18ZM32 11C31.5 10.8 30.7 10.5 29.5 10.5C26.5 10.5 24.5 12 24.5 14C24.5 16 27 16 27 17C27 17.5 26.5 18 25.5 18C24.5 18 23.5 17.5 23 17.5L22.5 20C23 20.5 24.5 21 26 21C29 21 31 19.5 31 17.5C31 15.5 28.5 15.5 28.5 14.5C28.5 14 29 13.5 30 13.5C30.8 13.5 31.5 13.7 32 14L32 11ZM37.5 10.5H35.5C35 10.5 34.5 10.7 34.5 11.5L30.5 21.5H33.5L34 19.5H37.5C37.6 20 38 21.5 38 21.5H40.5L37.5 10.5ZM34.5 17.5L36 13L37 17.5H34.5ZM17.5 10.5L14.5 18.5L14 16C13.5 14.5 12 12.5 10.5 11.5L13 21.5H16L21 10.5H17.5Z"
                  fill="white"
                />
              </svg>
              <svg
                className="h-8 w-12"
                viewBox="0 0 48 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="32" rx="4" fill="#EB001B" />
                <circle cx="18" cy="16" r="8" fill="#FF5F00" />
                <circle cx="30" cy="16" r="8" fill="#F79E1B" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
