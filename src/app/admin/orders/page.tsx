import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import AdminOrdersTable from "@/components/admin/orders-table"
import AdminLayout from "@/components/admin/admin-layout"

export const metadata: Metadata = {
  title: "Manage Orders | Admin Dashboard | Fashion Fuel",
  description: "Manage customer orders for your Fashion Fuel store",
}

export default async function AdminOrdersPage() {
  // Check if user is authenticated and is an admin
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  // Fetch recent orders
  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: {
      dateCreated: "desc",
    },
    include: {
      orderDetails: true,
    },
  })

  return (
    <AdminLayout>
      <h1 className="mb-8 text-2xl font-bold">Manage Orders</h1>
      <AdminOrdersTable initialOrders={orders} />
    </AdminLayout>
  )
}
