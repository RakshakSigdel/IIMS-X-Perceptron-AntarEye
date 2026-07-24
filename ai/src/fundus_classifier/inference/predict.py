import argparse
import os
import torch
import cv2
import numpy as np
from PIL import Image

from src.fundus_classifier.model import get_model
from src.fundus_classifier.utils import load_checkpoint
from src.fundus_classifier.transforms import get_transforms
from src.fundus_classifier.config import NUM_CLASSES, CHECKPOINT_DIR, CLASSES

# Attempt to import grad-cam; fails gracefully if not installed yet
try:
    from pytorch_grad_cam import GradCAM
    from pytorch_grad_cam.utils.image import show_cam_on_image
    from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
    HAS_GRADCAM = True
except ImportError:
    HAS_GRADCAM = False

def load_trained_model(checkpoint_path, device):
    model = get_model(num_classes=NUM_CLASSES, pretrained=False)
    model, _, _, _ = load_checkpoint(checkpoint_path, model)
    model = model.to(device)
    model.eval()
    return model

def predict(image_path, model, device):
    image = Image.open(image_path).convert('RGB')
    transform = get_transforms(train=False)
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        output = model(input_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        predicted_class_idx = torch.argmax(probabilities).item()
        
    predicted_class = CLASSES.get(predicted_class_idx, str(predicted_class_idx))
    confidence = probabilities[predicted_class_idx].item()
    
    # Create dict of all probabilities mapped to class names and convert to lowercase with underscores as per contract
    pred_dict = {}
    for i, prob in enumerate(probabilities):
        # Format the class name to match contract e.g. "Diabetic Retinopathy" -> "diabetic_retinopathy", "Normal" -> "normal"
        class_str = CLASSES.get(i, str(i)).lower().replace(" ", "_")
        pred_dict[class_str] = prob.item()
        
    # Format the predicted class to match as well
    predicted_class_formatted = predicted_class.lower().replace(" ", "_")
        
    return pred_dict, predicted_class_formatted, confidence, input_tensor

def generate_gradcam(model, input_tensor, original_image, target_class=None):
    if not HAS_GRADCAM:
        print("pytorch-grad-cam not installed. Cannot generate GradCAM.")
        return None
        
    # Using the last bottleneck layer of ResNet50
    target_layers = [model.layer4[-1]]
    
    with GradCAM(model=model, target_layers=target_layers) as cam:
        targets = [ClassifierOutputTarget(target_class)] if target_class is not None else None
        grayscale_cam = cam(input_tensor=input_tensor, targets=targets)
        
        # In this example grayscale_cam has only one image in the batch
        grayscale_cam = grayscale_cam[0, :]
        
        # Preprocess original image for visualization
        rgb_img = np.float32(original_image.resize((224, 224))) / 255
        
        visualization = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)
        return visualization

def main():
    parser = argparse.ArgumentParser(description='Predict Fundus Image')
    parser.add_argument('image_path', type=str, help='Path to the image to predict')
    parser.add_argument('--checkpoint', type=str, default=os.path.join(CHECKPOINT_DIR, 'model_best.pth.tar'), help='Path to checkpoint')
    parser.add_argument('--gradcam', action='store_true', help='Generate GradCAM heatmap')
    args = parser.parse_args()

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = load_trained_model(args.checkpoint, device)
    
    pred_dict, class_name, conf, input_tensor = predict(args.image_path, model, device)
    print(f"Prediction: {class_name} (Confidence: {conf:.4f})")
    print(f"Probabilities: {pred_dict}")
    
    if args.gradcam and HAS_GRADCAM:
        original_img = Image.open(args.image_path).convert('RGB')
        heatmap = generate_gradcam(model, input_tensor, original_img)
        if heatmap is not None:
            out_path = "heatmap_output.png"
            cv2.imwrite(out_path, cv2.cvtColor(heatmap, cv2.COLOR_RGB2BGR))
            print(f"Saved GradCAM heatmap to {out_path}")

if __name__ == '__main__':
    main()
