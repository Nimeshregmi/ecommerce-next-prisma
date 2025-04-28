"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import AddProductForm from "@/components/admin/add-product-form"
// import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

type Product = {
  id: string
  productId: string
  productName: string
  productPrice: number
  productStatus: string
  categoryId: string
  image?: string | null
  color:string[]
  size:string[]
  description?:string
  category?: {
    id: string
    categoryName: string
  }
}

type Category = {
  id: string
  categoryId: string
  categoryName: string
}

export default function ProductsTable({
  initialProducts,
  categories,
}: {
  initialProducts: Product[]
  categories: Category[]
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (data.success) {
          setProducts(products.filter((product) => product.id !== id))
          toast({
            title: "Success",
            description: "Product deleted successfully",
          })
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to delete product",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to delete product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowAddForm(true)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-8 rounded-lg border p-6">
          <AddProductForm
            onClose={() => {
              setShowAddForm(false)
              setEditingProduct(null)
            }}
            onSuccess={(newProduct) => {
              if (editingProduct) {
                setProducts(products.map((p) => (p.id === newProduct.id ? newProduct : p)))
              } else {
                setProducts([...products, newProduct])
              }
              setShowAddForm(false)
              setEditingProduct(null)
            }}
            editingProduct={editingProduct}
            categories={categories}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Loading products...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                        {product.image ? (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.productName}
                            // fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.productId}</TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{formatCurrency(product.productPrice)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs ${
                          product.productStatus === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.productStatus}
                      </span>
                    </TableCell>
                    <TableCell>{product.category?.categoryName || "Unknown"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
