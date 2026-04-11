"use client"

/**
 * @file Yasal onay checkboxları — sadece TR locale checkout için.
 *
 * Türk tüketici hukuku (TKHK + Mesafeli Sözleşmeler Yönetmeliği) gereği:
 *   1. Ön Bilgilendirme Formu (ÖBF) — modal ile gösterilir
 *   2. Mesafeli Satış Sözleşmesi (MSS) — /mesafeli-satis sayfasına link
 *   3. Dijital cayma hakkı feragatı — sadece sepette e-book varsa
 *
 * Tüm onaylar verilmeden ödeme butonu aktif olmaz (disabled prop üstten iletilir).
 *
 * Localization: legalConsents namespace.
 */

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Shield, ChevronDown, ChevronUp, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ============================================================================
// ÖBF içeriği (checkout'ta inline gösterim için özet — tam metin /mesafeli-satis)
// ============================================================================

const OBF_SELLER = {
  name: "Cüneyt Medetoğlu (Şahıs İşletmesi)",
  address: "Atatürk Mah. Merkez İsimsiz91 Sk. Dema İnş B Blok No: 4/1 İç Kapı No: 3 Merkez / Tunceli",
  phone: "+90 542 520 92 52",
  email: "info@herokidstory.com",
  vkn: "6130979062 — Tunceli Vergi Dairesi",
}

// ============================================================================
// Props
// ============================================================================

interface LegalConsentsProps {
  hasEbook: boolean
  hasHardcopy: boolean
  onChange: (allAccepted: boolean) => void
}

// ============================================================================
// Bileşen
// ============================================================================

