import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { createCheckoutSession } from "@/lib/stripe/stripe"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { cartItems, shippingInfo } = await req.json()

    // Validate required data
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "No items in cart" }, { status: 400 })
    }

    // Get customer ID from user ID
    const customer = await prisma.customer.findFirst({
      where: { userId: user.id },
    })

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    // Format items for Stripe checkout
    const items = cartItems.map((item: any) => ({
      name: item.product.productName,
      id: item.product.id,
      price: item.product.productPrice,
      quantity: item.quantity,
    }))

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + item.price * item.quantity
    }, 0)

    // Base URL for redirects
    const baseUrl = req.headers.get("origin") || "http://localhost:3000"

    // Create metadata for order tracking
    const metadata = {
      customerId: customer.id,
      customerEmail: user.email || customer.email,
      shippingInfo: JSON.stringify(shippingInfo || {}),
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      items,
      customerEmail: user.email || customer.email,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/checkout`,
      metadata,
    })

    // Store session ID in database for later verification
    await prisma.order.create({
      data: {
        orderId: session.id,
        customerName: customer.customerName,
        customerId: customer.id,
        status: "pending",
        paymentMethod: "stripe",
        orderDetails: {
          create: cartItems.map((item: any) => ({
            productId: item.product.id,
            productName: item.product.productName,
            quantity: item.quantity,
            unitCost: item.product.productPrice,
            subtotal: item.product.productPrice * item.quantity,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}