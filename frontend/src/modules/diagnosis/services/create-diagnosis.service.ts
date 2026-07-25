import { SupabaseClient } from "@supabase/supabase-js";
import { ExternalServiceError, NotFoundError } from "@/lib/errors";
import { DIAGNOSIS_ERROR_MESSAGES } from "../constants";
import { TABLES, STORAGE_BUCKETS, DiagnosisStatus } from "@/lib/constants";
import { mapToDiagnosisDto } from "../mappers/diagnosis.mapper";
import { DiagnosisDto } from "../dto/diagnosis.dto";
import { predictService } from "@/modules/ai/services/predict.service";
import { calculateTriageLevel } from "@/modules/triage/services/calculate-triage.service";
import { randomUUID } from "crypto";

export async function createDiagnosisService(
  supabase: SupabaseClient,
  patientId: string,
  doctorId: string,
  imageFile: File
): Promise<DiagnosisDto> {
  // 1. Verify patient ownership
  const { data: patient, error: patientError } = await supabase
    .from(TABLES.PATIENTS)
    .select("id")
    .eq("id", patientId)
    .eq("doctor_id", doctorId)
    .single();

  if (patientError || !patient) {
    throw new NotFoundError("Patient not found or unauthorized.");
  }

  // 2. Upload image
  const fileExt = imageFile.name.split(".").pop();
  const filePath = `${patientId}/${randomUUID()}.${fileExt}`;

  console.log(filePath);
  
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.FUNDUS_IMAGES)
    .upload(filePath, imageFile, { contentType: imageFile.type });

    console.log(uploadError);

  if (uploadError) {
    throw new ExternalServiceError(DIAGNOSIS_ERROR_MESSAGES.UPLOAD_FAILED);
  }

  // 3. Create Session (Status: UPLOADED)
  const { data: session, error: createError } = await supabase
    .from(TABLES.DIAGNOSIS_SESSIONS)
    .insert({
      patient_id: patientId,
      doctor_id: doctorId,
      status: DiagnosisStatus.UPLOADED,
      original_image_storage_path: filePath,
      prediction_summary: {},
      ai_response: {},
    })
    .select()
    .single();

  if (createError) {
    throw new ExternalServiceError(DIAGNOSIS_ERROR_MESSAGES.CREATION_FAILED);
  }

  // 4. Update status to PROCESSING
  await supabase
    .from(TABLES.DIAGNOSIS_SESSIONS)
    .update({ status: DiagnosisStatus.PROCESSING })
    .eq("id", session.id);

  try {
    // 5. Call AI Service
    const arrayBuffer = await imageFile.arrayBuffer();
    const aiResponse = await predictService(Buffer.from(arrayBuffer), imageFile.name);

    // 6. Decode heatmap & upload
    const heatmapBuffer = Buffer.from(aiResponse.heatmap, "base64");
    const heatmapPath = `${patientId}/heatmap_${randomUUID()}.png`;
    
    await supabase.storage
      .from(STORAGE_BUCKETS.HEATMAPS)
      .upload(heatmapPath, heatmapBuffer, { contentType: "image/png" });

    // 7. Calculate triage level (You might want to store this on the patient or session)
    // The schema doesn't have a triage_level on diagnosis_sessions yet, 
    // but the summary can hold it.
    const triageLevel = calculateTriageLevel(
      aiResponse.predicted_class, 
      aiResponse.confidence
    );

    // 8. Update Session to COMPLETED
    const predictionSummary = {
      predictedClass: aiResponse.predicted_class,
      confidence: aiResponse.confidence,
      triageLevel,
      probabilities: aiResponse.prediction,
    };

    const { data: finalSession, error: completeError } = await supabase
      .from(TABLES.DIAGNOSIS_SESSIONS)
      .update({
        status: DiagnosisStatus.COMPLETED,
        heatmap_storage_path: heatmapPath,
        prediction_summary: predictionSummary,
        ai_response: aiResponse,
        llm_patient_recommendation: aiResponse.llm_patient_recommendation,
        llm_doctor_recommendation: aiResponse.llm_doctor_recommendation,
        completed_at: new Date().toISOString(),
      })
      .eq("id", session.id)
      .select()
      .single();

    if (completeError) throw completeError;
    return mapToDiagnosisDto(finalSession);

  } catch (error: unknown) {
    // On failure, mark as FAILED
    await supabase
      .from(TABLES.DIAGNOSIS_SESSIONS)
      .update({ status: DiagnosisStatus.FAILED })
      .eq("id", session.id);

    const message = error instanceof Error ? error.message : String(error);
    throw new ExternalServiceError(`${DIAGNOSIS_ERROR_MESSAGES.AI_FAILED}: ${message}`);
  }
}
