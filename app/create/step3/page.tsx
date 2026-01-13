"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Mountain,
  Sparkles,
  BookOpen,
  Trees,
  Rocket,
  Trophy,
  Baby,
  Smile,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Star,
  Heart,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Validation schema
const formSchema = z.object({
  theme: z.enum(["adventure", "fairy_tale", "educational", "nature", "space", "sports"], {
    required_error: "Please select a theme for your story",
  }),
  ageGroup: z.enum(["0-2", "3-5", "6-9"], {
    required_error: "Please select an age group",
  }),
  language: z.enum(["en", "tr", "de", "fr", "es", "zh", "pt", "ru"], {
    required_error: "Please select a language for your story",
  }),
})

type FormData = z.infer<typeof formSchema>

type Theme = {
  id: "adventure" | "fairy_tale" | "educational" | "nature" | "space" | "sports"
  Icon: typeof Mountain
  title: string
  description: string
  gradientFrom: string
  gradientTo: string
  borderColor: string
}

type AgeGroup = {
  id: "0-2" | "3-5" | "6-9"
  Icon: typeof Baby
  title: string
  description: string
  features: string
  gradientFrom: string
  gradientTo: string
  borderColor: string
}

type Language = {
  id: "en" | "tr" | "de" | "fr" | "es" | "zh" | "pt" | "ru"
  Icon: typeof Globe
  title: string
  nativeName: string
  gradientFrom: string
  gradientTo: string
  borderColor: string
}

const themes: Theme[] = [
  {
    id: "adventure",
    Icon: Mountain,
    title: "Adventure",
    description: "Exciting journeys and thrilling quests",
    gradientFrom: "from-orange-500",
    gradientTo: "to-amber-500",
    borderColor: "border-orange-500",
  },
  {
    id: "fairy_tale",
    Icon: Sparkles,
    title: "Fairy Tale",
    description: "Magical stories with princesses and castles",
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
    borderColor: "border-purple-500",
  },
  {
    id: "educational",
    Icon: BookOpen,
    title: "Educational",
    description: "Learning adventures with fun facts",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    borderColor: "border-blue-500",
  },
  {
    id: "nature",
    Icon: Trees,
    title: "Nature & Animals",
    description: "Wildlife adventures in nature",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-500",
    borderColor: "border-green-500",
  },
  {
    id: "space",
    Icon: Rocket,
    title: "Space & Science",
    description: "Cosmic adventures and discoveries",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-violet-500",
    borderColor: "border-indigo-500",
  },
  {
    id: "sports",
    Icon: Trophy,
    title: "Sports & Activities",
    description: "Active adventures and team spirit",
    gradientFrom: "from-red-500",
    gradientTo: "to-rose-500",
    borderColor: "border-red-500",
  },
]

const ageGroups: AgeGroup[] = [
  {
    id: "0-2",
    Icon: Baby,
    title: "0-2 Years",
    description: "Simple words, bright colors, basic concepts",
    features: "Very short sentences, repetitive patterns",
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-500",
    borderColor: "border-pink-500",
  },
  {
    id: "3-5",
    Icon: Smile,
    title: "3-5 Years",
    description: "Simple stories, easy vocabulary",
    features: "5-8 word sentences, playful language",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-amber-500",
    borderColor: "border-yellow-500",
  },
  {
    id: "6-9",
    Icon: GraduationCap,
    title: "6-9 Years",
    description: "More complex stories, richer vocabulary",
    features: "8-12 word sentences, engaging plots",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    borderColor: "border-blue-500",
  },
]

