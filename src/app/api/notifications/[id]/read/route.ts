import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Get notification ID from URL params
    const notificationId = params.id;
    
    // Check if the notification exists and belongs to the user
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
        userId: user.id,
      },
    });
    
    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }
    
    // Update the notification to mark as read
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
    
    // Revalidate the notifications page to reflect changes
    revalidatePath('/notifications');
    
    return NextResponse.json({ 
      success: true, 
      message: "Notification marked as read" 
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notification" },
      { status: 500 }
    );
  }
}