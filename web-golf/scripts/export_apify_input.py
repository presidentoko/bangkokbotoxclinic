"""현재 master_db 의 코스 전부를 Apify 재수집 입력으로 export.

export_existing_place_ids.py 는 "이미 가진 것"을 제외 목록으로 뽑는 스크립트다.
이건 반대다 — 리뷰 코퍼스를 통째로 갱신하려고 기존 코스 전부를 다시 긁을 때 쓴다.
(2026-08-18 기준 master_db.generated_at 이 2026-05-13 에 멈춰 있었다.)

출력 (전부 ~/Desktop/apify_golf_refresh/):
  start_urls.json   crawler-google-places / Google-Maps-Reviews-Scraper 의 startUrls 에 붙여넣기
  place_ids.txt     placeIds 입력을 받는 액터용
  courses.csv       수집 전후 대조용 스냅샷 (사라진 코스 확인)

⚠️ 왕복 주의: apify_to_master_db.py 는 export 의 `url` 필드에서
   query_place_id=... 를 정규식으로 뽑아 place 와 review 를 잇는다.
   그래서 액터 출력의 url 에 query_place_id 가 반드시 남아 있어야 한다.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB = ROOT / "web-golf" / "data" / "master_db.json"
OUT_DIR = Path.home() / "Desktop" / "apify_golf_refresh"


def main() -> int:
    if not MASTER_DB.exists():
        print(f"NOT FOUND: {MASTER_DB}")
        return 1

    with open(MASTER_DB, "r", encoding="utf-8") as f:
        db = json.load(f)
    courses = db.get("courses", db.get("restaurants", []))
    rows = [c for c in courses if c.get("place_id")]

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Apify 의 startUrls 형식. place_id 를 그대로 담은 정규 deep link 라서
    # 액터 출력 url 에도 query_place_id 가 보존된다.
    start_urls = [
        {"url": f"https://www.google.com/maps/search/?api=1&query=golf&query_place_id={c['place_id']}"}
        for c in rows
    ]
    (OUT_DIR / "start_urls.json").write_text(
        json.dumps(start_urls, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (OUT_DIR / "place_ids.txt").write_text(
        "\n".join(c["place_id"] for c in rows), encoding="utf-8"
    )

    with open(OUT_DIR / "courses.csv", "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["place_id", "name", "city_label", "rating", "total_reviews", "scraped_review_count"])
        for c in rows:
            w.writerow([
                c["place_id"], c.get("name", ""), c.get("city_label", ""),
                c.get("rating", 0), c.get("total_reviews", 0), c.get("scraped_review_count", 0),
            ])

    stale = sum(1 for c in rows if not (c.get("scraped_reviews") or []))
    print(f"[OK] {len(rows)} courses -> {OUT_DIR}")
    print(f"     start_urls.json / place_ids.txt / courses.csv")
    print(f"     현재 master_db.generated_at = {db.get('generated_at')}")
    print(f"     스크랩된 리뷰가 0건인 코스: {stale}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
