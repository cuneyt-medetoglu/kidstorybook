"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronLeft, ChevronRight, Eye, BookOpen } from "lucide-react"
import type { ExampleBook } from "@/app/[locale]/examples/types"
import { useTranslations, useLocale } from "next-intl"

const CARDS_PER_PAGE = 3

export function ExampleBooksCarousel() {
  const t = useTranslations("homeExamples")
  const locale = useLocale()
  const [books, setBooks] = useState<ExampleBook[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const totalPages = Math.max(1, Math.ceil(books.length / CARDS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages - 1)
  const pageStartIndex = safePage * CARDS_PER_PAGE
  const pageBooks = books.slice(pageStartIndex, pageStartIndex + CARDS_PER_PAGE)

  useEffect(() => {
    let cancelled = false
    async function fetchExamples() {
      try {
        const res = await fetch(`/api/examples?locale=${locale}&limit=6`)
        const json = await res.json()
        if (cancelled) return
        if (json.success && Array.isArray(json.data)) {
          setBooks(json.data)
        } else {
          setBooks([])
        }
      } catch {
        if (!cancelled) setBooks([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchExamples()
    return () => { cancelled = true }
  }, [locale])

  // Auto-play when we have books (page-based)
  useEffect(() => {
    if (!isAutoPlaying || books.length === 0) return
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 5000)
    return () => clearInterval(interval)
  }, [safePage, isAutoPlaying, books.length, totalPages])

  const goToNextPage = () => {
    setDirection(1)
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const goToPrevPage = () => {
    setDirection(-1)
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const handleDotClick = (pageIndex: number) => {
    setDirection(pageIndex > safePage ? 1 : -1)
    setCurrentPage(pageIndex)
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

    if (isLeftSwipe) goToNextPage()
    if (isRightSwipe) goToPrevPage()

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

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-primary/5 to-white py-16 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 md:py-24">
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto mt-4 h-6 max-w-2xl animate-pulse rounded bg-muted/70" />
          </div>
          <div className="flex justify-center gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-[420px] w-[320px] flex-shrink-0 animate-pulse rounded-3xl bg-muted/30 p-6" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (books.length === 0) return null

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-primary/5 to-white py-16 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 md:py-24"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/15 to-brand-2/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-gradient-to-br from-brand-2/15 to-primary/10 blur-3xl"
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
            {t("title")}
          </h2>
          <p className="text-pretty mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t("subtitle")}
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
            {/* Mobile: one card per page (first card of page) */}
            <div className="block md:hidden relative overflow-hidden" style={{ minHeight: "500px" }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={safePage}
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
                  <BookCard book={books[pageStartIndex]} index={0} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop: 3 cards per page */}
            <div className="hidden md:block relative h-[500px] overflow-x-hidden overflow-y-visible">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={safePage}
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
                    {pageBooks.map((book, idx) => (
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
              onClick={goToPrevPage}
              className="h-12 w-12 rounded-full border-2 border-primary/20 bg-white shadow-lg transition-all hover:scale-110 hover:border-primary/40 hover:bg-primary/5 hover:shadow-xl dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </Button>

            {/* Dots: one per page (e.g. 6 books → 2 dots) */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === safePage
                      ? "w-8 bg-gradient-to-r from-primary to-brand-2"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              className="h-12 w-12 rounded-full border-2 border-primary/20 bg-white shadow-lg transition-all hover:scale-110 hover:border-primary/40 hover:bg-primary/5 hover:shadow-xl dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
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
  const t = useTranslations("homeExamples")
  const tBooks = useTranslations("examples.books")
  const usedPhotos = book.usedPhotos ?? []
  const firstPhoto = usedPhotos[0]
  const hasMultiplePhotos = usedPhotos.length >= 2
  const title = book.localeKey ? tBooks(`${book.localeKey}.title`) : book.title
  const description = book.localeKey ? tBooks(`${book.localeKey}.description`) : book.description

  return (
    <Card className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-slate-900">
      {/* Photo → Book Cover Transformation */}
      <div className="mb-6 flex items-center justify-center gap-4">
        {/* Used Photo(s): single large or thumbnail grid */}
        {hasMultiplePhotos ? (
          <motion.div
            className="grid grid-cols-2 gap-1 rounded-2xl border-4 border-white p-1 shadow-md bg-muted"
            style={{ width: '7rem', height: '7rem' }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {usedPhotos.slice(0, 4).map((photo, idx) => (
              <div key={photo.id} className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                {photo.originalPhoto ? (
                  <>
                    <Image
                      src={photo.originalPhoto}
                      alt={photo.characterName}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    {idx === 3 && usedPhotos.length > 4 && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-bold rounded-lg">
                        +{usedPhotos.length - 4}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">📷</div>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
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
                sizes="(max-width: 768px) 80vw, 500px"
                className="object-cover"
                unoptimized
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
        )}

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
          <ArrowRight className="h-8 w-8 text-primary" />
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
              sizes="(max-width: 768px) 40vw, 240px"
              className="object-cover"
              unoptimized
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
        <h3 className="text-balance text-xl font-bold text-foreground mb-3">{title}</h3>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className="bg-primary/10 text-primary border-0">
            {book.theme}
          </Badge>
          <Badge className="bg-brand-2/10 text-brand-2 border-0">
            {book.ageGroup === '10+' ? t("ageYearsPlus") : `${book.ageGroup} ${t("ageYearsSuffix")}`}
          </Badge>
        </div>

        <p className="text-pretty text-sm text-muted-foreground line-clamp-2 mb-1">
          {description}
        </p>

        {/* CTA Button */}
        <Link href={`/books/${book.id}/view?example=1`} className="block mt-1">
          <Button
            className="w-full bg-gradient-to-r from-primary to-brand-2 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            size="sm"
          >
            <Eye className="mr-2 h-4 w-4" />
            {t("viewExample")}
          </Button>
        </Link>
      </div>

      {/* Decorative Corner Accent */}
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-primary/20 to-brand-2/20 blur-2xl transition-all group-hover:translate-x-8 group-hover:-translate-y-8" />
    </Card>
  )
}

