import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

// Seed data for categories
const categories = [
  { id: uuidv4(), categoryId: "outerwear", categoryName: "Outerwear" },
  { id: uuidv4(), categoryId: "jeans", categoryName: "Jeans" },
  { id: uuidv4(), categoryId: "sweaters", categoryName: "Sweaters" },
  { id: uuidv4(), categoryId: "pants", categoryName: "Pants" },
  { id: uuidv4(), categoryId: "tshirts", categoryName: "T-Shirts" },
  { id: uuidv4(), categoryId: "jackets", categoryName: "Jackets" },
]

// Seed data for products
const createProducts = (categoryIds: string[]) => {
  return [
    {
      id: uuidv4(),
      productId: uuidv4().substring(0, 8),
      productName: "Leather Jacket",
      productPrice: 1200,
      productStatus: "active",
      categoryId: categoryIds[0], // Outerwear
    },
    {
      id: uuidv4(),
      productId: uuidv4().substring(0, 8),
      productName: "Slim Fit Jeans",
      productPrice: 800,
      productStatus: "active",
      categoryId: categoryIds[1], // Jeans
    },
    {
      id: uuidv4(),
      productId: uuidv4().substring(0, 8),
      productName: "Cashmere Sweater",
      productPrice: 1500,
      productStatus: "active",
      categoryId: categoryIds[2], // Sweaters
    },
    {
      id: uuidv4(),
      productId: uuidv4().substring(0, 8),
      productName: "Casual Chinos",
      productPrice: 700,
      productStatus: "active",
      categoryId: categoryIds[3], // Pants
    },
    {
      id: uuidv4(),
      productId: uuidv4().substring(0, 8),
      productName: "Cotton T-Shirt",
      productPrice: 300,
      productStatus: "active",
      categoryId: categoryIds[4], // T-Shirts
    },
    {
      id: uuidv4(),
      productId: uuidv4().substring(0, 8),
      productName: "Denim Jacket",
      productPrice: 900,
      productStatus: "active",
      categoryId: categoryIds[5], // Jackets
    },
    {
      id: uuidv4(),
      productId: uuidv4().substring(0, 8),
      productName: "Winter Parka",
      productPrice: 1800,
      productStatus: "active",
      categoryId: categoryIds[0], // Outerwear
    },
    {
      id: uuidv4(),
      productId: uuidv4().substring(0, 8),
      productName: "Distressed Jeans",
      productPrice: 850,
      productStatus: "active",
      categoryId: categoryIds[1], // Jeans
    },
  ]
}

// Create a test user
const createTestUser = async () => {
  const hashedPassword = await bcrypt.hash("password123", 10)

  const userId = uuidv4()
  return {
    id: uuidv4(),
    userId,
    password: hashedPassword,
    loginStatus: "inactive",
    customer: {
      create: {
        customerName: "Test User",
        email: "test@example.com",
        address: "123 Test St, Test City",
      },
    },
  }
}

export async function GET() {
  try {
    // Create categories
    await prisma.productCategory.createMany({
      data: categories,
      skipDuplicates: true,
    })

    // Get category IDs
    const categoryIds = categories.map((cat) => cat.id)

    // Create products
    const products = createProducts(categoryIds)
    await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    })

    // Create test user
    const testUser = await createTestUser()
    await prisma.user.create({
      data: testUser,
    })

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        categories: categories.length,
        products: products.length,
        users: 1,
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: String(error),
      },
      { status: 500 },
    )
  }
}
