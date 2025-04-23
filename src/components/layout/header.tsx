"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, ShoppingCart, User, LogOut, Settings, Menu } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type Category = {
  id: string
  categoryId: string
  categoryName: string
  image?: string | null
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  // Fetch categories for the navbar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()

        if (data.success) {
          setCategories(data.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

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

  // Featured categories for the main navigation
  const featuredCategories = categories.slice(0, 8)

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm" 
          : "bg-white"
      )}
    >
      {isSearchOpen ? (
        <SearchBar onClose={() => setIsSearchOpen(false)} />
      ) : (
        <>
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
            <div className="flex items-center">
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="mr-2 rounded-full text-gray-700 hover:bg-black/5">
                    <Menu className="h-[18px] w-[18px]" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <Link href="/" className="text-lg font-bold flex items-center">
                        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          Fashion Fuel
                        </span>
                      </Link>
                    </div>
                    <nav className="flex flex-col p-2">
                      <Link
                        href="/products"
                        className={cn(
                          "px-3 py-2 text-sm rounded-md flex items-center",
                          pathname === "/products" 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        All Products
                      </Link>
                      <Link
                        href="/new-arrivals"
                        className={cn(
                          "px-3 py-2 text-sm rounded-md flex items-center",
                          pathname === "/new-arrivals" 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        New Arrivals
                      </Link>
                      <Link
                        href="/about"
                        className={cn(
                          "px-3 py-2 text-sm rounded-md flex items-center",
                          pathname === "/about" 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        About
                      </Link>
                      {user.isAuthenticated && (
                        <Link
                          href="/order-history"
                          className={cn(
                            "px-3 py-2 text-sm rounded-md flex items-center",
                            pathname === "/order-history" 
                              ? "bg-primary/10 text-primary font-medium" 
                              : "hover:bg-gray-50 text-gray-700"
                          )}
                        >
                          Order History
                        </Link>
                      )}
                    </nav>
                    {categories.length > 0 && (
                      <div className="py-2 px-2 border-t mt-2">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium px-3 py-2">Categories</h3>
                        <nav className="flex flex-col">
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/categories/${category.categoryId}`}
                              className={cn(
                                "px-3 py-2 text-sm rounded-md",
                                pathname === `/categories/${category.categoryId}` 
                                  ? "bg-primary/5 text-primary font-medium" 
                                  : "hover:bg-gray-50 text-gray-700"
                              )}
                            >
                              {category.categoryName}
                            </Link>
                          ))}
                        </nav>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              
              {/* Brand logo */}
              <Link 
                href="/" 
                className="group text-lg font-bold"
              >
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Fashion Fuel
                </span>
              </Link>
              
              {/* Desktop navigation */}
              <nav className="hidden lg:flex items-center ml-10 space-x-6">
                <Link
                  href="/products"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-1",
                    pathname === "/products"
                      ? "text-primary" 
                      : "text-gray-600"
                  )}
                >
                  Shop
                  {pathname === "/products" && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Link>
                <Link
                  href="/new-arrivals"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-1",
                    pathname === "/new-arrivals"
                      ? "text-primary" 
                      : "text-gray-600"
                  )}
                >
                  New Arrivals
                  {pathname === "/new-arrivals" && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-1",
                    pathname === "/about"
                      ? "text-primary" 
                      : "text-gray-600"
                  )}
                >
                  About
                  {pathname === "/about" && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Link>
                {user.isAuthenticated && user.role === "admin" && (
                  <Link
                    href="/admin"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary relative py-1",
                      pathname.startsWith("/admin")
                        ? "text-primary" 
                        : "text-gray-600"
                    )}
                  >
                    Admin
                    {pathname.startsWith("/admin") && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full p-1.5 hover:bg-gray-100 text-gray-700"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              {isLoading ? (
                <div className="h-7 w-7 animate-pulse rounded-full bg-gray-200"></div>
              ) : user.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 p-0">
                      <div className="h-full w-full rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {user.customerName?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-1 p-1">
                    <div className="px-3 py-2 text-sm font-medium">
                      {user.customerName}
                      {user.role === "admin" && (
                        <Badge variant="secondary" className="ml-2 text-xs bg-primary/10 text-primary">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/order-history" className="cursor-pointer">
                        Order History
                      </Link>
                    </DropdownMenuItem>
                    
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/products" className="cursor-pointer">
                            Manage Products
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/orders" className="cursor-pointer">
                            Manage Orders
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" variant="outline" asChild className="h-8 text-xs px-3 font-medium">
                  <Link href="/auth/sign-in">
                    Sign in
                  </Link>
                </Button>
              )}

              <Link href="/cart" className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-700" aria-label="Cart">
                <ShoppingCart className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="hidden md:block border-t border-gray-100">
              <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="relative">
                  <div className="overflow-x-auto scrollbar-hide">
                    <nav className="flex items-center space-x-6 py-2">
                      {featuredCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.categoryId}`}
                          className={cn(
                            "whitespace-nowrap text-xs font-medium transition-colors py-1",
                            pathname === `/categories/${category.categoryId}` 
                              ? "text-primary" 
                              : "text-gray-500 hover:text-gray-900"
                          )}
                        >
                          {category.categoryName}
                        </Link>
                      ))}
                      {categories.length > 8 && (
                        <Link 
                          href="/categories" 
                          className="whitespace-nowrap text-xs font-medium text-primary hover:text-primary/80"
                        >
                          View All
                        </Link>
                      )}
                    </nav>
                  </div>
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent"></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </header>
  )
}
