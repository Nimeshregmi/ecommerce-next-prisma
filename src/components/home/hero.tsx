import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="relative w-full">
      <div className="relative h-[600px] w-full">
        <Image src="/images/hero.jpg" alt="Hero image" fill className="object-cover" priority />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-6 text-white">
          <div className="max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">Elevate Your Style</h1>
            <p className="mb-8 text-center text-lg md:text-xl text-shadow-2xs shadow-black">
              Discover the latest trends in fashion with our new collection. Designed for comfort, style, and
              sustainability.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
                <Link href="/categories/new-arrivals">SHOP NEW ARRIVALS</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white/10">
                <Link href="/categories">BROWSE COLLECTIONS</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
