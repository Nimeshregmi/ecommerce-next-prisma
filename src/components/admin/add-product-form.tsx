"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createProduct, updateProduct } from "@/lib/data/products"
import { getCategories } from "@/lib/data/categories"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from "uuid"

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
  productStatus: string
  categoryId: string
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
}: {
  onClose: () => void
  onSuccess: (product: Product) => void
  editingProduct: Product | null
}) {
  const [formData, setFormData] = useState<{
    productName: string
    productPrice: string
    productStatus: string
    categoryId: string
  }>({
    productName: editingProduct?.productName || "",
    productPrice: editingProduct?.productPrice.toString() || "",
    productStatus: editingProduct?.productStatus || "active",
    categoryId: editingProduct?.categoryId || "",
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }

    loadCategories()
  }, [])

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
      }

      let result

      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData)
      } else {
        result = await createProduct({
          ...productData,
          productId: uuidv4().substring(0, 8),
        })
      }

      onSuccess(result)
    } catch (error) {
      console.error("Failed to save product:", error)
      setError("Failed to save product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">{editingProduct ? "Edit Product" : "Add New Product"}</h3>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

      <div className="space-y-2">
        <label className="text-sm font-medium">Product Name</label>
        <Input name="productName" value={formData.productName} onChange={handleChange} disabled={isLoading} required />
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={formData.productStatus}
          onValueChange={(value) => handleSelectChange("productStatus", value)}
          disabled={isLoading}
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
