"use client"

/**
 * @file Checkout sayfası ana içeriği.
 *
 * Yapı:
 *  1. Hardcopy kargo adresi — ürünlerde hardcopy varsa gösterilir
 *  2. Yasal onaylar (LegalConsents) — sadece TR locale, ödeme zorunluluğu
 *  3. Ödeme bölümü — IyzicoPaymentFlow ile tam entegre
 *
 * NOT: Ödeme formu (BillingAddressForm) kendi <form> elementini yönetir.
 * Bu bileşen <div> sarmalayıcıdır; iç içe <form> kullanılmaz.
 *
 * Localization: checkout + legalConsents namespace.
 */

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { IyzicoPaymentFlow } from "@/components/payment/IyzicoPaymentFlow"
import { LegalConsents } from "@/components/checkout/LegalConsents"
import { useCart } from "@/contexts/CartContext"

// ============================================================================
// Props
// ============================================================================

interface CheckoutFormProps {
  hasHardcopy: boolean
}

// ============================================================================
// Bileşen
// ============================================================================

export function CheckoutForm({ hasHardcopy }: CheckoutFormProps) {
  const t      = useTranslations("checkout")
  const tShip  = useTranslations("checkout.shipping")
  const locale = useLocale()
  const { items } = useCart()

  const isTurkish     = locale === "tr"
  const hasEbook      = items.some((item) => item.type === "ebook" || item.type === "ebook_plan")

  // TR locale için yasal onay durumu — diğer locale'lerde her zaman true
  const [legalConsentsAccepted, setLegalConsentsAccepted] = useState(!isTurkish)

  return (
    <div className="space-y-8">
      {/*
       * Kargo adresi bölümü — sadece hardcopy siparişlerde gösterilir.
       * iyzico fatura adresi BillingAddressForm içinde ayrı sorulur.
       */}
      {hasHardcopy && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/30">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {tShip("title")} —{" "}
            <span className="font-medium">{tShip("streetPlaceholder")}</span>
          </p>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            {tShip("hardcopyNote")}
          </p>
        </div>
      )}

      {/* Yasal onaylar — sadece TR kullanıcılar için */}
      {isTurkish && (
        <LegalConsents
          hasEbook={hasEbook}
          hasHardcopy={hasHardcopy}
          onChange={setLegalConsentsAccepted}
        />
      )}

      {/* Ödeme bölümü */}
      <div>
        <h3 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
          {t("paymentMethod")}
        </h3>
        <IyzicoPaymentFlow legalConsentsAccepted={legalConsentsAccepted} />
      </div>
    </div>
  )
}
