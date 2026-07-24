-- ==========================================================
-- Migration : 0007_rls.sql
-- Purpose   : Enable Row Level Security
-- ==========================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.diagnosis_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- No policies are created because the application uses the
-- Supabase Service Role exclusively through the Next.js BFF.
--
-- RLS remains enabled as a defense-in-depth measure.
--
-- Policies can be introduced in future if direct client access
-- to Supabase is ever required.