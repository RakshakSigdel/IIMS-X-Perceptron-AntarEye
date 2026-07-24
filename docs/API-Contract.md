<!-- markdownlint-disable MD013 MD048 MD024 MD025 MD060 -->
# API Contract

## Purpose

Defines the communication contract between the Next.js Backend-for-Frontend (BFF) and the external FastAPI AI service.

The FastAPI service is responsible only for AI inference.

The Next.js application owns all business logic, persistence, authentication, report generation, and LLM integration.

---

# Responsibilities

## FastAPI

- Accept retinal fundus images.
- Run inference.
- Generate Grad-CAM (heatmap).
- Generate LLM recommendations.
- Return prediction results.

The service must not:

- Authenticate users.
- Access Supabase.
- Generate reports.
- Store application data.

---

## Next.js

- Authenticate users.
- Validate requests.
- Upload images.
- Call FastAPI.
- Persist results.
- Generate reports.

---

# Endpoint

## POST

```text
POST /predict
```

---

# Request

Content-Type

```text
multipart/form-data
```

Fields

| Name | Type | Required |
|------|------|----------|
| image | File | ✅ |

Accepted formats

- jpg
- jpeg
- png

Maximum size

10 MB

---

# Success Response

HTTP

```text
200 OK
```

Body

```json
{
  "prediction": {
    "normal": 0.12,
    "diabetic_retinopathy": 0.81,
    "glaucoma": 0.07
  },
  "predicted_class": "diabetic_retinopathy",
  "confidence": 0.81,
  "heatmap": "<base64_png>",
  "llm_patient_recommendation": "Patient string here",
  "llm_doctor_recommendation": "Doctor string here"
}
```

Rules

- Probabilities must sum to 1.0.
- Confidence equals the highest probability.
- `predicted_class` must match the highest probability.

---

# Error Responses

## Invalid Image

HTTP

```text
400 Bad Request
```

```json
{
  "error": "Invalid image."
}
```

---

## Unsupported Media Type

HTTP

```text
415 Unsupported Media Type
```

```json
{
  "error": "Unsupported file type."
}
```

---

## Inference Failure

HTTP

```text
500 Internal Server Error
```

```json
{
  "error": "Prediction failed."
}
```

---

## Timeout

HTTP

```text
504 Gateway Timeout
```

```json
{
  "error": "Prediction timed out."
}
```

---

# Timeout

30 seconds.

---

# Retry Policy

No automatic retries.

The doctor manually retries the diagnosis if required.

---

# Versioning

Initial version

```text
v1
```

Future versions should preserve backward compatibility whenever practical.

---

# Stability Rules

The following response fields are considered stable:

- prediction
- predicted_class
- confidence
- heatmap
- llm_patient_recommendation
- llm_doctor_recommendation

Breaking changes require coordination between both teams.

---

# Ownership

| Component | Owner |
| ----------- | ------- |
| AI Model | AI Team |
| FastAPI API | AI Team |
| Next.js BFF | Application Team |
| Database | Application Team |
| Reports | Application Team |
| LLM Recommendations | AI Team |
