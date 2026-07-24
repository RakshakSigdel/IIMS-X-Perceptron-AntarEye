-- ==========================================================
-- Migration : 0002_enums.sql
-- Purpose   : Create application enums
-- ==========================================================
CREATE TYPE public.user_role AS ENUM ('admin', 'doctor');

CREATE TYPE public.gender AS ENUM ('male', 'female', 'other');

CREATE TYPE public.diagnosis_status AS ENUM (
    'created',
    'uploaded',
    'processing',
    'completed',
    'failed'
);