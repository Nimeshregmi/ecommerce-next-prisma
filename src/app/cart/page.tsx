import type { Metadata } from "next"
import CartItems from "@/components/cart/cart-items"
import CartSummary from "@/components/cart/cart-summary"
import Link from "next/link"
import { ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Your Cart | Fashion Fuel",
  description: "View and manage your shopping cart",
}

export default function CartPage() {
  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Breadcrumb navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-6 md:mb-10 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
          <Button variant="ghost" asChild className="text-sm flex items-center gap-2 text-primary hover:text-primary/80">
            <Link href="/products">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CartItems />
          </div>

          <div>
            <div className="sticky top-20">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
