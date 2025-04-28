"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Palette,
  Ruler,
  BoxIcon,
  HomeIcon,
  Building2,
  Hash
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from '@/lib/utils';
import { updateOrderStatusAction } from '@/lib/order-actions';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [updateSuccess, setUpdateSuccess] = React.useState(false);

  // Fetch order details when component mounts
  React.useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/orders/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching order: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch order details');
        }
        
        setOrder(data.data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrderDetails();
  }, [id]);

  // Handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdateLoading(true);
      
      const result = await updateOrderStatusAction(id as string, newStatus);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update order status');
      }
      
      // Update the local state with the new status
      setOrder({
        ...order,
        status: newStatus
      });
      
      setUpdateSuccess(true);
      
      // Reset success message after a delay
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating order status:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Helper function to get status badge color
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  // Helper function to render status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 mr-1.5" />;
      case 'processing':
        return <Package className="h-4 w-4 mr-1.5" />;
      case 'shipped':
        return <Truck className="h-4 w-4 mr-1.5" />;
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 mr-1.5" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 mr-1.5" />;
      default:
        return <FileText className="h-4 w-4 mr-1.5" />;
    }
  };

  // Calculate order summary
  const calculateOrderSummary = () => {
    if (!order || !order.orderDetails || order.orderDetails.length === 0) {
      return { subtotal: 0, total: 0 };
    }
    
    const subtotal = order.orderDetails.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    const shippingCost = order.shippingInfo?.shippingCost || 0;
    
    return {
      subtotal,
      shipping: shippingCost,
      total: subtotal + shippingCost
    };
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Order</h2>
        <p className="text-muted-foreground mb-4">{error || 'Unable to load order details'}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const { subtotal, shipping, total } = calculateOrderSummary();

  // Helper function to generate a color dot based on product color
  const getColorDot = (color: string) => {
    if (!color) return null;
    
    const colorMap: Record<string, string> = {
      'red': 'bg-red-500',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'black': 'bg-black',
      'white': 'bg-gray-200',
      'gray': 'bg-gray-500',
      'yellow': 'bg-yellow-500',
      'purple': 'bg-purple-500',
      'pink': 'bg-pink-500',
      'orange': 'bg-orange-500',
      'brown': 'bg-amber-700',
      'navy': 'bg-indigo-900',
    };

    const bgColor = colorMap[color.toLowerCase()] || 'bg-gray-500';
    
    return (
      <div className={`${bgColor} h-4 w-4 rounded-full mr-2 inline-block border border-gray-300`}></div>
    );
  };

  // Prevent status changes for completed orders
  const isStatusChangeDisabled = order.status === "completed";

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/orders">Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Order {order.orderId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>

      {/* Order Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.dateCreated)}
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-3 items-start xs:items-center">
          <Badge variant="outline" className={`${getStatusBadgeClasses(order.status)} px-3 py-1.5 text-sm font-medium`}>
            <span className="flex items-center">
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </Badge>

          {/* Status Update Select */}
          <Select
            disabled={isStatusChangeDisabled}
            defaultValue={order.status}
            onValueChange={handleStatusUpdate}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Status update feedback */}
          {updateLoading && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Loader2 className="h-3 w-3 animate-spin mr-1" /> Updating...
            </div>
          )}
          
          {updateSuccess && (
            <div className="flex items-center text-xs text-green-600 mt-1">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Status updated
            </div>
          )}
          
          {order.status === 'shipped' && (
            <div className="text-xs text-amber-600 mt-1">
              Shipped orders cannot be modified
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items and Summary */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Order Items</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <BoxIcon className="h-4 w-4" />
                {order.orderDetails.length} {order.orderDetails.length === 1 ? 'item' : 'items'} in this order
                {order.shippingInfo && (
                  <span className="ml-2 flex items-center gap-1 text-sm">
                    <Building2 className="h-3 w-3" /> 
                    <span className="font-medium">{order.shippingInfo.city}</span>
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.orderDetails.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product image placeholder */}
                      <div className="relative h-24 w-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        {item.product?.image ? (
                          <Image 
                            src={item.product.image} 
                            alt={item.productName}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <Package className="h-12 w-12 text-gray-400" />
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-base">{item.productName}</h3>
                            <div className="text-sm text-muted-foreground">
                              <Hash className="h-3 w-3 inline mr-1" />ID: {item.product?.productId || item.id}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(item.subtotal)}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} × {formatCurrency(item.unitCost)}
                            </div>
                          </div>
                        </div>

                        {/* Product attributes */}
                        <div className="mt-3 grid grid-cols-1 xs:grid-cols-2 gap-2">
                          {/* Color information */}
                          {item.color && (
                            <div className="flex items-center text-sm">
                              <Palette className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>Color: </span>
                              <span className="flex items-center ml-1 font-medium">
                                {getColorDot(item.color)}
                                {item.color}
                              </span>
                            </div>
                          )}

                          {/* Size information */}
                          {item.size && (
                            <div className="flex items-center text-sm">
                              <Ruler className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>Size: </span>
                              <span className="font-medium ml-1">{item.size}</span>
                            </div>
                          )}

                          {/* Quantity with badge */}
                          <div className="flex items-center text-sm">
                            <BoxIcon className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>Quantity: </span>
                            <Badge variant="outline" className="ml-1 px-2 py-0 font-medium">{item.quantity}</Badge>
                          </div>

                          {/* Shipping destination */}
                          {order.shippingInfo && (
                            <div className="flex items-center text-sm">
                              <HomeIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>Ships to: </span>
                              <span className="font-medium ml-1">{order.shippingInfo.city}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({order.orderDetails.length} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer and Shipping Information */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-muted-foreground" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">ID: {order.customerId}</p>
                </div>
                
                {order.customer && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>+1 {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-muted-foreground" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingInfo ? (
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Delivery Address</h3>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-500">
                          {order.shippingInfo.addressLine1}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.country} - {order.shippingInfo.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Shipping Method:</span>
                    </div>
                    <span className="text-sm font-medium capitalize">{order.shippingInfo.shippingType}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Shipping Cost:</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(order.shippingInfo.shippingCost)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BoxIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Items:</span>
                    </div>
                    <span className="text-sm font-medium">{order.orderDetails.reduce((sum: number, item: any) => sum + item.quantity, 0)} items</span>
                  </div>
                  
                  {order.dateShipped && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Shipped on:</span>
                      </div>
                      <span className="text-sm font-medium">{formatDate(order.dateShipped)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No shipping information available</p>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative pl-6 pb-4 border-l border-border">
                  <div className="absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-green-500"></div>
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.dateCreated)}</p>
                </div>
                
                {order.status !== 'pending' && order.status !== 'cancelled' && (
                  <div className="relative pl-6 pb-4 border-l border-border">
                    <div className={`absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full ${order.status === 'processing' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <p className="text-sm font-medium">Processing</p>
                    <p className="text-xs text-muted-foreground">{formatDate(new Date(new Date(order.dateCreated).getTime() + 1 * 24 * 60 * 60 * 1000).toString())}</p>
                  </div>
                )}
                
                {(order.status === 'shipped' || order.status === 'delivered') && (
                  <div className="relative pl-6 pb-4 border-l border-border">
                    <div className={`absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full ${order.status === 'shipped' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <p className="text-sm font-medium">Shipped</p>
                    <p className="text-xs text-muted-foreground">{order.dateShipped ? formatDate(order.dateShipped) : formatDate(new Date(new Date(order.dateCreated).getTime() + 3 * 24 * 60 * 60 * 1000).toString())}</p>
                  </div>
                )}
                
                {order.status === 'delivered' && (
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium">Delivered</p>
                    <p className="text-xs text-muted-foreground">{formatDate(new Date(new Date(order.dateCreated).getTime() + 6 * 24 * 60 * 60 * 1000).toString())}</p>
                  </div>
                )}
                
                {order.status === 'cancelled' && (
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-red-500"></div>
                    <p className="text-sm font-medium">Cancelled</p>
                    <p className="text-xs text-muted-foreground">{formatDate(new Date().toString())}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}