export function LegalConsents({ hasEbook, hasHardcopy, onChange }: LegalConsentsProps) {
  const t = useTranslations("legalConsents")

  const [obfAccepted, setObfAccepted]             = useState(false)
  const [mssAccepted, setMssAccepted]             = useState(false)
  const [digitalWaiver, setDigitalWaiver]         = useState(false)
  const [showObfModal, setShowObfModal]           = useState(false)
  const [obfExpanded, setObfExpanded]             = useState(false)

  const needsDigitalWaiver = hasEbook

  const allAccepted =
    obfAccepted &&
    mssAccepted &&
    (!needsDigitalWaiver || digitalWaiver)

  function handleObfChange(checked: boolean) {
    setObfAccepted(checked)
    const next =
      checked &&
      mssAccepted &&
      (!needsDigitalWaiver || digitalWaiver)
    onChange(next)
  }

  function handleMssChange(checked: boolean) {
    setMssAccepted(checked)
    const next =
      obfAccepted &&
      checked &&
      (!needsDigitalWaiver || digitalWaiver)
    onChange(next)
  }

  function handleWaiverChange(checked: boolean) {
    setDigitalWaiver(checked)
    const next = obfAccepted && mssAccepted && checked
    onChange(next)
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/50">
      {/* Başlık */}
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {t("title")}
        </h3>
      </div>

      <div className="space-y-4">
        {/* --- Checkbox 1: Ön Bilgilendirme Formu --- */}
        <div className="space-y-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={obfAccepted}
              onChange={(e) => handleObfChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-slate-300 text-primary accent-primary"
              aria-describedby="obf-note"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {t("preliminaryInfo.label")}{" "}
              <button
                type="button"
                onClick={() => setShowObfModal(true)}
                className="inline font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                {t("preliminaryInfo.link")}
              </button>
            </span>
          </label>

          {/* ÖBF özet (accordion) */}
          <div className="ml-7">
            <button
              type="button"
              onClick={() => setObfExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              {obfExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              <span>Özeti Gör</span>
            </button>

            {obfExpanded && (
              <div
                id="obf-note"
                className="mt-2 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              >
                <p className="mb-1 font-medium text-slate-800 dark:text-slate-200">Satıcı Bilgileri</p>
                <p>{OBF_SELLER.name}</p>
                <p>{OBF_SELLER.address}</p>
                <p>{OBF_SELLER.email} · {OBF_SELLER.phone}</p>
                <p className="mt-2 font-medium text-slate-800 dark:text-slate-200">Cayma Hakkı</p>
                <p className="mt-1">
                  <strong>Dijital e-kitap:</strong> Ödeme sonrası anında teslim edildiğinden 14 günlük cayma hakkı geçerli değildir (Mesafeli Sözleşmeler Yönetmeliği Md. 15/1-ğ).
                </p>
                {hasHardcopy && (
                  <p className="mt-1">
                    <strong>Basılı kitap:</strong> Kişiselleştirilmiş ürün olduğundan cayma hakkı uygulanmaz (Md. 15/1-ç). Üretime alınmadan önce iptal mümkündür.
                  </p>
                )}
                <p className="mt-2 font-medium text-slate-800 dark:text-slate-200">Teslimat</p>
                {hasEbook && <p className="mt-1">E-kitap: ödeme sonrası ~15 dakika içinde hesabınıza eklenir.</p>}
                {hasHardcopy && <p className="mt-1">Basılı kitap: 3 iş günü içinde kargoya verilir (1–3 iş günü teslimat).</p>}
              </div>
            )}
          </div>
        </div>

        {/* --- Checkbox 2: Mesafeli Satış Sözleşmesi --- */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={mssAccepted}
            onChange={(e) => handleMssChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-slate-300 text-primary accent-primary"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            {t("contract.label")}{" "}
            <Link
              href="/mesafeli-satis"
              target="_blank"
              className="inline-flex items-center gap-0.5 font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {t("contract.link")}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          </span>
        </label>

        {/* --- Checkbox 3: Dijital cayma feragatı (sadece e-book içeren siparişler) --- */}
        {needsDigitalWaiver && (
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <input
              type="checkbox"
              checked={digitalWaiver}
              onChange={(e) => handleWaiverChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-slate-300 text-primary accent-primary"
            />
            <span className="text-sm text-amber-800 dark:text-amber-300">
              {t("digitalWaiver.label")}
            </span>
          </label>
        )}
      </div>

      {/* Tüm onaylar verilmemişse uyarı */}
      {!allAccepted && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ⚠️ {t("requiredNotice")}
        </p>
      )}

      {/* ÖBF tam metin modal */}
      <Dialog open={showObfModal} onOpenChange={setShowObfModal}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{t("modalTitle")}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <section>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">1. Satıcı Bilgileri</h4>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Satıcı:</span> {OBF_SELLER.name}</p>
                <p><span className="font-medium">Adres:</span> {OBF_SELLER.address}</p>
                <p><span className="font-medium">Tel:</span> {OBF_SELLER.phone}</p>
                <p><span className="font-medium">E-posta:</span> {OBF_SELLER.email}</p>
                <p><span className="font-medium">Vergi No:</span> {OBF_SELLER.vkn}</p>
              </div>
            </section>

            <section>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">2. Ürün Bilgileri</h4>
              <p className="mt-1">
                Yapay zeka (AI) destekli, kişiselleştirilmiş çocuk hikaye kitabı.
                Kullanıcının yüklediği fotoğraflar ve tercihleri doğrultusunda üretilir.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                KDV: E-kitap %20 / Basılı kitap %0 (kitaplar KDV&apos;den muaftır)
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">3. Ödeme</h4>
              <p className="mt-1">Kredi/banka kartı ile tek çekim. Taksit uygulanmaz. Ödeme İyzico altyapısı ile 3D Secure güvencesinde gerçekleştirilir.</p>
            </section>

            <section>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">4. Teslimat</h4>
              {hasEbook && (
                <p className="mt-1">
                  <strong>E-kitap:</strong> Ödeme onayından sonra yaklaşık 15 dakika içinde hesabınıza eklenir.
                </p>
              )}
              {hasHardcopy && (
                <p className="mt-1">
                  <strong>Basılı kitap:</strong> Ödeme onayından itibaren 3 iş günü içinde kargoya teslim edilir. Kargo sonrası teslimat 1–3 iş günüdür.
                </p>
              )}
            </section>

            <section>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">5. Cayma Hakkı</h4>
              {hasEbook && (
                <p className="mt-1 rounded bg-amber-50 p-2 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                  <strong>Dijital e-kitap:</strong> Mesafeli Sözleşmeler Yönetmeliği Madde 15/1-ğ uyarınca, elektronik ortamda anında teslim edilen dijital içerikte cayma hakkı kullanılamaz.
                </p>
              )}
              {hasHardcopy && (
                <p className="mt-1 rounded bg-amber-50 p-2 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                  <strong>Basılı kitap:</strong> Kişiselleştirilmiş ürün istisnası (Md. 15/1-ç) kapsamında cayma hakkı uygulanmaz. Kitap üretime alınmadan önce iptal mümkündür.
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Şikayet ve uyuşmazlık: info@herokidstory.com · Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri
              </p>
            </section>

            <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
              <Link
                href="/mesafeli-satis"
                target="_blank"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {t("viewFull")}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowObfModal(false)}>
              <X className="mr-1.5 h-4 w-4" />
              {t("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
