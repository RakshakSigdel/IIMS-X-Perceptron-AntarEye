# AGENTS.md — AntarEye

> Strict instructions for agentic AI and human contributors.
> **Read this file in full before making any change.**

---

## 1. Project Context

AntarEye is an AI-assisted retinal disease diagnosis platform for
ophthalmologists. It detects Diabetic Retinopathy, Glaucoma, and
Hypertensive Retinopathy from fundus images.

**Canonical documentation lives in `docs/`.** Before any task, consult
`docs/PROJECT_STATUS.md` to understand what phase the project is in. Do
not begin work that belongs to a future phase.

---

## 2. Required Reading (in order)

| Priority | Document | When to read |
| ---------- | ---------- | ------------- |
| 1 | `docs/PROJECT_STATUS.md` | Always — before every task |
| 2 | `docs/ADR.md` | Always — frozen decisions |
| 3 | `docs/Development-Architecture.md` | Always — code structure rules |
| 4 | `docs/ARCHITECTURE.md` | When touching module boundaries |
| 5 | `docs/API-Specs.md` | When creating/modifying API routes |
| 6 | `docs/API-Contract.md` | When touching the AI integration |
| 7 | `docs/Database-Specs.md` | When modifying schema or queries |
| 8 | `docs/Domain-Model.md` | When modifying business entities |
| 9 | `docs/Data-Model.md` | When mapping DB ↔ domain |
| 10 | `docs/Frontend-Specs.md` | When creating/modifying pages |
| 11 | `docs/Local-Development.md` | When changing dev workflow |

---

## 3. Architecture — Non-Negotiable

These decisions are **frozen** (ADR status: Accepted). Do not deviate.

| Rule | ADR |
| ------ | ----- |
| Single Next.js full-stack app (App Router) | ADR-001 |
| Backend-for-Frontend — all business ops go through Route Handlers | ADR-002 |
| Domain-Oriented Modular Monolith | ADR-003 |
| Service Layer without Repository Pattern | ADR-004 |
| SQL-first migrations, generated TypeScript types, no ORM | ADR-005 |
| Diagnosis sessions are immutable after completion | ADR-006 |
| Store storage paths only, never signed/public URLs | ADR-007 |
| Generated DB types — never manually edited | ADR-008 |
| One service per use case (one file = one operation) | ADR-009 |

### Request Flow

```text
Browser → Next.js Route Handler → Module Service → Supabase / FastAPI
```

**Client-side code MUST NEVER communicate with Supabase directly.**
All Supabase interactions go through Route Handlers (the BFF layer).

### Dependency Direction

```text
app/ → modules/ → lib/
```

**Forbidden:**

- `lib/` → `modules/`
- `module` → another `module`'s internals

Modules communicate only through their exported barrel (`index.ts`).

---

## 4. Project Structure

```text
frontend/src/
├── app/              # Routing, layouts, route handlers, pages
│   ├── (public)/     # Public pages (landing)
│   ├── (auth)/       # Authentication pages (login)
│   ├── (doctor)/     # Doctor-protected pages
│   ├── (admin)/      # Admin-protected pages
│   └── api/          # Route Handlers (BFF)
├── modules/          # Business domain modules
│   ├── auth/
│   ├── users/
│   ├── doctors/
│   ├── patients/
│   ├── diagnosis/
│   ├── reports/
│   ├── triage/
│   ├── ai/
│   ├── dashboard/
│   └── settings/
├── components/       # Shared presentation components
│   ├── ui/           # shadcn/ui atomic components ONLY
│   ├── layout/       # Layout shells (sidebar, header, etc.)
│   └── shared/       # Cross-module reusable components
├── lib/              # Shared infrastructure (NO business logic)
│   ├── supabase/     # Supabase client factories
│   ├── env/          # Environment variable validation
│   ├── utils/        # Generic utilities
│   ├── constants/    # App-wide constants and enums
│   └── validators/   # Shared Zod schemas
├── hooks/            # Shared React hooks
├── providers/        # Context providers (theme, auth, etc.)
├── styles/           # CSS files — theme lives here
└── types/            # Shared TypeScript types and DTOs
```

### Module Structure (each domain module)

```text
module/
├── components/       # Module-specific UI components
├── services/         # One file per use case
├── dto/              # Data Transfer Objects
├── schemas/          # Zod validation schemas
├── mappers/          # DB row → DTO transformations
├── hooks/            # Module-specific React hooks
├── utils/            # Module-specific utilities
├── constants.ts      # Module-specific constants
├── types.ts          # Module-specific types
└── index.ts          # Public barrel export
```

