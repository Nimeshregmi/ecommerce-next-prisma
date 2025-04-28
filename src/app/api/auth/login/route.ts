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

      return NextResponse.json({
        success: true,
        message: "Login successful",
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
