"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

type CartItem = {
  id: string
  quantity: number
  selectedColor?: string | null
  selectedSize?: string | null
  product: {
    id: string
    productName: string
    productPrice: number
    image?: string | null
    productStatus?: string
  }
}

export default function CartItems() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)
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
      setUpdatingItemId(itemId)
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
        toast({
          title: "Cart updated",
          description: "Item quantity has been updated",
        })
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
    } finally {
      setUpdatingItemId(null)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      setRemovingItemId(itemId)
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setCartItems(data.data.items || [])
        toast({
          title: "Item removed",
          description: "The item has been removed from your cart",
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
    } finally {
      setRemovingItemId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white shadow-sm p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-primary border-b-gray-200 border-l-gray-200 animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-xl bg-white shadow-sm p-8 text-center">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="bg-gray-50 rounded-full p-4 mb-4">
            <Trash2 className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 max-w-md">Looks like you haven't added anything to your cart yet. Explore our products and find something you'll love.</p>
          <Button asChild size="lg" className="px-8">
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/80">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Items in Your Cart</h2>
          <p className="text-sm text-gray-500">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center p-6 hover:bg-gray-50/50 transition-colors">
            <div className="mr-6 aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg relative bg-gray-100 border border-gray-200">
              {item.product.image ? (
                <Image
                  src={item.product.image}
                  alt={item.product.productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 96px, 96px"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-100 text-xs text-gray-500 font-medium">
                  Fashion Fuel
                </div>
              )}

              {item.product.productStatus === "new" && (
                <Badge className="absolute top-1 left-1 text-[10px] bg-primary text-white">NEW</Badge>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex justify-between mb-1">
                <Link 
                  href={`/products/${item.product.id}`} 
                  className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1"
                >
                  {item.product.productName}
                </Link>
                <p className="font-medium">${item.product.productPrice.toLocaleString()}</p>
              </div>

              <div className="flex items-end justify-between mt-2">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {item.selectedColor && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-1.5">Color:</span>
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-200" 
                          style={{ backgroundColor: item.selectedColor }}
                          aria-label={`Selected color: ${item.selectedColor}`}
                        ></div>
                        <span className="text-sm ml-1.5 capitalize">{item.selectedColor}</span>
                      </div>
                    )}
                    
                    {item.selectedSize && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mx-1.5">•</span>
                        <span className="text-sm text-gray-500 mr-1.5">Size:</span>
                        <span className="text-sm uppercase">{item.selectedSize}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center border rounded-md shadow-sm bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1 || updatingItemId === item.id}
                        className="px-3 py-1 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {updatingItemId === item.id ? (
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-t-primary border-r-gray-200 border-b-gray-200 border-l-gray-200 animate-spin mx-auto"></div>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        disabled={updatingItemId === item.id}
                        className="px-3 py-1 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeItem(item.id)} 
                  disabled={removingItemId === item.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Remove item"
                >
                  {removingItemId === item.id ? (
                    <div className="h-4 w-4 rounded-full border-2 border-t-red-500 border-r-gray-200 border-b-gray-200 border-l-gray-200 animate-spin"></div>
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                <p className="font-medium text-primary">
                  Subtotal: ${(item.product.productPrice * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
