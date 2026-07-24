<!-- markdownlint-disable MD013 MD024 MD025 MD060 -->
# Development Architecture

## Purpose

Defines the development architecture, project organization, coding conventions,
and dependency rules.

---

## Architecture Style

- Modular Monolith
- Domain-Oriented Design (lightweight)
- Backend-for-Frontend (BFF)
- Service Layer
- Route Handlers as Controllers

---

## Request Flow

```text
Browser
    ↓
Next.js Route Handler
    ↓
Module Service
    ↓
Supabase / FastAPI
```

Business logic exists only inside module services.

---

## Project Structure

```text
frontend/
└── src/
    ├── app/
    ├── modules/
    ├── components/
    ├── lib/
    ├── providers/
    ├── hooks/
    ├── styles/
    └── types/
```

---

## Module Structure

```text
module/

├── services/
├── dto/
├── schemas/
├── mappers/
├── types/
├── constants.ts
└── index.ts
```

---

## Responsibilities

### app/

- Routing
- Layouts
- Route Handlers
- Server Components

No business logic.

---

### modules/

Owns all business logic.

Each module owns:

- Services
- DTOs
- Schemas
- Mappers
- Types
- Constants

---

### lib/

Shared infrastructure.

Examples:

- Supabase
- AI Client
- Auth
- Environment
- Utilities

Never place business logic here.

---

### components/

Reusable presentation components.

Business-specific components belong inside their respective route segment.

---

### hooks/

Reusable React hooks.

Feature-specific hooks remain inside the owning module.

---

## Dependency Rules

Allowed

```text
app
    ↓
modules
    ↓
lib
```

Forbidden

```text
lib
    ↓
modules
```

```text
module
    ↓
another module internals
```

Modules communicate only through exported services.

---

## Validation

- Zod for request validation.
- Validation occurs before entering services.

---

## DTOs

DTOs define API contracts.

Database models must never be returned directly.

---

## Database

- SQL-first migrations.
- Generated Supabase types.
- No ORM.
- No Repository Pattern.

---

## File Storage

Store only storage paths.

Never store signed or public URLs.

---

## Error Handling

- Services throw domain errors.
- Route Handlers map errors to HTTP responses.

---

## Logging

- Record business events in `audit_logs`.
- Avoid logging sensitive patient information.

---

## Coding Principles

- Keep services cohesive.
- Prefer composition.
- Prefer explicit code.
- Avoid premature abstraction.
- Keep modules independent.
