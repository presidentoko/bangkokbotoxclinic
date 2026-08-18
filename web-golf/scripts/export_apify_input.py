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

    def start_url(c: dict) -> dict:
        # place_id 를 담은 정규 deep link — 액터 출력 url 에 query_place_id 가 보존되어야
        # apify_to_master_db.py 가 place 와 review 를 이을 수 있다.
        return {"url": f"https://www.google.com/maps/search/?api=1&query=golf&query_place_id={c['place_id']}"}

    def write_tier(name: str, items: list[dict]) -> None:
        (OUT_DIR / f"{name}_start_urls.json").write_text(
            json.dumps([start_url(c) for c in items], ensure_ascii=False, indent=2), encoding="utf-8"
        )
        (OUT_DIR / f"{name}_place_ids.txt").write_text(
            "\n".join(c["place_id"] for c in items), encoding="utf-8"
        )
        avail = sum(c.get("total_reviews") or 0 for c in items)
        print(f"  {name:<22} {len(items):>4} 코스 | 구글 리뷰 {avail:>7,}개 보유")

    # 크레딧이 유한하므로 ROI 순으로 티어를 나눈다. 삭제 가드(apify_to_master_db.py) 덕에
    # 일부만 수집해도 나머지 코스는 master_db 에 그대로 남으므로 나눠 돌려도 안전하다.
    scraped = lambda c: len(c.get("scraped_reviews") or [])
    total = lambda c: c.get("total_reviews") or 0

    tier1 = sorted([c for c in rows if scraped(c) == 0 and total(c) >= 50], key=total, reverse=True)
    tier2 = sorted([c for c in rows if scraped(c) == 0 and 1 <= total(c) < 50], key=total, reverse=True)
    tier3 = sorted([c for c in rows if scraped(c) > 0], key=total, reverse=True)
    skip = [c for c in rows if scraped(c) == 0 and total(c) == 0]

    print("\n=== 티어 (위에서부터 돌릴 것) ===")
    write_tier("tier1_empty_popular", tier1)
    write_tier("tier2_empty_small", tier2)
    write_tier("tier3_refresh_existing", tier3)
    print(f"  {'(제외) 리뷰 자체가 없음':<22} {len(skip):>4} 코스")

    # tier1 은 계정당 크레딧에 맞춰 반씩 나눠 돌릴 수 있게 분할본도 같이 낸다.
    half = (len(tier1) + 1) // 2
    write_tier("tier1a", tier1[:half])
    write_tier("tier1b", tier1[half:])

    # 전량 (참고용)
    (OUT_DIR / "all_start_urls.json").write_text(
        json.dumps([start_url(c) for c in rows], ensure_ascii=False, indent=2), encoding="utf-8"
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
    print(f"\n[OK] {len(rows)} courses -> {OUT_DIR}")
    print(f"     현재 master_db.generated_at = {db.get('generated_at')}")
    print(f"     스크랩된 리뷰가 0건인 코스: {stale}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
