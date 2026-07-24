import { SupabaseClient } from "@supabase/supabase-js";
import { UpdatePatientRequestDto } from "../schemas/patient.schema";
import { NotFoundError, ExternalServiceError } from "@/lib/errors";
import { PATIENT_ERROR_MESSAGES } from "../constants";
import { TABLES } from "@/lib/constants";
import { mapToPatientDto } from "../mappers/patient.mapper";
import { PatientDto } from "../dto/patient.dto";

export async function updatePatientService(
  supabase: SupabaseClient,
  patientId: string,
  dto: UpdatePatientRequestDto,
  doctorId: string
): Promise<PatientDto> {
  // Ensure the patient belongs to the doctor and update
  const updateData: any = { updated_at: new Date().toISOString() };
  if (dto.firstName !== undefined) updateData.first_name = dto.firstName;
  if (dto.lastName !== undefined) updateData.last_name = dto.lastName;
  if (dto.dateOfBirth !== undefined) updateData.date_of_birth = dto.dateOfBirth;
  if (dto.gender !== undefined) updateData.gender = dto.gender;
  if (dto.phone !== undefined) updateData.phone = dto.phone;
  if (dto.address !== undefined) updateData.address = dto.address;

  const { data, error } = await supabase
    .from(TABLES.PATIENTS)
    .update(updateData)
    .eq("id", patientId)
    .eq("doctor_id", doctorId)
    .select()
    .single();

  if (error) {
    throw new ExternalServiceError(PATIENT_ERROR_MESSAGES.UPDATE_FAILED);
  }
  
  if (!data) {
    throw new NotFoundError(PATIENT_ERROR_MESSAGES.NOT_FOUND);
  }

  return mapToPatientDto(data);
}
