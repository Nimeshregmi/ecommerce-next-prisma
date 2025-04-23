import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function PUT(request: NextRequest) {
  try {
    // Get the authenticated user
    const authUser = await getAuthUser();
    
    if (!authUser || !authUser.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { firstName, lastName, phoneNumber } = body;
    
    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // Get the customer associated with this user
    const userWithCustomer = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { customer: true }
    });

    if (!userWithCustomer || !userWithCustomer.customer) {
      return NextResponse.json(
        { success: false, error: "Customer profile not found" },
        { status: 404 }
      );
    }
    
    // Update the customer name in the database
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: userWithCustomer.customer.id,
      },
      data: {
        customerName: `${firstName} ${lastName}`,
      },
    });
    
    // Update the user phone number if provided
    const updatedUser = await prisma.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        phone: phoneNumber || null,
      },
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedCustomer.customerName,
        email: updatedCustomer.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user information" },
      { status: 500 }
    );
  }
}