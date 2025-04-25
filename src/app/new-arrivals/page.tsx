import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import ProductCard from "@/components/products/product-card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const metadata: Metadata = {
  title: "New Arrivals | Fashion Fuel",
  description: "Discover the latest additions to our collection. Shop new arrivals now.",
}

export default async function NewArrivalsPage() {
  // Fetch products sorted by creation date (newest first)
  const products = await prisma.product.findMany({
    where: {
      productStatus: "active",
    },
    orderBy: {
      // In Prisma, 'id' can be used as a proxy for creation time since UUIDs are sequential
      id: "desc",
    },
    include: {
      category: true,
    },
    take: 24, // Limit to avoid overwhelming the page
  });

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-40 bg-[url('/images/hero.jpg')] bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 px-3 py-1 bg-white/90 text-black font-medium">JUST ARRIVED</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">New Arrivals</h1>
          <p className="max-w-2xl mx-auto text-lg text-white/90 mb-6">
            Be the first to discover our latest styles and newest fashion trends
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Latest Products</h2>
            <p className="text-gray-600 mt-1">Discover what's new and trending</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/products" 
              className="text-primary hover:text-primary/80 font-medium flex items-center"
            >
              View all products
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-medium mb-2">No new products available</h3>
            <p className="text-gray-600 mb-6">Check back soon for our latest additions!</p>
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-black text-white">New</Badge>
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Looking for more options?</p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}