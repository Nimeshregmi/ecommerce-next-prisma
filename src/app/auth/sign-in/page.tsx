import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import SignInForm from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In | Fashion Fuel",
  description: "Sign in to your Fashion Fuel account",
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { registered?: string }
}) {
  // If the user is already authenticated, redirect to the home page
  const user = await getCurrentUser()
  if (user) {
    redirect("/")
  }
  
  // Access searchParams safely
  const registered = searchParams.registered === "true"

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-50 to-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-xl  bg-white flex flex-col">
        
        
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Welcome Back</h1>
          <p className="text-center mb-6 text-gray-500 text-sm">Sign in to your Fashion Fuel account</p>

          {registered && (
            <div className="mb-6 rounded-md bg-green-50 p-4 border-l-4 border-green-500 text-sm text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Account created successfully. Please sign in.
            </div>
          )}

          <SignInForm />

          <div className="mt-6 text-center">
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary font-medium hover:underline transition">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500 max-w-md">
        <p>By signing in, you agree to our <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link></p>
      </div>
    </div>
  )
}
