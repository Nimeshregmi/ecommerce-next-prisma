import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/products/product-card"

type Props = {
  params: { categoryId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.productCategory.findFirst({
    where: {
      categoryId: params.categoryId,
    },
  })

  if (!category) {
    return {
      title: "Category Not Found | Fashion Fuel",
    }
  }

  return {
    title: `${category.categoryName} | Fashion Fuel`,
    description: `Shop ${category.categoryName} at Fashion Fuel`,
  }
}

export default async function CategoryPage({ params }: Props) {
  // Find the category
  const category = await prisma.productCategory.findFirst({
    where: {
      categoryId: params.categoryId,
    },
  })

  if (!category) {
    notFound()
  }

  // Get products for this category
  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      productStatus: "active",
    },
    orderBy: {
      productName: "asc",
    },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">{category.categoryName}</h1>
        <p className="text-gray-600">
          Discover our collection of {category.categoryName.toLowerCase()} designed for style and comfort.
        </p>
      </div>

      {category.image && (
        <div className="mb-12 overflow-hidden rounded-lg">
          <div className="relative h-[300px] w-full">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.categoryName}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="mb-4 text-xl font-medium">No products found</h2>
          <p className="mb-8 text-gray-500">We're working on adding products to this category.</p>
          <Link href="/" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
