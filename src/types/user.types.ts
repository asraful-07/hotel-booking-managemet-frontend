import { UserRole } from "@/lib/authUtils";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
