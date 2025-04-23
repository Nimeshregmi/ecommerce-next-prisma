import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "All Categories | Fashion Fuel",
  description: "Browse all product categories at Fashion Fuel",
}

export default async function CategoriesPage() {
  // Get all categories
  const categories = await prisma.productCategory.findMany({
    orderBy: {
      categoryName: "asc",
    },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">All Categories</h1>
        <p className="text-gray-600">Browse our complete collection of fashion categories.</p>
      </div>

      {categories.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="mb-4 text-xl font-medium">No categories found</h2>
          <p className="mb-8 text-gray-500">We're working on adding categories to our store.</p>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.categoryId}`}
              className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {category.image ? (
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.categoryName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">No image</div>
                )}
              </div>
              <div className="p-4 text-center">
                <h2 className="text-lg font-medium">{category.categoryName}</h2>
                <p className="mt-1 text-sm text-gray-500">Explore collection</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
