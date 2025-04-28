import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, count: 0 },
        { status: 401 }
      );
    }
    
    // Count unread notifications for the user
    const count = await prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      count
    });
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return NextResponse.json(
      { success: false, count: 0 },
      { status: 500 }
    );
  }
}