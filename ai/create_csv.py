import os
import pandas as pd
from sklearn.model_selection import train_test_split
import glob

def main():
    base_dir = 'dataset'
    
    classes = {'dr': 0, 'hr': 1, 'glaucoma': 2}
    
    data = []
    
    for cls_name, label in classes.items():
        cls_dir = os.path.join(base_dir, cls_name)
        if os.path.exists(cls_dir):
            for file_name in os.listdir(cls_dir):
                if file_name.endswith(('.jpg', '.jpeg', '.png')):
                    rel_path = os.path.join(cls_name, file_name).replace('\\', '/')
                    data.append((rel_path, label))
                    
    df = pd.DataFrame(data, columns=['image_id', 'label'])
    
    train_df, val_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df['label'])
    
    train_df.to_csv(os.path.join(base_dir, 'train.csv'), index=False)
    val_df.to_csv(os.path.join(base_dir, 'val.csv'), index=False)
    
    print(f"Created train.csv ({len(train_df)} samples) and val.csv ({len(val_df)} samples)")

if __name__ == '__main__':
    main()
