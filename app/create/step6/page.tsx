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
  Rocket,
  CheckCircle,
  Star,
  BookOpen,
  Pencil,
  Gift,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Step6Page() {
  // Mock data - in production, this would come from context/localStorage/URL params
  // TODO: Faz 3'te proper state management ile gerçek data kullanılacak
  // Mock user data - Faz 3'te Supabase'den gelecek
  const userData = {
    freeCoverAvailable: true, // Mock: Faz 3'te users.free_cover_used kontrolü yapılacak
  }

  const formData = {
    character: {
      name: "Arya",
      age: 2,
      gender: "Girl",
      hairColor: "Light Brown",
      eyeColor: "Brown",
      specialFeatures: ["Curly Hair", "Rosy Cheeks"],
    },
    photo: {
      uploaded: true,
      filename: "arya-photo.jpg",
      size: "2.5 MB",
      url: "/arya-photo.jpg",
      analysis: {
        hairLength: "Short",
        hairStyle: "Curly",
        hairTexture: "Fine",
        faceShape: "Round",
        eyeShape: "Round",
        skinTone: "Fair",
      },
    },
    theme: {
      name: "Fairy Tale",
      description: "Magical kingdoms, enchanted forests, and mystical adventures",
      icon: "🏰",
      color: "from-pink-400 to-purple-500",
    },
    ageGroup: {
      name: "6-9 Years",
      description: "Chapter books with more complex plots and detailed illustrations",
      icon: "📖",
      features: ["15-20 pages", "Chapter structure", "Detailed illustrations"],
    },
    illustrationStyle: {
      name: "Watercolor Dreams",
      description: "Soft, dreamy watercolor illustrations with flowing colors and gentle textures",
      color: "from-blue-300 to-purple-400",
    },
    customRequests:
      "Include a friendly dragon named Sparkle, have Arya find a magic wand in the forest, and add a tea party scene with woodland creatures.",
  }

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
    { Icon: CheckCircle, top: "8%", left: "8%", delay: 0, size: "h-8 w-8", color: "text-green-400" },
    { Icon: Sparkles, top: "12%", right: "10%", delay: 0.5, size: "h-7 w-7", color: "text-purple-400" },
    { Icon: BookOpen, top: "50%", left: "5%", delay: 1, size: "h-7 w-7", color: "text-pink-400" },
    { Icon: Star, top: "75%", right: "8%", delay: 1.5, size: "h-8 w-8", color: "text-yellow-400" },
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
              {userData.freeCoverAvailable && (
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
              {/* 1. Character Information Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow transition-all hover:scale-[1.01] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-6 w-6 text-purple-500" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Character Information</h2>
                    </div>
                    <Link
                      href="/create/step1"
                      className="text-sm font-medium text-purple-600 underline underline-offset-2 opacity-0 transition-opacity hover:text-purple-700 group-hover:opacity-100 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <Pencil className="mr-1 inline h-3 w-3" />
                      Edit
                    </Link>
                  </div>
                  <div className="space-y-2 text-base text-gray-700 dark:text-slate-300">
                    <p>
                      <span className="font-semibold">Name:</span> {formData.character.name}
                    </p>
                    <p>
                      <span className="font-semibold">Age:</span> {formData.character.age} years old
                    </p>
                    <p>
                      <span className="font-semibold">Gender:</span> {formData.character.gender}
                    </p>
                    <p>
                      <span className="font-semibold">Hair Color:</span> {formData.character.hairColor}
                    </p>
                    <p>
                      <span className="font-semibold">Eye Color:</span> {formData.character.eyeColor}
                    </p>
                    {formData.character.specialFeatures.length > 0 && (
                      <p>
                        <span className="font-semibold">Special Features:</span>{" "}
                        {formData.character.specialFeatures.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* 2. Reference Photo Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow transition-all hover:scale-[1.01] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-6 w-6 text-purple-500" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Reference Photo</h2>
                    </div>
                    <Link
                      href="/create/step2"
                      className="text-sm font-medium text-purple-600 underline underline-offset-2 opacity-0 transition-opacity hover:text-purple-700 group-hover:opacity-100 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <Pencil className="mr-1 inline h-3 w-3" />
                      Edit
                    </Link>
                  </div>

                  {formData.photo.uploaded ? (
                    <div className="space-y-4">
                      {/* Photo Preview */}
                      <div className="flex flex-col items-center">
                        <div className="relative h-64 w-64 overflow-hidden rounded-lg shadow-lg">
                          <Image
                            src={formData.photo.url || "/arya-photo.jpg"}
                            alt="Character reference photo"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">
                          {formData.photo.filename} ({formData.photo.size})
                        </p>
                      </div>

                      {/* AI Analysis Results */}
                      {formData.photo.analysis && (
                        <div>
                          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-slate-300">
                            AI Analysis Results:
                          </p>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {Object.entries(formData.photo.analysis).map(([key, value], index) => (
                              <motion.div
                                key={key}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                                className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 text-center text-sm font-medium text-white shadow"
                              >
                                <div className="text-xs opacity-90">
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .trim()
                                    .split(" ")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                                </div>
                                <div className="font-bold">{value}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="italic text-gray-500 dark:text-slate-500">No photo uploaded</p>
                  )}
                </div>
              </motion.div>

              {/* 3. Theme & Age Group Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow transition-all hover:scale-[1.01] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Theme & Age Group</h2>
                    </div>
                    <Link
                      href="/create/step3"
                      className="text-sm font-medium text-purple-600 underline underline-offset-2 opacity-0 transition-opacity hover:text-purple-700 group-hover:opacity-100 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <Pencil className="mr-1 inline h-3 w-3" />
                      Edit
                    </Link>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
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
                          {formData.ageGroup.features.map((feature, index) => (
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

              {/* 5. Custom Requests Summary */}
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
                </div>
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="mt-8 space-y-3"
            >
              {/* Free Cover Button (if available) */}
              {userData.freeCoverAvailable && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.4 }}
                  className="w-full"
                >
                  <Button
                    type="button"
                    onClick={() => {
                      // Placeholder - will trigger free cover creation API in Phase 3
                      // POST /api/ai/generate-cover with freeCover: true
                      alert("Free cover creation will be implemented in Phase 3!")
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6 text-base font-bold text-white shadow-lg transition-all hover:shadow-2xl dark:from-green-400 dark:to-emerald-400"
                  >
                    <Gift className="mr-2 h-5 w-5" />
                    <span>Create Free Cover</span>
                  </Button>
                  <p className="mt-2 text-center text-xs text-gray-500 dark:text-slate-400">
                    Use your free cover credit to create just the cover (Page 1)
                  </p>
                </motion.div>
              )}

              {/* Regular Navigation Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Link href="/create/step5" className="w-full sm:w-auto">
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

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Button
                    type="button"
                    onClick={() => {
                      // Placeholder - will trigger book creation API in Phase 3
                      alert("Book creation will be implemented in Phase 3!")
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-8 text-lg font-bold text-white shadow-lg transition-all hover:shadow-2xl dark:from-purple-400 dark:to-pink-400 sm:w-auto"
                  >
                    <span>Create Book</span>
                    <Rocket className="ml-2 h-6 w-6" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Once you click "Create Book", our AI will start crafting your personalized story!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

