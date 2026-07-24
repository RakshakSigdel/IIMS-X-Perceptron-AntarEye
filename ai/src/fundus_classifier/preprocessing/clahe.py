import cv2
import numpy as np

def apply_clahe(img):
    """
    Applies Contrast Limited Adaptive Histogram Equalization (CLAHE) 
    to the L channel of the LAB color space.
    """
    # Convert image to LAB color model
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
    
    # Split into L, A, B channels
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE to L channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    
    # Merge the CLAHE enhanced L channel back with A and B channels
    limg = cv2.merge((cl, a, b))
    
    # Convert back to RGB color model
    final = cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)
    return final
