import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import CheckoutForm from "@/components/checkout/checkout-form"
import OrderSummary from "@/components/checkout/order-summary"

export const metadata: Metadata = {
  title: "Checkout | Fashion Fuel",
  description: "Complete your purchase",
}

export default async function CheckoutPage() {
  // Check if user is authenticated
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get user's cart
  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  // If cart is empty, redirect to cart page
  if (!cart || cart.items.length === 0) {
    redirect("/cart")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm cartItems={cart.items} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary cartItems={cart.items} />
        </div>
      </div>
    </div>
  )
}
