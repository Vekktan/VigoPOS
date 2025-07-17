import type React from "react"
import { OrderTicket } from "../components/OrderTicket"
import { useKitchenOrders } from "../hooks/useKitchenOrders"

const QueuePage: React.FC = () => {
  const { orders, updateOrderStatus, loading } = useKitchenOrders()

  const categorizeOrders = () => {
    const fastTrack = orders.filter((order) => order.items.some((item) => item.category === "fast-track"))
    const mainCourse = orders.filter((order) => order.items.some((item) => item.category === "main-course"))
    const dessert = orders.filter((order) => order.items.some((item) => item.category === "dessert"))

    return { fastTrack, mainCourse, dessert }
  }

  const { fastTrack, mainCourse, dessert } = categorizeOrders()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading kitchen orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Queue</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Fast Track Column */}
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="bg-amber-500 text-white p-3 rounded-lg mb-4 text-center">
              <h2 className="font-bold text-lg">🚀 FAST TRACK</h2>
              <p className="text-sm opacity-90">{fastTrack.length} orders</p>
            </div>

            <div className="space-y-4">
              {fastTrack.map((order) => (
                <OrderTicket key={order.id} order={order} onStatusUpdate={updateOrderStatus} />
              ))}
              {fastTrack.length === 0 && <div className="text-center text-gray-500 py-8">No fast track orders</div>}
            </div>
          </div>

          {/* Main Course Column */}
          <div className="bg-red-50 rounded-lg p-4">
            <div className="bg-red-600 text-white p-3 rounded-lg mb-4 text-center">
              <h2 className="font-bold text-lg">🍽️ MAIN COURSE</h2>
              <p className="text-sm opacity-90">{mainCourse.length} orders</p>
            </div>

            <div className="space-y-4">
              {mainCourse.map((order) => (
                <OrderTicket key={order.id} order={order} onStatusUpdate={updateOrderStatus} />
              ))}
              {mainCourse.length === 0 && <div className="text-center text-gray-500 py-8">No main course orders</div>}
            </div>
          </div>

          {/* Dessert Column */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="bg-purple-600 text-white p-3 rounded-lg mb-4 text-center">
              <h2 className="font-bold text-lg">🍰 DESSERT</h2>
              <p className="text-sm opacity-90">{dessert.length} orders</p>
            </div>

            <div className="space-y-4">
              {dessert.map((order) => (
                <OrderTicket key={order.id} order={order} onStatusUpdate={updateOrderStatus} />
              ))}
              {dessert.length === 0 && <div className="text-center text-gray-500 py-8">No dessert orders</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueuePage
