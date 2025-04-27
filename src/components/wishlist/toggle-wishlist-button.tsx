"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Heart, Loader2 } from "lucide-react"
import { useAppSelector } from "@/redux/hooks"

type Product = {
  id: string
  productId?: string
  productName?: string
  productPrice?: number
}

export default function ToggleWishlistButton({ 
  product, 
  variant = "icon",
}: { 
  product: Product
  variant?: 'icon' | 'full'
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const user = useAppSelector((state) => state.user)

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (!user.isAuthenticated) {
      setIsLoading(false)
      return
    }

    const checkWishlistStatus = async () => {
      try {
        const response = await fetch("/api/wishlist", {
          method: "GET",
        })

        if (response.ok) {
          const data = await response.json()
          
          if (data.success && data.data) {
            // Check if the current product is in the wishlist items
            const isInList = data.data.some(
              (item: any) => item.product.id === product.id
            )
            setIsInWishlist(isInList)
          }
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkWishlistStatus()
  }, [product.id, user.isAuthenticated])

  const addToWishlist = async () => {
    if (!user.isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      })
      router.push('/auth/sign-in')
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
        setIsInWishlist(true)
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist",
          className: "bg-white border-green-200",
        })
        router.refresh()
      } else if (data.error === "Item already in wishlist") {
        setIsInWishlist(true)
        toast({
          title: "Already in wishlist",
          description: "This item is already in your wishlist",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add to wishlist",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Add to wishlist error:", error)
      toast({
        title: "Error",
        description: "Failed to add to wishlist",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const removeFromWishlist = async () => {
    setIsAdding(true)

    try {
      // First we need to get the wishlist to find the item ID
      const getResponse = await fetch("/api/wishlist", {
        method: "GET",
      })

      if (getResponse.ok) {
        const wishlistData = await getResponse.json()
        if (wishlistData.success && wishlistData.data) {
          // Find the wishlist item for this product
          const wishlistItem = wishlistData.data.find(
            (item: any) => item.product.id === product.id
          )

          if (wishlistItem) {
            // Now delete it using the wishlist item ID
            const deleteResponse = await fetch(`/api/wishlist?id=${wishlistItem.id}`, {
              method: "DELETE",
            })

            const data = await deleteResponse.json()

            if (data.success) {
              setIsInWishlist(false)
              toast({
                title: "Removed from wishlist",
                description: "Item has been removed from your wishlist",
              })
              router.refresh()
            } else {
              toast({
                title: "Error",
                description: data.error || "Failed to remove from wishlist",
                variant: "destructive",
              })
            }
          }
        }
      }
    } catch (error) {
      console.error("Remove from wishlist error:", error)
      toast({
        title: "Error",
        description: "Failed to remove from wishlist",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist()
    } else {
      addToWishlist()
    }
  }

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleToggleWishlist}
        disabled={isAdding || isLoading}
        variant="secondary"
        size="icon"
        className="rounded-full h-9 w-9 bg-white/90 hover:bg-white shadow-sm text-gray-700 transition-all duration-300"
      >
        {isLoading ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        ) : (
          <Heart 
            className={`h-[18px] w-[18px] transition-colors duration-300 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} 
          />
        )}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleToggleWishlist}
      disabled={isAdding || isLoading}
      variant="outline"
      className={`w-full border-2 ${isInWishlist ? 'border-red-200 bg-red-50 hover:bg-red-100' : 'border-gray-300 hover:bg-gray-50'} transition-colors duration-300`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Heart className={`mr-2 h-4 w-4 transition-colors duration-300 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
      )}
      {isAdding ? (
        "Processing..."
      ) : (
        isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
      )}
    </Button>
  )
}