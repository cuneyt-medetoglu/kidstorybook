"use client"

import { motion } from "framer-motion"
import { Upload, Sparkles, Gift, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Personalize Your Character",
    titleTr: "Karakteri Kişiselleştir",
    description:
      "Upload your child's photo and add their details (name, age, appearance)",
  },
  {
    number: 2,
    icon: Sparkles,
    title: "Create Your Story",
    titleTr: "Hikaye Oluştur",
    description:
      "Choose a theme and illustration style. AI generates a personalized story",
  },
  {
    number: 3,
    icon: Gift,
    title: "Get Your Book",
    titleTr: "Kitabını Al",
    description:
      "Receive your e-book instantly or order a printed hardcover version",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
}

export function HowItWorks() {
  return (
    <section className="relative overflow-visible bg-gradient-to-b from-pink-50 via-purple-50/30 to-pink-50/30 pb-16 dark:from-slate-950 dark:via-purple-950/10 dark:to-pink-950/10 sm:pb-20 md:overflow-hidden md:pt-4 md:pb-24 lg:pt-5 lg:pb-32">
      {/* Top Wave Separator (mobile) - Merges with Hero section badges */}
      <div className="pointer-events-none absolute left-0 top-0 z-0 w-full -translate-y-[48px] md:hidden sm:-translate-y-[64px]">
        <svg
          className="h-12 w-full text-pink-50 dark:text-slate-950 sm:h-16"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-20 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-500/10" />
        <div className="absolute -right-4 bottom-20 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl dark:bg-pink-500/10" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-balance text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            How It Works
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground md:text-xl">
            Create your personalized storybook in just 3 simple steps
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1
            return (
              <div key={step.number} className="relative flex">
                <motion.div variants={itemVariants} className="flex w-full">
                  <Card className="group relative flex w-full flex-col overflow-visible border-2 border-purple-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-purple-900/20 dark:bg-slate-900 md:p-5 lg:p-8">
                    {/* Gradient overlay on hover */}
                    <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />

                    {/* Step number - large gradient */}
                    <div className="absolute -right-4 -top-4 text-6xl font-bold text-transparent opacity-10 md:text-7xl lg:text-8xl">
                      <span className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text">
                        {step.number}
                      </span>
                    </div>

                    <div className="relative space-y-4 md:space-y-3 lg:space-y-6">
                      {/* Icon with floating animation */}
                      <motion.div
                        animate={{
                          y: [0, -8, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="inline-flex rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg md:p-2.5 lg:p-4"
                      >
                        <Icon className="h-6 w-6 text-white md:h-5 md:w-5 lg:h-8 lg:w-8" />
                      </motion.div>

                      {/* Step number badge */}
                      <div className="inline-flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-base font-bold text-white shadow-md md:h-7 md:w-7 md:text-sm lg:h-10 lg:w-10 lg:text-lg">
                          {step.number}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground md:text-[0.65rem] lg:text-sm">
                          Step {step.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-balance text-xl font-bold text-foreground md:text-lg lg:text-2xl">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-pretty text-sm text-muted-foreground md:text-xs lg:text-base">
                        {step.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>

                {/* Connecting arrow (between cards, outside) */}
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                    className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block md:-right-2 lg:-right-4 xl:-right-6"
                  >
                    <div className="flex items-center justify-center rounded-full bg-white p-1.5 shadow-lg dark:bg-slate-800 md:p-1 lg:p-2">
                      <ArrowRight className="h-4 w-4 text-purple-500 dark:text-purple-400 md:h-3 md:w-3 lg:h-6 lg:w-6" />
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-balance text-lg text-muted-foreground">
            Ready to create a magical story for your child?
          </p>
        </motion.div>
      </div>
    </section>
  )
}

