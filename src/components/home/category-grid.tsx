import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = {
  id: string
  categoryId: string
  categoryName: string
  image?: string | null
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  // If no categories are provided, don't render anything
  if (categories.length === 0) {
    return null
  }

  // Create a highlight category (first one) and regular categories (rest)
  const [highlight, ...regularCategories] = categories;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Featured category - takes up the whole first row on mobile, 1/3 on desktop */}
      <div className="lg:col-span-1 lg:row-span-2">
        <Link
          href={`/categories/${highlight.categoryId}`}
          className="group relative flex h-full overflow-hidden rounded-2xl shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 transition-opacity group-hover:opacity-60 z-10"></div>
          <div className="relative h-[500px] w-full">
            {highlight.image ? (
              <Image
                src={highlight.image}
                alt={highlight.categoryName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-purple-700/80"></div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{highlight.categoryName}</h3>
            <p className="text-sm text-white/80 mb-4">Discover the latest trends</p>
            <div className="flex items-center text-sm font-medium">
              <span>Shop Now</span>
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>

      {/* Grid of regular categories - takes up 2/3 of desktop space */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {regularCategories.map((category, index) => {
          // Alternate between different card styles for visual interest
          const isAlternate = index % 3 === 0;
          
          return (
            <Link
              key={category.id}
              href={`/categories/${category.categoryId}`}
              className={cn(
                "group relative flex overflow-hidden rounded-2xl shadow-md transition-all hover:shadow-lg",
                isAlternate ? "bg-primary/5" : "bg-gray-50"
              )}
            >
              <div className="flex w-full">
                {/* Text Content */}
                <div className={cn(
                  "p-6 flex flex-col justify-center z-10",
                  isAlternate ? "w-1/3" : "w-full"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full mb-4 flex items-center justify-center",
                    isAlternate ? "bg-primary/10" : "bg-black/5" 
                  )}>
                    <ChevronRight className={cn(
                      "h-5 w-5 transition-transform group-hover:translate-x-1",
                      isAlternate ? "text-primary" : "text-gray-700"
                    )} />
                  </div>
                  <h3 className={cn(
                    "font-bold mb-1",
                    isAlternate ? "text-lg" : "text-xl"
                  )}>
                    {category.categoryName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Explore collection</p>
                  <div className={cn(
                    "text-sm font-medium flex items-center",
                    isAlternate ? "text-primary" : "text-gray-900"
                  )}>
                    Shop Now
                  </div>
                </div>
                
                {/* Image (only for alternate style) */}
                {isAlternate && (
                  <div className="relative w-1/3">
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/30 z-10"></div>
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.categoryName}
                        objectFit=""
                        width={400}
                        height={400}
                        className="object-contain object-center transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-400/30"></div>
                    )}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  )
}
