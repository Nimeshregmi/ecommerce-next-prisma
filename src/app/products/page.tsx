"use client"

import { useState, useEffect, SetStateAction } from "react"
// import { useDebounce } from "@/hooks/use-debounce"
import { useSearchParams, useRouter } from "next/navigation"
import ProductCard from "@/components/products/product-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ""
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  
  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 1000)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    
    fetchCategories()
  }, [])

  // Fetch products when search query changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        let url = '/api/products'
        const params = new URLSearchParams()
        
        if (debouncedSearchQuery) {
          params.append('search', debouncedSearchQuery)
          // Update URL with search query for sharing/bookmarking
          router.push(`/products?q=${debouncedSearchQuery}`, { scroll: false })
        } else if (initialQuery) {
          router.push('/products', { scroll: false })
        }
        
        if (activeCategory !== 'all') {
          params.append('category', activeCategory)
        }
        
        params.append('limit', '100') // Request more products for client-side filtering

        const res = await fetch(`${url}?${params.toString()}`)
        const data = await res.json()
        
        if (data.success) {
          setProducts(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [debouncedSearchQuery, activeCategory, initialQuery, router])

  // Handle search input change
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
}
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("")
    router.push('/products', { scroll: false })
  }

  // Handle category change
  const handleCategoryChange = (value: SetStateAction<string>) => {
    setActiveCategory(value)
  }

  // Handle search form submission
  const handleSearchSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    router.push(`/products?q=${searchQuery}`, { scroll: false })
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pb-16">
      {/* Hero Section with Search Bar */}
      <div className="relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-30 bg-[url('/images/hero.jpg')] bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 px-3 py-1 bg-white/90 text-black font-semibold">COLLECTION</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Discover Our Products</h1>
          
          {/* Search Form */}
          <form 
            onSubmit={handleSearchSubmit}
            className="max-w-md mx-auto relative group"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 py-6 border-0 ring-2 ring-white/20 bg-black/20 backdrop-blur-sm 
                           placeholder:text-gray-300 text-white focus:ring-white/50 rounded-full
                           shadow-xl"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                             hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="max-w-7xl mx-auto px-4 pt-8 sm:px-6 lg:px-8">
        {/* Category Filter Tabs */}
        <div className="mb-8 overflow-x-auto pb-2">
          <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
            <TabsList className="bg-white/80 backdrop-blur-sm p-1 shadow-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category:any) => (
                <TabsTrigger key={category.id} value={category.categoryId}>
                  {category.categoryName}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results Section */}
        <div>
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {debouncedSearchQuery ? `Results for "${debouncedSearchQuery}"` : "All Products"}
              </h2>
              <p className="text-gray-600 mt-1">
                {isLoading 
                  ? "Searching products..."
                  : `Showing ${products.length} products`
                }
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </Button>
              <div className="border-r h-6 border-gray-200 mx-2" />
              <Link 
                href="/new-arrivals" 
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                View new arrivals
              </Link>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-lg bg-gray-100 animate-pulse h-72"></div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && products.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-medium mb-2">
                {debouncedSearchQuery 
                  ? `No products found for "${debouncedSearchQuery}"`
                  : "No products available"
                }
              </h3>
              {debouncedSearchQuery && (
                <>
                  <p className="text-gray-600 mb-6">Try using different keywords or check out our categories</p>
                  <Button onClick={handleClearSearch}>Clear Search</Button>
                </>
              )}
              {!debouncedSearchQuery && (
                <p className="text-gray-600 mb-6">Check back soon for new products!</p>
              )}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product:any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {/* Show more button - add pagination or infinite scroll */}
          {!isLoading && products.length > 16 && (
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="font-medium">
                Load more products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}