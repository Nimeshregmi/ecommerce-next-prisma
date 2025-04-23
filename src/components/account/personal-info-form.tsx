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
import { Loader2, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name cannot exceed 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name cannot exceed 50 characters" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number" })
    .max(15)
    .optional()
    .or(z.literal("")),
})

type PersonalInfoFormValues = z.infer<typeof formSchema>

interface PersonalInfoFormProps {
  user: {
    id?: string
    userId?: string
    customerName?: string
    email?: string
    phone?: string
  }
}

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  // Split the full name into first and last name
  const nameParts = (user.customerName || "").split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""
  
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName,
      lastName,
      phoneNumber: user.phone || "",
    },
  })

  // Reset success indicator after a timeout
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess) {
      timer = setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [isSuccess])

  async function onSubmit(values: PersonalInfoFormValues) {
    try {
      setIsSubmitting(true)
      setIsSuccess(false)
      
      // Combine first and last name
      const fullName = `${values.firstName} ${values.lastName}`.trim()
      
      const response = await fetch("/api/auth/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          phoneNumber: values.phoneNumber || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        toast({
          title: "Profile updated",
          description: "Your personal information has been updated successfully.",
          duration: 3000,
        })
        router.refresh()
      } else {
        toast({
          title: "Update failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDirty = form.formState.isDirty;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">First Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your first name" 
                    {...field} 
                    className="h-11 focus:ring-2 focus:ring-primary/20" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Last Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your last name" 
                    {...field} 
                    className="h-11 focus:ring-2 focus:ring-primary/20" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your phone number" 
                  {...field} 
                  type="tel"
                  className="h-11 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 border-t border-gray-100 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Button 
              type="submit" 
              className="h-11 px-6"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>
                Your email address <span className="font-medium">{user.email}</span> is used for sign-in and cannot be changed.
              </p>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}