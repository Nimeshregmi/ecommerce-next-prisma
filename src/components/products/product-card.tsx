import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
  image?: string | null
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image ? (
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <Image
            src={`/placeholder.svg?height=400&width=400`}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium">{product.productName}</h3>
        <p className="mt-1 text-sm font-semibold">{formatCurrency(product.productPrice)}</p>
      </div>
    </Link>
  )
}
