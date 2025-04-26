import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

type Category = {
  id: string;
  categoryId: string;
  categoryName: string;
  image?: string | null;
};

export default function CategoryGrid({
  categories,
}: {
  categories: Category[];
}) {
  // If no categories are provided, don't render anything
  if (categories.length === 0) {
    return null;
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.slice(0, 4).map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.categoryId}`}
          className="group relative flex h-[400px] w-full overflow-hidden rounded-2xl shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 transition-opacity group-hover:opacity-60 z-10"></div>
          <div className="relative h-full w-full">
            {category.image ? (
              <img
                src={category.image}
                alt={category.categoryName}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-purple-700/80"></div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{category.categoryName}</h3>
            <p className="text-sm text-white/80 mb-4">
              Discover the latest trends
            </p>
            <div className="flex items-center text-sm font-medium">
              <span>Shop Now</span>
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ))}
      
    </div>
    {categories.length > 4 && (
        <Link
          href="/categories"
          className="flex items-center justify-center h-auto w-auto my-4 overflow-hidden rounded-2xl  transition duration-200"
        >
          <Button >
            View All Categories
          </Button>
        </Link>
      )}
    </>
  );
}
