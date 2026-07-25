import json
import os
import random
from PIL import Image
from torch.utils.data import Dataset
import src.fundus_classifier.config as cfg


class CvatDataset(Dataset):
    def __init__(self, datasets_root, transform=None, split="all", val_split=0.2, seed=42):
        idx_to_name = cfg.CLASSES
        name_to_idx = {v: k for k, v in idx_to_name.items()}

        all_samples = []
        for entry_name in os.listdir(datasets_root):
            ann_file = os.path.join(datasets_root, entry_name, "annotations", "default.json")
            img_dir = os.path.join(datasets_root, entry_name, "images", "default")
            if not os.path.exists(ann_file):
                continue
            with open(ann_file, encoding="utf-8") as f:
                data = json.load(f)
            label_name = data["categories"]["label"]["labels"][0]["name"]
            if label_name not in name_to_idx:
                continue
            label = name_to_idx[label_name]
            for item in data["items"]:
                img_path = os.path.join(img_dir, item["image"]["path"])
                if os.path.exists(img_path):
                    all_samples.append((img_path, label))

        rng = random.Random(seed)
        rng.shuffle(all_samples)

        split_idx = int(len(all_samples) * (1 - val_split))
        if split == "train":
            self.samples = all_samples[:split_idx]
        elif split == "val":
            self.samples = all_samples[split_idx:]
        else:
            self.samples = all_samples

        self.targets = [s[1] for s in self.samples]
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, label
