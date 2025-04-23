import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative w-full">
      {/* Main Hero Section */}
      <div className="relative h-[650px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
        <Image
          src="/images/hero.jpg"
          alt="Fashion collection"
          fill
          className="object-cover object-center scale-105 animate-subtle-zoom"
          priority
        />

        <div className="absolute inset-0 z-20">
          <div className="container mx-auto h-full px-4 flex flex-col justify-center">
            <div className="max-w-2xl">
              <Badge className="mb-6 bg-white/90 text-black hover:bg-white/80 px-3 py-1">
                <Sparkles className="mr-1 h-3 w-3" /> NEW COLLECTION 2025
              </Badge>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
                Elevate Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                  Style
                </span>
                <br />
                This Season
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-lg">
                Discover our premium collection designed for those who
                appreciate exceptional quality and contemporary aesthetics.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/new-arrivals"
                  className="text-primary hover:text-primary/80 font-medium flex items-center"
                >
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 group"
                  >
                    <span>Shop New Arrivals</span>
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/60 text-black hover:bg-white/20 rounded-full px-6"
                  >
                    Explore Collection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute bottom-10 right-10 z-20 hidden lg:block">
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-xl border border-white/20 w-36 h-36 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
              <div className="text-white text-xs font-medium mb-1">UP TO</div>
              <div className="text-white text-3xl font-bold">50%</div>
              <div className="text-white text-sm mt-1">DISCOUNT</div>
              <div className="h-px w-12 bg-white/50 my-2"></div>
              <div className="text-white/80 text-xs">Limited time offer</div>
            </div>

            <div className="bg-primary/90 backdrop-blur-lg p-4 rounded-lg shadow-xl w-36 h-36 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
              <div className="text-white text-xs font-medium mb-1">NEW</div>
              <div className="text-white text-xl font-bold">SUMMER</div>
              <div className="text-white text-xl font-bold">COLLECTION</div>
              <div className="h-px w-12 bg-white/50 my-2"></div>
              <Link
                href="/new-arrivals"
                className="text-white text-xs underline"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="text-white/60 text-xs mb-2 animate-bounce">
            Scroll Down
          </div>
          <div className="w-5 h-9 rounded-full border-2 border-white/30 flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-1.5 animate-scroll-down"></div>
          </div>
        </div>
      </div>

      {/* Features bar */}
      <div className="bg-black/90 py-4 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-center md:justify-start gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 8V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V8M5 8H19M5 8L8 4H16L19 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm">
                  Free Shipping
                </div>
                <div className="text-gray-400 text-xs">On orders over $100</div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 14L5 10M5 10L9 6M5 10H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm">
                  Easy Returns
                </div>
                <div className="text-gray-400 text-xs">
                  30 day return policy
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 14V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm">
                  24/7 Support
                </div>
                <div className="text-gray-400 text-xs">Customer service</div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm">
                  Secure Payment
                </div>
                <div className="text-gray-400 text-xs">
                  100% secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
