import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Order Confirmation | Fashion Fuel",
  description: "Thank you for your order",
}

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
  // Check if user is authenticated
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Fetch order details from the database
  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      // customerId: user.id,
    },
    include: {
      shippingInfo: true,
      orderDetails: true,
    },
  })
console.log("order", params.id, order)
  if (!order) {
    notFound()
  }

  // Calculate order total
  const orderTotal = order.orderDetails.reduce((total, item) => total + item.subtotal, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <div className="mb-8 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-bold">Thank You For Your Order!</h1>
      <p className="mb-8 text-lg text-gray-600">
        Your order has been placed and is being processed. You will receive an email confirmation shortly.
      </p>

      <div className="mb-8 rounded-lg border p-6 text-left">
        <h2 className="mb-4 text-xl font-medium">Order Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Order Number</p>
            <p className="text-lg">{order.orderId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p className="text-lg">{new Date(order.dateCreated).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Amount</p>
            <p className="text-lg">RS.{orderTotal.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-lg capitalize">{order.status}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button asChild variant="outline">
          <Link href="/account/orders">View Orders</Link>
        </Button>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
