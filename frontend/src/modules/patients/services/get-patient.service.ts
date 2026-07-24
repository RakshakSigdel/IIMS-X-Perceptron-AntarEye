import { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";
import { mapToPatientDto } from "../mappers/patient.mapper";
import { PatientDto } from "../dto/patient.dto";
import { NotFoundError } from "@/lib/errors";
import { PATIENT_ERROR_MESSAGES } from "../constants";

export async function getPatientService(
  supabase: SupabaseClient,
  patientId: string,
  doctorId: string
): Promise<PatientDto> {
  const { data, error } = await supabase
    .from(TABLES.PATIENTS)
    .select("*")
    .eq("id", patientId)
    .eq("doctor_id", doctorId)
    .single();

  if (error || !data) {
    throw new NotFoundError(PATIENT_ERROR_MESSAGES.NOT_FOUND);
  }

  return mapToPatientDto(data);
}
