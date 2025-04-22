import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Order Details | Fashion Fuel",
  description: "View your order details",
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      customerId: user.id,
    },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
      shippingInfo: true,
    },
  })

  if (!order) {
    notFound()
  }

  // Calculate the total price
  const subtotal = order.orderDetails.reduce((total, item) => total + item.quantity * item.unitPrice, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order.orderId}</h1>
        <Button asChild variant="outline">
          <Link href="/account/orders">Back to Orders</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h2 className="text-lg font-medium">Order Items</h2>
            </div>

            <div className="divide-y">
              {order.orderDetails.map((item) => (
                <div key={item.id} className="flex items-center p-4">
                  <div className="mr-4 h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt={item.product?.productName || "Product"}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">{item.product?.productName || "Product"}</h3>
                      <p className="text-sm font-medium">RS.{item.unitPrice.toFixed(0)}</p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">Total: RS.{(item.quantity * item.unitPrice).toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span>{new Date(order.dateCreated).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="capitalize">{order.status}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>RS.{subtotal.toFixed(0)}</span>
              </div>

              <div className="flex justify-between border-t pt-2 font-medium">
                <span>Total</span>
                <span>RS.{subtotal.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium">Shipping Information</h2>

            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Address</span>
                <p>{order.shippingInfo?.shippingAddress}</p>
              </div>

              <div>
                <span className="text-gray-600">City</span>
                <p>{order.shippingInfo?.city}</p>
              </div>

              <div>
                <span className="text-gray-600">Province/State</span>
                <p>{order.shippingInfo?.state}</p>
              </div>

              <div>
                <span className="text-gray-600">Country</span>
                <p>{order.shippingInfo?.country}</p>
              </div>

              <div>
                <span className="text-gray-600">Postal Code</span>
                <p>{order.shippingInfo?.postalCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
