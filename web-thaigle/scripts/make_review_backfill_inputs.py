#!/usr/bin/env python3
"""
Generate Apify inputs for the one thing the 2026-08 backfill did not collect:
review text.

That run used `maxReviews: 0`, so it filled ratings, review *counts* and photos
and left the review bodies behind. The result is visible in two places:

- "<venue name> reviews" queries earn impressions at positions 5-8 (474 in the
  2026-06..08 GSC export) against pages that contain no review text at all.
- app/activities/[niche]/[slug]/page.tsx gates its second ad on
  `hasReviewText`, because a page of structured facts with no prose is the
  shape AdSense reads as made-for-advertising. 1,767 spa pages are in that
  state today.

Ratings and photos are done — 2,251 of 2,311 spa venues qualify, only 52 lack
a rating and 4 lack a photo — so this run asks for reviews and nothing else,
which is also the cheapest way to ask.

The backfill is now done — 19 venues still have no review text, against 1,360
before. What is left is a different shortfall, and `--deepen` is for that one:
the text that was collected is too little to rank. Measured 2026-10-15 over
3,898 active venues, the median page carries 661 characters of review text and
1,464 of them carry exactly three reviews, because every run so far asked for
`reviewsSort=newest`. On a single venue with 2,499 Google reviews, 20 reviews
sorted `newest` returned 605 characters while the same 20 sorted
`mostRelevant` returned 7,646 — recency selects for one-line ratings. The
restaurant set, which had the same problem for a different reason, went from a
median of 487 characters to 3,585 purely by selecting better from text already
on disk, and that is the comparison this run is trying to reach.

Usage:
    python scripts/make_review_backfill_inputs.py            # all niches, 500/chunk
    python scripts/make_review_backfill_inputs.py --niche spa --chunk 600
    python scripts/make_review_backfill_inputs.py --reviews 3
    # the deepening run: venues that have text, but under 3,000 characters
    python scripts/make_review_backfill_inputs.py --deepen 3000 \
        --reviews 20 --sort mostRelevant
"""
from __future__ import annotations

import argparse
import json
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NICHE_DIR = ROOT / "data" / "by-niche"
OUT_DIR = ROOT.parent / "apify_inputs" / "reviews_backfill"

NICHES = ["spa", "yoga-pilates", "coworking", "diving", "cooking", "muay-thai", "wellness"]


def gsc_impressions(xlsx: str) -> dict[str, float]:
    """
    Impressions per URL slug, from a Search Console Pages export.

    A run costs money per venue, so which venues go first is a real decision.
    Trust Score is a guess at what Google will reward; this is a record of what
    Google is already showing. A venue whose page is being served to people —
    and that ranks at 5-8 for "<name> reviews" with no review text on it — is
    where review text converts to clicks fastest.

    Slug is the key because the same venue appears under /activities/{niche}/
    and /{lang}/place/, and both sets of impressions belong to it.
    """
    try:
        import openpyxl
    except ImportError:
        print("  --gsc needs openpyxl (pip install openpyxl); ordering by Trust Score instead")
        return {}
    wb = openpyxl.load_workbook(xlsx, read_only=True)
    if "Pages" not in wb.sheetnames:
        print(f"  {xlsx} has no 'Pages' sheet; ordering by Trust Score instead")
        return {}
    out: dict[str, float] = {}
    for row in wb["Pages"].iter_rows(min_row=2, values_only=True):
        url, _clicks, impr = str(row[0] or ""), row[1], row[2] or 0
        slug = urllib.parse.unquote(url.rstrip("/").rsplit("/", 1)[-1])
        if slug:
            out[slug] = out.get(slug, 0) + float(impr)
    return out


# Mirrors THIN_REVIEW_FLOOR in lib/venueContent.ts. Venues under it were
# noindexed on 2026-10-04 (775 of them) because there is no review text to
# collect even in principle — scraping them would be paying for pages that
# are not in the index.
THIN_REVIEW_FLOOR = 20


def published_chars(p: dict) -> int:
    """Mirrors uniqueTextChars() in lib/venueContent.ts."""
    n = sum(len((r or {}).get("text") or "") for r in (p.get("reviews_sample") or []))
    return n if n else len(p.get("top_review_text") or "")


