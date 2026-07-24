# Product Vision

## Project - AntarEye

AI-assisted retinal disease diagnosis platform for ophthalmologists and medical practitioners.

---

## Vision

Provide doctors with an AI-assisted decision support system that accelerates retinal disease screening while maintaining patient records, diagnosis history, and medical reports in a single application.

The system assists medical professionals and does not replace clinical judgment.

---

## Problem Statement

Manual retinal disease screening is time-consuming and depends on specialist expertise.

Many clinics lack quick access to reliable screening tools, resulting in delayed diagnosis and treatment.

---

## Target Users

### Admin

- Creates doctor accounts
- Manages doctors
- Maintains the platform

### Doctor

Primary user of the application.

Can:

- Authenticate
- Manage patients
- Upload retinal images
- Start diagnosis sessions
- View AI predictions
- View heatmaps
- Generate reports
- View patient history
- Prioritize patients using triage

### Patient

Domain entity only.

No authentication in MVP.

---

## MVP Goals

- Secure authentication
- Patient management
- AI-assisted diagnosis
- Diagnosis history
- Heatmap visualization
- PDF report generation
- Patient prioritization
- Responsive UI
- Light/Dark theme

---

## Out of Scope

- Patient portal
- Multi-clinic support
- Billing
- Scheduling
- Notifications
- Multiple AI models
- Mobile application

---

## AI Scope

The AI model is developed independently.

AntarEye communicates with the AI service exclusively through its exposed FastAPI endpoints.

Training, experimentation, and model development are outside the scope of this project.

---

## Success Criteria

A doctor can:

1. Login.
2. Create a patient.
3. Upload a retinal image.
4. Receive an AI prediction.
5. View the generated heatmap.
6. Download a medical report.
7. Review previous diagnosis sessions.

---

## Constraints

- Built by a 3-member hackathon team.
- Full-stack Next.js application.
- Supabase for backend services.
- FastAPI used only for AI inference.
- Single image per diagnosis session.
- Admin-created doctor accounts only.

---

## Assumptions

- AI service is available during diagnosis.
- AI returns a standardized response.
- Doctors verify AI predictions before making medical decisions.
- Internet connectivity is available when using the application.

---

## Risks

- AI service unavailable.
- Slow inference.
- Invalid or poor-quality retinal images.
- Large image upload latency.

---

## High-Level Workflow

Admin
→ Creates Doctor

Doctor
→ Creates Patient
→ Uploads Retinal Image
→ Starts Diagnosis
→ AI Prediction
→ Reviews Results
→ Downloads Report
→ Views Diagnosis History
