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
import { Heart, ExternalLink, Package, ShoppingBag, Sparkles, ArrowRight, ChevronRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import RemoveFromWishlistButton from "@/components/wishlist/remove-from-wishlist-button"
import CartButtonClient from "./cart-button-client"
import BackToTopButton from "@/components/ui/back-to-top-button"

export const metadata: Metadata = {
  title: "Wishlist | Fashion Fuel",
  description: "Your saved items",
}

// Define proper types for wishlist items with product relationship
type Product = {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  image?: string | null;
}

type WishlistItem = {
  id: string;
  wishlistId: string;
  productId: string;
  addedAt: Date;
  product: Product;
}

export default async function WishlistPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get customer from user
  const customer = await prisma.customer.findFirst({
    where: {
      user: {
        id: user.id
      }
    }
  })

  if (!customer) {
    throw new Error("Customer not found")
  }

  // Get or create customer wishlist
  let wishlist = await prisma.wishlist.findFirst({
    where: { customerId: customer.id }
  })

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { customerId: customer.id }
    })
  }

  // Get wishlist items with product information
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { 
      wishlistId: wishlist.id 
    },
    include: {
      product: true,
    }
  }) as unknown as WishlistItem[]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section with modern gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        <div className="absolute inset-0 opacity-20 mix-blend-multiply">
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="hero-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(7)"
              >
                <rect width="100%" height="100%" fill="none" />
                <path
                  d="M0 20h40M20 0v40"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeOpacity="0.1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>
        <div className="container mx-auto px-6 py-8 relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-pink-100 mb-4 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Your Personal Collection
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-white animate-fade-in">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-pink-100">Wishlist</span>
          </h1>
          <p className="text-pink-100/90 max-w-2xl text-lg md:text-xl animate-fade-in-delay leading-relaxed">
            Your personally curated collection of favorites, ready to elevate your style whenever you're ready.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-white"></div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Stats bar with glassmorphic design */}
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-10 transform -mt-10 relative z-20 border border-gray-100/50 flex flex-wrap justify-between items-center transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center space-x-4 group">
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3.5 rounded-2xl text-white transform transition-transform duration-300 group-hover:scale-110">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{wishlistItems.length}</p>
              <p className="text-gray-500 text-sm font-medium">Saved items</p>
            </div>
          </div>

          <div className="hidden md:block h-14 w-px bg-gradient-to-b from-gray-100 to-gray-200"></div>

          <div className="flex items-center space-x-4 group">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3.5 rounded-2xl text-white transform transition-transform duration-300 group-hover:scale-110">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">Ready to shop?</p>
              <p className="text-gray-500 text-sm font-medium">Add items to your cart</p>
            </div>
          </div>

          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-200 transition-all duration-300 px-7">
            <Link href="/products" className="flex items-center gap-2">
              Continue Shopping
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-lg p-10 text-center max-w-3xl mx-auto my-16 border border-gray-100 animate-fade-in-up">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-pink-300/30 animate-ping rounded-full opacity-75"></div>
                <div className="rounded-full bg-gradient-to-br from-pink-500 to-rose-600 p-8 relative">
                  <Heart className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-3">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-500">Your wishlist is waiting</h2>
              <p className="text-gray-600 mb-10 max-w-md leading-relaxed text-lg">
                Start adding items you love to your wishlist. Look for the heart icon on products to save them for later.
              </p>
              
              <Button asChild size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 py-7 rounded-full font-medium text-lg shadow-xl hover:shadow-purple-200/50 transition-all duration-300">
                <Link href="/products" className="flex items-center gap-2">
                  <span>Discover Products</span>
                  <ArrowRight className="h-5 w-5 ml-1 animate-pulse" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlistItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="group overflow-hidden border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {item.product.image ? (
                      <>
                        <Image 
                          src={item.product.image}
                          alt={item.product.productName}
                          fill
                          className="object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <Package className="h-20 w-20 opacity-40" />
                      </div>
                    )}
                    
                    {/* Badge for discount or new tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black/80 text-white backdrop-blur-md">
                        New In
                      </span>
                    </div>
                    
                    <div className="absolute top-3 right-3 z-10">
                      <RemoveFromWishlistButton itemId={item.id} />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          asChild
                          className="bg-white/90 hover:bg-white text-black shadow-xl rounded-xl hover:scale-105 transition-all duration-300"
                        >
                          <Link href={`/products/${item.product.id}`} className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-1.5" />
                            Quick View
                          </Link>
                        </Button>
                        
                        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-green-500/90 text-white backdrop-blur-md">
                          In Stock
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="px-4 pb-4 pt-2">
                    <Link href={`/products/${item.product.id}`} className="block group-hover:underline-offset-4">
                      <h3 className="font-medium text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-purple-700 transition-colors duration-300">
                        {item.product.productName}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center gap-5 mb-3">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(item.product.productPrice)}</span>
                
                      </div>
                      <CartButtonClient 
                        productId={item.product.id.toString()} 
                        price={item.product.productPrice}
                        name={item.product.productName}
                        image={item.product.image || ''}
                      />
                    </div>
                    
                    {/* Color options indicator */}
                    <div className="flex items-center mt-3 mb-2">
                      <div className="flex -space-x-1 mr-3">
                        {[...Array(4)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-4 h-4 rounded-full border border-white ring-1 ring-gray-100 shadow-sm`}
                            style={{ 
                              backgroundColor: ['#333', '#6366F1', '#EC4899', '#FBBF24'][i % 4],
                              transform: `translateX(${i * 0.25}rem)` 
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">+4 colors</span>
                    </div>
                    
                    {/* Ratings component */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? 'text-amber-400' : 'text-gray-300'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}

                      </div>
                      <span className="text-xs text-gray-500">4.0 (24 reviews)</span>
                    </div>
                    
                    {/* Add a progress bar to create urgency */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 flex justify-between mb-1">
                        <span>Selling fast</span>
                        <span className="font-medium">65% claimed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-pink-500 h-1.5 rounded-full" 
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            </div>

            {/* Add a feature section at the bottom */}
            <div className="mt-20 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8 max-w-md">
                  <h3 className="text-2xl font-bold mb-3 text-indigo-800">Save for Later, Shop Better</h3>
                  <p className="text-gray-600 mb-4">Create multiple wishlists for different occasions, share them with friends, or move all items to your cart with one click.</p>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                    Learn about wishlists
                  </Button>
                </div>
                <div className="flex flex-wrap gap-5 justify-center">
                  <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 w-40 text-center">
                    <div className="rounded-full bg-indigo-100 p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <Heart className="h-7 w-7 text-indigo-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">Save Favorites</h4>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 w-40 text-center">
                    <div className="rounded-full bg-purple-100 p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <ShoppingBag className="h-7 w-7 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">Shop Later</h4>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 w-40 text-center">
                    <div className="rounded-full bg-pink-100 p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-7 w-7 text-pink-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-800">Share Lists</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Top button */}
            <div className="flex justify-center mt-16">
              <BackToTopButton />
            </div>
          </div>
        )}
      </div>
      
      {/* New personalized recommendations section */}
      {wishlistItems.length > 0 && (
        <div className="container mx-auto px-4 py-16 mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">You might also like</h2>
              <p className="text-gray-600 mt-1">Personalized recommendations based on your wishlist</p>
            </div>
            <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-colors duration-300">
              <Link href="/products" className="flex items-center gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 h-72 animate-pulse"></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
