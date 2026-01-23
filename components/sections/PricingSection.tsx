"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Star, Download, BookOpen, Truck } from "lucide-react"

const pricingPlans = [
  {
    id: "ebook",
    name: "E-Book",
    subtitle: "Digital",
    price: "$7.99",
    priceAlt: "₺250-300",
    popular: false,
    icon: Download,
    features: [
      "Instant download (2 hours)",
      "PDF format",
      "Unlimited downloads",
      "High-quality illustrations",
      "Personalized story",
      "Share with family",
    ],
    cta: "Get Started",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "printed",
    name: "Printed Book",
    subtitle: "Physical",
    price: "$34.99",
    priceAlt: "₺1,000-1,200",
    popular: true,
    icon: BookOpen,
    features: [
      "Hardcover book",
      "A4 format (21x29.7 cm)",
      "High-quality printing",
      "3-5 weeks delivery",
      "Free shipping",
      "Includes e-book version",
    ],
    cta: "Order Now",
    gradient: "from-purple-500 to-pink-500",
  },
]

export function PricingSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white py-16 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 md:py-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-500/10" />
        <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-500/10" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold leading-normal pb-1 text-transparent dark:from-purple-400 dark:to-pink-400 md:text-5xl md:leading-normal">
            Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Choose the perfect option for your child
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  className="absolute -top-4 left-1/2 z-10 -translate-x-1/2"
                >
                  <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                    <Star className="h-4 w-4 fill-current" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              {/* Card */}
              <div
                className={`relative h-full rounded-3xl bg-white p-8 shadow-xl transition-shadow duration-300 hover:shadow-2xl dark:bg-slate-900 ${
                  plan.popular ? "border-2 border-purple-200 dark:border-purple-500/30" : ""
                }`}
              >
                {/* Plan icon */}
                <div className="mb-6 flex items-center justify-center">
                  <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-4 dark:from-purple-900/30 dark:to-pink-900/30">
                    <plan.icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>

                {/* Plan name */}
                <div className="mb-2 text-center">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{plan.subtitle}</p>
                </div>

                {/* Price */}
                <div className="mb-6 text-center">
                  <div className="mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-5xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400">
                    {plan.price}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{plan.priceAlt}</p>
                </div>

                {/* Features list */}
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1 + featureIndex * 0.05,
                      }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-purple-600 dark:to-pink-600"
                >
                  {plan.cta}
                </Button>

                {/* Free shipping badge for printed book */}
                {plan.id === "printed" && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping included</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Secure payment • Money-back guarantee • Trusted by thousands of parents
          </p>
        </motion.div>
      </div>
    </section>
  )
}