def needs_reviews(p: dict, deepen: int = 0) -> bool:
    if p.get("permanently_closed"):
        return False
    # A venue with no rating was never on Google properly; reviews won't be
    # there either. Only ask for what can actually come back.
    if (p.get("review_count") or 0) < THIN_REVIEW_FLOOR:
        return False
    if deepen:
        # Includes the zero-text venues: they are the same request, and
        # excluding them would mean running two jobs over one price list.
        return published_chars(p) < deepen
    return not p.get("reviews_sample")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--niche", action="append", help="repeatable; default all")
    ap.add_argument("--chunk", type=int, default=500, help="place IDs per input file")
    ap.add_argument("--reviews", type=int, default=5, help="reviews per venue")
    ap.add_argument(
        "--sort", default="newest",
        choices=["newest", "mostRelevant", "highestRanking", "lowestRanking"],
        help="reviewsSort. mostRelevant returned 12.6x the text of newest on "
             "the probe venue; newest is kept as the default only because it "
             "is what the existing inputs in this directory were built with.",
    )
    ap.add_argument(
        "--deepen", type=int, default=0, metavar="CHARS",
        help="select venues whose published review text is under CHARS, "
             "instead of only those with none at all.",
    )
    ap.add_argument(
        "--gsc",
        help="GSC Pages export (.xlsx). Venues whose page already earns "
             "impressions are written to the first chunk.",
    )
    ap.add_argument(
        "--top",
        type=int,
        help="Emit a single file holding the best N venues across every niche, "
             "instead of chunking per niche. For a run with a fixed budget.",
    )
    args = ap.parse_args()

    niches = args.niche or NICHES
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    impressions = gsc_impressions(args.gsc) if args.gsc else {}
    total = 0
    written: list[str] = []
    pool: list[dict] = []
    # A venue can sit in two niche datasets — 89 of the 2,655 selected by
    # --deepen 3000 do, mostly spa venues that are also wellness. The actor is
    # billed per place ID, and enrich_from_apify.py walks every niche file for
    # each ID in the export, so scraping one twice pays twice for a merge that
    # already covers both.
    seen_ids: set[str] = set()

    for niche in niches:
        src = NICHE_DIR / f"{niche}.json"
        if not src.exists():
            print(f"  skip {niche}: no dataset")
            continue
        places = json.loads(src.read_text(encoding="utf-8"))["places"]
        wanted = []
        for p in places:
            pid = str(p.get("id", ""))
            if not pid.startswith("ChIJ") or pid in seen_ids:
                continue
            if not needs_reviews(p, args.deepen):
                continue
            seen_ids.add(pid)
            wanted.append(p)
        # Proven demand first, then Trust Score as the fallback ordering. The
        # dataset's own order carries no meaning, and with a budget that covers
        # one chunk, chunk 1 is the only one that may get run.
        wanted.sort(
            key=lambda p: (
                -impressions.get(p.get("slug", ""), 0.0),
                -(p.get("trust_score") or 0),
            )
        )
        ids = [p["id"] for p in wanted]
        if not ids:
            print(f"  {niche}: nothing missing")
            continue
        seen = sum(1 for p in wanted if impressions.get(p.get("slug", ""), 0) > 0)
        note = f" ({seen} already earning impressions)" if impressions else ""
        print(f"  {niche}: {len(ids)} venues need review text{note}")
        total += len(ids)

        if args.top:
            pool.extend(wanted)
            continue

        for i in range(0, len(ids), args.chunk):
            part = ids[i : i + args.chunk]
            n = i // args.chunk + 1
            stem = f"{niche}_deepen" if args.deepen else f"{niche}_reviews"
            name = f"{stem}_{n}.json" if len(ids) > args.chunk else f"{stem}.json"
            payload = {
                "language": "en",
                "scrapePlaceDetailPage": True,
                # Everything except reviews is already in the dataset; asking
                # again would cost more and overwrite good data with the same
                # data. enrich_from_apify.py only fills empty fields anyway,
                # except photos, which it deliberately refreshes — so leaving
                # maxImages at 0 also keeps this run from touching them.
                "maxImages": 0,
                "maxReviews": args.reviews,
                "reviewsSort": args.sort,
                "maxQuestions": 0,
                "scrapeContacts": False,
                "maximumLeadsEnrichmentRecords": 0,
                "skipClosedPlaces": False,
                "placeIds": part,
            }
            out = OUT_DIR / name
            out.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
            written.append(f"{name} ({len(part)})")

    if args.top:
        pool.sort(
            key=lambda p: (
                -impressions.get(p.get("slug", ""), 0.0),
                -(p.get("trust_score") or 0),
            )
        )
        picked = pool[: args.top]
        payload = {
            "language": "en",
            "scrapePlaceDetailPage": True,
            "maxImages": 0,
            "maxReviews": args.reviews,
            "reviewsSort": args.sort,
            "maxQuestions": 0,
            "scrapeContacts": False,
            "maximumLeadsEnrichmentRecords": 0,
            "skipClosedPlaces": False,
            "placeIds": [p["id"] for p in picked],
        }
        out = OUT_DIR / f"priority_{args.top}.json"
        out.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        by_niche: dict[str, int] = {}
        for p in picked:
            by_niche[p.get("niche", "?")] = by_niche.get(p.get("niche", "?"), 0) + 1
        proven = sum(1 for p in picked if impressions.get(p.get("slug", ""), 0) > 0)
        print(f"\n{out.name}: {len(picked)} of {total} venues")
        print(f"  {proven} already earn impressions; the rest are the highest Trust Scores")
        print("  " + ", ".join(f"{k} {v}" for k, v in sorted(by_niche.items(), key=lambda kv: -kv[1])))
        return 0

    # $0.009/venue measured at 5 reviews and $0.016 at 20, on the
    # compass/crawler-google-places runs of 2026-10-15. Printed because a
    # deepening run covers venues that already have a page, so nothing about
    # the output makes its size obvious.
    rate = 0.016 if args.reviews > 10 else 0.009
    print(f"\n{total} venues across {len(written)} input files in {OUT_DIR}")
    print(f"  estimated cost {total} x ${rate:.3f} = ${total * rate:.2f}"
          f"  (maxReviews={args.reviews}, reviewsSort={args.sort})")
    for w in written:
        print(f"  {w}")
    print(
        "\nRun the smallest file first, then merge it with:\n"
        "  python scripts/enrich_from_apify.py <export.json> --dry-run\n"
        "and check that reviews_sample is being filled before running the rest."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
