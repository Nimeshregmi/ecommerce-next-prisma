import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth-utils"

export async function POST() {
  try {
    await clearAuthCookie();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, error: "Failed to logout" }, { status: 500 })
  }
}
