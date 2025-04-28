// Common type definitions for the application

export type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
  productStatus?: string
  categoryId?: string
  image?: string | null
  color?: string[]
  size?: string[]
  description?: string | null  // Now accepts string, null, or undefined
  stockQuantity?: number
  category?: {
    id: string
    categoryName: string
  }
}

export type Category = {
  id: string
  categoryId: string
  categoryName: string
  image?: string | null
}

export type CartItem = {
  id: string
  quantity: number
  selectedColor?: string | null
  selectedSize?: string | null
  product: Product
}

export type WishlistItem = {
  id: string
  wishlistId: string
  productId: string
  addedAt: Date | string
  product: Product
}

export type Notification = {
  id: string
  title: string
  message: string
  createdAt: string
  type: string
  isRead: boolean
  referenceId?: string | null
}