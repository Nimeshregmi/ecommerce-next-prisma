"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { CreditCard, Lock } from "lucide-react"

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    productName: string
    productPrice: number
  }
}

export default function StripeCheckoutForm({ cartItems }: { cartItems: CartItem[] }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      setCardDetails({ ...cardDetails, [name]: formatted })
      return
    }

    // Format expiry date
    if (name === "cardExpiry") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/^(.{2})/, "$1/")
        .substring(0, 5)
      setCardDetails({ ...cardDetails, [name]: formatted })
      return
    }

    setCardDetails({ ...cardDetails, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!cardDetails.cardNumber || !cardDetails.cardExpiry || !cardDetails.cardCvc || !cardDetails.cardName) {
      toast({
        title: "Error",
        description: "Please fill in all card details",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // In a real app, you would use Stripe.js to handle payment securely
    // This is just a demo that simulates a payment process

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          shippingInfo: {
            // This would normally come from a previous step
            // For demo purposes, we're using placeholder values
            address: "123 Main St",
            city: "New York",
            state: "NY",
            country: "USA",
            postalCode: "10001",
            phone: "555-123-4567",
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Payment successful",
          description: "Your order has been placed successfully",
        })
        router.push(`/order-confirmation/${data.data.id}`)
      } else {
        throw new Error(data.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.product.productPrice * item.quantity, 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Lock className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Secure payment</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>This is a demo checkout. No real payments will be processed. Use any card details for testing.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium">
            Name on card
          </label>
          <Input
            id="cardName"
            name="cardName"
            value={cardDetails.cardName}
            onChange={handleChange}
            placeholder="John Smith"
            required
            disabled={isProcessing}
          />
        </div>

        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium">
            Card number
          </label>
          <div className="relative">
            <Input
              id="cardNumber"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleChange}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              required
              disabled={isProcessing}
            />
            <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cardExpiry" className="block text-sm font-medium">
              Expiration date
            </label>
            <Input
              id="cardExpiry"
              name="cardExpiry"
              value={cardDetails.cardExpiry}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength={5}
              required
              disabled={isProcessing}
            />
          </div>

          <div>
            <label htmlFor="cardCvc" className="block text-sm font-medium">
              CVC
            </label>
            <Input
              id="cardCvc"
              name="cardCvc"
              value={cardDetails.cardCvc}
              onChange={handleChange}
              placeholder="123"
              maxLength={3}
              required
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
        </Button>
      </div>
    </form>
  )
}
