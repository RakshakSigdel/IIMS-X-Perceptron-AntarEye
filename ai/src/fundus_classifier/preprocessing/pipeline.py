import cv2
import numpy as np
from PIL import Image
from .crop import circular_crop
from .illumination import correct_illumination
from .clahe import apply_clahe
from .quality import is_blurry

def preprocess(image: Image.Image) -> Image.Image:
    """
    Full preprocessing pipeline for a fundus image.
    Expects a PIL Image and returns a PIL Image.
    """
    # Convert PIL to OpenCV format (RGB)
    img_np = np.array(image)
    
    # Downscale huge images to max 1024px to prevent OOM
    h, w = img_np.shape[:2]
    max_dim = 1024
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        new_w, new_h = int(w * scale), int(h * scale)
        img_np = cv2.resize(img_np, (new_w, new_h), interpolation=cv2.INTER_AREA)

    
    # 1. Circular Crop
    img_cropped = circular_crop(img_np)
    
    # 2. Illumination Correction
    img_illum = correct_illumination(img_cropped)
    
    # 3. CLAHE
    img_clahe = apply_clahe(img_illum)
    
    # Convert back to PIL
    return Image.fromarray(img_clahe)
