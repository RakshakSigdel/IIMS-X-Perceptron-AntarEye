# AntarEye
>
> Architecture & Development Guide (v1)

---

## 1. Project Overview

AntarEye is an AI-assisted Software-as-a-Service (SaaS) platform for ophthalmologists and general medical practitioners.

The platform assists doctors in diagnosing retinal diseases from Fundus Images while maintaining patient history, generating medical reports, and prioritizing patients using a triage system.

AntarEye is developed as a Hackathon MVP while keeping the architecture scalable for future production development.

---

## 2. Primary Objective

Assist doctors in detecting:

- Diabetic Retinopathy (DR)
- Glaucoma
- Hypertensive Retinopathy (HR)

from Fundus Retina Images using AI-assisted diagnosis.

The system is a decision-support tool and does **not** replace medical professionals.

---

## 3. Target Users

### Super Admin

- Seeded into database
- Creates doctor accounts
- Manages the platform

---

### Doctor

Primary user of the application.

Can:

- Login
- Create patients
- Manage patients
- Upload retinal images
- Start diagnosis sessions
- View AI predictions
- Generate reports
- View patient history
- View patient triage

---

### Patient

Exists as a user entity.

For MVP:

- No login
- No dashboard

Purpose:

Future expansion.

---

## 4. MVP Scope

Included

- Authentication
- RBAC
- Patient Management
- Diagnosis Sessions
- AI Predictions
- Heatmap Visualization
- Medical Report Generation
- Patient History
- Triage
- Light / Dark Theme

Excluded

- Multi-clinic support
- Billing
- Payments
- Notifications
- Patient Portal
- Multiple AI Models
- Scheduling

---

## 5. High-Level Architecture

```txt
Frontend (Next.js)

↓

BFF (Route Handlers)

↓

Backend Services

↓

Supabase
        \
         \
          AI Service (FastAPI)
```

---

## 6. Monorepo Structure

```txt
root/

├── docs/
│
├── scripts/
│
├── frontend/
│
├── ai/
│
├── compose.yaml
├── README.md
└── .gitignore
```

---

## 7. Frontend (Next.js + Backend)

```txt
frontend/

├── public/
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   ├── config.toml
│   └── functions/
│
├── src/
│
│   ├── app/
│   │
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── (doctor)/
│   │   ├── (admin)/
│   │   │
│   │   ├── api/
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   ├── users/
│   │   ├── doctors/
│   │   ├── patients/
│   │   ├── diagnosis/
│   │   ├── reports/
│   │   ├── triage/
│   │   ├── ai/
│   │   ├── dashboard/
│   │   └── settings/
│   │
│   ├── components/
│   │
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   │
│   ├── lib/
│   │
│   │   ├── supabase/
│   │   ├── env/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── validators/
│   │
│   ├── hooks/
│   │
│   ├── providers/
│   │
│   ├── styles/
│   │
│   └── types/
│
├── package.json
└── ...
```

---

## 8. Module Structure

Each business module owns everything related to itself.

Example:

```txt
patients/

├── components/
├── services/
├── schemas/
├── hooks/
├── utils/
├── constants.ts
├── types.ts
└── index.ts
```

Business logic stays inside modules.

---

## 9. AI Project Structure

```txt
ai/

├── inference/
│
│   ├── app/
│   │
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── pipelines/
│   │   ├── preprocessing/
│   │   ├── postprocessing/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── weights/
│   │
│   ├── tests/
│   │
│   └── requirements.txt
│
├── training/
│
│   ├── datasets/
│   ├── notebooks/
│   ├── experiments/
│   ├── preprocessing/
│   ├── models/
│   ├── training/
│   ├── evaluation/
│   ├── outputs/
│   └── requirements.txt
│
└── README.md
```

Training and inference are intentionally separated.

Training produces model artifacts.

Inference only serves predictions.

---

## 10. Diagnosis Pipeline

```txt
Doctor uploads Fundus Image

↓

Backend Validation

↓

Upload to Supabase Storage

↓

Send Image to AI

↓

AI Pipeline

1. Retina Validation
2. Image Quality Assessment
3. Disease Detection
4. Heatmap Generation
5. Report Data Generation

↓

Return JSON

↓

Backend

- Validate Response
- Store Prediction
- Store Metadata
- Store Session
- Trigger Report Generation

↓

Frontend

↓

Doctor Views Result
```

---

## 11. Architectural Style

AntarEye follows a **Domain-Oriented Modular Monolith** architecture.

Code is organized around business domains rather than technical layers.

Every module owns:

- UI
- Business Logic
- Validation
- Types
- Utilities

This minimizes coupling while keeping the project simple.

---

## 12. Backend Flow

```txt
UI

↓

Page

↓

BFF Route

↓

Backend Service

↓

Supabase / AI

↓

Response
```

API Routes act only as controllers.

Business logic lives inside module services.

---

## 13. Supabase Responsibilities

Supabase provides:

- PostgreSQL
- Authentication
- Storage
- Row Level Security

We use the Supabase SDK.

REST API will not be used directly.

---

## 14. Storage Structure

Supabase Storage

```txt
patients/
diagnosis/
heatmaps/
reports/
```

---

## 15. Report Generation

Preferred output:

PDF

Reports should be downloadable.

Generation should occur asynchronously.

---

## 16. Background Jobs

Prediction should not wait for report generation.

Potential implementations:

- FastAPI Background Tasks
- Trigger.dev
- BullMQ
- PostgreSQL Queue Worker

Final implementation to be decided.

---

## 17. Security

Authentication

Supabase Auth

Authorization

RBAC

Roles

- Super Admin
- Doctor
- Patient

Doctors may only access their own patients.

---

## 18. Design Principles

- Keep API Routes thin.
- Keep Pages thin.
- Keep business logic inside modules.
- Prefer composition over inheritance.
- Validate every external input.
- Keep shared code inside `lib`.
- Avoid unnecessary abstractions.
- Build for maintainability.

---

## 19. Future Improvements

- Multi-clinic support
- Multi-tenancy
- Patient Portal
- Additional AI Models
- Scheduling
- Billing
- Notifications
- Mobile Application

---

## 20. Development Workflow

Feature

↓

Database Design

↓

Module Service

↓

API Route

↓

Frontend

↓

Testing

↓

Review

---

## 21. Project Goal

Deliver a production-quality MVP demonstrating AI-assisted retinal disease diagnosis while maintaining a clean, scalable architecture suitable for future expansion.
