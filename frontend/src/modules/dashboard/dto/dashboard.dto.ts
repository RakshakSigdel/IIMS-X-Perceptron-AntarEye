export interface RecentDiagnosisItem {
  id: string;
  created_at: string;
  status: string;
  patient: { first_name: string; last_name: string }[] | null;
  prediction_summary: Record<string, unknown>;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  actor: { email: string }[] | null;
}

export interface DoctorDashboardDto {
  totalPatients: number;
  totalDiagnoses: number;
  recentDiagnoses: RecentDiagnosisItem[];
  highPriorityPatients: number;
}

export interface AdminDashboardDto {
  totalDoctors: number;
  totalDiagnoses: number;
  recentActivity: RecentActivityItem[];
}
