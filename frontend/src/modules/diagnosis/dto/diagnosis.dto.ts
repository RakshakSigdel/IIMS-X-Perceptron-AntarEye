import { DiagnosisStatus } from "@/lib/constants";

export interface DiagnosisDto {
  id: string;
  patientId: string;
  doctorId: string;
  status: DiagnosisStatus;
  originalImageStoragePath: string;
  originalImageUrl?: string; // Signed URL added by get service
  heatmapStoragePath: string | null;
  heatmapUrl?: string | null; // Signed URL added by get service
  reportStoragePath: string | null;
  predictionSummary: any;
  aiResponse: any;
  llmPatientRecommendation: string | null;
  llmDoctorRecommendation: string | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
