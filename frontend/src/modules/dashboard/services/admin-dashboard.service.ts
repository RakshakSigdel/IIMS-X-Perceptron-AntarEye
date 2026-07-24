import { SupabaseClient } from "@supabase/supabase-js";
import { AdminDashboardDto } from "../dto/dashboard.dto";
import { TABLES, UserRole } from "@/lib/constants";
import { ExternalServiceError } from "@/lib/errors";

export async function getAdminDashboardService(
  supabase: SupabaseClient
): Promise<AdminDashboardDto> {
  try {
    // 1. Total doctors
    const { count: totalDoctors } = await supabase
      .from(TABLES.USER_PROFILES)
      .select("*", { count: "exact", head: true })
      .eq("role", UserRole.DOCTOR);

    // 2. Total diagnoses across all doctors
    const { count: totalDiagnoses } = await supabase
      .from(TABLES.DIAGNOSIS_SESSIONS)
      .select("*", { count: "exact", head: true });

    // 3. Recent audit activity
    const { data: recentActivity } = await supabase
      .from(TABLES.AUDIT_LOGS)
      .select(`
        id, action, entity_type, created_at,
        actor:actor_id ( email )
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      totalDoctors: totalDoctors || 0,
      totalDiagnoses: totalDiagnoses || 0,
      recentActivity: recentActivity || [],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new ExternalServiceError(`Failed to fetch admin dashboard: ${message}`);
  }
}
