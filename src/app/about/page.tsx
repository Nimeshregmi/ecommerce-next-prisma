import type { Metadata } from "next"
import NewsletterSignup from "@/components/newsletter-signup"

export const metadata: Metadata = {
  title: "About Us | Fashion Fuel",
  description: "Learn about our mission and values at Fashion Fuel",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="mb-8 text-3xl font-bold">About Us</h1>

      <div className="mb-12 space-y-6 text-center">
        <p>
          At Fashion Fuel, we believe style should be effortless, ethical, and empowering. That's why we collaborate
          with trusted, ethical manufacturers around the world. We carefully select high-quality, sustainable materials.
          And we're committed to sharing every step of the journey with you—from the design process to the real cost
          behind each piece.
        </p>
        <p>
          It's not just fashion—it's a movement toward conscious clothing. We're here to fuel your wardrobe with pieces
          that not only look good, but feel good to wear and support. This is fashion with intention. This is Fashion
          Fuel.
        </p>
        <p>We call it Inspired Transparency—because the best style starts with honesty.</p>
      </div>

      <div className="mt-12">
        <NewsletterSignup />
      </div>
    </div>
  )
}
