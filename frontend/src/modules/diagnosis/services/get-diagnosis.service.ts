import { SupabaseClient } from "@supabase/supabase-js";
import { TABLES, STORAGE_BUCKETS } from "@/lib/constants";
import { mapToDiagnosisDto } from "../mappers/diagnosis.mapper";
import { DiagnosisDto } from "../dto/diagnosis.dto";
import { NotFoundError } from "@/lib/errors";
import { DIAGNOSIS_ERROR_MESSAGES } from "../constants";

export async function getDiagnosisService(
  supabase: SupabaseClient,
  diagnosisId: string,
  doctorId: string
): Promise<DiagnosisDto> {
  const { data, error } = await supabase
    .from(TABLES.DIAGNOSIS_SESSIONS)
    .select("*")
    .eq("id", diagnosisId)
    .eq("doctor_id", doctorId)
    .single();

  if (error || !data) {
    throw new NotFoundError(DIAGNOSIS_ERROR_MESSAGES.NOT_FOUND);
  }

  const dto = mapToDiagnosisDto(data);

  // Generate signed URLs for images (valid for 1 hour)
  if (dto.originalImageStoragePath) {
    const { data: originalData } = await supabase.storage
      .from(STORAGE_BUCKETS.FUNDUS_IMAGES)
      .createSignedUrl(dto.originalImageStoragePath, 3600);
    dto.originalImageUrl = originalData?.signedUrl;
  }

  if (dto.heatmapStoragePath) {
    const { data: heatmapData } = await supabase.storage
      .from(STORAGE_BUCKETS.HEATMAPS)
      .createSignedUrl(dto.heatmapStoragePath, 3600);
    dto.heatmapUrl = heatmapData?.signedUrl;
  }

  return dto;
}
