"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Sparkles, Star, BookOpen, Wand2, ArrowRight, Rocket, Fish, TreePine, Castle } from "lucide-react"
import Image from "next/image"

// Theme configurations
const themes = [
  {
    id: "space",
    name: "Space Adventure",
    icon: Rocket,
    gradient: "from-indigo-600 via-purple-600 to-blue-600",
    childPhoto: "/placeholder-child.jpg",
    characterArt: "/example-book-space.jpg",
    sparkleColors: ["#818cf8", "#c084fc", "#60a5fa"],
  },
  {
    id: "ocean",
    name: "Ocean Explorer",
    icon: Fish,
    gradient: "from-cyan-500 via-blue-500 to-teal-500",
    childPhoto: "/placeholder-child.jpg",
    characterArt: "/example-book-ocean.jpg",
    sparkleColors: ["#06b6d4", "#3b82f6", "#14b8a6"],
  },
  {
    id: "forest",
    name: "Forest Journey",
    icon: TreePine,
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    childPhoto: "/placeholder-child.jpg",
    characterArt: "/example-book-forest.jpg",
    sparkleColors: ["#10b981", "#22c55e", "#84cc16"],
  },
  {
    id: "castle",
    name: "Magical Castle",
    icon: Castle,
    gradient: "from-pink-500 via-purple-500 to-rose-500",
    childPhoto: "/placeholder-child.jpg",
    characterArt: "/example-book-castle.jpg",
    sparkleColors: ["#ec4899", "#a855f7", "#f43f5e"],
  },
]

// Floating magical particles
function MagicalParticles({ colors }: { colors: string[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: "50%",
            y: "50%",
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut",
          }}
        >
          {i % 3 === 0 ? (
            <Star className="h-3 w-3 text-yellow-400 drop-shadow-lg" fill="currentColor" />
          ) : i % 3 === 1 ? (
            <Sparkles className="h-4 w-4 text-white drop-shadow-lg" />
          ) : (
            <div
              className="h-2 w-2 rounded-full shadow-lg"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Transformation arrow with magic effect
function MagicArrow() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1, duration: 0.8, type: "spring" }}
      className="relative z-20 flex items-center justify-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-3 shadow-2xl md:p-4"
      >
        <Wand2 className="h-5 w-5 text-white md:h-6 md:w-6" />
      </motion.div>

      {/* Sparkle effect around arrow */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          style={{
            left: `${50 + 30 * Math.cos((i * Math.PI) / 3)}%`,
            top: `${50 + 30 * Math.sin((i * Math.PI) / 3)}%`,
          }}
        >
          <Sparkles className="h-3 w-3 text-yellow-400" />
        </motion.div>
      ))}
    </motion.div>
  )
}

