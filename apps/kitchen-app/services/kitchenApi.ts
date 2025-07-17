import { ApiClient } from "../../../shared/services/api-client"
import type { KitchenOrder } from "../../../shared/types"

class KitchenApi extends ApiClient {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api")
  }

  async getKitchenOrders(status?: string): Promise<KitchenOrder[]> {
    const url = `/orders/kitchen/queue${status ? `?status=${status}` : ""}`
    const response = await this.get<{ success: boolean; data: KitchenOrder[] }>(url)
    return response.data
  }

  async updateOrderStatus(orderId: string, status: KitchenOrder["status"]): Promise<KitchenOrder> {
    const response = await this.put<{ success: boolean; data: KitchenOrder }>(`/orders/${orderId}/status`, { status })
    return response.data
  }
}

export const kitchenApi = new KitchenApi()
