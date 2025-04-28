import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import stripe from "@/lib/stripe/stripe"

// Buffer to string helper (Needed for webhook signature verification)
async function buffer(readable: ReadableStream) {
  const chunks = []
  const reader = readable.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(typeof value === "string" ? Buffer.from(value) : value)
    }
  } finally {
    reader.releaseLock()
  }
  return Buffer.concat(chunks)
}

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
  }

  let event
  try {
    const rawBody = await buffer(req.body as ReadableStream)
    const signature = req.headers.get("stripe-signature") ?? ""
    
    // Verify webhook signature using Stripe webhook secret
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || "whsec_test"
      )
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        
        // Update order status and payment details
        await prisma.order.update({
          where: { orderId: session.id },
          data: {
            status: "processing",
            dateShipped: new Date(), // Optional: Set shipping date
            // You can add more payment details here
          },
        })

        // Clear the user's cart after successful payment
        const metadata = session.metadata || {}
        if (metadata.customerId) {
          const cart = await prisma.shoppingCart.findFirst({
            where: { customerId: metadata.customerId },
            include: { cartItems: true },
          })

          if (cart && cart.cartItems.length > 0) {
            await prisma.shoppingCartItem.deleteMany({
              where: { cartId: cart.id },
            })
          }
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        
        // Find order by payment intent ID and mark as failed
        const order = await prisma.order.findFirst({
          where: { orderId: paymentIntent.id },
        })
        
        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "payment_failed",
            },
          })
        }
        
        console.log(`❌ Payment failed: ${paymentIntent.id}`)
        break
      }

      case "charge.refunded": {
        const charge = event.data.object
        
        // Find order by payment intent ID and mark as refunded
        if (charge.payment_intent) {
          const order = await prisma.order.findFirst({
            where: { orderId: charge.payment_intent },
          })
          
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: "refunded",
              },
            })
          }
        }
        
        console.log(`💰 Charge refunded: ${charge.id}`)
        break
      }

      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Return a successful response to Stripe
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 500 })
  }
}

// Disable body parsing for webhook route (needed for signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
}