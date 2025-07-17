"use client"

import type React from "react"
import type { CartItem as CartItemType } from "../../../shared/types"
import { Button } from "../../../shared/components/Button"
import { formatCurrency } from "../../../shared/utils/formatters"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <img
        src={item.image || "/placeholder.svg?height=60&width=60"}
        alt={item.name}
        className="w-15 h-15 object-cover rounded-md"
      />

      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
        {item.notes && <p className="text-xs text-gray-500 mt-1">Note: {item.notes}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
          -
        </Button>

        <span className="w-8 text-center font-medium">{item.quantity}</span>

        <Button size="sm" variant="ghost" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
          +
        </Button>

        <Button size="sm" variant="danger" onClick={() => onRemove(item.id)}>
          Remove
        </Button>
      </div>
    </div>
  )
}
