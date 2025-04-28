"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"

export default function NotificationIndicator() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUnreadNotifications() {
      try {
        setLoading(true)
        const response = await fetch('/api/notifications/unread/count')
        const result = await response.json()
        
        if (result.success) {
          setUnreadCount(result.count || 0)
        } else {
          setUnreadCount(0)
        }
      } catch (err) {
        console.error("Error fetching unread notifications count:", err)
        setUnreadCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchUnreadNotifications()
    
    // Poll for new notifications every minute
    const intervalId = setInterval(fetchUnreadNotifications, 60000)
    
    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <div className="p-2 rounded-full hover:bg-primary/10 text-gray-700 transition-colors">
        <Bell className="h-[18px] w-[18px]" />
      </div>
    )
  }

  return (
    <Link
      href="/notifications"
      className="relative p-2 rounded-full hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors"
      aria-label="Notifications"
    >
      <Bell className="h-[18px] w-[18px]" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 text-xs font-medium text-white shadow-sm">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}