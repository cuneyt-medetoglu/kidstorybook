"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import type { CurrencyConfig, Currency } from "@/lib/currency"
import { getCurrencyConfig } from "@/lib/currency"

const defaultConfig: CurrencyConfig = getCurrencyConfig("USD")

type CurrencyContextValue = {
  currencyConfig: CurrencyConfig
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currencyConfig: defaultConfig,
  isLoading: true,
})

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch("/api/currency")
      .then((res) => res.json())
      .then((data: { currency?: string }) => {
        if (cancelled || !data?.currency) return
        setCurrencyConfig(getCurrencyConfig((data.currency as Currency) || "USD"))
      })
      .catch(() => {
        if (!cancelled) setCurrencyConfig(defaultConfig)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <CurrencyContext.Provider value={{ currencyConfig, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    return {
      currencyConfig: defaultConfig,
      isLoading: false,
    }
  }
  return ctx
}
