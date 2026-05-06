"""기존 master_db.json 의 place_id 들을 텍스트 파일로 export.
Apify 다음 스크랩 때 'place_ids to exclude' 로 feed 가능.
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB = ROOT / "web-golf" / "data" / "master_db.json"
OUTPUT = Path.home() / "Desktop" / "existing_golf_place_ids.txt"
OUTPUT_JSON = Path.home() / "Desktop" / "existing_golf_places.json"


def main():
    if not MASTER_DB.exists():
        print(f"NOT FOUND: {MASTER_DB}")
        return
    with open(MASTER_DB, "r", encoding="utf-8") as f:
        db = json.load(f)
    courses = db.get("courses", db.get("restaurants", []))

    # 1. place_id 만 (Apify 의 'placeIds to exclude' 옵션에)
    pids = [c["place_id"] for c in courses if c.get("place_id")]
    OUTPUT.write_text("\n".join(pids), encoding="utf-8")
    print(f"[OK] {len(pids)} place_ids to {OUTPUT}")

    # 2. JSON: 이름 + place_id 매핑 (수동 dedupe / merge 시 참고)
    summary = [
        {
            "place_id": c["place_id"],
            "name": c["name"],
            "city": c.get("city_label", ""),
            "rating": c.get("rating", 0),
            "total_reviews": c.get("total_reviews", 0),
            "scraped_review_count": c.get("scraped_review_count", 0),
        }
        for c in courses
    ]
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(f"[OK] {len(summary)} entries to {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
