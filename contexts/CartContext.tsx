"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface CartItem {
  id: string // Unique cart item ID
  type: "hardcopy"
  bookId: string
  bookTitle: string
  coverImage: string
  price: number // $34.99
  quantity: number // Always 1 for hardcopy
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, "id">) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "kidstorybook_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setItems(parsed)
      }
    } catch (error) {
      console.error("[Cart] Error loading cart from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error("[Cart] Error saving cart to localStorage:", error)
      }
    }
  }, [items, isLoading])

  const addToCart = useCallback((item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // Check if item already exists (same bookId and type)
      const existingIndex = prev.findIndex(
        (i) => i.bookId === item.bookId && i.type === item.type
      )

      if (existingIndex >= 0) {
        // Item already exists, don't add duplicate
        return prev
      }

      // Generate unique ID for cart item
      const newItem: CartItem = {
        ...item,
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      return [...prev, newItem]
    })
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }, [])

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [items])

  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
