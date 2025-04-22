"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAppSelector } from "@/redux/hooks"

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const user = useAppSelector((state) => state.user)

  const handleAddToCart = async () => {
    if (!user.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      })
      router.push("/auth/sign-in")
      return
    }

    setIsAdding(true)

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Added to cart",
          description: `${product.productName} has been added to your cart`,
        })
        // Refresh the page to update cart count in header
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add item to cart",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Add to cart error:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={isAdding} className="w-full bg-black text-white hover:bg-gray-800">
      {isAdding ? "Adding..." : "ADD TO CART"}
    </Button>
  )
}
