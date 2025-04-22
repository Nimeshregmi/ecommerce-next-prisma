import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"
import { v4 as uuidv4 } from "uuid"

// Get user's orders
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { customerId: user.id },
      orderBy: { dateCreated: "desc" },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
        shippingInfo: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

// Create a new order
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { shippingInfo, paymentMethod, items } = await req.json()

    // Validate required fields
    if (!shippingInfo || !items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Start a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderId: uuidv4().substring(0, 8).toUpperCase(),
          customerId: user.id,
          customerName: user.name,
          status: "pending",
          paymentMethod: paymentMethod || "cod",
          shippingInfo: {
            create: {
              shippingAddress: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country,
              postalCode: shippingInfo.postalCode,
              phone: shippingInfo.phone,
              notes: shippingInfo.notes || "",
            },
          },
        },
      })

      // Get products to verify prices
      const productIds = items.map((item: any) => item.productId)
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      })

      // Create order details
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId)

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }

        await tx.orderDetail.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.productPrice, // Use current price from DB
          },
        })
      }

      // Clear user's cart
      const cart = await tx.cart.findFirst({
        where: { userId: user.id },
      })

      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        })
      }

      return newOrder
    })

    // Get complete order with details
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
        shippingInfo: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      data: completeOrder,
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
