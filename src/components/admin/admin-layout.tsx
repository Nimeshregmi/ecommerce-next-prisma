import type React from "react"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Admin Menu</h2>
            <nav className="space-y-2">
              <Link href="/admin" className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/admin/products" className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                <Package className="mr-2 h-4 w-4" />
                Products
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                <Tag className="mr-2 h-4 w-4" />
                Categories
              </Link>
              <Link href="/admin/orders" className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Link>
              <Link
                href="/admin/customers"
                className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Link>
              <Link href="/admin/settings" className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}
