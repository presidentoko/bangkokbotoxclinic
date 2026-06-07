#!/usr/bin/env python3
"""price_scraper.py — 에이전시 3곳에서 방콕 골프장 가격 스크래핑."""

import json, time, re
from pathlib import Path
from datetime import datetime, timezone

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
SITES = [
    {
        "agency": "ThailandGolfCentre",
        "listing_url": "https://www.thailandgolfcentre.com/golf-courses/",
        "course_link_selector": "a.course-title",
        "name_selector": "h1.course-name",
        "greenfee_selector": "td.green-fee",
        "caddy_selector": "td.caddy-fee",
        "cart_selector": "td.cart-fee",
        "max_pages": 5,
    },
    {
        "agency": "GolfAsian",
        "listing_url": "https://www.golfasian.com/golf-courses/thailand/bangkok/",
        "course_link_selector": "a.course-name",
        "name_selector": "h1",
        "greenfee_selector": ".green-fee",
        "caddy_selector": ".caddy-fee",
        "cart_selector": ".cart-fee",
        "max_pages": 3,
    },
    {
        "agency": "MonkeyTravel",
        "listing_url": "https://www.monkeytravel.com/golf-in-thailand/",
        "course_link_selector": "a.course-link",
        "name_selector": "h1.title",
        "greenfee_selector": ".fee-greenfee",
        "caddy_selector": ".fee-caddy",
        "cart_selector": ".fee-cart",
        "max_pages": 3,
    },
]
# ─────────────────────────────────────────────────────────────────────────────

MATCH_THRESHOLD = 85

def fetch_html(url: str):
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"  SKIP {url}: {e}")
        return None

def parse_baht(text: str):
    m = re.search(r"[\d,]+", text.replace(",", ""))
    if not m:
        return None
    try:
        return int(m.group().replace(",", ""))
    except ValueError:
        return None

def scrape_site(site: dict, master_names: list, name_to_id: dict) -> list:
    results = []
    soup = fetch_html(site["listing_url"])
    if not soup:
        return []

    links = [a.get("href", "") for a in soup.select(site["course_link_selector"]) if a.get("href")]
    print(f"  {site['agency']}: {len(links)} course links found")

    for url in links[:50]:
        if not url.startswith("http"):
            base = site["listing_url"].rstrip("/").rsplit("/", 1)[0]
            url = base + "/" + url.lstrip("/")

        time.sleep(1)
        page = fetch_html(url)
        if not page:
            continue

        name_el = page.select_one(site["name_selector"])
        if not name_el:
            continue
        agency_name = name_el.get_text(strip=True)

        match = process.extractOne(agency_name, master_names, scorer=fuzz.WRatio)
        if not match or match[1] < MATCH_THRESHOLD:
            print(f"  NO MATCH: '{agency_name}'")
            continue

        def get_fee(sel):
            el = page.select_one(sel)
            return parse_baht(el.get_text()) if el else None

        gf = get_fee(site["greenfee_selector"])
        caddy = get_fee(site["caddy_selector"])
        cart = get_fee(site["cart_selector"])

        if gf is None:
            continue

        slot = {"greenfee": gf, "caddy": caddy or 400, "cart": cart or 900}
        course_id = name_to_id.get(match[0], "")
        if course_id:
            results.append({
                "course_id": course_id,
                "scraped_at": datetime.now(timezone.utc).isoformat(),
                "source_agency": site["agency"],
                "source_url": url,
                "weekday": {"morning": slot},
                "weekend": {"morning": slot},
                "notes": "",
            })
            print(f"  MATCH: '{agency_name}' → '{match[0]}' ({match[1]:.0f}%)")

    return results


def main():
    db_path = Path(__file__).parent.parent / "web-golf" / "data" / "master_db.json"
    out_path = Path(__file__).parent.parent / "web-golf" / "data" / "price_matrix.json"
    unmatched_path = Path(__file__).parent.parent / "web-golf" / "data" / "unmatched_prices.json"

    db = json.loads(db_path.read_text(encoding="utf-8"))
    master_names = [c["name"] for c in db["courses"]]
    name_to_id = {c["name"]: c["id"] for c in db["courses"]}

    all_results = []
    unmatched = []

    for site in SITES:
        print(f"\nScraping {site['agency']}...")
        try:
            scraped = scrape_site(site, master_names, name_to_id)
            all_results.extend(scraped)
        except Exception as e:
            print(f"  ERROR in {site['agency']}: {e}")

    out_path.write_text(json.dumps(all_results, ensure_ascii=False, indent=2), encoding="utf-8")
    if unmatched:
        unmatched_path.write_text(json.dumps(unmatched, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nDone: {len(all_results)} prices saved")


if __name__ == "__main__":
    main()
