"use client"

import { useState, useEffect, useCallback } from "react"
import type { Order } from "../../../shared/types"
import { posApi } from "../services/posApi"
import { useSocket } from "./useSocket"

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { socket } = useSocket()

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const ordersData = await posApi.getOrders()
      setOrders(ordersData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load orders"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOrderStatus = useCallback(
    async (orderId: string, status: Order["status"]) => {
      try {
        const updatedOrder = await posApi.updateOrderStatus(orderId, status)
        setOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)))

        // Emit socket event
        if (socket) {
          socket.emit("order:status-changed", { orderId, status })
        }
      } catch (err) {
        console.error("Failed to update order status:", err)
      }
    },
    [socket],
  )

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Listen for real-time order updates
  useEffect(() => {
    if (!socket) return

    const handleNewOrder = (order: Order) => {
      setOrders((prev) => [order, ...prev])
    }

    const handleOrderUpdate = (order: Order) => {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)))
    }

    socket.on("order:created", handleNewOrder)
    socket.on("order:updated", handleOrderUpdate)

    return () => {
      socket.off("order:created", handleNewOrder)
      socket.off("order:updated", handleOrderUpdate)
    }
  }, [socket])

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refreshOrders: loadOrders,
  }
}
