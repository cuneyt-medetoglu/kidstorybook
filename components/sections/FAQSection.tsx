"use client"

import { motion } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

interface FAQItem {
  question: string
  answer: string
}

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
          <ChevronDown className="h-5 w-5 text-primary" />
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

const FAQ_COUNT = 10

export function FAQSection() {
  const t = useTranslations("faq")
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`q${i}`),
    answer: t(`a${i}`),
  }))

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-primary/5 to-white py-20 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 md:py-32">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-primary to-brand-2 blur-3xl opacity-10"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-brand-2 to-primary blur-3xl opacity-10"
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
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand-2 px-4 py-2 text-sm font-semibold text-white shadow-lg"
          >
            <HelpCircle className="h-4 w-4" />
            FAQ
          </motion.div>

          <h2 className="mb-4 text-balance text-3xl font-bold text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-slate-600 dark:text-slate-300">
            {t("subtitle")}
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
          <p className="mb-4 text-lg text-slate-600 dark:text-slate-300">
            {t("stillHaveQuestions")}
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand-2 px-8 py-4 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
          >
            {t("contactUs")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
