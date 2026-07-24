# Local Development

## Prerequisites

- Node.js (LTS)
- npm
- Docker Desktop
- Supabase CLI

---

## Initial Setup

```powershell
npm install
```

```powershell
supabase start
```

```powershell
supabase db reset
```

Generate database types:

```powershell
npm run db:types
```

Run the application:

```powershell
npm run dev
```

---

## Development Workflow

1. Pull latest changes.
2. Install dependencies if required.
3. Start Supabase.
4. Apply migrations.
5. Generate database types.
6. Start development server.

---

## Database Changes

Create a migration:

```powershell
supabase migration new <migration_name>
```

After editing the migration:

```powershell
supabase db reset
```

Regenerate types:

```powershell
npm run db:types
```

---

## AI Service

Run the FastAPI service separately.

Configure its URL using:

```text
AI_API_BASE_URL
```

inside `.env.local`.

---

## Notes

- Never edit generated database types.
- Never modify previous migrations.
- Always create a new migration.
