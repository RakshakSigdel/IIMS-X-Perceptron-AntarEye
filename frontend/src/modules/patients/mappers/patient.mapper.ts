import { PatientDto } from "../dto/patient.dto";
import { Gender } from "@/lib/constants";

export function mapToPatientDto(row: any): PatientDto {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender as Gender,
    phone: row.phone,
    address: row.address,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapToPatientDtoList(rows: any[]): PatientDto[] {
  return rows.map(mapToPatientDto);
}
