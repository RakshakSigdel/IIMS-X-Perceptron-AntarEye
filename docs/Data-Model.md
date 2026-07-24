# Data Model

## Purpose

Defines every application model used throughout the system before database implementation.

---

# Core Models

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
- Heatmap
- Medical Report
- Triage Result

---

## Fundus Image

Metadata of the uploaded retinal image.

The actual file is stored in Supabase Storage.

---

## AI Prediction

Stores the structured prediction returned by the AI service.

---

## Heatmap

Metadata for the generated heatmap image.

The actual file is stored in Supabase Storage.

---

## Medical Report

Metadata for the generated PDF report.

The actual PDF is stored in Supabase Storage.

---

## Triage Result

Stores the calculated patient priority.

---

# Infrastructure Models

These support the application but are not business entities.

- User (Supabase Auth)
- Role
- Refresh Session (managed by Supabase)
- Storage Object (Supabase Storage)

---

# Ownership

User
└── Admin OR Doctor

Doctor
└── Patient

Patient
└── Diagnosis Session

Diagnosis Session
├── Fundus Image
├── AI Prediction
├── Heatmap
├── Medical Report
└── Triage Result

---

# Storage Responsibility

Database

- Metadata
- Relationships
- Business data

Supabase Storage

- Fundus images
- Heatmaps
- Reports

AI Service

- Prediction generation
- Heatmap generation

---

# Model Mapping

| Domain | Application Model | Database |
|---------|-------------------|----------|
| Admin | Admin | profiles |
| Doctor | Doctor | profiles |
| Patient | Patient | patients |
| Diagnosis Session | Diagnosis Session | diagnosis_sessions |
| Fundus Image | Fundus Image | fundus_images |
| AI Prediction | AI Prediction | ai_predictions |
| Heatmap | Heatmap | heatmaps |
| Medical Report | Medical Report | reports |
| Triage Result | Triage Result | triage_results |
