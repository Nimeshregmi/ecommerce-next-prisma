import Hero from "@/components/home/hero"
import CategoryGrid from "@/components/home/category-grid"
import { getCategories } from "@/lib/data/categories"

export default async function Home() {
  const categories = await getCategories()

  return (
    <div className="flex flex-col items-center">
      <Hero />
      <div className="w-full max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-medium">Shop by Category</h2>
        <CategoryGrid categories={categories} />
      </div>
    </div>
  )
}
