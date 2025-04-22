import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import ProductCard from "@/components/products/product-card"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: CategoryPageProps
): Promise<Metadata> {
  const categoryId = params.slug
  
  const category = await prisma.productCategory.findUnique({
    where: { categoryId }
  })
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }
  
  return {
    title: `${category.categoryName} | Fashion Fuel`,
    description: `Browse all ${category.categoryName} products in our collection`
  }
}

async function getCategoryWithProducts(categoryId: string) {
  // Fetch category and its products
  const category = await prisma.productCategory.findUnique({
    where: { categoryId },
    include: {
      products: true
    }
  })
  
  return category
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = params.slug
  const category = await getCategoryWithProducts(categoryId)
  
  if (!category) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.categoryName}</h1>
      
      {category.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {category.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-medium text-gray-600">No products found in this category</h2>
          <p className="mt-2 text-gray-500">Check back soon as we update our inventory regularly</p>
        </div>
      )}
    </div>
  )
}