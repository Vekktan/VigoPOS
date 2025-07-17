import { v4 as uuidv4 } from "uuid"
import type { MenuItem, Order, Table, KitchenOrder } from "../../../shared/types"

export const mockMenuItems: MenuItem[] = [
  {
    id: uuidv4(),
    name: "Es Teh Manis",
    description: "Refreshing sweet iced tea made with premium tea leaves",
    price: 5000,
    category: "fast-track",
    estimatedTime: 3,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Tea", "Sugar", "Ice"],
  },
  {
    id: uuidv4(),
    name: "Es Jeruk",
    description: "Fresh orange juice with ice cubes",
    price: 7000,
    category: "fast-track",
    estimatedTime: 2,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Orange", "Sugar", "Ice", "Water"],
  },
  {
    id: uuidv4(),
    name: "Kerupuk",
    description: "Traditional Indonesian crackers, crispy and savory",
    price: 3000,
    category: "fast-track",
    estimatedTime: 1,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Rice flour", "Spices"],
  },
  {
    id: uuidv4(),
    name: "Nasi Goreng Spesial",
    description: "Special fried rice with chicken, egg, and vegetables",
    price: 15000,
    category: "main-course",
    estimatedTime: 20,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Rice", "Chicken", "Egg", "Vegetables", "Spices"],
  },
  {
    id: uuidv4(),
    name: "Ayam Bakar",
    description: "Grilled chicken with special Indonesian spices",
    price: 18000,
    category: "main-course",
    estimatedTime: 25,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Chicken", "Spices", "Sweet soy sauce"],
  },
  {
    id: uuidv4(),
    name: "Mie Ayam",
    description: "Chicken noodle soup with tender chicken pieces",
    price: 12000,
    category: "main-course",
    estimatedTime: 15,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Noodles", "Chicken", "Broth", "Vegetables"],
  },
  {
    id: uuidv4(),
    name: "Gado-gado",
    description: "Indonesian salad with peanut sauce dressing",
    price: 10000,
    category: "main-course",
    estimatedTime: 10,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Vegetables", "Tofu", "Tempeh", "Peanut sauce"],
  },
  {
    id: uuidv4(),
    name: "Es Krim Vanilla",
    description: "Creamy vanilla ice cream served in a cup",
    price: 8000,
    category: "dessert",
    estimatedTime: 2,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Milk", "Vanilla", "Sugar"],
  },
  {
    id: uuidv4(),
    name: "Pudding Coklat",
    description: "Rich chocolate pudding with chocolate sauce",
    price: 7000,
    category: "dessert",
    estimatedTime: 3,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Chocolate", "Milk", "Sugar", "Gelatin"],
  },
  {
    id: uuidv4(),
    name: "Es Campur",
    description: "Mixed ice dessert with various toppings",
    price: 9000,
    category: "dessert",
    estimatedTime: 5,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    ingredients: ["Ice", "Coconut", "Palm sugar", "Various toppings"],
  },
]

export const mockTables: Table[] = Array.from({ length: 20 }, (_, i) => ({
  id: uuidv4(),
  number: i + 1,
  capacity: Math.floor(Math.random() * 6) + 2, // 2-8 people
  status: Math.random() > 0.7 ? "occupied" : "available",
  qrCode: `QR-TABLE-${String(i + 1).padStart(2, "0")}`,
}))

// In-memory storage for development
export const orders: Order[] = []
export const kitchenOrders: KitchenOrder[] = []

// Helper function to generate sample orders
export const generateSampleOrders = () => {
  const sampleOrders: Order[] = [
    {
      id: `ORD-${Date.now()}-001`,
      tableNumber: 3,
      customerName: "John Doe",
      items: [
        { ...mockMenuItems[0], quantity: 2, notes: "Less sugar" },
        { ...mockMenuItems[2], quantity: 1 },
      ],
      status: "pending",
      totalAmount: 13000,
      paymentStatus: "pending",
      orderTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      notes: "Please serve quickly",
    },
    {
      id: `ORD-${Date.now()}-002`,
      tableNumber: 7,
      customerName: "Jane Smith",
      items: [
        { ...mockMenuItems[3], quantity: 1 },
        { ...mockMenuItems[7], quantity: 2 },
      ],
      status: "confirmed",
      totalAmount: 31000,
      paymentStatus: "paid",
      paymentMethod: "qris",
      orderTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      estimatedReadyTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    },
    {
      id: `ORD-${Date.now()}-003`,
      tableNumber: 12,
      items: [
        { ...mockMenuItems[4], quantity: 1 },
        { ...mockMenuItems[1], quantity: 1 },
      ],
      status: "preparing",
      totalAmount: 25000,
      paymentStatus: "paid",
      paymentMethod: "cash",
      orderTime: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      estimatedReadyTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    },
  ]

  orders.push(...sampleOrders)

  // Convert confirmed/preparing orders to kitchen orders
  const kitchenOrdersToAdd: KitchenOrder[] = sampleOrders
    .filter((order) => ["confirmed", "preparing"].includes(order.status))
    .map((order) => ({
      ...order,
      priority: Math.random() > 0.7 ? "urgent" : "normal",
      startTime: order.status === "preparing" ? new Date(Date.now() - 10 * 60 * 1000) : undefined,
      assignedChef: `Chef ${Math.floor(Math.random() * 3) + 1}`,
    }))

  kitchenOrders.push(...kitchenOrdersToAdd)
}

// Initialize with sample data
generateSampleOrders()
