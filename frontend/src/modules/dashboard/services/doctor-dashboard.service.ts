import { SupabaseClient } from "@supabase/supabase-js";
import { DoctorDashboardDto } from "../dto/dashboard.dto";
import { TABLES, DiagnosisStatus } from "@/lib/constants";
import { ExternalServiceError } from "@/lib/errors";
import { TriageLevel } from "@/modules/triage/constants";

export async function getDoctorDashboardService(
  supabase: SupabaseClient,
  doctorId: string
): Promise<DoctorDashboardDto> {
  try {
    // 1. Total patients
    const { count: totalPatients } = await supabase
      .from(TABLES.PATIENTS)
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", doctorId);

    // 2. Total diagnoses
    const { count: totalDiagnoses } = await supabase
      .from(TABLES.DIAGNOSIS_SESSIONS)
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", doctorId);

    // 3. Recent diagnoses (last 5)
    const { data: recentDiagnoses } = await supabase
      .from(TABLES.DIAGNOSIS_SESSIONS)
      .select(`
        id, created_at, status, 
        patient:patient_id ( first_name, last_name ),
        prediction_summary
      `)
      .eq("doctor_id", doctorId)
      .order("created_at", { ascending: false })
      .limit(5);

    // 4. High priority patients count (CRITICAL or HIGH triage level in recent diagnoses)
    const { count: highPriorityCount } = await supabase
      .from(TABLES.DIAGNOSIS_SESSIONS)
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", doctorId)
      .eq("status", DiagnosisStatus.COMPLETED)
      .in("prediction_summary->>triageLevel", [TriageLevel.CRITICAL, TriageLevel.HIGH]);

    return {
      totalPatients: totalPatients || 0,
      totalDiagnoses: totalDiagnoses || 0,
      recentDiagnoses: recentDiagnoses || [],
      highPriorityPatients: highPriorityCount || 0,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new ExternalServiceError(`Failed to fetch doctor dashboard: ${message}`);
  }
}
