"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAppSelector } from "@/redux/hooks"
import { ShoppingCart } from "lucide-react"
import { type Product } from "@/lib/types"

export default function ProductOptionsSelector({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.color && product.color.length > 0 ? product.color[0] : null
  )
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.size && product.size.length > 0 ? product.size[0] : null
  )
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

    if (product.color && product.color.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        description: "You need to select a color before adding to cart",
        variant: "destructive",
      })
      return
    }

    if (product.size && product.size.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart",
        variant: "destructive",
      })
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
          selectedColor,
          selectedSize
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Added to cart",
          description: `${product.productName} (${selectedColor}, ${selectedSize}) has been added to your cart`,
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
    <>
      {/* Color selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Choose Color
        </h3>
        <div className="flex gap-3">
          {product.color && product.color.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`h-10 w-10 rounded-full border-2 cursor-pointer shadow-sm transition-all ${
                selectedColor === color
                  ? "border-primary scale-110 ring-2 ring-primary/30"
                  : "border-white hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color} color`}
            />
          ))}
        </div>
        {selectedColor && (
          <p className="mt-2 text-sm text-gray-500">
            Selected: <span className="font-medium capitalize">{selectedColor}</span>
          </p>
        )}
      </div>

      {/* Size selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">
            Select Size
          </h3>
          <Link
            href="#"
            className="text-sm text-primary hover:underline"
          >
            Size Guide
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.size && product.size.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`flex h-11 min-w-[2.75rem] items-center justify-center rounded-md px-3 text-lg font-medium transition-all ${
                selectedSize === size
                  ? "border-2 border-primary bg-primary/5 text-primary"
                  : "border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
        {selectedSize && (
          <p className="mt-2 text-sm text-gray-500">
            Selected: <span className="font-medium">{selectedSize.toUpperCase()}</span>
          </p>
        )}
      </div>
      <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Remaining Quantity: <span className="font-medium text-gray-900">{product.stockQuantity}</span>
                </p>
              </div>
      {/* Add to cart */}
      {/* <div className="flex flex-col space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-black text-white hover:bg-gray-800"
          size="lg"
        >
          {isAdding ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              ADD TO CART
            </>
          )}
        </Button>
        
        {product.stockQuantity !== undefined && product.stockQuantity <= 5 && (
          <p className="text-amber-600 text-sm mt-2 text-center">
            {product.stockQuantity === 0 
              ? "Out of stock" 
              : `Only ${product.stockQuantity} left in stock!`}
          </p>
        )}
      </div> */}
    </>
  )
}