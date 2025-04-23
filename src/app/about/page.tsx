import type { Metadata } from "next"
import Image from "next/image"
import NewsletterSignup from "@/components/newsletter-signup"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "About Us | Fashion Fuel",
  description: "Learn about our mission and values at Fashion Fuel",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16 flex flex-col items-center">
        <div className="relative mb-6 h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <h1 className="mb-4 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">Our Story</h1>
        <p className="max-w-2xl text-center text-lg text-muted-foreground">
          Crafting sustainable fashion that empowers both the wearer and the world.
        </p>
      </div>

      {/* Mission & Values Section */}
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h2 className="mb-3 text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              At Fashion Fuel, we believe style should be effortless, ethical, and empowering. That's why we collaborate
              with trusted, ethical manufacturers around the world. We carefully select high-quality, sustainable materials.
              And we're committed to sharing every step of the journey with you—from the design process to the real cost
              behind each piece.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-2xl font-bold">Our Vision</h2>
            <p className="text-muted-foreground">
              It's not just fashion—it's a movement toward conscious clothing. We're here to fuel your wardrobe with pieces
              that not only look good, but feel good to wear and support. This is fashion with intention. This is Fashion
              Fuel.
            </p>
          </div>
        </div>
        <div className="relative h-[400px] overflow-hidden rounded-2xl">
          <Image 
            src="/images/hero.jpg" 
            alt="Fashion collection" 
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 max-w-[80%] rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-lg font-medium text-white">We call it Inspired Transparency—because the best style starts with honesty.</p>
          </div>
        </div>
      </div>

      {/* Values Cards */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Core Values</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md transition-all hover:shadow-lg dark:from-blue-950/30 dark:to-indigo-950/30">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V7l-8-5-8 5v5c0 6 8 10 8 10"></path>
                  <path d="m14.5 9-5 5"></path>
                  <path d="m9.5 9 5 5"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Sustainability</h3>
              <p className="text-muted-foreground">We prioritize eco-friendly materials and ethical manufacturing processes to reduce our environmental footprint.</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md transition-all hover:shadow-lg dark:from-green-950/30 dark:to-emerald-950/30">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Community</h3>
              <p className="text-muted-foreground">Building meaningful relationships with our customers, partners, and the communities where our products are made.</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md transition-all hover:shadow-lg dark:from-purple-950/30 dark:to-pink-950/30">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M12 18v-6"></path>
                  <path d="M8 18v-1"></path>
                  <path d="M16 18v-3"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Transparency</h3>
              <p className="text-muted-foreground">We openly share our manufacturing processes, material sources, and pricing to build trust with our customers.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 p-8 dark:from-gray-800/50 dark:to-gray-900/50">
        <div className="mx-auto max-w-3xl">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  )
}
