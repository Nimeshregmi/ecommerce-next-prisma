import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import AdminCategoriesTable from "@/components/admin/categories-table"
import AdminLayout from "@/components/admin/admin-layout"

export const metadata: Metadata = {
  title: "Manage Categories | Admin Dashboard | Fashion Fuel",
  description: "Manage product categories for your Fashion Fuel store",
}

export default async function AdminCategoriesPage() {
  // Check if user is authenticated and is an admin
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  // Fetch categories
  const categories = await prisma.productCategory.findMany({
    orderBy: {
      categoryName: "asc",
    },
  })

  return (
    <AdminLayout>
      <h1 className="mb-8 text-2xl font-bold">Manage Categories</h1>
      <AdminCategoriesTable initialCategories={categories} />
    </AdminLayout>
  )
}
