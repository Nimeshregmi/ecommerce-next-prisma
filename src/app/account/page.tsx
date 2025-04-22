import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "My Account | Fashion Fuel",
  description: "Manage your Fashion Fuel account",
}

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">My Account</h1>

      <div className="rounded-lg border p-6 shadow-sm">
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Name</h2>
            <p className="text-lg">{user.customerName}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Email</h2>
            <p className="text-lg">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h2 className="mb-4 text-xl font-semibold">Account Options</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/account/orders">Order History</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/account/addresses">Manage Addresses</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/account/settings">Account Settings</Link>
            </Button>

            <Button asChild variant="destructive">
              <Link href="/auth/sign-out">Sign Out</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
