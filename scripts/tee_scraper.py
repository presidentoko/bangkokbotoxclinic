#!/usr/bin/env python3
"""tee_scraper.py — Golfdigg 가격 데이터 기반 모닝 슬롯 booking-link 생성.

실시간 잔여 수집은 JS 렌더링 필요 → 대신 Golfdigg 코스 가격 기반으로
오늘~7일 모닝 슬롯 링크를 생성해 tee_times.json에 저장한다.
"""

import json, re
from pathlib import Path
from datetime import datetime, timezone, timedelta

CADDY_DEFAULT  = 400
CART_DEFAULT   = 800

# 모닝 슬롯 시간대
MORNING_SLOTS = ["07:00", "07:30", "08:00", "08:30", "09:00"]

GOLFDIGG_BASE = "https://golfdigg.com/en/courses"


def course_slug(name: str) -> str:
    """코스명 → Golfdigg URL slug 변환."""
    slug = name.lower()
    slug = re.sub(r"[&/]", "-", slug)
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug.strip())
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def main():
    db_path    = Path(__file__).parent.parent / "web-golf" / "data" / "master_db.json"
    price_path = Path(__file__).parent.parent / "web-golf" / "data" / "price_matrix.json"
    out_path   = Path(__file__).parent.parent / "web-golf" / "public" / "tee_times.json"

    db = json.loads(db_path.read_text(encoding="utf-8"))
    courses = db.get("courses") or db.get("restaurants") or []
    id_to_course = {c["id"]: c for c in courses}

    # price_matrix에서 가격 있는 코스 로드
    try:
        matrix = json.loads(price_path.read_text(encoding="utf-8"))
    except Exception:
        matrix = []

    if not matrix:
        print("price_matrix.json이 비어 있습니다. price_scraper.py를 먼저 실행하세요.")
        # 빈 파일 저장
        out_path.write_text(
            json.dumps({"updated_at": datetime.now(timezone.utc).isoformat(), "slots": []},
                       ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return

    # 오늘~7일 (방콕 UTC+7)
    bkk_tz = timezone(timedelta(hours=7))
    today  = datetime.now(bkk_tz)
    dates  = [(today + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(8)]

    all_slots = []

    for entry in matrix:
        course_id = entry["course_id"]
        course    = id_to_course.get(course_id)
        if not course:
            continue

        course_name = course["name"]
        slug        = course_slug(course_name)
        booking_url = entry.get("source_url") or f"{GOLFDIGG_BASE}/{slug}"

        # 주중/주말별 그린피
        wkd_slot = entry.get("weekday", {}).get("morning")
        wke_slot = entry.get("weekend", {}).get("morning")

        for date_str in dates:
            d = datetime.strptime(date_str, "%Y-%m-%d")
            is_weekend = d.weekday() >= 5  # 토(5), 일(6)

            fee_slot = wke_slot if is_weekend else wkd_slot
            if not fee_slot:
                fee_slot = wkd_slot or wke_slot
            if not fee_slot:
                continue

            total = fee_slot["greenfee"] + fee_slot.get("caddy", CADDY_DEFAULT) + fee_slot.get("cart", CART_DEFAULT)

            # 해당 날짜의 모닝 슬롯 생성
            for t in MORNING_SLOTS:
                all_slots.append({
                    "course_id":   course_id,
                    "course_name": course_name,
                    "date":        date_str,
                    "time":        t,
                    "agency":      entry.get("source_agency", "Golfdigg"),
                    "booking_url": booking_url,
                    "total_baht":  total,
                    "available":   True,
                })

    # 날짜 → 시간 정렬
    all_slots.sort(key=lambda s: (s["date"], s["time"], s["course_name"]))

    result = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "slots": all_slots,
    }
    out_path.write_text(
        json.dumps(result, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Done: {len(all_slots)} slots ({len(matrix)} courses × {len(dates)} days × {len(MORNING_SLOTS)} times) → {out_path}")


if __name__ == "__main__":
    main()
