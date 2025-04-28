'use client'
import React, { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: string;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const response = await fetch('/api/notifications');
        const result = await response.json();
        
        if (result.success) {
          setNotifications(result.data || []);
        } else {
          // If the user isn't authenticated, we don't show an error
          if (response.status !== 401) {
            setError("Failed to load notifications");
          }
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
    
    // Set up polling for new notifications every 2 minutes
    const intervalId = setInterval(fetchNotifications, 120000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Don't render anything if there are no notifications to show
  if (!loading && notifications.length === 0) {
    return null;
  }

  return (
    <div className="notifications-container">
      {loading ? (
        <p className="text-sm text-muted">Loading notifications...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className="p-2 border rounded-md">
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <span className="text-xs text-muted">{new Date(notification.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}