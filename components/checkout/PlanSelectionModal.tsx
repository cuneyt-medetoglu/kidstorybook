"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, BookOpen } from "lucide-react"
import type { CurrencyConfig } from "@/lib/currency"
import { getCurrencyConfig } from "@/lib/currency"

interface PlanSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPlan: (planType: "10" | "15" | "20", price: number) => void
  currencyConfig?: CurrencyConfig
}

// Base prices in USD
const BASE_PLAN_PRICES = {
  "10": 7.99,
  "15": 9.99,
  "20": 12.99,
}

// Currency conversion rates (simplified - in production, use real-time rates)
const CURRENCY_RATES: Record<string, number> = {
  USD: 1.0,
  TRY: 32.0, // Approximate rate
  EUR: 0.92,
  GBP: 0.79,
}

export function PlanSelectionModal({
  isOpen,
  onClose,
  onSelectPlan,
  currencyConfig: externalCurrencyConfig,
}: PlanSelectionModalProps) {
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(
    externalCurrencyConfig || {
      currency: "USD",
      symbol: "$",
      price: "$7.99",
    }
  )
  const [selectedPlan, setSelectedPlan] = useState<"10" | "15" | "20">("10")
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(!externalCurrencyConfig)

  // Fetch currency if not provided
  useEffect(() => {
    if (externalCurrencyConfig) {
      setCurrencyConfig(externalCurrencyConfig)
      setIsLoadingCurrency(false)
      return
    }

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
        console.error("[PlanSelectionModal] Error fetching currency:", error)
        // Keep default USD
      } finally {
        setIsLoadingCurrency(false)
      }
    }

    fetchCurrency()
  }, [externalCurrencyConfig])

  // Calculate price for selected plan
  const getPlanPrice = (planType: "10" | "15" | "20"): number => {
    const basePrice = BASE_PLAN_PRICES[planType]
    const rate = CURRENCY_RATES[currencyConfig.currency] || 1.0
    return basePrice * rate
  }

  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    return `${currencyConfig.symbol}${price.toFixed(2)}`
  }

  const handleConfirm = () => {
    const price = getPlanPrice(selectedPlan)
    onSelectPlan(selectedPlan, price)
  }

  const plans = [
    {
      type: "10" as const,
      pages: 10,
      description: "Perfect for a short, sweet story",
      features: ["10 pages", "Quick read", "Perfect for bedtime"],
    },
    {
      type: "15" as const,
      pages: 15,
      description: "Ideal length for most stories",
      features: ["15 pages", "Balanced story", "More illustrations"],
    },
    {
      type: "20" as const,
      pages: 20,
      description: "Extended adventure with more details",
      features: ["20 pages", "Detailed story", "Rich illustrations"],
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Choose Your Book Plan
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Select the number of pages for your personalized book
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {plans.map((plan) => {
            const price = getPlanPrice(plan.type)
            const isSelected = selectedPlan === plan.type

            return (
              <motion.div
                key={plan.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedPlan(plan.type)}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20"
                    : "border-gray-200 bg-white hover:border-purple-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {plan.pages} Pages
                      </h3>
                      {isSelected && (
                        <Badge className="bg-purple-600 text-white dark:bg-purple-500">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                      {plan.description}
                    </p>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                        >
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="ml-4 text-right">
                    {isLoadingCurrency ? (
                      <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    ) : (
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {formatPrice(price)}
                      </div>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-4"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white dark:bg-purple-500">
                      <Check className="h-4 w-4" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
