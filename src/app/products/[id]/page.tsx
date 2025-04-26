import { notFound } from "next/navigation"
import { Star, Heart, Share2, ShoppingBag, ChevronRight, Truck, RefreshCw, Shield } from "lucide-react"
import AddToCartButton from "@/components/products/add-to-cart-button"
import { getProductById } from "@/lib/data/products"
import { formatCurrency } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: "Product Not Found | Fashion Fuel",
    }
  }

  return {
    title: `${product.productName} | Fashion Fuel`,
    description: `Shop ${product.productName} at Fashion Fuel`,
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="bg-gray-50/50">
      {/* Breadcrumb navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href="/products" className="hover:text-gray-900">Products</Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-gray-900 font-medium truncate">{product.productName}</span>
          </nav>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left side - Product Image */}
          <div className="md:sticky md:top-20">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative aspect-square">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.productName}
                    width={800}
                    height={400}
                    // fill
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-gray-100 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary/70 tracking-tight">
                      Fashion Fuel
                    </div>
                  </div>
                )}
                
                {/* Floating quick actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 bg-white/90 hover:bg-white shadow-sm text-gray-700">
                    <Heart className="h-[18px] w-[18px]" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 bg-white/90 hover:bg-white shadow-sm text-gray-700">
                    <Share2 className="h-[18px] w-[18px]" />
                  </Button>
                </div>
                
                {/* Product tag/badge if needed */}
                {product.productStatus === "new" && (
                  <Badge className="absolute top-4 left-4 bg-primary text-white font-medium">
                    NEW
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side - Product Details */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-primary font-medium">Fashion Collection</p>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">4.0 (24 reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.productName}</h1>
                
                <div className="mt-4 flex items-center space-x-4">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">
                    {formatCurrency(product.productPrice)}
                  </span>
                  {product.productPrice > 70 && (
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                      Free Shipping
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Color selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Color</h3>
                <div className="flex gap-3">
                  <button className="h-10 w-10 rounded-full border-2 border-white cursor-pointer outline-2 outline-primary shadow-sm bg-black"></button>
                  <button className="h-10 w-10 rounded-full border-2 border-white cursor-pointer shadow-sm bg-[#5D4037]"></button>
                  <button className="h-10 w-10 rounded-full border-2 border-white cursor-pointer shadow-sm bg-[#546E7A]"></button>
                </div>
              </div>
              
              {/* Size selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
                  <Link href="#" className="text-sm text-primary hover:underline">Size Guide</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      className="flex h-11 min-w-[2.75rem] cursor-pointer items-center justify-center rounded-md border border-gray-200 px-3 text-sm font-medium transition-colors hover:bg-gray-50"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Add to cart */}
              <div className="flex flex-col space-y-3">
                <AddToCartButton product={product} />
                
               
              </div>
              
              {/* Product info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="text-sm leading-relaxed text-gray-600">
                    <p>
                      This premium {product.productName} is designed for comfort and style, 
                      perfect for everyday wear. Made with quality materials that will last,
                      this piece is a must-have addition to your wardrobe.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-2">
                    <div className="grid grid-cols-2 text-sm">
                      <div className="py-2 text-gray-500">Material</div>
                      <div className="py-2 font-medium text-gray-900">100% Cotton</div>
                      
                      <div className="py-2 text-gray-500">Style</div>
                      <div className="py-2 font-medium text-gray-900">Casual</div>
                      
                      <div className="py-2 text-gray-500">Care</div>
                      <div className="py-2 font-medium text-gray-900">Machine Wash</div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="shipping" className="space-y-4 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Free Shipping</p>
                        <p>On orders over $100</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Secure Checkout</p>
                        <p>100% protected payments</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
