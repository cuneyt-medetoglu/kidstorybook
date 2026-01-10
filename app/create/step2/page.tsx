"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Upload,
  X,
  CheckCircle,
  Star,
  Heart,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Plus,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type CharacterType = "Child" | "Dog" | "Cat" | "Rabbit" | "Teddy Bear" | "Other"

type Character = {
  id: string
  type: CharacterType
  uploadedFile: File | null
  previewUrl: string | null
  uploadError: string | null
  isDragging: boolean
}

export default function Step2Page() {
  const router = useRouter()
  const { toast } = useToast()
  const [step1Data, setStep1Data] = useState<any>(null)
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: "1",
      type: "Child",
      uploadedFile: null,
      previewUrl: null,
      uploadError: null,
      isDragging: false,
    },
  ])

  // Load Step 1 data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kidstorybook_wizard")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setStep1Data(data.step1)
      } catch (error) {
        console.error("Error parsing wizard data:", error)
      }
    }
  }, [])

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

  const handleFileUpload = async (characterId: string, file: File) => {
    const error = validateFile(file)

    if (error) {
      setCharacters((prev) =>
        prev.map((char) => (char.id === characterId ? { ...char, uploadError: error } : char)),
      )
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive",
      })
      return
    }

    // Update character state with uploaded file
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id === characterId) {
          return {
            ...char,
            uploadedFile: file,
            previewUrl: URL.createObjectURL(file),
            uploadError: null,
          }
        }
        return char
      }),
    )

    // Save photo to localStorage and create character (no AI Analysis needed)
    try {
      // Convert file to base64 for localStorage
      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        const photoBase64 = dataUrl.split(",")[1] // Extract base64 part

        // Save to localStorage
        const saved = localStorage.getItem("kidstorybook_wizard")
        const wizardData = saved ? JSON.parse(saved) : {}
        
        wizardData.step2 = {
          ...wizardData.step2,
          characterPhoto: {
            url: dataUrl,
            filename: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          },
        }
        localStorage.setItem("kidstorybook_wizard", JSON.stringify(wizardData))
        console.log("[Step 2] Saved photo to localStorage:", { characterPhoto: wizardData.step2.characterPhoto })

        // Create character in database (simple, no AI Analysis)
        if (step1Data) {
          try {
            const createCharResponse = await fetch("/api/characters", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: step1Data.name,
                age: step1Data.age?.toString() || "5",
                gender: step1Data.gender?.toLowerCase() || "girl",
                hairColor: step1Data.hairColor || "brown",
                eyeColor: step1Data.eyeColor || "brown",
                specialFeatures: step1Data.specialFeatures || [],
                photoBase64: photoBase64, // Photo as base64 (without data URL prefix)
              }),
            })

            const createCharResult = await createCharResponse.json()

            if (!createCharResponse.ok || !createCharResult.success) {
              throw new Error(createCharResult.error || "Failed to create character")
            }

            // Save character ID to localStorage
            const createdCharacterId = createCharResult.character?.id
            if (createdCharacterId) {
              localStorage.setItem("kidstorybook_character_id", createdCharacterId)
              console.log("[Step 2] Character created with ID:", createdCharacterId)
              toast({
                title: "Character Created!",
                description: `Character "${step1Data.name}" has been created successfully.`,
              })
            }
          } catch (error) {
            console.error("[Step 2] Error creating character:", error)
            toast({
              title: "Warning",
              description: "Photo saved but character creation failed. You can continue and try again later.",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Warning",
            description: "Photo saved but Step 1 data not found. Please go back to Step 1 first.",
            variant: "destructive",
          })
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error processing file:", error)
      toast({
        title: "Error",
        description: "Failed to process photo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileDrop = useCallback(
    (characterId: string, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setCharacters((prev) =>
        prev.map((char) => (char.id === characterId ? { ...char, isDragging: false } : char)),
      )

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFileUpload(characterId, file)
      }
    },
    [step1Data], // Add step1Data as dependency
  )

  const handleFileInput = (characterId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(characterId, file)
    }
  }

  const handleRemoveFile = (characterId: string) => {
    setCharacters((prev) => {
      const updated = prev.map((char) => {
        if (char.id === characterId) {
          if (char.previewUrl) {
            URL.revokeObjectURL(char.previewUrl)
          }
          return {
            ...char,
            uploadedFile: null,
            previewUrl: null,
            uploadError: null,
          }
        }
        return char
      })
      return updated
    })

    // Remove from localStorage
    const saved = localStorage.getItem("kidstorybook_wizard")
    if (saved) {
      try {
        const wizardData = JSON.parse(saved)
        delete wizardData.step2?.characterPhoto
        localStorage.setItem("kidstorybook_wizard", JSON.stringify(wizardData))
      } catch (error) {
        console.error("Error updating localStorage:", error)
      }
    }
  }

  const handleAddCharacter = () => {
    if (characters.length >= 3) return

    const newCharacter: Character = {
      id: Date.now().toString(),
      type: "Child",
      uploadedFile: null,
      previewUrl: null,
      uploadError: null,
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
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/50 p-6 shadow-lg dark:border-purple-700 dark:from-slate-800 dark:to-purple-900/20"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold text-white">
                          Character {index + 1}
                        </span>
                        <Select value={character.type} onValueChange={(value) => handleCharacterTypeChange(character.id, value as CharacterType)}>
                          <SelectTrigger className="w-[140px] border-purple-300 bg-white dark:border-purple-600 dark:bg-slate-700">
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
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition-all hover:bg-red-600"
                          aria-label="Remove character"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>

                    {!character.previewUrl ? (
                      <motion.div
                        onDragOver={(e) => {
                          e.preventDefault()
                          setCharacters((prev) =>
                            prev.map((char) => (char.id === character.id ? { ...char, isDragging: true } : char)),
                          )
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          setCharacters((prev) =>
                            prev.map((char) => (char.id === character.id ? { ...char, isDragging: false } : char)),
                          )
                        }}
                        onDrop={(e) => handleFileDrop(character.id, e)}
                        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                          character.isDragging
                            ? "border-purple-500 bg-purple-100 dark:bg-purple-900/30"
                            : "border-purple-300 bg-white/50 hover:border-purple-400 hover:bg-purple-50/50 dark:border-purple-600 dark:bg-slate-700/50 dark:hover:border-purple-500"
                        }`}
                      >
                        <input
                          type="file"
                          id={`file-input-${character.id}`}
                          accept="image/jpeg,image/jpg,image/png"
                          className="hidden"
                          onChange={(e) => handleFileInput(character.id, e)}
                        />
                        <label
                          htmlFor={`file-input-${character.id}`}
                          className="flex cursor-pointer flex-col items-center justify-center"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          >
                            <Upload className="h-8 w-8" />
                          </motion.div>
                          <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-slate-300">
                            {getUploadLabel(character.type)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            Drag and drop or click to browse
                          </p>
                          <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                            JPG or PNG, max 5MB
                          </p>
                        </label>
                      </motion.div>
                    ) : (
                      <div>
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
                            <p className="font-medium">{character.uploadedFile?.name}</p>
                            <p>{character.uploadedFile && formatFileSize(character.uploadedFile.size)}</p>
                            {character.uploadedFile && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-2 flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-xs font-semibold">Photo Ready</span>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Back</span>
                </Button>
              </Link>

              <Button
                type="button"
                onClick={() => {
                  if (!hasUploadedPhotos) {
                    toast({
                      title: "Photo Required",
                      description: "Please upload at least one character photo before proceeding.",
                      variant: "destructive",
                    })
                    return
                  }
                  router.push("/create/step3")
                }}
                disabled={!hasUploadedPhotos}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 sm:w-auto"
              >
                <span>Next</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
