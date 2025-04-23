import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    // Get fresh user data from database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        customer: true,
        administrator: true,
      },
    })

    if (!userData) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Determine if user is admin
    const isAdmin = userData.role === "admin" || !!userData.administrator

    return NextResponse.json({
      success: true,
      data: {
        id: userData.id,
        email: userData.customer?.email || userData.administrator?.email,
        name: userData.customer?.customerName || userData.administrator?.adminName,
        role: isAdmin ? "admin" : "user",
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ success: false, error: "Failed to get user data" }, { status: 500 })
  }
}
