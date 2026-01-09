"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface Page {
  pageNumber: number
  imageUrl: string
  text: string
}

interface BookPageProps {
  page: Page
  isLandscape: boolean
}

export function BookPage({ page, isLandscape }: BookPageProps) {
  if (isLandscape) {
    return (
      <>
        {/* Left: Image */}
        <div className="relative flex h-full w-1/2 items-center justify-center overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800">
          <Image
            src={page.imageUrl || "https://via.placeholder.com/800x600"}
            alt={`Page ${page.pageNumber} illustration`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Right: Text */}
        <div className="flex h-full w-1/2 flex-col justify-center overflow-hidden rounded-xl bg-white p-8 shadow-xl dark:bg-slate-800">
          <span className="mb-4 text-sm font-medium text-purple-500">Page {page.pageNumber}</span>
          <p className="text-lg leading-relaxed text-foreground md:text-xl lg:text-2xl">{page.text}</p>
        </div>
      </>
    )
  }

  // Portrait mode - stacked layout
  return (
    <div className="flex h-full w-full max-w-[800px] flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        <Image
          src={page.imageUrl || "/placeholder.svg"}
          alt={`Page ${page.pageNumber} illustration`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-medium text-white">
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

