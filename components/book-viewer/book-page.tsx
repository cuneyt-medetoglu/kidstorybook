"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface Page {
  pageNumber: number
  imageUrl: string
  text: string
}

interface BookPageProps {
  page: Page
  isLandscape: boolean
  mobileLayoutMode?: "stacked" | "flip"
  showTextOnMobile?: boolean
  onToggleFlip?: () => void
}

function ImageWithSkeleton({
  src,
  alt,
  className,
  sizes,
  skeletonClassName,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  skeletonClassName?: string
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [src])

  return (
    <>
      {!loaded && (
        <div
          className={cn(
            "absolute inset-0 animate-pulse bg-muted",
            skeletonClassName,
          )}
        />
      )}
      <Image
        src={src || "/ui/placeholder.svg"}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        priority
        unoptimized
        onLoad={() => setLoaded(true)}
      />
    </>
  )
}

export function BookPage({
  page,
  isLandscape,
  mobileLayoutMode = "stacked",
  showTextOnMobile = false,
  onToggleFlip,
}: BookPageProps) {
  if (isLandscape) {
    return (
      <>
        {/* Left: Image */}
        <div className="relative flex h-full w-1/2 items-center justify-center overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800">
          <ImageWithSkeleton
            src={page.imageUrl}
            alt={`Page ${page.pageNumber} illustration`}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        {/* Right: Text */}
        <div className="flex h-full w-1/2 flex-col justify-center overflow-hidden rounded-xl bg-white p-8 shadow-xl dark:bg-slate-800">
          <span className="mb-4 text-sm font-medium text-primary">Page {page.pageNumber}</span>
          <p className="text-lg leading-relaxed text-foreground md:text-xl lg:text-2xl">{page.text}</p>
        </div>
      </>
    )
  }

  // Portrait mode - flip layout
  if (mobileLayoutMode === "flip") {
    return (
      <div className="flex h-full w-full max-w-[800px] flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800 relative">
        <div className="absolute top-3 left-3 z-20">
          <span className="rounded-full bg-gradient-to-r from-primary to-brand-2 px-3 py-1 text-xs font-medium text-white">
            Page {page.pageNumber}
          </span>
        </div>
        <AnimatePresence mode="wait">
          {!showTextOnMobile ? (
            <motion.div
              key="image"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative flex-1 w-full overflow-hidden cursor-pointer bg-white dark:bg-slate-800"
              onClick={(e) => { e.stopPropagation(); onToggleFlip?.() }}
            >
              <ImageWithSkeleton
                src={page.imageUrl}
                alt={`Page ${page.pageNumber} illustration`}
                sizes="100vw"
                className="object-contain"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand-2 px-4 py-2 text-sm font-medium text-white shadow-lg">
                  <BookOpen className="h-4 w-4" />
                  Read
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-1 flex-col w-full"
            >
              <div
                className="flex flex-1 items-center justify-center p-6 md:p-8 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onToggleFlip?.() }}
              >
                <p className={cn("text-center text-lg leading-relaxed text-foreground", "md:text-xl lg:text-2xl")}>
                  {page.text}
                </p>
              </div>
              <div className="flex items-center justify-center pb-6">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFlip?.() }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand-2 px-4 py-2 text-sm font-medium text-white shadow-lg hover:scale-105 transition-transform"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Portrait mode - stacked layout (default)
  return (
    <div className="flex h-full w-full max-w-[800px] flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        <ImageWithSkeleton
          src={page.imageUrl}
          alt={`Page ${page.pageNumber} illustration`}
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
        />
        <div className="absolute bottom-3 left-3 z-10">
          <span className="rounded-full bg-gradient-to-r from-primary to-brand-2 px-3 py-1 text-xs font-medium text-white">
            Page {page.pageNumber}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-1 items-center justify-center p-4 md:p-6">
        <p className={cn("text-center text-base leading-relaxed text-foreground", "md:text-lg lg:text-xl")}>
          {page.text}
        </p>
      </div>
    </div>
  )
}
