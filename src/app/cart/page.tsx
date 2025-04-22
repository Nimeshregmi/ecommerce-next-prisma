import type { Metadata } from "next"
import CartItems from "@/components/cart/cart-items"
import CartSummary from "@/components/cart/cart-summary"

export const metadata: Metadata = {
  title: "Your Cart | Fashion Fuel",
  description: "View and manage your shopping cart",
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CartItems />
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
