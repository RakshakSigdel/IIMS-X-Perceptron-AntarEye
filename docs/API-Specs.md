# API Specification

## Purpose

Defines the public API contract between the Next.js frontend and the Next.js Backend-for-Frontend (BFF).

The frontend communicates **only** with these endpoints.

---

# Authentication

## Login

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/login` |

---

## Logout

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/logout` |

---

## Current User

| Method | Endpoint |
|---------|----------|
| GET | `/api/auth/me` |

---

# Admin

## Doctors

| Method | Endpoint | Purpose |
|---------|----------|---------|
| GET | `/api/admin/doctors` | List doctors |
| POST | `/api/admin/doctors` | Create doctor |
| GET | `/api/admin/doctors/:id` | Get doctor |
| PATCH | `/api/admin/doctors/:id` | Update doctor |
| DELETE | `/api/admin/doctors/:id` | Disable doctor |

---

# Patients

| Method | Endpoint | Purpose |
|---------|----------|---------|
| GET | `/api/patients` | List patients |
| POST | `/api/patients` | Create patient |
| GET | `/api/patients/:id` | Get patient |
| PATCH | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Archive patient |

---

# Diagnosis Sessions

| Method | Endpoint | Purpose |
|---------|----------|---------|
| GET | `/api/diagnosis` | List diagnosis sessions |
| POST | `/api/diagnosis` | Create diagnosis session |
| GET | `/api/diagnosis/:id` | Get diagnosis details |
| POST | `/api/diagnosis/:id/report` | Generate or download report |

---

# Dashboard

| Method | Endpoint | Purpose |
|---------|----------|---------|
| GET | `/api/dashboard` | Dashboard summary |

---

# Authorization

| Endpoint Group | Admin | Doctor |
|----------------|:----:|:------:|
| Authentication | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Doctor Management | ✅ | ❌ |
| Patients | ❌ | ✅ |
| Diagnosis | ❌ | ✅ |

---

# General Rules

- All endpoints return JSON except PDF downloads.
- All requests are validated on the server.
- Business logic lives inside domain services.
- Route Handlers act only as controllers.
- Route Handlers never communicate directly with the frontend state.
