"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { setAuthCookie, clearAuthCookie, verifyToken, createToken } from "@/lib/auth-utils"
import { Console } from "console"

// Sign up action
export async function signUpAction(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!firstName || !lastName || !email || !password) {
    return {
      success: false,
      error: "Please fill in all fields",
    }
  }

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
      include: {
        customer: true,
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

// Sign in action
export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const remember = formData.get("remember") === "on"

  if (!email || !password) {
    return {
      success: false,
      error: "Please fill in all fields",
    }
  }

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

    // Create JWT token
    const tokenPayload = {
      id: customer.user.id,
      email: customer.email,
      role: customer.user.role as "user" | "admin",
      name: customer.customerName
    }
    
    const token = await createToken(tokenPayload)
    
    // Set authentication cookie
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7 // 30 days or 7 days
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      maxAge,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return {
      success: true,
      userId: customer.user.id,
      customerName: customer.customerName,
      email: customer.email,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      success: false,
      error: "Authentication failed",
    }
  }
}

// Sign out action
export async function signOutAction() {
  await clearAuthCookie()
  redirect("/auth/sign-in")
}

// Get current user
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) {
    console.log("No auth-token cookie found")
    return null
  }

  try {
    // Decode the JWT token to get the user payload
    const decodedToken = await verifyToken(token)
    if (!decodedToken) {
      console.log("Invalid token")
      return null
    }

    // Use the decoded ID to find the user
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
      include: {
        customer: true,
        administrator: true,
      },
    })

    if (!user) {
      console.log("User not found with ID:", decodedToken.id)
      return null
    }

    return {
      id: user.id,
      userId: user.userId,
      customerName: user.customer?.customerName || user.administrator?.adminName,
      email: user.customer?.email || user.administrator?.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
