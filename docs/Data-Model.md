<!-- markdownlint-disable MD013 MD024 MD025 MD060 -->
# Data Model

## Purpose

Defines every application model used throughout the system before database implementation.

---

## Core Models

## Admin

Represents a system administrator.

---

## Doctor

Represents a medical practitioner using the platform.

---

## Patient

Represents a patient managed by a doctor.

---

## Diagnosis Session

Represents one complete retinal examination.

Owns:

- Fundus Image
- AI Prediction
- LLM Recommendations
- Heatmap
- Medical Report
- Triage Result

---

## Fundus Image

Metadata and storage path of the uploaded retinal image.

The actual file is stored in Supabase Storage (`fundus-images` bucket).
The path is stored in the `diagnosis_sessions` table.

---

## AI Prediction

Stores the structured prediction returned by the AI service.

Stored as JSON within the `diagnosis_sessions` table.

---

## Heatmap

Metadata and storage path for the generated heatmap image.

The actual file is stored in Supabase Storage (`heatmaps` bucket).
The path is stored in the `diagnosis_sessions` table.

---

## Medical Report

Metadata and storage path for the generated PDF report.

The actual PDF is stored in Supabase Storage (`reports` bucket).
The path is stored in the `diagnosis_sessions` table.

---

## Triage Result

Stores the calculated patient priority.

Stored as a column (`triage_level`) in the `diagnosis_sessions` table to allow efficient patient sorting.

---

## Infrastructure Models

These support the application but are not business entities.

- User (Supabase Auth)
- Role
- Refresh Session (managed by Supabase)
- Storage Object (Supabase Storage)

---

## Ownership

User
└── Admin OR Doctor

Doctor
└── Patient

Patient
└── Diagnosis Session

Diagnosis Session
├── Fundus Image
├── AI Prediction
├── LLM Recommendations
├── Heatmap
├── Medical Report
└── Triage Result

---

## Storage Responsibility

Database

- Metadata
- Relationships
- Business data

Supabase Storage

- Fundus images (`fundus-images`)
- Heatmaps (`heatmaps`)
- Reports (`reports`)

AI Service

- Prediction generation
- Heatmap generation

---

## Model Mapping

| Domain | Application Model | Database |
| --------- | ------------------- | ---------- |
| Admin | Admin | user_profiles |
| Doctor | Doctor | user_profiles |
| Patient | Patient | patients |
| Diagnosis Session | Diagnosis Session | diagnosis_sessions |
| Fundus Image | Fundus Image | diagnosis_sessions |
| AI Prediction | AI Prediction | diagnosis_sessions |
| Heatmap | Heatmap | diagnosis_sessions |
| Medical Report | Medical Report | diagnosis_sessions |
| Triage Result | Triage Result | diagnosis_sessions |
