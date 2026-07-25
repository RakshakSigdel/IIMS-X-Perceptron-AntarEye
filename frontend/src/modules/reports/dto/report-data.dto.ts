import { TriageLevel } from "@/modules/triage/constants";

export interface ReportDataDto {
  reportId: string;
  generatedAt: string;
  clinicName: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    phone: string | null;
    photoBase64?: string | null; // Placeholder if null
  };
  doctor: {
    fullName: string;
    email: string;
    photoBase64?: string | null; // Placeholder if null
  };
  diagnosis: {
    predictedClass: string;
    confidence: number;
    triageLevel: TriageLevel;
    probabilities: Record<string, number>;
  };
  recommendations: {
    doctor: string | null;
    patient: string | null;
  };
  images: {
    originalBase64?: string | null;
    heatmapBase64?: string | null;
  };
}
