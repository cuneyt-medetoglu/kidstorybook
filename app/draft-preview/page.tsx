"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ShoppingCart,
  LogIn,
  Mail,
  ArrowLeft,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  getDraftFromLocalStorage,
  type DraftData,
  transferDraftToDatabase,
} from "@/lib/draft-storage"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DraftPreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const draftId = searchParams.get("draftId")
  const { addToCart } = useCart()
  const { toast } = useToast()

  const [draft, setDraft] = useState<DraftData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"10" | "15" | "20">("10")
  const [showPlanModal, setShowPlanModal] = useState(false)

  // Plan prices (mock - will be fetched from pricing API later)
  const planPrices = {
    "10": 7.99,
    "15": 9.99,
    "20": 12.99,
  }

  useEffect(() => {
    const loadDraft = async () => {
      if (!draftId) {
        router.push("/")
        return
      }

      setIsLoading(true)

      try {
        // Try to get from localStorage first
        let draftData = getDraftFromLocalStorage(draftId)

        // If not in localStorage, try API (for authenticated users)
        if (!draftData) {
          const response = await fetch(`/api/drafts/${draftId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              draftData = data.draft
            }
          }
        }

        if (!draftData) {
          toast({
            title: "Draft not found",
            description: "This draft may have expired or doesn't exist",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        setDraft(draftData)

        // Check if user is authenticated
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error("[DraftPreview] Error loading draft:", error)
        toast({
          title: "Error",
          description: "Failed to load draft",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDraft()
  }, [draftId, router, toast])

  const handleBuyFullBook = () => {
    if (!draft) return

    setShowPlanModal(true)
  }

  const handlePlanSelect = () => {
    if (!draft) return

    // Add ebook plan to cart with draft info
    addToCart({
      type: "ebook_plan",
      bookTitle: `E-Book (${selectedPlan} pages) - ${draft.characterData.name}'s Story`,
      price: planPrices[selectedPlan],
      quantity: 1,
      planType: selectedPlan,
      draftId: draft.draftId,
      characterData: draft.characterData,
    })

    toast({
      title: "Added to cart",
      description: "E-Book plan has been added to your cart",
    })

    setShowPlanModal(false)
    router.push("/cart")
  }

  const handleLoginToSave = () => {
    router.push(`/auth/login?redirect=/draft-preview?draftId=${draftId}`)
  }

  const handleEmailShare = async () => {
    // TODO: Implement email share modal/form
    toast({
      title: "Coming soon",
      description: "Email sharing feature will be available soon",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-64 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (!draft) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isAuthenticated ? "Back to My Library" : "Back to Home"}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Draft Preview
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Your personalized book cover is ready!
          </p>
        </div>

        {/* Draft Content */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={draft.coverImage}
                    alt={`${draft.characterData.name}'s book cover`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Draft Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {draft.characterData.name}'s Story
                  </h2>
                </div>

                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="font-semibold">Character:</span>{" "}
                    {draft.characterData.name} ({draft.characterData.age} years old)
                  </div>
                  <div>
                    <span className="font-semibold">Theme:</span> {draft.theme}
                  </div>
                  <div>
                    <span className="font-semibold">Style:</span> {draft.style}
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(draft.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <Badge className="mt-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  Draft Cover
                </Badge>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                onClick={handleBuyFullBook}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy Full Book
              </Button>

              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleLoginToSave}
                  className="w-full"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Login to Save
                </Button>
              )}

              <Button
                size="lg"
                variant="outline"
                onClick={handleEmailShare}
                className="w-full"
              >
                <Mail className="mr-2 h-5 w-5" />
                Share via Email
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Plan Selection Modal */}
        <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select E-Book Plan</DialogTitle>
              <DialogDescription>
                Choose the number of pages for your storybook
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {(["10", "15", "20"] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    selectedPlan === plan
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {plan} Pages
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Perfect for {plan === "10" ? "younger" : plan === "15" ? "middle" : "older"} children
                      </div>
                    </div>
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      ${planPrices[plan].toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPlanModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePlanSelect}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                Add to Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
