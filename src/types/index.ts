import { User, Customer, Administrator } from "@prisma/client";

// Extended User type that includes the role property
export interface ExtendedUser extends User {
  role: string;
  customer?: Customer | null;
  administrator?: Administrator | null;
}

// Authentication payload for JWT tokens
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

// User response for client-side use
export interface UserResponse {
  id: string;
  userId: string;
  customerName?: string | null;
  email?: string | null;
  role: string;
  isAdmin: boolean;
}
