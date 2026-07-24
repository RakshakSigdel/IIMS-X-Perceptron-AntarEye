import { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";
import { mapToDiagnosisDtoList } from "../mappers/diagnosis.mapper";
import { DiagnosisDto } from "../dto/diagnosis.dto";
import { ExternalServiceError } from "@/lib/errors";

export async function listDiagnosisService(
  supabase: SupabaseClient,
  doctorId: string,
  patientId?: string
): Promise<DiagnosisDto[]> {
  let query = supabase
    .from(TABLES.DIAGNOSIS_SESSIONS)
    .select("*")
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false });

  if (patientId) {
    query = query.eq("patient_id", patientId);
  }

  const { data, error } = await query;

  if (error) {
    throw new ExternalServiceError("Failed to fetch diagnosis sessions");
  }

  return mapToDiagnosisDtoList(data || []);
}
