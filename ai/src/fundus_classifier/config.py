import os

DATA_ROOT = os.getenv("DATA_ROOT", "dataset")
CHECKPOINT_DIR = os.getenv("CHECKPOINT_DIR", "checkpoints")
HEATMAP_DIR = os.getenv("HEATMAP_DIR", "heatmaps")
DATASETS_ROOT = os.getenv("DATASETS_ROOT", "DATASETS")

IMG_SIZE = 224
NUM_CLASSES = 3
DEVICE = "cuda"

BATCH_SIZE = 16
EPOCHS = 15
LEARNING_RATE = 2e-5
WEIGHT_DECAY = 1e-2

LABEL_SMOOTHING = 0.1
PATIENCE = 5
MIN_DELTA = 1e-4

CLASSES = {0: "Diabetic Retinopathy", 1: "Glaucoma", 2: "Hypertensive Retinopathy"}

EXPERIMENT_CHECKPOINT = os.path.join("runs", "experiment_013", "model_best.pth")
