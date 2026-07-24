import cv2

def is_blurry(img, threshold=100.0):
    """
    Compute the variance of the Laplacian to determine if the image is blurry.
    """
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    return variance < threshold
