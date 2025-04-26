"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
  productStatus: string
  categoryId: string
  image?: string | null
}

type Category = {
  id: string
  categoryId: string
  categoryName: string
}

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
  }>({
    productName: editingProduct?.productName || "",
    productPrice: editingProduct?.productPrice.toString() || "",
    productStatus: editingProduct?.productStatus || "active",
    categoryId: editingProduct?.categoryId || "",
    image: editingProduct?.image || "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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
