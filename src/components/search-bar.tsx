"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function SearchBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  return (
    <div className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <form onSubmit={handleSubmit} className="flex w-full items-center">
          <Input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            autoFocus
          />
          <button type="button" onClick={onClose} className="ml-2 text-sm text-gray-500">
            Cancel
          </button>
        </form>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4">
        <h3 className="mb-4 text-sm font-medium">Popular Categories</h3>
        <div className="flex flex-wrap gap-2">
          {["Winter", "Dresses", "Jackets", "Shoes", "Accessories"].map((category) => (
            <button
              key={category}
              onClick={() => {
                router.push(`/categories/${category.toLowerCase()}`)
                onClose()
              }}
              className="rounded-full border border-gray-200 px-4 py-1 text-sm hover:bg-gray-50"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
