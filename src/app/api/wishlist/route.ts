import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

// Get user's wishlist
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get customer ID from user ID
    const customer = await prisma.customer.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    // Get or create wishlist
    let wishlist = await prisma.wishlist.findFirst({
      where: { customerId: customer.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          customerId: customer.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: wishlist.id,
        items: wishlist.items.map((item) => ({
          id: item.id,
          addedAt: item.addedAt,
          product: item.product,
        })),
      },
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

    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Get customer ID from user ID
    const customer = await prisma.customer.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    // Get or create wishlist
    let wishlist = await prisma.wishlist.findFirst({
      where: { customerId: customer.id },
    })

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          customerId: customer.id,
        },
      })
    }

    // Check if item already in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    })

    if (existingItem) {
      return NextResponse.json({
        success: false, 
        error: "Item already in wishlist",
        data: {
          id: existingItem.id,
          productId: existingItem.productId,
          wishlistId: existingItem.wishlistId,
          addedAt: existingItem.addedAt,
        }
      }, { status: 400 })
    }

    // Add new item
    const newItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    })

    // Get updated wishlist
    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlist.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Item added to wishlist",
      data: {
        id: updatedWishlist?.id,
        items:
          updatedWishlist?.items.map((item) => ({
            id: item.id,
            addedAt: item.addedAt,
            product: item.product,
          })) || [],
      },
    })
  } catch (error) {
    console.error("Add to wishlist error:", error)
    return NextResponse.json({ success: false, error: "Failed to add item to wishlist" }, { status: 500 })
  }
}