-- ==========================================================
-- Migration : 0001_extensions.sql
-- Purpose   : Enable required PostgreSQL extensions
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE EXTENSION IF NOT EXISTS citext;