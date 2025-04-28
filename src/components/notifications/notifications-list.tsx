"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Bell, Check, ShoppingBag, AlertTriangle, Mail, Heart, Info, Gift, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

type Notification = {
  id: string
  title: string
  message: string
  createdAt: string
  type: string
  isRead: boolean
  referenceId?: string | null
}

export default function NotificationsList({
  initialNotifications,
}: {
  initialNotifications: Notification[]
}) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const router = useRouter()
  const { toast } = useToast()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5" />
      case "alert":
        return <AlertTriangle className="h-5 w-5" />
      case "message":
        return <Mail className="h-5 w-5" />
      case "wishlist":
        return <Heart className="h-5 w-5" />
      case "promo":
        return <Tag className="h-5 w-5" />
      case "discount":
        return <Gift className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getIconBackgroundClass = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-600"
      case "alert":
        return "bg-amber-100 text-amber-600"
      case "message":
        return "bg-indigo-100 text-indigo-600"
      case "wishlist":
        return "bg-pink-100 text-pink-600"
      case "promo":
        return "bg-green-100 text-green-600"
      case "discount":
        return "bg-purple-100 text-purple-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
      })

      if (response.ok) {
        // Update local state
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        )
        router.refresh()
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to update notification status",
        variant: "destructive",
      })
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id)
    }

    // Navigate to specific page based on type and referenceId
    if (notification.type === "order" && notification.referenceId) {
      router.push(`/order-confirmation/${notification.referenceId}`)
    } else if (notification.type === "wishlist") {
      router.push("/wishlist")
    } else if (notification.type === "promo" || notification.type === "discount") {
      router.push("/products")
    }
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer ${
            !notification.isRead ? "border-l-4 border-primary" : ""
          }`}
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-2 ${getIconBackgroundClass(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {notification.title}
                    {!notification.isRead && (
                      <Badge className="ml-2 bg-primary text-white" variant="secondary">
                        New
                      </Badge>
                    )}
                  </h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                </div>
                
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMarkAsRead(notification.id)
                    }}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}