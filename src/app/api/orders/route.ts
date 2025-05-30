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

    const { shippingInfo, items } = await req.json()

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Get customer info
    const customer = await prisma.customer.findFirst({
      where: {
        user: {
          id: user.id,
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or update shipping info record
      let shippingInfoRecord = await tx.shippingInfo.create({
        data: {
          shippingId: uuidv4().substring(0, 8).toUpperCase(),
          shippingType: "Standard",
          shippingCost: 5.99,
          shippingRegionId: 1,
          city: shippingInfo.city,
          state: shippingInfo.state,
          country: shippingInfo.country,
          postalCode: shippingInfo.postalCode,
          // addressLine1: shippingInfo.address,
        },
      })

      // Create the order
      const order = await tx.order.create({
        data: {
          orderId: uuidv4().substring(0, 8).toUpperCase(),
          customerId: customer.id,
          customerName: customer.customerName,
          status: "pending",
          paymentMethod: shippingInfo.paymentMethod || "cod",
          shippingId: shippingInfoRecord.id,
        },
      })

      // Get products to verify prices and check stock
      const productIds = items.map((item: any) => item.productId)
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      })

      // Create order details and update inventory
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId)

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }

        // Check if enough stock is available
        if (product.stockQuantity < item.quantity) {
          throw new Error(`Not enough stock for product: ${product.productName}. Available: ${product.stockQuantity}`)
        }

        const subtotal = product.productPrice * item.quantity

        // Create order detail with color and size
        await tx.orderDetail.create({
          data: {
            orderId: order.id,
            productId: product.id,
            productName: product.productName,
            quantity: item.quantity,
            unitCost: product.productPrice,
            subtotal: subtotal,
            color: item.selectedColor,
            size: item.selectedSize,
          },
        })

        // Update product inventory
        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: {
              decrement: item.quantity
            },
            productStatus: product.stockQuantity - item.quantity <= 0 ? "outofstock" : "active"
          },
        })
      }

      // Create notification for order placement
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Order Placed Successfully",
          message: `Your order #${order.orderId} has been placed and is waiting to be processed.`,
          type: "order",
          isRead: false,
          referenceId: order.id
        }
      })

      // Clear user's cart
      const cart = await tx.shoppingCart.findFirst({
        where: { customerId: customer.id },
      })

      if (cart) {
        await tx.shoppingCartItem.deleteMany({
          where: { cartId: cart.id },
        })
      }

      return order
    })

    // Get complete order with details
    const completeOrder = await prisma.order.findUnique({
      where: { id: result.id },
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
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create order"
    }, { status: 500 })
  }
}
