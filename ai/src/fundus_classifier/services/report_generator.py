import json
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from gemini_model import load_model


class ReportGenerator:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ReportGenerator, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.model_name = "gemini-2.5-flash"
        try:
            self.client = load_model()
            print(f"Gemini model {self.model_name} loaded successfully.")
        except Exception as e:
            self.client = None
            print(f"Failed to load Gemini model: {e}")

    def generate_report(self, diagnosis_class: str, confidence: float) -> str:
        if self.client is None:
            return json.dumps({
                "doctor": f"Patient diagnosis indicates {diagnosis_class} (Confidence: {confidence:.2f}). (Gemini not available)",
                "patient": f"Your eye examination suggests {diagnosis_class}. Please consult your ophthalmologist for further evaluation. (Gemini not available)"
            })

        prompt = (
            f"You are a clinical decision support assistant for AntarEye, an AI-assisted retinal disease screening platform used by ophthalmologists. Based on the retinal fundus image analysis results provided below, generate two clinical recommendation paragraphs.\n\n"
            f"ANALYSIS RESULTS:\n"
            f"- Predicted condition: {diagnosis_class}\n"
            f"- Model confidence: {confidence * 100:.1f}%\n"
            f"- Class probabilities: Normal={0.0:.1f}%, Diabetic Retinopathy={0.0:.1f}%, Glaucoma={0.0:.1f}%\n\n"
            f"RECOMMENDATION GUIDELINES:\n\n"
            f"DOCTOR RECOMMENDATION:\n"
            f"Write exactly 2 to 3 complete sentences addressed to the attending ophthalmologist. Use professional clinical terminology. Cover: suggested follow-up examinations or imaging, differential diagnosis considerations if confidence is below 85%, and any referral or treatment pathway recommendations. Do not exceed 60 words.\n\n"
            f"PATIENT RECOMMENDATION:\n"
            f"Write exactly 2 to 3 complete sentences addressed to the patient. Use simple, non-technical language that a layperson can understand. Cover: importance of follow-up appointments, any relevant lifestyle or dietary guidance for eye health, and reassurance with honest acknowledgment of the findings. Do not exceed 60 words.\n\n"
            f"STRICT FORMATTING RULES:\n"
            f"- Use ONLY *bold* and italic markdown for emphasis. No other formatting.\n"
            f"- Do NOT use bullet points, numbered lists, headings, or code blocks.\n"
            f"- Write in complete sentences only. No fragments.\n"
            f"- Keep tone professional, concise, and empathetic.\n\n"
            f"RESPONSE FORMAT:\n"
            f"Respond with ONLY a valid JSON object. No markdown code fences, no explanation, no preamble:\n"
            f'{{"doctor": "Doctor recommendation paragraph here", "patient": "Patient recommendation paragraph here"}}'
        )
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            return response.text
        except Exception as e:
            return json.dumps({
                "doctor": f"Failed to generate report: {e}",
                "patient": f"Unable to generate your report at this time. Please consult your ophthalmologist directly. (Error: {e})"
            })


report_generator = ReportGenerator()
