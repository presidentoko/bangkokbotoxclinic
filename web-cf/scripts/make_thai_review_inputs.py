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

Actor: compass/crawler-google-places. Measured 2026-10-15 at $0.016 per venue
for 20 reviews. Files are chunked to stay near $5 each, which is how the
thaigle runs were paid for.

On merging the result: ask for `language: "th"` and the actor returns Thai
reviews as written, but it will also hand back `textTranslated` for reviews it
translated INTO Thai from another language. The existing merge helper prefers
textTranslated over text, which is correct when the goal is English and wrong
here — a merge script for this run must prefer the original and keep the
English text already published rather than replace it, since the English pages
need it. Do not overwrite data/clinic-reviews.json with this.

Usage:
    python web-cf/scripts/make_thai_review_inputs.py [--reviews 20] [--chunk 310]
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
    ap.add_argument("--reviews", type=int, default=20)
    ap.add_argument("--chunk", type=int, default=310, help="~$5 per file at $0.016")
    args = ap.parse_args()

    db = json.loads(MASTER.read_text(encoding="utf-8"))
    picked: list[tuple[str, int]] = []
    no_id = 0
    for c in db["clinics"]:
        if not is_dental_published(c):
            continue
        m = PLACE_ID.search(c.get("maps_url") or "")
        if not m:
            no_id += 1
            continue
        picked.append((m.group(1), c.get("total_reviews") or 0))

    # Most-reviewed first: a clinic with more reviews has more Thai ones to
    # return, so if only the first file is ever run it is the one that pays.
    picked.sort(key=lambda x: -x[1])
    seen: set[str] = set()
    ids = [pid for pid, _ in picked if not (pid in seen or seen.add(pid))]

    print(f"dental clinics this site publishes: {len(picked)}")
    print(f"  no placeId in maps_url (skipped): {no_id}")
    print(f"  unique placeIds:                  {len(ids)}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    n_files = (len(ids) + args.chunk - 1) // args.chunk
    for i in range(0, len(ids), args.chunk):
        part = ids[i: i + args.chunk]
        n = i // args.chunk + 1
        payload = {
            # The whole point of the run.
            "language": "th",
            "scrapePlaceDetailPage": True,
            "maxImages": 0,
            "maxReviews": args.reviews,
            # mostRelevant returned 12.6x the text of newest on the 2026-10-15
            # probe; recency selects for one-line ratings.
            "reviewsSort": "mostRelevant",
            "maxQuestions": 0,
            "scrapeContacts": False,
            "maximumLeadsEnrichmentRecords": 0,
            "skipClosedPlaces": False,
            "placeIds": part,
        }
        out = OUT_DIR / f"thai_{n:02d}_of_{n_files:02d}.json"
        out.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  {out.name}: {len(part)} clinics  ~${len(part) * 0.016:.2f}")

    print(f"\n{len(ids)} clinics across {n_files} files in {OUT_DIR.relative_to(ROOT)}")
    print(f"  estimated total ${len(ids) * 0.016:.2f} (maxReviews={args.reviews})")
    print("\nRun one file first and check that `text` comes back in Thai before")
    print("paying for the rest — the whole run is pointless if it returns")
    print("translations again.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
