from PIL import Image

def remove_white(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    newData = []
    # Replace white-ish pixels with transparent
    for item in datas:
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    img.save(output_path, "PNG")

remove_white("public/images/logo-evhss.jpg", "public/images/logo-evhss-transparent.png")
remove_white("public/images/logo-shampooch.jpg", "public/images/logo-shampooch-transparent.png")
print("Backgrounds removed successfully!")
