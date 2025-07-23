import { ApiClient } from "../../../shared/services/api-client"
import type { Order, CartItem, MenuItem } from "../../../shared/types"

class OrderApi extends ApiClient {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api")
  }

  async createOrder(data: {
    items: CartItem[]
    tableNumber?: number
    customerName?: string
    notes?: string
  }): Promise<Order> {
    const response = await this.post<{ success: boolean; data: Order }>("/orders", data)
    return response.data
  }

  async createQRISOrder(data: {
    tableNumber: string
    customerPhone: string
    orderType: 'dine-in' | 'takeaway'
    items: CartItem[]
    totalAmount: number
    notes?: string
  }): Promise<{ orderId: string; notificationId: string; message: string }> {
    const response = await this.post<{ success: boolean; data: { orderId: string; notificationId: string; message: string } }>("/qris-orders", data)
    return response.data
  }

  async getOrder(orderId: string): Promise<Order> {
    const response = await this.get<{ success: boolean; data: Order }>(`/orders/${orderId}`)
    return response.data
  }

  async getMenu(): Promise<MenuItem[]> {
    const response = await this.get<{ success: boolean; data: MenuItem[] }>("/menu")
    return response.data
  }

  async getTableByQR(qrCode: string): Promise<any> {
    const response = await this.get<{ success: boolean; data: any }>(`/tables/qr/${qrCode}`)
    return response.data
  }
}

export const orderApi = new OrderApi()
