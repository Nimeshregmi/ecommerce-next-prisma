"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, ShoppingCart, X, ArrowLeft, Star, Check, Minus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type CompareProduct = {
  id: string
  productId: string
  name: string
  price: number
  image: string
  categoryId: string
}

export default function ComparePage() {
  const [products, setProducts] = useState<CompareProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Load products from localStorage
    const loadProducts = () => {
      try {
        const storedProducts = localStorage.getItem("compareProducts")
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts))
        }
      } catch (error) {
        console.error("Failed to load compare products:", error)
        toast({
          title: "Error",
          description: "Failed to load comparison products",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  const removeProduct = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem("compareProducts", JSON.stringify(updatedProducts))
    toast({
      title: "Product removed",
      description: "Product removed from comparison",
    })
  }

  const clearAll = () => {
    setProducts([])
    localStorage.removeItem("compareProducts")
    toast({
      title: "Comparison cleared",
      description: "All products removed from comparison",
    })
  }

  const addToCart = async (product: CompareProduct) => {
    setIsAdding(prev => ({ ...prev, [product.id]: true }))
    
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
          description: `${product.name} has been added to your cart`,
        })
      } else {
        throw new Error(data.error || "Failed to add to cart")
      }
    } catch (error) {
      console.error("Add to cart error:", error)
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(prev => ({ ...prev, [product.id]: false }))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
            <p className="mt-2 text-gray-600">
              {products.length === 0
                ? "Add products to compare their features side by side"
                : `Comparing ${products.length} ${products.length === 1 ? "product" : "products"}`}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.back()}
              className="border-gray-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {products.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAll}
                className="border-gray-300 text-red-600 hover:text-red-700"
              >
                <X className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">No products to compare</h2>
            <p className="mt-2 text-gray-600 max-w-md">
              Browse our products and add items to compare their features side by side
            </p>
            <Button 
              asChild 
              className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-500"
            >
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[768px]">
              {/* Product Cards */}
              <div className="grid grid-cols-1" style={{ 
                gridTemplateColumns: `200px repeat(${products.length}, minmax(220px, 1fr))` 
              }}>
                {/* Labels Column */}
                <div className="pt-[220px]">
                  <div className="h-12 font-medium text-gray-700 flex items-center">Product</div>
                  <div className="h-12 font-medium text-gray-700 flex items-center">Price</div>
                  <div className="h-12 font-medium text-gray-700 flex items-center">Rating</div>
                  <div className="h-12 font-medium text-gray-700 flex items-center">Availability</div>
                  <div className="h-12 font-medium text-gray-700 flex items-center">Category</div>
                  <div className="h-12 font-medium text-gray-700 flex items-center">Material</div>
                  <div className="h-12 font-medium text-gray-700 flex items-center">Color Options</div>
                  <div className="h-12 font-medium text-gray-700 flex items-center">Size Options</div>
                  <div className="h-12 font-medium text-gray-700 flex items-center">Shipping</div>
                </div>
                
                {/* Product Columns */}
                {products.map((product) => (
                  <div key={product.id} className="border-l border-gray-200">
                    {/* Product Header */}
                    <div className="relative bg-white p-4 h-[220px] border-b border-gray-200">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 mb-4">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Link 
                          href={`/products/${product.productId}`}
                          className="text-center font-medium text-indigo-600 hover:text-indigo-800 line-clamp-2"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="bg-white px-4 h-12 flex items-center border-b border-gray-200">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    
                    <div className="bg-white px-4 h-12 flex items-center border-b border-gray-200">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="h-4 w-4 text-yellow-400" 
                            fill={star <= 4 ? "currentColor" : "none"}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">4.0</span>
                      </div>
                    </div>
                    
                    <div className="bg-white px-4 h-12 flex items-center border-b border-gray-200">
                      <span className="text-sm font-medium px-2 py-1 rounded bg-green-100 text-green-800">
                        In Stock
                      </span>
                    </div>
                    
                    <div className="bg-white px-4 h-12 flex items-center border-b border-gray-200">
                      <span className="text-sm text-gray-700">Clothing</span>
                    </div>
                    
                    <div className="bg-white px-4 h-12 flex items-center border-b border-gray-200">
                      <span className="text-sm text-gray-700">Cotton Blend</span>
                    </div>
                    
                    <div className="bg-white px-4 h-12 flex items-center border-b border-gray-200">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    
                    <div className="bg-white px-4 h-12 flex items-center border-b border-gray-200">
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100">S</span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100">M</span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100">L</span>
                      </div>
                    </div>
                    
                    <div className="bg-white px-4 h-12 flex items-center border-b border-gray-200">
                      <span className="text-sm text-green-600">Free Shipping</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="bg-white p-4 flex justify-center">
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={isAdding[product.id]}
                        className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {isAdding[product.id] ? "Adding..." : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}