"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
}

export default function AddToWishlistButton({ 
  product, 
  variant = "icon",
  isInWishlist = false
}: { 
  product: Product
  variant?: 'icon' | 'full'
  isInWishlist?: boolean
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [isInList, setIsInList] = useState(isInWishlist)
  const { toast } = useToast()
  const router = useRouter()

  const handleAddToWishlist = async () => {
    setIsAdding(true)

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsInList(true)
        toast({
          title: "Added to wishlist",
          description: `${product.productName} has been added to your wishlist`,
        })
        
        // Refresh the page to update wishlist count in header if needed
        router.refresh()
      } else if (data.error === "Item already in wishlist") {
        toast({
          title: "Already in wishlist",
          description: `${product.productName} is already in your wishlist`,
        })
        setIsInList(true)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add item to wishlist",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Add to wishlist error:", error)
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveFromWishlist = async () => {
    // This would involve finding the wishlistItem id and then calling the delete endpoint
    // For simplicity in the product page, we'll just show a toast directing to the wishlist page
    toast({
      title: "Manage your wishlist",
      description: "Go to your wishlist to remove items",
      action: (
        <Button variant="outline" size="sm" onClick={() => router.push('/wishlist')}>
          Go to Wishlist
        </Button>
      )
    })
  }

  const handleClick = () => {
    if (isInList) {
      handleRemoveFromWishlist()
    } else {
      handleAddToWishlist()
    }
  }

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleClick}
        disabled={isAdding}
        variant="secondary"
        size="icon"
        className="rounded-full h-9 w-9 bg-white/90 hover:bg-white shadow-sm text-gray-700"
      >
        <Heart className={`h-[18px] w-[18px] ${isInList ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isAdding}
      variant="outline"
      className="w-full border-2 border-gray-300"
    >
      <Heart className={`mr-2 h-4 w-4 ${isInList ? 'fill-red-500 text-red-500' : ''}`} />
      {isAdding ? "Adding..." : isInList ? "Added to Wishlist" : "Add to Wishlist"}
    </Button>
  )
}