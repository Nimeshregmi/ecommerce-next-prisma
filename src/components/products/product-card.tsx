import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@prisma/client'
import AddToCartButton from './add-to-cart-button'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${product.productId}`} className="block aspect-square overflow-hidden">
        {/* Placeholder image - in a real app, use actual product images */}
        <div className="relative h-64 w-full bg-gray-100">
          <div className="flex h-full items-center justify-center text-gray-400">
            <span className="absolute text-sm">Product Image</span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="mb-1 text-base font-medium line-clamp-1">
          <Link href={`/products/${product.productId}`} className="hover:text-primary">
            {product.productName}
          </Link>
        </h3>
        
        <div className="mb-3 flex items-center justify-between">
          <span className="font-medium text-primary">${product.productPrice.toFixed(2)}</span>
          {product.productStatus !== 'active' && (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
              {product.productStatus}
            </span>
          )}
        </div>

        <AddToCartButton product={product} />
      </div>
    </div>
  )
}
