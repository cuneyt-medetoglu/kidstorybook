"use client"

import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { splitStoryText } from "@/lib/utils/story-text"

/* ────────────────────────────────────────────────────────── */
/*  Types                                                      */
/* ────────────────────────────────────────────────────────── */

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

/* ────────────────────────────────────────────────────────── */
/*  Background pattern path — matches PDF export SVG          */
/* ────────────────────────────────────────────────────────── */

const TEXT_BG_SVG = "/pdf-backgrounds/yildizli-kiyi-p48.svg"

/* ────────────────────────────────────────────────────────── */
/*  StoryTextPanel — reusable decorated text block            */
/* ────────────────────────────────────────────────────────── */

function StoryTextPanel({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const paragraphs = useMemo(() => splitStoryText(text), [text])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Decorative background — same SVG used in PDF export */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.30] dark:opacity-[0.10]"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={TEXT_BG_SVG}
          alt=""
          className="h-full w-full object-cover dark:brightness-150 dark:contrast-75"
          draggable={false}
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 py-4 md:px-8 md:py-6">
        <div className="flex max-w-[38ch] flex-col items-center gap-3">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-center font-story text-lg leading-[1.85] text-foreground md:text-xl lg:text-2xl"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  ImageWithSkeleton — lazy-load shimmer for page images     */
/* ────────────────────────────────────────────────────────── */

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

/* ────────────────────────────────────────────────────────── */
/*  BookPage — main export                                     */
/* ────────────────────────────────────────────────────────── */

export function BookPage({
  page,
  isLandscape,
  mobileLayoutMode = "stacked",
  showTextOnMobile = false,
  onToggleFlip,
}: BookPageProps) {
  /* ── Landscape: image left, text right ── */
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
        <div className="flex h-full w-1/2 flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800">
          <span className="px-8 pt-6 text-sm font-medium text-primary">
            Page {page.pageNumber}
          </span>
          <StoryTextPanel
            text={page.text}
            className="flex-1"
          />
        </div>
      </>
    )
  }

  /* ── Portrait: flip mode ── */
  if (mobileLayoutMode === "flip") {
    return (
      <div className="relative flex h-full w-full max-w-[800px] flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800">
        <div className="absolute left-3 top-3 z-20">
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
              className="relative w-full flex-1 cursor-pointer overflow-hidden bg-white dark:bg-slate-800"
              onClick={(e) => { e.stopPropagation(); onToggleFlip?.() }}
            >
              <ImageWithSkeleton
                src={page.imageUrl}
                alt={`Page ${page.pageNumber} illustration`}
                sizes="100vw"
                className="object-contain"
              />
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 transform">
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
              className="flex w-full flex-1 flex-col"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onToggleFlip?.() }}
              >
                <StoryTextPanel
                  text={page.text}
                  className="h-full"
                />
              </div>
              <div className="flex items-center justify-center pb-6">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFlip?.() }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand-2 px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
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

  /* ── Portrait: stacked layout (default) ── */
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
      <StoryTextPanel
        text={page.text}
        className="flex-1"
      />
    </div>
  )
}
