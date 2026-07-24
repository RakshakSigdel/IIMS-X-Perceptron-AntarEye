# Database Specification

## Purpose

Defines the PostgreSQL schema, constraints, indexes, RLS policies, storage buckets, and migration strategy.

---

# Naming Conventions

- snake_case for tables and columns.
- UUID primary keys.
- `created_at` and `updated_at` on every business table.
- Foreign keys end with `_id`.

---

# PostgreSQL Extensions

- pgcrypto

---

# Enums

## user_role

- admin
- doctor

---

## diagnosis_status

- created
- uploaded
- processing
- completed
- failed

---

## gender

- male
- female
- other

---

# Tables

## doctor_profiles

| Column | Type | Notes |
|---------|------|------|
| id | uuid | PK |
| auth_user_id | uuid | FK → auth.users.id |
| full_name | text | |
| email | text | Unique |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## patients

| Column | Type | Notes |
|---------|------|------|
| id | uuid | PK |
| doctor_id | uuid | FK |
| first_name | text | |
| last_name | text | |
| date_of_birth | date | |
| gender | gender | |
| phone | text | Nullable |
| address | text | Nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## diagnosis_sessions

| Column | Type | Notes |
|---------|------|------|
| id | uuid | PK |
| patient_id | uuid | FK |
| doctor_id | uuid | FK |
| status | diagnosis_status | |
| original_image_storage_path | text | |
| heatmap_storage_path | text | Nullable |
| report_storage_path | text | Nullable |
| prediction_summary | jsonb | |
| ai_response | jsonb | |
| llm_patient_recommendation | text | Nullable |
| llm_doctor_recommendation | text | Nullable |
| started_at | timestamptz | |
| completed_at | timestamptz | Nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## diagnosis_status_history

| Column | Type | Notes |
|---------|------|------|
| id | uuid | PK |
| diagnosis_session_id | uuid | FK |
| status | diagnosis_status | |
| created_at | timestamptz | |

---

## audit_logs

| Column | Type | Notes |
|---------|------|------|
| id | uuid | PK |
| actor_id | uuid | FK |
| entity_type | text | |
| entity_id | uuid | |
| action | text | |
| metadata | jsonb | Nullable |
| created_at | timestamptz | |

---

# Foreign Keys

- doctor_profiles.auth_user_id → auth.users.id
- patients.doctor_id → doctor_profiles.id
- diagnosis_sessions.patient_id → patients.id
- diagnosis_sessions.doctor_id → doctor_profiles.id
- diagnosis_status_history.diagnosis_session_id → diagnosis_sessions.id
- audit_logs.actor_id → doctor_profiles.id

---

# Indexes

- patients(doctor_id)
- diagnosis_sessions(patient_id)
- diagnosis_sessions(doctor_id)
- diagnosis_sessions(status)
- diagnosis_status_history(diagnosis_session_id)
- audit_logs(actor_id)
- audit_logs(created_at)

---

# Row Level Security

## doctor_profiles

Doctors can read and update only their own profile.

Admins have full access.

---

## patients

Doctors can access only their own patients.

Admins have read-only access.

---

## diagnosis_sessions

Doctors can access only diagnoses they created.

Admins have read-only access.

---

## audit_logs

Admins only.

---

# Storage Buckets

## fundus-images

Private bucket.

---

## heatmaps

Private bucket.

---

## reports

Private bucket.

---

# Migration Strategy

- All schema changes use SQL migrations.
- Never modify previous migrations.
- Create a new migration for every schema change.

---

# Type Generation

Database types are generated using the Supabase CLI.

The generated file must never be edited manually.

---

# Seed Data

Initial seed includes:

- One Admin account.
- Sample Doctor account.
- Sample Patient.
