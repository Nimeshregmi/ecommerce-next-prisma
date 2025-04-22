import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="relative w-full">
      <div className="relative h-[500px] w-full">
        <Image src="/placeholder.svg?height=1000&width=2000" alt="Hero image" fill className="object-cover" priority />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 p-6 text-white">
          <h1 className="mb-4 text-4xl font-bold">Your Cozy Era</h1>
          <p className="mb-8 text-center text-lg">
            Get peak comfy-chic
            <br />
            with new winter essentials.
          </p>
          <Button asChild className="bg-white text-black hover:bg-gray-100">
            <Link href="/categories/winter">SHOP NOW</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
