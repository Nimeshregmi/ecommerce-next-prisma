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
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OrderHistoryPage() {
  // Get current user
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/sign-in");
  }
  
  // First get the customer record associated with the user
  const customer = await prisma.customer.findFirst({
    where: {
      userId: user.id, // User ID is linked to customer via userId field
    },
  });
  
  if (!customer) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        <div className="bg-gray-50 p-6 text-center rounded-md">
          <p>Customer profile not found. Please contact support.</p>
        </div>
      </div>
    );
  }
  
  // Now fetch orders for the customer
  const orders = await prisma.order.findMany({
    where: {
      customerId: customer.id, // Correctly using customer ID
    },
    orderBy: {
      dateCreated: 'desc', // Latest orders first
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

  // Format status with appropriate styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8 ">
      <h1 className="text-2xl font-bold mb-6 ">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-md">
          <p className="mb-4">You haven't placed any orders yet.</p>
          <Link href="/products" className="text-primary hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
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
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{new Date(order.dateCreated).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.orderDetails.length} items</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/order-confirmation/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
