#!/usr/bin/env python3
"""
Build the outreach list for the "Ranked on Thaigle" badge.

The badge (app/api/badge/[niche]/[slug]/route.ts) is a backlink generator:
a venue that embeds it links to its own ranking page. Backlinks are the one
thing this site cannot get by publishing more pages, and every ranked venue
is a potential linker — but only if it knows the badge exists.

What this produces is a list, not an email. Sending is a separate, deliberate
step; nothing here contacts anyone.

Two decisions worth knowing about:

- The rank claim is read back out of the live badge rather than recomputed
  here. If this script had its own copy of the ranking rule it would drift
  from the badge the moment either changed, and the email would promise a
  position the graphic contradicts. Fetching the badge also proves it renders
  for that venue before we offer it.

- Only venues with their own website are included. A venue whose only web
  presence is a Facebook page cannot embed an <img>, so mailing it is asking
  for something it has no way to do.

Usage:
    python scripts/badge_outreach_list.py                      # spa, Bangkok, top 200
    python scripts/badge_outreach_list.py --niche yoga-pilates --limit 50
    python scripts/badge_outreach_list.py --no-email           # skip contact scraping
"""
from __future__ import annotations

import argparse
import csv
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NICHE_DIR = ROOT / "data" / "by-niche"
OUT_DIR = ROOT / "data" / "outreach"

SITE = "https://www.thaigle.com"
UA = "Mozilla/5.0 (compatible; ThaigleOutreach/1.0; +https://www.thaigle.com/for-venues)"

# A venue reachable only through one of these cannot host an <img> tag.
SOCIAL_ONLY = re.compile(
    r"facebook\.com|instagram\.com|linktr\.ee|lin\.ee|line\.me|wa\.me|t\.me"
    r"|google\.com|sites\.google\.com|booking\.com|agoda\.com|tripadvisor",
    re.I,
)

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
# Addresses that belong to the platform a site is built on, not the business.
EMAIL_NOISE = re.compile(
    r"@(example|sentry|wixpress|squarespace|godaddy|cloudflare|jquery|gmail\.com\.png)",
    re.I,
)
CONTACT_PATHS = ["", "/contact", "/contact-us", "/about", "/en/contact"]

# "#4 of 37 in Sukhumvit" — the badge's own claim line.
RANK_RE = re.compile(r"#(\d+) of (\d+) in ([^<]+)")


def fetch(url: str, timeout: int = 15) -> str | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read(400_000)
        return raw.decode("utf-8", errors="replace")
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError, ValueError):
        return None


def qualifying(places: list[dict], niche: str) -> list[dict]:
    """Mirror of qualifyingNichePlaces() in lib/niches.ts for the spa gate."""
    out = []
    for p in places:
        if p.get("permanently_closed") or (p.get("trust_score") or 0) <= 0:
            continue
        if niche == "spa" and not (
            (p.get("price_min_thb") or 0) > 0
            or p.get("top_review_text")
            or p.get("reviews_sample")
            or p.get("top_photo_url")
        ):
            continue
        out.append(p)
    out.sort(key=lambda p: -(p.get("trust_score") or 0))
    return out


def emails_for(site: str) -> list[str]:
    """Public contact addresses published on the venue's own site."""
    found: list[str] = []
    base = site.rstrip("/")
    for path in CONTACT_PATHS:
        html = fetch(base + path)
        if not html:
            continue
        for m in EMAIL_RE.findall(html):
            if EMAIL_NOISE.search(m) or m.lower().endswith((".png", ".jpg", ".gif", ".webp")):
                continue
            if m not in found:
                found.append(m)
        if found:
            break
        time.sleep(0.4)
    return found[:3]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--niche", default="spa")
    ap.add_argument("--city", default="Bangkok")
    ap.add_argument("--limit", type=int, default=200)
    ap.add_argument("--no-email", action="store_true", help="skip fetching venue sites")
    ap.add_argument("--delay", type=float, default=0.5)
    args = ap.parse_args()

    src = NICHE_DIR / f"{args.niche}.json"
    if not src.exists():
        print(f"no dataset: {src}", file=sys.stderr)
        return 1
    places = json.loads(src.read_text(encoding="utf-8"))["places"]

    targets = [
        p
        for p in qualifying(places, args.niche)
        if p.get("city") == args.city
        and p.get("website")
        and not SOCIAL_ONLY.search(p["website"])
    ][: args.limit]
    print(f"[outreach] {args.niche}/{args.city}: {len(targets)} venues with their own site")

    rows = []
    no_badge = 0
    for i, p in enumerate(targets, 1):
        slug = urllib.parse.quote(p["slug"], safe="")
        badge_url = f"{SITE}/api/badge/{args.niche}/{slug}"
        svg = fetch(badge_url)
        if not svg:
            no_badge += 1
            continue
        m = RANK_RE.search(svg)
        # The badge is SVG, so "Ratchada & Huai Khwang" arrives as
        # "Ratchada &amp; Huai Khwang" — unescape before it reaches a mail merge.
        rank, total, area = (
            (m.group(1), m.group(2), html.unescape(m.group(3)).strip()) if m else ("", "", "")
        )

        emails = [] if args.no_email else emails_for(p["website"])
        rows.append(
            {
                "name": p["name"],
                "rank": rank,
                "of": total,
                "area": area,
                "rating": p.get("rating") or "",
                "reviews": p.get("review_count") or "",
                "trust_score": p.get("trust_score") or "",
                "website": p["website"],
                "email": emails[0] if emails else "",
                "other_emails": " ".join(emails[1:]),
                "phone": p.get("phone") or "",
                "page_url": f"{SITE}/activities/{args.niche}/{slug}",
                "badge_url": badge_url,
            }
        )
        if i % 25 == 0:
            print(f"  {i}/{len(targets)} · {sum(1 for r in rows if r['email'])} with an address")
        time.sleep(args.delay)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"badge_{args.niche}_{args.city.lower().replace(' ', '-')}.csv"
    with out.open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else ["name"])
        w.writeheader()
        w.writerows(rows)

    with_email = sum(1 for r in rows if r["email"])
    print(f"[outreach] wrote {len(rows)} rows to {out}")
    print(f"[outreach] {with_email} have a published address; {no_badge} had no badge and were skipped")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
