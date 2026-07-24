import { SupabaseClient } from "@supabase/supabase-js";
import { ExternalServiceError } from "@/lib/errors";

export async function logoutService(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new ExternalServiceError("Failed to sign out");
  }

  return { success: true };
}
