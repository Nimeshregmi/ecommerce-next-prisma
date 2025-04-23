import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"

// Update cart item quantity
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { quantity } = await req.json()

    if (quantity === undefined || quantity < 1) {
      return NextResponse.json({ success: false, error: "Valid quantity is required" }, { status: 400 })
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

    // Get cart
    const cart = await prisma.shoppingCart.findFirst({
      where: { customerId: customer.id },
    })

    if (!cart) {
      return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 })
    }

    // Check if item exists and belongs to user's cart
    const cartItem = await prisma.shoppingCartItem.findFirst({
      where: {
        id: params.id,
        cartId: cart.id,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ success: false, error: "Cart item not found" }, { status: 404 })
    }

    // Update item quantity
    await prisma.shoppingCartItem.update({
      where: { id: params.id },
      data: { quantity },
    })

    // Get updated cart
    const updatedCart = await prisma.shoppingCart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Cart item updated",
      data: {
        id: updatedCart?.id,
        items: updatedCart?.cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product: item.product,
        })),
      },
    })
  } catch (error) {
    console.error("Update cart item error:", error)
    return NextResponse.json({ success: false, error: "Failed to update cart item" }, { status: 500 })
  }
}

// Delete cart item
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Get cart
    const cart = await prisma.shoppingCart.findFirst({
      where: { customerId: customer.id },
    })

    if (!cart) {
      return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 })
    }

    // Check if item exists and belongs to user's cart
    const cartItem = await prisma.shoppingCartItem.findFirst({
      where: {
        id: params.id,
        cartId: cart.id,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ success: false, error: "Cart item not found" }, { status: 404 })
    }

    // Delete item
    await prisma.shoppingCartItem.delete({
      where: { id: params.id },
    })

    // Get updated cart
    const updatedCart = await prisma.shoppingCart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Cart item removed",
      data: {
        id: updatedCart?.id,
        items: updatedCart?.cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product: item.product,
        })),
      },
    })
  } catch (error) {
    console.error("Delete cart item error:", error)
    return NextResponse.json({ success: false, error: "Failed to remove cart item" }, { status: 500 })
  }
}
