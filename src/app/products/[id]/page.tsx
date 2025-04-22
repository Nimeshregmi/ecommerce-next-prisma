import { notFound } from "next/navigation"
import Image from "next/image"
import { Star } from "lucide-react"
import AddToCartButton from "@/components/products/add-to-cart-button"
import { getProductById } from "@/lib/data/products"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: "Product Not Found | Fashion Fuel",
    }
  }

  return {
    title: `${product.productName} | Fashion Fuel`,
    description: `Shop ${product.productName} at Fashion Fuel`,
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 md:col-span-1">
          <div className="relative aspect-square overflow-hidden rounded-md">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt={product.productName}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-1">
          <div className="relative aspect-square overflow-hidden rounded-md">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt={product.productName}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex flex-col space-y-4">
            <div>
              <p className="text-sm text-gray-500">Men / Outerwear</p>
              <h1 className="text-2xl font-bold">{product.productName}</h1>
            </div>

            <div className="text-xl font-semibold">RS.{product.productPrice.toFixed(0)}</div>

            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">(0 Reviews)</span>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Color</h3>
              <div className="flex gap-2">
                <button className="h-8 w-8 rounded-full border border-gray-300 bg-black"></button>
                <button className="h-8 w-8 rounded-full border border-gray-300 bg-[#5D4037]"></button>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Size</h3>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-sm"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <a href="#" className="mt-2 text-sm text-gray-500 underline">
                Size Guide
              </a>
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
