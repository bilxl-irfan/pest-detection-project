import os
import random
import shutil

"""
Auto-split YOLO dataset into train/val/test folders
Adapted for Linux compatibility with proper path handling
"""


def create_directory_structure(root_path, splits=['train', 'val', 'test']):
    """
    Create the YOLO directory structure.
    
    Args:
        root_path: Root directory for the dataset
        splits: List of split names (default: ['train', 'val', 'test'])
    """
    for split in splits:
        for data_type in ['images', 'labels']:
            dir_path = os.path.join(root_path, split, data_type)
            os.makedirs(dir_path, exist_ok=True)
    print(f"Created directory structure in {root_path}")


def get_file_lists(source_dir):
    """
    Get lists of image and label files from source directory.
    
    Args:
        source_dir: Directory containing images and labels subdirectories
    
    Returns:
        Tuple of (image_files, label_files)
    """
    images_dir = os.path.join(source_dir, 'images')
    labels_dir = os.path.join(source_dir, 'labels')
    
    if not os.path.exists(images_dir):
        raise FileNotFoundError(f"Images directory not found: {images_dir}")
    if not os.path.exists(labels_dir):
        raise FileNotFoundError(f"Labels directory not found: {labels_dir}")
    
    # Get all image files
    image_files = [f for f in os.listdir(images_dir) 
                   if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    # Get all label files
    label_files = [f for f in os.listdir(labels_dir) 
                   if f.endswith('.txt')]
    
    print(f"Found {len(image_files)} images and {len(label_files)} labels")
    
    return image_files, label_files


def match_images_and_labels(image_files, label_files):
    """
    Match image files with their corresponding label files.
    
    Args:
        image_files: List of image filenames
        label_files: List of label filenames
    
    Returns:
        List of (image_file, label_file) tuples for matched pairs
    """
    matched_pairs = []
    
    # Create a set of label basenames for quick lookup
    label_basenames = {os.path.splitext(f)[0]: f for f in label_files}
    
    for img_file in image_files:
        img_basename = os.path.splitext(img_file)[0]
        
        if img_basename in label_basenames:
            matched_pairs.append((img_file, label_basenames[img_basename]))
        else:
            print(f"Warning: No label found for image {img_file}")
    
    print(f"Matched {len(matched_pairs)} image-label pairs")
    return matched_pairs


def split_dataset(matched_pairs, train_ratio=0.7, val_ratio=0.2, test_ratio=0.1):
    """
    Split matched pairs into train/val/test sets.
    
    Args:
        matched_pairs: List of (image_file, label_file) tuples
        train_ratio: Proportion for training set (default 0.7)
        val_ratio: Proportion for validation set (default 0.2)
        test_ratio: Proportion for test set (default 0.1)
    
    Returns:
        Dictionary with 'train', 'val', 'test' keys containing lists of pairs
    """
    # Shuffle the pairs
    random.shuffle(matched_pairs)
    
    total = len(matched_pairs)
    train_end = int(total * train_ratio)
    val_end = train_end + int(total * val_ratio)
    
    splits = {
        'train': matched_pairs[:train_end],
        'val': matched_pairs[train_end:val_end],
        'test': matched_pairs[val_end:]
    }
    
    print(f"\nDataset split:")
    print(f"  Train: {len(splits['train'])} pairs ({len(splits['train'])/total*100:.1f}%)")
    print(f"  Val:   {len(splits['val'])} pairs ({len(splits['val'])/total*100:.1f}%)")
    print(f"  Test:  {len(splits['test'])} pairs ({len(splits['test'])/total*100:.1f}%)")
    
    return splits


def copy_files(source_dir, dest_dir, splits):
    """
    Copy files to their respective train/val/test directories.
    
    Args:
        source_dir: Source directory containing images and labels
        dest_dir: Destination directory for organized dataset
        splits: Dictionary with split names and their file pairs
    """
    images_source = os.path.join(source_dir, 'images')
    labels_source = os.path.join(source_dir, 'labels')
    
    for split_name, pairs in splits.items():
        print(f"\nCopying {split_name} set...")
        
        images_dest = os.path.join(dest_dir, split_name, 'images')
        labels_dest = os.path.join(dest_dir, split_name, 'labels')
        
        for img_file, label_file in pairs:
            # Copy image
            src_img = os.path.join(images_source, img_file)
            dst_img = os.path.join(images_dest, img_file)
            shutil.copy2(src_img, dst_img)
            
            # Copy label
            src_label = os.path.join(labels_source, label_file)
            dst_label = os.path.join(labels_dest, label_file)
            shutil.copy2(src_label, dst_label)
        
        print(f"  Copied {len(pairs)} pairs to {split_name}")


def verify_split(dest_dir):
    """
    Verify the split by counting files in each directory.
    
    Args:
        dest_dir: Destination directory to verify
    """
    print("\n" + "=" * 60)
    print("Verification:")
    print("=" * 60)
    
    for split in ['train', 'val', 'test']:
        images_dir = os.path.join(dest_dir, split, 'images')
        labels_dir = os.path.join(dest_dir, split, 'labels')
        
        num_images = len([f for f in os.listdir(images_dir) 
                         if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
        num_labels = len([f for f in os.listdir(labels_dir) 
                         if f.endswith('.txt')])
        
        print(f"{split.capitalize():5s}: {num_images} images, {num_labels} labels")


def main():
    """
    Main function to execute the dataset splitting process.
    """
    # Configuration - UPDATE THESE PATHS
    source_dir = "datasets/pdt_tiled"  # Where your tiled images and labels are
    dest_dir = "datasets/pdt_final"     # Where the split dataset will go
    
    # Split ratios (must sum to 1.0)
    train_ratio = 0.7
    val_ratio = 0.2
    test_ratio = 0.1
    
    # Set random seed for reproducibility
    random.seed(42)
    
    print("=" * 60)
    print("YOLO Dataset Auto-Split Script")
    print("=" * 60)
    print(f"Source: {source_dir}")
    print(f"Destination: {dest_dir}")
    print(f"Split ratios - Train: {train_ratio}, Val: {val_ratio}, Test: {test_ratio}")
    print("=" * 60)
    
    # Step 1: Create directory structure
    print("\n[1/5] Creating directory structure...")
    create_directory_structure(dest_dir)
    
    # Step 2: Get file lists
    print("\n[2/5] Scanning source directory...")
    image_files, label_files = get_file_lists(source_dir)
    
    # Step 3: Match images and labels
    print("\n[3/5] Matching images with labels...")
    matched_pairs = match_images_and_labels(image_files, label_files)
    
    if len(matched_pairs) == 0:
        print("Error: No matched image-label pairs found!")
        return
    
    # Step 4: Split dataset
    print("\n[4/5] Splitting dataset...")
    splits = split_dataset(matched_pairs, train_ratio, val_ratio, test_ratio)
    
    # Step 5: Copy files
    print("\n[5/5] Copying files to destination...")
    copy_files(source_dir, dest_dir, splits)
    
    # Verify the split
    verify_split(dest_dir)
    
    print("\n" + "=" * 60)
    print("Dataset split complete!")
    print(f"Output directory: {dest_dir}")
    print("=" * 60)


if __name__ == '__main__':
    main()
