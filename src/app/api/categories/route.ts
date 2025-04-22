import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get all categories
export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: {
        categoryName: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}
