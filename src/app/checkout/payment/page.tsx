import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import StripeCheckoutForm from "@/components/checkout/stripe-checkout-form"
import OrderSummary from "@/components/checkout/order-summary"

export const metadata: Metadata = {
  title: "Payment | Fashion Fuel",
  description: "Complete your payment",
}

export default async function PaymentPage() {
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
              <li>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  <Link href="/checkout" className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">Checkout</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  <span className="ml-1 text-gray-600 md:ml-2">Payment</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="mt-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Payment</h1>
            <div className="mt-2 flex items-center text-sm text-gray-600 sm:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-1.5 h-5 w-5 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Secure Connection
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-8">
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 transform bg-gray-200"></div>
              <div className="absolute left-0 top-1/2 h-0.5 w-[83%] -translate-y-1/2 transform bg-indigo-600"></div>
              
              {/* Steps */}
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-600 text-xs font-semibold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-medium text-indigo-600">Cart</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-600 text-xs font-semibold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-medium text-indigo-600">Checkout</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-600 text-xs font-semibold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M20 6H10a2 2 0 1 0 0 4h10v4H10a2 2 0 1 0 0 4h10" />
                      <path d="M14 4v16" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-medium text-indigo-600">Payment</div>
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
              <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900">Payment Details</h2>
              
              <div className="mb-8 rounded-lg bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Test Mode</h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>Use test card number: <span className="font-mono">4242 4242 4242 4242</span></p>
                      <p className="mt-1">Any future date, any 3 digits for CVV, and any postal code.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <StripeCheckoutForm cartItems={cart.cartItems} />
              </div>
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
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H7C5.89543 22 5 21.1046 5 20V4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V20C19 21.1046 18.1046 22 17 22H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 16.5C9 15.5717 9.76751 14.8334 10.6993 14.8334H13.3007C14.2325 14.8334 15 15.5717 15 16.5C15 17.4283 14.2325 18.1667 13.3007 18.1667H10.6993C9.76751 18.1667 9 17.4283 9 16.5Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 14.8334V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 18.1667V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M9 8.83333H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M9 11.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Your personal data will be used to process your order.
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex h-7 w-12 items-center justify-center rounded bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" className="h-4">
                        <path d="M21.572 0H1.166C0.523 0 0 0.52 0 1.16v12.576c0 0.64 0.523 1.16 1.166 1.16h20.406c0.643 0 1.166-0.52 1.166-1.16V1.16c0-0.64-0.523-1.16-1.166-1.16z" fill="#016FD0"/>
                        <path d="M1.166 8.308h3.22v1.664h-3.22zM5.874 8.308h3.22v1.664h-3.22zM10.582 8.308h3.22v1.664h-3.22zM15.29 8.308h3.22v1.664h-3.22z" fill="#FFFFFE"/>
                        <path d="M20.410 8.308h2.328v1.664H20.41z" fill="#FFFFFE"/>
                        <path d="M20.41 4.324h2.328v1.664H20.41zM1.166 4.324h3.22v1.664h-3.22zM5.874 4.324h3.22v1.664h-3.22zM10.582 4.324h3.22v1.664h-3.22zM15.29 4.324h3.22v1.664h-3.22z" fill="#FFFFFE"/>
                      </svg>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-7">
                      <path fill="#ff5f00" d="M16.5 16.5h15v15h-15z" />
                      <path d="M17.95 24a9.53 9.53 0 0 1 3.64-7.5 9.54 9.54 0 1 0 0 15 9.53 9.53 0 0 1-3.64-7.5z" fill="#eb001b" />
                      <path d="M37.05 24a9.54 9.54 0 0 1-15.4 7.5 9.52 9.52 0 0 0 0-15A9.54 9.54 0 0 1 37.05 24z" fill="#f79e1b" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="32" viewBox="0 0 48 32" fill="none" className="h-7">
                      <rect width="48" height="32" rx="4" fill="white" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5 23H32.5V9.5H15.5V23ZM16.75 13.5C16.75 13.0858 17.0858 12.75 17.5 12.75H28.5C28.9142 12.75 29.25 13.0858 29.25 13.5C29.25 13.9142 28.9142 14.25 28.5 14.25H17.5C17.0858 14.25 16.75 13.9142 16.75 13.5ZM16.75 16.5C16.75 16.0858 17.0858 15.75 17.5 15.75H21.5C21.9142 15.75 22.25 16.0858 22.25 16.5C22.25 16.9142 21.9142 17.25 21.5 17.25H17.5C17.0858 17.25 16.75 16.9142 16.75 16.5ZM16.75 19.5C16.75 19.0858 17.0858 18.75 17.5 18.75H23.5C23.9142 18.75 24.25 19.0858 24.25 19.5C24.25 19.9142 23.9142 20.25 23.5 20.25H17.5C17.0858 20.25 16.75 19.9142 16.75 19.5Z" fill="black" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
