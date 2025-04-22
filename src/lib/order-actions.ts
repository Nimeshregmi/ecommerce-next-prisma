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

    // Cart items should be passed as JSON in a hidden form field
    const cartItemsJson = formData.get("cartItems") as string
    const cartItems = JSON.parse(cartItemsJson || "[]")

    const order = await prisma.order.create({
      data: {
        orderId,
        customerName: `${orderFormData.firstName} ${orderFormData.lastName}`,
        customerId: user?.id || "guest",
        status: "pending",
        shippingInfo: {
          create: {
            shippingAddress: orderFormData.streetAddress,
            city: orderFormData.city,
            state: orderFormData.province,
            country: orderFormData.country,
            postalCode: orderFormData.zipCode,
            phone: orderFormData.phone,
            notes: orderFormData.notes,
          },
        },
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
