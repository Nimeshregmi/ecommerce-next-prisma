import Link from "next/link"
import Image from "next/image"

type Category = {
  id: string
  categoryId: string
  categoryName: string
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  // If no categories are provided, use placeholders
  const displayCategories =
    categories.length > 0
      ? categories
      : [
          { id: "1", categoryId: "1", categoryName: "Outerwear" },
          { id: "2", categoryId: "2", categoryName: "Jeans" },
          { id: "3", categoryId: "3", categoryName: "Sweaters" },
          { id: "4", categoryId: "4", categoryName: "Pants" },
          { id: "5", categoryId: "5", categoryName: "T-Shirts" },
          { id: "6", categoryId: "6", categoryName: "Jackets" },
        ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {displayCategories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.categoryId}`}
          className="group overflow-hidden rounded-md"
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={`/placeholder.svg?height=300&width=300&text=${category.categoryName}`}
              alt={category.categoryName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h3 className="mt-2 text-center text-sm font-medium">{category.categoryName}</h3>
        </Link>
      ))}
    </div>
  )
}
