"""현재 master_db 의 코스 전부를 Apify 재수집 입력으로 export.

export_existing_place_ids.py 는 "이미 가진 것"을 제외 목록으로 뽑는 스크립트다.
이건 반대다 — 리뷰 코퍼스를 통째로 갱신하려고 기존 코스 전부를 다시 긁을 때 쓴다.
(2026-08-18 기준 master_db.generated_at 이 2026-05-13 에 멈춰 있었다.)

출력 (전부 ~/Desktop/apify_golf_refresh/), 티어별로:
  <tier>__INPUT_places.json    crawler-google-places 의 Input JSON 탭에 통째로 붙여넣기
  <tier>__INPUT_reviews.json   Google-Maps-Reviews-Scraper 쪽에 통째로 붙여넣기
  <tier>_place_ids.txt         참고용 place_id 목록
  courses.csv                  수집 전후 대조용 스냅샷 (사라진 코스 확인)

⚠️ 입력은 **배열이 아니라 객체**여야 한다. startUrls 배열만 붙여넣으면 액터가
   INVALID INPUT (searchStringsArray / startUrls 중 하나는 필요) 을 낸다.

⚠️ 왕복 주의: apify_to_master_db.py 는 export 의 `url` 필드에서
   query_place_id=... 를 정규식으로 뽑아 place 와 review 를 잇는다.
   액터가 그 형식으로 url 을 만들어주므로 입력에서 신경 쓸 건 없지만,
   출력 필드를 줄이는 옵션을 켜서 url 을 빼먹으면 매칭이 통째로 깨진다.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB = ROOT / "web-golf" / "data" / "master_db.json"
OUT_DIR = Path.home() / "Desktop" / "apify_golf_refresh"

# 코스당 최대 리뷰 수. 비용을 직접 좌우한다 — 안 걸면 리뷰 3,692개짜리 Topgolf
# 하나가 $5 계정을 통째로 태운다.
MAX_REVIEWS = 20


def main() -> int:
    if not MASTER_DB.exists():
        print(f"NOT FOUND: {MASTER_DB}")
        return 1

    with open(MASTER_DB, "r", encoding="utf-8") as f:
        db = json.load(f)
    courses = db.get("courses", db.get("restaurants", []))
    rows = [c for c in courses if c.get("place_id")]

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    def place_url(c: dict) -> dict:
        # 액터가 출력 url 을 만들 때 쓰는 것과 같은 Google Maps URLs API 형식.
        # apify_to_master_db.py 가 query_place_id 로 place 와 review 를 잇는다.
        q = quote(c.get("name") or "golf")
        return {"url": f"https://www.google.com/maps/search/?api=1&query={q}&query_place_id={c['place_id']}"}

    def write_tier(name: str, items: list[dict]) -> None:
        # 액터 입력 JSON 편집기는 "입력 객체" 전체를 기대한다. 예전에 startUrls 배열만
        # 통째로 붙여넣어 INVALID INPUT 이 났다 — 배열이 아니라 객체여야 한다.
        #
        # places 액터는 searchStringsArray 에 "place_id:<ID>" 를 넣는 방식이 실증됐다
        # (apify_exports/ 의 기존 결과에 searchString: "place_id:..." 로 남아 있다).
        # maxCrawledPlacesPerSearch=1 이 없으면 place_id 하나가 검색 페이지 전체를
        # 긁어와 크레딧을 태운다.
        place_ids = [f"place_id:{c['place_id']}" for c in items]

        # 액터 하나(Google Maps Scraper)로 장소 + 리뷰를 한 번에 끝내는 입력.
        # maxReviews > 0 이면 리뷰가 place 레코드의 reviews[] 안에 실려 오고,
        # apify_to_master_db.py 가 거기서 꺼내 쓴다(4b 단계).
        (OUT_DIR / f"{name}__INPUT_all_in_one.json").write_text(
            json.dumps({
                "searchStringsArray": place_ids,
                "maxCrawledPlacesPerSearch": 1,
                "language": "en",
                "maxReviews": MAX_REVIEWS,
                "reviewsSort": "newest",
                "scrapePlaceDetailPage": True,
            }, ensure_ascii=False, indent=2), encoding="utf-8"
        )

        # 액터를 나눠 돌릴 때 쓰는 장소 전용 입력 (리뷰는 별도 액터로).
        places_input = {
            "searchStringsArray": place_ids,
            "maxCrawledPlacesPerSearch": 1,
            "language": "en",
            "maxReviews": 0,
            "scrapePlaceDetailPage": True,
        }
        (OUT_DIR / f"{name}__INPUT_places.json").write_text(
            json.dumps(places_input, ensure_ascii=False, indent=2), encoding="utf-8"
        )

        # 리뷰 액터는 장소 URL 목록을 받는다. maxReviews 는 비용을 직접 좌우하므로
        # 반드시 명시한다 — 안 걸면 리뷰 3,600개짜리 코스 하나가 크레딧을 다 먹는다.
        reviews_input = {
            "startUrls": [place_url(c) for c in items],
            "maxReviews": MAX_REVIEWS,
            "reviewsSort": "newest",
            "language": "en",
        }
        (OUT_DIR / f"{name}__INPUT_reviews.json").write_text(
            json.dumps(reviews_input, ensure_ascii=False, indent=2), encoding="utf-8"
        )

        (OUT_DIR / f"{name}_place_ids.txt").write_text(
            "\n".join(c["place_id"] for c in items), encoding="utf-8"
        )
        avail = sum(c.get("total_reviews") or 0 for c in items)
        capped = sum(min(c.get("total_reviews") or 0, MAX_REVIEWS) for c in items)
        print(f"  {name:<22} {len(items):>4} 코스 | 보유 {avail:>7,} | maxReviews 적용 시 {capped:>6,}건 수집")

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

    write_tier("all_639", rows)

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
