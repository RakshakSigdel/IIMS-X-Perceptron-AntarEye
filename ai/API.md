# Fundus Classifier API

Base URL: `http://localhost:8000`

---

## `GET /health`

Check if the service is running and the model is loaded.

### Response

```json
{
  "status": "ok",
  "model_loaded": true
}
```

| Field          | Type     | Description                          |
|----------------|----------|--------------------------------------|
| `status`       | `string` | Always `"ok"` if the server is alive |
| `model_loaded` | `bool`   | Whether the model checkpoint was found and loaded |

---

## `POST /predict`

Run inference on a fundus image.

### Request

- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

| Parameter          | Type   | Required | Default | Description                                      |
|--------------------|--------|----------|---------|--------------------------------------------------|
| `file`             | `file` | yes      | —       | Fundus image (JPEG/PNG). Internally preprocessed with circular crop → illumination correction → CLAHE → resize → normalize |
| `generate_heatmap` | `bool` | no       | `false` | If `true`, generates a GradCAM heatmap and returns its URL |

### Response

```json
{
  "predicted_class": "Glaucoma",
  "confidence": 0.9673,
  "report": "Patient diagnosis indicates Glaucoma (Confidence: 0.97). (BioGPT not available)",
  "gradcam_url": "/static/heatmaps/gradcam_retina.jpg"
}
```

| Field             | Type           | Description                                              |
|-------------------|----------------|----------------------------------------------------------|
| `predicted_class` | `string`       | One of `"Normal"`, `"Hypertensive Retinopathy"`, `"Glaucoma"` |
| `confidence`      | `float`        | Softmax probability of the predicted class (0–1)         |
| `report`          | `string|null`  | Auto-generated medical report (or fallback text if BioGPT unavailable) |
| `gradcam_url`     | `string|null`  | URL to the GradCAM heatmap image (only when `generate_heatmap=true`) |

### Errors

| Status | Body        | Meaning                                    |
|--------|-------------|--------------------------------------------|
| `400`  | `"File must be an image."` | Uploaded file is not an image             |
| `500`  | `{detail}`  | Internal error (e.g. corrupt file, model not loaded) |

---

## Preprocessing Pipeline

Every image passes through these steps before inference:

1. **Circular crop** — removes black background borders
2. **Illumination correction** — Gaussian blur background subtraction with brightness scaling
3. **CLAHE** — contrast-limited adaptive histogram equalization on the LAB L-channel
4. **Resize** — bilinear interpolation to 224×224
5. **Normalize** — ImageNet mean/std `([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])`
