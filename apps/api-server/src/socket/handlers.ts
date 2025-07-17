import type { Server as SocketIOServer, Socket } from "socket.io"
import { orders, kitchenOrders } from "../data/mockData"

export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Join room based on app type
    socket.on("join-room", (room: string) => {
      socket.join(room)
      console.log(`Client ${socket.id} joined room: ${room}`)
    })

    // Handle order status updates from kitchen
    socket.on("kitchen:update-status", (data: { orderId: string; status: string }) => {
      const { orderId, status } = data

      // Update order status
      const orderIndex = orders.findIndex((order) => order.id === orderId)
      if (orderIndex !== -1) {
        orders[orderIndex].status = status as any

        // Broadcast to all clients
        io.emit("order:status-changed", { orderId, status, order: orders[orderIndex] })
      }

      // Update kitchen order
      const kitchenOrderIndex = kitchenOrders.findIndex((order) => order.id === orderId)
      if (kitchenOrderIndex !== -1) {
        kitchenOrders[kitchenOrderIndex].status = status as any

        if (status === "preparing") {
          kitchenOrders[kitchenOrderIndex].startTime = new Date()
        } else if (status === "ready") {
          kitchenOrders[kitchenOrderIndex].completedTime = new Date()

          // Notify waitress app
          io.to("waitress").emit("order:ready", kitchenOrders[kitchenOrderIndex])
        }

        // Broadcast to kitchen clients
        io.to("kitchen").emit("kitchen:order-updated", kitchenOrders[kitchenOrderIndex])
      }
    })

    // Handle cashier actions
    socket.on("cashier:send-to-kitchen", (orderId: string) => {
      const order = orders.find((o) => o.id === orderId)
      if (order) {
        const kitchenOrder = {
          ...order,
          priority: "normal" as const,
          assignedChef: `Chef ${Math.floor(Math.random() * 3) + 1}`,
        }

        kitchenOrders.unshift(kitchenOrder)

        // Notify kitchen
        io.to("kitchen").emit("kitchen:new-order", kitchenOrder)
      }
    })

    // Handle notifications
    socket.on("send-notification", (notification: { type: string; message: string; target?: string }) => {
      if (notification.target) {
        io.to(notification.target).emit("notification", notification)
      } else {
        io.emit("notification", notification)
      }
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`)
    })

    // Send initial data on connection
    socket.emit("connection-established", {
      message: "Connected to Smart PoS API",
      timestamp: new Date().toISOString(),
    })
  })

  // Periodic updates (simulate real-time data changes)
  setInterval(() => {
    // Simulate random order status changes
    if (orders.length > 0 && Math.random() > 0.8) {
      const randomOrder = orders[Math.floor(Math.random() * orders.length)]
      const statuses = ["pending", "confirmed", "preparing", "ready", "delivered"]
      const currentIndex = statuses.indexOf(randomOrder.status)

      if (currentIndex < statuses.length - 1) {
        const newStatus = statuses[currentIndex + 1]
        randomOrder.status = newStatus as any

        io.emit("order:status-changed", {
          orderId: randomOrder.id,
          status: newStatus,
          order: randomOrder,
        })
      }
    }
  }, 30000) // Every 30 seconds
}
