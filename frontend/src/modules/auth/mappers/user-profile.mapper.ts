import { UserSessionDto } from "../dto/user-session.dto";
import { UserRole } from "@/lib/constants";

export function mapToUserSession(row: Record<string, unknown>): UserSessionDto {
  return {
    id: row.id as string,
    authUserId: row.auth_user_id as string,
    email: row.email as string,
    fullName: row.full_name as string,
    role: row.role as UserRole,
  };
}
