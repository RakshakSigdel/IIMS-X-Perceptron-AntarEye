import { DiagnosisDto } from "../dto/diagnosis.dto";
import { DiagnosisStatus } from "@/lib/constants";

export function mapToDiagnosisDto(row: any): DiagnosisDto {
  return {
    id: row.id,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    status: row.status as DiagnosisStatus,
    originalImageStoragePath: row.original_image_storage_path,
    heatmapStoragePath: row.heatmap_storage_path,
    reportStoragePath: row.report_storage_path,
    predictionSummary: row.prediction_summary,
    aiResponse: row.ai_response,
    llmPatientRecommendation: row.llm_patient_recommendation,
    llmDoctorRecommendation: row.llm_doctor_recommendation,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapToDiagnosisDtoList(rows: any[]): DiagnosisDto[] {
  return rows.map(mapToDiagnosisDto);
}
