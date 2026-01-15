"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Box,
  Hexagon,
  Palette,
  BookOpen,
  Grid3x3,
  Sparkles,
  Layers,
  Circle,
  Heart,
  Zap,
  StickyNote,
  ArrowRight,
  ArrowLeft,
  Brush,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Validation schema
const formSchema = z.object({
  illustrationStyle: z.enum(
    [
      "3d_animation",
      "geometric",
      "watercolor",
      "block_world",
      "collage",
      "clay_animation",
      "kawaii",
      "comic_book",
      "sticker_art",
    ],
    {
      required_error: "Please select an illustration style",
    },
  ),
})

type FormData = z.infer<typeof formSchema>

type IllustrationStyle = {
  id: FormData["illustrationStyle"]
  Icon: typeof Box
  title: string
  description: string
  gradientFrom: string
  gradientTo: string
  borderColor: string
  iconBgColor: string
}

const illustrationStyles: IllustrationStyle[] = [
  {
    id: "3d_animation",
    Icon: Box,
    title: "3D Animation (Pixar Style)",
    description: "Pixar-style 3D animation like Toy Story, Finding Nemo, Inside Out - cartoonish and stylized, vibrant saturated colors",
    gradientFrom: "from-orange-500",
    gradientTo: "to-amber-500",
    borderColor: "border-orange-500",
    iconBgColor: "bg-gradient-to-br from-orange-500 to-amber-500",
  },
  {
    id: "geometric",
    Icon: Hexagon,
    title: "Geometric",
    description: "Simplified geometric shapes, flat colors, sharp distinct edges, modern and stylized",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    borderColor: "border-blue-500",
    iconBgColor: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    id: "watercolor",
    Icon: Palette,
    title: "Watercolor",
    description: "Soft, translucent appearance, visible brushstrokes, blended edges, warm inviting atmosphere",
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
    borderColor: "border-purple-500",
    iconBgColor: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  {
    id: "block_world",
    Icon: Grid3x3,
    title: "Block World",
    description:
      "Pixelated or blocky aesthetic, Minecraft-like, characters and environment constructed from visible blocks",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-500",
    borderColor: "border-green-500",
    iconBgColor: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  {
    id: "collage",
    Icon: Layers,
    title: "Collage",
    description:
      "Made from cut-out pieces, distinct layers and varied textures, visible edges or shadows, vibrant colors",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-violet-500",
    borderColor: "border-indigo-500",
    iconBgColor: "bg-gradient-to-br from-indigo-500 to-violet-500",
  },
  {
    id: "clay_animation",
    Icon: Circle,
    title: "Clay Animation",
    description: "Clay appearance, textured, slightly rough, hand-crafted look, soft rounded shadows",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-600",
    borderColor: "border-amber-600",
    iconBgColor: "bg-gradient-to-br from-amber-600 to-orange-600",
  },
  {
    id: "kawaii",
    Icon: Heart,
    title: "Kawaii",
    description: "Exaggerated cuteness, large sparkling eyes, simplified round features, bright cheerful colors",
    gradientFrom: "from-pink-400",
    gradientTo: "to-rose-400",
    borderColor: "border-pink-400",
    iconBgColor: "bg-gradient-to-br from-pink-400 to-rose-400",
  },
  {
    id: "comic_book",
    Icon: Zap,
    title: "Comic Book",
    description: "Bold lines, relatively flat colors, strong dramatic shadows, comic book style illustration",
    gradientFrom: "from-red-600",
    gradientTo: "to-orange-600",
    borderColor: "border-red-600",
    iconBgColor: "bg-gradient-to-br from-red-600 to-orange-600",
  },
  {
    id: "sticker_art",
    Icon: StickyNote,
    title: "Sticker Art",
    description: "Clean lines, bright high-saturation colors, glossy graphic look, sticker-like illustration",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-500",
    borderColor: "border-cyan-500",
    iconBgColor: "bg-gradient-to-br from-cyan-500 to-blue-500",
  },
]

export default function Step4Page() {
  const router = useRouter()
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  const {
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const illustrationStyle = watch("illustrationStyle")

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId)
    setValue("illustrationStyle", styleId as FormData["illustrationStyle"], { shouldValidate: true })
  }

  const handleNext = () => {
    if (!illustrationStyle) return
    
    // Save illustration style to localStorage
    try {
      const saved = localStorage.getItem("kidstorybook_wizard")
      const wizardData = saved ? JSON.parse(saved) : {}
      
      // Find full illustration style object
      const selectedStyleObj = illustrationStyles.find((s) => s.id === illustrationStyle)
      
      wizardData.step4 = {
        illustrationStyle: selectedStyleObj,
      }
      
      localStorage.setItem("kidstorybook_wizard", JSON.stringify(wizardData))
    } catch (error) {
      console.error("Error saving step 4 data:", error)
    }
    
    router.push("/create/step5")
  }

  const isFormValid = !!illustrationStyle

  // Floating animations for decorative elements
  const floatingVariants = {
    animate: (i: number) => ({
      y: [0, -15, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 3 + i * 0.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    }),
  }

  const decorativeElements = [
    { Icon: Palette, top: "10%", left: "8%", delay: 0, size: "h-7 w-7", color: "text-purple-400" },
    { Icon: Brush, top: "15%", right: "10%", delay: 0.5, size: "h-8 w-8", color: "text-pink-400" },
    { Icon: Sparkles, top: "70%", left: "5%", delay: 1, size: "h-6 w-6", color: "text-blue-400" },
    { Icon: BookOpen, top: "75%", right: "8%", delay: 1.5, size: "h-7 w-7", color: "text-amber-400" },
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
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-slate-300">
              <span>Step 4 of 6</span>
              <span>Illustration Style</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "66.67%" }}
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
          className="mx-auto max-w-6xl"
        >
          <div className="rounded-2xl bg-white/80 p-6 shadow-2xl backdrop-blur-sm dark:bg-slate-800/80 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-8 text-center"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Choose Illustration Style</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Select the perfect visual style for your story
              </p>
            </motion.div>

            {/* Illustration Style Selection Section */}
            <div className="mb-8">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mb-6 text-xl font-semibold text-gray-900 dark:text-slate-50"
              >
                Choose Illustration Style
              </motion.h2>

              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
                {illustrationStyles.map((style, index) => {
                  const Icon = style.Icon
                  const isSelected = selectedStyle === style.id

                  return (
                    <motion.button
                      key={style.id}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.4 }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStyleSelect(style.id)}
                      className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${style.borderColor} border-[3px] shadow-2xl`
                          : "border-gray-200 bg-white hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                      }`}
                    >
                      {/* Preview Image Area */}
                      <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600">
                        {/* Placeholder image with gradient */}
                        <div className={`h-full w-full ${style.iconBgColor} opacity-20`} />

                        {/* Icon Badge - top right */}
                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                          <Icon
                            className={`h-4 w-4 ${isSelected ? style.borderColor.replace("border", "text") : "text-gray-600 dark:text-slate-400"}`}
                          />
                        </div>

                        {/* Selected checkmark badge - top left */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-50"
                          >
                            <svg
                              className={`h-4 w-4 ${style.borderColor.replace("border", "text")}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}

                        {/* Hover effect overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${style.gradientFrom} ${style.gradientTo} opacity-0 transition-opacity group-hover:opacity-20`}
                        />
                      </div>

                      {/* Content Section */}
                      <div className="p-4 text-left">
                        <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-slate-50">{style.title}</h3>
                        <p className="line-clamp-3 text-sm text-gray-600 dark:text-slate-400">{style.description}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {errors.illustrationStyle && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.illustrationStyle.message}
                </motion.p>
              )}
            </div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between"
            >
              <Link href="/create/step3" className="w-full sm:w-auto">
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
                  disabled={!isFormValid}
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:from-purple-400 dark:to-pink-400 sm:w-auto"
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
            transition={{ delay: 0.8, duration: 0.4 }}
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

