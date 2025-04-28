import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NotificationsList from "@/components/notifications/notifications-list"
import { Bell } from "lucide-react"

export const metadata: Metadata = {
  title: "Notifications | Fashion Fuel",
  description: "View your notifications and updates",
}

export default async function NotificationsPage() {
  // Check if user is authenticated
  const user = await getAuthUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get user's notifications
  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50, // Limit to last 50 notifications
  })

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length

  // Serialize Date objects to ISO strings for client component
  const serializedNotifications = notifications.map(notification => ({
    ...notification,
    createdAt: notification.createdAt.toISOString(),
  }))

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated on your recent activity</p>
        </div>

        {unreadCount > 0 && (
          <Button 
            variant="outline"
            className="text-sm"
            formAction={async () => {
              'use server'
              await prisma.notification.updateMany({
                where: { userId: user.id, isRead: false },
                data: { isRead: true }
              })
            }}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-gray-100 p-6 w-24 h-24 flex items-center justify-center">
                <Bell className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                <p className="text-gray-500">
                  You don't have any notifications at the moment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <NotificationsList initialNotifications={serializedNotifications} />
      )}
    </div>
  )
}