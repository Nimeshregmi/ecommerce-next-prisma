import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"

// Update a product (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    const data = await req.json()

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!existingProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        productName: data.productName,
        productPrice: Number.parseFloat(data.productPrice),
        productStatus: data.productStatus,
        categoryId: data.categoryId,
        image: data.imageUrl,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

// Delete a product (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }
    
    // Extract the ID directly from the URL path to avoid params.id error
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const productId = pathParts[pathParts.length - 1]
    
    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 })
    }
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!existingProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }
    
    // Check if product has associated order details (completed orders)
    const orderDetailsCount = await prisma.orderDetail.count({
      where: { productId: productId }
    })
    
    if (orderDetailsCount > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete product that is referenced in ${orderDetailsCount} completed orders. This would violate data integrity.`,
      }, { status: 400 })
    }
    
    // Use a transaction to ensure everything happens atomically
    const result = await prisma.$transaction(async (tx: { shoppingCartItem: { deleteMany: (arg0: { where: { productId: string } | { productId: string } }) => any }; product: { delete: (arg0: { where: { id: string } }) => any } }) => {
      // Check for product in cart items
      let deletedCartItems = 0;
      
      try {
        // Try with cartItem model
        const deletedItems = await tx.shoppingCartItem.deleteMany({
          where: { productId: productId }
        });
        deletedCartItems = deletedItems.count;
      } catch (e) {
        // If cartItem doesn't work, try with shoppingCartItem
        try {
          const deletedItems = await tx.shoppingCartItem.deleteMany({
            where: { productId: productId }
          });
          deletedCartItems = deletedItems.count;
        } catch (innerError) {
          console.error("Error deleting cart items:", innerError);
          // Continue even if cart item deletion fails - we'll log it but still try to delete the product
        }
      }
      
      // Delete the product
      const deletedProduct = await tx.product.delete({
        where: { id: productId }
      });
      
      return { deletedProduct, deletedCartItems };
    });
    
    return NextResponse.json({
      success: true,
      message: result.deletedCartItems > 0 
        ? `Product deleted successfully. Also removed from ${result.deletedCartItems} shopping carts.` 
        : "Product deleted successfully."
    });
  } catch (error) {
    console.error("Delete product error:", error);
    
    // Check for specific error types
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2003') {
      return NextResponse.json({ 
        success: false, 
        error: "This product cannot be deleted because it's referenced in other parts of the system." 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}
