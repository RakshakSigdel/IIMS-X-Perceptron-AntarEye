import torch
import os
import pandas as pd
import matplotlib.pyplot as plt

class AverageMeter(object):
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

def plot_metrics(csv_path, output_path=None, best_epoch=None, early_stop_epoch=None):
    df = pd.read_csv(csv_path)
    epochs = df["epoch"]

    fig, ax1 = plt.subplots(figsize=(10, 6))

    ax1.set_xlabel("Epoch")
    ax1.set_ylabel("Loss", color="tab:blue")
    l1 = ax1.plot(epochs, df["train_loss"], "o-", color="tab:blue", label="Train Loss", linewidth=1.5, markersize=4)
    l2 = ax1.plot(epochs, df["val_loss"], "s--", color="tab:cyan", label="Val Loss", linewidth=1.5, markersize=4)
    ax1.tick_params(axis="y", labelcolor="tab:blue")

    ax2 = ax1.twinx()
    ax2.set_ylabel("Accuracy", color="tab:orange")
    l3 = ax2.plot(epochs, df["train_acc"], "o-", color="tab:orange", label="Train Acc", linewidth=1.5, markersize=4)
    l4 = ax2.plot(epochs, df["val_acc"], "s--", color="tab:red", label="Val Acc", linewidth=1.5, markersize=4)
    ax2.tick_params(axis="y", labelcolor="tab:orange")

    if best_epoch is not None:
        best_val_loss = df.loc[df["epoch"] == best_epoch, "val_loss"].values[0]
        ax1.axvline(x=best_epoch, color="green", linestyle=":", linewidth=1.5, alpha=0.8)
        ax1.annotate(f"Best Model\n(val_loss={best_val_loss:.4f})",
                     xy=(best_epoch, ax1.get_ylim()[1]),
                     xytext=(best_epoch + 0.3, ax1.get_ylim()[1]),
                     fontsize=9, color="green", va="top",
                     arrowprops=dict(arrowstyle="->", color="green", lw=0.8))

    if early_stop_epoch is not None:
        ax1.axvline(x=early_stop_epoch, color="red", linestyle=":", linewidth=1.5, alpha=0.8)
        ax1.annotate(f"Early Stop\n(epoch {early_stop_epoch})",
                     xy=(early_stop_epoch, ax1.get_ylim()[0]),
                     xytext=(early_stop_epoch + 0.3, ax1.get_ylim()[0]),
                     fontsize=9, color="red", va="bottom",
                     arrowprops=dict(arrowstyle="->", color="red", lw=0.8))

    lines = l1 + l2 + l3 + l4
    labels = [l.get_label() for l in lines]
    ax1.legend(lines, labels, loc="best")

    ax1.set_title("Training Progress")
    ax1.grid(True, alpha=0.3)

    fig.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=150, bbox_inches="tight")
        plt.close(fig)
    else:
        plt.show()

def compute_class_weights(train_dataset, num_classes):
    import numpy as np
    labels = []
    
    if hasattr(train_dataset, 'image_folder'):
        labels = train_dataset.image_folder.targets
    elif hasattr(train_dataset, 'targets'):
        labels = train_dataset.targets
    elif hasattr(train_dataset, 'subset'):
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
