"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutForm({ cartItems }: { cartItems: any[] }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingInfo: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.postalCode,
            phone: formData.phone,
            notes: formData.notes,
          },
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/order-confirmation/${data.data.id}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-medium">Billing Details</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-4">
          <Input
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Input
              name="state"
              placeholder="State/Province"
              value={formData.state}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              name="city"
              placeholder="Town/City"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Input
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              name="phone"
              placeholder="Phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Input
              name="email"
              placeholder="Email address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            name="notes"
            placeholder="Order notes (Optional)"
            value={formData.notes}
            onChange={handleChange}
            disabled={isSubmitting}
            className="h-24"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || cartItems.length === 0}>
        {isSubmitting ? "Processing Order..." : "PLACE ORDER"}
      </Button>
    </form>
  )
}
