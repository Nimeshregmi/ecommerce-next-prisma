import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

// Get specific wishlist item
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get wishlist item
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id: params.id },
      include: { product: true },
    })

    if (!wishlistItem) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    // Check if the user owns this wishlist item
    const wishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistItem.wishlistId },
      include: { customer: true },
    })

    if (!wishlist || wishlist.customer.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: wishlistItem.id,
        product: wishlistItem.product,
        addedAt: wishlistItem.addedAt,
      },
    })
  } catch (error) {
    console.error("Get wishlist item error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch wishlist item" }, { status: 500 })
  }
}

// Delete wishlist item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get wishlist item
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id: params.id },
      include: { wishlist: { include: { customer: true } } },
    })

    if (!wishlistItem) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    // Check if the user owns this wishlist item
    if (wishlistItem.wishlist.customer.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Delete wishlist item
    await prisma.wishlistItem.delete({
      where: { id: params.id },
    })

    // Get updated wishlist
    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistItem.wishlistId },
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
      message: "Item removed from wishlist",
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
    console.error("Delete wishlist item error:", error)
    return NextResponse.json({ success: false, error: "Failed to remove item from wishlist" }, { status: 500 })
  }
}