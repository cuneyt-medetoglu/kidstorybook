"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle, XCircle, Loader2, Mail, RefreshCw } from "lucide-react"
import Link from "next/link"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("pending")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    const token = searchParams.get("token")
    const type = searchParams.get("type")
    const emailParam = searchParams.get("email")

    if (emailParam) {
      setEmail(emailParam)
    }

    if (token) {
      setStatus("loading")
      const timer = setTimeout(() => {
        // TODO: implement token verification via NextAuth / custom email flow
        setStatus("success")
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      setStatus("pending")
    }
  }, [searchParams, router])

  const handleResendEmail = async () => {
    // TODO: implement resend email via NextAuth / custom email flow
  }

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

          {/* Verification Card */}
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
                  Verifying Email...
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-sm text-gray-600 dark:text-slate-400"
                >
                  Please wait while we verify your email address
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
                  Email Verified!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-sm text-gray-600 dark:text-slate-400 mb-6"
                >
                  Your email address has been successfully verified. You can now sign in to your account.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <Link href="/auth/login">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400">
                        Sign In Now
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
                  Verification Failed
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-sm text-gray-600 dark:text-slate-400 mb-6"
                >
                  {errorMessage || "The verification link is invalid or has expired. Please request a new one."}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="space-y-3"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleResendEmail}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </Button>
                  </motion.div>
                  <Link href="/auth/login">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-purple-300 py-6 text-purple-600 transition-all hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
                      >
                        Back to Sign In
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </>
            )}

            {status === "pending" && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
                >
                  <Mail className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2"
                >
                  Check Your Email
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-sm text-gray-600 dark:text-slate-400 mb-6"
                >
                  {email ? (
                    <>
                      We've sent a verification email to{" "}
                      <span className="font-semibold text-purple-600 dark:text-purple-400">{email}</span>. Please click
                      the link in the email to verify your account.
                    </>
                  ) : (
                    "We've sent a verification email to your email address. Please click the link in the email to verify your account."
                  )}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="space-y-3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20"
                  >
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                      <strong>Didn't receive the email?</strong>
                      <br />
                      Check your spam folder or click the button below to resend.
                    </p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleResendEmail}
                      variant="outline"
                      className="w-full border-purple-300 py-6 text-purple-600 transition-all hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </Button>
                  </motion.div>
                  <Link href="/auth/login">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400">
                        Back to Sign In
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
