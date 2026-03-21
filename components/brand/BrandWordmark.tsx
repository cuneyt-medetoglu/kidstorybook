import { cn } from "@/lib/utils"

/** brand.png wordmark renkleri — UI metin; OG için brand.png ayrı kalır */
const heroStory = "text-[#29b5a8] dark:text-[#3ecec0]"
const kid = "text-[#1ba8e0] dark:text-[#38c2f0]"

const sizeClasses = {
  /** Mobil şeritte daha okunaklı */
  header: "text-xl sm:text-xl md:text-xl lg:text-2xl",
  /** xl altında dikey blokta büyük wordmark; geniş masaüstünde biraz kompakt */
  footer: "text-xl leading-none sm:text-2xl xl:text-[1.625rem]",
  /** Mobil menü üstü — header ile uyumlu */
  drawer: "text-xl sm:text-2xl",
}

type BrandWordmarkProps = {
  size?: keyof typeof sizeClasses
  className?: string
}

export function BrandWordmark({ size = "header", className }: BrandWordmarkProps) {
  return (
    <span className={cn("font-bold leading-none tracking-tight", sizeClasses[size], className)}>
      <span className={heroStory}>Hero</span>
      <span className={kid}>Kid</span>
      <span className={heroStory}>Story</span>
    </span>
  )
}