---

## 5. Coding Standards

### 5.1 TypeScript

- **Strict mode is enabled.** Never use `any`. Use `unknown` and narrow.
- Every function parameter and return type must be explicitly typed.
- Use `interface` for object shapes, `type` for unions/intersections.
- Never use non-null assertions (`!`). Use proper null checks or throw.
- Prefer `const` over `let`. Never use `var`.
- Use `readonly` for values that should not be mutated.
- Use exhaustive switch statements with `never` checks.
- Generic type parameters must be descriptive: `TPatient`, not `T`.

### 5.2 No Magic Strings

**Zero tolerance for hardcoded strings in business logic.**

- API route paths → `lib/constants/routes.ts`
- Supabase table names → `lib/constants/tables.ts`
- Storage bucket names → `lib/constants/storage.ts`
- Error messages → module-level `constants.ts`
- Enum values → TypeScript enums or const objects in `lib/constants/`
- Environment variable names → `lib/env/` validated with Zod

```typescript
// ❌ WRONG
const { data } = await supabase.from("patients").select("*");

// ✅ CORRECT
import { TABLES } from "@/lib/constants/tables";
const { data } = await supabase.from(TABLES.PATIENTS).select("*");
```

### 5.3 No Hardcoded Values

- Colors → CSS variables from `tailwind-theme.css` only
- Spacing → Tailwind theme tokens only
- Font sizes → Tailwind theme tokens only
- Breakpoints → Tailwind defaults only
- All configuration → environment variables or constants files

### 5.4 File Naming

| Type | Convention | Example |
| ------ | ----------- | --------- |
| Components | PascalCase | `PatientCard.tsx` |
| Services | kebab-case with `.service.ts` | `create-patient.service.ts` |
| Schemas | kebab-case with `.schema.ts` | `create-patient.schema.ts` |
| DTOs | kebab-case with `.dto.ts` | `patient.dto.ts` |
| Mappers | kebab-case with `.mapper.ts` | `patient.mapper.ts` |
| Types | kebab-case with `.types.ts` | `patient.types.ts` |
| Hooks | camelCase with `use` prefix | `usePatients.ts` |
| Constants | kebab-case | `constants.ts` |
| Utils | kebab-case | `format-date.ts` |
| Route handlers | `route.ts` | `route.ts` (Next.js convention) |
| Pages | `page.tsx` | `page.tsx` (Next.js convention) |
| Layouts | `layout.tsx` | `layout.tsx` (Next.js convention) |
| Loading | `loading.tsx` | `loading.tsx` (Next.js convention) |
| Error | `error.tsx` | `error.tsx` (Next.js convention) |

### 5.5 Import Conventions

- Use `@/` path alias for all imports (maps to `./src/*`).
- Never use relative imports that go up more than one level (`../../`).
- Group imports in this order, separated by blank lines:
  1. External packages (`react`, `next`, `@supabase/*`)
  2. Internal paths (`@/lib/*`, `@/modules/*`, `@/components/*`)
  3. Relative imports (same module)
  4. Type-only imports (use `import type`)
- Use barrel exports (`index.ts`) for module public APIs.

### 5.6 Component Rules

- **Server Components by default.** Only use `"use client"` when required.
- Every Client Component must have `"use client"` as its first line.
- UI components come from **shadcn/ui only** — never create custom primitives
  that duplicate shadcn functionality.
- Business-specific components live inside their module's `components/` dir.
- Shared presentational components live in `src/components/shared/`.
- Props interfaces are defined in the same file, above the component.
- No `React.FC`. Use function declarations with explicit return types.

### 5.7 Styling

- **Tailwind CSS only.** No inline styles, no CSS modules, no styled-components.
- Use **only theme tokens** from `tailwind-theme.css`. Never hardcode colors
  (`bg-red-500`), use semantic tokens (`bg-destructive`).
- Use `cn()` utility from `@/lib/utils` to merge conditional classes.
- All custom theme values are defined in `src/styles/tailwind-theme.css`.
- Support both light and dark modes using the `.dark` variant.

```typescript
// ❌ WRONG
<div className="bg-red-500 text-white p-4">

// ✅ CORRECT
<div className={cn("bg-destructive text-destructive-foreground p-4")}>
```

---

## 6. Backend Conventions

### 6.1 Route Handlers (Controllers)

