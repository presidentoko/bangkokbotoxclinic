"""outreach_hdmall_discovered.csv → bangkok_clinics/output/discovered_places.csv 동기화.

lookup_hdmall_on_maps.py 가 발견한 새 클리닉들을 bangkok_clinics review 워커가
처리할 수 있도록 discovered_places.csv 에 append. review 워커는 주기 재스캔으로
새 row 자동 픽업 → 리뷰 자동 수집.

- 기존 discovered_places.csv 의 place_id 와 href 모두 기준으로 dedup
- 누락된 컬럼은 빈 문자열
- review_count 0 이어도 OK (scraper.py line 1306: rc==0 통과)
"""
from __future__ import annotations

import csv
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[1]
SRC_CSV = ROOT / "outreach_hdmall_discovered.csv"
DST_CSV = ROOT / "bangkok_clinics" / "output" / "discovered_places.csv"

DST_FIELDS = [
    "place_id", "name", "href", "rating", "review_count",
    "price_symbol", "primary_type", "address_hint", "status_hint",
    "raw_card_text", "first_seen_lat", "first_seen_lng",
]


def main() -> int:
    if not SRC_CSV.exists():
        print(f"SRC NOT FOUND: {SRC_CSV}", file=sys.stderr)
        return 1
    if not DST_CSV.exists():
        print(f"DST NOT FOUND: {DST_CSV}", file=sys.stderr)
        return 1

    # 1) 기존 discovered_places 의 place_id + href set
    existing_pids: set[str] = set()
    existing_hrefs: set[str] = set()
    with DST_CSV.open("r", encoding="utf-8-sig", newline="", errors="replace") as f:
        for row in csv.DictReader(f):
            pid = (row.get("place_id") or "").strip()
            href = (row.get("href") or "").strip()
            if pid:
                existing_pids.add(pid)
            if href:
                existing_hrefs.add(href)
    print(f"existing in discovered_places: {len(existing_pids)} pids, {len(existing_hrefs)} hrefs")

    # 2) src 읽고 신규만 추출
    new_rows: list[dict] = []
    skipped_dup = 0
    skipped_no_pid = 0
    skipped_no_href = 0
    with SRC_CSV.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            pid = (row.get("place_id") or "").strip()
            href = (row.get("maps_url") or "").strip()
            if not pid:
                skipped_no_pid += 1
                continue
            if not href:
                skipped_no_href += 1
                continue
            if pid in existing_pids or href in existing_hrefs:
                skipped_dup += 1
                continue
            new_rows.append({
                "place_id": pid,
                "name": (row.get("found_name") or row.get("brand_name") or "").strip(),
                "href": href,
                "rating": (row.get("rating") or "").strip(),
                "review_count": (row.get("reviews") or "").strip(),
                "price_symbol": "",
                "primary_type": "",  # review 워커가 page에서 다시 추출
                "address_hint": "",
                "status_hint": "",
                "raw_card_text": "",
                "first_seen_lat": (row.get("lat") or "").strip(),
                "first_seen_lng": (row.get("lng") or "").strip(),
            })
            # 같은 run 안에서도 중복 방지
            existing_pids.add(pid)
            existing_hrefs.add(href)

    print(f"src rows analyzed: dup={skipped_dup}, no_pid={skipped_no_pid}, no_href={skipped_no_href}, new={len(new_rows)}")

    if not new_rows:
        print("No new rows to append.")
        return 0

    # 3) Append (header 안 쓰고 body 만)
    with DST_CSV.open("a", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=DST_FIELDS)
        for r in new_rows:
            w.writerow(r)

    print(f"✓ appended {len(new_rows)} new rows to {DST_CSV.name}")
    print("  review worker will pick these up on next CSV re-scan cycle.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
