-- ==========================================================
-- Migration : 0005_indexes.sql
-- Purpose   : Create database indexes
-- ==========================================================
-- Patients
CREATE INDEX idx_patients_doctor ON public.patients (doctor_id);

-- Diagnosis Sessions
CREATE INDEX idx_diagnosis_patient ON public.diagnosis_sessions (patient_id);

CREATE INDEX idx_diagnosis_doctor ON public.diagnosis_sessions (doctor_id);

CREATE INDEX idx_diagnosis_status ON public.diagnosis_sessions (status);

CREATE INDEX idx_diagnosis_created_at ON public.diagnosis_sessions (created_at DESC);

-- Audit Logs
CREATE INDEX idx_audit_actor ON public.audit_logs (actor_id);

CREATE INDEX idx_audit_created_at ON public.audit_logs (created_at DESC);