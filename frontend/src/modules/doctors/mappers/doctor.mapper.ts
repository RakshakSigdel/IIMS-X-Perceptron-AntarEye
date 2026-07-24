import { DoctorDto } from "../dto/doctor.dto";
import { UserRole } from "@/lib/constants";

export function mapToDoctorDto(row: any): DoctorDto {
  return {
    id: row.id,
    authUserId: row.auth_user_id,
    email: row.email,
    fullName: row.full_name,
    role: row.role as UserRole,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapToDoctorDtoList(rows: any[]): DoctorDto[] {
  return rows.map(mapToDoctorDto);
}