export function HeroBookTransformation() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const [showTransformation, setShowTransformation] = useState(false)

  const currentTheme = themes[currentThemeIndex]
  const Icon = currentTheme.icon

  // Auto-advance themes and trigger transformation
  useEffect(() => {
    // Start transformation after initial load
    const transformTimer = setTimeout(() => {
      setShowTransformation(true)
    }, 500)

    // Auto-cycle through themes
    const themeInterval = setInterval(() => {
      setShowTransformation(false)
      setTimeout(() => {
        setCurrentThemeIndex((prev) => (prev + 1) % themes.length)
        setShowTransformation(true)
      }, 800)
    }, 6000)

    return () => {
      clearTimeout(transformTimer)
      clearInterval(themeInterval)
    }
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-center md:mb-6"
      >
        <h3 className="flex items-center justify-center gap-2 text-xl font-bold text-gray-800 dark:text-white md:text-2xl">
          <Wand2 className="h-5 w-5 text-purple-500 md:h-6 md:w-6" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Child, The Hero
          </span>
          <Wand2 className="h-5 w-5 scale-x-[-1] text-pink-500 md:h-6 md:w-6" />
        </h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Watch the magic happen
        </motion.p>
      </motion.div>

      {/* Main Transformation Container */}
      <div className="relative w-full max-w-4xl">
        {/* Background glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r ${currentTheme.gradient} blur-3xl`}
        />

        {/* Theme indicator */}
        <motion.div
          key={currentTheme.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-3 flex items-center justify-center gap-2"
        >
          <div className={`rounded-full bg-gradient-to-r ${currentTheme.gradient} p-1.5 shadow-lg`}>
            <Icon className="h-3 w-3 text-white md:h-4 md:w-4" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 md:text-sm">
            {currentTheme.name}
          </span>
        </motion.div>

        {/* Transformation Grid: Photo → Character */}
        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          {/* Left: Real Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
          >
            <div className="group relative overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-2 ring-purple-200 dark:bg-slate-800 dark:ring-purple-800 md:p-3">
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-2 flex items-center justify-center gap-2"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Real Photo</span>
              </motion.div>

              {/* Photo frame */}
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600">
                <Image
                  src={currentTheme.childPhoto || "/placeholder.svg"}
                  alt="Child photo"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />

                {/* Polaroid-style bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 px-3 py-2 text-center dark:bg-slate-800/95">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Emma, Age 7</p>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute right-3 top-3 rounded-full bg-white/80 p-1.5 shadow-lg dark:bg-slate-700/80">
                <Star className="h-3 w-3 text-purple-500" fill="currentColor" />
              </div>
            </div>
          </motion.div>

          {/* Center: Magic Arrow (Hidden on mobile, shown on desktop) */}
          <div className="hidden md:flex md:items-center md:justify-center">
            <MagicArrow />
          </div>

          {/* Mobile Arrow (Shown between cards on mobile) */}
          <div className="flex items-center justify-center md:hidden">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-8 w-8 rotate-90 text-purple-500" strokeWidth={3} />
              </motion.div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Magic!</span>
            </motion.div>
          </div>

          {/* Right: Character Illustration */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTheme.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <div className="group relative overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-2 ring-pink-200 dark:bg-slate-800 dark:ring-pink-800 md:p-3">
                {/* Label */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-2 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-3 w-3 text-pink-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Story Character
                  </span>
                  <Sparkles className="h-3 w-3 text-pink-500" />
                </motion.div>

                {/* Character frame */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showTransformation ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-square overflow-hidden rounded-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient}`} />
                  <Image
                    src={currentTheme.characterArt || "/placeholder.svg"}
                    alt={`${currentTheme.name} character`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />

                  {/* Theme badge at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 px-3 py-2 text-center dark:bg-slate-800/95">
                    <div className="flex items-center justify-center gap-1.5">
                      <Icon className="h-3 w-3 text-purple-600" />
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {currentTheme.name}
                      </p>
                    </div>
                  </div>

                  {/* Magical particles overlay */}
                  <MagicalParticles colors={currentTheme.sparkleColors} />
                </motion.div>

                {/* Corner decoration */}
                <div className="absolute left-3 top-3 rounded-full bg-white/80 p-1.5 shadow-lg dark:bg-slate-700/80">
                  <Sparkles className="h-3 w-3 text-pink-500" />
                </div>

                {/* Pulsing glow effect */}
                <motion.div
                  animate={{
                    opacity: [0, 0.5, 0],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} blur-xl`}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Theme selector dots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-4 flex justify-center gap-2 md:mt-6"
        >
          {themes.map((theme, index) => (
            <motion.button
              key={theme.id}
              onClick={() => {
                setShowTransformation(false)
                setTimeout(() => {
                  setCurrentThemeIndex(index)
                  setShowTransformation(true)
                }, 300)
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                index === currentThemeIndex
                  ? `bg-gradient-to-r ${theme.gradient} shadow-lg ring-2 ring-white dark:ring-slate-800`
                  : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
              }`}
              aria-label={`Switch to ${theme.name}`}
            />
          ))}
        </motion.div>
      </div>

      {/* Stat badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-6 flex flex-wrap justify-center gap-2 md:mt-8 md:gap-3"
      >
        {[
          { label: "24 Pages", icon: BookOpen },
          { label: "AI Powered", icon: Sparkles },
          { label: "100% Personalized", icon: Star },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md backdrop-blur-sm ring-1 ring-gray-200 dark:bg-slate-800/90 dark:text-gray-200 dark:ring-slate-700 md:px-4 md:py-2"
          >
            <stat.icon className="h-3.5 w-3.5 text-purple-500 md:h-4 md:w-4" />
            <span className="whitespace-nowrap">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
