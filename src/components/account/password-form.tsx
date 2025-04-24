"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

const passwordFormSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must contain uppercase, lowercase, number and special character",
    }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function PasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Calculate password strength when new password changes
  const newPassword = form.watch("newPassword");
  
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check (max 30%)
    strength += Math.min(30, (newPassword.length / 12) * 30);
    
    // Uppercase check (max 20%)
    if (/[A-Z]/.test(newPassword)) strength += 20;
    
    // Lowercase check (max 20%)
    if (/[a-z]/.test(newPassword)) strength += 20;
    
    // Number check (max 15%)
    if (/[0-9]/.test(newPassword)) strength += 15;
    
    // Symbol check (max 15%)
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 15;
    
    setPasswordStrength(strength);
  }, [newPassword]);

  // Reset success state after a timeout
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess) {
      timer = setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [isSuccess])

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 75) return "Moderate";
    return "Strong";
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  }

  async function onSubmit(values: PasswordFormValues) {
    try {
      setIsSubmitting(true)
      setIsSuccess(false)

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully.",
          duration: 5000,
        })
        form.reset()
        router.push("/account")
      } else {
        toast({
          title: "Password change failed",
          description: data.error || "Current password is incorrect or something went wrong.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Password change error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter your current password"
                    type={showCurrentPassword ? "text" : "password"}
                    className="h-11 pr-10 focus:ring-2 focus:ring-primary/20"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2 border-t border-gray-100"></div>

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter your new password"
                    type={showNewPassword ? "text" : "password"}
                    className="h-11 pr-10 focus:ring-2 focus:ring-primary/20"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              {newPassword && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Password strength</span>
                    <span className={cn(
                      "font-medium",
                      passwordStrength < 40 ? "text-red-600" :
                      passwordStrength < 75 ? "text-yellow-600" : 
                      "text-green-600"
                    )}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <Progress 
                      value={passwordStrength} 
                      className={cn("h-full", getStrengthColor())}
                    />
                  </div>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Confirm your new password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="h-11 pr-10 focus:ring-2 focus:ring-primary/20"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 border-t border-gray-100 mt-8">
          <Button 
            type="submit" 
            className="h-11 px-6"
            disabled={isSubmitting || !form.formState.isDirty || passwordStrength < 40}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Password Updated
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Change Password
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}