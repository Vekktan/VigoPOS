import express from "express"
import { v4 as uuidv4 } from "uuid"
import type { Server as SocketIOServer } from "socket.io"
import { orders, kitchenOrders, mockMenuItems } from "../data/mockData"
import type { Order, KitchenOrder } from "../../../shared/types"

export const orderRoutes = (io: SocketIOServer) => {
  const router = express.Router()

  // GET /api/orders - Get all orders
  router.get("/", (req, res) => {
    const { status, tableNumber, limit = 50 } = req.query

    let filteredOrders = [...orders]

    // Filter by status
    if (status) {
      filteredOrders = filteredOrders.filter((order) => order.status === status)
    }

    // Filter by table number
    if (tableNumber) {
      filteredOrders = filteredOrders.filter((order) => order.tableNumber === Number(tableNumber))
    }

    // Sort by order time (newest first)
    filteredOrders.sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime())

    // Limit results
    filteredOrders = filteredOrders.slice(0, Number(limit))

    res.json({
      success: true,
      data: filteredOrders,
      total: filteredOrders.length,
    })
  })

  // GET /api/orders/:id - Get single order
  router.get("/:id", (req, res) => {
    const { id } = req.params
    const order = orders.find((order) => order.id === id)

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      })
    }

    res.json({
      success: true,
      data: order,
    })
  })

  // POST /api/orders - Create new order
  router.post("/", (req, res) => {
    const { items, tableNumber, customerName, notes } = req.body

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Items are required",
      })
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      const menuItem = mockMenuItems.find((mi) => mi.id === item.id)
      return sum + (menuItem ? menuItem.price * item.quantity : 0)
    }, 0)

    const newOrder: Order = {
      id: `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`,
      tableNumber,
      customerName,
      items: items.map((item: any) => {
        const menuItem = mockMenuItems.find((mi) => mi.id === item.id)
        return {
          ...menuItem,
          quantity: item.quantity,
          notes: item.notes,
        }
      }),
      status: "pending",
      totalAmount,
      paymentStatus: "pending",
      orderTime: new Date(),
      notes,
    }

    orders.unshift(newOrder)

    // Emit socket event for real-time updates
    io.emit("order:created", newOrder)

    res.status(201).json({
      success: true,
      data: newOrder,
      message: "Order created successfully",
    })
  })

  // PUT /api/orders/:id/status - Update order status
  router.put("/:id/status", (req, res) => {
    const { id } = req.params
    const { status } = req.body

    const orderIndex = orders.findIndex((order) => order.id === id)

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      })
    }

    const oldStatus = orders[orderIndex].status
    orders[orderIndex].status = status

    // Handle status transitions
    if (status === "confirmed" && oldStatus === "pending") {
      // Add to kitchen orders when confirmed
      const kitchenOrder: KitchenOrder = {
        ...orders[orderIndex],
        priority: "normal",
        assignedChef: `Chef ${Math.floor(Math.random() * 3) + 1}`,
      }
      kitchenOrders.unshift(kitchenOrder)

      // Emit to kitchen app
      io.emit("kitchen:new-order", kitchenOrder)
    }

    if (status === "preparing") {
      // Update kitchen order start time
      const kitchenOrderIndex = kitchenOrders.findIndex((ko) => ko.id === id)
      if (kitchenOrderIndex !== -1) {
        kitchenOrders[kitchenOrderIndex].startTime = new Date()
      }
    }

    if (status === "ready") {
      // Update kitchen order completion time
      const kitchenOrderIndex = kitchenOrders.findIndex((ko) => ko.id === id)
      if (kitchenOrderIndex !== -1) {
        kitchenOrders[kitchenOrderIndex].completedTime = new Date()
      }

      // Emit to waitress app
      io.emit("order:ready", orders[orderIndex])
    }

    // Emit status change to all clients
    io.emit("order:status-changed", { orderId: id, status, order: orders[orderIndex] })

    res.json({
      success: true,
      data: orders[orderIndex],
      message: "Order status updated successfully",
    })
  })

  // GET /api/orders/kitchen/queue - Get kitchen orders
  router.get("/kitchen/queue", (req, res) => {
    const { status } = req.query

    let filteredOrders = [...kitchenOrders]

    if (status) {
      filteredOrders = filteredOrders.filter((order) => order.status === status)
    }

    // Sort by priority and order time
    filteredOrders.sort((a, b) => {
      if (a.priority === "urgent" && b.priority !== "urgent") return -1
      if (b.priority === "urgent" && a.priority !== "urgent") return 1
      return new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
    })

    res.json({
      success: true,
      data: filteredOrders,
      total: filteredOrders.length,
    })
  })

  // GET /api/orders/analytics/dashboard - Get dashboard analytics
  router.get("/analytics/dashboard", (req, res) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = orders.filter((order) => new Date(order.orderTime) >= today)

    const totalSales = todayOrders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.totalAmount, 0)

    const ordersByStatus = {
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    }

    // Calculate popular items
    const itemCounts: { [key: string]: { name: string; count: number } } = {}
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (itemCounts[item.id]) {
          itemCounts[item.id].count += item.quantity
        } else {
          itemCounts[item.id] = { name: item.name, count: item.quantity }
        }
      })
    })

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    res.json({
      success: true,
      data: {
        totalSales,
        totalOrders: todayOrders.length,
        averageRating: 4.8, // Mock rating
        ordersByStatus,
        popularItems,
        recentOrders: orders.slice(0, 10),
      },
    })
  })

  return router
}
