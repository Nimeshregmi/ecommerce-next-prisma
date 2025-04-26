import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import CustomersTable from "@/components/admin/customers-table"
import AdminLayout from "@/components/admin/admin-layout"

export const metadata: Metadata = {
  title: "Manage Customers | Admin Dashboard | Fashion Fuel",
  description: "Manage customers for your Fashion Fuel store",
}

export default async function AdminCustomersPage() {
  // Check if user is authenticated and is an admin
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  // Fetch customers
  const customers = await prisma.customer.findMany({
    include: {
      user: {
        select: {
          id: true,
          role: true,
          loginStatus: true,
        },
      },
    },
    orderBy: {
      customerName: "asc",
    },
  })

  return (
    <AdminLayout>
      <h1 className="mb-8 text-2xl font-bold">Manage Customers</h1>
      <CustomersTable initialCustomers={customers} />
    </AdminLayout>
  )
}
