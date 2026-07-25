from torchvision import transforms
from src.fundus_classifier.preprocessing.pipeline import preprocess


class FundusPreprocess:
    def __call__(self, img):
        return preprocess(img)


def get_transforms(train=True, img_size=224):
    base = [FundusPreprocess(), transforms.Resize((img_size, img_size))]
    if train:
        train_augs = [
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
        ]
        return transforms.Compose(base + train_augs + [
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])
    else:
        return transforms.Compose(base + [
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])
