"use client"

import type React from "react"
import type { KitchenOrder } from "../../../shared/types"
import { Button } from "../../../shared/components/Button"
import { Badge } from "../../../shared/components/Badge"
import { formatTime, getElapsedTime } from "../../../shared/utils/formatters"

interface OrderTicketProps {
  order: KitchenOrder
  onStatusUpdate: (orderId: string, status: KitchenOrder["status"]) => void
}

export const OrderTicket: React.FC<OrderTicketProps> = ({ order, onStatusUpdate }) => {
  const isOverdue = order.startTime && Date.now() - order.startTime.getTime() > (order.estimatedTime || 0) * 60 * 1000

  const priorityColors = {
    normal: "info",
    urgent: "danger",
  } as const

  const statusColors = {
    pending: "warning",
    confirmed: "info",
    preparing: "warning",
    ready: "success",
    delivered: "default",
    cancelled: "danger",
  } as const

  return (
    <div
      className={`
      bg-white rounded-lg shadow-md p-4 border-l-4 transition-all duration-300
      ${order.priority === "urgent" || isOverdue ? "border-red-500 animate-pulse" : "border-blue-500"}
      ${isOverdue ? "bg-red-50" : ""}
    `}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-lg">#{order.id}</h3>
            <Badge variant={priorityColors[order.priority]}>{order.priority.toUpperCase()}</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Table {order.tableNumber} • {formatTime(order.orderTime)}
          </p>
        </div>

        <div className="text-right">
          <div className="text-lg font-mono font-bold">
            {order.startTime ? getElapsedTime(order.startTime) : "00:00"}
          </div>
          <Badge variant={statusColors[order.status]} size="sm">
            {order.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="text-sm">
            <span className="font-medium">{item.quantity}x</span> {item.name}
            {item.notes && <div className="text-xs text-gray-500 ml-4">Note: {item.notes}</div>}
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="mb-3 p-2 bg-yellow-50 rounded text-xs">
          <strong>Special Instructions:</strong> {order.notes}
        </div>
      )}

      <div className="flex space-x-2">
        {order.status === "confirmed" && (
          <Button size="sm" variant="primary" onClick={() => onStatusUpdate(order.id, "preparing")} className="flex-1">
            🔥 Start Cooking
          </Button>
        )}

        {order.status === "preparing" && (
          <Button size="sm" variant="success" onClick={() => onStatusUpdate(order.id, "ready")} className="flex-1">
            ✅ Mark Ready
          </Button>
        )}

        {order.status === "ready" && (
          <div className="flex-1 text-center py-2 bg-green-100 text-green-800 rounded font-medium">
            Ready for Pickup
          </div>
        )}
      </div>
    </div>
  )
}
