import cv2
import numpy as np

def correct_illumination(img):
    bg = cv2.GaussianBlur(img, (0, 0), 10)
    result = cv2.addWeighted(img, 4, bg, -4, 128)
    return result
