import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import AdminProductsTable from "@/components/admin/products-table"
import AdminLayout from "@/components/admin/admin-layout"

export const metadata: Metadata = {
  title: "Manage Products | Admin Dashboard | Fashion Fuel",
  description: "Manage products for your Fashion Fuel store",
}

export default async function AdminProductsPage() {
  // Check if user is authenticated and is an admin
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  // Fetch products with categories
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      productName: "asc",
    },
  })

  // Fetch categories for the product form
  const categories = await prisma.productCategory.findMany({
    orderBy: {
      categoryName: "asc",
    },
  })

  return (
    <AdminLayout>
      <h1 className="mb-8 text-2xl font-bold">Manage Products</h1>
      <AdminProductsTable initialProducts={products} categories={categories} />
    </AdminLayout>
  )
}
