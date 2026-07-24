import { UserRole } from "@/lib/constants";

export interface UserSessionDto {
  id: string; // The user_profiles.id (business ID)
  authUserId: string; // The auth.users.id (Supabase auth ID)
  email: string;
  fullName: string;
  role: UserRole;
}
