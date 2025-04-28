"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAppSelector } from "@/redux/hooks"
import { Heart } from "lucide-react"

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
}

export default function AddToWishlistButton({ product }: { product: Product }) {
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const user = useAppSelector((state) => state.user)
  const [isInWishlist, setIsInWishlist] = useState(false)

  // Check if product is already in wishlist on component mount
  useState(() => {
    const checkWishlist = async () => {
      if (!user.isAuthenticated) return
      
      try {
        const response = await fetch("/api/wishlist")
        const data = await response.json()
        
        if (data.success) {
          const isInList = data.data.some((item: any) => item.productId === product.id)
          setIsInWishlist(isInList)
        }
      } catch (error) {
        console.error("Failed to check wishlist:", error)
      }
    }
    
    checkWishlist()
  })

  const handleAddToWishlist = async () => {
    if (!user.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      })
      router.push("/auth/sign-in")
      return
    }

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
        toast({
          title: "Added to wishlist",
          description: `${product.productName} has been added to your wishlist`,
        })
        setIsInWishlist(true)
        // Refresh to update wishlist count in header
        router.refresh()
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

  return (
    <Button
      onClick={handleAddToWishlist}
      disabled={isAdding || isInWishlist}
      variant="outline"
      size="icon"
      className={`rounded-full border-2 ${
        isInWishlist 
          ? "bg-primary/5 text-primary border-primary" 
          : "bg-white text-gray-600 hover:text-primary hover:border-primary/60"
      }`}
      title={isInWishlist ? "Already in wishlist" : "Add to wishlist"}
    >
      <Heart className={`h-[18px] w-[18px] ${isInWishlist ? "fill-primary" : ""}`} />
      <span className="sr-only">Add to wishlist</span>
    </Button>
  )
}