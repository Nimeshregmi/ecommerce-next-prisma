import Hero from "@/components/home/hero"
import CategoryGrid from "@/components/home/category-grid"
import FeaturedProducts from "@/components/home/featured-products"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  // Fetch categories from the database
  const categories = await prisma.productCategory.findMany({
    take: 8,
    orderBy: {
      categoryName: "asc",
    },
  })

  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    where: {
      productStatus: "active",
    },
    take: 8,
    orderBy: {
      productPrice: "desc", // Just an example, you might want to add a "featured" field
    },
  })

  return (
    <div className="flex flex-col items-center">
      <Hero />

      {categories.length > 0 && (
        <div className="w-full max-w-7xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of premium fashion categories designed to elevate your wardrobe
            </p>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      )}

      <div className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Premium Selection</span>
            <h2 className="text-3xl font-bold mt-2 mb-3">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of products that represent the finest in quality, design, and style
            </p>
          </div>
          <FeaturedProducts products={featuredProducts} />
        </div>
      </div>
    </div>
  )
}
