"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  ShoppingCart,
  ChevronDown,
  Home,
  BookOpen,
  Tag,
  Info,
  X,
  Sun,
  Moon,
} from "lucide-react"
import Link from "next/link"

const countries = [
  { code: "US", flag: "🇺🇸", currency: "USD" },
  { code: "TR", flag: "🇹🇷", currency: "TRY" },
  { code: "GB", flag: "🇬🇧", currency: "GBP" },
  { code: "EU", flag: "🇪🇺", currency: "EUR" },
]

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Examples", href: "/examples", icon: BookOpen },
  { label: "Pricing", href: "/pricing", icon: Tag },
  { label: "About", href: "/about", icon: Info },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [cartCount, setCartCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [prevCartCount, setPrevCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Simulate cart count change for demo
  useEffect(() => {
    if (cartCount !== prevCartCount) {
      setPrevCartCount(cartCount)
    }
  }, [cartCount, prevCartCount])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md backdrop-blur-sm dark:bg-slate-900/95"
          : "bg-white dark:bg-slate-900"
      }`}
    >
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/">
          <motion.div
            className="text-2xl font-bold md:text-3xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
              KidStoryBook
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={link.href}>
                <motion.span
                  className="text-sm font-medium text-gray-800 transition-colors hover:text-purple-500 dark:text-slate-100 dark:hover:text-purple-400 lg:text-base"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {link.label}
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Country/Currency Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden gap-1 text-sm md:flex"
              >
                <span>{selectedCountry.flag}</span>
                <span className="font-medium">{selectedCountry.currency}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {countries.map((country) => (
                <DropdownMenuItem
                  key={country.code}
                  onClick={() => setSelectedCountry(country)}
                  className="cursor-pointer gap-2"
                >
                  <span>{country.flag}</span>
                  <span>{country.currency}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Shopping Cart */}
          <motion.button
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCartCount((prev) => prev + 1)}
          >
            <ShoppingCart className="h-6 w-6 text-gray-800 dark:text-slate-100" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-white dark:bg-orange-300"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Theme Toggle */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 text-gray-800 dark:text-slate-100"
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          )}

          {/* CTA Button - Desktop */}
          <motion.div
            className="hidden md:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400">
              Create a children's book
            </Button>
          </motion.div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] rounded-l-3xl border-l-0 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-md dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900"
            >
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-col"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400">
                    KidStoryBook
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-8 w-8 rounded-full hover:bg-purple-100 dark:hover:bg-slate-700"
                  >
                    <X className="h-5 w-5 text-gray-800 dark:text-slate-100" />
                  </Button>
                </div>

                <nav className="flex flex-col gap-2">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-white/60 dark:hover:bg-slate-800/60"
                        >
                          <Icon className="h-5 w-5 text-purple-500 transition-transform group-hover:scale-110 dark:text-purple-400" />
                          <span className="text-base font-medium text-gray-800 dark:text-slate-100">
                            {link.label}
                          </span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>

                <div className="mt-auto space-y-4 border-t border-gray-200 pt-6 dark:border-slate-700">
                  {/* Shopping Cart Display */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between rounded-xl bg-white/60 px-4 py-3 dark:bg-slate-800/60"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-slate-100">
                      Shopping Cart
                    </span>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-white dark:bg-orange-300">
                        {cartCount}
                      </span>
                    </div>
                  </motion.div>

                  {/* Country Selector */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-white/60 backdrop-blur-sm dark:bg-slate-800/60"
                        >
                          <span className="flex items-center gap-2">
                            <span>{selectedCountry.flag}</span>
                            <span className="font-medium">
                              {selectedCountry.currency}
                            </span>
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[272px]">
                        {countries.map((country) => (
                          <DropdownMenuItem
                            key={country.code}
                            onClick={() => setSelectedCountry(country)}
                            className="cursor-pointer gap-2"
                          >
                            <span>{country.flag}</span>
                            <span>{country.currency}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>

                  {/* Theme Toggle - Mobile */}
                  {mounted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-white/60 backdrop-blur-sm dark:bg-slate-800/60"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      >
                        <span className="flex items-center gap-2">
                          {theme === "dark" ? (
                            <Sun className="h-4 w-4" />
                          ) : (
                            <Moon className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                          </span>
                        </span>
                      </Button>
                    </motion.div>
                  )}

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400">
                      Create a children's book
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  )
}

