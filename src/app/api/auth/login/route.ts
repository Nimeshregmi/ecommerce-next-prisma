import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { createToken, setAuthCookie } from "@/lib/auth-utils"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: { email },
      include: {
        user: true,
      },
    })

    if (!customer || !customer.user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, customer.user.password)

    if (!passwordValid) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Update login status
    await prisma.user.update({
      where: {
        id: customer.user.id,
      },
      data: {
        loginStatus: "active",
      },
    })

    // Create JWT token
    const token = await createToken({
      id: customer.user.id,
      email: customer.email,
      role: customer.user.role as "user" | "admin",
      name: customer.customerName,
    })

    // Set auth cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        id: customer.user.id,
        email: customer.email,
        name: customer.customerName,
        role: customer.user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