const languages: Language[] = [
  {
    id: "en",
    Icon: Globe,
    title: "English",
    nativeName: "English",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-500",
    borderColor: "border-blue-500",
  },
  {
    id: "tr",
    Icon: Globe,
    title: "Türkçe",
    nativeName: "Türkçe",
    gradientFrom: "from-red-500",
    gradientTo: "to-rose-500",
    borderColor: "border-red-500",
  },
  {
    id: "de",
    Icon: Globe,
    title: "Deutsch",
    nativeName: "Deutsch",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-amber-500",
    borderColor: "border-yellow-500",
  },
  {
    id: "fr",
    Icon: Globe,
    title: "Français",
    nativeName: "Français",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    borderColor: "border-blue-500",
  },
  {
    id: "es",
    Icon: Globe,
    title: "Español",
    nativeName: "Español",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
    borderColor: "border-orange-500",
  },
  {
    id: "zh",
    Icon: Globe,
    title: "中文",
    nativeName: "中文 (Mandarin)",
    gradientFrom: "from-red-500",
    gradientTo: "to-yellow-500",
    borderColor: "border-red-500",
  },
  {
    id: "pt",
    Icon: Globe,
    title: "Português",
    nativeName: "Português",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-500",
    borderColor: "border-green-500",
  },
  {
    id: "ru",
    Icon: Globe,
    title: "Русский",
    nativeName: "Русский",
    gradientFrom: "from-blue-500",
    gradientTo: "to-slate-500",
    borderColor: "border-blue-500",
  },
]

