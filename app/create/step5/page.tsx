"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Lightbulb, Sparkles, BookOpen, PenTool, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Validation schema
const formSchema = z.object({
  customRequests: z.string().max(500, "Custom requests must not exceed 500 characters").optional().or(z.literal("")),
  pageCount: z.number().min(0).max(20).optional(), // Debug: Page count override (0 = cover only, undefined = cover only)
})

type FormData = z.infer<typeof formSchema>

export default function Step5Page() {
  const router = useRouter()
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customRequests: "",
      pageCount: undefined,
    },
  })

  const customRequests = watch("customRequests") || ""
  const pageCount = watch("pageCount")
  const remainingChars = 500 - customRequests.length

  const handleNext = () => {
    // Save custom requests and page count to localStorage
    try {
      const saved = localStorage.getItem("kidstorybook_wizard")
      const wizardData = saved ? JSON.parse(saved) : {}
      
      wizardData.step5 = {
        customRequests: customRequests || undefined,
        pageCount: pageCount || undefined, // Debug: Optional page count override
      }
      
      localStorage.setItem("kidstorybook_wizard", JSON.stringify(wizardData))
    } catch (error) {
      console.error("Error saving step 5 data:", error)
    }
    
    router.push("/create/step6")
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
    { Icon: Lightbulb, top: "10%", left: "8%", delay: 0, size: "h-8 w-8", color: "text-yellow-400" },
    { Icon: Sparkles, top: "15%", right: "10%", delay: 0.5, size: "h-7 w-7", color: "text-purple-400" },
    { Icon: BookOpen, top: "70%", left: "5%", delay: 1, size: "h-7 w-7", color: "text-pink-400" },
    { Icon: PenTool, top: "75%", right: "8%", delay: 1.5, size: "h-6 w-6", color: "text-blue-400" },
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

      <div className="container relative mx-auto px-4 py-8 md:py-12">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mx-auto max-w-2xl">
            <div className="mb-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-slate-300">
              <span>Step 5 of 6</span>
              <span>Custom Requests</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "83.33%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div className="rounded-2xl bg-white/80 p-6 shadow-2xl backdrop-blur-sm dark:bg-slate-800/80 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-8 text-center"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Custom Requests</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Optional - Add any special requests for your story
              </p>
            </motion.div>

            {/* Custom Requests Textarea Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mb-8"
            >
              <label
                htmlFor="customRequests"
                className="mb-3 block text-base font-semibold text-gray-900 dark:text-slate-50"
              >
                Custom Requests
              </label>

              <div className="relative">
                <textarea
                  id="customRequests"
                  {...register("customRequests")}
                  placeholder="E.g., Include dinosaurs in the story, have them play soccer in the park, add a pet dog named Max..."
                  className="min-h-[200px] w-full resize-y rounded-lg border-2 border-gray-300 bg-white p-4 text-gray-900 transition-all placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-purple-400 md:min-h-[250px]"
                  aria-label="Custom Requests"
                  aria-describedby="custom-requests-help custom-requests-counter"
                />

                {/* Character Counter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="absolute bottom-3 right-3"
                >
                  <span
                    id="custom-requests-counter"
                    className={`text-xs ${
                      remainingChars < 50 ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-slate-500"
                    }`}
                    aria-live="polite"
                  >
                    {remainingChars} characters remaining
                  </span>
                </motion.div>
              </div>

              {/* Error Message */}
              {errors.customRequests && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.customRequests.message}
                </motion.p>
              )}

              {/* Helper Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                id="custom-requests-help"
                className="mt-3 text-sm text-gray-600 dark:text-slate-400"
              >
                Tell us about any specific elements, characters, or scenarios you'd like to include in the story
              </motion.p>
            </motion.div>

            {/* Debug: Page Count Override */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mb-8 rounded-lg border-2 border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-900/20"
            >
              <label
                htmlFor="pageCount"
                className="mb-2 block text-sm font-semibold text-amber-900 dark:text-amber-200"
              >
                🐛 Debug: Page Count (Optional)
              </label>
              <input
                id="pageCount"
                type="number"
                min="0"
                max="20"
                {...register("pageCount", { valueAsNumber: true })}
                placeholder="Leave empty for cover only (no pages)"
                className="w-full rounded-lg border-2 border-amber-300 bg-white p-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-amber-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-amber-500"
              />
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                For testing: Override default page count (2-20 pages). Leave empty to use default (10 pages).
              </p>
              {errors.pageCount && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.pageCount.message}
                </motion.p>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between"
            >
              <Link href="/create/step4" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-2 border-gray-300 bg-transparent px-6 py-6 text-base font-semibold transition-all hover:border-purple-500 hover:bg-purple-50 dark:border-slate-600 dark:hover:border-purple-400 dark:hover:bg-purple-900/20 sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    <span>Back</span>
                  </Button>
                </motion.div>
              </Link>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400 sm:w-auto"
                >
                  <span>Next</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Need help?{" "}
              <Link
                href="/help"
                className="font-semibold text-purple-600 underline underline-offset-2 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Contact Support
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

