import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.customer.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with customer profile
    const userId = uuidv4()
    const user = await prisma.user.create({
      data: {
        userId,
        password: hashedPassword,
        role: "user", // Default role is user
        customer: {
          create: {
            customerName: `${firstName} ${lastName}`,
            email,
            address: "",
          },
        },
      },
      include: {
        customer: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        userId: user.userId,
        email: user.customer?.email,
        name: user.customer?.customerName,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 500 })
  }
}
