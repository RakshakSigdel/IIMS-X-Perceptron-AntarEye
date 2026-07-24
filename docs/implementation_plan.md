# AntarEye — Development Implementation Plan

> Parallel backend & frontend development plan assuming the AI layer is complete.

---

## Resolved Decisions

| Question | Decision |
|----------|----------|
| Middleware pattern | `proxy.ts` (Next.js 16 modern pattern) |
| Test runner | Vitest |
| Server Actions vs Route Handlers | Route Handlers for BFF; Server Actions for login/logout only |
| Triage algorithm | Confidence-threshold based (see Phase 5) |
| PDF library | `@react-pdf/renderer` — React-based, declarative, good for structured medical reports |
| Admin seeding | Separate script (`create-admin.ts`) — not in `seed.sql` |
| Fonts | Theme CSS fonts: `Manrope` (sans), `Lora` (serif), `IBM Plex Mono` (mono) |

## Frontend Scope Notice

> [!IMPORTANT]
> **Frontend UI is handled by a separate teammate.** All frontend pages/components
> in this plan should be created as **minimal placeholders only** (bare `page.tsx`
> files with a heading identifying the page). The agentic AI should focus exclusively
> on:
> - Backend infrastructure (`lib/`, `modules/`, `app/api/`)
> - Route Handlers (API endpoints)
> - Services, DTOs, schemas, mappers
> - Proxy/middleware setup
> - Layout files (with auth guards, but minimal UI)
> - Database types and migrations
>
> Do NOT build frontend components, forms, tables, charts, or any visual UI.
> Create only the necessary page stubs so Next.js routing works.

---

## Triage Algorithm

The triage system classifies patient urgency based on AI prediction confidence and detected disease class.

```text
Input:  predicted_class (string), confidence (float 0-1)

Rules (evaluated in order):
1. predicted_class = "diabetic_retinopathy" AND confidence >= 0.8  → CRITICAL
2. predicted_class = "glaucoma"             AND confidence >= 0.8  → CRITICAL
3. predicted_class = "diabetic_retinopathy" AND confidence >= 0.5  → HIGH
4. predicted_class = "glaucoma"             AND confidence >= 0.5  → HIGH
5. predicted_class = "hypertensive_retinopathy" AND confidence >= 0.7  → HIGH
6. predicted_class = "hypertensive_retinopathy" AND confidence >= 0.4  → MEDIUM
7. predicted_class = "normal"               AND confidence >= 0.8  → LOW
8. Any remaining case                                              → MEDIUM
```

Levels: `CRITICAL` > `HIGH` > `MEDIUM` > `LOW`

Rationale: DR and Glaucoma are sight-threatening and irreversible — high confidence triggers CRITICAL. Hypertensive Retinopathy is serious but often manageable — HIGH at ≥0.7. Normal with high confidence is LOW priority. Anything ambiguous defaults to MEDIUM for doctor review.

---

## Proposed Changes

### Phase 1 — Foundation & Infrastructure

---

#### Backend (BFF + Infrastructure)

##### [MODIFY] [server.ts](file:///d:/Hackathons/IIMS/antareye/frontend/src/lib/supabase/server.ts)
- Refactor to use validated env vars
- Add `createServiceClient()` using `SUPABASE_SERVICE_ROLE_KEY`

##### [MODIFY] [client.ts](file:///d:/Hackathons/IIMS/antareye/frontend/src/lib/supabase/client.ts)
- Refactor to use validated env vars

##### [NEW] `src/lib/env/index.ts` — Zod-validated env vars
##### [NEW] `src/lib/env/server.ts` — Server-only env vars
##### [NEW] `src/lib/env/client.ts` — Public env vars
##### [NEW] `src/lib/constants/tables.ts`
##### [NEW] `src/lib/constants/storage.ts`
##### [NEW] `src/lib/constants/routes.ts`
##### [NEW] `src/lib/constants/enums.ts`
##### [NEW] `src/lib/constants/index.ts`
##### [NEW] `src/lib/errors/index.ts` — Domain error classes
##### [NEW] `src/lib/api/response.ts` — Standardized API responses
##### [NEW] `proxy.ts` — Auth session refresh + route guards
##### [NEW] `src/types/database.types.ts` — Generated Supabase types

#### Frontend (Placeholders Only)

##### [MODIFY] [layout.tsx](file:///d:/Hackathons/IIMS/antareye/frontend/src/app/layout.tsx)
- Fix fonts to `Manrope`/`Lora`/`IBM Plex Mono`
- Add metadata, ThemeProvider shell

##### [NEW] `src/app/(auth)/layout.tsx` — Minimal auth layout placeholder
##### [NEW] `src/app/(doctor)/layout.tsx` — Auth-guarded doctor layout placeholder
##### [NEW] `src/app/(admin)/layout.tsx` — Auth-guarded admin layout placeholder

---

### Phase 2 — Authentication

#### Backend
##### [NEW] `src/modules/auth/services/login.service.ts`
##### [NEW] `src/modules/auth/services/logout.service.ts`
##### [NEW] `src/modules/auth/services/get-current-user.service.ts`
##### [NEW] `src/modules/auth/schemas/login.schema.ts`
##### [NEW] `src/modules/auth/dto/user-session.dto.ts`
##### [NEW] `src/modules/auth/mappers/user-profile.mapper.ts`
##### [NEW] `src/modules/auth/constants.ts`
##### [NEW] `src/modules/auth/index.ts`
##### [NEW] `src/app/api/auth/login/route.ts`
##### [NEW] `src/app/api/auth/logout/route.ts`
##### [NEW] `src/app/api/auth/me/route.ts`

