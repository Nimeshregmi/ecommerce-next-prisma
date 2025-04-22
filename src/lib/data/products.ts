import { prisma } from "@/lib/prisma"

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        productName: "asc",
      },
    })
    return products
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    })
    return product
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error)
    return null
  }
}

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data,
    })
    return product
  } catch (error) {
    console.error("Failed to create product:", error)
    throw error
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data,
    })
    return product
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: {
        id,
      },
    })
    return true
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error)
    throw error
  }
}
