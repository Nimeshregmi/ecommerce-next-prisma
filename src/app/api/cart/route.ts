import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-utils"

// Get user's cart
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

    // Get or create cart
    let cart = await prisma.shoppingCart.findFirst({
      where: { customerId: customer.id },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart) {
      cart = await prisma.shoppingCart.create({
        data: {
          customerId: customer.id,
        },
        include: {
          cartItems: {
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
        id: cart.id,
        items: cart.cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product: item.product,
        })),
      },
    })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 })
  }
}

// Add item to cart
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { productId, quantity = 1, selectedColor, selectedSize } = await req.json()

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
    
    // Check product stock
    if (product.stockQuantity < quantity) {
      return NextResponse.json({ 
        success: false, 
        error: `Not enough stock. Only ${product.stockQuantity} items available.` 
      }, { status: 400 })
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

    // Get or create cart
    let cart = await prisma.shoppingCart.findFirst({
      where: { customerId: customer.id },
    })

    if (!cart) {
      cart = await prisma.shoppingCart.create({
        data: {
          customerId: customer.id,
        },
      })
    }

    // Check if item with same product, color and size already in cart
    const existingItem = await prisma.shoppingCartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        selectedColor: selectedColor || null,
        selectedSize: selectedSize || null,
      },
    })

    if (existingItem) {
      // Check if updated quantity exceeds stock
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stockQuantity) {
        return NextResponse.json({ 
          success: false, 
          error: `Cannot add ${quantity} more items. Only ${product.stockQuantity - existingItem.quantity} more available.` 
        }, { status: 400 })
      }
      
      // Update quantity
      await prisma.shoppingCartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
        },
      })
    } else {
      // Add new item
      await prisma.shoppingCartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          selectedColor: selectedColor || null,
          selectedSize: selectedSize || null,
          dateAdded: new Date(),
        },
      })
    }

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
      message: "Item added to cart",
      data: {
        id: updatedCart?.id,
        items:
          updatedCart?.cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            product: item.product,
          })) || [],
      },
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ success: false, error: "Failed to add item to cart" }, { status: 500 })
  }
}

// Clear cart
export async function DELETE(req: NextRequest) {
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

    if (cart) {
      // Delete all items
      await prisma.shoppingCartItem.deleteMany({
        where: { cartId: cart.id },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
    })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json({ success: false, error: "Failed to clear cart" }, { status: 500 })
  }
}
