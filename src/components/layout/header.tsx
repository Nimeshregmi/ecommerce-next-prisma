"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, ShoppingCart, User, LogOut, Settings } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { clearUser, setUser } from "@/redux/features/user-slice"
import SearchBar from "@/components/search-bar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define type for category from database
type Category = {
  id: string
  categoryId: string
  categoryName: string
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user)

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/auth/me")
        const data = await response.json()

        if (data.success && data.data) {
          dispatch(
            setUser({
              userId: data.data.id,
              customerName: data.data.name,
              email: data.data.email,
              role: data.data.role,
            }),
          )

          // Fetch cart after authentication is confirmed
          fetchCartCount()
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [dispatch])

  // Fetch cart count for authenticated users
  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart")
      const data = await response.json()

      if (data.success) {
        const count = data.data.items.reduce((total: number, item: any) => total + item.quantity, 0)
        setCartCount(count)
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      dispatch(clearUser())
      router.push("/auth/sign-in")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    
    fetchCategories()
  }, [])

  return (
    <header className="border-b">
      {isSearchOpen ? (
        <SearchBar onClose={() => setIsSearchOpen(false)} />
      ) : (
        <>
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <div className="flex items-center space-x-8">
              <nav className="flex items-center justify-center space-x-6">
                <Link href={'/'} className="font-bold text-2xl">Ecommerce</Link>
                <Link
                  href="/about"
                  className={`border-b-2 font-bold hover:scale-105 transition-all duration-700 ease-in-out pb-1 text-sm ${pathname === "/about" ? "border-black" : "border-transparent"}`}
                >
                  About
                </Link>
                {user.isAuthenticated && user.role === "admin" && (
                  <>
                    <Link
                      href="/admin"
                      className={`border-b-2 pb-1 font-bold text-sm  text-primary ${
                        pathname.startsWith("/admin") ? "border-primary" : "border-transparent"
                      }`}
                    >
                      Admin
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {isLoading ? (
                <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200"></div>
              ) : user.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full p-2 hover:bg-gray-100">
                    <User className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">{user.customerName}</div>
                    {user.role === "admin" && <div className="px-2 py-0.5 text-xs text-primary">Administrator</div>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">Orders</Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/products">Manage Products</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/orders">Manage Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/categories">Manage Categories</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/sign-in" className="rounded-full p-2 hover:bg-gray-100" aria-label="Account">
                  <User className="h-5 w-5" />
                </Link>
              )}

              <Link href="/cart" className="relative rounded-full p-2 hover:bg-gray-100" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="border-t">
            <div className="mx-auto flex max-w-7xl items-center justify-center px-4">
              <nav className="flex items-center space-x-6 overflow-x-auto py-4 scrollbar-hide">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.categoryId}`}
                    className="whitespace-nowrap text-sm"
                  >
                    {category.categoryName}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="border-t">
            <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4">
              <Link href="/" className="text-2xl font-medium">
                Fashion Fuel
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
