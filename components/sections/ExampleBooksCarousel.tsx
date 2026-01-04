"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, ChevronLeft, ChevronRight, Eye } from "lucide-react"

interface Book {
  id: number
  title: string
  theme: string
  ageGroup: string
  description: string
  photoPlaceholder: string
  coverPlaceholder: string
}

const exampleBooks: Book[] = [
  {
    id: 1,
    title: "Emma's Garden Adventure",
    theme: "Adventure",
    ageGroup: "3-5 years",
    description:
      "A magical journey through a blooming garden filled with talking flowers and friendly butterflies.",
    photoPlaceholder: "from-amber-200 to-amber-300",
    coverPlaceholder: "from-green-400 to-emerald-500",
  },
  {
    id: 2,
    title: "Lucas and the Dinosaur",
    theme: "Adventure",
    ageGroup: "6-9 years",
    description: "An exciting prehistoric adventure where friendship conquers all challenges.",
    photoPlaceholder: "from-blue-200 to-blue-300",
    coverPlaceholder: "from-orange-400 to-red-500",
  },
  {
    id: 3,
    title: "Sophie's Magical Forest",
    theme: "Fairy Tale",
    ageGroup: "3-5 years",
    description: "A enchanting tale of discovery in a mystical forest filled with wonder and magic.",
    photoPlaceholder: "from-rose-200 to-rose-300",
    coverPlaceholder: "from-purple-400 to-pink-500",
  },
  {
    id: 4,
    title: "Max's Space Journey",
    theme: "Science Fiction",
    ageGroup: "6-9 years",
    description: "An intergalactic adventure exploring distant planets and meeting alien friends.",
    photoPlaceholder: "from-cyan-200 to-cyan-300",
    coverPlaceholder: "from-indigo-400 to-blue-500",
  },
]

export function ExampleBooksCarousel() {
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

            {/* Desktop/Tablet: Multiple cards view */}
            <div className="hidden md:block relative h-[500px]">
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
                  <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                    {exampleBooks
                      .slice(currentIndex, currentIndex + 3)
                      .concat(
                        exampleBooks.slice(0, Math.max(0, currentIndex + 3 - exampleBooks.length))
                      )
                      .slice(0, 3)
                      .map((book, idx) => (
                        <BookCard key={`${book.id}-${idx}`} book={book} index={idx} />
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-center gap-4">
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
  book: Book
  index: number
}

function BookCard({ book, index }: BookCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-slate-900">
        {/* Photo → Book Cover Transformation */}
        <div className="mb-6 flex items-center justify-center gap-4">
          {/* Used Photo */}
          <motion.div
            className={`flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br shadow-md ${book.photoPlaceholder}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-700">Photo</div>
              <div className="mt-1 text-[10px] text-gray-600">Placeholder</div>
            </div>
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
            className={`flex h-40 w-28 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl ${book.coverPlaceholder}`}
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-xs font-bold text-white drop-shadow-lg">Book</div>
              <div className="mt-1 text-[10px] text-white/90 drop-shadow">Cover</div>
            </div>
          </motion.div>
        </div>

        {/* Book Information */}
        <div className="space-y-3">
          <h3 className="text-balance text-xl font-bold text-foreground">{book.title}</h3>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {book.theme}
            </span>
            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
              {book.ageGroup}
            </span>
          </div>

          <p className="text-pretty text-sm text-muted-foreground line-clamp-2">
            {book.description}
          </p>

          {/* CTA Button */}
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all hover:scale-105 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl"
            size="sm"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Example
          </Button>
        </div>

        {/* Decorative Corner Accent */}
        <div className="absolute right-0 top-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl transition-all group-hover:translate-x-8 group-hover:-translate-y-8" />
      </Card>
  )
}

