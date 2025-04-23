"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, ShieldCheck } from "lucide-react"

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
    return (
      <div className="rounded-xl bg-white shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 w-1/2 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between">
              <div className="h-5 w-16 bg-gray-300 rounded"></div>
              <div className="h-5 w-20 bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded-md mt-4"></div>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = cartItems.reduce((total, item) => total + item.product.productPrice * item.quantity, 0)
  
  // Apply free shipping for orders above 1000
  const shippingCost = subtotal >= 1000 ? 100 : 0
  
  // Calculate tax (for example, 5% GST)
  const tax = Math.round(subtotal * 0.05)
  
  const total = subtotal + shippingCost + tax

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/80">
        <h2 className="font-medium">Order Summary</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              <span className="font-medium">₹{shippingCost.toLocaleString()}</span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Tax (5% GST)</span>
            <span className="font-medium">₹{tax.toLocaleString()}</span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between font-medium text-base">
            <span>Total</span>
            <span className="text-lg">₹{total.toLocaleString()}</span>
          </div>

          <Button 
            asChild 
            className="w-full mt-4 font-medium h-11" 
            disabled={cartItems.length === 0}
          >
            <Link href="/checkout" className="flex items-center justify-center">
              CHECKOUT 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          {/* Security badges */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center text-gray-500 text-xs gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Secure Checkout</span>
            </div>
            
            <div className="flex items-center justify-center mt-4 gap-3">
              <div className="h-6 w-10 bg-gray-200 rounded"></div>
              <div className="h-6 w-10 bg-gray-200 rounded"></div>
              <div className="h-6 w-10 bg-gray-200 rounded"></div>
              <div className="h-6 w-10 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Promotion code */}
          {cartItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <Link 
                  href="#" 
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Apply Promotion Code
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
