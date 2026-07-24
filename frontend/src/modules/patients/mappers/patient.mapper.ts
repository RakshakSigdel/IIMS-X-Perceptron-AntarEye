import { PatientDto } from "../dto/patient.dto";
import { Gender } from "@/lib/constants";

export function mapToPatientDto(row: Record<string, unknown>): PatientDto {
  return {
    id: row.id as string,
    doctorId: row.doctor_id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    dateOfBirth: row.date_of_birth as string,
    gender: row.gender as Gender,
    phone: row.phone as string | null,
    address: row.address as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapToPatientDtoList(rows: Record<string, unknown>[]): PatientDto[] {
  return rows.map(mapToPatientDto);
}
