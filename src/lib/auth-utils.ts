import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

// Secret key for JWT signing and verification
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_jwt_secret_key_change_this_in_production"
);

export type JWTPayload = {
  id: string;
  email: string;
  role: "user" | "admin";
  name: string;
};

// Create a JWT token
export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(JWT_SECRET);
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Get the authenticated user from the request
export async function getAuthUser(
  req?: NextRequest
): Promise<JWTPayload | null> {
  try {
    // Get token from cookies or Authorization header
    let token: string | undefined;

    if (req) {
      // For API routes and middleware
      token = req.cookies.get("auth-token")?.value;

      if (!token) {
        const authHeader = req.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }
      }
    } else {
      // For server components
      const cookieStore = await cookies();
      token = cookieStore.get("auth-token")?.value;
    }

    if (!token) {
      console.log("No auth-token cookie found");
      return null;
    }

    return await verifyToken(token);
  } catch (error) {
    console.error("Get auth user error:", error);
    return null;
  }
}

// Set auth token in cookies (for both response objects and server actions)
export async function setAuthCookie(responseOrToken: NextResponse | string, tokenParam?: string) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "strict" as const,
  };

  // Case 1: Called from an API route with response object and token
  if (typeof responseOrToken !== "string" && tokenParam) {
    responseOrToken.cookies.set("auth-token", tokenParam, cookieOptions);
    return;
  }
  
  // Case 2: Called from server action with just the token
  if (typeof responseOrToken === "string") {
    const token = responseOrToken;
    const cookiees=await cookies();
    cookiees.set("auth-token", token, cookieOptions);
    return;
  }
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
