import torch
import os
from PIL import Image

from src.fundus_classifier.inference.predict import load_trained_model, predict, generate_gradcam
from src.fundus_classifier.config import EXPERIMENT_CHECKPOINT

class ModelService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        checkpoint_path = EXPERIMENT_CHECKPOINT
        if os.path.exists(checkpoint_path):
            self.model = load_trained_model(checkpoint_path, self.device)
            print("Model loaded successfully.")
        else:
            self.model = None
            print(f"Warning: No checkpoint found at {checkpoint_path}. Inference won't work.")
            
    def run_prediction(self, image_path):
        if self.model is None:
            raise RuntimeError("Model is not loaded.")
        pred_dict, class_name, conf, input_tensor = predict(image_path, self.model, self.device)
        return pred_dict, class_name, conf, input_tensor

    def run_gradcam(self, input_tensor, original_image, target_class=None):
        if self.model is None:
            raise RuntimeError("Model is not loaded.")
        return generate_gradcam(self.model, input_tensor, original_image, target_class)

model_service = ModelService()
