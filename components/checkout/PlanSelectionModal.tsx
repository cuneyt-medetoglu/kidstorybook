"use client"

import { useState } from "react"
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
import { useCurrency } from "@/contexts/CurrencyContext"
import { useTranslations } from "next-intl"

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
  const { currencyConfig: contextCurrency, isLoading: contextLoading } = useCurrency()
  const currencyConfig = externalCurrencyConfig ?? contextCurrency
  const isLoadingCurrency = !externalCurrencyConfig && contextLoading
  const [selectedPlan, setSelectedPlan] = useState<"10" | "15" | "20">("10")
  const t = useTranslations("checkout.plan")

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
      description: t("10pages.description"),
      features: [t("10pages.feature1"), t("10pages.feature2"), t("10pages.feature3")],
    },
    {
      type: "15" as const,
      pages: 15,
      description: t("15pages.description"),
      features: [t("15pages.feature1"), t("15pages.feature2"), t("15pages.feature3")],
    },
    {
      type: "20" as const,
      pages: 20,
      description: t("20pages.description"),
      features: [t("20pages.feature1"), t("20pages.feature2"), t("20pages.feature3")],
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            {t("subtitle")}
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
                    ? "border-primary bg-primary/5 dark:border-primary dark:bg-primary/10"
                    : "border-gray-200 bg-white hover:border-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {t("pages", { n: plan.pages })}
                      </h3>
                      {isSelected && (
                        <Badge className="bg-primary text-white">
                          {t("selected")}
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
                      <div className="text-2xl font-bold text-primary">
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
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
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
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-primary to-brand-2 text-white hover:opacity-90"
          >
            {t("addToCart")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
