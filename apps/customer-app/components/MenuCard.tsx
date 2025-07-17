"use client"

import type React from "react"
import type { MenuItem } from "../../../shared/types"
import { Button } from "../../../shared/components/Button"
import { Badge } from "../../../shared/components/Badge"
import { formatCurrency } from "../../../shared/utils/formatters"

interface MenuCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  const categoryColors = {
    "fast-track": "warning",
    "main-course": "danger",
    dessert: "info",
  } as const

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={item.image || "/placeholder.svg?height=200&width=300"}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <Badge variant={categoryColors[item.category]} className="absolute top-2 right-2">
          {item.estimatedTime} min
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">{formatCurrency(item.price)}</span>

          <Button size="sm" onClick={() => onAddToCart(item)} disabled={!item.available}>
            {item.available ? "Add to Cart" : "Unavailable"}
          </Button>
        </div>
      </div>
    </div>
  )
}
