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
      ease: "easeOut",
    },
  },
}

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-pink-50/30 py-20 dark:from-slate-950 dark:via-purple-950/10 dark:to-pink-950/10 md:py-32">
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
          className="relative mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1
            return (
              <div key={step.number} className="relative flex">
                <motion.div variants={itemVariants} className="flex w-full">
                  <Card className="group relative flex w-full flex-col overflow-visible border-2 border-purple-100 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-purple-900/20 dark:bg-slate-900">
                    {/* Gradient overlay on hover */}
                    <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />

                    {/* Step number - large gradient */}
                    <div className="absolute -right-4 -top-4 text-8xl font-bold text-transparent opacity-10">
                      <span className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text">
                        {step.number}
                      </span>
                    </div>

                    <div className="relative space-y-6">
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
                        className="inline-flex rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 shadow-lg"
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>

                      {/* Step number badge */}
                      <div className="inline-flex items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-lg font-bold text-white shadow-md">
                          {step.number}
                        </span>
                        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          Step {step.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-balance text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-pretty text-muted-foreground">
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
                    className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:block xl:-right-6"
                  >
                    <div className="flex items-center justify-center rounded-full bg-white p-2 shadow-lg dark:bg-slate-800">
                      <ArrowRight className="h-6 w-6 text-purple-500 dark:text-purple-400" />
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

