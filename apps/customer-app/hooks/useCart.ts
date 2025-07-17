"use client"

import { useState, useCallback } from "react"
import type { CartItem, MenuItem } from "../../../shared/types"

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((menuItem: MenuItem, quantity = 1, notes?: string) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === menuItem.id)

      if (existingItem) {
        return prev.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + quantity, notes } : item,
        )
      }

      return [...prev, { ...menuItem, quantity, notes }]
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId)
        return
      }

      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItems,
  }
}
