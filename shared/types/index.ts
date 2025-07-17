export interface MenuItem { id: string name: string description: string price: number category: "fast-track" | "main-course" | "dessert" estimatedTime: number image: string available: boolean ingredients?: string[] }
export interface CartItem extends MenuItem {
  quantity: number
  notes?: string
}

export interface Order {
  id: string
  tableNumber?: number
  customerName?: string
  items: CartItem[]
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  totalAmount: number
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod?: "cash" | "qris" | "card"
  orderTime: Date
  estimatedReadyTime?: Date
  notes?: string
  qrCode?: string
}

export interface KitchenOrder extends Order {
  priority: "normal" | "urgent"
  startTime?: Date
  completedTime?: Date
  assignedChef?: string
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved"
  qrCode: string
}

export interface PaymentInfo {
  orderId: string
  amount: number
  method: "cash" | "qris" | "card"
  status: "pending" | "processing" | "completed" | "failed"
  transactionId?: string
}

export interface SocketEvents {
  "order:created": Order
  "order:updated": Order
  "order:status-changed": { orderId: string; status: Order["status"] }
  "kitchen:order-ready": KitchenOrder
  "payment:completed": PaymentInfo
  notification: { type: "info" | "success" | "warning" | "error"; message: string }
}
