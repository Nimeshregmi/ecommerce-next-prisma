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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-16">
      {/* Hero Banner */}
      <div className="relative mb-12 overflow-hidden">
        <div className="relative h-[300px] w-full md:h-[400px]">
          {category.image ? (
            <>
              <img
                src={category.image}
                alt={category.categoryName}
                className=" object-fill object-center"
                width={1920}
                height={1080}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/30" />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <div className="absolute inset-0 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                  <defs>
                    <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="2" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#pattern)" />
                </svg>
              </div>
            </div>
          )}
          
          {/* Category Info Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-3xl">
              <div className="inline-block rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium text-gray-800 backdrop-blur-sm">
                Collection
              </div>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl">
                {category.categoryName}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/90 drop-shadow-md">
                Discover our collection of {category.categoryName.toLowerCase()} designed for style and comfort.
              </p>
              <div className="mt-6 inline-flex rounded-md bg-white/90 px-3.5 py-1.5 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-sm">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className="mx-auto mb-8 max-w-7xl px-4">
        <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-1 h-4 w-4">
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
                <Link href="/categories" className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">Categories</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
                <span className="ml-1 text-gray-600 md:ml-2">{category.categoryName}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4">
        {/* Product count & sorting options */}
        <div className="mb-8 flex flex-col items-center justify-between border-b border-gray-200 pb-5 sm:flex-row">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            {products.length > 0 ? `${products.length} Products` : 'Products'}
          </h2>
          <div className="mt-4 sm:mt-0">
            {/* This is just a placeholder for design, not functional */}
            <div className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span>Sort by: </span>
              <span className="ml-1 font-medium">Latest</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="mx-auto max-w-md rounded-xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-full w-full text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-medium">No products found</h2>
            <p className="mb-8 text-gray-500">We're working on adding new products to this category soon.</p>
            <Link
              href="/categories"
              className="inline-flex items-center rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Browse Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
