import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent 
} from "@/components/ui/card"
import { Heart, ShoppingCart, Trash2, ExternalLink, Package } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import RemoveFromWishlistButton from "@/components/wishlist/remove-from-wishlist-button"

export const metadata: Metadata = {
  title: "Wishlist | Fashion Fuel",
  description: "Your saved items",
}

export default async function WishlistPage() {
  // Check if user is authenticated
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get customer from user ID
  const customer = await prisma.customer.findFirst({
    where: {
      userId: user.id,
    },
  })

  if (!customer) {
    redirect("/account")
  }

  // Get or create wishlist
  let wishlist = await prisma.wishlist.findFirst({
    where: { customerId: customer.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: {
        customerId: customer.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
            <p className="mt-2 text-gray-600">
              {wishlist.items.length === 0
                ? "Save items to your wishlist to keep track of products you love"
                : `You have ${wishlist.items.length} ${
                    wishlist.items.length === 1 ? "item" : "items"
                  } in your wishlist`}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-blue-500">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        {wishlist.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-600 max-w-md">
              Browse our products and add items to your wishlist to save them for later
            </p>
            <Button asChild className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-500">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Product Image */}
                <Link href={`/products/${item.product.productId}`} className="block relative h-64 overflow-hidden">
                  <Image
                    src={item.product.image || "/products/image.png"}
                    alt={item.product.productName}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link 
                      href={`/products/${item.product.productId}`} 
                      className="text-lg font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2 transition-colors duration-200"
                    >
                      {item.product.productName}
                    </Link>
                    <RemoveFromWishlistButton itemId={item.id} />
                  </div>
                  
                  <p className="text-lg font-bold text-gray-900 my-2">
                    {formatCurrency(item.product.productPrice)}
                  </p>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      asChild 
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
                    >
                      <Link href={`/products/${item.product.productId}`}>
                        <ExternalLink className="w-4 h-4 mr-2" /> View Item
                      </Link>
                    </Button>
                    
                    <AddToCartButton product={item.product} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Client component for adding to cart
"use client"

import { useState } from "react"

function AddToCartButton({ product }: { product: any }) {
  const [isAdding, setIsAdding] = useState(false)
  
  const addToCart = async () => {
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
      
      if (response.ok) {
        window.location.href = "/cart"
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }
  
  return (
    <Button 
      onClick={addToCart} 
      disabled={isAdding} 
      variant="outline" 
      className="flex-1 border-2 border-gray-300"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  )
}