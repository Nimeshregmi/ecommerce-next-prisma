import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { createToken, setAuthCookie } from "@/lib/auth-utils"
import { createNotification } from "@/lib/utils"

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

    const { user } = customer

    if (user) {
      // Update login status
      await prisma.user.update({
        where: { id: user.id },
        data: { loginStatus: "active" },
      })

      // Create a login notification
      await createNotification(
        user.id,
        "Login Successful",
        "You have successfully logged in.",
        "auth"
      )

      // Create token and setup the auth cookie
      const token = await createToken({
        id: user.id,
        name: customer.customerName,
        email: customer.email,
        role: user.role as 'user'|'admin',
      })

      // Create response with auth cookie
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
          id: user.id,
          name: customer.customerName,
          email: customer.email,
          role: user.role,
        },
      })

      // Set the auth cookie in the response
      await setAuthCookie(response, token)

      return response
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
