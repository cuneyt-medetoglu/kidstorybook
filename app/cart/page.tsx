"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingCart, Check, ArrowRight, ArrowLeft } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function CartPage() {
  const router = useRouter()
  const { items, removeFromCart, getCartTotal, isLoading } = useCart()
  const total = getCartTotal()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Review your hardcover book selections
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <ShoppingCart className="mb-4 h-16 w-16 text-slate-400 dark:text-slate-600" />
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              Your cart is empty
            </h3>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              Add books from My Library to get started
            </p>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={() => router.push("/dashboard")}
            >
              Go to My Library
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="mb-4">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex gap-4">
                          {/* Book Cover */}
                          <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted md:h-40 md:w-28">
                            {item.coverImage ? (
                              <Image
                                src={item.coverImage}
                                alt={item.bookTitle}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-700">
                                <ShoppingCart className="h-8 w-8 text-slate-400" />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white md:text-xl">
                              {item.bookTitle}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              Hardcover Book
                            </p>
                            <p className="mt-2 text-xl font-bold text-purple-600 dark:text-purple-400">
                              ${item.price.toFixed(2)}
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="ml-2 hidden md:inline">Remove</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
                <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                  Order Summary
                </h3>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Shipping
                    </span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="mb-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  disabled={items.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:from-purple-600 dark:to-pink-600"
                  onClick={() => {
                    // TODO: Navigate to checkout page (to be implemented)
                    router.push("/checkout")
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
