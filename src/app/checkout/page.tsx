import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
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

  // Get customer ID from user ID
  const customer = await prisma.customer.findFirst({
    where: {
      user: {
        id: user.id,
      },
    },
  })

  if (!customer) {
    redirect("/auth/sign-in")
  }

  // Get user's cart
  const cart = await prisma.shoppingCart.findFirst({
    where: { customerId: customer.id },
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

  // Calculate total items
  const totalItems = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-20">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-1 h-4 w-4">
                    <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  <Link href="/cart" className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">Cart</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  <span className="ml-1 text-gray-600 md:ml-2">Checkout</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="mt-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
            <div className="mt-2 flex items-center text-sm text-gray-600 sm:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-1.5 h-5 w-5 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
              Secure Checkout
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-8">
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 transform bg-gray-200"></div>
              <div className="absolute left-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2 transform bg-indigo-600"></div>
              
              {/* Steps */}
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-600 text-xs font-semibold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-medium text-indigo-600">Cart</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-600 text-xs font-semibold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M20 6H10a2 2 0 1 0 0 4h10v4H10a2 2 0 1 0 0 4h10" />
                      <path d="M14 4v16" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-medium text-indigo-600">Checkout</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs font-semibold text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3h-7.28" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-medium text-gray-500">Confirmation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900">Shipping Information</h2>
              <CheckoutForm cartItems={cart.cartItems} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-gray-900">Order Summary</h2>
              <div className="mb-4 rounded-md bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Items ({totalItems})</span>
                  <Link href="/cart" className="flex items-center text-indigo-600 hover:text-indigo-500">
                    Edit
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </Link>
                </div>
              </div>
              <OrderSummary cartItems={cart.cartItems} />
              
              <div className="mt-6">
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 h-4 w-4">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                  Secure payment provided by Stripe
                </div>
                <div className="mt-3 flex justify-center space-x-2">
                  <img src="/images/visa.svg" alt="Visa" className="h-6" />
                  <img src="/images/mastercardsvg.svg" alt="Mastercard" className="h-6" />
                  <img src="/images/amex.svg" alt="American Express" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
