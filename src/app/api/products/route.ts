import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get all products with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {
      productStatus: "active", // Only return active products by default
    }

    if (category) {
      const categoryObj = await prisma.productCategory.findFirst({
        where: {
          OR: [{ categoryId: category }, { categoryName: { contains: category, mode: "insensitive" } }],
        },
      })

      if (categoryObj) {
        where.categoryId = categoryObj.id
      }
    }

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: "insensitive" } },
        { productId: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: {
          productName: "asc",
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}
