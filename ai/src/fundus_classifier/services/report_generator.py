import os
import torch
import sys

# Add the src directory to the path so we can import biogpt_model
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from biogpt_model import load_model

class ReportGenerator:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ReportGenerator, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        try:
            self.model, self.tokenizer = load_model()
            print(f"BioGPT loaded successfully on {self.device}.")
        except Exception as e:
            self.model = None
            self.tokenizer = None
            print(f"Failed to load BioGPT: {e}")

    def generate_report(self, diagnosis_class: str, confidence: float) -> str:
        if self.model is None or self.tokenizer is None:
            return f"Patient diagnosis indicates {diagnosis_class} (Confidence: {confidence:.2f}). (BioGPT not available)"

        prompt = f"The patient's fundus image shows signs of {diagnosis_class}. The recommended treatment is"
        try:
            inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
            with torch.no_grad():
                generated_ids = self.model.generate(**inputs, max_length=50)
            generated_text = self.tokenizer.decode(generated_ids[0], skip_special_tokens=True)
            return generated_text
        except Exception as e:
            return f"Failed to generate report: {e}"


report_generator = ReportGenerator()

