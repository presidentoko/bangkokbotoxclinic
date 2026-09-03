#!/usr/bin/env python3
"""golfdigg_scraper.py — Golfdigg per-course pages -> web-golf/data/providers/golfdigg.json

Course list comes from https://golfdigg.com/sitemap-courses.xml (only the
/en/courses/<slug> entries). Each page is a Next.js RSC payload; the course
record sits inside `self.__next_f.push([1,"..."])` chunks as escaped JSON with
keys greenFeeWD / greenFeeWE / holes / par / length / slope / openingHours /
quickFacts / latitude / longitude / website, plus a schema.org GolfCourse
JSON-LD block with priceRange / address / telephone.

Rule: every number in the output is copied from the page or is null.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PROVIDERS_DIR, cache_dir, fetch, strip_tags, to_float, to_int, utc_now  # noqa: E402

SITEMAP = "https://golfdigg.com/sitemap-courses.xml"
PROVIDER = "golfdigg"
OUT = PROVIDERS_DIR / "golfdigg.json"

_PUSH_RE = re.compile(r'self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)', re.S)
_DECODER = json.JSONDecoder()


def course_urls(xml: str) -> list[str]:
    urls = re.findall(r"<loc>\s*(https://golfdigg\.com/en/courses/[^<\s]+)\s*</loc>", xml)
    seen, out = set(), []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def decode_rsc(html: str) -> str:
    """Join every RSC push chunk after one level of JS-string unescaping."""
    parts = []
    for m in _PUSH_RE.finditer(html):
        try:
            parts.append(json.loads('"' + m.group(1) + '"'))
        except json.JSONDecodeError:
            continue
    return "\n".join(parts)


def json_value(text: str, key: str, start: int = 0):
    """Parse the JSON value that follows `"key":` at its first occurrence after start."""
    i = text.find(f'"{key}":', start)
    if i < 0:
        return None
    try:
        val, _ = _DECODER.raw_decode(text, i + len(key) + 3)
    except json.JSONDecodeError:
        return None
    return val


def jsonld_golfcourse(html: str) -> dict | None:
    for m in re.finditer(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', html, re.S):
        raw = m.group(1).strip()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        nodes = data if isinstance(data, list) else [data]
        for n in list(nodes):
            if isinstance(n, dict) and "@graph" in n:
                nodes.extend(n["@graph"])
        for n in nodes:
            if isinstance(n, dict) and n.get("@type") == "GolfCourse":
                return n
    return None


_SECTION_HEADINGS = {
    "course info", "course information", "booking", "cancellation", "cancellation policy",
    "remark", "remarks", "note", "notes", "how to book", "payment", "policy",
}


def inclusions_from_quickfacts(qf: str | None) -> list[str]:
    """quickFacts is an HTML blob: '<p><strong>Course Info</strong><br>- Included Golf Carts&nbsp;and Caddy<br>...'.
    Keep the bullet lines under the first heading ("Course Info") — those say
    what the rate includes/excludes. Booking-policy lines under later headings
    are dropped."""
    if not qf:
        return []
    text = strip_tags(qf)
    out: list[str] = []
    section = None
    for raw in text.split("\n"):
        ln = re.sub(r"\s+", " ", raw).strip(" -• :")
        if not ln:
            continue
        low = ln.lower().rstrip(":")
        if low in _SECTION_HEADINGS:
            section = low
            continue
        if section in (None, "course info", "course information") and len(ln) < 220:
            out.append(ln)
    return out[:12]


def _clean_hours(h) -> str | None:
    if not h or not isinstance(h, str):
        return None
    h = h.strip()
    return h if re.search(r"\d", h) else None


def parse_course(url: str, html: str) -> dict | None:
    slug = url.rstrip("/").rsplit("/", 1)[-1]
    rsc = decode_rsc(html)
    anchor = rsc.find('"greenFeeWD":')
    if anchor < 0:
        return None
    # The course record is one JSON object; its other keys sit within a few KB
    # of greenFeeWD. Start the key search a little before the anchor so the
    # page's metadata "name"/"description" keys (which come earlier) are skipped.
    win = max(0, anchor - 3000)

    def v(key):
        return json_value(rsc, key, win)

    ld = jsonld_golfcourse(html) or {}
    addr = ld.get("address") or {}
    if isinstance(addr, str):
        addr = {"streetAddress": addr}
    name = ld.get("name") or v("name")
    m_title = re.search(r"<title>(.*?)</title>", html, re.S)
    if not name and m_title:
        name = m_title.group(1).split("|")[0].strip()

    lat = to_float(v("latitude"))
    lng = to_float(v("longitude"))
    geo = ld.get("geo") or {}
    if lat is None and geo:
        lat, lng = to_float(geo.get("latitude")), to_float(geo.get("longitude"))

    address_bits = [addr.get("streetAddress"), addr.get("addressLocality"),
                    addr.get("addressRegion"), addr.get("postalCode")]
    address = ", ".join(str(b).strip() for b in address_bits if b) or None
    city_label = addr.get("addressRegion") or addr.get("addressLocality") or None

    website = v("website")
    if not website or not str(website).startswith("http") or "golfdigg.com" in str(website):
        website = None
    phone = ld.get("telephone") or v("phone") or v("tel") or None

    return {
        "slug": slug,
        "url": url,
        "name": name,
        "weekday_greenfee": to_int(v("greenFeeWD")),
        "weekend_greenfee": to_int(v("greenFeeWE")),
        "holes": to_int(v("holes")),
        "par": to_int(v("par")),
        "length_yd": to_int(v("length")),
        "slope": to_int(v("slope")),
        "opening_hours": _clean_hours(v("openingHours")),
        "inclusions": inclusions_from_quickfacts(v("quickFacts")),
        "website": website,
        "phone": phone,
        "lat": lat,
        "lng": lng,
        "address": address,
        "city_label": city_label,
        "price_range_text": ld.get("priceRange") or None,
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
    print(f"{len(urls)} /en/ course URLs")

    courses, failed = [], []
    for i, url in enumerate(urls, 1):
        slug = url.rstrip("/").rsplit("/", 1)[-1]
        html = fetch(url, cache_file=cache / f"{slug}.html", refresh=refresh)
        if not html:
            failed.append(url)
            continue
        rec = parse_course(url, html)
        if not rec:
            failed.append(url)
            print(f"  [{i}/{len(urls)}] no course record: {slug}")
            continue
        courses.append(rec)
        print(f"  [{i}/{len(urls)}] {rec['name']}: WD={rec['weekday_greenfee']} WE={rec['weekend_greenfee']} "
              f"holes={rec['holes']} par={rec['par']} incl={len(rec['inclusions'])}")

    courses.sort(key=lambda c: c["slug"])
    PROVIDERS_DIR.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "generated_at": utc_now(),
        "provider": PROVIDER,
        "source": SITEMAP,
        "courses": courses,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    priced = sum(1 for c in courses if c["weekday_greenfee"] is not None)
    print(f"\nwrote {len(courses)} courses ({priced} with weekday fee, {len(failed)} failed) -> {OUT}")
    for f in failed:
        print("  FAILED", f)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
