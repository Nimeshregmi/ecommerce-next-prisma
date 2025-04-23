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
        <div className="w-full max-w-7xl px-4 py-12">
          <h2 className="mb-8 text-center text-2xl font-medium">Shop by Category</h2>
          <CategoryGrid categories={categories} />
        </div>
      )}

      <div className="w-full max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-medium">Featured Products</h2>
        <FeaturedProducts products={featuredProducts} />
      </div>
    </div>
  )
}
