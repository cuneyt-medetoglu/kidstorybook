"use client"

import { motion } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

// Pricing page specific FAQs
const pricingFAQs: FAQItem[] = [
  {
    question: "What is included in the E-Book?",
    answer:
      "Each E-Book includes a 12-page personalized story with high-quality illustrations, custom character names, and your child as the main character. You'll receive a PDF file that can be downloaded and shared unlimited times.",
  },
  {
    question: "Can I convert my E-Book to hardcover later?",
    answer:
      "Yes! You can easily convert your E-Book to a beautiful hardcover printed book at any time from your My Library section. You'll keep all your personalization and can order physical copies whenever you'd like.",
  },
  {
    question: "How long does it take to receive my E-Book?",
    answer:
      "Your personalized E-Book will be ready in approximately 2 hours after you complete your order. You'll receive an email notification with a download link as soon as it's ready.",
  },
  {
    question: "Can I edit my book after purchase?",
    answer:
      "Yes, you can make changes to your book's personalization from your My Library section. Any edits will generate a new version of your E-Book with the updated information.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "We offer a 100% money-back guarantee within 30 days of purchase if you're not completely satisfied with your E-Book. Simply contact our support team to request a refund.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) and secure payment processing through Stripe. All transactions are encrypted and secure.",
  },
  {
    question: "Is the price the same in all countries?",
    answer:
      "Our prices are automatically adjusted based on your location to show the local currency. The actual value remains equivalent across all regions.",
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

export function PricingFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="container relative mx-auto px-4 md:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Everything you need to know about our E-Books
          </p>
        </div>

        <div className="space-y-4">
          {pricingFAQs.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
