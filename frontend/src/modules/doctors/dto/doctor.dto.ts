import { UserRole } from "@/lib/constants";

export interface DoctorDto {
  id: string; // Business ID from user_profiles
  authUserId: string; // Auth ID from Supabase auth
  email: string;
  fullName: string;
  role: UserRole; // Will always be DOCTOR
  createdAt: string;
  updatedAt: string;
}
