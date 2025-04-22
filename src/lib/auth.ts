import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

export async function signUp({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.customer.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return {
        success: false,
        error: "Email already in use",
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userId = uuidv4()
    const user = await prisma.user.create({
      data: {
        userId,
        password: hashedPassword,
        customer: {
          create: {
            customerName: `${firstName} ${lastName}`,
            email,
            address: "",
          },
        },
      },
    })

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      success: false,
      error: "Failed to create account",
    }
  }
}

export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}) {
  try {
    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: {
        email,
      },
      include: {
        user: true,
      },
    })

    if (!customer || !customer.user) {
      return {
        success: false,
        error: "Invalid email or password",
      }
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, customer.user.password)

    if (!passwordValid) {
      return {
        success: false,
        error: "Invalid email or password",
      }
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

    return {
      success: true,
      userId: customer.user.id,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      success: false,
      error: "Authentication failed",
    }
  }
}

export async function signOut(userId: string) {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        loginStatus: "inactive",
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Sign out error:", error)
    return {
      success: false,
      error: "Failed to sign out",
    }
  }
}
