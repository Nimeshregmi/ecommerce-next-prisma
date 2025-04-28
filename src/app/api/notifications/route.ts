import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Get the fromDate parameter from the URL or use last 7 days as default
    const url = new URL(request.url);
    const fromDateParam = url.searchParams.get('fromDate');
    
    const fromDate = fromDateParam 
      ? new Date(fromDateParam) 
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Default to 7 days
    
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: fromDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      data: notifications 
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}