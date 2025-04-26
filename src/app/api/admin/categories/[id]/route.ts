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

    const { categoryName, categoryId, image } = await req.json()

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

    const normalizedCategoryId = categoryId || categoryName.toLowerCase().replace(/\s+/g, "-")

    // Check if categoryId is already in use by another category
    if (normalizedCategoryId !== existingCategory.categoryId) {
      const duplicateCategory = await prisma.productCategory.findFirst({
        where: {
          categoryId: normalizedCategoryId,
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
        categoryId: normalizedCategoryId,
        // Keep the existing websiteId
        image: image || null,
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
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }
    
    // Extract the ID directly from the URL path
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const categoryId = pathParts[pathParts.length - 1]
    
    if (!categoryId) {
      return NextResponse.json({ success: false, error: "Category ID is required" }, { status: 400 })
    }
    
    // Verify the category exists
    const category = await prisma.productCategory.findUnique({
      where: { id: categoryId }
    })
    
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }
    
    // Check for products using this category
    const productsWithCategory = await prisma.product.count({
      where: { categoryId: categoryId }
    })
    
    if (productsWithCategory > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete category with ${productsWithCategory} products. Reassign or delete the products first.`
      }, { status: 400 })
    }
    
    // Delete the category
    await prisma.productCategory.delete({
      where: { id: categoryId }
    })
    
    return NextResponse.json({
      success: true,
      message: "Category deleted successfully"
    })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ 
      success: false, 
      error: `Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
