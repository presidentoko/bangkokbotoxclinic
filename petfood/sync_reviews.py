"""
petreviews.json → web-petbkk/data/petreviews.json 동기화
"""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
SRC  = ROOT / "data" / "petreviews.json"
DST  = ROOT / "web-petbkk" / "data" / "petreviews.json"

if not SRC.exists():
    print(f"✗ {SRC} not found — run pantip_pet_reviews.py first")
else:
    shutil.copy2(SRC, DST)
    data = json.loads(SRC.read_text(encoding="utf-8"))
    print(f"✓ Synced → {DST}")
    print(f"  foods: {len(data.get('foods', {}))}, hospitals: {len(data.get('hospitals', {}))}")
