import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Payment Success | Fashion Fuel",
  description: "Your payment was successful",
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  // Check if user is authenticated
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get session ID from URL params
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect("/checkout")
  }

  // Get order by session ID (which is stored as orderId)
  const order = await prisma.order.findUnique({
    where: { orderId: sessionId },
    include: {
      orderDetails: true,
      shippingInfo: true,
    },
  })

  // If order not found or doesn't belong to current user, redirect
  if (!order) {
    redirect("/checkout")
  }

  // Calculate total amount
  const total = order.orderDetails.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="max-w-md text-gray-600">
              Thank you for your order. We've received your payment and are processing your order.
            </p>

            <div className="mt-2 rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium">
              Order ID: {order.orderId}
            </div>
          </div>

          <div className="mt-8 border-t pt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Order Summary</h2>

            <div className="space-y-4">
              {order.orderDetails.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="rounded-md bg-gray-100 p-2">
                      <ShoppingBag className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.unitCost}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">${item.subtotal}</p>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <p>Total</p>
                  <p>${total}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center space-y-4">
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your registered email address.
            </p>
            <div className="flex space-x-4">
              <Button asChild variant="outline">
                <Link href="/order-history">View Order History</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-indigo-600 to-blue-500">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}