export default function Step3Page() {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  const {
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const theme = watch("theme")
  const ageGroup = watch("ageGroup")
  const language = watch("language")

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    setValue("theme", themeId as FormData["theme"], { shouldValidate: true })
  }

  const handleAgeGroupSelect = (ageGroupId: string) => {
    setSelectedAgeGroup(ageGroupId)
    setValue("ageGroup", ageGroupId as FormData["ageGroup"], { shouldValidate: true })
  }

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId)
    setValue("language", languageId as FormData["language"], { shouldValidate: true })
  }

  const handleNext = () => {
    if (!theme || !ageGroup || !language) return
    
    // Save theme, age group, and language to localStorage
    try {
      const saved = localStorage.getItem("kidstorybook_wizard")
      const wizardData = saved ? JSON.parse(saved) : {}
      
      // Find full theme, age group, and language objects
      const selectedThemeObj = themes.find((t) => t.id === theme)
      const selectedAgeGroupObj = ageGroups.find((ag) => ag.id === ageGroup)
      const selectedLanguageObj = languages.find((l) => l.id === language)
      
      wizardData.step3 = {
        theme: selectedThemeObj,
        ageGroup: selectedAgeGroupObj,
        language: selectedLanguageObj,
      }
      
      localStorage.setItem("kidstorybook_wizard", JSON.stringify(wizardData))
    } catch (error) {
      console.error("Error saving step 3 data:", error)
    }
    
    router.push("/create/step4")
  }

  const isFormValid = theme && ageGroup && language

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
    { Icon: Star, top: "10%", left: "8%", delay: 0, size: "h-6 w-6", color: "text-yellow-400" },
    { Icon: Heart, top: "15%", right: "10%", delay: 0.5, size: "h-8 w-8", color: "text-pink-400" },
    { Icon: Sparkles, top: "70%", left: "5%", delay: 1, size: "h-6 w-6", color: "text-purple-400" },
    { Icon: BookOpen, top: "75%", right: "8%", delay: 1.5, size: "h-7 w-7", color: "text-blue-400" },
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
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-slate-300">
              <span>Step 3 of 6</span>
              <span>Theme, Age Group & Language</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "50%" }}
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
          className="mx-auto max-w-4xl"
        >
          <div className="rounded-2xl bg-white/80 p-6 shadow-2xl backdrop-blur-sm dark:bg-slate-800/80 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-8 text-center"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Choose Theme, Age Group & Language</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Select the perfect story theme, age-appropriate content, and language
              </p>
            </motion.div>

            {/* Theme Selection Section */}
            <div className="mb-10">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mb-4 text-xl font-semibold text-gray-900 dark:text-slate-50"
              >
                Choose a Theme
              </motion.h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {themes.map((themeItem, index) => {
                  const Icon = themeItem.Icon
                  const isSelected = selectedTheme === themeItem.id

                  return (
                    <motion.button
                      key={themeItem.id}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.4 }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeSelect(themeItem.id)}
                      className={`group relative overflow-hidden rounded-xl border-2 p-6 text-left transition-all ${
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${themeItem.gradientFrom} ${themeItem.gradientTo} shadow-xl`
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm"
                        >
                          <div className="h-4 w-4 rounded-full bg-white" />
                        </motion.div>
                      )}

                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                          isSelected
                            ? "bg-white/20 backdrop-blur-sm"
                            : `bg-gradient-to-br ${themeItem.gradientFrom} ${themeItem.gradientTo}`
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${isSelected ? "text-white" : "text-white"}`} />
                      </div>

                      <h3
                        className={`mb-2 text-lg font-bold transition-colors ${
                          isSelected ? "text-white" : "text-gray-900 dark:text-slate-50"
                        }`}
                      >
                        {themeItem.title}
                      </h3>

                      <p
                        className={`text-sm transition-colors ${
                          isSelected ? "text-white/90" : "text-gray-600 dark:text-slate-400"
                        }`}
                      >
                        {themeItem.description}
                      </p>
                    </motion.button>
                  )
                })}
              </div>

              {errors.theme && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.theme.message}
                </motion.p>
              )}
            </div>

            {/* Age Group Selection Section */}
            <div className="mb-8">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mb-4 text-xl font-semibold text-gray-900 dark:text-slate-50"
              >
                Select Age Group
              </motion.h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {ageGroups.map((ageGroupItem, index) => {
                  const Icon = ageGroupItem.Icon
                  const isSelected = selectedAgeGroup === ageGroupItem.id

                  return (
                    <motion.button
                      key={ageGroupItem.id}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + 0.1 * index, duration: 0.4 }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAgeGroupSelect(ageGroupItem.id)}
                      className={`group relative overflow-hidden rounded-xl border-2 p-6 text-left transition-all ${
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${ageGroupItem.gradientFrom} ${ageGroupItem.gradientTo} shadow-xl`
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm"
                        >
                          <div className="h-4 w-4 rounded-full bg-white" />
                        </motion.div>
                      )}

                      <div
                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                          isSelected
                            ? "bg-white/20 backdrop-blur-sm"
                            : `bg-gradient-to-br ${ageGroupItem.gradientFrom} ${ageGroupItem.gradientTo}`
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-white"}`} />
                      </div>

                      <h3
                        className={`mb-2 text-base font-bold transition-colors ${
                          isSelected ? "text-white" : "text-gray-900 dark:text-slate-50"
                        }`}
                      >
                        {ageGroupItem.title}
                      </h3>

                      <p
                        className={`mb-2 text-sm transition-colors ${
                          isSelected ? "text-white/90" : "text-gray-600 dark:text-slate-400"
                        }`}
                      >
                        {ageGroupItem.description}
                      </p>

                      <p
                        className={`text-xs italic transition-colors ${
                          isSelected ? "text-white/80" : "text-gray-500 dark:text-slate-500"
                        }`}
                      >
                        {ageGroupItem.features}
                      </p>
                    </motion.button>
                  )
                })}
              </div>

              {errors.ageGroup && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.ageGroup.message}
                </motion.p>
              )}
            </div>

            {/* Language Selection Section */}
            <div className="mb-8">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="mb-4 text-xl font-semibold text-gray-900 dark:text-slate-50"
              >
                Select Story Language
              </motion.h2>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {languages.map((languageItem, index) => {
                  const Icon = languageItem.Icon
                  const isSelected = selectedLanguage === languageItem.id

                  return (
                    <motion.button
                      key={languageItem.id}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + 0.1 * index, duration: 0.4 }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLanguageSelect(languageItem.id)}
                      className={`group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all ${
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${languageItem.gradientFrom} ${languageItem.gradientTo} shadow-xl`
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm"
                        >
                          <div className="h-3 w-3 rounded-full bg-white" />
                        </motion.div>
                      )}

                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-all mx-auto ${
                          isSelected
                            ? "bg-white/20 backdrop-blur-sm"
                            : `bg-gradient-to-br ${languageItem.gradientFrom} ${languageItem.gradientTo}`
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-white"}`} />
                      </div>

                      <h3
                        className={`mb-1 text-base font-bold transition-colors ${
                          isSelected ? "text-white" : "text-gray-900 dark:text-slate-50"
                        }`}
                      >
                        {languageItem.title}
                      </h3>

                      <p
                        className={`text-xs transition-colors ${
                          isSelected ? "text-white/80" : "text-gray-500 dark:text-slate-500"
                        }`}
                      >
                        {languageItem.nativeName}
                      </p>
                    </motion.button>
                  )
                })}
              </div>

              {errors.language && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.language.message}
                </motion.p>
              )}
            </div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between"
            >
              <Link href="/create/step2" className="w-full sm:w-auto">
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

