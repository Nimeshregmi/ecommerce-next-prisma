"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    productName: string
    productPrice: number
  }
}

export default function CartSummary() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart")
      const data = await response.json()

      if (data.success) {
        setCartItems(data.data.items || [])
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="rounded-lg border p-6">Loading...</div>
  }

  const subtotal = cartItems.reduce((total, item) => total + item.product.productPrice * item.quantity, 0)

  // Apply a 20% discount to items marked with discount (this would come from the API in a real app)
  const discount = 0 // In this simplified version, no discount is applied

  const total = subtotal - discount

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-medium">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
          <span>RS.{subtotal.toFixed(0)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Discount</span>
            <span>-RS.{discount.toFixed(0)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>RS.{total.toFixed(0)}</span>
        </div>

        <Button asChild className="w-full" disabled={cartItems.length === 0}>
          <Link href="/checkout">CONTINUE TO CHECKOUT</Link>
        </Button>
      </div>
    </div>
  )
}
