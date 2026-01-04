"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Truck, Tag, Gift, ChevronLeft, ChevronRight } from "lucide-react"

const banners = [
  {
    id: 1,
    icon: Truck,
    title: "Free Shipping on All Printed Books",
    titleTR: "Tüm Basılı Kitaplarda Ücretsiz Kargo",
    description: "No minimum order required",
    cta: "Order Now",
    gradient: "from-purple-500 via-purple-600 to-pink-500",
    iconColor: "text-purple-200",
  },
  {
    id: 2,
    icon: Tag,
    title: "10% Off Your First Order",
    titleTR: "İlk Siparişinizde %10 İndirim",
    description: "Use code: FIRST10 at checkout",
    cta: "Get Started",
    gradient: "from-pink-500 via-rose-500 to-purple-500",
    iconColor: "text-pink-200",
  },
  {
    id: 3,
    icon: Gift,
    title: "Limited Time: Get E-Book + Printed Book Bundle",
    titleTR: "Sınırlı Süre: E-Kitap + Basılı Kitap Paketi",
    description: "Save 15% on combo packages",
    cta: "View Offer",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    iconColor: "text-violet-200",
  },
]

export function CampaignBanners() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const currentBanner = banners[currentIndex]
  const Icon = currentBanner.icon

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative max-w-5xl mx-auto">
            {/* Banner Content */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBanner.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`bg-gradient-to-r ${currentBanner.gradient} p-8 md:p-12`}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Icon and Text */}
                    <div className="flex items-center gap-6 text-white flex-1">
                      {/* Animated Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="hidden md:block"
                      >
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                          <Icon className={`h-12 w-12 ${currentBanner.iconColor}`} />
                        </div>
                      </motion.div>

                      {/* Text Content */}
                      <div className="text-center md:text-left">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Icon className={`h-8 w-8 ${currentBanner.iconColor} mx-auto md:hidden mb-3`} />
                          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-balance">
                            {currentBanner.title}
                          </h3>
                          <p className="text-white/90 text-sm md:text-base">{currentBanner.description}</p>
                        </motion.div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="bg-white text-purple-600 hover:bg-white/90 shadow-xl font-semibold px-8 py-6 text-lg rounded-full"
                      >
                        {currentBanner.cta}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Next banner"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                      : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

