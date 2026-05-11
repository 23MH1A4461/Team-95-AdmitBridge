from PIL import Image

def process_logo():
    img_path = r'd:\admitbridge\student\frontend\src\assets\logo.png'
    try:
        img = Image.open(img_path).convert("RGBA")
        width, height = img.size
        
        # Crop another 100 pixels from the bottom to remove the remaining text
        img = img.crop((0, 0, width, height - 100))
        
        img.save(img_path, "PNG")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    process_logo()
