"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
  productStatus: string
  categoryId: string
  image?: string | null
  color: string[]
  size: string[]
  description?: string
  stockQuantity?: number
}

type Category = {
  id: string
  categoryId: string
  categoryName: string
}

// Available colors and sizes for selection
const AVAILABLE_COLORS = [
  { name: "Red", value: "red" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Black", value: "black" },
  { name: "White", value: "white" },
  { name: "Yellow", value: "yellow" },
  { name: "Purple", value: "purple" },
  { name: "Pink", value: "pink" },
  { name: "Orange", value: "orange" },
  { name: "Gray", value: "gray" }
]

const AVAILABLE_SIZES = [
  { name: "XS", value: "xs" },
  { name: "S", value: "s" },
  { name: "M", value: "m" },
  { name: "L", value: "l" },
  { name: "XL", value: "xl" },
  { name: "XXL", value: "xxl" }
]

export default function AddProductForm({
  onClose,
  onSuccess,
  editingProduct,
  categories,
}: {
  onClose: () => void
  onSuccess: (product: Product) => void
  editingProduct: Product | null
  categories: Category[]
}) {
  const [formData, setFormData] = useState<{
    productName: string
    productPrice: string
    productStatus: string
    categoryId: string
    image: string
    color: string[]
    size: string[]
    description: string
    stockQuantity: string
  }>({
    productName: editingProduct?.productName || "",
    productPrice: editingProduct?.productPrice?.toString() || "",
    productStatus: editingProduct?.productStatus || "active",
    categoryId: editingProduct?.categoryId || "",
    image: editingProduct?.image || "",
    color: editingProduct?.color || [],
    size: editingProduct?.size || [],
    description: editingProduct?.description || "",
    stockQuantity: editingProduct?.stockQuantity?.toString() || "0",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleColor = (color: string) => {
    setFormData((prev) => {
      if (prev.color.includes(color)) {
        return { ...prev, color: prev.color.filter((c) => c !== color) }
      } else {
        return { ...prev, color: [...prev.color, color] }
      }
    })
  }

  const toggleSize = (size: string) => {
    setFormData((prev) => {
      if (prev.size.includes(size)) {
        return { ...prev, size: prev.size.filter((s) => s !== size) }
      } else {
        return { ...prev, size: [...prev.size, size] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.productName || !formData.productPrice || !formData.categoryId) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const productData = {
        productName: formData.productName,
        productPrice: Number.parseFloat(formData.productPrice),
        productStatus: formData.productStatus,
        categoryId: formData.categoryId,
        image: formData.image || null,
        color: formData.color,
        size: formData.size,
        description: formData.description,
        stockQuantity: Number.parseInt(formData.stockQuantity, 10)
      }

      let response

      if (editingProduct) {
        response = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        })
      } else {
        response = await fetch("/api/admin/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...productData,
            productId: uuidv4().substring(0, 8),
          }),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: editingProduct ? "Product updated successfully" : "Product created successfully",
        })
        onSuccess(data.data)
      } else {
        setError(data.error || "Failed to save product")
        toast({
          title: "Error",
          description: data.error || "Failed to save product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to save product:", error)
      setError("Failed to save product. Please try again.")
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">{editingProduct ? "Edit Product" : "Add New Product"}</h3>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name</label>
          <Input
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input
            name="productPrice"
            type="number"
            step="0.01"
            value={formData.productPrice}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={formData.productStatus}
            onValueChange={(value) => handleSelectChange("productStatus", value)}
            disabled={isLoading}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => handleSelectChange("categoryId", value)}
            disabled={isLoading}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Stock Quantity</label>
        <Input
          name="stockQuantity"
          type="number"
          value={formData.stockQuantity}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Product Description</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter a detailed description of the product"
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Available Colors</label>
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {formData.color.length > 0 ? (
                formData.color.map((color) => (
                  <Badge key={color} className="flex items-center gap-1 mr-2 mb-2 bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {color}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 text-blue-700 hover:text-blue-900 hover:bg-transparent"
                      onClick={() => toggleColor(color)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">No colors selected</span>
              )}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {AVAILABLE_COLORS.map((color) => (
              <div key={color.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`color-${color.value}`} 
                  checked={formData.color.includes(color.value)}
                  onCheckedChange={() => toggleColor(color.value)}
                  disabled={isLoading}
                />
                <label 
                  htmlFor={`color-${color.value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {color.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Available Sizes</label>
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {formData.size.length > 0 ? (
                formData.size.map((size) => (
                  <Badge key={size} className="flex items-center gap-1 mr-2 mb-2 bg-purple-50 text-purple-700 hover:bg-purple-100">
                    {size.toUpperCase()}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 text-purple-700 hover:text-purple-900 hover:bg-transparent"
                      onClick={() => toggleSize(size)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">No sizes selected</span>
              )}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {AVAILABLE_SIZES.map((size) => (
              <div key={size.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`size-${size.value}`} 
                  checked={formData.size.includes(size.value)}
                  onCheckedChange={() => toggleSize(size.value)}
                  disabled={isLoading}
                />
                <label 
                  htmlFor={`size-${size.value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {size.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image URL</label>
        <Input
          name="image"
          value={formData.image}
          onChange={handleChange}
          disabled={isLoading}
          required
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-muted-foreground">Enter a URL for the product image</p>
      </div>

      {formData.image && (
        <div className="mt-2">
          <p className="mb-2 text-sm font-medium">Image Preview</p>
          <div className="relative h-40 w-full overflow-hidden rounded-md bg-gray-100">
            <Image
              src={formData.image || "/placeholder.svg"}
              alt="Product preview"
              fill
              className="object-cover"
              onError={() => {
                toast({
                  title: "Error",
                  description: "Failed to load image. Please check the URL.",
                  variant: "destructive",
                })
              }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : editingProduct ? "Update" : "Add Product"}
        </Button>
      </div>
    </form>
  )
}
