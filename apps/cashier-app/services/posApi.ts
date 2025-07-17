import { ApiClient } from "../../../shared/services/api-client"
import type { Order, MenuItem } from "../../../shared/types"

class PosApi extends ApiClient {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api")
  }

  async getOrders(params?: { status?: string; limit?: number }): Promise<Order[]> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append("status", params.status)
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    const response = await this.get<{ success: boolean; data: Order[] }>(url)
    return response.data
  }

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order> {
    const response = await this.put<{ success: boolean; data: Order }>(`/orders/${orderId}/status`, { status })
    return response.data
  }

  async getDashboardAnalytics(): Promise<any> {
    const response = await this.get<{ success: boolean; data: any }>("/orders/analytics/dashboard")
    return response.data
  }

  async getMenu(): Promise<MenuItem[]> {
    const response = await this.get<{ success: boolean; data: MenuItem[] }>("/menu")
    return response.data
  }

  async createMenuItem(item: Omit<MenuItem, "id">): Promise<MenuItem> {
    const response = await this.post<{ success: boolean; data: MenuItem }>("/menu", item)
    return response.data
  }

  async updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem> {
    const response = await this.put<{ success: boolean; data: MenuItem }>(`/menu/${id}`, item)
    return response.data
  }

  async deleteMenuItem(id: string): Promise<void> {
    await this.delete(`/menu/${id}`)
  }

  async processPayment(orderId: string, method: string, amount: number): Promise<any> {
    const response = await this.post<{ success: boolean; data: any }>("/payments/process", {
      orderId,
      method,
      amount,
    })
    return response.data
  }
}

export const posApi = new PosApi()
