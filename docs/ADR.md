<!-- markdownlint-disable MD024 MD025 MD013 -->
# Architecture Decision Record (ADR)

This document records important architectural decisions made throughout the project.

Status values:

- Proposed
- Accepted
- Superseded
- Deprecated

---

## ADR-001

## Title

Next.js Full-Stack Architecture

## Status

Accepted

## Context

The application requires a web frontend, backend APIs, authentication, and integration with Supabase and an external AI service.

## Decision

Use a single Next.js application with the App Router.

The application serves as both:

- Frontend
- Backend-for-Frontend (BFF)

## Consequences

### Advantages

- Single codebase
- Shared TypeScript types
- Simplified deployment
- Faster development

### Disadvantages

- Backend and frontend share the same deployment lifecycle

---

## ADR-002

## Title

Backend-for-Frontend (BFF)

## Status

Accepted

## Context

The frontend should never communicate directly with Supabase for business operations.

## Decision

All business requests flow through Next.js Route Handlers.

```text
Browser
    ↓
Next.js API
    ↓
Services
    ↓
Supabase / FastAPI
```

Authentication is handled using Supabase Auth.

## Consequences

### Advantages

- Centralized business logic
- Better validation
- Easier auditing
- Cleaner API surface

---

## ADR-003

## Title

Modular Monolith

## Status

Accepted

## Context

The project is developed by a three-member hackathon team.

## Decision

Adopt a Domain-Oriented Modular Monolith.

Modules own their business logic and communicate only through exported services.

## Consequences

### Advantages

- Clear boundaries
- Easy refactoring
- No microservice complexity

---

## ADR-004

## Title

Service Layer Without Repository Pattern

## Status

Accepted

## Context

Supabase already provides an expressive query API.

## Decision

Use a Service Layer only.

Services communicate directly with Supabase.

No Repository Pattern.

## Consequences

### Advantages

- Less boilerplate
- Simpler architecture
- Faster development

---

## ADR-005

## Title

SQL-First Database

## Status

Accepted

## Context

Supabase is PostgreSQL-first.

## Decision

Use SQL migrations as the source of truth.

Generate TypeScript database types from Supabase.

Do not use an ORM.

## Consequences

### Advantages

- Database remains authoritative
- Easy replication
- Easy rollback
- Generated types stay synchronized

---

## ADR-006

## Title

Immutable Diagnosis Sessions

## Status

Accepted

## Context

Every examination should preserve historical medical records.

## Decision

A diagnosis session represents one immutable examination.

A new examination always creates a new diagnosis session.

Existing diagnosis sessions are never modified after completion.

## Consequences

### Advantages

- Complete medical history
- Better auditing
- Simpler business logic

---

## ADR-007

## Title

Storage Strategy

## Status

Accepted

## Context

Medical images and reports are stored in Supabase Storage.

## Decision

Store only storage object paths in PostgreSQL.

Generate signed or public URLs when required.

## Consequences

### Advantages

- URLs remain disposable
- Easier bucket migration
- Better security

---

## ADR-008

## Title

Generated Database Types

## Status

Accepted

## Context

The application requires strongly typed database access.

## Decision

Generate TypeScript database types using the Supabase CLI.

Do not manually edit generated types.

Create DTOs manually.

## Consequences

### Advantages

- Strong typing
- No duplicated models
- Database remains the source of truth

---

## ADR-009

## Title

One Service Per Use Case

## Status

Accepted

## Context

Large service files become difficult to maintain.

## Decision

Each business use case is implemented as an individual service.

Example:

```text
services/

create-patient.service.ts
update-patient.service.ts
delete-patient.service.ts
```

## Consequences

### Advantages

- Small focused files
- Easier testing
- Reduced merge conflicts
- Better readability
