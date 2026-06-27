from PIL import Image
from pathlib import Path

img = Image.open("price_screenshots/bumrungrad_pricetable_hires.jpg")
w, h = img.size
print(f"Image size: {w}x{h}")

# Crop bottom 15% (price rows)
crop = img.crop((0, int(h * 0.85), w, h))
crop.save("price_screenshots/bumrungrad_prices_bottom.png")
print("Saved bottom crop")

# Also crop middle section headers
crop2 = img.crop((0, int(h * 0.0), w, int(h * 0.1)))
crop2.save("price_screenshots/bumrungrad_prices_top.png")
print("Saved top crop (headers)")
