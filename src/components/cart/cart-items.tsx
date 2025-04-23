"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    productName: string
    productPrice: number
    imageUrl?: string | null
  }
}

export default function CartItems() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

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
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch cart",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
      toast({
        title: "Error",
        description: "Failed to fetch cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      const data = await response.json()

      if (data.success) {
        setCartItems(data.data.items || [])
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update quantity",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setCartItems(data.data.items || [])
        toast({
          title: "Success",
          description: "Item removed from cart",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to remove item",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading cart...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h2 className="mb-4 text-xl font-medium">Your cart is empty</h2>
        <p className="mb-6 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center p-4">
            <div className="mr-4 h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={item.product.imageUrl || "/placeholder.svg?height=80&width=80"}
                alt={item.product.productName}
                width={80}
                height={80}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">
                  <Link href={`/products/${item.product.id}`} className="hover:underline">
                    {item.product.productName}
                  </Link>
                </h3>
                <p className="text-sm font-medium">RS.{item.product.productPrice.toFixed(0)}</p>
              </div>

              <p className="mt-1 text-xs text-gray-500">Small | Black</p>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    className="p-1"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <button onClick={() => removeItem(item.id)} className="text-sm text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
