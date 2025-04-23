import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"
import { v4 as uuidv4 } from "uuid"

// Get all categories (admin only)
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

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

// Create a new category (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    const { categoryName, categoryId, image } = await req.json()

    if (!categoryName) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 })
    }

    const normalizedCategoryId = categoryId || categoryName.toLowerCase().replace(/\s+/g, "-")

    // Check if category already exists
    const existingCategory = await prisma.productCategory.findFirst({
      where: {
        OR: [{ categoryName }, { categoryId: normalizedCategoryId }],
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
        categoryId: normalizedCategoryId,
        websiteId: "default-website-id", // Replace with the actual websiteId value
        image: image || null,
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
