import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePatientRequestDto } from "../schemas/patient.schema";
import { ExternalServiceError } from "@/lib/errors";
import { PATIENT_ERROR_MESSAGES } from "../constants";
import { TABLES } from "@/lib/constants";
import { mapToPatientDto } from "../mappers/patient.mapper";
import { PatientDto } from "../dto/patient.dto";

export async function createPatientService(
  supabase: SupabaseClient,
  dto: CreatePatientRequestDto,
  doctorId: string
): Promise<PatientDto> {
  const { data, error } = await supabase
    .from(TABLES.PATIENTS)
    .insert({
      doctor_id: doctorId, // Link to the user_profiles.id of the authenticated doctor
      first_name: dto.firstName,
      last_name: dto.lastName,
      date_of_birth: dto.dateOfBirth,
      gender: dto.gender,
      phone: dto.phone,
      address: dto.address,
    })
    .select()
    .single();

  if (error) {
    throw new ExternalServiceError(PATIENT_ERROR_MESSAGES.CREATION_FAILED);
  }

  return mapToPatientDto(data);
}
