#!/usr/bin/env python3
"""
Apify inputs to collect the review text the hospital pages have never had.

Why this run exists. data/hospitals.json has 17 fields and every one of them is
identity or location: name, address, phone, coordinates, a rating and a review
*count*. There is no review text anywhere in the dataset — data/petreviews.json
covers 34 clinics and holds Pantip thread mentions, not Google reviews. So a
clinic page is its name, its address, a star number, a licence class when
matched (422) and opening hours when known (442), wrapped in the shared layout.

Measured 2026-10-15 over four published clinic pages: 2,200-2,700 characters of
text, of which 1,312-1,315 characters are byte-identical on every page in the
site (footer, newsletter, disclaimer, buttons). Unique text per page is
744-1,198 characters — 36-48% of the page. lib/indexing.ts cites "53% of each
page's text identical to every other" as the reason 429 food pages were pulled
out of the index; the clinic pages are now in that same band.

Search Console agrees. The 2026-10-15 coverage export has 519 URLs under
"Discovered - currently not indexed" and 30 under "Crawled - currently not
indexed": 549 pages Google has been offered, has looked at, and has declined to
store. There is no configuration fix for that — the sitemap is clean (979 URLs,
978 answer 200), the legacy place-id URLs all 308 correctly, and the two
"Failed" validations in that export are the site's own deliberate noindex and
redirect decisions. What is left is that most of these pages do not say enough
to be worth a slot.

The precedent for paying. On the sister dental site the 10-01 run of hygiene
fixes produced no recovery at all; what moved it was review text, median 478 →
1,805 characters per page (project_dental_content_depth_20261015). These clinics
have 105,962 Google reviews between them and the site quotes none of them.

Actor: compass/google-maps-reviews-scraper, billed per review (~$0.50 per
1,000, "from $0.30" on higher Apify plans) rather than per venue. That is the
right actor here because reviews are the only thing missing: the rating, count,
phone, address, hours and coordinates are already in the dataset, so paying
compass/crawler-google-places $0.016 a venue to re-fetch a whole place detail
page would buy one new field at roughly twice the price — $12.88 against $6.69
for the same 805 venues at 20 reviews each.

PROBE RESULT, 2026-10-16. 20 venues at maxReviews=50 returned 725 reviews for
$0.36, and both questions it was bought to answer came back usable.

  Language. 595 of the 634 reviews carrying text are originalLanguage "th"
  (94%); the rest are en 33, zh-Hans 2, ru/ja/ko/fr 1 each. So Google is
  serving the originals, not translations — the hl=en failure that cost the
  dental site 8,550 Thai reviews does not repeat here. The translation trap is
  real though, and now confirmed by example: every non-Thai review arrives with
  `textTranslated` holding a Thai machine translation of itself.

  The cap binds. All 11 probed venues advertising 50+ reviews returned exactly
  50, and all 9 advertising fewer returned 100% of their count. Nothing is
  withheld, so maxReviews is a real lever rather than a ceiling Google ignores.

  Yield per billed review, measured, counting only publishable Thai text:
  34.8 chars at clinics advertising 1-9 reviews, 50.3 at 10-29, 63.6 at 30-99,
  151.3 at 100+. Busy clinics write longer reviews, so they are also the
  cheapest text.

  18% of the bill is unusable: 13% of reviews are a star rating with no text,
  5% are text in another language. Priced in below.

maxReviews=30, $9.35, is where that curve turns. Projected over all 805 from
the measured per-review yields:

    cap 10   $3.60   median   636 review chars per clinic   536 clinics <1,500
    cap 20   $6.69   median 1,272                           536 clinics <1,500
    cap 30   $9.35   median 1,908                           301 clinics <1,500
    cap 50  $13.85   median 3,181                           301 clinics <1,500

The page needs to clear 1,312 characters of boilerplate that every clinic page
repeats, against 744-1,198 of unique text today, and the dental recovery landed
at 1,805 median review characters. 30 is the first cap that clears all three.
50 costs $4.50 more and rescues *nobody new* — it only piles more text onto
clinics that already had plenty.

The 301 that stay under 1,500 characters are the clinics that do not have 30
reviews on Google to begin with (the 1-29 bands, 301 clinics exactly). No cap
reaches them and this run is not the answer for them; they need the licence,
hours and service signals, or they need to not be chasing indexation.

Scope: the clinics the directory publishes (hospitals.json minus
hospital-excluded.json, which holds the entries that are not veterinary
facilities and 308 to a hub), minus those with a review count of zero — there
is nothing there to fetch. 805 venues as of 2026-10-16.

placeIds come straight from `google_place_id_new`, which the Places backfill
filled for 100% of the published set, and all 805 are the 27-character ChIJ
form this actor requires — it rejects anything else, including the hex CID pair
in `google_place_id`. No extraction needed, unlike the dental run which had to
pull ChIJ ids out of `maps_url`.

Ordering and chunking. Thinnest pages first, most-reviewed within each tier. A
clinic that holds neither a licence match nor opening hours has nothing on its
page but its Google listing, so it is the one review text rescues; a clinic with
2,537 reviews and both signals is already indexed and does not need saving.
Pairing the two keys puts "thin page, plenty of reviews to quote" at the top.
Files are then packed to a review budget rather than a venue count, because the
bill is per review — at the $5 default the first file both costs the least and
matters the most, and $5 is the free monthly credit on the Apify free plan.

    language: "th"   — this is a Thai-language site and these are Thai clinics.
                       feedback_scraper_locale_destroys_language_data: the
                       dental scrape ran hl=en and Google handed back its own
                       translations, which is how 8,550 dental reviews ended up
                       0.08% Thai and unrecoverable.
    reviewsSort      — "mostRelevant", never "newest". Measured 2026-10-15: the
                       same 20 reviews per venue yielded 12.6x the text under
                       mostRelevant, because recency selects for one-line
                       ratings. "newest" is also the only sort `reviewsStartDate`
                       works with, which is a reason people reach for it; this
                       run wants depth, not recency.
    reviewsOrigin    — "google". "all" folds in the third-party review feeds
                       Google aggregates into a listing; those arrive without
                       provenance this site can state next to a quote, and they
                       are billed like any other result.
    personalData     — false. The site needs the words, not the reviewers.
                       Reviewer names, ids, photo URLs and profile links are
                       personal data this project has no use for and would then
                       have to keep out of git (the raw DLD and dental pulls are
                       gitignored for the same reason). `reviewId` comes back
                       either way, which is enough to merge and de-duplicate.

Two things in the payload that are already paid for and should not be left on
the floor:

  `responseFromOwnerText` — the clinic's own reply, on 84 of the 725 probed
  reviews (10,386 characters). It is unique page text, it is the clinic
  speaking rather than the directory, and "the clinic replied" is itself worth
  showing.

  `totalScore` and `reviewsCount` — on every item. hospitals.json was last
  updated 2026-08-18 and the review count had already moved on 12 of the 20
  probed clinics, so the merge should refresh google_rating and
  google_review_count while it is here.

Three traps for whoever merges the result.

1. The output has no clinic id in it. Items key on `placeId`, so the merge joins
   back through `google_place_id_new`, which is unique across the dataset. Join
   on that and nothing else — not on name, and not on position in the file.

2. `language: "th"` also makes the actor return `textTranslated` for reviews it
   translated INTO Thai from another language. The existing merge helpers prefer
   textTranslated over text, which is right when the target is English and wrong
   here: a machine translation published as a reviewer's quote is generated text,
   on a site whose entire problem is a quality demotion. Take `text` when
   `originalLanguage` is "th"; otherwise keep the original wording and do not
   present a translation as a quote.

3. Merge improve-only, longest first (feedback_apify_review_merge_traps,
   feedback_scraper_monotonic_writes). A venue that returns 3 reviews because
   Google served a limited view must not overwrite one that returned 15 on an
   earlier pass. Dry-run the merge and print the character-count delta per
   clinic before writing anything.

Usage:
    python web-petbkk/scripts/make_review_inputs.py [--reviews 20] [--budget 5]
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

HERE = Path(__file__).resolve()
WEB = HERE.parents[1]
ROOT = HERE.parents[2]
DATA = WEB / "data"
OUT_DIR = ROOT / "apify_inputs" / "petbkk_hospital_reviews"

# compass/google-maps-reviews-scraper, store price 2026-10-16.
COST_PER_REVIEW = 0.50 / 1000


def load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--reviews", type=int, default=30,
                    help="maxReviews per venue; 30 is the measured knee, see docstring")
    ap.add_argument("--budget", type=float, default=5.0, help="USD per input file")
    ap.add_argument("--probe", type=int, default=20, help="venues in the 00_probe file")
    ap.add_argument("--probe-reviews", type=int, default=50,
                    help="maxReviews for the probe; higher than the real run so "
                         "the yield-vs-cap curve is measurable")
    args = ap.parse_args()

    hospitals = load("hospitals.json")
    excluded = set(load("hospital-excluded.json")["excluded"])
    licenses = set(load("hospital-licenses.json")["licenses"])
    hours = set(load("hospital-hours.json"))

    published = [h for h in hospitals if h["id"] not in excluded]

    rows, bad_id, no_reviews = [], 0, 0
    for h in published:
        pid = h.get("google_place_id_new") or ""
        # The actor's own rule: 27 characters, ChIJ or GhIJ. Anything else is
        # rejected at the door, so it is worth catching here instead.
        if len(pid) != 27 or not pid.startswith(("ChIJ", "GhIJ")):
            bad_id += 1
            continue
        count = h.get("google_review_count") or 0
        if count < 1:
            no_reviews += 1
            continue
        # How much the page already has to say besides its Google listing.
        signals = (h["id"] in licenses) + (h["id"] in hours)
        rows.append((signals, -count, pid, min(count, args.reviews), count))

    rows.sort()
    seen: set[str] = set()
    venues = [(pid, n, c) for _, _, pid, n, c in rows if not (pid in seen or seen.add(pid))]
    projected = sum(n for _, n, _ in venues)

    print(f"records in hospitals.json:        {len(hospitals)}")
    print(f"  published (not excluded):       {len(published)}")
    print(f"  placeId not a 27-char ChIJ:     {bad_id}")
    print(f"  zero Google reviews (skipped):  {no_reviews}")
    print(f"  venues to scrape:               {len(venues)}")
    for s in (0, 1, 2):
        tier = [r for r in rows if r[0] == s]
        label = {0: "neither licence nor hours", 1: "one of the two", 2: "both"}[s]
        if tier:
            print(f"    {label:<26} {len(tier):>4} venues, {sum(-r[1] for r in tier):>7,} reviews on Google")

    # Pack to a cost budget, not a venue count: the bill is per review.
    per_file = max(1, int(args.budget / COST_PER_REVIEW))
    chunks: list[list[tuple[str, int, int]]] = [[]]
    running = 0
    for venue in venues:
        if running + venue[1] > per_file and chunks[-1]:
            chunks.append([])
            running = 0
        chunks[-1].append(venue)
        running += venue[1]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for stale in OUT_DIR.glob("*.json"):
        stale.unlink()

    def payload(ids: list[str], max_reviews: int) -> dict:
        return {
            "placeIds": ids,
            "maxReviews": max_reviews,
            # Both measured on the 2026-10-15 probe; see the module docstring.
            "reviewsSort": "mostRelevant",
            # Google's own reviews only. "all" folds in the third-party feeds
            # Google aggregates, which arrive without provenance this site can
            # state on a page, and they are billed like any other result.
            "reviewsOrigin": "google",
            "language": "th",
            "personalData": False,
        }

    # A 20-venue probe before the 805. It answers the two questions that decide
    # whether the run is worth anything, for $0.50: does `text` come back in
    # Thai at all, and how many reviews does a venue actually return against
    # the count Google advertises? The second sets maxReviews for the real run,
    # so the venues are sampled evenly across the review-count range rather
    # than taken off the top — 20 of the busiest clinics would say nothing
    # about the thin ones this is being bought for.
    by_count = sorted(venues, key=lambda v: -v[2])
    step = max(1, len(by_count) // args.probe)
    probe = by_count[::step][: args.probe]
    probe_path = OUT_DIR / "00_probe.json"
    probe_path.write_text(
        json.dumps(payload([pid for pid, _, _ in probe], args.probe_reviews), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    probe_cost = sum(min(c, args.probe_reviews) for _, _, c in probe) * COST_PER_REVIEW
    print(f"  {probe_path.name}: {len(probe):>3} venues at maxReviews={args.probe_reviews}"
          f", Google counts {min(c for _,_,c in probe)}-{max(c for _,_,c in probe)}"
          f"  ~${probe_cost:.2f}")

    for n, chunk in enumerate(chunks, 1):
        out = OUT_DIR / f"reviews_{n:02d}_of_{len(chunks):02d}.json"
        out.write_text(
            json.dumps(payload([pid for pid, _, _ in chunk], args.reviews), indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        reviews = sum(c for _, c, _ in chunk)
        print(f"  {out.name}: {len(chunk):>3} venues, up to {reviews:>6,} reviews  ~${reviews * COST_PER_REVIEW:.2f}")

    print(f"\n{len(venues)} venues across {len(chunks)} files in {OUT_DIR.relative_to(ROOT)}")
    print(f"  up to {projected:,} reviews at maxReviews={args.reviews}"
          f"  ~${projected * COST_PER_REVIEW:.2f} total")
    print(f"  (the per-venue actor would be ${len(venues) * 0.016:.2f} for the same set)")
    print(f"\n00_probe.json (~${probe_cost:.2f}) was run on 2026-10-16 and both of its")
    print("questions came back usable — 94% of reviews are originalLanguage 'th'")
    print("and every venue returned its full cap. The docstring has the numbers")
    print("and why they set maxReviews=30. It is regenerated here for the record;")
    print("re-run it only if the dataset or the actor changes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
