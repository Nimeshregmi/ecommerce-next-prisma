"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

export default function RemoveFromWishlistButton({ itemId }: { itemId: string }) {
  const [isRemoving, setIsRemoving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleRemoveFromWishlist = async () => {
    setIsRemoving(true)

    try {
      const response = await fetch(`/api/wishlist/items/${itemId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Removed from wishlist",
          description: "The item has been removed from your wishlist",
        })
        
        // Refresh the page to update wishlist items
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to remove item from wishlist",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Remove from wishlist error:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <Button
      onClick={handleRemoveFromWishlist}
      disabled={isRemoving}
      variant="secondary"
      size="icon"
      className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}