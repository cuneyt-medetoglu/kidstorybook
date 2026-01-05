"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    // Faz 3'te Supabase Auth callback handling yapılacak
    // const code = searchParams.get("code")
    // const error = searchParams.get("error")
    // const errorDescription = searchParams.get("error_description")

    // Simulate OAuth callback processing
    const timer = setTimeout(() => {
      const error = searchParams.get("error")
      if (error) {
        setStatus("error")
        setErrorMessage(searchParams.get("error_description") || "OAuth authentication failed")
      } else {
        setStatus("success")
        // Faz 3'te: Redirect to dashboard or home page after successful authentication
        // router.push("/dashboard")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [searchParams, router])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="container relative mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo or Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8 text-center"
          >
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                KidStoryBook
              </span>
            </Link>
          </motion.div>

          {/* Callback Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm dark:bg-slate-800/80 text-center"
          >
            {status === "loading" && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
                >
                  <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2"
                >
                  Completing Sign In...
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-sm text-gray-600 dark:text-slate-400"
                >
                  Please wait while we complete your authentication
                </motion.p>
              </>
            )}

            {status === "success" && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30"
                >
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2"
                >
                  Sign In Successful!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-sm text-gray-600 dark:text-slate-400 mb-6"
                >
                  You have been successfully signed in. Redirecting...
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <Link href="/">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400">
                        Go to Home
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </>
            )}

            {status === "error" && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30"
                >
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2"
                >
                  Sign In Failed
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-sm text-gray-600 dark:text-slate-400 mb-4"
                >
                  {errorMessage || "An error occurred during authentication. Please try again."}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="space-y-3"
                >
                  <Link href="/auth/login">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400">
                        Try Again
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-purple-300 py-6 text-purple-600 transition-all hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
                      >
                        Go to Home
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

