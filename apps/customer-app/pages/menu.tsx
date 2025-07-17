"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { MenuItem } from "../../../shared/types"
import { MenuCard } from "../components/MenuCard"
import { useCart } from "../hooks/useCart"
import { orderApi } from "../services/orderApi"
import { Button } from "../../../shared/components/Button"
import { Badge } from "../../../shared/components/Badge"
import Link from "next/link"

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const { addItem, totalItems, totalAmount } = useCart()

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const items = await orderApi.getMenu()
        setMenuItems(items)
      } catch (error) {
        console.error("Failed to load menu:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [])

  const categories = [
    { key: "all", label: "All Items" },
    { key: "fast-track", label: "🚀 Fast Track" },
    { key: "main-course", label: "🍽️ Main Course" },
    { key: "dessert", label: "🍰 Dessert" },
  ]

  const filteredItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Menu</h1>

            {totalItems > 0 && (
              <Link href="/cart">
                <Button className="relative">
                  View Cart
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{totalItems}</Badge>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "primary" : "secondary"}
              onClick={() => setSelectedCategory(category.key)}
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} onAddToCart={addItem} />
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 right-4 md:hidden">
          <Link href="/cart">
            <Button size="lg" className="rounded-full shadow-lg relative">
              🛒 Cart
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{totalItems}</Badge>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default MenuPage
