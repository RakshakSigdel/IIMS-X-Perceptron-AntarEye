import os
from collections import defaultdict
import re

dataset_dir = 'dataset'
folders = ['dr', 'glaucoma', 'hr']

for folder in folders:
    folder_path = os.path.join(dataset_dir, folder)
    if not os.path.exists(folder_path):
        continue
    
    files = os.listdir(folder_path)
    
    # group by base name (removing extensions and extra suffixes like _1, _aug)
    groups = defaultdict(list)
    for f in files:
        if not f.endswith(('.jpg', '.png', '.jpeg')):
            continue
            
        name = os.path.splitext(f)[0]
        
        # Example: IDRiD_001_1 -> IDRiD_001
        # Match base pattern and trailing numbers/underscores
        # Let's try to strip trailing non-digits or extra underscores
        # Actually, let's just group by the prefix before the last underscore if it looks like a suffix
        base_name = re.sub(r'(_+\d*|_+[a-zA-Z]+)$', '', name)
        
        groups[base_name].append(f)
        
    print(f"\n--- Folder: {folder} ({len(files)} files) ---")
    
    duplicates = {k: v for k, v in groups.items() if len(v) > 1}
    if duplicates:
        print(f"Found {len(duplicates)} potential base names with multiple files:")
        count = 0
        for k, v in duplicates.items():
            print(f"  {k} -> {v}")
            count += 1
            if count > 10:
                print("  ...")
                break
    else:
        print("No obvious filename pattern duplicates found (based on stripping trailing _ suffixes).")

    # Let's also check for exact duplicates just in case
    print("Checking if any prefix occurs multiple times simply:")
    prefixes = defaultdict(list)
    for f in files:
        # split by first underscore if exists
        parts = f.split('_')
        if len(parts) >= 2:
            prefix = parts[0] + '_' + parts[1].split('.')[0]
            prefixes[prefix].append(f)
            
    dup_prefixes = {k: v for k, v in prefixes.items() if len(v) > 1}
    if dup_prefixes:
        print(f"Found {len(dup_prefixes)} potential base IDs with multiple files (e.g. left/right eyes?):")
        count = 0
        for k, v in dup_prefixes.items():
            print(f"  {k} -> {v}")
            count += 1
            if count > 10:
                print("  ...")
                break
    else:
         print("No duplicated base IDs found by strict ID matching.")
