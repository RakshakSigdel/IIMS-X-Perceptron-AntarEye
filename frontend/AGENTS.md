# AGENTS.md

## Project

AntarEye

AI-assisted retinal disease diagnosis platform.

---

## Read Order

Before making changes, read:

1. docs/PROJECT_STATUS.md
2. docs/architecture/ADR.md
3. docs/architecture/Development-Architecture.md

Read additional documents only if the current task requires them.

---

## Current Architecture

- Modular Monolith
- Next.js App Router
- Backend-for-Frontend
- Service Layer
- Supabase
- External FastAPI AI service

---

## Rules

- Respect frozen architecture decisions.
- Update ADR.md when architecture changes.
- Keep Route Handlers thin.
- Put business logic inside services.
- One service = one use case.
- Validate requests using Zod.
- Return DTOs only.
- Never expose database models.
- Store storage paths, never URLs.
- Never modify generated database types.
- Never introduce a Repository Pattern or ORM.
- Prefer composition over inheritance.
- Keep modules independent.

---

## AI Rules

The FastAPI service is the source of truth.

Never modify:

- diagnosis
- confidence
- probabilities

LLMs may generate only explanatory text and recommendations.

---

## Before Adding Dependencies

Ensure the dependency:

- solves a real problem
- does not duplicate existing functionality
- fits the project architecture

---

## Definition of Done

Before finishing:

- Architecture respected.
- Validation implemented.
- Types correct.
- Errors handled.
- Documentation updated if needed.
- ADR updated if architecture changed.
