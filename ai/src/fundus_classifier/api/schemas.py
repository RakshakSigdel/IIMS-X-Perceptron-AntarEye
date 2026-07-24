from pydantic import BaseModel
from typing import Dict, Optional

class PredictionResponse(BaseModel):
    prediction: Dict[str, float]
    predicted_class: str
    confidence: float
    heatmap: Optional[str] = None
    llm_patient_recommendation: Optional[str] = None
    llm_doctor_recommendation: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
