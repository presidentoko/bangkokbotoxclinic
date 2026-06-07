#!/usr/bin/env python3
"""tee_scraper.py — 에이전시 3곳에서 잔여 티타임 스크래핑 (오늘~7일)."""

import json, time, re
from pathlib import Path
from datetime import datetime, timezone, timedelta

import requests
from bs4 import BeautifulSoup
from rapidfuzz import process, fuzz

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

# ── 사이트별 설정: 브라우저 DevTools 로 확인 후 채울 것 ──────────────────
AGENCIES = [
    {
        "agency": "ThailandGolfCentre",
        "search_url": "https://www.thailandgolfcentre.com/tee-times/?date={date}",
        "slot_selector": "div.tee-time-slot",
        "time_selector": "span.slot-time",
        "course_selector": "span.course-name",
        "price_selector": "span.total-price",
        "book_link_selector": "a.book-now",
    },
    {
        "agency": "GolfAsian",
        "search_url": "https://www.golfasian.com/book/?date={date}&region=bangkok",
        "slot_selector": ".tee-slot",
        "time_selector": ".tee-time",
        "course_selector": ".course-title",
        "price_selector": ".price-total",
        "book_link_selector": "a.btn-book",
    },
    {
        "agency": "MonkeyTravel",
        "search_url": "https://www.monkeytravel.com/golf/?date={date}",
        "slot_selector": ".slot-item",
        "time_selector": ".time",
        "course_selector": ".course",
        "price_selector": ".price",
        "book_link_selector": "a.book",
    },
]
# ─────────────────────────────────────────────────────────────────────────────

MATCH_THRESHOLD = 80

def fetch_html(url: str):
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"  SKIP {url}: {e}")
        return None

def parse_baht(text: str) -> int:
    m = re.search(r"[\d,]+", text.replace(",", ""))
    try:
        return int(m.group()) if m else 0
    except ValueError:
        return 0

def parse_time(text: str):
    m = re.search(r"\d{1,2}:\d{2}", text)
    return m.group() if m else None

def scrape_agency(agency: dict, date_str: str, master_names: list, name_to_id: dict) -> list:
    url = agency["search_url"].format(date=date_str)
    soup = fetch_html(url)
    if not soup:
        return []

    slots_found = []
    for slot_el in soup.select(agency["slot_selector"]):
        time_el = slot_el.select_one(agency["time_selector"])
        course_el = slot_el.select_one(agency["course_selector"])
        price_el = slot_el.select_one(agency["price_selector"])
        link_el = slot_el.select_one(agency["book_link_selector"])

        if not (time_el and course_el):
            continue

        tee_time = parse_time(time_el.get_text(strip=True))
        if not tee_time:
            continue

        agency_course_name = course_el.get_text(strip=True)
        match = process.extractOne(agency_course_name, master_names, scorer=fuzz.WRatio)
        if not match or match[1] < MATCH_THRESHOLD:
            continue

        course_id = name_to_id.get(match[0], "")
        if not course_id:
            continue

        href = link_el["href"] if link_el and link_el.get("href") else url
        if not href.startswith("http"):
            href = "https://" + href.lstrip("/")

        slots_found.append({
            "course_id": course_id,
            "course_name": match[0],
            "date": date_str,
            "time": tee_time,
            "agency": agency["agency"],
            "booking_url": href,
            "total_baht": parse_baht(price_el.get_text()) if price_el else 0,
            "available": True,
        })

    print(f"  {agency['agency']} / {date_str}: {len(slots_found)} slots")
    return slots_found


def main():
    db_path = Path(__file__).parent.parent / "web-golf" / "data" / "master_db.json"
    out_path = Path(__file__).parent.parent / "web-golf" / "public" / "tee_times.json"

    db = json.loads(db_path.read_text(encoding="utf-8"))
    master_names = [c["name"] for c in db["courses"]]
    name_to_id = {c["name"]: c["id"] for c in db["courses"]}

    # 오늘 + 앞 7일 (Bangkok UTC+7)
    today = datetime.now(timezone(timedelta(hours=7)))
    dates = [(today + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(8)]

    all_slots = []
    for agency in AGENCIES:
        for date_str in dates:
            slots = scrape_agency(agency, date_str, master_names, name_to_id)
            all_slots.extend(slots)
            time.sleep(0.5)

    all_slots.sort(key=lambda s: (s["date"], s["time"]))

    result = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "slots": all_slots,
    }
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nDone: {len(all_slots)} slots saved to {out_path}")


if __name__ == "__main__":
    main()
