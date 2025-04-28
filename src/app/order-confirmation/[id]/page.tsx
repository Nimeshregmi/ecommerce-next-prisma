import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Check, ShoppingBag, Calendar, CreditCard, Package } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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

  if (!order) {
    notFound()
  }

  // Calculate order total
  const orderTotal = order.orderDetails.reduce((total, item) => total + item.subtotal, 0)

  // Get status color based on order status
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-md">
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </div>
        
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Order Confirmed!</h1>
        <p className="mb-2 max-w-lg text-lg text-muted-foreground">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        <p className="text-sm text-muted-foreground">
          You will receive an email confirmation at {user.email || "your registered email"}
        </p>
      </div>

      <Card className="mb-8 overflow-hidden border-0 bg-card/50 shadow-md">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold">Order Summary</h2>
            <Badge variant="outline" className={`${getStatusColor(order.status)} mt-2 px-3 py-1 text-sm font-medium uppercase sm:mt-0`}>
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid divide-y">
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
              <div className="flex items-start space-x-4">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                  <p className="font-medium">{order.orderId}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Placed</p>
                  <p className="font-medium">{formatDate(order.dateCreated)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="font-medium">${orderTotal.toFixed(0)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Package className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Delivery</p>
                  <p className="font-medium">{formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}</p>
                </div>
              </div>
            </div>

            {order.shippingInfo && (
              <div className="p-6">
                <h3 className="mb-4 text-lg font-medium">Shipping Information</h3>
                <div className="rounded-md bg-muted/30 p-4">
                  <p className="font-medium">Shipping Type: {order.shippingInfo.shippingType}</p>
                  <p className="mt-1 text-muted-foreground">
                    Shipping Cost: ${order.shippingInfo.shippingCost.toFixed(0)}
                  </p>
                  <p className="text-muted-foreground">Shipping ID: {order.shippingInfo.shippingId}</p>
                  <p className="mt-1 text-muted-foreground">Region ID: {order.shippingInfo.shippingRegionId}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button 
          asChild 
          variant="outline" 
          className="border-2 px-6 py-5 text-sm font-medium transition-all hover:bg-muted/30"
        >
          <Link href="/order-history">View Order History</Link>
        </Button>
        <Button 
          asChild 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-sm font-medium shadow-md transition-all hover:shadow-lg"
        >
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          Need help with your order? <Link href="/help" className="font-medium underline underline-offset-4">Contact Support</Link>
        </p>
      </div>
    </div>
  )
}
