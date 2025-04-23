import { Separator } from "@/components/ui/separator"

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    productName: string
    productPrice: number
    imageUrl?: string | null
  }
}

export default function OrderSummary({ cartItems }: { cartItems: CartItem[] }) {
  const subtotal = cartItems.reduce((total, item) => total + item.product.productPrice * item.quantity, 0)
  const shipping: number = 0 // Free shipping
  const total = subtotal + shipping

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-medium">Order Summary</h2>

      <div className="max-h-80 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"></div>
              <div>
                <p className="text-sm font-medium">{item.product.productName}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">RS.{(item.product.productPrice * item.quantity).toFixed(0)}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>RS.{subtotal.toFixed(0)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? "Free" : `RS.${shipping.toFixed(0)}`}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>RS.{total.toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}
