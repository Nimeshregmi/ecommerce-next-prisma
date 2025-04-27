"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2, Check, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type CartButtonProps = {
  productId: string;
  price: number;
  name: string;
  image: string;
}

export default function CartButtonClient({ productId, price, name, image }: CartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  // Add sound effect reference
  const addToCartSound = useRef<HTMLAudioElement | null>(null)
  
  // Initialize audio on component mount
  useEffect(() => {
    addToCartSound.current = new Audio("/sounds/cart-add.mp3")
    // Preload the audio
    addToCartSound.current.preload = "auto"
    
    return () => {
      if (addToCartSound.current) {
        addToCartSound.current.pause()
        addToCartSound.current = null
      }
    }
  }, [])
  
  const addToCart = async () => {
    setIsAdding(true)
    
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 1,
        }),
      })
      
      if (response.ok) {
        // Play sound effect
        if (addToCartSound.current) {
          addToCartSound.current.currentTime = 0
          addToCartSound.current.play().catch(e => console.log("Audio play failed:", e))
        }
        
        setSuccess(true)
        toast({
          title: "✨ Added to cart",
          description: `${name} has been added to your cart`,
          className: "bg-black text-white border-gray-800",
        })
        router.refresh()
        
        // Add a slight delay before redirecting for better UX
        setTimeout(() => {
          router.push("/cart")
        }, 1000)
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsAdding(false)
      }, 300)
    }
  }
  
  return (
    <Button 
      onClick={addToCart} 
      disabled={isAdding || success} 
      className={`
        w-full text-white transition-all duration-500 rounded-xl py-6 relative overflow-hidden group
        ${success 
          ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-200/40' 
          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-300/30 hover:shadow-purple-300/50'
        }
      `}
    >
      {isAdding ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span className="animate-pulse">Adding to Cart...</span>
        </div>
      ) : success ? (
        <div className="flex items-center justify-center">
          <div className="relative">
            <span className="absolute -inset-1 rounded-full animate-ping bg-white/40 opacity-75"></span>
            <Check className="h-5 w-5 mr-2 relative" />
          </div>
          <span className="font-medium">Added to Cart</span>
          <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 mr-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-10deg]" />
            <span className="relative font-medium">
              <span className="group-hover:opacity-0 transition-opacity duration-300">Add to Cart</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">Shop Now</span>
            </span>
          </div>
          <span className="absolute bottom-0 left-0 h-1 bg-white/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-white/10 to-indigo-400/0 opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </>
      )}
    </Button>
  )
}