import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import SignUpForm from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up | Fashion Fuel",
  description: "Create a new Fashion Fuel account",
}

export default async function SignUpPage() {
  // If the user is already authenticated, redirect to the home page
  const user = await getCurrentUser()
  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-50 to-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-xl bg-white flex flex-col">
        
        
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Create Account</h1>
          <p className="text-center mb-6 text-gray-500 text-sm">Join Fashion Fuel and discover amazing products</p>
          <SignUpForm />
          <div className="mt-6 text-center">
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-primary font-medium hover:underline transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500 max-w-md">
        <p>By signing up, you agree to our <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link></p>
      </div>
    </div>
  )
}
