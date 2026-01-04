"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, BookOpen, Star } from "lucide-react"
import { useRef } from "react"

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  // Parallax effect for hero image
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  // Floating animations for decorative elements
  const floatingVariants = {
    animate: (i: number) => ({
      y: [0, -20, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 3 + i * 0.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    }),
  }

  const decorativeElements = [
    {
      Icon: Star,
      top: "15%",
      left: "10%",
      delay: 0,
      size: "h-8 w-8",
      color: "text-yellow-400",
    },
    {
      Icon: Heart,
      top: "25%",
      right: "15%",
      delay: 0.5,
      size: "h-10 w-10",
      color: "text-pink-400",
    },
    {
      Icon: Sparkles,
      top: "60%",
      left: "8%",
      delay: 1,
      size: "h-7 w-7",
      color: "text-purple-400",
    },
    {
      Icon: BookOpen,
      top: "70%",
      right: "12%",
      delay: 1.5,
      size: "h-9 w-9",
      color: "text-blue-400",
    },
    {
      Icon: Star,
      top: "40%",
      left: "5%",
      delay: 0.8,
      size: "h-6 w-6",
      color: "text-pink-300",
    },
    {
      Icon: Heart,
      top: "80%",
      left: "20%",
      delay: 1.2,
      size: "h-8 w-8",
      color: "text-purple-300",
    },
  ]

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >
      {/* Decorative floating elements - hidden on mobile for performance */}
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
              whileInView={{ opacity: 0.6, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: element.delay, duration: 0.5 }}
              className="absolute"
              style={{
                top: element.top,
                left: element.left,
                right: element.right,
              }}
            >
              <Icon
                className={`${element.size} ${element.color} drop-shadow-lg`}
              />
            </motion.div>
          )
        })}
      </div>

      <div className="container relative mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 text-center md:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-medium text-purple-700 dark:from-purple-900/40 dark:to-pink-900/40 dark:text-purple-300"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Personalization</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-balance text-4xl font-bold leading-tight text-gray-900 dark:text-slate-50 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Create{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                Magical Stories
              </span>{" "}
              Starring Your Child
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-pretty text-lg leading-relaxed text-gray-600 dark:text-slate-400 md:text-xl"
            >
              Transform your child into the hero of their own adventure with
              AI-generated personalized storybooks. Beautifully illustrated
              tales that inspire imagination and create lasting memories.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400 sm:w-auto"
                >
                  Create Your Book
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-purple-300 bg-white/50 px-8 py-6 text-base font-semibold text-purple-700 backdrop-blur-sm transition-all hover:bg-purple-50 dark:border-purple-700 dark:bg-slate-800/50 dark:text-purple-300 dark:hover:bg-slate-700/50 sm:w-auto"
                >
                  See Examples
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-4 md:justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400 dark:border-slate-900"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  10,000+ happy families
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-700 dark:text-slate-300">
                  4.9/5 rating
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="relative mx-auto aspect-square w-full max-w-lg"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-purple-400/30 to-pink-400/30 blur-3xl" />

              {/* Main Image Container */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-br from-purple-200 to-pink-200 shadow-2xl dark:from-purple-900/40 dark:to-pink-900/40"
              >
                {/* Placeholder image with decorative elements */}
                <div className="flex h-full w-full items-center justify-center p-8">
                  <div className="relative">
                    {/* Book Icon */}
                    <motion.div
                      animate={{
                        rotate: [0, -5, 0, 5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <BookOpen
                        className="h-48 w-48 text-purple-500 dark:text-purple-300"
                        strokeWidth={1.5}
                      />
                    </motion.div>

                    {/* Sparkles around book */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute -right-4 -top-4"
                    >
                      <Sparkles className="h-12 w-12 text-yellow-400" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 2,
                        delay: 1,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="absolute -bottom-4 -left-4"
                    >
                      <Heart className="h-12 w-12 text-pink-400" />
                    </motion.div>
                  </div>
                </div>

                {/* Overlay text */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/10 to-transparent">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="text-center text-sm font-medium text-purple-800 dark:text-purple-200"
                  >
                    {/* Placeholder for actual book image */}
                  </motion.p>
                </div>
              </motion.div>

              {/* Floating stats cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -left-4 top-1/4 hidden rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-sm dark:bg-slate-800/90 lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-2">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100">
                      AI Powered
                    </p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">
                      Smart Generation
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute -right-4 bottom-1/4 hidden rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-sm dark:bg-slate-800/90 lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-2">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100">
                      Personalized
                    </p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">
                      Unique Stories
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Separator */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="h-16 w-full text-white dark:text-slate-950 md:h-24"
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
    </section>
  )
}

