-- ==========================================================
-- Migration : 0004_constraints.sql
-- Purpose   : Create foreign keys and table constraints
-- ==========================================================
-- ==========================================================
-- user_profiles
-- ==========================================================
ALTER TABLE public.user_profiles ADD CONSTRAINT fk_user_profiles_auth_user FOREIGN KEY (auth_user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

-- ==========================================================
-- patients
-- ==========================================================
ALTER TABLE public.patients ADD CONSTRAINT fk_patients_doctor FOREIGN KEY (doctor_id) REFERENCES public.user_profiles (id) ON DELETE RESTRICT;

-- ==========================================================
-- diagnosis_sessions
-- ==========================================================
ALTER TABLE public.diagnosis_sessions ADD CONSTRAINT fk_diagnosis_patient FOREIGN KEY (patient_id) REFERENCES public.patients (id) ON DELETE RESTRICT;

ALTER TABLE public.diagnosis_sessions ADD CONSTRAINT fk_diagnosis_doctor FOREIGN KEY (doctor_id) REFERENCES public.user_profiles (id) ON DELETE RESTRICT;

-- ==========================================================
-- audit_logs
-- ==========================================================
ALTER TABLE public.audit_logs ADD CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES public.user_profiles (id) ON DELETE SET NULL;

-- ==========================================================
-- Check Constraints
-- ==========================================================
ALTER TABLE public.user_profiles ADD CONSTRAINT chk_full_name_not_empty CHECK (btrim (full_name) <> '');

ALTER TABLE public.patients ADD CONSTRAINT chk_patient_first_name_not_empty CHECK (btrim (first_name) <> '');

ALTER TABLE public.patients ADD CONSTRAINT chk_patient_last_name_not_empty CHECK (btrim (last_name) <> '');

ALTER TABLE public.patients ADD CONSTRAINT chk_phone_length CHECK (
    phone IS NULL
    OR length (phone) <= 20
);

ALTER TABLE public.diagnosis_sessions ADD CONSTRAINT chk_completed_after_started CHECK (
    completed_at IS NULL
    OR completed_at >= started_at
);