"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Home, ClipboardList, Star, User, Package, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  name: string
  quantity: number
}

interface ReadyOrder {
  id: string
  tableNumber: number
  items: OrderItem[]
  readyTime: Date
  priority: "normal" | "urgent"
  status: "ready" | "picked-up"
}

const initialOrders: ReadyOrder[] = [
  {
    id: "T03-1425-01",
    tableNumber: 3,
    items: [
      { name: "Es Teh Manis", quantity: 2 },
      { name: "Kerupuk", quantity: 1 },
    ],
    readyTime: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    priority: "normal",
    status: "ready",
  },
  {
    id: "T12-1430-02",
    tableNumber: 12,
    items: [{ name: "Nasi Goreng Spesial", quantity: 1 }],
    readyTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    priority: "urgent",
    status: "ready",
  },
  {
    id: "T07-1435-03",
    tableNumber: 7,
    items: [
      { name: "Es Krim Vanilla", quantity: 2 },
      { name: "Pudding Coklat", quantity: 1 },
    ],
    readyTime: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
    priority: "normal",
    status: "ready",
  },
  {
    id: "T15-1440-04",
    tableNumber: 15,
    items: [
      { name: "Ayam Bakar", quantity: 1 },
      { name: "Es Teh Manis", quantity: 1 },
    ],
    readyTime: new Date(Date.now() - 30 * 1000), // 30 seconds ago
    priority: "normal",
    status: "picked-up",
  },
]

export default function WaitressMobile() {
  const [orders, setOrders] = useState<ReadyOrder[]>(initialOrders)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"ready" | "all" | "feedback" | "profile">("ready")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Update priority based on waiting time
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const waitingMinutes = (currentTime.getTime() - order.readyTime.getTime()) / (1000 * 60)
          if (waitingMinutes > 3 && order.priority === "normal" && order.status === "ready") {
            return { ...order, priority: "urgent" }
          }
          return order
        }),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [currentTime])

  const markAsPickedUp = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: "picked-up" } : order)),
    )
  }

  const getWaitingTime = (readyTime: Date) => {
    const elapsed = Math.floor((currentTime.getTime() - readyTime.getTime()) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60

    if (minutes > 0) {
      return `${minutes} min ago`
    }
    return `${seconds} sec ago`
  }

  const readyOrders = orders.filter((order) => order.status === "ready")
  const readyCount = readyOrders.length

  const OrderCard = ({ order }: { order: ReadyOrder }) => {
    const isUrgent = order.priority === "urgent"
    const isPickedUp = order.status === "picked-up"

    return (
      <Card
        className={`
          ${isUrgent && !isPickedUp ? "bg-red-50 border-red-200 animate-pulse" : ""}
          ${isPickedUp ? "bg-gray-50 border-gray-200" : "bg-white"}
          transition-all duration-300 hover:shadow-lg
        `}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-lg">Table {order.tableNumber}</span>
              </div>
              {isUrgent && !isPickedUp && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  URGENT
                </Badge>
              )}
              {isPickedUp && (
                <Badge className="bg-gray-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  PICKED UP
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span className={isUrgent ? "text-red-600 font-semibold" : ""}>
                Ready {getWaitingTime(order.readyTime)}
              </span>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="text-sm text-gray-700">
                • {item.name} {item.quantity > 1 && `(${item.quantity})`}
              </div>
            ))}
          </div>

          {!isPickedUp && (
            <Button
              onClick={() => markAsPickedUp(order.id)}
              className={`w-full ${
                isUrgent ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <Package className="w-4 h-4 mr-2" />
              {isUrgent ? "🚨 URGENT PICKUP" : "📦 PICK UP"}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "ready":
        return (
          <div className="space-y-4">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No orders ready for pickup</p>
                <p className="text-gray-400 text-sm">New orders will appear here</p>
              </div>
            ) : (
              readyOrders
                .sort((a, b) => {
                  // Sort urgent orders first, then by ready time
                  if (a.priority === "urgent" && b.priority !== "urgent") return -1
                  if (b.priority === "urgent" && a.priority !== "urgent") return 1
                  return a.readyTime.getTime() - b.readyTime.getTime()
                })
                .map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        )

      case "all":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">All Orders</h3>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )

      case "feedback":
        return (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Customer Feedback</p>
            <p className="text-gray-400 text-sm">Feature coming soon</p>
          </div>
        )

      case "profile":
        return (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Profile Settings</p>
            <p className="text-gray-400 text-sm">Feature coming soon</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-xl font-bold text-green-600">
              Smart PoS
            </Link>
            {readyCount > 0 && (
              <Badge className="bg-red-500 text-white animate-bounce">
                <Bell className="w-3 h-3 mr-1" />
                {readyCount} Ready
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {currentTime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-20">{renderContent()}</div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t shadow-lg">
        <div className="grid grid-cols-4">
          <button
            onClick={() => setActiveTab("ready")}
            className={`flex flex-col items-center py-3 px-2 text-xs ${
              activeTab === "ready" ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="relative">
              <Home className="w-5 h-5" />
              {readyCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 text-xs bg-red-500 text-white">
                  {readyCount}
                </Badge>
              )}
            </div>
            <span className="mt-1">Ready</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`flex flex-col items-center py-3 px-2 text-xs ${
              activeTab === "all" ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="mt-1">All Orders</span>
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex flex-col items-center py-3 px-2 text-xs ${
              activeTab === "feedback" ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Star className="w-5 h-5" />
            <span className="mt-1">Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center py-3 px-2 text-xs ${
              activeTab === "profile" ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
