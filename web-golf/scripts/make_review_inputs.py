#!/usr/bin/env python3
"""
Apify inputs to buy the review text the course pages do not have.

WHY THIS RUN EXISTS

The 10-01 hygiene round on the sister dental site (URL slugs, robots, OG,
905 restored doctor URLs) produced no recovery at all two weeks later —
impressions 70/day to 95/day, clicks still 0-3/day. What moved that site was
review text. Golf is now measured to be in the same state as dental was
before that fix:

    live, 14 course pages sampled evenly from the sitemap, 2026-10-16
    (<main> text nodes intersected across pages)

                            golf /course     dental before     dental after
      <main> total chars        4,131            4,313            5,456
      of which unique           2,238            2,442            3,719
      template share              46%              44%              32%

The difference is that dental's text already existed on disk and was being
thrown away by a publish-time filter, so that fix cost nothing. Golf has no
such reserve: there is no review CSV directory for golf anywhere in the repo,
and master_db's legacy `scraped_reviews` holds 3 per course, each truncated by
the source with a trailing ellipsis. The 2026-08-19 collection is all there is,
and it was shallow by configuration:

    scraped_review_count   median 13, mean 13.5, cap was 40
    reviewsSort            "newest"  <- selects one-line ratings
    published review text  median 536 chars; 145 of 562 published courses
                           have none at all

So this is a purchase, not a repair. It is a cheap one.

WHAT IT COSTS

Actor: compass/google-maps-reviews-scraper, billed per review rather than per
venue. Measured on the dental run 2026-10-16: $0.60 per 1,000 reviews on the
free plan (the store says "from $0.30"; higher plans go down). Per-venue
scraping of the same set through compass/crawler-google-places would be
$0.016 a course = $9.00 and would also re-fetch place fields this site already
has, risking an overwrite of coordinates, photos and opening hours that were
themselves recovered by hand in August.

    cap 20   8,413 reviews   $5.05
    cap 30  11,976 reviews   $7.19   <- default
    cap 50  18,582 reviews  $11.15

Yield measured from golf's own existing collection, by Google review count
band (chars of publishable text per review actually collected):

      1-9 reviews     169 courses    0.0 chars/review   median 0 published
     10-29            44             28.2               419
     30-99            85             33.4               711
     100+             264            73.2             1,481

That curve is the same shape petbkk measured (34.8 -> 151.3): busy venues
write longer reviews, so they are also the cheapest text. Two consequences:

  * cap 30 is the knee. Over the 264 courses in the 100+ band it buys roughly
    30 x 73.2 = 2,200 chars against 1,481 today, and that is before the sort
    change below, which is the larger effect.

  * the 169 courses holding 1-9 Google reviews cannot be rescued by any cap.
    Their median is 4 reviews. They are still included because they cost
    min(4, 30) reviews each, but review text is not the answer for them and
    they should not be counted as a win.

reviewsSort is the other half. "newest" selects for one-line ratings; thaigle
measured 12.6x the text from mostRelevant at the same 20-review cap. Golf's
existing corpus was collected with "newest", so the per-review yields above
are a floor, not an estimate.

PROBE FIRST

00_probe.json is 20 courses at cap 50, about $0.60. Run it alone and check
three things before paying for the rest:

  1. `text` comes back as the reviewer wrote it. With `language: "en"` this
     actor returns the original in `text` and an English rendering in
     `textTranslated` (verified on the dental run). That is the opposite of
     what the local scraper did with hl=en, which stored Google's translation
     over the original and cost the dental site 8,550 Thai reviews it cannot
     get back (feedback_scraper_locale_destroys_language_data). Golf has
     2,441 Thai and 825 Korean reviews in its language breakdown, so this
     matters here.
  2. chars per billed review, by review-count band. The bands above come from
     a "newest" pull; re-measure them from the probe and re-pick the cap if
     the curve has moved (feedback from the dental run: chars/review is
     dataset-specific — petbkk rose 34.8 -> 151.3 across bands while dental
     stayed flat at 73-99, so the same cap behaves differently).
  3. the cap actually binds. On petbkk every venue advertising 50+ returned
     exactly 50 and every venue advertising fewer returned all of them, so
     maxReviews was a real lever. Confirm that here rather than assuming it.

TRAPS FOR THE MERGE (web-golf/scripts/merge_review_dataset.py)

  * Join on the placeId this file requested, not the one in the response.
    Google re-issues ids when it merges listings; petbkk lost 90 reviews
    (an entire 100-review hospital looked like a non-response) by joining on
    the response's `placeId`. The reviews actor echoes the request in
    `searchString`.
  * A run that reports success can still be short. petbkk's first pass had 96
    non-responding venues and the rate ran 0/102 in the first quartile of the
    input file to 72/102 in the last — throttling, not missing places. Print
    per-quartile yield and re-request the gap; it was $1.49 there.
  * Merge improve-only. A course that comes back with 3 reviews because
    Google served a limited view must not overwrite one that returned 15 in
    August (feedback_scraper_monotonic_writes, feedback_apify_review_merge_traps).

ONE VISIBLE CHANGE: `personalData: false` means reviewer names do not come
back, so quotes collected by this run are attributed to "Google reviewer"
while the 2,312 quotes already published carry real display names. The two
sibling runs today (dental, petbkk) both chose false, and it also keeps
reviewer ids, photo URLs and profile links out of the repo. Flip it to true if
the mixed attribution matters more than that; the price is the same.

Usage:
    python web-golf/scripts/make_review_inputs.py [--reviews 30] [--budget 5]
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

HERE = Path(__file__).resolve()
WEB = HERE.parents[1]
ROOT = HERE.parents[2]
MASTER_DB = WEB / "data" / "master_db.json"
OUT_DIR = ROOT / "apify_inputs" / "golf_course_reviews"

# compass/google-maps-reviews-scraper, measured on the dental run 2026-10-16.
COST_PER_REVIEW = 0.60 / 1000


def is_stub(c: dict) -> bool:
    """Mirror of isStub() in web-golf/lib/indexable.ts."""
    return not (
        c.get("hero_image") or c.get("top_photo_url") or c.get("photos")
        or c.get("sample_reviews_en") or c.get("sample_reviews_th")
        or c.get("sample_reviews_ko") or c.get("scraped_reviews")
        or c.get("mentioned_topics")
    )


def is_published(c: dict) -> bool:
    """Mirror of isIndexableCourse(): a course with no Google reviews has
    nothing to analyse and is kept out of the sitemap."""
    return (c.get("total_reviews") or 0) > 0 and not is_stub(c)


def published_chars(c: dict) -> int:
    return sum(
        len(r.get("text") or "")
        for k in ("sample_reviews_en", "sample_reviews_th", "sample_reviews_ko")
        for r in (c.get(k) or [])
    )


def payload(place_ids: list[str], max_reviews: int) -> dict:
    return {
        "placeIds": place_ids,
        "maxReviews": max_reviews,
        # Never "newest" — see the docstring. 12.6x the text at the same cap.
        "reviewsSort": "mostRelevant",
        # "all" folds in the third-party feeds Google aggregates into a
        # listing. Those arrive without provenance a page can state next to a
        # quote, and they are billed like any other result.
        "reviewsOrigin": "google",
        # `text` stays the reviewer's own wording either way; this only decides
        # which language `textTranslated` carries. English, because this is the
        # English-primary site and 1/3 of its reviews are Thai or Korean.
        "language": "en",
        "personalData": False,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--reviews", type=int, default=30,
                    help="maxReviews per course; 30 is the measured knee")
    ap.add_argument("--budget", type=float, default=5.0,
                    help="USD per input file ($5 is the Apify free monthly credit)")
    ap.add_argument("--probe", type=int, default=20)
    ap.add_argument("--probe-reviews", type=int, default=50,
                    help="higher than the real run so the yield-vs-cap curve is measurable")
    args = ap.parse_args()

    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    courses = db["courses"]
    published = [c for c in courses if is_published(c)]

    rows, bad_id = [], []
    for c in published:
        pid = str(c.get("place_id") or "")
        # The actor takes only the 27-character ChIJ form and rejects the hex
        # CID pair outright. Unlike dental, golf's maps_url carries the same id
        # it was keyed by, so there is nothing to extract for these.
        if not pid.startswith("ChIJ"):
            bad_id.append(c)
            continue
        rows.append((pid, published_chars(c), c.get("total_reviews") or 0, c.get("name") or ""))

    # Thinnest page first, most-reviewed within the same thinness. A course
    # with no quotes and 400 Google reviews is what this run rescues; a course
    # already holding 1,500 chars does not need saving. If only the first file
    # is ever run, it is the one that pays.
    rows.sort(key=lambda r: (r[1], -r[2]))

    print(f"courses in master_db:        {len(courses)}")
    print(f"  published (indexable):     {len(published)}")
    print(f"  with a ChIJ placeId:       {len(rows)}")
    if bad_id:
        print(f"  hex CID, actor rejects:    {len(bad_id)}  "
              f"({', '.join((c.get('name') or '?')[:24] for c in bad_id[:4])})")
    with_none = sum(1 for r in rows if r[1] == 0)
    print(f"  of those, zero review text: {with_none}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for f in OUT_DIR.glob("*.json"):
        f.unlink()

    # Probe: span the review-count bands so the yield curve is measurable,
    # rather than 20 courses that happen to sit next to each other.
    by_reviews = sorted(rows, key=lambda r: -r[2])
    step = max(1, len(by_reviews) // args.probe)
    probe = by_reviews[::step][: args.probe]
    (OUT_DIR / "00_probe.json").write_text(
        json.dumps(payload([p[0] for p in probe], args.probe_reviews),
                   ensure_ascii=False, indent=2), encoding="utf-8")
    probe_cost = sum(min(args.probe_reviews, p[2]) for p in probe) * COST_PER_REVIEW
    print(f"\n  00_probe.json: {len(probe)} courses, cap {args.probe_reviews}  ~${probe_cost:.2f}")

    # Pack by review budget, not by course count: the bill is per review.
    budget_reviews = int(args.budget / COST_PER_REVIEW)
    chunks: list[list[tuple]] = [[]]
    running = 0
    for r in rows:
        cost = min(args.reviews, r[2])
        if running + cost > budget_reviews and chunks[-1]:
            chunks.append([])
            running = 0
        chunks[-1].append(r)
        running += cost

    total_reviews = 0
    for i, chunk in enumerate(chunks, 1):
        n = sum(min(args.reviews, r[2]) for r in chunk)
        total_reviews += n
        out = OUT_DIR / f"reviews_{i:02d}_of_{len(chunks):02d}.json"
        out.write_text(json.dumps(payload([r[0] for r in chunk], args.reviews),
                                  ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  {out.name}: {len(chunk):>3} courses, {n:>6,} reviews  ~${n * COST_PER_REVIEW:.2f}")

    print(f"\n{len(rows)} courses, {total_reviews:,} reviews, "
          f"${total_reviews * COST_PER_REVIEW:.2f} total at maxReviews={args.reviews}")
    print(f"  files in {OUT_DIR.relative_to(ROOT)}")
    print("\nRun 00_probe.json first and check the three things in the docstring")
    print("before paying for the rest.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
