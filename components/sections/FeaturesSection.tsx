"use client"

import { motion } from "framer-motion"
import { Sparkles, Palette, Heart, BookOpen, Compass, Download } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Stories",
    description: "Advanced AI creates personalized stories tailored to your child's age and interests",
  },
  {
    icon: Palette,
    title: "Multiple Art Styles",
    description: "Choose from watercolor, 3D animation, cartoon, and more illustration styles",
  },
  {
    icon: Heart,
    title: "True Character Match",
    description: "Your child's photo becomes the hero with accurate appearance matching",
  },
  {
    icon: BookOpen,
    title: "Age-Appropriate Stories",
    description: "Content tailored for 0-2, 3-5, 6-9, and 10+ age groups",
  },
  {
    icon: Compass,
    title: "Adventure Themes",
    description: "Choose from adventure, fairy tale, science fiction, and more exciting themes",
  },
  {
    icon: Download,
    title: "Digital & Physical",
    description: "Get instant e-book download or order a beautiful printed hardcover version",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white py-16 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950 md:py-24">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-500/5" />
        <div className="absolute -right-20 top-3/4 h-64 w-64 rounded-full bg-pink-200/20 blur-3xl dark:bg-pink-500/5" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Features
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground md:text-xl">
            Everything you need to create magical stories
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <Card className="group relative h-full overflow-hidden border-2 border-purple-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:border-purple-200 hover:shadow-xl dark:border-purple-900/30 dark:bg-slate-900 dark:hover:border-purple-800/50 md:p-8">
                  {/* Gradient overlay on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />

                  <div className="relative space-y-4">
                    {/* Icon with gradient background */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg"
                    >
                      <Icon className="h-8 w-8 text-white md:h-10 md:w-10" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-balance text-xl font-bold text-foreground md:text-2xl">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-pretty text-sm text-muted-foreground md:text-base">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 dark:from-purple-500/5 dark:to-pink-500/5 md:opacity-0" />
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

