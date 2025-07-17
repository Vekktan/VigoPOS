import express from "express"
import { v4 as uuidv4 } from "uuid"
import type { Server as SocketIOServer } from "socket.io"
import { orders } from "../data/mockData"
import type { PaymentInfo } from "../../../shared/types"

export const paymentRoutes = (io: SocketIOServer) => {
  const router = express.Router()

  // POST /api/payments/process - Process payment
  router.post("/process", async (req, res) => {
    const { orderId, method, amount } = req.body

    // Find the order
    const orderIndex = orders.findIndex((order) => order.id === orderId)

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      })
    }

    const order = orders[orderIndex]

    // Validate amount
    if (amount !== order.totalAmount) {
      return res.status(400).json({
        success: false,
        error: "Payment amount does not match order total",
      })
    }

    // Simulate payment processing
    const paymentInfo: PaymentInfo = {
      orderId,
      amount,
      method,
      status: "processing",
      transactionId: `TXN-${Date.now()}-${uuidv4().slice(0, 8)}`,
    }

    // Simulate processing delay
    setTimeout(() => {
      // Simulate payment success (90% success rate)
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        paymentInfo.status = "completed"
        orders[orderIndex].paymentStatus = "paid"
        orders[orderIndex].paymentMethod = method

        // Emit payment success
        io.emit("payment:completed", paymentInfo)
        io.emit("order:updated", orders[orderIndex])
      } else {
        paymentInfo.status = "failed"
        orders[orderIndex].paymentStatus = "failed"

        // Emit payment failure
        io.emit("payment:failed", paymentInfo)
      }
    }, 2000) // 2 second delay

    res.json({
      success: true,
      data: paymentInfo,
      message: "Payment processing initiated",
    })
  })

  // GET /api/payments/:transactionId - Get payment status
  router.get("/:transactionId", (req, res) => {
    const { transactionId } = req.params

    // In a real app, you'd query the payment database
    // For now, we'll simulate based on the transaction ID format
    const isCompleted = transactionId.includes("TXN-")

    const paymentInfo: PaymentInfo = {
      orderId: "mock-order-id",
      amount: 25000,
      method: "qris",
      status: isCompleted ? "completed" : "pending",
      transactionId,
    }

    res.json({
      success: true,
      data: paymentInfo,
    })
  })

  // POST /api/payments/refund - Process refund
  router.post("/refund", (req, res) => {
    const { orderId, amount, reason } = req.body

    const orderIndex = orders.findIndex((order) => order.id === orderId)

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      })
    }

    // Update order status
    orders[orderIndex].status = "cancelled"
    orders[orderIndex].paymentStatus = "failed"

    const refundInfo = {
      orderId,
      amount,
      reason,
      refundId: `REF-${Date.now()}-${uuidv4().slice(0, 8)}`,
      status: "completed",
      processedAt: new Date(),
    }

    // Emit refund event
    io.emit("payment:refunded", refundInfo)
    io.emit("order:updated", orders[orderIndex])

    res.json({
      success: true,
      data: refundInfo,
      message: "Refund processed successfully",
    })
  })

  return router
}
