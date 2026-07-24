<!-- markdownlint-disable MD013 MD024 MD025 MD060 -->
# Frontend Specification

## Purpose

Defines the application routes, pages, layouts, navigation, and access rules.

---

## Route Groups

```text
(public)
(auth)
(admin)
(doctor)
```

---

## Public

### Landing

Route

```text
/
```

Purpose

- Product introduction
- Login CTA

---

## Authentication

### Login

```text
/login
```

Purpose

- Admin login
- Doctor login

---

## Doctor

### Doctor Dashboard

```text
/doctor
```

Displays

- Statistics
- Recent Diagnoses
- High Priority Patients

---

### Patients

```text
/doctor/patients
```

Displays

- Patient table
- Search
- Filters

Actions

- View
- Create
- Edit
- Archive

---

### New Patient

```text
/doctor/patients/new
```

Purpose

Create patient.

---

### Patient Details

```text
/doctor/patients/[patientId]
```

Displays

- Patient information
- Diagnosis history

Actions

- Start diagnosis
- Edit patient

---

### Edit Patient

```text
/doctor/patients/[patientId]/edit
```

Purpose

Update patient information.

---

### Diagnosis

```text
/doctor/diagnosis/[diagnosisId]
```

Displays

- Uploaded image
- Heatmap
- Disease probabilities
- Overall confidence
- LLM patient recommendation
- LLM doctor recommendation
- Report download

---

## Admin

### Admin Dashboard

```text
/admin
```

Displays

- Doctor count
- Diagnosis count
- Recent activity

---

### Doctors

```text
/admin/doctors
```

Displays

- Doctor list

Actions

- Create
- Edit
- Disable

---

### New Doctor

```text
/admin/doctors/new
```

Purpose

Create doctor account.

---

### Edit Doctor

```text
/admin/doctors/[doctorId]/edit
```

Purpose

Update doctor information.

---

## Shared Pages

### Profile

```text
/profile
```

Purpose

Manage personal profile.

---

## Navigation

### Doctor Navigation

- Dashboard
- Patients

### Admin Navigation

- Dashboard
- Doctors

---

## Layouts

### Public Layout

- Navbar
- Footer

---

### Auth Layout

- Centered authentication card

---

### Doctor Layout

- Sidebar
- Header
- Main Content

---

### Admin Layout

- Sidebar
- Header
- Main Content

---

## Authorization

| Page | Admin | Doctor |
| ------- | :-----: | :------: |
| Landing | ✅ | ✅ |
| Login | ✅ | ✅ |
| Admin Dashboard | ✅ | ❌ |
| Doctors | ✅ | ❌ |
| Doctor Dashboard | ❌ | ✅ |
| Patients | ❌ | ✅ |
| Diagnosis | ❌ | ✅ |
| Profile | ✅ | ✅ |

---

## Design Rules

- Responsive-first
- Accessible
- Consistent spacing
- Theme driven
- Server Components by default
- Client Components only when required
