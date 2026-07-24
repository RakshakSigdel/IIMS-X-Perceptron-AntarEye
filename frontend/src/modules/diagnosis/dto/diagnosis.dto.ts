import { DiagnosisStatus } from "@/lib/constants";
import { AiResponseDto } from "@/modules/ai/schemas/ai-response.schema";
import { TriageLevel } from "@/modules/triage/constants";

export interface PredictionSummary {
  predictedClass: string;
  confidence: number;
  triageLevel: TriageLevel;
  probabilities: Record<string, number>;
}

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
  predictionSummary: PredictionSummary | Record<string, unknown>;
  aiResponse: AiResponseDto | Record<string, unknown>;
  llmPatientRecommendation: string | null;
  llmDoctorRecommendation: string | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
