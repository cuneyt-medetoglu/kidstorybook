"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Gift,
  Mail,
  BookOpen,
  Pencil,
  Share2,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import type { CurrencyConfig } from "@/lib/currency"
import { getCurrencyConfig } from "@/lib/currency"

// Timeline step configuration
const timelineSteps = [
  {
    id: 1,
    title: "Book Creation",
    description:
      "After payment, we immediately create your digital children's book. Available within just 2 hours and you'll receive an email when it's ready!",
    icon: BookOpen,
    gradient: "from-purple-500 to-purple-600",
    shadowColor: "shadow-purple-500/50",
  },
  {
    id: 2,
    title: "Edit & Perfect",
    description:
      "After creation you can easily adjust texts and illustrations until the result is perfect.",
    icon: Pencil,
    gradient: "from-pink-500 to-rose-500",
    shadowColor: "shadow-pink-500/50",
  },
  {
    id: 3,
    title: "Share & Print",
    description:
      "Happy with it? Share your digital book directly with family and friends or order a beautiful hardcover copy as a lasting memory.",
    icon: Share2,
    gradient: "from-purple-600 to-pink-600",
    shadowColor: "shadow-purple-600/50",
  },
]

export default function Step6Page() {
  const router = useRouter()
  const { toast } = useToast()

  // Auth state
  const [user, setUser] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  // Email state (unauthenticated users)
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")

  // Free cover state
  const [hasFreeCover, setHasFreeCover] = useState(false)
  const [isCheckingFreeCover, setIsCheckingFreeCover] = useState(true)

  // Currency state
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(
    getCurrencyConfig("USD")
  )
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true)

  // Wizard data
  const [wizardData, setWizardData] = useState<any>(null)

  // Loading states
  const [isCreating, setIsCreating] = useState(false)

  // Hover state for timeline nodes
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Load wizard data from localStorage
  useEffect(() => {
    const data = localStorage.getItem("kidstorybook_wizard")
    if (data) {
      setWizardData(JSON.parse(data))
    }
  }, [])

  // Check auth state
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoadingAuth(false)
    }
    checkAuth()
  }, [])

  // Fetch currency
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch("/api/currency")
        const data = await response.json()

        if (data.currency) {
          setCurrencyConfig(getCurrencyConfig(data.currency))
        }
      } catch (error) {
        console.error("Error fetching currency:", error)
      } finally {
        setIsLoadingCurrency(false)
      }
    }

    fetchCurrency()
  }, [])

  // Check free cover status
  useEffect(() => {
    const checkFreeCover = async () => {
      if (user) {
        try {
          const response = await fetch("/api/users/free-cover-status")
          const data = await response.json()
          setHasFreeCover(data.hasFreeCover)
        } catch (error) {
          console.error("Error checking free cover:", error)
          setHasFreeCover(false)
        }
      } else {
        setHasFreeCover(false)
      }
      setIsCheckingFreeCover(false)
    }

    if (!isLoadingAuth) {
      checkFreeCover()
    }
  }, [user, isLoadingAuth])

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Handle purchase
  const handlePurchase = async () => {
    if (!user && (!email || !validateEmail(email))) {
      setEmailError("Please enter a valid email address")
      return
    }

    setEmailError("")

    // Redirect to cart with email
    router.push(`/cart?plan=ebook&email=${encodeURIComponent(email)}`)
  }

  // Handle free cover creation
  const handleCreateFreeCover = async () => {
    if (!user && (!email || !validateEmail(email))) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/books/create-free-cover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardData,
          email: user ? user.email : email,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create free cover")
      }

      toast({
        title: "Free Cover Created!",
        description: "Your free book cover is ready to preview.",
      })

      router.push(`/draft-preview?draftId=${result.draftId}`)
    } catch (error) {
      console.error("Error creating free cover:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create free cover",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center md:mb-12"
        >
          <h1 className="mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400 md:text-4xl">
            Your Book Journey Starts Here
          </h1>
          <p className="text-balance text-sm text-gray-600 dark:text-slate-400 md:text-base">
            One click away from creating a magical personalized storybook
          </p>
        </motion.div>

        {/* Interactive Timeline Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50/30 to-pink-50/30 p-6 dark:border-slate-700/50 dark:from-slate-800/30 dark:to-slate-900/30 md:p-8"
        >
          {/* Timeline Title */}
          <h2 className="mb-6 text-center text-lg font-bold text-gray-900 dark:text-white md:mb-8 md:text-xl">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
              What Happens Next
            </span>
          </h2>

          {/* Timeline Flow - Desktop: Horizontal, Mobile: Vertical */}
          <div className="relative">
            {/* Connecting Line - Desktop */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
              className="absolute left-[calc(16.666%-0.5rem)] top-10 hidden h-1 w-[calc(66.666%+1rem)] origin-left bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 md:block"
              style={{ transformOrigin: "left center" }}
            />

            {/* Mobile vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
              className="absolute left-8 top-10 h-[calc(100%-2.5rem)] w-1 origin-top bg-gradient-to-b from-purple-500 via-pink-500 to-purple-600 md:hidden"
            />

            {/* Timeline Steps */}
            <div className="relative flex flex-col gap-8 md:flex-row md:justify-between md:gap-12">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon
                const isHovered = hoveredStep === step.id

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2 * index + 0.4,
                      ease: "easeOut",
                    }}
                    className="relative flex flex-1 flex-col items-center"
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Node Circle */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-lg transition-all duration-300 md:h-20 md:w-20 ${
                        isHovered ? `${step.shadowColor} shadow-xl` : ""
                      }`}
                    >
                      {/* Step Number Badge */}
                      <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-purple-600 shadow-md dark:bg-slate-800 dark:text-purple-400">
                        {step.id}
                      </div>

                      {/* Icon */}
                      <motion.div
                        initial={{ rotate: -180 }}
                        animate={{ rotate: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2 * index + 0.5,
                        }}
                      >
                        <Icon className="h-8 w-8 text-white md:h-10 md:w-10" />
                      </motion.div>
                    </motion.div>

                    {/* Step Title */}
                    <h3 className="mt-4 text-center text-sm font-semibold text-gray-900 dark:text-white md:text-base">
                      {step.title}
                    </h3>

                    {/* Step Description - Always visible on mobile, hover on desktop */}
                    <AnimatePresence>
                      {(isHovered || isMobile) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 max-w-xs text-center text-xs text-gray-600 dark:text-slate-400 md:text-sm"
                        >
                          {step.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Email Input Section (Unauthenticated Users Only) */}
        {!user && !isLoadingAuth && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-6 rounded-xl border-2 border-purple-200 bg-purple-50/50 p-6 dark:border-purple-700/50 dark:bg-purple-950/20"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/50">
                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <Label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-gray-900 dark:text-white md:text-base"
                >
                  Email Address
                </Label>
                <p className="mb-3 text-xs text-gray-600 dark:text-slate-400">
                  We need your email to send you the cover image and marketing
                  updates.
                </p>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError("")
                  }}
                  className={`${emailError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {emailError && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {emailError}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4"
        >
          {/* Free Cover Button (Conditional) */}
          {!isCheckingFreeCover && hasFreeCover && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={handleCreateFreeCover}
                disabled={isCreating || (!user && !validateEmail(email))}
                size="lg"
                className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50 md:text-base"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-5 w-5" />
                    Create Free Cover
                  </>
                )}
              </Button>
              <p className="mt-2 text-center text-xs text-gray-600 dark:text-slate-400">
                Use your free cover credit to create just the cover (Page 1)
              </p>
            </motion.div>
          )}

          {/* Purchase Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              onClick={handlePurchase}
              disabled={
                isCreating ||
                isLoadingCurrency ||
                (!user && !validateEmail(email))
              }
              size="lg"
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50 md:text-base"
            >
              {isLoadingCurrency ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Pay & Create My Book • {currencyConfig.price}
                </>
              )}
            </Button>
            <p className="mt-2 text-center text-xs text-gray-600 dark:text-slate-400">
              {"You'll"} receive {currencyConfig.price} as a discount on the
              hardcover!
            </p>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Link href="/create/step5">
              <Button
                variant="ghost"
                size="lg"
                className="w-full rounded-xl text-sm md:text-base"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 text-center text-xs text-gray-600 dark:text-slate-400"
        >
          <p>🔒 Secure payment • 💯 30-day money-back guarantee</p>
        </motion.div>
      </div>
    </div>
  )
}
