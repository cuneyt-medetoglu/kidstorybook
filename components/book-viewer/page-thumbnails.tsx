"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Page {
  pageNumber: number
  imageUrl: string
  text: string
}

interface PageThumbnailsProps {
  pages: Page[]
  currentPage: number
  onSelectPage: (page: number) => void
  onClose: () => void
}

export function PageThumbnails({ pages, currentPage, onSelectPage, onClose }: PageThumbnailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative mx-4 max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">All Pages</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" aria-label="Close thumbnails">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto pr-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {pages.map((page, index) => (
            <button
              key={page.pageNumber}
              onClick={() => onSelectPage(index)}
              className={cn(
                "group relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105",
                currentPage === index
                  ? "border-purple-500 ring-2 ring-purple-500/30"
                  : "border-transparent hover:border-purple-300",
              )}
            >
              <Image
                src={page.imageUrl || "https://via.placeholder.com/300x400"}
                alt={`Page ${page.pageNumber} thumbnail`}
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span
                className={cn(
                  "absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium text-white",
                  currentPage === index ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-black/50",
                )}
              >
                {page.pageNumber}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