Route Handlers live in `src/app/api/` and act **only as controllers**.

They must:

1. Parse and validate the request body/params using Zod schemas.
2. Authenticate the user (via `supabase.auth.getUser()`).
3. Authorize the user (check role).
4. Call the appropriate module service.
5. Return a `NextResponse.json()` with the service result.
6. Catch errors and map them to HTTP status codes.

They must **never**:

- Contain business logic.
- Directly query Supabase.
- Import from another module's internals.

```typescript
// Pattern for Route Handlers
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createPatientSchema.parse(body);

    const result = await createPatient(supabase, user.id, validated);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### 6.2 Services

- One file per use case: `create-patient.service.ts`.
- Services receive the Supabase client as a parameter (dependency injection).
- Services throw domain-specific errors — Route Handlers catch and map them.
- Services return DTOs, never raw database rows.
- Services must use mappers to transform database results.

### 6.3 Supabase Client Usage

- **Server-side:** Use `createClient()` from `@/lib/supabase/server.ts`.
- **Service Role:** Use a separate `createServiceClient()` for admin operations.
- **Client-side:** `createClient()` from `@/lib/supabase/client.ts` — **only for
  Supabase Auth state listeners** (e.g., `onAuthStateChange`). Never for data.
- Always use `getUser()` on the server — never `getSession()` alone.

### 6.4 Database

- **SQL migrations are the source of truth.** Never edit tables via UI.
- **Never modify existing migrations.** Always create a new one.
- After schema changes: `supabase db reset` → `npm run db:types`.
- **Never manually edit generated types** (`src/types/database.types.ts`).
- Use parameterized queries. Never interpolate user input into SQL.
- Every query must be scoped to the authenticated user's data (RLS defense-in-depth
  - application-level checks).

### 6.5 Environment Variables

- All env vars must be validated at startup using Zod in `lib/env/`.
- Server-only vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_BASE_URL`.
- Public vars (prefixed `NEXT_PUBLIC_`): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Never use `process.env.SOMETHING!` directly in application code.
  Import validated values from `@/lib/env/`.

### 6.6 Validation

- All external input validated with **Zod** before entering services.
- Validation schemas live in the module's `schemas/` directory.
- Schemas define both the shape and the error messages.
- Request bodies, URL params, query strings — all validated.

### 6.7 Error Handling

- Define domain error classes in `lib/errors/`.
- Services throw domain errors (e.g., `NotFoundError`, `ForbiddenError`).
- Route Handlers map domain errors to HTTP status codes.
- Never expose stack traces or internal details to the client.
- Always log errors server-side before responding.

### 6.8 DTOs and Mappers

- Database rows → DTOs via mapper functions.
- DTOs define the API contract — what the client receives.
- DTOs live in the module's `dto/` directory.
- Mappers live in the module's `mappers/` directory.
- Never return raw database rows from Route Handlers.

---

## 7. Frontend Conventions

### 7.1 Pages (Route Segments)

- Pages are thin. They fetch data and delegate to components.
- Server Components by default. Use `"use client"` sparingly.
- Each route group has its own layout for auth guards and navigation.
- Use Next.js file conventions: `page.tsx`, `layout.tsx`, `loading.tsx`,
  `error.tsx`, `not-found.tsx`.

### 7.2 Data Fetching

- **Server Components:** Fetch directly in the component using `fetch()` or
  call module services from Server Components via server-only code.
- **Client Components:** Fetch through API routes using `fetch()` or a
  custom hook wrapping `fetch()`.
- **Never import Supabase client in a Client Component for data operations.**
- Use loading states (`loading.tsx`) and error boundaries (`error.tsx`).

### 7.3 Forms and Mutations

- Use Server Actions for mutations when appropriate.
- Use Route Handlers (API routes) for complex mutations or when the client
  needs fine-grained control over the request lifecycle.
- Always validate on both client (UX) and server (security).
- Show loading/pending states during mutations.
- Handle errors gracefully with user-friendly messages.

### 7.4 Accessibility

- Semantic HTML elements (`<main>`, `<nav>`, `<section>`, `<article>`).
- ARIA attributes where semantic HTML is insufficient.
- Keyboard navigation support on all interactive elements.
- Color contrast meets WCAG 2.1 AA.
- Focus management on route changes and modals.

---

## 8. AI Service Integration

### 8.1 Contract

The FastAPI AI service exposes a single endpoint: `POST /predict`.

