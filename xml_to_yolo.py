import os
import xml.etree.ElementTree as ET
from tqdm import tqdm

def convert_xml_to_yolo(xml_file, img_width, img_height):
    """
    Convert XML annotation to YOLO format.
    
    Args:
        xml_file: Path to XML file
        img_width: Image width
        img_height: Image height
    
    Returns:
        List of YOLO format strings
    """
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    yolo_annotations = []
    
    for obj in root.findall('object'):
        # Get class name
        class_name = obj.find('name').text
        
        # Map class names to indices (adjust based on your dataset)
        class_mapping = {
            'healthy': 0,
            'unhealthy': 1,
            'damage': 1,
            'pest': 1
        }
        
        # Try to find the class in mapping, default to 1 (unhealthy) if not found
        class_id = class_mapping.get(class_name.lower(), 1)
        
        # Get bounding box
        bbox = obj.find('bndbox')
        xmin = float(bbox.find('xmin').text)
        ymin = float(bbox.find('ymin').text)
        xmax = float(bbox.find('xmax').text)
        ymax = float(bbox.find('ymax').text)
        
        # Convert to YOLO format (normalized center coordinates and dimensions)
        x_center = (xmin + xmax) / 2.0 / img_width
        y_center = (ymin + ymax) / 2.0 / img_height
        width = (xmax - xmin) / img_width
        height = (ymax - ymin) / img_height
        
        yolo_annotations.append(f"{class_id} {x_center:.6f} {y_center:.6f} {width:.6f} {height:.6f}")
    
    return yolo_annotations


def get_image_dimensions(img_path):
    """
    Get image dimensions using OpenCV.
    """
    import cv2
    img = cv2.imread(img_path)
    if img is not None:
        return img.shape[1], img.shape[0]  # width, height
    return None, None


def convert_dataset_xml_to_yolo(xml_dir, img_dir, output_dir):
    """
    Convert all XML files in a directory to YOLO format.
    
    Args:
        xml_dir: Directory containing XML files
        img_dir: Directory containing corresponding images
        output_dir: Directory to save YOLO format labels
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
    
    xml_files = [f for f in os.listdir(xml_dir) if f.endswith('.xml')]
    
    print(f"Converting {len(xml_files)} XML files to YOLO format...")
    
    for xml_file in tqdm(xml_files, desc="Converting annotations"):
        xml_path = os.path.join(xml_dir, xml_file)
        
        # Find corresponding image
        base_name = os.path.splitext(xml_file)[0]
        img_path = None
        
        for ext in ['.JPG', '.jpg', '.jpeg', '.png', '.PNG']:
            potential_path = os.path.join(img_dir, base_name + ext)
            if os.path.exists(potential_path):
                img_path = potential_path
                break
        
        if img_path is None:
            print(f"Warning: No image found for {xml_file}")
            continue
        
        # Get image dimensions
        img_width, img_height = get_image_dimensions(img_path)
        if img_width is None:
            print(f"Warning: Could not read image {img_path}")
            continue
        
        # Convert XML to YOLO
        yolo_annotations = convert_xml_to_yolo(xml_path, img_width, img_height)
        
        # Save YOLO format file
        yolo_file = os.path.join(output_dir, base_name + '.txt')
        with open(yolo_file, 'w') as f:
            for annotation in yolo_annotations:
                f.write(annotation + '\n')
    
    print(f"Conversion complete! YOLO labels saved to {output_dir}")


if __name__ == '__main__':
    # Configuration
    xml_dir = "datasets/pdt_raw/PDT dataset/PDT dataset/LH/Annotations"
    img_dir = "datasets/pdt_raw/PDT dataset/PDT dataset/LH/images"
    output_dir = "datasets/pdt_raw/PDT dataset/PDT dataset/LH/labels"
    
    print("=" * 60)
    print("XML to YOLO Converter")
    print("=" * 60)
    print(f"XML source: {xml_dir}")
    print(f"Image source: {img_dir}")
    print(f"YOLO output: {output_dir}")
    print("=" * 60)
    
    # Convert annotations
    convert_dataset_xml_to_yolo(xml_dir, img_dir, output_dir)
    
    print("\nConversion completed successfully!")
