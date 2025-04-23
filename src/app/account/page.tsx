import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, History, Map, Settings, LogOut, ShoppingBag, Heart, CreditCard, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "My Account | Fashion Fuel",
  description: "Manage your Fashion Fuel account",
}

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get first letter of first and last name for avatar
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Header section */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        </div>
      </div>
      
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/20 to-purple-100 p-6 text-center">
                <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-sm">
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {getInitials(user.customerName || "User")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">{user.customerName}</h2>
                <p className="text-gray-600 text-sm mt-1">{user.email}</p>
                
                {user.role === 'admin' && (
                  <Badge className="mt-3 bg-primary/10 text-primary border-primary/20">
                    Administrator
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-0">
                <nav className="divide-y">
                  <Link href="/order-history" className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <History className="mr-3 h-5 w-5 text-primary" />
                    <span>Order History</span>
                  </Link>
                  <Link href="/account/addresses" className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <Map className="mr-3 h-5 w-5 text-primary" />
                    <span>Saved Addresses</span>
                  </Link>
                  <Link href="/account/settings" className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <Settings className="mr-3 h-5 w-5 text-primary" />
                    <span>Account Settings</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                      <CreditCard className="mr-3 h-5 w-5 text-primary" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <Link href="/auth/sign-out" className="flex items-center p-4 text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Sign Out</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            {/* Recent activity section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <Badge variant="outline" className="font-normal">Last 30 days</Badge>
                </div>
                
                <div className="space-y-6">
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                    <div className="border rounded-xl p-4 bg-gray-50/50">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                          <ShoppingBag className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Orders</h3>
                          <p className="text-3xl font-bold mt-1">0</p>
                        </div>
                      </div>
                      <Button variant="link" asChild className="mt-2 h-auto p-0">
                        <Link href="/order-history">View order history</Link>
                      </Button>
                    </div>
                    
                    <div className="border rounded-xl p-4 bg-gray-50/50">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                          <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Wishlist</h3>
                          <p className="text-3xl font-bold mt-1">0</p>
                        </div>
                      </div>
                      <Button variant="link" asChild className="mt-2 h-auto p-0">
                        <Link href="#">View saved items</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Personal information card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/account/settings">Edit</Link>
                  </Button>
                </div>
                
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Full name</dt>
                    <dd className="mt-1 text-gray-900">{user.customerName}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm text-gray-500">Email address</dt>
                    <dd className="mt-1 text-gray-900">{user.email}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm text-gray-500">Phone number</dt>
                    <dd className="mt-1 text-gray-500">Not provided</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm text-gray-500">Date joined</dt>
                    <dd className="mt-1 text-gray-900">{new Date().toLocaleDateString()}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            {/* Recommendations section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recommended for You</h2>
                  <Button variant="link" asChild className="h-auto p-0">
                    <Link href="/products">View all</Link>
                  </Button>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                  <p>We're personalizing recommendations for you.</p>
                  <p className="text-sm">Come back soon to see your personalized suggestions.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
