"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function WebsiteSettings() {
  const [formData, setFormData] = useState({
    websiteName: "Fashion Fuel",
    websiteUrl: "https://fashionfuel.com",
    contact: "support@fashionfuel.com",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSaved(true)

      setTimeout(() => {
        setIsSaved(false)
      }, 3000)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Website Name</label>
        <Input name="websiteName" value={formData.websiteName} onChange={handleChange} disabled={isLoading} required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Website URL</label>
        <Input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} disabled={isLoading} required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Contact Email</label>
        <Input
          name="contact"
          type="email"
          value={formData.contact}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>

      {isSaved && <p className="text-sm text-green-600">Settings saved successfully!</p>}
    </form>
  )
}
