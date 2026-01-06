"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Upload,
  X,
  CheckCircle,
  Brain,
  Sparkles,
  Star,
  Heart,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useState, useCallback } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type AnalysisResult = {
  hairLength: string
  hairStyle: string
  hairTexture: string
  faceShape: string
  eyeShape: string
  skinTone: string
}

type CharacterType = "Child" | "Dog" | "Cat" | "Rabbit" | "Teddy Bear" | "Other"

type Character = {
  id: string
  type: CharacterType
  uploadedFile: File | null
  previewUrl: string | null
  uploadError: string | null
  isAnalyzing: boolean
  analysisResult: AnalysisResult | null
  isDragging: boolean
}

export default function Step2Page() {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: "1",
      type: "Child",
      uploadedFile: null,
      previewUrl: null,
      uploadError: null,
      isAnalyzing: false,
      analysisResult: null,
      isDragging: false,
    },
  ])

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      return "Invalid file format. Please upload JPG or PNG"
    }

    if (file.size > maxSize) {
      return "File size exceeds 5MB. Please choose a smaller file"
    }

    return null
  }

  const handleFileUpload = (characterId: string, file: File) => {
    const error = validateFile(file)

    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id === characterId) {
          if (error) {
            return { ...char, uploadError: error }
          }

          const url = URL.createObjectURL(file)
          return {
            ...char,
            uploadedFile: file,
            previewUrl: url,
            uploadError: null,
            analysisResult: null,
          }
        }
        return char
      }),
    )
  }

  const handleFileInputChange = (characterId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(characterId, file)
    }
  }

  const handleDragEnter = useCallback((characterId: string, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCharacters((prev) => prev.map((char) => (char.id === characterId ? { ...char, isDragging: true } : char)))
  }, [])

  const handleDragLeave = useCallback((characterId: string, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCharacters((prev) => prev.map((char) => (char.id === characterId ? { ...char, isDragging: false } : char)))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((characterId: string, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCharacters((prev) => prev.map((char) => (char.id === characterId ? { ...char, isDragging: false } : char)))

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(characterId, file)
    }
  }, [])

  const handleRemoveFile = (characterId: string) => {
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id === characterId) {
          if (char.previewUrl) {
            URL.revokeObjectURL(char.previewUrl)
          }
          return {
            ...char,
            uploadedFile: null,
            previewUrl: null,
            uploadError: null,
            analysisResult: null,
          }
        }
        return char
      }),
    )
  }

  const handleAnalyze = async (characterId: string) => {
    setCharacters((prev) => prev.map((char) => (char.id === characterId ? { ...char, isAnalyzing: true } : char)))

    await new Promise((resolve) => setTimeout(resolve, 2500))

    const mockResults: AnalysisResult = {
      hairLength: ["Long", "Medium", "Short"][Math.floor(Math.random() * 3)],
      hairStyle: ["Curly", "Straight", "Wavy", "Braided"][Math.floor(Math.random() * 4)],
      hairTexture: ["Fine", "Thick"][Math.floor(Math.random() * 2)],
      faceShape: ["Round", "Oval", "Square"][Math.floor(Math.random() * 3)],
      eyeShape: ["Almond", "Round", "Hooded"][Math.floor(Math.random() * 3)],
      skinTone: ["Light", "Medium", "Dark"][Math.floor(Math.random() * 3)],
    }

    setCharacters((prev) =>
      prev.map((char) =>
        char.id === characterId ? { ...char, isAnalyzing: false, analysisResult: mockResults } : char,
      ),
    )
  }

  const handleAddCharacter = () => {
    if (characters.length >= 3) return

    const newCharacter: Character = {
      id: Date.now().toString(),
      type: "Child",
      uploadedFile: null,
      previewUrl: null,
      uploadError: null,
      isAnalyzing: false,
      analysisResult: null,
      isDragging: false,
    }

    setCharacters((prev) => [...prev, newCharacter])
  }

  const handleRemoveCharacter = (characterId: string) => {
    if (characters.length <= 1) return

    setCharacters((prev) => {
      const filtered = prev.filter((char) => {
        if (char.id === characterId) {
          if (char.previewUrl) {
            URL.revokeObjectURL(char.previewUrl)
          }
          return false
        }
        return true
      })
      return filtered
    })
  }

  const handleCharacterTypeChange = (characterId: string, type: CharacterType) => {
    setCharacters((prev) => prev.map((char) => (char.id === characterId ? { ...char, type } : char)))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getUploadLabel = (type: CharacterType): string => {
    const labels: Record<CharacterType, string> = {
      Child: "Upload Child Photo",
      Dog: "Upload Dog Photo",
      Cat: "Upload Cat Photo",
      Rabbit: "Upload Rabbit Photo",
      "Teddy Bear": "Upload Teddy Bear Photo",
      Other: "Upload Character Photo",
    }
    return labels[type]
  }

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

  const hasUploadedPhotos = characters.some((char) => char.uploadedFile !== null)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mx-auto max-w-2xl">
            <div className="mb-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-slate-300">
              <span>Step 2 of 6</span>
              <span>Add Characters</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "33.33%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div className="rounded-2xl bg-white/80 p-6 shadow-2xl backdrop-blur-sm dark:bg-slate-800/80 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-8 text-center"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Add Characters</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Upload photos for up to 3 characters (minimum 1)
              </p>
            </motion.div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {characters.map((character, index) => (
                  <motion.div
                    key={character.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-4 dark:border-purple-700 dark:from-purple-900/10 dark:to-pink-900/10 md:p-6"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Character {index + 1}
                        </Badge>
                        <Select
                          value={character.type}
                          onValueChange={(value) => handleCharacterTypeChange(character.id, value as CharacterType)}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Child">Child</SelectItem>
                            <SelectItem value="Dog">Dog</SelectItem>
                            <SelectItem value="Cat">Cat</SelectItem>
                            <SelectItem value="Rabbit">Rabbit</SelectItem>
                            <SelectItem value="Teddy Bear">Teddy Bear</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {characters.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveCharacter(character.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:bg-red-600"
                          aria-label="Remove character"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>

                    {!character.uploadedFile ? (
                      <div>
                        <div
                          onDragEnter={(e) => handleDragEnter(character.id, e)}
                          onDragLeave={(e) => handleDragLeave(character.id, e)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(character.id, e)}
                          className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all md:min-h-[220px] ${
                            character.isDragging
                              ? "border-purple-500 bg-purple-100 dark:border-purple-400 dark:bg-purple-900/30"
                              : "border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:hover:border-purple-600 dark:hover:bg-purple-900/30"
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={(e) => handleFileInputChange(character.id, e)}
                            className="absolute inset-0 cursor-pointer opacity-0"
                            aria-label={`Upload photo for character ${index + 1}`}
                          />

                          <Upload className="mb-3 h-12 w-12 text-purple-400 dark:text-purple-300" />

                          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-slate-50">
                            {character.isDragging ? "Drop your photo here" : getUploadLabel(character.type)}
                          </h3>

                          <p className="mb-3 text-sm text-gray-600 dark:text-slate-400">or click to browse</p>

                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              type="button"
                              size="sm"
                              className="pointer-events-none bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg dark:from-purple-400 dark:to-pink-400"
                            >
                              Choose File
                            </Button>
                          </motion.div>

                          <p className="mt-3 text-xs text-gray-500 dark:text-slate-500">JPG, PNG up to 5MB</p>
                        </div>

                        {character.uploadError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20"
                          >
                            <p className="text-sm text-red-600 dark:text-red-400">{character.uploadError}</p>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className="relative mx-auto max-w-sm"
                        >
                          <div className="relative overflow-hidden rounded-lg shadow-xl">
                            <img
                              src={character.previewUrl || ""}
                              alt={`${character.type} preview`}
                              className="h-auto w-full object-cover"
                            />

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveFile(character.id)}
                              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:bg-red-600"
                              aria-label="Remove photo"
                            >
                              <X className="h-5 w-5" />
                            </motion.button>
                          </div>

                          <div className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
                            <p className="font-medium">{character.uploadedFile.name}</p>
                            <p>{formatFileSize(character.uploadedFile.size)}</p>
                          </div>
                        </motion.div>

                        <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:border-purple-700 dark:from-purple-900/20 dark:to-pink-900/20">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                              <Brain className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 dark:text-slate-50">AI Analysis</h4>
                              <p className="text-xs text-gray-600 dark:text-slate-400">Detect character features</p>
                            </div>
                          </div>

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleAnalyze(character.id)}
                              disabled={character.isAnalyzing || !!character.analysisResult}
                              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 dark:from-purple-400 dark:to-pink-400"
                            >
                              {character.isAnalyzing ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                                  />
                                  <span>Analyzing...</span>
                                </>
                              ) : character.analysisResult ? (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  <span>Complete</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  <span>Analyze Photo</span>
                                </>
                              )}
                            </Button>
                          </motion.div>

                          {character.analysisResult && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="mt-3 space-y-2"
                            >
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-xs font-semibold">Analysis Complete</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(character.analysisResult).map(([key, value], idx) => (
                                  <motion.div
                                    key={key}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                    className="rounded-lg bg-white px-2 py-1.5 shadow-sm dark:bg-slate-800"
                                  >
                                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </p>
                                    <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-slate-50">{value}</p>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {characters.length < 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCharacter}
                    className="w-full border-2 border-dashed border-purple-300 bg-transparent py-6 text-base font-semibold text-purple-600 transition-all hover:border-purple-500 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    <span>Add Another Character</span>
                  </Button>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between"
            >
              <Link href="/create/step1" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-2 border-gray-300 px-6 py-6 text-base font-semibold transition-all hover:border-purple-500 hover:bg-purple-50 dark:border-slate-600 dark:hover:border-purple-400 dark:hover:bg-purple-900/20 sm:w-auto bg-transparent"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    <span>Back</span>
                  </Button>
                </motion.div>
              </Link>

              <Link href="/create/step3" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                  <Button
                    type="button"
                    disabled={!hasUploadedPhotos}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:from-purple-400 dark:to-pink-400 sm:w-auto"
                  >
                    <span>Next</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
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

