import { SupabaseClient } from "@supabase/supabase-js";
import { ExternalServiceError, NotFoundError } from "@/lib/errors";
import { DOCTOR_ERROR_MESSAGES } from "../constants";
import { TABLES, UserRole } from "@/lib/constants";

// Requires service client to disable user in Auth
export async function disableDoctorService(
  serviceClient: SupabaseClient,
  doctorId: string,
  adminUserId: string
): Promise<void> {
  // First get the doctor to find auth_user_id
  const { data: profile, error: fetchError } = await serviceClient
    .from(TABLES.USER_PROFILES)
    .select("id, auth_user_id")
    .eq("id", doctorId)
    .eq("role", UserRole.DOCTOR)
    .single();

  if (fetchError || !profile) {
    throw new NotFoundError(DOCTOR_ERROR_MESSAGES.NOT_FOUND);
  }

  // Disable user in auth by suspending them
  // We don't delete them to preserve data integrity (foreign keys)
  const { error: banError } = await serviceClient.auth.admin.updateUserById(
    profile.auth_user_id,
    { ban_duration: "876000h" } // ~100 years
  );

  if (banError) {
    throw new ExternalServiceError(DOCTOR_ERROR_MESSAGES.DISABLE_FAILED);
  }

  // Audit
  await serviceClient.from(TABLES.AUDIT_LOGS).insert({
    actor_id: adminUserId,
    entity_type: "user_profile",
    entity_id: profile.id,
    action: "disable"
  });
}
