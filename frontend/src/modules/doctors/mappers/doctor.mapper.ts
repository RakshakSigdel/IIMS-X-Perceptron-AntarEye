import { DoctorDto } from "../dto/doctor.dto";
import { UserRole } from "@/lib/constants";

export function mapToDoctorDto(row: Record<string, unknown>): DoctorDto {
  return {
    id: row.id as string,
    authUserId: row.auth_user_id as string,
    email: row.email as string,
    fullName: row.full_name as string,
    role: row.role as UserRole,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapToDoctorDtoList(rows: Record<string, unknown>[]): DoctorDto[] {
  return rows.map(mapToDoctorDto);
}
