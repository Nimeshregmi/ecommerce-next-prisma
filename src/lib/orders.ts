import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export async function createOrder(data: any) {
  try {
    const orderId = uuidv4()

    const order = await prisma.order.create({
      data: {
        orderId,
        customerName: `${data.firstName} ${data.lastName}`,
        customerId: data.customerId || "placeholder", // In a real app, this would come from the authenticated user
        status: "pending",
      },
    })

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

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        dateCreated: "desc",
      },
      include: {
        orderDetails: true,
      },
    })

    return orders
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return []
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
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

    return order
  } catch (error) {
    console.error(`Failed to fetch order with ID ${id}:`, error)
    return null
  }
}