- Input: `multipart/form-data` with an `image` file field.
- Output: JSON with `prediction`, `predicted_class`, `confidence`,
  `heatmap`, `llm_patient_recommendation`, `llm_doctor_recommendation`.

### 8.2 Rules

- AI predictions are **read-only artifacts**. Never modify `prediction`,
  `confidence`, `predicted_class`, or `heatmap` data.
- LLM recommendations are explanatory text — they may be displayed but
  never treated as clinical decisions.
- The AI service must never be called from client-side code.
- Timeout: 30 seconds. No automatic retries.
- All AI responses must be validated against the expected schema before
  persisting.

### 8.3 AI Layer Assumption

The AI layer (FastAPI inference service) is **already complete** and
treated as an external dependency. Do not modify AI service code.

---

## 9. Testing

### 9.1 Requirements

- Every service must have unit tests.
- Every API route must have integration tests.
- Tests live alongside the code they test in a `__tests__/` directory.
- Use Vitest as the test runner.
- Mock Supabase client in service tests.
- Mock services in Route Handler tests.

### 9.2 Test Naming

```text
describe("createPatient")
  it("should create a patient with valid data")
  it("should throw ForbiddenError when doctor_id does not match")
  it("should throw ValidationError when date_of_birth is in the future")
```

### 9.3 What to Test

- **Services:** Business logic, edge cases, error paths.
- **Route Handlers:** Auth checks, validation, correct status codes.
- **Components:** Critical interactions (form submission, navigation).
- **Mappers:** Correct transformation from DB rows to DTOs.

---

## 10. Git and Documentation

### 10.1 Commits

- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`,
  `refactor:`.
- One logical change per commit.
- Reference the module: `feat(patients): add create patient service`.

### 10.2 Documentation Updates

- If you change architecture → update `docs/ADR.md`.
- If you change the API → update `docs/API-Specs.md`.
- If you change the database → update `docs/Database-Specs.md`.
- If you change the frontend routes → update `docs/Frontend-Specs.md`.
- Always update `docs/PROJECT_STATUS.md` when phase milestones change.

---

## 11. Before Adding Dependencies

Ensure the dependency:

- Solves a **real** problem that cannot be solved with existing tools.
- Does not duplicate existing functionality.
- Fits the project architecture.
- Is actively maintained with a reasonable install size.
- Is compatible with the current versions of Next.js 16, React 19,
  and Tailwind CSS v4.

**Pre-approved dependencies:** `zod`, `@supabase/ssr`, `@supabase/supabase-js`,
`shadcn`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`.

Any other dependency requires explicit justification.

---

## 12. Definition of Done

Before finishing any task, verify:

- [ ] Architecture rules respected (frozen ADRs).
- [ ] No magic strings — all values from constants.
- [ ] No hardcoded styling values — all from theme tokens.
- [ ] Input validation implemented (Zod).
- [ ] TypeScript strict mode satisfied — no `any`, no `!`.
- [ ] DTOs returned — no raw DB rows exposed.
- [ ] Errors handled — domain errors thrown, HTTP codes mapped.
- [ ] Loading and error states implemented (UI).
- [ ] Accessibility checked (semantic HTML, ARIA, keyboard).
- [ ] Tests written for new services and route handlers.
- [ ] Client code does not communicate with Supabase directly.
- [ ] Documentation updated if behavior changed.
- [ ] No console.log left in production code.
- [ ] Imports follow the project conventions.
- [ ] Files named according to conventions.

---

## 13. Common Mistakes to Avoid

| Mistake | Correct Approach |
| --------- | ----------------- |
| Calling Supabase from a Client Component | Call your own API route instead |
| Using `any` type | Use `unknown` and narrow with type guards |
| Hardcoding color values (`bg-red-500`) | Use theme tokens (`bg-destructive`) |
| Writing business logic in Route Handlers | Move logic to module services |
| Returning raw DB rows from API | Use mappers to create DTOs |
| Using `process.env.X!` directly | Import from `@/lib/env/` |
| Creating custom UI primitives | Use shadcn/ui components |
| Modifying generated database types | Regenerate with `npm run db:types` |
| Editing old SQL migrations | Create a new migration file |
| Importing module internals from another module | Use the barrel export (`index.ts`) |
| Using string literals for table/bucket names | Use constants from `@/lib/constants/` |
| Skipping validation on server-side | Always validate with Zod before services |
| Using `getSession()` for auth checks | Use `getUser()` on the server |
