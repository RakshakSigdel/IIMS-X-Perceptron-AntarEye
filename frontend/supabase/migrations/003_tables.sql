-- ==========================================================
-- Migration : 0003_tables.sql
-- Purpose   : Create application tables
-- Notes     : Foreign keys, indexes and triggers are created
--             in later migrations.
-- ==========================================================
-- ==========================================================
-- user_profiles
-- ==========================================================
CREATE TABLE
    public.user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        auth_user_id UUID NOT NULL UNIQUE,
        role public.user_role NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

COMMENT ON TABLE public.user_profiles IS 'Application profile for authenticated users.';

-- ==========================================================
-- patients
-- ==========================================================
CREATE TABLE
    public.patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        doctor_id UUID NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        date_of_birth DATE NOT NULL,
        gender public.gender NOT NULL,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

COMMENT ON TABLE public.patients IS 'Patient records.';

-- ==========================================================
-- diagnosis_sessions
-- ==========================================================
CREATE TABLE
    public.diagnosis_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        patient_id UUID NOT NULL,
        doctor_id UUID NOT NULL,
        status public.diagnosis_status NOT NULL DEFAULT 'created',
        original_image_storage_path TEXT NOT NULL,
        heatmap_storage_path TEXT,
        report_storage_path TEXT,
        prediction_summary JSONB NOT NULL,
        ai_response JSONB NOT NULL,
        llm_patient_recommendation TEXT,
        llm_doctor_recommendation TEXT,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

COMMENT ON TABLE public.diagnosis_sessions IS 'Stores one immutable AI diagnosis session.';

-- ==========================================================
-- audit_logs
-- ==========================================================
CREATE TABLE
    public.audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        actor_id UUID NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id UUID NOT NULL,
        action TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

COMMENT ON TABLE public.audit_logs IS 'Business audit log.';