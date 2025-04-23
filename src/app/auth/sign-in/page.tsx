import type { Metadata } from "next"
import Link from "next/link"
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
  console.log("user", user)
  if (user) {
    redirect("/")
  }
  const searchparam=await searchParams;
  // Access searchParams safely"
  const registered = searchparam.registered === "true"

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Sign in</h1>

        {registered && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
            Account created successfully. Please sign in.
          </div>
        )}

        <SignInForm />
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/auth/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
