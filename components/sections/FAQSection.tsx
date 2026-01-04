"use client"

import { motion } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How does it work?",
    answer:
      "It's simple! Upload your child's photo, choose a theme and style, and our AI creates a personalized storybook. You can download it as an e-book or order a printed hardcover version.",
  },
  {
    question: "How long does it take to create a book?",
    answer: "E-books are ready within 2 hours. Printed books take 3-5 weeks for printing and delivery.",
  },
  {
    question: "Can I customize the story?",
    answer:
      "Yes! You can choose from various themes (adventure, fairy tale, science fiction, etc.) and select your child's age group. The AI tailors the story accordingly.",
  },
  {
    question: "What age groups are supported?",
    answer:
      "Our books are designed for children aged 0-2, 3-5, 6-9, and 10+ years. The content and complexity are adjusted based on the selected age group.",
  },
  {
    question: "Can I use multiple photos?",
    answer:
      "Yes, you can upload up to 5 character photos per book. These can include your child, family members, pets, or toys.",
  },
  {
    question: "What formats are available?",
    answer:
      "E-books are available as PDF files for instant download. Printed books come as hardcover, A4 format (21x29.7 cm) with high-quality printing.",
  },
  {
    question: "Is my child's photo secure?",
    answer:
      "We use secure encryption and follow strict privacy policies. Your photos are used solely for creating your personalized book and are not shared with third parties.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes, we offer a money-back guarantee. If you're not satisfied with your e-book, contact us within 30 days for a full refund.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship printed books to over 26 countries worldwide. Shipping times vary by location (typically 3-5 weeks).",
  },
  {
    question: "Can I order multiple copies?",
    answer: "Yes! You can order multiple copies of the same book. We offer discounts for orders of 3 or more books.",
  },
]

const FAQAccordionItem = ({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  index: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-bold text-slate-900 dark:text-white">{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-purple-500" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="border-t border-slate-200 px-6 pb-6 pt-4 dark:border-slate-700">
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white py-20 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950 md:py-32">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 blur-3xl"
        />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
          >
            <HelpCircle className="h-4 w-4" />
            FAQ
          </motion.div>

          <h2 className="mb-4 text-balance text-3xl font-bold text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-slate-600 dark:text-slate-300">
            Everything you need to know about KidStoryBook
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-lg text-slate-600 dark:text-slate-300">Still have questions?</p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

