import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"

// Update a category (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    const { categoryName, categoryId } = await req.json()

    if (!categoryName) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 })
    }

    // Check if category exists
    const existingCategory = await prisma.productCategory.findUnique({
      where: { id: params.id },
    })

    if (!existingCategory) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    // Check if categoryId is already in use by another category
    if (categoryId && categoryId !== existingCategory.categoryId) {
      const duplicateCategory = await prisma.productCategory.findFirst({
        where: {
          categoryId,
          id: { not: params.id },
        },
      })

      if (duplicateCategory) {
        return NextResponse.json({ success: false, error: "Category ID already in use" }, { status: 409 })
      }
    }

    // Update category
    const category = await prisma.productCategory.update({
      where: { id: params.id },
      data: {
        categoryName,
        categoryId: categoryId || categoryName.toLowerCase().replace(/\s+/g, "-"),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    })
  } catch (error) {
    console.error("Update category error:", error)
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 })
  }
}

// Delete a category (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    // Check if category exists
    const existingCategory = await prisma.productCategory.findUnique({
      where: { id: params.id },
    })

    if (!existingCategory) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: params.id },
    })

    if (productsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category with ${productsCount} products. Please reassign or delete the products first.`,
        },
        { status: 400 },
      )
    }

    // Delete category
    await prisma.productCategory.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 })
  }
}
