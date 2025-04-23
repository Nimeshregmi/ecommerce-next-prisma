import ProductCard from "@/components/products/product-card"

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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
