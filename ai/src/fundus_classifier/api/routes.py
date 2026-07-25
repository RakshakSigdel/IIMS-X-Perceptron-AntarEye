from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
from PIL import Image
import cv2

from src.fundus_classifier.api.schemas import PredictionResponse, HealthResponse
from src.fundus_classifier.services.inference import model_service
from src.fundus_classifier.services.report_generator import report_generator
from src.fundus_classifier.config import HEATMAP_DIR
from src.fundus_classifier.preprocessing.pipeline import preprocess

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="ok", model_loaded=(model_service.model is not None))


import base64
from io import BytesIO


@router.post("/predict", response_model=PredictionResponse)
async def predict_endpoint(image: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/jpg", "image/png"]

    print(image.content_type)

    if image.content_type not in allowed_types:
        raise HTTPException(status_code=415, detail="Unsupported file type.")

    MAX_SIZE = 10 * 1024 * 1024
    image.file.seek(0, 2)
    file_size = image.file.tell()
    image.file.seek(0)
    if file_size > MAX_SIZE:
        raise HTTPException(
            status_code=400, detail="Invalid image. File size exceeds 10 MB limit."
        )

    temp_path = f"temp_{image.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        try:
            original_img = Image.open(temp_path).convert("RGB")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image.")

        try:
            pred_dict, class_name, conf, input_tensor = model_service.run_prediction(
                temp_path
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail="Prediction failed.")

        try:
            report = report_generator.generate_report(class_name, conf)
        except Exception:
            report = "LLM recommendation unavailable"

        heatmap_base64 = None
        try:
            heatmap = model_service.run_gradcam(input_tensor, original_img)
            if heatmap is not None:
                heatmap_pil = Image.fromarray(heatmap)
                buffered = BytesIO()
                heatmap_pil.save(buffered, format="PNG")
                heatmap_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        except Exception:
            pass

        return PredictionResponse(
            prediction=pred_dict,
            predicted_class=class_name,
            confidence=conf,
            heatmap=heatmap_base64,
            llm_patient_recommendation=report,
            llm_doctor_recommendation=report,
        )

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
