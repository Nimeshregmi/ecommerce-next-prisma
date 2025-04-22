import { prisma } from "@/lib/prisma"

export async function getCategories() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: {
        categoryName: "asc",
      },
    })
    return categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.productCategory.findUnique({
      where: {
        id,
      },
    })
    return category
  } catch (error) {
    console.error(`Failed to fetch category with ID ${id}:`, error)
    return null
  }
}