#### Frontend (Placeholder Only)
##### [NEW] `src/app/(auth)/login/page.tsx` — Placeholder page stub

---

### Phase 3 — Admin: Doctor Management

#### Backend
##### [NEW] `src/modules/doctors/services/create-doctor.service.ts`
##### [NEW] `src/modules/doctors/services/list-doctors.service.ts`
##### [NEW] `src/modules/doctors/services/get-doctor.service.ts`
##### [NEW] `src/modules/doctors/services/update-doctor.service.ts`
##### [NEW] `src/modules/doctors/services/disable-doctor.service.ts`
##### [NEW] `src/modules/doctors/schemas/*.schema.ts`
##### [NEW] `src/modules/doctors/dto/doctor.dto.ts`
##### [NEW] `src/modules/doctors/mappers/doctor.mapper.ts`
##### [NEW] `src/modules/doctors/constants.ts`
##### [NEW] `src/modules/doctors/index.ts`
##### [NEW] `src/app/api/admin/doctors/route.ts`
##### [NEW] `src/app/api/admin/doctors/[id]/route.ts`

#### Frontend (Placeholder Only)
##### [NEW] `src/app/(admin)/admin/page.tsx`
##### [NEW] `src/app/(admin)/admin/doctors/page.tsx`
##### [NEW] `src/app/(admin)/admin/doctors/new/page.tsx`
##### [NEW] `src/app/(admin)/admin/doctors/[doctorId]/edit/page.tsx`

---

### Phase 4 — Doctor: Patient Management

#### Backend
##### [NEW] `src/modules/patients/services/create-patient.service.ts`
##### [NEW] `src/modules/patients/services/list-patients.service.ts`
##### [NEW] `src/modules/patients/services/get-patient.service.ts`
##### [NEW] `src/modules/patients/services/update-patient.service.ts`
##### [NEW] `src/modules/patients/services/archive-patient.service.ts`
##### [NEW] `src/modules/patients/schemas/*.schema.ts`
##### [NEW] `src/modules/patients/dto/patient.dto.ts`
##### [NEW] `src/modules/patients/mappers/patient.mapper.ts`
##### [NEW] `src/modules/patients/constants.ts`
##### [NEW] `src/modules/patients/index.ts`
##### [NEW] `src/app/api/patients/route.ts`
##### [NEW] `src/app/api/patients/[id]/route.ts`

#### Frontend (Placeholder Only)
##### [NEW] `src/app/(doctor)/doctor/page.tsx`
##### [NEW] `src/app/(doctor)/doctor/patients/page.tsx`
##### [NEW] `src/app/(doctor)/doctor/patients/new/page.tsx`
##### [NEW] `src/app/(doctor)/doctor/patients/[patientId]/page.tsx`
##### [NEW] `src/app/(doctor)/doctor/patients/[patientId]/edit/page.tsx`

---

### Phase 5 — Diagnosis Pipeline

#### Backend
##### [NEW] `src/modules/diagnosis/services/create-diagnosis.service.ts`
##### [NEW] `src/modules/diagnosis/services/list-diagnosis.service.ts`
##### [NEW] `src/modules/diagnosis/services/get-diagnosis.service.ts`
##### [NEW] `src/modules/ai/services/predict.service.ts`
##### [NEW] `src/modules/ai/schemas/ai-response.schema.ts`
##### [NEW] `src/modules/triage/services/calculate-triage.service.ts`
##### [NEW] `src/modules/triage/constants.ts`
##### [NEW] `src/modules/diagnosis/schemas/*.schema.ts`
##### [NEW] `src/modules/diagnosis/dto/diagnosis.dto.ts`
##### [NEW] `src/modules/diagnosis/mappers/diagnosis.mapper.ts`
##### [NEW] `src/modules/diagnosis/constants.ts`
##### [NEW] `src/modules/diagnosis/index.ts`
##### [NEW] `src/app/api/diagnosis/route.ts`
##### [NEW] `src/app/api/diagnosis/[id]/route.ts`

#### Frontend (Placeholder Only)
##### [NEW] `src/app/(doctor)/doctor/diagnosis/[diagnosisId]/page.tsx`

---

### Phase 6 — Reports, Dashboard & Polish

#### Backend
##### [NEW] `src/modules/reports/services/generate-report.service.ts`
##### [NEW] `src/modules/reports/services/download-report.service.ts`
##### [NEW] `src/app/api/diagnosis/[id]/report/route.ts`
##### [NEW] `src/modules/dashboard/services/doctor-dashboard.service.ts`
##### [NEW] `src/modules/dashboard/services/admin-dashboard.service.ts`
##### [NEW] `src/app/api/dashboard/route.ts`

#### Frontend (Placeholder Only)
##### [NEW] `src/app/(doctor)/doctor/profile/page.tsx`
##### Loading/error page stubs for each route group

---

## Verification Plan

### Automated Tests
```bash
npm run test          # Vitest unit tests
npx tsc --noEmit      # Type checking
npm run lint          # ESLint
npm run build         # Build verification
```

### Manual Verification
1. Auth: Login as admin → create doctor → logout → login as doctor
2. Patient CRUD: Create, view, edit, archive
3. Diagnosis: Upload image → view results → download report
4. Role enforcement: Cross-role access denied
5. Error states: AI service down, invalid uploads, expired sessions
