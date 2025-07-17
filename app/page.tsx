import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Smartphone, ChefHat } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Smart PoS System</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Modern Point of Sale system for restaurants with three specialized interfaces
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">CoffeePOS Cashier</CardTitle>
              <CardDescription>Professional coffee shop POS interface</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Category-based menu navigation</li>
                <li>• Advanced cart management</li>
                <li>• Multiple payment methods</li>
                <li>• Order customization</li>
              </ul>
              <Link href="/cashier">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Open CoffeePOS</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Kitchen Display</CardTitle>
              <CardDescription>Real-time order tracking for kitchen staff</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Live order tracking</li>
                <li>• Category-based layout</li>
                <li>• Timer management</li>
                <li>• Priority indicators</li>
              </ul>
              <Link href="/kitchen">
                <Button className="w-full bg-red-600 hover:bg-red-700">Open Kitchen Display</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Customer Mobile</CardTitle>
              <CardDescription>Mobile interface for customer ordering</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• QR code scanning</li>
                <li>• Menu browsing</li>
                <li>• Order placement</li>
                <li>• Order tracking</li>
              </ul>
              <Link href="/customer">
                <Button className="w-full bg-green-600 hover:bg-green-700">Open Customer App</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
