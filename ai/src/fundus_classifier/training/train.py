import os
import argparse
import logging
import csv
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split

from src.fundus_classifier.dataset import TransformWrapper
from src.fundus_classifier.folder_dataset import FolderDataset
from src.fundus_classifier.transforms import get_transforms
from src.fundus_classifier.model import get_model
from src.fundus_classifier.utils import AverageMeter, calculate_accuracy, compute_class_weights
from src.fundus_classifier.early_stopping import EarlyStopping
import src.fundus_classifier.config as cfg
from src.fundus_classifier.config import (
    DATA_ROOT, IMG_SIZE, BATCH_SIZE, EPOCHS, LEARNING_RATE,
    NUM_CLASSES, PATIENCE, MIN_DELTA
)

def setup_experiment(base_dir="runs"):
    os.makedirs(base_dir, exist_ok=True)
    existing = [d for d in os.listdir(base_dir) if d.startswith("experiment_")]
    exp_nums = [int(d.split("_")[1]) for d in existing if len(d.split("_")) > 1 and d.split("_")[1].isdigit()]
    next_num = max(exp_nums) + 1 if exp_nums else 1
    exp_dir = os.path.join(base_dir, f"experiment_{next_num:03d}")
    os.makedirs(exp_dir)
    return exp_dir

def train_one_epoch(train_loader, model, criterion, optimizer, epoch, device):
    model.train()
    losses, top1 = AverageMeter(), AverageMeter()
    
    for i, (images, target) in enumerate(train_loader):
        images, target = images.to(device), target.to(device)
        
        output = model(images)
        loss = criterion(output, target)
        
        acc = calculate_accuracy(output, target)
        losses.update(loss.item(), images.size(0))
        top1.update(acc, images.size(0))
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        if i % 10 == 0:
            logging.info(f'Epoch: [{epoch}][{i}/{len(train_loader)}]\tLoss {losses.val:.4f} ({losses.avg:.4f})\tAccuracy {top1.val:.3f} ({top1.avg:.3f})')
            
    return top1.avg, losses.avg

def validate(val_loader, model, criterion, device):
    model.eval()
    losses, top1 = AverageMeter(), AverageMeter()
    
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for images, target in val_loader:
            images, target = images.to(device), target.to(device)
            output = model(images)
            loss = criterion(output, target)
            
            acc = calculate_accuracy(output, target)
            losses.update(loss.item(), images.size(0))
            top1.update(acc, images.size(0))
            
            _, pred = torch.max(output, 1)
            all_preds.extend(pred.cpu().numpy())
            all_labels.extend(target.cpu().numpy())
            
    logging.info(f' * Validation Accuracy {top1.avg:.3f}  Loss {losses.avg:.4f}')
    
    try:
        from sklearn.metrics import confusion_matrix, classification_report
        cm = confusion_matrix(all_labels, all_preds)
        logging.info("Confusion Matrix:")
        logging.info(f"\n{cm}")
        
        report = classification_report(all_labels, all_preds, digits=4)
        logging.info("Classification Report (Precision, Recall, F1-score):")
        logging.info(f"\n{report}")
    except ImportError:
        logging.info("sklearn not installed, skipping confusion matrix and metrics.")
        
    return top1.avg, losses.avg

def main():
    parser = argparse.ArgumentParser(description='PyTorch Fundus Training')
    parser.add_argument('--data-root', type=str, default=DATA_ROOT, help='Path to folder dataset')
    args = parser.parse_args()

    exp_dir = setup_experiment()
    
    log_file = os.path.join(exp_dir, "train.log")
    logging.basicConfig(level=logging.INFO, 
                        format='%(message)s',
                        handlers=[logging.FileHandler(log_file), logging.StreamHandler()])
    
    config_dict = {k: v for k, v in vars(cfg).items() if not k.startswith("__") and not callable(v) and not str(type(v)) == "<class 'module'>"}
    with open(os.path.join(exp_dir, "config.yaml"), "w") as f:
        for k, v in config_dict.items():
            f.write(f"{k}: {v}\n")
            
    csv_file = os.path.join(exp_dir, "metrics.csv")
    with open(csv_file, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["epoch", "train_loss", "train_acc", "val_loss", "val_acc"])

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    logging.info(f"Using device: {device}")
    logging.info(f"Experiment directory: {exp_dir}")

    # Dataset Setup
    train_dir, val_dir = os.path.join(args.data_root, 'train'), os.path.join(args.data_root, 'val')
    if os.path.exists(train_dir) and os.path.exists(val_dir):
        num_classes = FolderDataset.get_num_classes(train_dir)
        train_dataset = FolderDataset(train_dir, transform=get_transforms(train=True, img_size=IMG_SIZE))
        val_dataset = FolderDataset(val_dir, transform=get_transforms(train=False, img_size=IMG_SIZE))
    else:
        num_classes = FolderDataset.get_num_classes(args.data_root)
        full_dataset = FolderDataset(args.data_root)
        train_size = int(0.8 * len(full_dataset))
        train_sub, val_sub = random_split(full_dataset, [train_size, len(full_dataset) - train_size], generator=torch.Generator().manual_seed(42))
        train_dataset = TransformWrapper(train_sub, transform=get_transforms(train=True, img_size=IMG_SIZE))
        val_dataset = TransformWrapper(val_sub, transform=get_transforms(train=False, img_size=IMG_SIZE))

    logging.info(f"Train size: {len(train_dataset)}")
    logging.info(f"Val size: {len(val_dataset)}")

    # DataLoaders & Model
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4, pin_memory=True)

    model = get_model(num_classes=num_classes).to(device)
    
    # Loss, Optimizer & Early Stopping
    class_weights = compute_class_weights(train_dataset, num_classes).to(device)
    train_criterion = nn.CrossEntropyLoss(weight=class_weights)
    val_criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=LEARNING_RATE)
    early_stopping = EarlyStopping(patience=PATIENCE, min_delta=MIN_DELTA, verbose=True)

    # Training Loop
    best_val_loss = float('inf')
    for epoch in range(EPOCHS):
        train_acc, train_loss = train_one_epoch(train_loader, model, train_criterion, optimizer, epoch, device)
        val_acc, val_loss = validate(val_loader, model, val_criterion, device)
        
        with open(csv_file, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([epoch + 1, train_loss, train_acc, val_loss, val_acc])

        is_best = early_stopping(val_loss, model)
        if is_best:
            best_val_loss = val_loss
            logging.info(f'  -> New best model (val_loss={val_loss:.4f}). Saving checkpoint.')
            torch.save(model.state_dict(), os.path.join(exp_dir, "model_best.pth"))

        if early_stopping.early_stop:
            logging.info(f'Early stopping triggered after {epoch + 1} epochs.')
            break

    early_stopping.load_best_weights(model)
    logging.info(f'Training complete. Best validation loss: {best_val_loss:.4f}')

if __name__ == '__main__':
    main()
