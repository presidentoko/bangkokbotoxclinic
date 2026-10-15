#!/usr/bin/env python3
"""
Fill thaigle's empty and shallow activity reviews from chillanel's local scrape.

chillanel/data/clinics.*.json holds 9,228 massage and spa venues across seven
Thai cities with 14.9M characters of review text, already on disk. thaigle's
spa, wellness and yoga niches cover the same ground, so some of the venues
noindexed on 2026-10-04 for having no unique text are sitting in there with
text.

Two things this deliberately does NOT do:

- It does not import the ~7,000 chillanel venues thaigle has no page for.
  chillanel's median is 1,003 characters per venue against thaigle's 3,480
  after the mostRelevant runs, and a thousand characters of Google review in a
  template is the page shape the 2026-07-24 demotion punished. More thin pages
  is the opposite of the fix.
- It does not import priceMentions. The field is a bare list of integers pulled
  out of review prose - [1300], no unit, no service, no indication whether that
  was an hour of Thai massage or a package. thaigle's price_min_thb renders as
  "Listed from THBx per y", and filling it from that would publish a number
  with no provenance.

Identity is the hard part. Neither dataset shares a key: chillanel is keyed by
Google's hex CID pair, thaigle's niches by placeId (ChIJ...). Matching on the
obvious fields goes wrong in ways that are quiet:

- Name alone: "Best Massage" in Bang Rak matched "Best Massage" in Hua Hin,
  "Thai Massage" in Pathum Wan matched a shop in Samut Prakan. 25 matches, most
  of them wrong.
- Phone alone: chain branches and outcall operators share a number. "Lek
  Massage Academy" (14 reviews) matched "Lek Massage Bangkok - BTS Asok"
  (1,500), and "Ploen Massage (Outcall)" matched "Relax Palace massage call to
  home". 76 matches, contaminated.

So a candidate must come from an exact phone or website match AND then agree on
at least two of: review count, normalized name, address prefix. A review count
that matches exactly is the strongest of the three - it is a snapshot number,
and two listings rarely share it by accident.

Usage:
    python scripts/enrich_from_chillanel.py [--dry-run] [--max-reviews 8]
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NICHE_DIR = ROOT / "web-thaigle" / "data" / "by-niche"
CHILL_DIR = ROOT / "chillanel" / "data"

# thaigle is a family-audience directory and these pages carry AdSense. One
# strict-identity match resolved to a listing Google categorises as "Erotic
# Massage"; its review text is not what the matched page is about.
EXCLUDE_TYPE = re.compile(r"erotic|escort|nuru", re.I)

MIN_CHARS = 40

# 1,255 review records from an older scrape store a relative date — "6 months
# ago" — which `new Date()` reads as NaN, so lib/verdict.ts already skips them.
# Only a date it can actually parse counts as one worth protecting below.
ISO_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}")


def has_date(rv: dict) -> bool:
    return bool(ISO_DATE.match((rv.get("date") or "").strip()))


def norm_phone(s: str | None) -> str:
    d = re.sub(r"\D", "", s or "")
    return d[-9:] if len(d) >= 9 else ""


def norm_site(s: str | None) -> str:
    s = (s or "").lower().strip()
    s = re.sub(r"^https?://", "", s)
    s = re.sub(r"^www\.", "", s)
    return s.rstrip("/").split("?")[0]


def norm_name(s: str | None) -> str:
    # Thai kept in: half these venues have no Latin name at all.
    return re.sub(r"[^a-z0-9฀-๿]", "", (s or "").lower())


def norm_addr(s: str | None) -> str:
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())[:28]


def text_of(rec: dict) -> int:
    return sum(len(rv.get("text") or "") for rv in (rec.get("reviews") or []))


def published_chars(p: dict) -> int:
    """Mirrors uniqueTextChars() in web-thaigle/lib/venueContent.ts."""
    n = sum(len((r or {}).get("text") or "") for r in (p.get("reviews_sample") or []))
    return n if n else len(p.get("top_review_text") or "")


def load_chillanel():
    by_phone: dict[str, list[dict]] = {}
    by_site: dict[str, list[dict]] = {}
    n = 0
    for path in sorted(CHILL_DIR.glob("clinics.*.json")):
        for r in json.loads(path.read_text(encoding="utf-8"))["places"]:
            n += 1
            if EXCLUDE_TYPE.search(r.get("primaryType") or ""):
                continue
            if text_of(r) <= 0:
                continue
            k = norm_phone(r.get("phone"))
            if k:
                by_phone.setdefault(k, []).append(r)
            k = norm_site(r.get("website"))
            if k:
                by_site.setdefault(k, []).append(r)
    return by_phone, by_site, n


def best_match(p: dict, by_phone, by_site):
    cands: list[dict] = []
    k = norm_phone(p.get("phone"))
    if k:
        cands += by_phone.get(k, [])
    k = norm_site(p.get("website"))
    if k:
        cands += by_site.get(k, [])
    scored: list[tuple[int, dict]] = []
    for r in cands:
        same_count = (p.get("review_count") or 0) == (r.get("reviewCount") or -1)
        same_name = norm_name(p.get("name")) == norm_name(r.get("name"))
        pa = norm_addr(p.get("address"))
        same_addr = bool(pa) and pa == norm_addr(r.get("address"))
        score = sum((same_count, same_name, same_addr))
        if score >= 2:
            scored.append((score, r))
    if not scored:
        return None
    scored.sort(key=lambda x: (-x[0], -text_of(x[1])))
    return scored[0]


def pick(p: dict, rec: dict, limit: int) -> list[dict]:
    """Union of what the venue already publishes and what chillanel holds.

    Union rather than replacement, because the two sources carry different
    things. chillanel stores "2 months ago" and nothing absolute, so its
    reviews have no usable date; the Apify samples merged on 2026-10-15 do, and
    lib/verdict.ts reads the newest of them to print "Reviewed within the last
    month". Swapping a dated sample for a longer undated one would buy
    characters with the freshness line. Taking both keeps it, and the dated
    review is explicitly protected below in case the longest-first cut would
    have dropped every one of them.
    """
    out = list(p.get("reviews_sample") or [])
    seen = {(x.get("text") or "").strip()[:60] for x in out}
    for rv in rec.get("reviews") or []:
        text = (rv.get("text") or "").strip()
        if len(text) < MIN_CHARS or text[:60] in seen:
            continue
        seen.add(text[:60])
        out.append({
            "source": "google",
            "reviewer": (rv.get("authorName") or "").strip() or "Google user",
            "rating": rv.get("rating"),
            "date": "",
            "text": text,
        })
    out.sort(key=lambda x: -len((x.get("text") or "")))
    kept = out[:limit]
    dated = [x for x in out if has_date(x)]
    if dated and not any(has_date(x) for x in kept):
        kept[-1] = dated[0]
    return kept


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--max-reviews", type=int, default=8)
    args = ap.parse_args()

    by_phone, by_site, total = load_chillanel()
    print(f"[chillanel] {total} venues on disk; "
          f"{len(by_phone)} phone keys, {len(by_site)} site keys with text")

    improved = matched = gained = out_of_noindex = 0
    samples: list[str] = []

    for path in sorted(NICHE_DIR.glob("*.json")):
        db = json.loads(path.read_text(encoding="utf-8"))
        before_slugs = [p["slug"] for p in db["places"]]
        touched = 0
        for p in db["places"]:
            if p.get("permanently_closed"):
                continue
            m = best_match(p, by_phone, by_site)
            if not m:
                continue
            matched += 1
            score, rec = m
            picked = pick(p, rec, args.max_reviews)
            new = sum(len(x["text"]) for x in picked)
            had = published_chars(p)
            if not picked or new <= had:
                continue
            # A venue under THIN_REVIEW_FLOOR reviews with no text is
            # noindexed; text takes it back into the index and the sitemap.
            if had == 0 and (p.get("review_count") or 0) < 20:
                out_of_noindex += 1
            p["reviews_sample"] = picked
            if len(picked[0]["text"]) > len(p.get("top_review_text") or ""):
                p["top_review_text"] = picked[0]["text"]
            badges = p.get("source_badges") or {}
            badges["reviews"] = len(picked)
            p["source_badges"] = badges
            improved += 1
            touched += 1
            gained += new - had
            if len(samples) < 8:
                samples.append(
                    f"    {path.stem}: {p['name'][:40]!r} {had} -> {new} chars (score {score})")

        assert [q["slug"] for q in db["places"]] == before_slugs, f"{path.stem}: slug set moved"
        if touched:
            print(f"[chillanel] {path.stem}: {touched} venues improved")
            if not args.dry_run:
                db["generated_at"] = (
                    dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")
                )
                path.write_text(json.dumps(db, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"\n[chillanel] strict-identity matches {matched}, improved {improved}, +{gained:,} chars")
    print(f"[chillanel] venues leaving noindex: {out_of_noindex}")
    for s in samples:
        print(s)
    if args.dry_run:
        print("\n[chillanel] --dry-run, nothing written")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
