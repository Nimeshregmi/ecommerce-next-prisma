import Link from "next/link"
import Image from "next/image"

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

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.categoryId}`}
          className="group overflow-hidden rounded-md shadow-sm transition-all hover:shadow-md"
        >
          <div className="relative aspect-square overflow-hidden">
            {category.image ? (
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.categoryName}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Image
                src={`/placeholder.svg?height=300&width=300&text=${category.categoryName}`}
                alt={category.categoryName}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
          <div className="p-3 text-center">
            <h3 className="text-sm font-medium">{category.categoryName}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
