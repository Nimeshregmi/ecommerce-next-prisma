import ProductCard from "@/components/products/product-card"
import Link from "next/link"
import { Button } from "../ui/button"

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
  image?: string | null
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return null
  }

  return (
    <>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    {products.length > 8 && (
      <Link
        href="/products"
        className="flex items-center justify-center h-auto w-auto my-4 overflow-hidden rounded-2xl  transition duration-200"
      >
        <Button >
          View All Products
        </Button>
      </Link>
    )}</>
  )
}
