import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import StripeCheckoutForm from "@/components/checkout/stripe-checkout-form"
import OrderSummary from "@/components/checkout/order-summary"

export const metadata: Metadata = {
  title: "Payment | Fashion Fuel",
  description: "Complete your purchase with secure payment",
}

export default async function PaymentPage() {
  // Check if user is authenticated
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get user's cart
  const cart = await prisma.shoppingCart.findFirst({
    where: {
      customer: {
        user: {
          id: user.id,
        },
      },
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  })

  // If cart is empty, redirect to cart page
  if (!cart || cart.cartItems.length === 0) {
    redirect("/cart")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Payment</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-medium">Payment Details</h2>
            <StripeCheckoutForm cartItems={cart.cartItems} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary cartItems={cart.cartItems} />
        </div>
      </div>
    </div>
  )
}
