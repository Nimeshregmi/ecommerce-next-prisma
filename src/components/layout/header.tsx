"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { clearUser, setUser } from "@/redux/features/user-slice";
import SearchBar from "@/components/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Category = {
  id: string;
  categoryId: string;
  categoryName: string;
  image?: string | null;
};

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (data.success && data.data) {
          dispatch(
            setUser({
              userId: data.data.id,
              customerName: data.data.name,
              email: data.data.email,
              role: data.data.role,
            })
          );

          // Fetch cart after authentication is confirmed
          fetchCartCount();
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // Fetch categories for the navbar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch cart count for authenticated users
  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();

      if (data.success) {
        const count = data.data.items.reduce(
          (total: number, item: any) => total + item.quantity,
          0
        );
        setCartCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      dispatch(clearUser());
      router.push("/auth/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg" 
            : "bg-gradient-to-r from-gray-50 to-white"
        )}
      >
        {isSearchOpen ? (
          <SearchBar onClose={() => setIsSearchOpen(false)} />
        ) : (
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
            <div className="flex items-center">
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[280px] sm:w-[320px] p-0"
                >
                  <div className="flex flex-col h-full">
                    <div className="p-5 border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
                      <Link
                        href="/"
                        className="text-xl font-bold flex items-center"
                      >
                        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          Fashion Fuel
                        </span>
                      </Link>
                    </div>
                    <nav className="flex flex-col p-3">
                      <Link
                        href="/products"
                        className={cn(
                          "px-4 py-2.5 text-sm rounded-md flex items-center font-medium",
                          pathname === "/products"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50 text-gray-700 hover:text-primary"
                        )}
                      >
                        All Products
                      </Link>
                      <Link
                        href="/new-arrivals"
                        className={cn(
                          "px-4 py-2.5 text-sm rounded-md flex items-center font-medium",
                          pathname === "/new-arrivals"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50 text-gray-700 hover:text-primary"
                        )}
                      >
                        New Arrivals
                      </Link>
                      <Link
                        href="/about"
                        className={cn(
                          "px-4 py-2.5 text-sm rounded-md flex items-center font-medium",
                          pathname === "/about"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50 text-gray-700 hover:text-primary"
                        )}
                      >
                        About
                      </Link>
                      {user.isAuthenticated && (
                        <Link
                          href="/order-history"
                          className={cn(
                            "px-4 py-2.5 text-sm rounded-md flex items-center font-medium",
                            pathname === "/order-history"
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-gray-50 text-gray-700 hover:text-primary"
                          )}
                        >
                          Order History
                        </Link>
                      )}
                    </nav>
                    {categories.length > 0 && (
                      <div className="py-3 px-3 border-t mt-2">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold px-4 py-2">
                          Categories
                        </h3>
                        <nav className="flex flex-col">
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/categories/${category.categoryId}`}
                              className={cn(
                                "px-4 py-2.5 text-sm rounded-md font-medium",
                                pathname ===
                                  `/categories/${category.categoryId}`
                                  ? "bg-primary/5 text-primary"
                                  : "hover:bg-gray-50 text-gray-700 hover:text-primary"
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
                className="group text-xl font-bold transition-all duration-300 hover:scale-105"
              >
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Fashion Fuel
                </span>
              </Link>

              {/* Desktop navigation */}
              <nav className="hidden lg:flex items-center ml-12 space-x-8">
                <Link
                  href="/products"
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-primary relative py-1.5 px-1",
                    pathname === "/products" 
                      ? "text-primary" 
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  Shop
                  {pathname === "/products" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-purple-600" />
                  )}
                </Link>
                <Link
                  href="/categories"
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-primary relative py-1.5 px-1",
                    pathname === "/categories"
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  Category
                  {pathname === "/categories" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-purple-600" />
                  )}
                </Link>
                <Link
                  href="/new-arrivals"
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-primary relative py-1.5 px-1",
                    pathname === "/new-arrivals"
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  New Arrivals
                  {pathname === "/new-arrivals" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-purple-600" />
                  )}
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-primary relative py-1.5 px-1",
                    pathname === "/about" 
                      ? "text-primary" 
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  About
                  {pathname === "/about" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-purple-600" />
                  )}
                </Link>
                {user.isAuthenticated && user.role === "admin" && (
                  <Link
                    href="/admin"
                    className={cn(
                      "text-sm font-semibold transition-colors hover:text-primary relative py-1.5 px-1",
                      pathname.startsWith("/admin")
                        ? "text-primary"
                        : "text-gray-600 hover:text-primary"
                    )}
                  >
                    Admin
                    {pathname.startsWith("/admin") && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-purple-600" />
                    )}
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full p-2 hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              {isLoading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
              ) : user.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-9 h-9 p-0 hover:bg-primary/10"
                    >
                      <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center shadow-sm">
                        <span className="text-xs font-medium">
                          {user.customerName?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-1 p-1.5 rounded-xl border-none shadow-lg">
                    <div className="px-3 py-2.5 text-sm font-medium rounded-md bg-gray-50">
                      {user.customerName}
                      {user.role === "admin" && (
                        <Badge
                          variant="secondary"
                          className="ml-2 text-xs bg-primary/10 text-primary font-semibold"
                        >
                          Admin
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem asChild className="rounded-md">
                      <Link href="/account" className="cursor-pointer py-2">
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-md">
                      <Link href="/order-history" className="cursor-pointer py-2">
                        Order History
                      </Link>
                    </DropdownMenuItem>

                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem asChild className="rounded-md">
                          <Link
                            href="/admin"
                            className="cursor-pointer flex items-center py-2"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-md">
                          <Link
                            href="/admin/products"
                            className="cursor-pointer py-2"
                          >
                            Manage Products
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-md">
                          <Link href="/admin/orders" className="cursor-pointer py-2">
                            Manage Orders
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600 cursor-pointer rounded-md py-2"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="h-9 text-xs px-4 font-medium border-2 rounded-full hover:bg-primary/5 hover:border-primary/70 hover:text-primary transition-all"
                >
                  <Link href="/auth/sign-in">Sign in</Link>
                </Button>
              )}

              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 text-xs font-medium text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
