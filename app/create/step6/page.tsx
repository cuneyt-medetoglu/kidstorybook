"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  User,
  ImageIcon,
  Sparkles,
  Palette,
  Lightbulb,
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  Star,
  BookOpen,
  Pencil,
  Gift,
  Loader2,
  FileText,
  Eye,
  X,
  Bug,
  Zap,
  Mail,
  Share2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { generateStoryPrompt } from "@/lib/prompts/story/v1.0.0/base"
import { buildDetailedCharacterPrompt } from "@/lib/prompts/image/v1.0.0/character"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CurrencyConfig } from "@/lib/currency"
import { getCurrencyConfig } from "@/lib/currency"

// Timeline step configuration
const timelineSteps = [
  {
    id: 1,
    title: "Book Creation",
    description:
      "After payment, we immediately create your digital children's book. Available within just 2 hours and you'll receive an email when it's ready!",
    icon: BookOpen,
    gradient: "from-purple-500 to-purple-600",
    shadowColor: "shadow-purple-500/50",
  },
  {
    id: 2,
    title: "Edit & Perfect",
    description:
      "After creation you can easily adjust texts and illustrations until the result is perfect.",
    icon: Pencil,
    gradient: "from-pink-500 to-rose-500",
    shadowColor: "shadow-pink-500/50",
  },
  {
    id: 3,
    title: "Share & Print",
    description:
      "Happy with it? Share your digital book directly with family and friends or order a beautiful hardcover copy as a lasting memory.",
    icon: Share2,
    gradient: "from-purple-600 to-pink-600",
    shadowColor: "shadow-purple-600/50",
  },
]

