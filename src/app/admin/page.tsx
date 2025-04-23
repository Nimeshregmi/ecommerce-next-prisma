import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import AdminDashboard from "@/components/admin/dashboard"
import AdminLayout from "@/components/admin/admin-layout"

export const metadata: Metadata = {
  title: "Admin Dashboard | Fashion Fuel",
  description: "Manage your Fashion Fuel store",
}

export default async function AdminPage() {
  // Check if user is authenticated and is an admin
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }
  console.log(user.role)
  if (user.role !== "admin") {
    redirect("/")
  }

  // Fetch dashboard data
  const [productCount, orderCount, customerCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        dateCreated: "desc",
      },
      include: {
        orderDetails: true,
      },
    }),
  ])

  return (
    <AdminLayout>
      <h1 className="mb-8 text-2xl font-bold">Admin Dashboard</h1>
      <AdminDashboard
        stats={{
          productCount,
          orderCount,
          customerCount,
          recentOrders,
        }}
      />
    </AdminLayout>
  )
}
