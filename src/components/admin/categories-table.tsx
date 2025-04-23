"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

type Category = {
  id: string
  categoryId: string
  categoryName: string
  image?: string | null
}

export default function AdminCategoriesTable({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryId: "",
    image: "",
  })
  const { toast } = useToast()

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setSelectedCategory(category)
      setFormData({
        categoryName: category.categoryName,
        categoryId: category.categoryId,
        image: category.image || "",
      })
    } else {
      setSelectedCategory(null)
      setFormData({
        categoryName: "",
        categoryId: "",
        image: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.categoryName) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      let response

      if (selectedCategory) {
        // Update existing category
        response = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName: formData.categoryName,
            categoryId: formData.categoryId || formData.categoryName.toLowerCase().replace(/\s+/g, "-"),
            image: formData.image,
          }),
        })
      } else {
        // Create new category
        response = await fetch("/api/admin/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName: formData.categoryName,
            categoryId: formData.categoryId || formData.categoryName.toLowerCase().replace(/\s+/g, "-"),
            image: formData.image,
          }),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: selectedCategory ? "Category updated successfully" : "Category created successfully",
        })

        if (selectedCategory) {
          // Update categories list
          setCategories(categories.map((cat) => (cat.id === selectedCategory.id ? data.data : cat)))
        } else {
          // Add new category to list
          setCategories([...categories, data.data])
        }

        setIsDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Category save error:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })

        // Remove category from list
        setCategories(categories.filter((cat) => cat.id !== selectedCategory.id))
        setIsDeleteDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Category delete error:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.categoryId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                      {category.image ? (
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.categoryName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{category.categoryId}</TableCell>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(category)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Update the category details below."
                : "Fill in the details to create a new category."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="e.g. Summer Collection"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category ID (URL slug)</label>
              <Input
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="e.g. summer-collection"
              />
              <p className="text-xs text-muted-foreground">Leave blank to auto-generate from name</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground">Enter a URL for the category image</p>
            </div>

            {formData.image && (
              <div className="mt-2">
                <p className="mb-2 text-sm font-medium">Image Preview</p>
                <div className="relative h-40 w-full overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={formData.image || "/placeholder.svg"}
                    alt="Category preview"
                    fill
                    className="object-cover"
                    unoptimized
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : selectedCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.categoryName}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
