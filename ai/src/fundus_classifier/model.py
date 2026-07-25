import torch.nn as nn
from torchvision import models


def get_model(num_classes=3, pretrained=True):
    weights = models.MobileNet_V3_Small_Weights.IMAGENET1K_V1 if pretrained else None
    model = models.mobilenet_v3_small(weights=weights)

    for param in model.parameters():
        param.requires_grad = False

    for i in range(len(model.features) - 4, len(model.features)):
        for param in model.features[i].parameters():
            param.requires_grad = True

    in_features = model.classifier[0].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.2),
        nn.Linear(in_features, num_classes),
    )

    return model
