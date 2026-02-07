"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, BookOpen, Star } from "lucide-react"
import { useRef } from "react"
import { HeroBookTransformation } from "./HeroBookTransformation"

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  // Parallax effect for hero image
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]) // Declared imageScale variable

  // Floating animations for decorative elements
  const getFloatingAnimation = (i: number) => ({
    y: [0, -20, 0],
    rotate: [0, 5, 0, -5, 0],
    transition: {
      duration: 3 + i * 0.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut" as const,
    },
  })

  const decorativeElements = [
    { Icon: Star, top: "15%", left: "10%", delay: 0, size: "h-8 w-8", color: "text-yellow-400" },
    { Icon: Heart, top: "25%", right: "15%", delay: 0.5, size: "h-10 w-10", color: "text-pink-400" },
    { Icon: Sparkles, top: "60%", left: "8%", delay: 1, size: "h-7 w-7", color: "text-purple-400" },
    { Icon: BookOpen, top: "70%", right: "12%", delay: 1.5, size: "h-9 w-9", color: "text-blue-400" },
    { Icon: Star, top: "40%", left: "5%", delay: 0.8, size: "h-6 w-6", color: "text-pink-300" },
    { Icon: Heart, top: "80%", left: "20%", delay: 1.2, size: "h-8 w-8", color: "text-purple-300" },
  ]

  return (
    <div ref={heroRef} style={{ position: "relative" }}>
      <section
        className="relative min-h-[85vh] overflow-x-hidden overflow-y-visible bg-gradient-to-br from-purple-50 via-white to-pink-50 sm:min-h-[80vh] md:min-h-0 md:overflow-hidden lg:min-h-0 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
      >
      {/* Decorative floating elements - hidden on mobile for performance */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {decorativeElements.map((element, index) => {
          const Icon = element.Icon
          return (
            <motion.div
              key={index}
              animate={getFloatingAnimation(index)}
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
              <Icon className={`${element.size} ${element.color} drop-shadow-lg`} />
            </motion.div>
          )
        })}
      </div>

      <div className="container relative mx-auto px-4 pb-0 pt-12 sm:pb-0 sm:pt-14 md:px-6 md:pb-12 md:pt-12 lg:pb-16 lg:pt-16">
        <div className="grid items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Left Column - Text Content (responsive typography: tablet scales proportionally) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-4 text-center sm:space-y-5 md:space-y-3 md:text-left lg:space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 text-xs font-medium text-purple-700 dark:from-purple-900/40 dark:to-pink-900/40 dark:text-purple-300 sm:px-4 sm:py-2 sm:text-sm md:px-3 md:py-1.5 md:text-xs lg:px-4 lg:py-2 lg:text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" />
              <span>AI-Powered Personalization</span>
            </motion.div>

            {/* Main Heading - tablet (md) smaller than desktop (lg) for proportional scaling */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-balance text-3xl font-bold leading-tight text-gray-900 dark:text-slate-50 sm:text-4xl md:text-4xl md:leading-snug lg:text-5xl xl:text-6xl 2xl:text-7xl"
            >
              Create{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                Magical Stories
              </span>{" "}
              Starring Your Child
            </motion.h1>

            {/* Subheading - tablet proportionally smaller */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-pretty text-base leading-relaxed text-gray-600 dark:text-slate-400 sm:text-lg md:text-sm md:leading-relaxed lg:text-base xl:text-lg"
            >
              Transform your child into the hero of their own adventure with AI-generated personalized storybooks.
              Beautifully illustrated tales that inspire imagination and create lasting memories.
            </motion.p>

            {/* CTA Buttons - tablet smaller padding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 md:justify-start md:gap-3 lg:gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400 sm:w-auto sm:px-7 sm:py-5 sm:text-base md:px-5 md:py-4 md:text-sm lg:px-8 lg:py-6 lg:text-base"
                >
                  Create Your Book
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-purple-300 bg-white/50 px-6 py-5 text-sm font-semibold text-purple-700 backdrop-blur-sm transition-all hover:bg-purple-50 dark:border-purple-700 dark:bg-slate-800/50 dark:text-purple-300 dark:hover:bg-slate-700/50 sm:w-auto sm:px-7 sm:py-5 sm:text-base md:px-5 md:py-4 md:text-sm lg:px-8 lg:py-6 lg:text-base"
                >
                  See Examples
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Book Transformation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
            style={{ y: imageY }}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl" />
            
            {/* 3D Book Transformation Component */}
            <HeroBookTransformation />
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Separator - Only on tablet/web */}
      <div className="hidden md:absolute md:bottom-0 md:left-0 md:block md:w-full">
        <svg
          className="h-12 w-full text-pink-50 dark:text-slate-950 sm:h-16 md:h-20 lg:h-24"
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
    </div>
  )
}
