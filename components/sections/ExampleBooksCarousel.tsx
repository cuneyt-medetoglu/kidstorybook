"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronLeft, ChevronRight, Eye, BookOpen } from "lucide-react"
import { mockExampleBooks, type ExampleBook } from "@/app/examples/types"

export function ExampleBooksCarousel() {
  // Use first 6 books from mockExampleBooks
  const exampleBooks = mockExampleBooks.slice(0, 6)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isAutoPlaying])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % exampleBooks.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + exampleBooks.length) % exampleBooks.length)
  }

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrev()
    }

    // Reset
    setTouchStart(0)
    setTouchEnd(0)
  }

  // Mobile slide variants (horizontal swipe)
  const mobileSlideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  // Desktop slide variants
  const desktopSlideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white py-16 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 md:py-24"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-gradient-to-br from-purple-300/20 to-pink-300/20 blur-3xl dark:from-purple-600/10 dark:to-pink-600/10"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-gradient-to-br from-pink-300/20 to-purple-300/20 blur-3xl dark:from-pink-600/10 dark:to-purple-600/10"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Example Books
          </h2>
          <p className="text-pretty mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            See how photos become magical stories
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative mx-auto max-w-7xl">
          {/* Book Cards */}
          <div
            className="relative overflow-hidden md:h-[500px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Mobile: Single card view */}
            <div className="block md:hidden relative overflow-hidden" style={{ minHeight: "500px" }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={mobileSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 400, damping: 40, duration: 0.5 },
                    opacity: { duration: 0.3 },
                  }}
                  className="absolute inset-0 w-full px-2"
                >
                  <BookCard book={exampleBooks[currentIndex]} index={0} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop/Tablet: Multiple cards view - Horizontal slider */}
            <div className="hidden md:block relative h-[500px] overflow-x-hidden overflow-y-visible">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={desktopSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 },
                  }}
                  className="absolute inset-0"
                >
                  <div className="flex flex-nowrap gap-6 h-full items-start overflow-x-hidden">
                    {exampleBooks
                      .slice(currentIndex, currentIndex + 3)
                      .concat(
                        exampleBooks.slice(0, Math.max(0, currentIndex + 3 - exampleBooks.length))
                      )
                      .slice(0, 3)
                      .map((book, idx) => (
                        <div key={`${book.id}-${idx}`} className="flex-shrink-0 flex-grow-0 md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]">
                          <BookCard book={book} index={idx} />
                        </div>
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-2 flex items-center justify-center gap-4 md:-mt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="h-12 w-12 rounded-full border-2 border-purple-200 bg-white shadow-lg transition-all hover:scale-110 hover:border-purple-400 hover:bg-purple-50 hover:shadow-xl dark:border-purple-800 dark:bg-slate-900 dark:hover:border-purple-600 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {exampleBooks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-12 w-12 rounded-full border-2 border-purple-200 bg-white shadow-lg transition-all hover:scale-110 hover:border-purple-400 hover:bg-purple-50 hover:shadow-xl dark:border-purple-800 dark:bg-slate-900 dark:hover:border-purple-600 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

interface BookCardProps {
  book: ExampleBook
  index: number
}

function BookCard({ book }: BookCardProps) {
  const firstPhoto = book.usedPhotos[0]

  return (
    <Card className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-slate-900">
      {/* Photo → Book Cover Transformation */}
      <div className="mb-6 flex items-center justify-center gap-4">
        {/* Used Photo */}
        <motion.div
          className="relative h-28 w-28 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-muted"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {firstPhoto?.originalPhoto ? (
            <Image
              src={firstPhoto.originalPhoto}
              alt={firstPhoto.characterName}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
              <span className="text-[10px]">📷</span>
            </div>
          )}
        </motion.div>

        {/* Arrow Icon */}
        <motion.div
          animate={{
            x: [0, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ArrowRight className="h-8 w-8 text-purple-500 dark:text-purple-400" />
        </motion.div>

        {/* Book Cover */}
        <motion.div
          className="relative h-40 w-28 rounded-2xl shadow-xl overflow-hidden bg-muted"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ duration: 0.3 }}
        >
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <BookOpen className="w-8 h-8" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Book Information */}
      <div>
        <h3 className="text-balance text-xl font-bold text-foreground mb-3">{book.title}</h3>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0">
            {book.theme}
          </Badge>
          <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-0">
            {book.ageGroup === '10+' ? '10+ years' : `${book.ageGroup} years`}
          </Badge>
        </div>

        <p className="text-pretty text-sm text-muted-foreground line-clamp-2 mb-1">
          {book.description}
        </p>

        {/* CTA Button */}
        <Link href={`/examples#book-${book.id}`} className="block mt-1">
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all hover:scale-105 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl"
            size="sm"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Example
          </Button>
        </Link>
      </div>

      {/* Decorative Corner Accent */}
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl transition-all group-hover:translate-x-8 group-hover:-translate-y-8" />
    </Card>
  )
}

