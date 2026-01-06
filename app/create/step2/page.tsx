"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Upload, X, CheckCircle, Brain, Sparkles, Star, Heart, BookOpen, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useCallback } from "react"

type AnalysisResult = {
  hairLength: string
  hairStyle: string
  hairTexture: string
  faceShape: string
  eyeShape: string
  skinTone: string
}

export default function Step2Page() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  // File validation
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

  // Handle file upload
  const handleFileUpload = (file: File) => {
    const error = validateFile(file)

    if (error) {
      setUploadError(error)
      return
    }

    setUploadError(null)
    setUploadedFile(file)
    setAnalysisResult(null) // Reset analysis when new file uploaded

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [])

  // Remove uploaded file
  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setUploadedFile(null)
    setPreviewUrl(null)
    setUploadError(null)
    setAnalysisResult(null)
  }

  // Simulate AI analysis (Faz 3'te backend entegrasyonu yapılacak)
  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    // Simulate API call with 2-3 second delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Mock analysis results (Faz 3'te gerçek AI analizi yapılacak)
    const mockResults: AnalysisResult = {
      hairLength: ["Long", "Medium", "Short"][Math.floor(Math.random() * 3)],
      hairStyle: ["Curly", "Straight", "Wavy", "Braided"][Math.floor(Math.random() * 4)],
      hairTexture: ["Fine", "Thick"][Math.floor(Math.random() * 2)],
      faceShape: ["Round", "Oval", "Square"][Math.floor(Math.random() * 3)],
      eyeShape: ["Almond", "Round", "Hooded"][Math.floor(Math.random() * 3)],
      skinTone: ["Light", "Medium", "Dark"][Math.floor(Math.random() * 3)],
    }

    setAnalysisResult(mockResults)
    setIsAnalyzing(false)
    // TODO: Faz 3'te gerçek AI analizi (GPT-4 Vision veya Gemini Vision)
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
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
          <div className="mx-auto max-w-2xl">
            <div className="mb-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-slate-300">
              <span>Step 2 of 6</span>
              <span>Reference Photo</span>
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

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div className="rounded-2xl bg-white/80 p-6 shadow-2xl backdrop-blur-sm dark:bg-slate-800/80 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-8 text-center"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Upload Your Child's Photo</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">Upload a reference photo for character creation</p>
            </motion.div>

            {/* Upload Section */}
            {!uploadedFile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`relative flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all md:min-h-[300px] ${
                    isDragging
                      ? "border-purple-500 bg-purple-100 dark:border-purple-400 dark:bg-purple-900/30"
                      : "border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:hover:border-purple-600 dark:hover:bg-purple-900/30"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Upload photo"
                  />

                  <Upload className="mb-4 h-16 w-16 text-purple-400 dark:text-purple-300" />

                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-slate-50">
                    {isDragging ? "Drop your photo here" : "Upload Reference Photo"}
                  </h3>

                  <p className="mb-4 text-sm text-gray-600 dark:text-slate-400">
                    Drag & drop your photo here or click to browse
                  </p>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      className="pointer-events-none bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-white shadow-lg hover:shadow-xl dark:from-purple-400 dark:to-pink-400"
                    >
                      Choose File
                    </Button>
                  </motion.div>

                  <p className="mt-4 text-xs text-gray-500 dark:text-slate-500">JPG, PNG up to 5MB</p>
                </div>

                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Photo Preview */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative mx-auto max-w-md"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-xl">
                    <img src={previewUrl || ""} alt="Uploaded preview" className="h-auto w-full object-cover" />

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleRemoveFile}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:bg-red-600"
                      aria-label="Remove photo"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 text-center text-sm text-gray-600 dark:text-slate-400"
                  >
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p>{formatFileSize(uploadedFile.size)}</p>
                  </motion.div>
                </motion.div>

                {/* AI Analysis Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:border-purple-700 dark:from-purple-900/20 dark:to-pink-900/20"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-slate-50">Analyze Photo with AI</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Get detailed character analysis</p>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-gray-700 dark:text-slate-300">
                    Our AI will analyze the photo to detect hair length, style, facial features, and more to create the
                    perfect character.
                  </p>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !!analysisResult}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 dark:from-purple-400 dark:to-pink-400"
                    >
                      {isAnalyzing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                          />
                          <span>Analyzing...</span>
                        </>
                      ) : analysisResult ? (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          <span>Analysis Complete</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          <span>Analyze Photo</span>
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Analysis Results */}
                  {analysisResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6 space-y-3"
                    >
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Analysis Complete</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(analysisResult).map(([key, value], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-slate-800"
                          >
                            <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-slate-50">{value}</p>
                          </motion.div>
                        ))}
                      </div>

                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setAnalysisResult(null)
                          handleAnalyze()
                        }}
                        className="mt-2 text-sm font-medium text-purple-600 underline underline-offset-2 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        Re-analyze
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )}

            {/* Navigation Buttons */}
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
                    disabled={!uploadedFile}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:from-purple-400 dark:to-pink-400 sm:w-auto"
                  >
                    <span>Next</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Help Text */}
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

