import { SupabaseClient } from "@supabase/supabase-js";
import { ExternalServiceError, NotFoundError } from "@/lib/errors";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { getDiagnosisService } from "@/modules/diagnosis";

export async function downloadReportService(
  supabase: SupabaseClient,
  diagnosisId: string,
  doctorId: string
): Promise<{ reportUrl: string }> {
  // 1. Get diagnosis to find report path
  const diagnosis = await getDiagnosisService(supabase, diagnosisId, doctorId);
  
  if (!diagnosis.reportStoragePath) {
    throw new NotFoundError("Report has not been generated yet.");
  }

  // 2. Generate signed URL
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.REPORTS)
    .createSignedUrl(diagnosis.reportStoragePath, 3600); // 1 hour expiry

  if (error || !data?.signedUrl) {
    throw new ExternalServiceError("Failed to generate download URL");
  }

  return { reportUrl: data.signedUrl };
}
