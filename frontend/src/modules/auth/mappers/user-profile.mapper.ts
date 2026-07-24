import { UserSessionDto } from "../dto/user-session.dto";
import { UserRole } from "@/lib/constants";

export function mapToUserSession(row: any): UserSessionDto {
  return {
    id: row.id,
    authUserId: row.auth_user_id,
    email: row.email,
    fullName: row.full_name,
    role: row.role as UserRole,
  };
}
