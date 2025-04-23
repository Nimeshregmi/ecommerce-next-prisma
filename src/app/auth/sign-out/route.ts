import { redirect } from "next/navigation"
import { signOutAction } from "@/lib/auth-actions"

export async function GET() {
  await signOutAction()
}
