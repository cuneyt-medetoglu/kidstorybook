"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X, Settings, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

type ConsentState = "accepted" | "declined" | "custom" | null

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Small delay before showing banner for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted")
    localStorage.setItem(
      "cookie-preferences",
      JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
      }),
    )
    setShowBanner(false)
    setShowCustomize(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    localStorage.setItem(
      "cookie-preferences",
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
      }),
    )
    setShowBanner(false)
    setShowCustomize(false)
  }

  const handleSaveCustom = () => {
    localStorage.setItem("cookie-consent", "custom")
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences))
    setShowBanner(false)
    setShowCustomize(false)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") return // Essential cookies cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-purple-200 dark:border-purple-800 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {!showCustomize ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Cookie Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Cookie Preferences</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
                    By clicking &apos;Accept All&apos;, you consent to our use of cookies.{" "}
                    <a
                      href="/privacy-policy"
                      className="text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 underline transition-colors"
                    >
                      Learn more
                    </a>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    className="flex-1 sm:flex-none border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold px-6 py-2 rounded-full transition-all duration-300 bg-transparent"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={() => setShowCustomize(true)}
                    variant="ghost"
                    className="flex-1 sm:flex-none text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 font-semibold px-6 py-2 rounded-full transition-all duration-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Customize Cookie Preferences</h3>
                  <Button
                    onClick={() => setShowCustomize(false)}
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Essential Cookies */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-50">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Essential Cookies{" "}
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(Always Active)</span>
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Required for the website to function properly. These cookies enable core functionality such as
                        security, network management, and accessibility.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0 mt-1">
                      <button
                        onClick={() => togglePreference("analytics")}
                        className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 ${
                          preferences.analytics
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 justify-end"
                            : "bg-gray-300 dark:bg-gray-600 justify-start"
                        } px-1`}
                      >
                        <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Help us understand how visitors interact with our website by collecting and reporting
                        information anonymously.
                      </p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0 mt-1">
                      <button
                        onClick={() => togglePreference("marketing")}
                        className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 ${
                          preferences.marketing
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 justify-end"
                            : "bg-gray-300 dark:bg-gray-600 justify-start"
                        } px-1`}
                      >
                        <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Used to track visitors across websites to display relevant advertisements and campaigns.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    onClick={handleSaveCustom}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold px-8 py-2 rounded-full transition-all duration-300 bg-transparent"
                  >
                    Accept All
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

