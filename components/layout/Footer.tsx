"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  ArrowUp,
} from "lucide-react"
import Link from "next/link"

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter/X" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
]

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Examples", href: "/examples" },
  { label: "Pricing", href: "/pricing" },
]

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
]

/** Buton sadece sayfa en alttan bu kadar px içerideyken gösterilir (en altlara gelince çıkar) */
const SCROLL_TOP_SHOW_WHEN_PX_FROM_BOTTOM = 400

export function Footer() {
  const [email, setEmail] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return
      const { scrollY, innerHeight } = window
      const scrollHeight = document.documentElement.scrollHeight
      const isScrollable = scrollHeight > innerHeight
      const nearBottom =
        scrollY + innerHeight >= scrollHeight - SCROLL_TOP_SHOW_WHEN_PX_FROM_BOTTOM
      setShowScrollTop(Boolean(isScrollable && nearBottom))
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-b from-white via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-12">
          {/* Column 1: Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Link href="/">
              <h3 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400">
                KidStoryBook
              </h3>
            </Link>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Creating magical personalized storybooks that inspire imagination
              and wonder in every child.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:from-purple-400 dark:hover:to-pink-400"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="group relative inline-block text-sm text-gray-600 transition-colors hover:text-purple-500 dark:text-slate-400 dark:hover:text-purple-400"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full dark:from-purple-400 dark:to-pink-400"></span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="group relative inline-block text-sm text-gray-600 transition-colors hover:text-purple-500 dark:text-slate-400 dark:hover:text-purple-400"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full dark:from-purple-400 dark:to-pink-400"></span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Newsletter
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Subscribe to get special offers and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 focus:border-purple-500 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800/50"
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white shadow-md transition-all hover:shadow-lg dark:from-purple-400 dark:to-pink-400"
                >
                  Subscribe
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-slate-700"
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          {/* Copyright */}
          <p className="text-center text-sm text-gray-600 dark:text-slate-400">
            © {new Date().getFullYear()} KidStoryBook. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 transition-colors hover:text-purple-500 dark:text-slate-400 dark:hover:text-purple-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button - only visible when near bottom (≈400px from bottom); hides at top */}
      <motion.button
        onClick={scrollToTop}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        whileHover={showScrollTop ? { scale: 1.1 } : undefined}
        whileTap={showScrollTop ? { scale: 0.9 } : undefined}
        className={`fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all hover:shadow-xl dark:from-purple-400 dark:to-pink-400 ${!showScrollTop ? "pointer-events-none" : ""}`}
        aria-label="Scroll to top"
        aria-hidden={!showScrollTop}
        tabIndex={showScrollTop ? 0 : -1}
      >
        <ArrowUp className="h-6 w-6" />
      </motion.button>
    </motion.footer>
  )
}