export default function Step6Page() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)
  const [showStoryPrompt, setShowStoryPrompt] = useState(false)
  const [showCoverPrompt, setShowCoverPrompt] = useState(false)
  const [storyPrompt, setStoryPrompt] = useState<string>("")
  const [coverPrompt, setCoverPrompt] = useState<string>("")
  const [storyResponse, setStoryResponse] = useState<any>(null)
  const [coverResponse, setCoverResponse] = useState<any>(null)
  const [isTestingStory, setIsTestingStory] = useState(false)
  const [isTestingCover, setIsTestingCover] = useState(false)
  
  // Auth and email state
  const [user, setUser] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  
  // Free cover state
  const [hasFreeCover, setHasFreeCover] = useState(false)
  const [isCheckingFreeCover, setIsCheckingFreeCover] = useState(true)

  // Currency state
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(
    getCurrencyConfig("USD")
  )
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true)

  // Hover state for timeline nodes
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Model selection
  const [storyModel, setStoryModel] = useState<string>("gpt-4o-mini") // Default: GPT-4o Mini (Önerilen)
  // NOTE: Image model/size/quality are now hardcoded to gpt-image-1.5 / 1024x1536 / low
  
  // Check auth state
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoadingAuth(false)
    }
    checkAuth()
  }, [])

  // Fetch currency
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch("/api/currency")
        const data = await response.json()

        if (data.currency) {
          setCurrencyConfig(getCurrencyConfig(data.currency))
        }
      } catch (error) {
        console.error("Error fetching currency:", error)
      } finally {
        setIsLoadingCurrency(false)
      }
    }

    fetchCurrency()
  }, [])

  // Check free cover status
  useEffect(() => {
    const checkFreeCover = async () => {
      if (user) {
        try {
          const response = await fetch("/api/users/free-cover-status")
          const data = await response.json()
          setHasFreeCover(data.hasFreeCover)
        } catch (error) {
          console.error("Error checking free cover:", error)
          setHasFreeCover(false)
        }
      } else {
        setHasFreeCover(false)
      }
      setIsCheckingFreeCover(false)
    }

    if (!isLoadingAuth) {
      checkFreeCover()
    }
  }, [user, isLoadingAuth])

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Load wizard data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kidstorybook_wizard")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setWizardData(data)
      } catch (error) {
        console.error("Error parsing wizard data:", error)
      }
    }
  }, [])
  
  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  // Get actual data from wizardData (localStorage)
  // NEW: Support both old characterPhoto and new characters array
  const getCharactersData = () => {
    if (wizardData?.step2?.characters && Array.isArray(wizardData.step2.characters)) {
      // New format: characters array
      // Filter out characters that don't have at least an id or characterType
      return wizardData.step2.characters.filter((char: any) => 
        char && (char.id || char.characterType || char.photo)
      )
    }
    if (wizardData?.step2?.characterPhoto) {
      // Old format: single characterPhoto (backward compatibility)
      return [
        {
          id: "1",
          characterType: { group: "Child", value: "Child", displayName: "Child" },
          photo: wizardData.step2.characterPhoto,
          characterId: localStorage.getItem("kidstorybook_character_id") || null,
        },
      ]
    }
    return []
  }

  const charactersData = getCharactersData()

  const formData = {
      character: {
      name: wizardData?.step1?.name || "Child",
      age: wizardData?.step1?.age || 3,
      gender: wizardData?.step1?.gender || "Girl",
      hairColor: wizardData?.step1?.hairColor || "Brown",
      eyeColor: wizardData?.step1?.eyeColor || "Brown",
    },
    // NEW: Multiple characters support
    characters: charactersData,
    photo: {
      uploaded: charactersData.length > 0 && !!charactersData[0]?.photo,
      filename: charactersData[0]?.photo?.filename || "",
      size: charactersData[0]?.photo?.size || "",
      url: charactersData[0]?.photo?.url || "",
      analysis: wizardData?.step2?.characterAnalysis || {},
    },
    theme: wizardData?.step3?.theme
      ? {
          name: wizardData.step3.theme.title || wizardData.step3.theme.name || "Adventure",
          description: wizardData.step3.theme.description || "Exciting adventures and explorations",
          icon: wizardData.step3.theme.icon || "🗺️",
          color: wizardData.step3.theme.gradientFrom || "from-blue-400 to-cyan-500",
        }
      : {
          name: "Adventure",
          description: "Exciting adventures and explorations",
          icon: "🗺️",
          color: "from-blue-400 to-cyan-500",
        },
    ageGroup: wizardData?.step3?.ageGroup
      ? {
          name: wizardData.step3.ageGroup.title || wizardData.step3.ageGroup.name || "3-5 Years",
          description: wizardData.step3.ageGroup.description || "Picture books with simple stories",
          icon: wizardData.step3.ageGroup.icon || "📚",
          features: typeof wizardData.step3.ageGroup.features === 'string' 
            ? [wizardData.step3.ageGroup.features] 
            : wizardData.step3.ageGroup.features || ["10 pages", "Simple story", "Large illustrations"],
        }
      : {
          name: "3-5 Years",
          description: "Picture books with simple stories",
          icon: "📚",
          features: ["10 pages", "Simple story", "Large illustrations"],
        },
    language: wizardData?.step3?.language
      ? {
          id: wizardData.step3.language.id || "en",
          title: wizardData.step3.language.title || "English",
          nativeName: wizardData.step3.language.nativeName || "English",
        }
      : {
          id: "en",
          title: "English",
          nativeName: "English",
        },
    illustrationStyle: wizardData?.step4?.illustrationStyle
      ? {
          name: wizardData.step4.illustrationStyle.title || wizardData.step4.illustrationStyle,
          description: wizardData.step4.illustrationStyle.description || "",
          color: wizardData.step4.illustrationStyle.gradientFrom || "from-blue-400",
        }
      : {
          name: "3D Animation",
          description: "Modern 3D animated style",
          color: "from-purple-400",
        },
    customRequests: wizardData?.step5?.customRequests || "",
    pageCount: wizardData?.step5?.pageCount,
  }

  // Floating animations for decorative elements
  const floatingVariants = {
    animate: (i: number) => ({
      y: [0, -15, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 3 + i * 0.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    }),
  }

  const decorativeElements = [
    { Icon: CheckCircle, top: "8%", left: "8%", delay: 0, size: "h-8 w-8", color: "text-green-400" },
    { Icon: Sparkles, top: "12%", right: "10%", delay: 0.5, size: "h-7 w-7", color: "text-purple-400" },
    { Icon: BookOpen, top: "50%", left: "5%", delay: 1, size: "h-7 w-7", color: "text-pink-400" },
    { Icon: Star, top: "75%", right: "8%", delay: 1.5, size: "h-8 w-8", color: "text-yellow-400" },
  ]

  // Handle free cover creation
  const handleCreateFreeCover = async () => {
    if (!user && (!email || !validateEmail(email))) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/books/create-free-cover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardData,
          email: user ? user.email : email,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create free cover")
      }

      toast({
        title: "Free Cover Created!",
        description: "Your free book cover is ready to preview.",
      })

      router.push(`/draft-preview?draftId=${result.draftId}`)
    } catch (error) {
      console.error("Error creating free cover:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create free cover",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

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
              <span>Step 6 of 6</span>
              <span>Review & Create</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Review & Create</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Review your selections and create your personalized book
              </p>
              {/* Free Cover Badge */}
              {!isCheckingFreeCover && hasFreeCover && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
                >
                  <Gift className="h-4 w-4" />
                  <span>1 Free Cover Available</span>
                </motion.div>
              )}
            </motion.div>

            {/* Summary Sections */}
            <div className="space-y-6">
              {/* 1. Character Information Summary (Multi-Character) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow transition-all hover:scale-[1.01] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-6 w-6 text-purple-500" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
                        Character{formData.characters.length > 1 ? 's' : ''} Information
                      </h2>
                    </div>
                    <Link
                      href="/create/step1"
                      className="text-sm font-medium text-purple-600 underline underline-offset-2 opacity-0 transition-opacity hover:text-purple-700 group-hover:opacity-100 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <Pencil className="mr-1 inline h-3 w-3" />
                      Edit
                    </Link>
                  </div>

                  {/* Characters List */}
                  <div className="space-y-4">
                    {formData.characters.map((char: any, index: number) => {
                      const isMainCharacter = index === 0 || char.characterType?.group === "Child"
                      // NEW: For Child characters, use name from char.name (from Step 2) or Step 1
                      // For other characters, use char.name or displayName
                      let characterName: string
                      if (char.characterType?.group === "Child") {
                        characterName = char.name || formData.character.name || "Child"
                      } else {
                        characterName = char.name || char.characterType?.displayName || "Character"
                      }
                      const characterType = char.characterType?.group || "Child"

                      return (
                        <div
                          key={char.id || index}
                          className={`rounded-lg border-2 p-4 ${
                            isMainCharacter
                              ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20"
                              : characterType === "Pets"
                              ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/20"
                              : characterType === "Family Members"
                              ? "border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-900/20"
                              : "border-purple-300 bg-purple-50/50 dark:border-purple-700 dark:bg-purple-900/20"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Character Photo */}
                            {char.photo?.url && (
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg shadow-md">
                                <Image
                                  src={char.photo.url}
                                  alt={`${characterName} photo`}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            )}

                            {/* Character Info */}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900 dark:text-slate-50">
                                  {isMainCharacter ? "🔵 " : characterType === "Pets" ? "🟢 " : characterType === "Family Members" ? "🟡 " : "🟣 "}
                                  Character {index + 1}: {characterName}
                                </span>
                                {isMainCharacter && (
                                  <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                                    Main
                                  </span>
                                )}
                              </div>

                              {/* Main character (Child) - Show all details */}
                              {isMainCharacter && char.characterType?.group === "Child" ? (
                                <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-slate-300">
                                  <p>
                                    <span className="font-semibold">Age:</span>{" "}
                                    {char.age || formData.character.age} years old
                                  </p>
                                  <p>
                                    <span className="font-semibold">Gender:</span>{" "}
                                    {char.gender || formData.character.gender}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Hair Color:</span>{" "}
                                    {char.hairColor || formData.character.hairColor}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Eye Color:</span>{" "}
                                    {char.eyeColor || formData.character.eyeColor}
                                  </p>
                                </div>
                              ) : (
                                // Additional characters - Show type and appearance details
                                <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-slate-300">
                                  <p>
                                    <span className="font-semibold">Type:</span>{" "}
                                    {char.characterType?.value || "Unknown"}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
                                    {char.characterType?.group || "Other"}
                                  </p>
                                  
                                  {/* Appearance Details for Non-Child Characters */}
                                  {char.hairColor && (
                                    <p>
                                      <span className="font-semibold">
                                        {char.characterType?.group === "Pets" ? "Fur Color:" : "Hair Color:"}
                                      </span>{" "}
                                      {char.hairColor}
                                    </p>
                                  )}
                                  {char.eyeColor && (
                                    <p>
                                      <span className="font-semibold">Eye Color:</span>{" "}
                                      {char.eyeColor}
                                    </p>
                                  )}
                                  {char.age && (
                                    <p>
                                      <span className="font-semibold">Age:</span>{" "}
                                      {char.age} years old
                                    </p>
                                  )}
                                  {char.gender && (
                                    <p>
                                      <span className="font-semibold">Gender:</span>{" "}
                                      {char.gender}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Empty state */}
                    {formData.characters.length === 0 && (
                      <p className="italic text-gray-500 dark:text-slate-500">No characters added</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* 2. Character Photos (Multi-Character Support) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow transition-all hover:scale-[1.01] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-6 w-6 text-purple-500" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
                        Character Photo{formData.characters.length > 1 ? 's' : ''}
                      </h2>
                    </div>
                    <Link
                      href="/create/step2"
                      className="text-sm font-medium text-purple-600 underline underline-offset-2 opacity-0 transition-opacity hover:text-purple-700 group-hover:opacity-100 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <Pencil className="mr-1 inline h-3 w-3" />
                      Edit
                    </Link>
                  </div>

                  {formData.characters.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {formData.characters.map((char: any, index: number) => {
                        const characterName = char.name || char.characterType?.displayName || "Character"
                        const isMainCharacter = index === 0 || char.characterType?.group === "Child"

                        return (
                          <div key={char.id || index} className="flex flex-col items-center">
                            <div className="relative h-48 w-full overflow-hidden rounded-lg shadow-lg">
                              {char.photo?.url ? (
                                <Image
                                  src={char.photo.url}
                                  alt={`${characterName} photo`}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-slate-700">
                                  <ImageIcon className="h-12 w-12 text-gray-400 dark:text-slate-500" />
                                </div>
                              )}
                            </div>
                            <div className="mt-2 text-center">
                              <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                                {characterName}
                                {isMainCharacter && <span className="ml-1 text-xs text-blue-500">(Main)</span>}
                              </p>
                              {char.photo?.filename && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                  {char.photo.filename}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="italic text-gray-500 dark:text-slate-500">No photos uploaded</p>
                  )}
                </div>
              </motion.div>

              {/* 3. Theme, Age Group & Language Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow transition-all hover:scale-[1.01] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Theme, Age Group & Language</h2>
                    </div>
                    <Link
                      href="/create/step3"
                      className="text-sm font-medium text-purple-600 underline underline-offset-2 opacity-0 transition-opacity hover:text-purple-700 group-hover:opacity-100 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <Pencil className="mr-1 inline h-3 w-3" />
                      Edit
                    </Link>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Theme */}
                    <div className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                      <div className="text-3xl">{formData.theme.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-slate-50">{formData.theme.name}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{formData.theme.description}</p>
                      </div>
                    </div>

                    {/* Age Group */}
                    <div className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                      <div className="text-3xl">{formData.ageGroup.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-slate-50">{formData.ageGroup.name}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                          {formData.ageGroup.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {formData.ageGroup.features.map((feature: string, index: number) => (
                            <span
                              key={index}
                              className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Language */}
                    <div className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                      <div className="text-3xl">🌐</div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-slate-50">{formData.language.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                          {formData.language.nativeName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 4. Illustration Style Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow transition-all hover:scale-[1.01] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="h-6 w-6 text-purple-500" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Illustration Style</h2>
                    </div>
                    <Link
                      href="/create/step4"
                      className="text-sm font-medium text-purple-600 underline underline-offset-2 opacity-0 transition-opacity hover:text-purple-700 group-hover:opacity-100 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <Pencil className="mr-1 inline h-3 w-3" />
                      Edit
                    </Link>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br ${formData.illustrationStyle.color} shadow-lg`}
                    >
                      <Palette className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-slate-50">{formData.illustrationStyle.name}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                        {formData.illustrationStyle.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 5. Custom Requests & Page Count Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow transition-all hover:scale-[1.01] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-purple-500" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Custom Requests</h2>
                    </div>
                    <Link
                      href="/create/step5"
                      className="text-sm font-medium text-purple-600 underline underline-offset-2 opacity-0 transition-opacity hover:text-purple-700 group-hover:opacity-100 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <Pencil className="mr-1 inline h-3 w-3" />
                      Edit
                    </Link>
                  </div>

                  {formData.customRequests ? (
                    <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300">
                      {formData.customRequests}
                    </p>
                  ) : (
                    <p className="italic text-sm text-gray-500 dark:text-slate-500">No custom requests</p>
                  )}

                  {/* Page Count Display */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Page Count:
                    </span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {formData.pageCount ? `${formData.pageCount} pages` : 'Cover Only'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Interactive Timeline Section - "What Happens Next" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="mt-8 rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50/30 to-pink-50/30 p-6 dark:border-slate-700/50 dark:from-slate-800/30 dark:to-slate-900/30 md:p-8"
            >
              {/* Timeline Title */}
              <h2 className="mb-6 text-center text-lg font-bold text-gray-900 dark:text-white md:mb-8 md:text-xl">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                  What Happens Next
                </span>
              </h2>

              {/* Timeline Flow - Desktop: Horizontal, Mobile: Vertical */}
              <div className="relative">
                {/* Connecting Line - Desktop */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.9, ease: "easeInOut" }}
                  className="absolute left-[calc(16.666%-0.5rem)] top-10 hidden h-1 w-[calc(66.666%+1rem)] origin-left bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 md:block"
                  style={{ transformOrigin: "left center" }}
                />

                {/* Mobile vertical line - sol sütun merkezinden geçer; 3. node’ın altında bitiyor (bottom-24), 3. adımdan sonra devam etmiyor */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1, delay: 0.9, ease: "easeInOut" }}
                  className="absolute left-[2.375rem] top-8 bottom-[5.5rem] w-1 origin-top bg-gradient-to-b from-purple-500 via-pink-500 to-purple-600 md:hidden"
                />

                {/* Timeline Steps - Mobil: CSS Grid 3 eşit satır (metin uzunluğundan bağımsız); md: flex yatay */}
                <div className="relative grid min-h-[420px] grid-cols-1 grid-rows-3 gap-8 md:min-h-0 md:flex md:flex-row md:justify-between md:gap-12">
                  {timelineSteps.map((step, index) => {
                    const Icon = step.icon
                    const isHovered = hoveredStep === step.id

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2 * index + 1,
                          ease: "easeOut",
                        }}
                        className="relative flex min-h-0 flex-1 flex-row items-start gap-4 md:flex-col md:items-center md:gap-0"
                        onMouseEnter={() => setHoveredStep(step.id)}
                        onMouseLeave={() => setHoveredStep(null)}
                      >
                        {/* Sol sütun (mobil): node; desktop: md:contents ile sadece node */}
                        <div className="w-20 flex-shrink-0 flex justify-center md:contents">
                          {/* Node Circle - hover: büyüme+gölge korunuyor */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-lg transition-all duration-300 md:h-20 md:w-20 ${
                              isHovered ? `shadow-xl ${step.shadowColor}` : ""
                            }`}
                          >
                            <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-purple-600 shadow-md dark:bg-slate-800 dark:text-purple-400">
                              {step.id}
                            </div>
                            <motion.div
                              initial={{ rotate: -180 }}
                              animate={{ rotate: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.2 * index + 1.1,
                              }}
                            >
                              <Icon className="h-8 w-8 text-white md:h-10 md:w-10" />
                            </motion.div>
                          </motion.div>
                        </div>

                        {/* Sağ sütun (mobil) / alt (desktop): başlık + açıklama; metinde arka plan/gölge yok */}
                        <div className="flex flex-1 min-w-0 flex-col md:flex-initial">
                          <h3 className="mt-0 text-left text-sm font-semibold text-gray-900 dark:text-white md:mt-4 md:text-center md:text-base">
                            {step.title}
                          </h3>
                          {/* Açıklama her zaman görünür; AnimatePresence kaldırıldı */}
                          <p className="mt-3 max-w-none text-left text-xs text-gray-600 dark:text-slate-400 md:max-w-xs md:text-center md:text-sm">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Email Input (if not authenticated) */}
            {!isLoadingAuth && !user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="mt-6 rounded-xl border-2 border-purple-200 bg-purple-50/50 p-6 dark:border-purple-800 dark:bg-purple-900/20"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <Label htmlFor="email" className="text-base font-semibold text-gray-900 dark:text-slate-50">
                    Email Address
                  </Label>
                </div>
                <p className="mb-3 text-sm text-gray-600 dark:text-slate-400">
                  We need your email to send you the cover image and marketing updates.
                </p>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full ${emailError ? "border-red-500" : ""}`}
                />
                {emailError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{emailError}</p>
                )}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.4 }}
              className="mt-8 space-y-3"
            >
              {/* Free Cover Button (if available) */}
              {!isCheckingFreeCover && hasFreeCover && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.35, duration: 0.4 }}
                  className="w-full"
                >
                  <Button
                    type="button"
                    onClick={handleCreateFreeCover}
                    disabled={isCreating || (!user && !validateEmail(email))}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6 text-base font-bold text-white shadow-lg transition-all hover:shadow-2xl dark:from-green-400 dark:to-emerald-400"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Gift className="mr-2 h-5 w-5" />
                        <span>Create Free Cover</span>
                      </>
                    )}
                  </Button>
                  <p className="mt-2 text-center text-xs text-gray-500 dark:text-slate-400">
                    Use your free cover credit to create just the cover (Page 1)
                  </p>
                </motion.div>
              )}

              {/* Pay & Create My Book Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.4 }}
                className="w-full"
              >
                <Button
                  type="button"
                  disabled={
                    isCreating ||
                    isLoadingCurrency ||
                    (!user && !validateEmail(email))
                  }
                  onClick={async () => {
                    // Email validation for unauthenticated users
                    if (!user) {
                      if (!email) {
                        setEmailError("Email address is required")
                        toast({
                          title: "Email Required",
                          description: "Please enter your email address to continue.",
                          variant: "destructive",
                        })
                        return
                      }
                      if (!validateEmail(email)) {
                        setEmailError("Please enter a valid email address")
                        toast({
                          title: "Invalid Email",
                          description: "Please enter a valid email address.",
                          variant: "destructive",
                        })
                        return
                      }
                    }

                    // Redirect to cart with email
                    router.push(`/cart?plan=ebook&email=${encodeURIComponent(email)}`)
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-8 text-lg font-bold text-white shadow-lg transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed dark:from-purple-400 dark:to-pink-400"
                >
                  {isLoadingCurrency ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-6 w-6" />
                      <span>Pay & Create My Book • {currencyConfig.price}</span>
                    </>
                  )}
                </Button>
                <p className="mt-2 text-center text-xs text-gray-600 dark:text-slate-400">
                  {"You'll"} receive {currencyConfig.price} as a discount on the hardcover!
                </p>
              </motion.div>

              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.45 }}
              >
                <Link href="/create/step5">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full rounded-xl text-sm md:text-base"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </Link>
              </motion.div>

              {/* DEBUG: Show Prompts Buttons (No API Calls) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="mt-6 rounded-lg border-2 border-yellow-500 bg-yellow-50 p-4 dark:border-yellow-400 dark:bg-yellow-900/20"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Bug className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-300">DEBUG MODE</h3>
                </div>
                <p className="mb-3 text-xs text-yellow-700 dark:text-yellow-400">
                  Preview prompts and test API responses (tokens will be spent on test buttons)
                </p>
                
                {/* Model & Size Selection */}
                <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-yellow-300 bg-white p-3 dark:border-yellow-700 dark:bg-slate-800 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
                      Story Model:
                    </label>
                    <select
                      value={storyModel}
                      onChange={(e) => setStoryModel(e.target.value)}
                      className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    >
                      <option value="gpt-4o-mini">GPT-4o Mini (Önerilen)</option>
                      <option value="gpt-4o">GPT-4o (En iyi kalite)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
                      Image Generation:
                    </label>
                    <div className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <strong>gpt-image-1.5</strong> / 1024x1536 (portrait) / quality: low
                      <div className="mt-1 text-[10px] text-gray-500 dark:text-slate-400">
                        Production default - 5 IPM rate limit
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {/* Story Generation */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        try {
                          const characterName = wizardData?.step1?.name || formData.character.name
                          const characterAge = wizardData?.step1?.age || formData.character.age
                          const characterGender = wizardData?.step1?.gender || formData.character.gender.toLowerCase()
                          // Extract theme and illustration style IDs from objects
                          const theme = wizardData?.step3?.theme?.id || wizardData?.step3?.theme || formData.theme.name.toLowerCase().replace(/\s+/g, "-")
                          const illustrationStyle = wizardData?.step4?.illustrationStyle?.id || wizardData?.step4?.illustrationStyle || formData.illustrationStyle.name.toLowerCase().replace(/\s+/g, "-")
                          const customRequests = wizardData?.step5?.customRequests || formData.customRequests
                          const referencePhotoAnalysis = wizardData?.step2?.characterAnalysis

                          const prompt = generateStoryPrompt({
                            characterName,
                            characterAge: parseInt(characterAge) || 5,
                            characterGender,
                            theme,
                            illustrationStyle,
                            customRequests,
                            referencePhotoAnalysis,
                            language: (wizardData?.step3?.language?.id || formData.language.id) as any,
                            pageCount: wizardData?.step5?.pageCount, // Use pageCount from Step 5
                          })

                          setStoryPrompt(prompt)
                          setShowStoryPrompt(true)
                          console.log("[Step 6] DEBUG: Generated story prompt:", prompt)
                        } catch (error) {
                          console.error("[Step 6] DEBUG: Error generating story prompt:", error)
                          toast({
                            title: "Error",
                            description: "Failed to generate story prompt. Check console for details.",
                            variant: "destructive",
                          })
                        }
                      }}
                      className="flex-1 border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Show Story Prompt
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isTestingStory}
                      onClick={async () => {
                        setIsTestingStory(true)
                        try {
                          let characterId = localStorage.getItem("kidstorybook_character_id")
                          
                          // If mock character ID, create a real character first (mock analysis)
                          if (!characterId || characterId.startsWith("mock-")) {
                            console.log("[Step 6] DEBUG: Mock character ID detected, creating real character with mock analysis")
                            
                            if (!wizardData?.step2?.characterPhoto?.url) {
                              toast({
                                title: "Photo Required",
                                description: "Please upload a character photo in Step 2 first.",
                                variant: "destructive",
                              })
                              setIsTestingStory(false)
                              return
                            }

                            // Create character with mock analysis
                            const photoBase64 = wizardData.step2.characterPhoto.url.split(",")[1] // Extract base64 from data URL
                            const step1Data = wizardData?.step1 || formData.character
                            
                            const createCharResponse = await fetch("/api/characters/analyze", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                photoBase64: photoBase64,
                                name: step1Data.name,
                                age: step1Data.age?.toString() || "5",
                                gender: step1Data.gender?.toLowerCase() || "girl",
                                additionalDetails: {
                                  hairColor: step1Data.hairColor || "brown",
                                  eyeColor: step1Data.eyeColor || "brown",
                                },
                                skipOpenAI: true, // Skip OpenAI API call
                                mockAnalysis: wizardData?.step2?.characterAnalysis || {
                                  hairLength: "Short",
                                  hairStyle: "Wavy",
                                  hairTexture: "Silky",
                                  faceShape: "Round",
                                  eyeShape: "Round",
                                  skinTone: "Fair",
                                },
                              }),
                            })

                            const createCharResult = await createCharResponse.json()
                            
                            if (!createCharResponse.ok || !createCharResult.success) {
                              throw new Error(createCharResult.error || "Failed to create character with mock analysis")
                            }

                            characterId = createCharResult.character?.id
                            localStorage.setItem("kidstorybook_character_id", characterId!)
                            console.log("[Step 6] DEBUG: Created character with mock analysis, ID:", characterId)
                          }

                          if (!characterId) {
                            toast({
                              title: "Character Required",
                              description: "Failed to get character ID. Please try again.",
                              variant: "destructive",
                            })
                            setIsTestingStory(false)
                            return
                          }

                          const theme = wizardData?.step3?.theme || formData.theme.name.toLowerCase().replace(/\s+/g, "-")
                          const illustrationStyle = wizardData?.step4?.illustrationStyle || formData.illustrationStyle.name.toLowerCase().replace(/\s+/g, "-")
                          const customRequests = wizardData?.step5?.customRequests || formData.customRequests

                          // NEW: Get all character IDs from localStorage
                          let characterIds: string[] = []
                          if (wizardData?.step2?.characters && Array.isArray(wizardData.step2.characters)) {
                            characterIds = wizardData.step2.characters
                              .filter((char: any) => char.characterId)
                              .map((char: any) => char.characterId)
                          } else if (characterId) {
                            // Backward compatibility: single character
                            characterIds = [characterId]
                          }

                          const requestBody = {
                            characterIds: characterIds, // NEW: Multiple characters
                            characterId: characterIds[0], // Backward compatibility (optional)
                            theme: theme,
                            illustrationStyle: illustrationStyle,
                            customRequests: customRequests || undefined,
                            language: (wizardData?.step3?.language?.id || formData.language.id) as any,
                          }

                          console.log("[Step 6] DEBUG: Testing story generation with:", requestBody)
                          console.log("[Step 6] DEBUG: Character IDs:", characterIds)

                          const response = await fetch("/api/books", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(requestBody),
                          })

                          const result = await response.json()
                          console.log("[Step 6] DEBUG: Story generation response:", result)

                          if (!response.ok || !result.success) {
                            throw new Error(result.message || result.error || "Failed to generate story")
                          }

                          setStoryResponse(result)
                          setShowStoryPrompt(true)
                          toast({
                            title: "Story Generated!",
                            description: "Check the modal to see the response.",
                          })
                        } catch (error) {
                          console.error("[Step 6] DEBUG: Error testing story generation:", error)
                          toast({
                            title: "Error",
                            description: error instanceof Error ? error.message : "Failed to test story generation. Check console for details.",
                            variant: "destructive",
                          })
                        } finally {
                          setIsTestingStory(false)
                        }
                      }}
                      className="flex-1 border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-400 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
                    >
                      {isTestingStory ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Test Story Generation
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Cover Generation */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        try {
                          // Build character description from wizard data or fallback to formData
                          const step1 = wizardData?.step1 || {}
                          const step2Analysis = wizardData?.step2?.characterAnalysis || {}
                          
                          const characterDescription = {
                            age: step1.age || formData.character.age,
                            gender: (step1.gender || formData.character.gender).toLowerCase(),
                            skinTone: step2Analysis.skinTone || "fair",
                            hairColor: step1.hairColor || formData.character.hairColor || "brown",
                            hairStyle: step2Analysis.hairStyle || "straight",
                            hairLength: step2Analysis.hairLength || "short",
                            hairTexture: step2Analysis.hairTexture || "smooth",
                            eyeColor: step1.eyeColor || formData.character.eyeColor || "brown",
                            eyeShape: step2Analysis.eyeShape || "round",
                            faceShape: step2Analysis.faceShape || "round",
                            height: "average",
                            build: "normal",
                            clothingStyle: "casual",
                            clothingColors: ["blue", "red"],
                            uniqueFeatures: [],
                            typicalExpression: "happy",
                            personalityTraits: ["curious", "friendly"],
                          }

                          // Extract theme and illustration style names from objects
                          const illustrationStyle = wizardData?.step4?.illustrationStyle?.title || wizardData?.step4?.illustrationStyle || formData.illustrationStyle.name
                          const theme = wizardData?.step3?.theme?.title || wizardData?.step3?.theme || formData.theme.name
                          const characterName = step1.name || formData.character.name

                          const coverScene = `A magical book cover for a story titled "${characterName}'s Adventure" in a ${theme} theme, featuring the main character in a whimsical, inviting scene that captures the essence of the story`

                          const prompt = buildDetailedCharacterPrompt(
                            characterDescription,
                            illustrationStyle,
                            coverScene
                          )

                          setCoverPrompt(prompt)
                          setShowCoverPrompt(true)
                          console.log("[Step 6] DEBUG: Generated cover prompt:", prompt)
                        } catch (error) {
                          console.error("[Step 6] DEBUG: Error generating cover prompt:", error)
                          toast({
                            title: "Error",
                            description: "Failed to generate cover prompt. Check console for details.",
                            variant: "destructive",
                          })
                        }
                      }}
                      className="flex-1 border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Show Cover Prompt
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isTestingCover}
                      onClick={async () => {
                        setIsTestingCover(true)
                        try {
                          // Build character description from wizard data or fallback to formData
                          const step1 = wizardData?.step1 || {}
                          const step2Analysis = wizardData?.step2?.characterAnalysis || {}
                          
                          const characterDescription = {
                            age: step1.age || formData.character.age,
                            gender: (step1.gender || formData.character.gender).toLowerCase(),
                            skinTone: step2Analysis.skinTone || "fair",
                            hairColor: step1.hairColor || formData.character.hairColor || "brown",
                            hairStyle: step2Analysis.hairStyle || "straight",
                            hairLength: step2Analysis.hairLength || "short",
                            hairTexture: step2Analysis.hairTexture || "smooth",
                            eyeColor: step1.eyeColor || formData.character.eyeColor || "brown",
                            eyeShape: step2Analysis.eyeShape || "round",
                            faceShape: step2Analysis.faceShape || "round",
                            height: "average",
                            build: "normal",
                            clothingStyle: "casual",
                            clothingColors: ["blue", "red"],
                            uniqueFeatures: [],
                            typicalExpression: "happy",
                            personalityTraits: ["curious", "friendly"],
                          }

                          // Extract theme and illustration style names from objects
                          const illustrationStyle = wizardData?.step4?.illustrationStyle?.title || wizardData?.step4?.illustrationStyle || formData.illustrationStyle.name
                          const theme = wizardData?.step3?.theme?.title || wizardData?.step3?.theme || formData.theme.name
                          const characterName = step1.name || formData.character.name
                          const title = `${characterName}'s Adventure`

                          // Get reference image from localStorage (character photo)
                          const referenceImageUrl = wizardData?.step2?.characterPhoto?.url || null

                          const requestBody = {
                            characterDescription,
                            illustrationStyle,
                            theme,
                            title,
                            referenceImageUrl, // Reference photo (base64 data URL)
                            useFreeCredit: false, // Test mode, don't use free credit
                            // NOTE: model/size/quality are hardcoded in API (gpt-image-1.5 / 1024x1536 / low)
                          }

                          console.log("[Step 6] DEBUG: Testing cover generation with:", {
                            ...requestBody,
                            referenceImageUrl: referenceImageUrl ? "Provided (base64)" : "Not provided"
                          })

                          const response = await fetch("/api/ai/generate-cover", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(requestBody),
                          })

                          const result = await response.json()
                          console.log("[Step 6] DEBUG: Cover generation response:", result)

                          if (!response.ok || !result.success) {
                            throw new Error(result.message || result.error || "Failed to generate cover")
                          }

                          setCoverResponse(result)
                          setShowCoverPrompt(true)
                          toast({
                            title: "Cover Generated!",
                            description: "Check the modal to see the generated cover.",
                          })
                        } catch (error) {
                          console.error("[Step 6] DEBUG: Error testing cover generation:", error)
                          toast({
                            title: "Error",
                            description: error instanceof Error ? error.message : "Failed to test cover generation. Check console for details.",
                            variant: "destructive",
                          })
                        } finally {
                          setIsTestingCover(false)
                        }
                      }}
                      className="flex-1 border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-400 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
                    >
                      {isTestingCover ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Test Cover Generation
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.55 }}
              className="mt-6 text-center text-xs text-gray-600 dark:text-slate-400"
            >
              <p>🔒 Secure payment • 💯 30-day money-back guarantee</p>
            </motion.div>
          </div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Use DEBUG buttons above to test cover generation. Book creation will be enabled after cover generation is tested.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Story Prompt/Response Modal */}
      {showStoryPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg border border-gray-300 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">
                {storyResponse ? "Story Generation Response" : "Story Generation Prompt"}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowStoryPrompt(false)
                  setStoryPrompt("")
                  setStoryResponse(null)
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(90vh - 140px)" }}>
              {storyResponse ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-slate-300">API Response:</h3>
                    <pre className="whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 text-xs text-gray-800 dark:bg-slate-800 dark:text-slate-200">
                      {JSON.stringify(storyResponse, null, 2)}
                    </pre>
                  </div>
                  {storyResponse.data?.story_data && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-slate-300">Generated Story:</h3>
                      <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                        <h4 className="mb-2 font-bold text-purple-900 dark:text-purple-200">
                          {storyResponse.data.story_data.title}
                        </h4>
                        <div className="space-y-3">
                          {storyResponse.data.story_data.pages?.map((page: any, idx: number) => (
                            <div key={idx} className="rounded border border-purple-200 bg-white p-3 dark:border-purple-800 dark:bg-slate-800">
                              <p className="mb-1 text-xs font-semibold text-purple-700 dark:text-purple-300">
                                Page {page.pageNumber}:
                              </p>
                              <p className="text-sm text-gray-800 dark:text-slate-200">{page.text}</p>
                              {page.imagePrompt && (
                                <p className="mt-2 text-xs italic text-gray-600 dark:text-slate-400">
                                  Image: {page.imagePrompt}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-slate-200">
                  {storyPrompt}
                </pre>
              )}
            </div>
            <div className="border-t border-gray-200 p-4 dark:border-slate-700">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {storyResponse && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStoryResponse(null)
                        // Regenerate prompt to show it
                        const characterName = wizardData?.step1?.name || formData.character.name
                        const characterAge = wizardData?.step1?.age || formData.character.age
                        const characterGender = wizardData?.step1?.gender || formData.character.gender.toLowerCase()
                        const theme = wizardData?.step3?.theme || formData.theme.name.toLowerCase().replace(/\s+/g, "-")
                        const illustrationStyle = wizardData?.step4?.illustrationStyle || formData.illustrationStyle.name.toLowerCase().replace(/\s+/g, "-")
                        const customRequests = wizardData?.step5?.customRequests || formData.customRequests
                        const referencePhotoAnalysis = wizardData?.step2?.characterAnalysis

                        const prompt = generateStoryPrompt({
                          characterName,
                          characterAge: parseInt(characterAge) || 5,
                          characterGender,
                          theme,
                          illustrationStyle,
                          customRequests,
                          referencePhotoAnalysis,
                          language: (wizardData?.step3?.language?.id || formData.language.id) as any,
                          pageCount: wizardData?.step5?.pageCount, // Use pageCount from Step 5
                        })
                        setStoryPrompt(prompt)
                      }}
                    >
                      Show Prompt
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  {storyPrompt && !storyResponse && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(storyPrompt)
                        toast({
                          title: "Copied!",
                          description: "Story prompt copied to clipboard",
                        })
                      }}
                    >
                      Copy Prompt
                    </Button>
                  )}
                  {storyResponse && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(storyResponse, null, 2))
                        toast({
                          title: "Copied!",
                          description: "Response copied to clipboard",
                        })
                      }}
                    >
                      Copy Response
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => {
                      setShowStoryPrompt(false)
                      setStoryPrompt("")
                      setStoryResponse(null)
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cover Prompt/Response Modal */}
      {showCoverPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg border border-gray-300 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">
                {coverResponse ? "Cover Generation Response" : "Cover Generation Prompt"}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCoverPrompt(false)
                  setCoverPrompt("")
                  setCoverResponse(null)
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(90vh - 140px)" }}>
              {coverResponse ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-slate-300">API Response:</h3>
                    <pre className="whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 text-xs text-gray-800 dark:bg-slate-800 dark:text-slate-200">
                      {JSON.stringify(coverResponse, null, 2)}
                    </pre>
                  </div>
                  {coverResponse.data?.coverUrl && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-slate-300">Generated Cover:</h3>
                      <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                        <img
                          src={coverResponse.data.coverUrl}
                          alt="Generated cover"
                          className="w-full rounded-lg border border-orange-200 shadow-lg dark:border-orange-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-slate-200">
                  {coverPrompt}
                </pre>
              )}
            </div>
            <div className="border-t border-gray-200 p-4 dark:border-slate-700">
              <div className="flex justify-end gap-2">
                {coverPrompt && !coverResponse && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(coverPrompt)
                      toast({
                        title: "Copied!",
                        description: "Cover prompt copied to clipboard",
                      })
                    }}
                  >
                    Copy Prompt
                  </Button>
                )}
                {coverResponse && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(coverResponse, null, 2))
                      toast({
                        title: "Copied!",
                        description: "Response copied to clipboard",
                      })
                    }}
                  >
                    Copy Response
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => {
                    setShowCoverPrompt(false)
                    setCoverPrompt("")
                    setCoverResponse(null)
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
