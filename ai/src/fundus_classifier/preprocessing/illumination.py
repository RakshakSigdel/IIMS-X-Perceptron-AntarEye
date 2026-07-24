import cv2
import numpy as np

def correct_illumination(img):
    """
    Corrects the illumination of a fundus image by subtracting the background
    estimated using a median filter or gaussian blur.
    """
    # Using Gaussian blur to estimate the background illumination
    bg = cv2.GaussianBlur(img, (0, 0), 10)
    
    # Add weighted combination of image and background (scale up for brightness)
    result = cv2.addWeighted(img, 4, bg, -4, 128)
    
    return result
