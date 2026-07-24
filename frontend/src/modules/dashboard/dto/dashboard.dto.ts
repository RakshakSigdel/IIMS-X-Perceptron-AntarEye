export interface DoctorDashboardDto {
  totalPatients: number;
  totalDiagnoses: number;
  recentDiagnoses: any[];
  highPriorityPatients: number;
}

export interface AdminDashboardDto {
  totalDoctors: number;
  totalDiagnoses: number;
  recentActivity: any[];
}
