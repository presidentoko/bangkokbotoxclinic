#!/usr/bin/env python3
"""
Apify inputs to collect the Thai review text this site never had.

The review scrape ran with hl=en, so Google returned its own translations and
the scraper stored only those. Measured 2026-10-15 over 250 clinics and 8,550
reviews in dental_output/bangkok/reviews:

    author name is Thai      1,867  (21%)
    review text is Thai          7  (0.08%)

and across master_db, sample_reviews_th covers 1 clinic of 5,489 while
language_breakdown totals th=4 against en=156,146. For Bangkok dental clinics
that distribution is impossible; it is the locale, not the reviewers. The CSV
schema has a single `text` column and no original-language field, so the Thai
originals were never written to disk and cannot be recovered locally — and as
of 2026-10-13 Google serves a logged-out "limited view" with no review tab at
all, so the local scraper cannot refetch them either.

Why it is worth paying for. Thai is where this site's demand and its rankings
are: in the 2026-10-15 export Thai queries took 219 of 353 clicks from 11,765
of 31,759 impressions — 62% of the clicks on 37% of the impressions, CTR 1.86%
against English 0.67% — and the "ใกล้ฉัน" cluster ranks 1.9-3.1. The Thai
clinic pages are now indexed (commit d4a2352) but their review quotes are
still Google's English translations, which is the one part of those pages that
is not actually Thai.

placeIds come out of maps_url. master_db keys clinics by Google's hex CID pair
(0x...:0x...) and carries no ChIJ id of its own, but every maps_url embeds one
in its `!19s` segment, and the actor is cheapest driven by placeIds.

Actor: compass/google-maps-reviews-scraper, which bills per review (~$0.50 per
1,000) rather than per venue. At the same 20 reviews each that is $15.49 for
this set against $28.37 from compass/crawler-google-places at $0.016/venue --
45% less -- because we already hold every column the place-detail actor would
re-sell us (rating, review count, phone, address, hours, coordinates) and want
exactly one thing it does not have. 612 of the 1,773 clinics have fewer than 30
reviews in total, and per-review billing only charges for what exists.

maxReviews is 30, derived rather than guessed. The petbkk probe of this same
actor (20 venues, 725 reviews, 2026-10-16) measured publishable Thai characters
per billed review by how many reviews a venue has: 34.8 at 1-9 reviews, 50.3 at
10-29, 63.6 at 30-99, 151.3 at 100+. Busy places write longer reviews, so
raising the cap thickens pages that are already thick and does nothing for thin
ones. Against a 1,500-character target this set behaves exactly like petbkk's:

    cap 10  $8.53   1,038 clinics under target (58.5%)
    cap 20  $15.49  1,038 (58.5%)
    cap 30  $21.52    612 (34.5%)
    cap 50  $32.09    612 (34.5%)   <- $10.57 for nothing

The 612 left short are the ones holding fewer than 30 reviews in total; no cap
reaches them, and they are the clinics to answer with district consolidation or
noindex rather than with money. Note also that ~18% of what you pay for is
unusable (13% rating-only, 5% not Thai), which the per-review figures above
already absorb.

Files are packed by expected review count, not venue count: sum of
min(total_reviews, maxReviews) per file, held near 10,000 reviews = ~$5, which
is also Apify's monthly free credit, so the first file can come in free.

On merging the result: ask for `language: "th"` and the actor returns Thai
reviews as written, but it will also hand back `textTranslated` for reviews it
translated INTO Thai from another language. The existing merge helper prefers
textTranslated over text, which is correct when the goal is English and wrong
here — a merge script for this run must prefer the original and keep the
English text already published rather than replace it, since the English pages
need it. Do not overwrite data/clinic-reviews.json with this.

Run probe_20.json first. It is 20 clinics sampled across the whole review-count
range (not the top 20), costs well under $1, and answers two questions that
decide whether the rest is worth paying for: does `text` come back in Thai, and
how many reviews does the actor actually return against the count Google
advertises. Without the second number, maxReviews is a ceiling, not a price.

Usage:
    python web-cf/scripts/make_thai_review_inputs.py [--reviews 20] [--budget 10000]
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MASTER = ROOT / "web-cf" / "data" / "master_db.json"
OUT_DIR = ROOT / "apify_inputs" / "dental_thai_reviews"

# Mirrors DENTAL_PRIMARY_TYPES and the dental branch of _applySiteFilterUncached
# in web-cf/lib/site.ts. Only clinics this site actually publishes are worth
# paying for — master_db is shared with the botox and hair sites and holds 5,489
# records against roughly 1,625 dental pages.
DENTAL_PRIMARY_TYPES = {
    "Dental clinic", "Dentist", "Orthodontist", "Pediatric dentist",
    "Dental school", "Dental implants periodontist", "Dental hygienist",
    "Oral surgeon",
}
DENTAL_NAME = re.compile(r"\b(dental|dentist|ทันตกรรม|จัดฟัน|ฟัน)\b", re.I)
ALLOWED_CITIES = {
    c.lower() for c in [
        "Bangkok", "Nonthaburi", "Samut Prakan", "Pathum Thani", "Pattaya",
        "Chonburi", "Chiang Mai", "Koh Samui", "Hua Hin",
    ]
}

# lib/clinicFilter.ts, isClinicLike().
NON_CLINIC_NAME = [
    re.compile(p, re.I) for p in [
        r"\bspa\b", r"\bmassage\b", r"\bsalon\b", r"\bcafe\b", r"\brestaurant\b",
        r"\b(veterinary|veterinarian|vet)\b", r"\banimal\b", r"\bpets?\b",
        r"\btraining cent(er|re)\b", r"\bmarketing\b",
    ]
] + [re.compile("สัตว")]

PLACE_ID = re.compile(r"!19s(ChIJ[A-Za-z0-9_\-]+)")


def is_dental_published(c: dict) -> bool:
    name = c.get("name") or ""
    if any(r.search(name) for r in NON_CLINIC_NAME):
        return False
    city = (c.get("city_label") or "").lower()
    if city and city not in ALLOWED_CITIES:
        return False
    if (c.get("primary_type") or "") in DENTAL_PRIMARY_TYPES:
        return True
    mentions = (c.get("service_mentions") or {}).get("dental") or 0
    return bool(DENTAL_NAME.search(name)) and mentions >= 5


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--reviews", type=int, default=30,
                    help="maxReviews per clinic (billing is per review returned)")
    ap.add_argument("--budget", type=int, default=10_000,
                    help="expected reviews per file; 10,000 ~= $5 at $0.50/1k")
    ap.add_argument("--rate", type=float, default=0.50, help="USD per 1,000 reviews")
    args = ap.parse_args()

    db = json.loads(MASTER.read_text(encoding="utf-8"))
    picked: list[tuple[str, int]] = []
    no_id = 0
    bad_id = 0
    for c in db["clinics"]:
        if not is_dental_published(c):
            continue
        m = PLACE_ID.search(c.get("maps_url") or "")
        if not m:
            no_id += 1
            continue
        pid = m.group(1)
        # This actor takes 27-character ChIJ/GhIJ ids only and rejects the hex
        # CID pair master_db keys on. Anything else would fail the whole run.
        if len(pid) != 27:
            bad_id += 1
            continue
        picked.append((pid, c.get("total_reviews") or 0))

    # Most-reviewed first: a clinic with more reviews has more Thai ones to
    # return, so if only the first file is ever run it is the one that pays.
    picked.sort(key=lambda x: -x[1])
    seen: set[str] = set()
    ids: list[tuple[str, int]] = []
    for pid, n in picked:
        if pid not in seen:
            seen.add(pid)
            ids.append((pid, n))

    expected = lambda n: min(n, args.reviews)
    total_expected = sum(expected(n) for _, n in ids)

    print(f"dental clinics this site publishes: {len(picked)}")
    print(f"  no placeId in maps_url (skipped): {no_id}")
    if bad_id:
        print(f"  placeId not a 27-char ChIJ id:    {bad_id}")
    print(f"  unique placeIds:                  {len(ids)}")
    print(f"  expected reviews (max {args.reviews:>2}):        {total_expected:,}")
    print(f"  estimated total:                  "
          f"${total_expected / 1000 * args.rate:.2f}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("thai_*.json"):
        old.unlink()

    def payload(part: list[str]) -> dict:
        return {
            "placeIds": part,
            "maxReviews": args.reviews,
            # mostRelevant returned 12.6x the text of newest on the 2026-10-15
            # probe; recency selects for one-line ratings.
            "reviewsSort": "mostRelevant",
            # "all" mixes in third-party feeds Google aggregates. Those are
            # billed the same and cannot be quoted on the page with a source.
            "reviewsOrigin": "google",
            # The whole point of the run.
            "language": "th",
            # Reviewer names, ids and photo URLs are not wanted and would end up
            # in git. reviewId arrives either way, which is what the merge keys on.
            "personalData": False,
        }

    # A probe across the review-count range, not the top of it: the question is
    # how the actor behaves for a 4-review clinic as well as a 4,000-review one.
    step = max(1, len(ids) // 20)
    probe = [pid for pid, _ in ids[::step]][:20]
    probe_expected = sum(expected(n) for pid, n in ids[::step][:20])
    (OUT_DIR / "probe_20.json").write_text(
        json.dumps(payload(probe), indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n  probe_20.json: 20 clinics spanning the range, "
          f"~{probe_expected:,} reviews ~${probe_expected / 1000 * args.rate:.2f}")

    # Pack by expected reviews rather than venue count, so one 4,000-review
    # clinic does not silently make a file cost four times its neighbours.
    files: list[list[tuple[str, int]]] = []
    cur: list[tuple[str, int]] = []
    cur_n = 0
    for pid, n in ids:
        e = expected(n)
        if cur and cur_n + e > args.budget:
            files.append(cur)
            cur, cur_n = [], 0
        cur.append((pid, n))
        cur_n += e
    if cur:
        files.append(cur)

    for i, part in enumerate(files, 1):
        exp = sum(expected(n) for _, n in part)
        out = OUT_DIR / f"thai_{i:02d}_of_{len(files):02d}.json"
        out.write_text(json.dumps(payload([pid for pid, _ in part]), indent=2,
                                  ensure_ascii=False), encoding="utf-8")
        print(f"  {out.name}: {len(part):>4} clinics, ~{exp:,} reviews "
              f"~${exp / 1000 * args.rate:.2f}")

    print(f"\n{len(ids)} clinics across {len(files)} files in "
          f"{OUT_DIR.relative_to(ROOT)}")
    print("Run probe_20.json first and check that `text` comes back in Thai --")
    print("the whole run is pointless if it returns translations again.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
