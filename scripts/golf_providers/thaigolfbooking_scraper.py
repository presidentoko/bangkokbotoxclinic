#!/usr/bin/env python3
"""thaigolfbooking_scraper.py — ThaiGolfBooking course pages -> web-golf/data/providers/thaigolfbooking.json

Course list: https://www.thaigolfbooking.com/st_tours-sitemap.xml (CDATA-wrapped
<loc>, three languages — only /en/st_tour/<slug>/ is used). Pages are
WordPress SSR; after stripping tags the facts block reads

    Course Detail 18 Holes, Par 72 , Range 7,015 yards
    Course Designer Gary Player
    Course Website http://...
    Course Address ...
    Course Phone Number +66 ...
    Visitor Rate (Weekday) 2700 Visitor Rate (Weekend) 3700
    Caddy Fee 400 Golf Cart 800 Golf Set 1500

Pages without a Visitor Rate are hotels or packages and are skipped.
booking_price is the provider's own headline rate, taken only from the
booking form's "from ฿X per person" line (the sidebar's other-course prices
use a different template and are not matched).

Rule: every number in the output is copied from the page or is null.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PROVIDERS_DIR, cache_dir, fetch, strip_tags, to_float, to_int, utc_now  # noqa: E402

SITEMAP = "https://www.thaigolfbooking.com/st_tours-sitemap.xml"
PROVIDER = "thaigolfbooking"
OUT = PROVIDERS_DIR / "thaigolfbooking.json"


def course_urls(xml: str) -> list[str]:
    urls = re.findall(r"<loc>\s*(?:<!\[CDATA\[)?\s*(https://(?:www\.)?thaigolfbooking\.com/en/st_tour/[^<\]\s]+)", xml)
    seen, out = set(), []
    for u in urls:
        u = u.rstrip("/") + "/"
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def _after(text: str, label: str, stop_labels: list[str], maxlen: int = 200) -> str | None:
    i = text.find(label)
    if i < 0:
        return None
    seg = text[i + len(label): i + len(label) + maxlen]
    cut = len(seg)
    for s in stop_labels:
        j = seg.find(s)
        if 0 <= j < cut:
            cut = j
    val = seg[:cut].strip(" :- ")
    return val or None


_LABELS = ["Course Detail", "Course Designer", "Course Website", "Course Address", "Course Access",
           "Course E-mail", "Course Phone Number", "Visitor Rate (Weekday)", "Visitor Rate (Weekend)",
           "Caddy Fee", "Golf Cart", "Golf Set", "Course Facilities", "Google Map", "Course Layout"]


def parse_course(url: str, html: str) -> dict | None:
    slug = url.rstrip("/").rsplit("/", 1)[-1]
    text = re.sub(r"\s+", " ", strip_tags(html))
    if "Visitor Rate (Weekday)" not in text and "Visitor Rate (Weekend)" not in text:
        return None  # hotel / package page

    def field(label: str) -> str | None:
        return _after(text, label, [l for l in _LABELS if l != label])

    m_title = re.search(r"<title>(.*?)</title>", html, re.S)
    name = None
    if m_title:
        name = re.sub(r"\s*\|.*$", "", m_title.group(1)).strip()
    m_og = re.search(r'property="og:title"\s+content="([^"]+)"', html)
    if m_og and not name:
        name = re.sub(r"\s*\|.*$", "", m_og.group(1)).strip()

    detail = field("Course Detail") or ""
    holes = to_int(re.search(r"(\d+)\s*Holes", detail, re.I).group(1)) if re.search(r"(\d+)\s*Holes", detail, re.I) else None
    par = to_int(re.search(r"Par\s*(\d+)", detail, re.I).group(1)) if re.search(r"Par\s*(\d+)", detail, re.I) else None
    yards = to_int(re.search(r"([\d,]{4,6})\s*yards", detail, re.I).group(1)) if re.search(r"([\d,]{4,6})\s*yards", detail, re.I) else None

    website = field("Course Website")
    if website and not website.startswith("http"):
        website = None
    wd = to_int(field("Visitor Rate (Weekday)"))
    we = to_int(field("Visitor Rate (Weekend)"))
    caddy = to_int(field("Caddy Fee"))
    cart = to_int(field("Golf Cart"))
    golf_set = to_int(field("Golf Set"))
    # A "0" on the page means "not stated" for these fee lines.
    wd = wd if wd else None
    we = we if we else None
    caddy = caddy if caddy else None
    cart = cart if cart else None
    golf_set = golf_set if golf_set else None
    if wd is None and we is None:
        return None  # label present but no rate: hotel / package page

    m_lat = re.search(r'data-lat="(-?[\d.]+)"\s+data-lng="(-?[\d.]+)"', html)
    lat = to_float(m_lat.group(1)) if m_lat else None
    lng = to_float(m_lat.group(2)) if m_lat else None

    m_bp = re.search(r"from\s*฿\s*([\d,]+(?:\.\d+)?)\s*per person", text)
    booking_price = to_int(m_bp.group(1)) if m_bp else None

    designer = field("Course Designer")
    if designer and (len(designer) > 80 or designer.lower() in ("n/a", "-", "unknown")):
        designer = None

    return {
        "slug": slug,
        "url": url,
        "name": name,
        "weekday_greenfee": wd,
        "weekend_greenfee": we,
        "caddy_fee": caddy,
        "cart_fee": cart,
        "golf_set_fee": golf_set,
        "holes": holes,
        "par": par,
        "yards": yards,
        "designer": designer,
        "website": website,
        "phone": field("Course Phone Number"),
        "address": field("Course Address"),
        "lat": lat,
        "lng": lng,
        "booking_price": booking_price,
    }


def main(argv: list[str]) -> int:
    refresh = "--refresh" in argv
    limit = None
    for a in argv:
        if a.startswith("--limit="):
            limit = int(a.split("=", 1)[1])
    cache = cache_dir(PROVIDER)

    xml = fetch(SITEMAP, cache_file=cache / "_sitemap.xml", refresh=True)
    if not xml:
        print("sitemap fetch failed", file=sys.stderr)
        return 1
    urls = course_urls(xml)
    if limit:
        urls = urls[:limit]
    print(f"{len(urls)} /en/ st_tour URLs")

    courses, skipped, failed = [], [], []
    for i, url in enumerate(urls, 1):
        slug = url.rstrip("/").rsplit("/", 1)[-1]
        html = fetch(url, cache_file=cache / f"{slug}.html", refresh=refresh)
        if not html:
            failed.append(url)
            continue
        rec = parse_course(url, html)
        if not rec:
            skipped.append(slug)
            print(f"  [{i}/{len(urls)}] no visitor rate (hotel/package?): {slug}")
            continue
        courses.append(rec)
        print(f"  [{i}/{len(urls)}] {rec['name']}: WD={rec['weekday_greenfee']} WE={rec['weekend_greenfee']} "
              f"caddy={rec['caddy_fee']} cart={rec['cart_fee']} holes={rec['holes']} par={rec['par']} book={rec['booking_price']}")

    courses.sort(key=lambda c: c["slug"])
    PROVIDERS_DIR.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "generated_at": utc_now(),
        "provider": PROVIDER,
        "source": SITEMAP,
        "courses": courses,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    priced = sum(1 for c in courses if c["weekday_greenfee"] is not None)
    print(f"\nwrote {len(courses)} courses ({priced} with weekday fee, {len(skipped)} skipped, {len(failed)} failed) -> {OUT}")
    for f in failed:
        print("  FAILED", f)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
