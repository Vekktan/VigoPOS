"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, ShoppingCart, CreditCard } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  price: number
  category: "fast-track" | "main-course" | "dessert"
  image: string
  description?: string
}

interface CartItem extends MenuItem {
  quantity: number
}

interface CartSidebarProps {
  cart: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
  totalAmount: number
  totalItems: number
}

export function CartSidebar({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  totalAmount,
  totalItems,
}: CartSidebarProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Current Order</h2>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            {totalItems} items
          </Badge>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No items in cart</p>
            <p className="text-sm text-gray-400">Add items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-800 truncate">{item.name}</h4>
                      <p className="text-sm text-amber-600 font-semibold">Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-amber-600">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>

            <Button
              onClick={onCheckout}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
              size="lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pay Now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
