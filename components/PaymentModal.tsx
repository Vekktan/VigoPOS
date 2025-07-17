"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Banknote, Check } from "lucide-react"

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

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  totalAmount: number
  onPaymentComplete: () => void
}

export function PaymentModal({ isOpen, onClose, cart, totalAmount, onPaymentComplete }: PaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: Banknote, color: "bg-green-500" },
    { id: "card", label: "Credit Card", icon: CreditCard, color: "bg-blue-500" },
    { id: "qris", label: "QRIS", icon: Smartphone, color: "bg-purple-500" },
  ]

  const handlePayment = async () => {
    if (!selectedPayment) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setIsSuccess(true)

    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false)
      setSelectedPayment("")
      onPaymentComplete()
      onClose()
    }, 2000)
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Order has been sent to kitchen</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Payment Confirmation</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span>{item.name}</span>
                    <Badge variant="outline" className="text-xs">
                      x{item.quantity}
                    </Badge>
                  </div>
                  <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-amber-600">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPayment === method.id ? "ring-2 ring-amber-500 bg-amber-50" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{method.label}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={handlePayment}
                disabled={!selectedPayment || isProcessing}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Confirm Payment - Rp ${totalAmount.toLocaleString("id-ID")}`
                )}
              </Button>

              <Button onClick={onClose} variant="outline" className="w-full" disabled={isProcessing}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
