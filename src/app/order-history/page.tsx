import { getCurrentUser } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Eye, ShoppingBag, Clock, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrderHistoryPage() {
  // Get current user
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/sign-in");
  }
  
  // First get the customer record associated with the user
  const customer = await prisma.customer.findFirst({
    where: {
      userId: user.id,
    },
  });
  
  if (!customer) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Order History</CardTitle>
            <CardDescription>Your past purchases</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-12">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Customer profile not found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please contact customer support for assistance.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Now fetch orders for the customer
  const orders = await prisma.order.findMany({
    where: {
      customerId: customer.id,
    },
    orderBy: {
      dateCreated: 'desc',
    },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
      shippingInfo: true,
    },
  });

  // Calculate order totals
  const ordersWithTotals = orders.map(order => {
    const total = order.orderDetails.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    return { ...order, total };
  });

  // Get stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === "completed").length;
  const totalSpent = ordersWithTotals.reduce((sum, order) => 
    sum + order.orderDetails.reduce((itemSum, detail) => itemSum + detail.subtotal, 0), 0
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Order History</h1>
          <p className="mt-2 text-gray-600">
            Track and manage all your previous purchases
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <h3 className="text-2xl font-bold text-gray-900">{completedOrders}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {orders.length === 0 ? (
          <Card className="bg-white shadow-sm text-center">
            <CardContent className="p-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                When you make a purchase, your orders will appear here.
              </p>
              <Button className="mt-6" size="lg" asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white shadow overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl">Order History</CardTitle>
              <CardDescription>
                A list of all your past orders and their details
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersWithTotals.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-100 mr-3 flex items-center justify-center">
                            <ShoppingBag className="h-4 w-4 text-gray-500" />
                          </div>
                          {order.orderId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(order.dateCreated).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(order.dateCreated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {order.orderDetails.length}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            {order.orderDetails.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild className="hover:bg-gray-100">
                          <Link href={`/order-confirmation/${order.id}`}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// Helper component for order status badge
function OrderStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
          <span className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
            Completed
          </span>
        </Badge>
      );
    case "shipped":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
          <span className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
            Shipped
          </span>
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
          <span className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
            Pending
          </span>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
          <span className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></span>
            Cancelled
          </span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <span className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500 mr-1.5"></span>
            {status}
          </span>
        </Badge>
      );
  }
}
