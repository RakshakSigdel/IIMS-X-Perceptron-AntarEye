import torch
import os

class AverageMeter(object):
    """Computes and stores the average and current value"""
    def __init__(self):
        self.reset()

    def reset(self):
        self.val = 0
        self.avg = 0
        self.sum = 0
        self.count = 0

    def update(self, val, n=1):
        self.val = val
        self.sum += val * n
        self.count += n
        self.avg = self.sum / self.count

def calculate_accuracy(output, target):
    """Computes the accuracy for classification"""
    with torch.no_grad():
        _, pred = torch.max(output, 1)
        correct = (pred == target).sum().item()
        return correct / target.size(0)

def save_checkpoint(state, is_best, filename="checkpoint.pth.tar", checkpoint_dir="checkpoints"):
    if not os.path.exists(checkpoint_dir):
        os.makedirs(checkpoint_dir)
    
    filepath = os.path.join(checkpoint_dir, filename)
    torch.save(state, filepath)
    
    if is_best:
        best_filepath = os.path.join(checkpoint_dir, "model_best.pth.tar")
        import shutil
        shutil.copyfile(filepath, best_filepath)

def load_checkpoint(filepath, model, optimizer=None):
    if not os.path.isfile(filepath):
        raise FileNotFoundError(f"No checkpoint found at '{filepath}'")
    
    checkpoint = torch.load(filepath, map_location="cpu")
    
    if "state_dict" in checkpoint:
        model.load_state_dict(checkpoint["state_dict"])
        if optimizer and "optimizer" in checkpoint:
            optimizer.load_state_dict(checkpoint["optimizer"])
        return model, optimizer, checkpoint.get("epoch", 0), checkpoint.get("best_val_acc", 0.0)
    else:
        model.load_state_dict(checkpoint)
        return model, optimizer, 0, 0.0

def compute_class_weights(train_dataset, num_classes):
    import numpy as np
    labels = []
    
    if hasattr(train_dataset, 'image_folder'): # FolderDataset
        labels = train_dataset.image_folder.targets
    elif hasattr(train_dataset, 'subset'): # TransformWrapper wrapping a Subset
        subset = train_dataset.subset
        if hasattr(subset.dataset, 'image_folder'):
            all_targets = subset.dataset.image_folder.targets
            labels = [all_targets[i] for i in subset.indices]
        else:
            for i in range(len(train_dataset)):
                _, label = train_dataset[i]
                labels.append(label)
    else:
        for i in range(len(train_dataset)):
            _, label = train_dataset[i]
            labels.append(label)
            
    labels = np.array(labels)
    class_counts = np.bincount(labels, minlength=num_classes)
    total = len(labels)
    weights = total / (num_classes * class_counts.astype(np.float64))
    return torch.tensor(weights, dtype=torch.float32)
