import type { Metadata } from "next"
import Link from "next/link"
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
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Sign Up</h1>
        <SignUpForm />
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
