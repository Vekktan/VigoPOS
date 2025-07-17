"use client"

import { useState, useCallback } from "react"
import type { Order, CartItem } from "../../../shared/types"
import { orderApi } from "../services/orderApi"

export const useOrder = () => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = useCallback(
    async (items: CartItem[], tableNumber?: number, customerName?: string, notes?: string) => {
      setLoading(true)
      setError(null)

      try {
        const order = await orderApi.createOrder({
          items,
          tableNumber,
          customerName,
          notes,
        })

        setCurrentOrder(order)
        return order
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create order"
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const getOrderStatus = useCallback(async (orderId: string) => {
    setLoading(true)
    setError(null)

    try {
      const order = await orderApi.getOrder(orderId)
      setCurrentOrder(order)
      return order
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get order status"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    currentOrder,
    loading,
    error,
    createOrder,
    getOrderStatus,
  }
}
