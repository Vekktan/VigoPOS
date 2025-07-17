"use client"

import { useState, useEffect, useCallback } from "react"
import type { KitchenOrder } from "../../../shared/types"
import { kitchenApi } from "../services/kitchenApi"
import { createSocketClient } from "../../../packages/socket-client"

export const useKitchenOrders = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const socketClient = createSocketClient(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000")

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const ordersData = await kitchenApi.getKitchenOrders()
      setOrders(ordersData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load kitchen orders"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOrderStatus = useCallback(
    async (orderId: string, status: KitchenOrder["status"]) => {
      try {
        await kitchenApi.updateOrderStatus(orderId, status)

        // Update local state optimistically
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  startTime: status === "preparing" ? new Date() : order.startTime,
                  completedTime: status === "ready" ? new Date() : order.completedTime,
                }
              : order,
          ),
        )

        // Emit socket event
        if (socketClient.isConnected) {
          socketClient.emit("kitchen:update-status", { orderId, status })
        }
      } catch (err) {
        console.error("Failed to update order status:", err)
      }
    },
    [socketClient],
  )

  useEffect(() => {
    loadOrders()

    // Setup socket connection
    socketClient.connect().then(() => {
      socketClient.emit("join-room", "kitchen")

      // Listen for new orders
      socketClient.on("kitchen:new-order", (order: KitchenOrder) => {
        setOrders((prev) => [order, ...prev])
      })

      // Listen for order updates
      socketClient.on("kitchen:order-updated", (order: KitchenOrder) => {
        setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)))
      })
    })

    return () => {
      socketClient.disconnect()
    }
  }, [loadOrders, socketClient])

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refreshOrders: loadOrders,
  }
}
