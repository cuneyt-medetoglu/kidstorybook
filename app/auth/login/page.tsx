"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Heart, BookOpen, Star, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("[Login] Attempting login for:", data.email)

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        const msg = result.error
        if (msg.includes("email not confirmed") || msg.includes("Email not confirmed")) {
          throw new Error("Please verify your email address before logging in. Check your inbox for the verification link.")
        }
        throw new Error(msg || "Invalid email or password")
      }

      if (result?.ok) {
        console.log("[Login] Success:", data.email)
        router.push("/dashboard")
        router.refresh()
        return
      }

      throw new Error("Login failed. Please try again.")
    } catch (err) {
      console.error("Login error:", err)
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again."
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const handleGoogleOAuth = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  const handleFacebookOAuth = () => {
    signIn("facebook", { callbackUrl: "/dashboard" })
  }

  // Floating animations for decorative elements
  const floatingVariants = {
    animate: (i: number) => ({
      y: [0, -15, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 3 + i * 0.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut" as const,
      },
    }),
  }

  const decorativeElements = [
    { Icon: Star, top: "10%", left: "8%", delay: 0, size: "h-6 w-6", color: "text-yellow-400" },
    { Icon: Heart, top: "15%", right: "10%", delay: 0.5, size: "h-8 w-8", color: "text-pink-400" },
    { Icon: Sparkles, top: "70%", left: "5%", delay: 1, size: "h-6 w-6", color: "text-purple-400" },
    { Icon: BookOpen, top: "75%", right: "8%", delay: 1.5, size: "h-7 w-7", color: "text-blue-400" },
    { Icon: Star, top: "40%", left: "3%", delay: 0.8, size: "h-5 w-5", color: "text-pink-300" },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Decorative floating elements - hidden on mobile */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {decorativeElements.map((element, index) => {
          const Icon = element.Icon
          return (
            <motion.div
              key={index}
              custom={index}
              variants={floatingVariants}
              animate="animate"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 0.4, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: element.delay, duration: 0.5 }}
              className="absolute"
              style={{
                top: element.top,
                left: element.left,
                right: element.right,
              }}
            >
              <Icon className={`${element.size} ${element.color} drop-shadow-lg`} />
            </motion.div>
          )
        })}
      </div>

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

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm dark:bg-slate-800/80"
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-3xl font-bold text-gray-900 dark:text-slate-50"
              >
                Welcome Back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-2 text-sm text-gray-600 dark:text-slate-400"
              >
                Sign in to continue creating magical stories
              </motion.p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className={`pl-10 ${
                      errors.email
                        ? "border-red-500 ring-red-500 focus-visible:ring-red-500"
                        : "border-gray-300 focus-visible:ring-purple-500 dark:border-slate-600"
                    }`}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="email-error"
                    className="text-sm text-red-500"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`pl-10 pr-10 ${
                      errors.password
                        ? "border-red-500 ring-red-500 focus-visible:ring-red-500"
                        : "border-gray-300 focus-visible:ring-purple-500 dark:border-slate-600"
                    }`}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="password-error"
                    className="text-sm text-red-500"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" {...register("rememberMe")} />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-purple-600 underline underline-offset-2 transition-colors hover:text-pink-600 dark:text-purple-400 dark:hover:text-pink-400"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Sign In Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:from-purple-400 dark:to-pink-400"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white/80 px-4 text-gray-500 dark:bg-slate-800/80 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>
              </motion.div>

              {/* OAuth Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="space-y-3"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleOAuth}
                    className="w-full border-gray-300 bg-white py-6 text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFacebookOAuth}
                    className="w-full border-blue-500 bg-blue-600 py-6 text-white transition-all hover:bg-blue-700 hover:shadow-md dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-purple-600 underline underline-offset-2 transition-colors hover:text-pink-600 dark:text-purple-400 dark:hover:text-pink-400"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="mt-6 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4 text-gray-500 dark:text-slate-400" />
              <p className="text-xs text-gray-500 dark:text-slate-400">Your data is secure and encrypted</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

