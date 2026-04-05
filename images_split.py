import os
import cv2
from tqdm import tqdm


def get_imgs_pos(img_w, img_h, cut_w, cut_h, w_stride, h_stride):
    """
    Calculate positions for splitting an image into tiles.
    
    Args:
        img_w: Original image width
        img_h: Original image height
        cut_w: Tile width
        cut_h: Tile height
        w_stride: Horizontal stride
        h_stride: Vertical stride
    
    Returns:
        List of (x, y, width, height) tuples for each tile
    """
    pos_list = []
    
    # Calculate number of tiles needed
    w_num = (img_w - cut_w) // w_stride + 1
    h_num = (img_h - cut_h) // h_stride + 1
    
    for i in range(h_num):
        for j in range(w_num):
            x = j * w_stride
            y = i * h_stride
            
            # Ensure we don't go beyond image boundaries
            if x + cut_w > img_w:
                x = img_w - cut_w
            if y + cut_h > img_h:
                y = img_h - cut_h
                
            pos_list.append((x, y, cut_w, cut_h))
    
    return pos_list


def split_images(img_dir, img_save_dir, cut_w=640, cut_h=640, w_stride=640, h_stride=640):
    """
    Split large images into smaller tiles.
    
    Args:
        img_dir: Directory containing source images
        img_save_dir: Directory to save tiled images
        cut_w: Tile width (default 640)
        cut_h: Tile height (default 640)
        w_stride: Horizontal stride (default 640)
        h_stride: Vertical stride (default 640)
    """
    # Create output directory if it doesn't exist
    if not os.path.exists(img_save_dir):
        os.makedirs(img_save_dir, exist_ok=True)
    
    # Get list of image files
    img_list = [f for f in os.listdir(img_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    print(f"Found {len(img_list)} images to process")
    
    # Process each image
    for img_name in tqdm(img_list, desc="Splitting images"):
        img_path = os.path.join(img_dir, img_name)
        
        # Read image
        img = cv2.imread(img_path)
        if img is None:
            print(f"Warning: Could not read {img_name}, skipping...")
            continue
        
        img_h, img_w = img.shape[:2]
        
        # Get tile positions
        pos_list = get_imgs_pos(img_w, img_h, cut_w, cut_h, w_stride, h_stride)
        
        # Extract and save each tile
        base_name = os.path.splitext(img_name)[0]
        for idx, (x, y, w, h) in enumerate(pos_list):
            # Crop tile
            tile = img[y:y+h, x:x+w]
            
            # Save tile with index
            tile_name = f"{base_name}_{idx:04d}.jpg"
            tile_path = os.path.join(img_save_dir, tile_name)
            cv2.imwrite(tile_path, tile)
    
    print(f"Tiling complete! Saved to {img_save_dir}")


def split_labels(label_dir, label_save_dir, img_dir, cut_w=640, cut_h=640, w_stride=640, h_stride=640):
    """
    Split YOLO format labels to match tiled images.
    
    Args:
        label_dir: Directory containing source labels (.txt files)
        label_save_dir: Directory to save tiled labels
        img_dir: Directory containing source images (to get dimensions)
        cut_w: Tile width (default 640)
        cut_h: Tile height (default 640)
        w_stride: Horizontal stride (default 640)
        h_stride: Vertical stride (default 640)
    """
    # Create output directory if it doesn't exist
    if not os.path.exists(label_save_dir):
        os.makedirs(label_save_dir, exist_ok=True)
    
    # Get list of label files
    label_list = [f for f in os.listdir(label_dir) if f.endswith('.txt')]
    
    print(f"Found {len(label_list)} label files to process")
    
    # Process each label file
    for label_name in tqdm(label_list, desc="Splitting labels"):
        label_path = os.path.join(label_dir, label_name)
        
        # Find corresponding image to get dimensions
        base_name = os.path.splitext(label_name)[0]
        img_path = None
        for ext in ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']:
            potential_path = os.path.join(img_dir, base_name + ext)
            if os.path.exists(potential_path):
                img_path = potential_path
                break
        
        if img_path is None:
            print(f"Warning: No image found for {label_name}, skipping...")
            continue
        
        # Get image dimensions
        img = cv2.imread(img_path)
        if img is None:
            print(f"Warning: Could not read image for {label_name}, skipping...")
            continue
        
        img_h, img_w = img.shape[:2]
        
        # Read label file
        with open(label_path, 'r') as f:
            lines = f.readlines()
        
        # Parse annotations (YOLO format: class x_center y_center width height)
        annotations = []
        for line in lines:
            parts = line.strip().split()
            if len(parts) >= 5:
                class_id = int(parts[0])
                x_center = float(parts[1]) * img_w
                y_center = float(parts[2]) * img_h
                width = float(parts[3]) * img_w
                height = float(parts[4]) * img_h
                annotations.append((class_id, x_center, y_center, width, height))
        
        # Get tile positions
        pos_list = get_imgs_pos(img_w, img_h, cut_w, cut_h, w_stride, h_stride)
        
        # Process each tile
        for idx, (tile_x, tile_y, tile_w, tile_h) in enumerate(pos_list):
            tile_annotations = []
            
            # Check which annotations fall within this tile
            for class_id, x_center, y_center, width, height in annotations:
                # Calculate bounding box corners
                x_min = x_center - width / 2
                y_min = y_center - height / 2
                x_max = x_center + width / 2
                y_max = y_center + height / 2
                
                # Check if annotation overlaps with tile
                if (x_max > tile_x and x_min < tile_x + tile_w and
                    y_max > tile_y and y_min < tile_y + tile_h):
                    
                    # Clip to tile boundaries
                    clipped_x_min = max(x_min, tile_x)
                    clipped_y_min = max(y_min, tile_y)
                    clipped_x_max = min(x_max, tile_x + tile_w)
                    clipped_y_max = min(y_max, tile_y + tile_h)
                    
                    # Convert back to YOLO format (relative to tile)
                    new_x_center = ((clipped_x_min + clipped_x_max) / 2 - tile_x) / tile_w
                    new_y_center = ((clipped_y_min + clipped_y_max) / 2 - tile_y) / tile_h
                    new_width = (clipped_x_max - clipped_x_min) / tile_w
                    new_height = (clipped_y_max - clipped_y_min) / tile_h
                    
                    # Only keep if the clipped box is large enough
                    if new_width > 0.01 and new_height > 0.01:
                        tile_annotations.append((class_id, new_x_center, new_y_center, new_width, new_height))
            
            # Save tile label file
            tile_label_name = f"{base_name}_{idx:04d}.txt"
            tile_label_path = os.path.join(label_save_dir, tile_label_name)
            
            with open(tile_label_path, 'w') as f:
                for class_id, x_center, y_center, width, height in tile_annotations:
                    f.write(f"{class_id} {x_center:.6f} {y_center:.6f} {width:.6f} {height:.6f}\n")
    
    print(f"Label tiling complete! Saved to {label_save_dir}")


if __name__ == '__main__':
    # Configuration - UPDATE THESE PATHS
    source_img_dir = "datasets/pdt_raw/PDT dataset/PDT dataset/LH/images"
    source_label_dir = "datasets/pdt_raw/PDT dataset/PDT dataset/LH/labels"
    
    tiled_img_dir = "datasets/pdt_tiled/images"
    tiled_label_dir = "datasets/pdt_tiled/labels"
    
    # Tile size and stride
    tile_size = 640
    stride = 640  # No overlap
    
    print("=" * 60)
    print("PDT Dataset Image and Label Tiling Script")
    print("=" * 60)
    
    # Check if source directories exist
    if not os.path.exists(source_img_dir):
        print(f"Error: Source image directory not found: {source_img_dir}")
        print("Please update the paths in the script or ensure the dataset is downloaded.")
        exit(1)
    
    # Split images
    print("\n[1/2] Processing images...")
    split_images(source_img_dir, tiled_img_dir, tile_size, tile_size, stride, stride)
    
    # Split labels
    if os.path.exists(source_label_dir):
        print("\n[2/2] Processing labels...")
        split_labels(source_label_dir, tiled_label_dir, source_img_dir, tile_size, tile_size, stride, stride)
    else:
        print(f"\nWarning: Label directory not found: {source_label_dir}")
        print("Skipping label processing.")
    
    print("\n" + "=" * 60)
    print("Tiling complete!")
    print(f"Images saved to: {tiled_img_dir}")
    print(f"Labels saved to: {tiled_label_dir}")
    print("=" * 60)
