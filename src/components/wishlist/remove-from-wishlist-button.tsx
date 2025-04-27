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

  const handleRemove = async () => {
    setIsRemoving(true)

    try {
      const response = await fetch(`/api/wishlist?id=${itemId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist",
        })
        // Refresh page to update wishlist
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
      onClick={handleRemove} 
      variant="outline" 
      size="sm"
      disabled={isRemoving}
      className="text-red-500 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
    >
      {isRemoving ? (
        <div className="h-4 w-4 rounded-full border-2 border-t-red-500 border-r-gray-200 border-b-gray-200 border-l-gray-200 animate-spin"></div>
      ) : (
        <Trash2 className="h-4 w-4 mr-2" />
      )}
      {isRemoving ? "Removing..." : "Remove"}
    </Button>
  )
}