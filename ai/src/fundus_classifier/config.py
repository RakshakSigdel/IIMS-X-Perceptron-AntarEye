import os

# Base paths
DATA_ROOT = os.getenv("DATA_ROOT", "dataset")
CHECKPOINT_DIR = os.getenv("CHECKPOINT_DIR", "checkpoints")
HEATMAP_DIR = os.getenv("HEATMAP_DIR", "heatmaps")

# Model configurations
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 4
LEARNING_RATE = 1e-4
NUM_CLASSES = 3
DEVICE = "cuda"

# Early Stopping
PATIENCE = 2
MIN_DELTA = 1e-4

# Classes
CLASSES = {
    0: "Normal",
    1: "Hypertensive Retinopathy",
    2: "Glaucoma"
}
