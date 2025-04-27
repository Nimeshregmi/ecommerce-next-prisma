"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Button 
      onClick={scrollToTop}
      variant="outline" 
      className="rounded-full border border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:border-purple-200 transition-all duration-300 flex items-center gap-2"
    >
      Back to top
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </Button>
  )
}