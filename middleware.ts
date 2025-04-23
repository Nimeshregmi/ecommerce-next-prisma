import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"

export async function middleware(request: NextRequest) {
  const user = await getAuthUser(request)
  const path = request.nextUrl.pathname

  // Admin routes protection
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (!user) {
      // Not authenticated
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    if (user.role !== "admin") {
      // Not an admin
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Protected user routes
  if (
    path.startsWith("/account") ||
    path.startsWith("/checkout") ||
    path.startsWith("/api/cart") ||
    path.startsWith("/api/orders")
  ) {
    if (!user) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }
  }

  // Prevent authenticated users from accessing login/signup pages
  if ((path.startsWith("/auth/sign-in") || path.startsWith("/auth/sign-up")) && user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/api/cart/:path*",
    "/api/orders/:path*",
    "/auth/sign-in",
    "/auth/sign-up",
  ],
}
