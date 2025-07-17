"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  price: number
  category: "fast-track" | "main-course" | "dessert"
  image: string
  description?: string
}

interface ProductCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

const categoryColors = {
  "fast-track": "bg-amber-500",
  "main-course": "bg-red-500",
  dessert: "bg-purple-500",
}

export function ProductCard({ item, onAddToCart }: ProductCardProps) {
  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-md"
      onClick={() => onAddToCart(item)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <Badge className={`absolute top-2 right-2 ${categoryColors[item.category]} text-white text-xs`}>
            {item.category === "fast-track" ? "Fast" : item.category === "main-course" ? "Main" : "Dessert"}
          </Badge>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-t-lg flex items-center justify-center">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
              <Plus className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-600">Rp {item.price.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
