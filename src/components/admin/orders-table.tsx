"use client"

import { useState, useEffect } from "react"
import { Eye, Check, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { updateOrderStatusAction } from "@/lib/order-actions"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type OrderDetail = {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  unitCost: number
  subtotal: number
}

type Order = {
  id: string
  orderId: string
  dateCreated: string // Changed from Date to string to avoid serialization issues
  dateShipped: string | null
  customerName: string
  status: string
  orderDetails: OrderDetail[]
}

interface OrdersTableProps {
  initialOrders: Order[]
}

  /**
   * Renders a table of orders with search, filtering, and status updating
   * functionality.
   *
   * @param {Order[]} initialOrders - Initial list of orders to display
   * @returns {JSX.Element}
   */
export default function AdminOrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<string>("") 
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter();
  // Handler to open the confirmation dialog when changing status
  const handleStatusChange = (order: Order, status: string) => {
    setSelectedOrder(order)
    setNewStatus(status)
    setIsConfirmDialogOpen(true)
  }

  // Handler to update the order status in the database
  const handleConfirmStatusChange = async () => {
    if (!selectedOrder || !newStatus) return
    
    setIsUpdating(true)
    try {
      // Use the server action instead of the client function
      const result = await updateOrderStatusAction(selectedOrder.id, newStatus)
      
      if (result.success) {
        // Update the orders list with the new status
        setOrders(orders.map(order => 
          order.id === selectedOrder.id ? { ...order, status: newStatus } : order
        ))
        setIsConfirmDialogOpen(false)
      } else {
        alert(`Failed to update status: ${result.error}`)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Handler to close the confirmation dialog
  const handleCancelStatusChange = () => {
    setIsConfirmDialogOpen(false)
    setSelectedOrder(null)
    setNewStatus("")
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // List of possible order statuses
  const orderStatuses = ["pending", "processing", "shipped", "completed", "cancelled"]

  return (
    <div>
      <div className="mb-6">
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center">Loading orders...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>{new Date(order.dateCreated).toLocaleDateString()}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {orderStatuses.map((status) => (
                              <DropdownMenuItem 
                                key={status} 
                                onClick={() => handleStatusChange(order, status)}
                                disabled={order.status === status}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                    <TableCell>{order.orderDetails.length}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          router.push(`/admin/orders/${order.id}`)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Status Change Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of order <strong>{selectedOrder?.orderId}</strong> from{" "}
              <span className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusColor(selectedOrder?.status || "")}`}>
                {selectedOrder?.status}
              </span>{" "}
              to{" "}
              <span className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusColor(newStatus)}`}>
                {newStatus}
              </span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelStatusChange}
              disabled={isUpdating}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span>Updating...</span>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
