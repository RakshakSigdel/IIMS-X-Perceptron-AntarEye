-- ==========================================================
-- Migration : 0006_triggers.sql
-- Purpose   : Create reusable trigger functions
-- ==========================================================

-- ==========================================================
-- Reusable updated_at trigger function
-- ==========================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ==========================================================
-- user_profiles
-- ==========================================================

CREATE TRIGGER trg_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================================
-- patients
-- ==========================================================

CREATE TRIGGER trg_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================================
-- diagnosis_sessions
-- ==========================================================

CREATE TRIGGER trg_diagnosis_sessions_updated_at
BEFORE UPDATE ON public.diagnosis_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();