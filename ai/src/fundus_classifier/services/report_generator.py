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
            return f"Patient diagnosis indicates {diagnosis_class} (Confidence: {confidence:.2f}). (Gemini not available)"

        prompt = (
            f"Generate a detailed clinical report for a patient with a fundus eye examination.\n"
            f"Diagnosis: {diagnosis_class}\n"
            f"Confidence: {confidence:.2f}\n\n"
            f"Provide a professional medical report including:\n"
            f"- Summary of findings\n"
            f"- Clinical assessment\n"
            f"- Recommended next steps or treatment options\n"
            f"- Follow-up recommendations"
        )
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            return response.text
        except Exception as e:
            return f"Failed to generate report: {e}"


report_generator = ReportGenerator()
