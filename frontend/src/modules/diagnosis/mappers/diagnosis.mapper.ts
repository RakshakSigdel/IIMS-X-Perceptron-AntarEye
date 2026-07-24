import { DiagnosisDto } from "../dto/diagnosis.dto";
import { DiagnosisStatus } from "@/lib/constants";

export function mapToDiagnosisDto(row: Record<string, unknown>): DiagnosisDto {
  return {
    id: row.id as string,
    patientId: row.patient_id as string,
    doctorId: row.doctor_id as string,
    status: row.status as DiagnosisStatus,
    originalImageStoragePath: row.original_image_storage_path as string,
    heatmapStoragePath: row.heatmap_storage_path as string | null,
    reportStoragePath: row.report_storage_path as string | null,
    predictionSummary: row.prediction_summary as Record<string, unknown>,
    aiResponse: row.ai_response as Record<string, unknown>,
    llmPatientRecommendation: row.llm_patient_recommendation as string | null,
    llmDoctorRecommendation: row.llm_doctor_recommendation as string | null,
    startedAt: row.started_at as string,
    completedAt: row.completed_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapToDiagnosisDtoList(rows: Record<string, unknown>[]): DiagnosisDto[] {
  return rows.map(mapToDiagnosisDto);
}
