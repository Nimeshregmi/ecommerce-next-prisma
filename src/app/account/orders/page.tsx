import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import { getOrdersForCurrentUser } from "@/lib/order-actions"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "My Orders | Fashion Fuel",
  description: "View your order history",
}

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  const orders = await getOrdersForCurrentUser()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="mb-4 text-xl font-medium">No orders found</h2>
          <p className="mb-6 text-gray-500">Looks like you haven't placed any orders yet.</p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h3 className="text-sm text-gray-500">Order Number</h3>
                  <p className="font-medium">{order.orderId}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Date</h3>
                  <p className="font-medium">{new Date(order.dateCreated).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Status</h3>
                  <p className="capitalize font-medium">{order.status}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Total Items</h3>
                  <p className="font-medium">{order.orderDetails.length}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/account/orders/${order.id}`}>View Order</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
