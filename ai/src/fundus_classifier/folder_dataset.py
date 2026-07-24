import os
from torch.utils.data import Dataset
from torchvision.datasets import ImageFolder
from PIL import Image


class FolderDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.image_folder = ImageFolder(root=root_dir, transform=transform)
        self.classes = self.image_folder.classes
        self.class_to_idx = self.image_folder.class_to_idx

    def __len__(self):
        return len(self.image_folder)

    def __getitem__(self, idx):
        return self.image_folder[idx]

    @staticmethod
    def get_num_classes(root_dir):
        classes = sorted([
            d for d in os.listdir(root_dir)
            if os.path.isdir(os.path.join(root_dir, d))
        ])
        return len(classes)
