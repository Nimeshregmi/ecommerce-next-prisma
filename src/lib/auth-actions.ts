"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import { UserResponse, ExtendedUser } from "@/types"

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

    // Create and set JWT token
    const { createToken } = await import('@/lib/auth-utils')
    
    // Determine user role - admin or regular user
    const isAdmin = await prisma.administrator.findUnique({
      where: { userId: customer.user.id },
    })
    
    const token = await createToken({
      id: customer.user.id,
      email: customer.email,
      role: isAdmin ? "admin" : "user",
      name: customer.customerName,
    })
    
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
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
  redirect("/auth/sign-in")
}

// Get current user
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    // Import verifyToken only when needed to avoid circular dependencies
    const { verifyToken } = await import('@/lib/auth-utils')
    
    // Verify JWT token
    const payload = await verifyToken(token)
    
    if (!payload || !payload.id) {
      return null
    }
    
    // Fetch the user from database to get the latest data
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      include: {
        customer: true,
        administrator: true,
      },
    })

    if (!user) {
      return null
    }

    // Cast to ExtendedUser to access the role property
    const extendedUser = user as unknown as ExtendedUser
    const role = extendedUser.role || "user"
    const isAdmin = role === "admin"
    
    const userData: UserResponse = {
      id: user.id,
      userId: user.userId,
      customerName: user.customer?.customerName,
      email: user.customer?.email,
      role,
      isAdmin,
    }
    
    return userData
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
