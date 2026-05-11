from PIL import Image

def process():
    path = r'd:\admitbridge\student\frontend\src\assets\logo.png'
    try:
        img = Image.open(path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # If the pixel is near-black, make it transparent
            if item[0] < 30 and item[1] < 30 and item[2] < 30:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(path, "PNG")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    process()
