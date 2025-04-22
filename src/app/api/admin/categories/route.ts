import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"
import { v4 as uuidv4 } from "uuid"

// Create a new category (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    const { categoryName, categoryId } = await req.json()

    if (!categoryName) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 })
    }

    // Check if category already exists
    const existingCategory = await prisma.productCategory.findFirst({
      where: {
        OR: [{ categoryName }, { categoryId: categoryId || categoryName.toLowerCase().replace(/\s+/g, "-") }],
      },
    })

    if (existingCategory) {
      return NextResponse.json({ success: false, error: "Category already exists" }, { status: 409 })
    }

    // Create category
    const category = await prisma.productCategory.create({
      data: {
        id: uuidv4(),
        categoryName,
        categoryId: categoryId || categoryName.toLowerCase().replace(/\s+/g, "-"),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: category,
    })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
}
