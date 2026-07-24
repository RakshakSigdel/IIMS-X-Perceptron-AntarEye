export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  ADMIN: {
    DOCTORS: "/api/admin/doctors",
    DOCTOR: (id: string) => `/api/admin/doctors/${id}`,
  },
  DOCTOR: {
    PATIENTS: "/api/patients",
    PATIENT: (id: string) => `/api/patients/${id}`,
    DIAGNOSIS: "/api/diagnosis",
    DIAGNOSIS_DETAIL: (id: string) => `/api/diagnosis/${id}`,
    DIAGNOSIS_REPORT: (id: string) => `/api/diagnosis/${id}/report`,
  },
  DASHBOARD: "/api/dashboard",
} as const;

export const PAGE_ROUTES = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
  },
  ADMIN: {
    DASHBOARD: "/admin",
    DOCTORS: "/admin/doctors",
    NEW_DOCTOR: "/admin/doctors/new",
    EDIT_DOCTOR: (id: string) => `/admin/doctors/${id}/edit`,
  },
  DOCTOR: {
    DASHBOARD: "/doctor",
    PATIENTS: "/doctor/patients",
    NEW_PATIENT: "/doctor/patients/new",
    PATIENT_DETAIL: (id: string) => `/doctor/patients/${id}`,
    EDIT_PATIENT: (id: string) => `/doctor/patients/${id}/edit`,
    DIAGNOSIS: (id: string) => `/doctor/diagnosis/${id}`,
    PROFILE: "/doctor/profile",
  }
} as const;
