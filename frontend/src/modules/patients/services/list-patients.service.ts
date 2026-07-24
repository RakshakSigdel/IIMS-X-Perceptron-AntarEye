import { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";
import { mapToPatientDtoList } from "../mappers/patient.mapper";
import { PatientDto } from "../dto/patient.dto";
import { ExternalServiceError } from "@/lib/errors";

export async function listPatientsService(
  supabase: SupabaseClient,
  doctorId: string
): Promise<PatientDto[]> {
  const { data, error } = await supabase
    .from(TABLES.PATIENTS)
    .select("*")
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new ExternalServiceError("Failed to fetch patients");
  }

  return mapToPatientDtoList(data || []);
}
