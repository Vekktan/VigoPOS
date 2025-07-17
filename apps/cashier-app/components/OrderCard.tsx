"use client"

import type React from "react"
import type { Order } from "../../../shared/types"
import { Button } from "../../../shared/components/Button"
import { Badge } from "../../../shared/components/Badge"
import { formatCurrency, formatTime } from "../../../shared/utils/formatters"

interface OrderCardProps {
  order: Order
  onStatusUpdate: (orderId: string, status: Order["status"]) => void
  onSendToKitchen: (orderId: string) => void
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate, onSendToKitchen }) => {
  const statusColors = {
    pending: "warning",
    confirmed: "info",
    preparing: "warning",
    ready: "success",
    delivered: "default",
    cancelled: "danger",
  } as const

  const getStatusActions = () => {
    switch (order.status) {
      case "pending":
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => {
                onStatusUpdate(order.id, "confirmed")
                onSendToKitchen(order.id)
              }}
            >
              Confirm & Send to Kitchen
            </Button>
            <Button size="sm" variant="danger" onClick={() => onStatusUpdate(order.id, "cancelled")}>
              Cancel
            </Button>
          </div>
        )
      case "confirmed":
        return <Badge variant="info">Sent to Kitchen</Badge>
      case "preparing":
        return <Badge variant="warning">Being Prepared</Badge>
      case "ready":
        return (
          <Button size="sm" variant="success" onClick={() => onStatusUpdate(order.id, "delivered")}>
            Mark as Delivered
          </Button>
        )
      default:
        return <Badge variant={statusColors[order.status]}>{order.status.toUpperCase()}</Badge>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
          <p className="text-sm text-gray-600">
            {order.tableNumber ? `Table ${order.tableNumber}` : "Takeaway"}
            {order.customerName && ` • ${order.customerName}`}
          </p>
          <p className="text-xs text-gray-500">{formatTime(order.orderTime)}</p>
        </div>

        <Badge variant={statusColors[order.status]}>{order.status.toUpperCase()}</Badge>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>
              {item.quantity}x {item.name}
              {item.notes && <span className="text-gray-500 italic"> ({item.notes})</span>}
            </span>
            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="mb-4 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> {order.notes}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-lg font-bold text-gray-900">Total: {formatCurrency(order.totalAmount)}</div>

        {getStatusActions()}
      </div>
    </div>
  )
}
