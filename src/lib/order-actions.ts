"use server"

import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import { getCurrentUser } from "@/lib/auth-actions"
import { revalidatePath } from "next/cache"

export type OrderFormData = {
  firstName: string
  lastName: string
  streetAddress: string
  country: string
  province: string
  city: string
  zipCode: string
  phone: string
  email: string
  notes?: string
}

export async function createOrderAction(formData: FormData) {
  try {
    const user = await getCurrentUser()

    const orderFormData: OrderFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      streetAddress: formData.get("streetAddress") as string,
      country: formData.get("country") as string,
      province: formData.get("province") as string,
      city: formData.get("city") as string,
      zipCode: formData.get("zipCode") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      notes: (formData.get("notes") as string) || "",
    }

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "streetAddress",
      "country",
      "province",
      "city",
      "zipCode",
      "phone",
      "email",
    ]
    for (const field of requiredFields) {
      if (!orderFormData[field as keyof OrderFormData]) {
        return {
          success: false,
          error: `${field} is required`,
        }
      }
    }

    const orderId = uuidv4()
    const shippingId = uuidv4()

    // Cart items should be passed as JSON in a hidden form field
    const cartItemsJson = formData.get("cartItems") as string
    const cartItems = JSON.parse(cartItemsJson || "[]")

    // First create the shipping info
    const shippingInfo = await prisma.shippingInfo.create({
      data: {
        shippingId,
        shippingType: "standard",
        shippingCost: 0,
        shippingRegionId: 1
      }
    })

    // Then create the order with a reference to the shipping info
    const order = await prisma.order.create({
      data: {
        orderId,
        customerName: `${orderFormData.firstName} ${orderFormData.lastName}`,
        customerId: user?.id || "guest",
        status: "pending",
        shippingId: shippingInfo.id,
        orderDetails: {
          create: cartItems.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        },
      },
    })

    revalidatePath("/account/orders")

    return {
      success: true,
      orderId: order.id,
    }
  } catch (error) {
    console.error("Create order error:", error)
    return {
      success: false,
      error: "Failed to create order",
    }
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    // Verify if user is admin (optional, uncomment if you want to restrict this action)
    // const user = await getCurrentUser()
    // if (!user || user.role !== "admin") {
    //   return {
    //     success: false,
    //     error: "Unauthorized",
    //   }
    // }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    })

    // Revalidate the orders page to refresh the data
    revalidatePath("/admin/orders")

    return {
      success: true,
      order: updatedOrder,
    }
  } catch (error) {
    console.error("Update order status error:", error)
    return {
      success: false,
      error: "Failed to update order status",
    }
  }
}

export async function getOrdersForCurrentUser() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return []
    }

    const orders = await prisma.order.findMany({
      where: {
        customerId: user.id,
      },
      orderBy: {
        dateCreated: "desc",
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

    return orders
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return []
  }
}
