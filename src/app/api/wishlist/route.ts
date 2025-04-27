import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"

// Get user's wishlist items
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get customer ID from user ID
    const customer = await prisma.customer.findFirst({
      where: {
        user: {
          id: user.id,
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    // First, get or create the customer's wishlist
    let wishlist = await prisma.wishlist.findFirst({
      where: { 
        customerId: customer.id 
      }
    })

    if (!wishlist) {
      // Create a wishlist if one doesn't exist
      wishlist = await prisma.wishlist.create({
        data: {
          customerId: customer.id
        }
      })
    }

    // Get all wishlist items with product details
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { 
        wishlistId: wishlist.id 
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: wishlistItems,
    })
  } catch (error) {
    console.error("Get wishlist error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

// Add item to wishlist
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 })
    }

    // Get customer ID from user ID
    const customer = await prisma.customer.findFirst({
      where: {
        user: {
          id: user.id,
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Get or create the customer's wishlist
    let wishlist = await prisma.wishlist.findFirst({
      where: { customerId: customer.id }
    })

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          customerId: customer.id
        }
      })
    }

    // Check if item is already in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId: product.id,
      },
    })

    if (existingItem) {
      return NextResponse.json({
        success: false,
        error: "Item already in wishlist",
      }, { status: 400 })
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: product.id,
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: wishlistItem,
    })
  } catch (error) {
    console.error("Add to wishlist error:", error)
    return NextResponse.json({ success: false, error: "Failed to add to wishlist" }, { status: 500 })
  }
}

// Remove item from wishlist
export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const itemId = url.searchParams.get('id')

    if (!itemId) {
      return NextResponse.json({ success: false, error: "Item ID is required" }, { status: 400 })
    }

    // Get customer ID from user ID
    const customer = await prisma.customer.findFirst({
      where: {
        user: {
          id: user.id,
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    // Get the customer's wishlist first
    const wishlist = await prisma.wishlist.findFirst({
      where: { customerId: customer.id }
    })

    if (!wishlist) {
      return NextResponse.json({ success: false, error: "Wishlist not found" }, { status: 404 })
    }

    // Check if item exists and belongs to customer's wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        wishlistId: wishlist.id,
      },
    })

    if (!existingItem) {
      return NextResponse.json({ success: false, error: "Wishlist item not found" }, { status: 404 })
    }

    // Remove from wishlist
    await prisma.wishlistItem.delete({
      where: {
        id: itemId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist",
    })
  } catch (error) {
    console.error("Remove from wishlist error:", error)
    return NextResponse.json({ success: false, error: "Failed to remove from wishlist" }, { status: 500 })
  }
}