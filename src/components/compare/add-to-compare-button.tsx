"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

const MAX_COMPARE_PRODUCTS = 4

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
  image?: string
  categoryId: string
}

export default function AddToCompareButton({ product }: { product: Product }) {
  const [isInCompare, setIsInCompare] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Check if the product is already in compare list (stored in localStorage)
  useEffect(() => {
    const compareList = JSON.parse(localStorage.getItem("compareProducts") || "[]")
    const isInList = compareList.some((item: any) => item.id === product.id)
    setIsInCompare(isInList)
  }, [product.id])

  const handleClick = () => {
    setIsAdding(true)
    
    try {
      // Get current compare list from localStorage
      const compareList = JSON.parse(localStorage.getItem("compareProducts") || "[]")
      
      if (isInCompare) {
        // Remove product from compare list
        const updatedList = compareList.filter((item: any) => item.id !== product.id)
        localStorage.setItem("compareProducts", JSON.stringify(updatedList))
        setIsInCompare(false)
        toast({
          title: "Removed from comparison",
          description: `${product.productName} removed from your comparison list`,
        })
      } else {
        // Add product to compare list if not full
        if (compareList.length >= MAX_COMPARE_PRODUCTS) {
          toast({
            title: "Comparison list full",
            description: `You can compare up to ${MAX_COMPARE_PRODUCTS} products at once. Remove a product to add another.`,
            variant: "destructive",
          })
        } else {
          // Add product to compare list
          const updatedList = [...compareList, {
            id: product.id,
            productId: product.productId,
            name: product.productName,
            price: product.productPrice,
            image: product.image || "/products/image.png",
            categoryId: product.categoryId,
          }]
          localStorage.setItem("compareProducts", JSON.stringify(updatedList))
          setIsInCompare(true)
          toast({
            title: "Added to comparison",
            description: (
              <div className="flex flex-col space-y-2">
                <span>{product.productName} added to your comparison list</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => router.push('/compare')}
                >
                  Compare Now
                </Button>
              </div>
            ),
          })
        }
      }
    } catch (error) {
      console.error("Error updating compare list:", error)
      toast({
        title: "Error",
        description: "Failed to update comparison list",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isAdding}
      variant="secondary"
      size="sm"
      className={`flex items-center gap-1 ${isInCompare ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
    >
      <BarChart3 className="h-4 w-4" />
      <span>{isInCompare ? "Remove" : "Compare"}</span>
    </Button>
  )
}