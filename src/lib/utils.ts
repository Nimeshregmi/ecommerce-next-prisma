import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function generateOrderId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export function getInitials(name: string): string {
  if (!name) return ""
  const parts = name.split(" ")
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

import { prisma } from "@/lib/prisma";

// Create a notification
export async function createNotification(userId: string, title: string, message: string, type: string, referenceId?: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        referenceId,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

// Fetch notifications for a user
export async function getNotifications(userId: string, fromDate: Date) {
  try {
    return await prisma.notification.findMany({
      where: {
        userId,
        createdAt: {
          gte: fromDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}
