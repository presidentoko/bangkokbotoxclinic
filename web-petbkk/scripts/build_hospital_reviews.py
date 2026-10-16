#!/usr/bin/env python3
"""
data/hospital-reviews.json — the Google review text the clinic pages quote.

Built from the 2026-10-16 Apify run (apify_exports/petbkk_reviews_20261016,
three datasets: two main files and a top-up for the 113 clinics the first pass
was throttled out of). 19,196 reviews over 794 of 805 published clinics, $9.60.

Why the site needs it: a clinic page carried 744-1,198 characters of its own
text against 1,312 characters of boilerplate repeated on every other clinic
page, and 549 of them sat in Search Console under "Discovered/Crawled -
currently not indexed". There is no configuration fix for a page that does not
say enough. See scripts/make_review_inputs.py for the measurements and the
costing.

RULES, each one paid for by a mistake somewhere in this repo:

Thai only, originals only. A review is published only when
`originalLanguage == "th"`. Every non-Thai review arrives with
`textTranslated` holding Google's Thai machine translation of itself, and
publishing that as a reviewer's quote would be putting generated text on a site
that is working its way out of a quality demotion. The English originals are
kept in the record for reference but never quoted.
(feedback_scraper_locale_destroys_language_data)

Join on the placeId we *asked for*, which is `searchString`, not the `placeId`
the item carries. The dataset has no clinic id in it, names collide across
cities and file order means nothing — but the two place ids are not always the
same either. Google re-issues an id when it merges listings, and on this run 90
reviews came back under a different id than the one requested, among them all
60 for โรงพยาบาลสัตว์กรุงเทพ-นนท์ สาขา เจริญนคร (100 reviews on Google), which
read as a clinic that returned nothing until the join was fixed.
(feedback_cross_dataset_identity_matching)

Improve-only, union, never shrink. If this file already exists, a clinic keeps
whatever it already had unless the new run beats it on total published
characters; reviews are then unioned by reviewId. The first run returned 0
reviews for a clinic with 789 on Google purely because it was throttled, and a
second run that again returns 0 must not delete what the top-up recovered.
(feedback_scraper_monotonic_writes, feedback_scraper_partial_source_shrink)

Longest first WITHIN each star rating, in the clinic's own proportions. Taking
the longest reviews outright is what feedback_review_sort_beats_review_count
asks for and it does maximise text, but measured on this run it quietly
rewrites the clinic: a 1-star review averages 426 characters against 134 for a
5-star one, because complaints are long and praise is short. Selecting purely
by length took 1-star reviews from 9.0% of what was available to 13.2% of what
was published, and left 124 clinics quoting an average a full star below the
Google rating printed beside the quotes — 50 of them two stars below. That is a
directory misrepresenting a business, on pages whose whole purpose is to be
trustworthy, and it is the same failure as every other "number we did not
actually measure" in this repo (feedback_fabricated_numbers_in_products).

So each clinic's quota is split across star ratings in proportion to the
reviews that clinic actually has, largest-remainder, and the longest are taken
within each band. Depth is kept, the mix stays the clinic's own.

Capped at MAX_PER_CLINIC with a MIN_QUOTES floor. The character ceiling is a
safety rail, not the selector: applied strictly it gave the richest clinics
three enormous reviews and nothing else, and six opinions tell a reader more
than three essays. The full set stays one click away on Google.

Star ratings with no text are dropped. 10% of the run is a rating and nothing
else; it is already summarised by google_rating.

Ratings are refreshed, not invented. `totalScore` and `reviewsCount` come on
every item and hospitals.json is dated 2026-08-18, so the fresh pair is written
here with the date it was read. Nothing is computed from the published subset:
a page must never show an average of the 12 reviews it quotes as if it were the
clinic's Google rating. (feedback_jsonld_aggregaterating_zero)

Usage:
    python web-petbkk/scripts/build_hospital_reviews.py \
        apify_exports/petbkk_reviews_20261016 [--dry-run]
"""
from __future__ import annotations

import argparse
import collections
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve()
WEB = HERE.parents[1]
ROOT = HERE.parents[2]
DATA = WEB / "data"
OUT = DATA / "hospital-reviews.json"

MAX_PER_CLINIC = 12
MIN_QUOTES = 6               # breadth floor; the char ceiling may not cut below this
MAX_CHARS = 6000
MIN_REVIEW_CHARS = 25        # below this it is "ดีมาก" and adds nothing
THAI = re.compile(r"[฀-๿]")

# A review that is selling something is not a review. These are the patterns
# that actually turned up in the run, not a speculative blocklist.
SPAM = re.compile(
    r"(line\s*id|@line|รับงาน|สนใจทัก|ราคาถูก\s*โทร|เว็บ(ตรง|พนัน)|สล็อต|บาคาร่า|"
    r"https?://(?!maps\.google|www\.google)|t\.me/|wa\.me/)",
    re.I,
)


def clean(text: str) -> str:
    """Collapse the whitespace a pasted review carries, keep the line breaks."""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t ]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("run_dir", help="directory of the Apify dataset JSON files")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--apply-ratings", action="store_true",
                    help="also write the fresh totalScore/reviewsCount back into "
                         "hospitals.json, which the pages and aggregateRating read")
    args = ap.parse_args()

    run_dir = Path(args.run_dir)
    if not run_dir.is_absolute():
        run_dir = ROOT / run_dir

    hospitals = json.loads((DATA / "hospitals.json").read_text(encoding="utf-8"))
    excluded = set(json.loads((DATA / "hospital-excluded.json").read_text(encoding="utf-8"))["excluded"])
    by_pid = {h["google_place_id_new"]: h for h in hospitals
              if h["id"] not in excluded and h.get("google_place_id_new")}

    files = sorted(p for p in run_dir.glob("*.json"))
    if not files:
        print(f"no dataset files in {run_dir}", file=sys.stderr)
        return 1

    rows = []
    for f in files:
        part = json.loads(f.read_text(encoding="utf-8"))
        rows += part
        print(f"  read {f.name}: {len(part):,} reviews")
    print(f"  total {len(rows):,} reviews from {len(files)} files")

    # --- group, filter, de-duplicate ---------------------------------------
    stats = collections.Counter()
    picked: dict[str, dict] = {}
    fresh: dict[str, tuple[float | None, int | None]] = {}

    per_clinic: dict[str, dict[str, dict]] = collections.defaultdict(dict)
    for r in rows:
        # The id we asked for, then the one Google answered with.
        asked = (r.get("searchString") or "")
        pid = asked[len("place_id:"):] if asked.startswith("place_id:") else ""
        h = by_pid.get(pid) or by_pid.get(r.get("placeId") or "")
        if not h:
            stats["clinic not published"] += 1
            continue
        if r.get("totalScore") is not None:
            fresh[h["id"]] = (r.get("totalScore"), r.get("reviewsCount"))

        text = clean(r.get("text") or "")
        if not text:
            stats["star rating, no text"] += 1
            continue
        if (r.get("originalLanguage") or "") != "th":
            stats[f"not Thai ({r.get('originalLanguage')})"] += 1
            continue
        if not THAI.search(text):
            # Claims Thai but is not; seen on a handful of emoji-only reviews.
            stats["tagged th but no Thai characters"] += 1
            continue
        if len(text) < MIN_REVIEW_CHARS:
            stats["too short to add anything"] += 1
            continue
        if SPAM.search(text):
            stats["advertising, not a review"] += 1
            continue

        rid = r.get("reviewId") or f"{pid}:{hash(text) & 0xffffffff:x}"
        prev = per_clinic[h["id"]].get(rid)
        if prev and len(prev["text"]) >= len(text):
            stats["duplicate reviewId"] += 1
            continue
        if prev:
            stats["duplicate reviewId"] += 1

        owner = clean(r.get("responseFromOwnerText") or "")
        per_clinic[h["id"]][rid] = {
            "id": rid,
            "stars": r.get("stars"),
            "text": text,
            "when": r.get("publishedAtDate") or r.get("publishAt"),
            **({"owner_reply": owner} if owner and THAI.search(owner) else {}),
        }

    # --- select: the clinic's own star mix, longest within each band --------
    for hid, items in per_clinic.items():
        pool = list(items.values())
        target = min(MAX_PER_CLINIC, len(pool))

        by_star: dict[object, list[dict]] = collections.defaultdict(list)
        for item in pool:
            by_star[item["stars"]].append(item)
        for band in by_star.values():
            band.sort(key=lambda i: -len(i["text"]))

        # Largest-remainder apportionment, so a clinic with 9% 1-star reviews
        # and a quota of 12 quotes one of them, not two.
        exact = {s: len(b) / len(pool) * target for s, b in by_star.items()}
        quota = {s: min(len(by_star[s]), int(v)) for s, v in exact.items()}
        for s in sorted(exact, key=lambda s: -(exact[s] - int(exact[s]))):
            if sum(quota.values()) >= target:
                break
            if quota[s] < len(by_star[s]):
                quota[s] += 1
        # Any seats a short band could not fill go to whoever still has reviews.
        while sum(quota.values()) < target:
            spare = [s for s in by_star if quota[s] < len(by_star[s])]
            if not spare:
                break
            s = max(spare, key=lambda s: len(by_star[s]) - quota[s])
            quota[s] += 1

        chosen = [i for s, n in quota.items() for i in by_star[s][:n]]

        # Char ceiling as a safety rail only — never cutting below MIN_QUOTES,
        # and always dropping the longest first so the mix survives the cut.
        chosen.sort(key=lambda i: -len(i["text"]))
        kept, chars = [], 0
        for item in chosen:
            if len(kept) >= MIN_QUOTES and chars >= MAX_CHARS:
                break
            kept.append(item)
            chars += len(item["text"]) + len(item.get("owner_reply") or "")
        # Chronological reads better than longest-first on the page itself.
        kept.sort(key=lambda i: (i.get("when") or ""), reverse=True)
        score, count = fresh.get(hid, (None, None))
        picked[hid] = {
            "quoted": len(kept),
            "chars": chars,
            **({"google_rating": score} if score is not None else {}),
            **({"google_review_count": count} if count is not None else {}),
            "reviews": kept,
        }

    # --- improve-only merge against what is already published --------------
    if OUT.exists():
        old = json.loads(OUT.read_text(encoding="utf-8")).get("hospitals", {})
        kept_old = 0
        for hid, prev in old.items():
            new = picked.get(hid)
            if new is None or prev.get("chars", 0) > new.get("chars", 0):
                by_id = {i["id"]: i for i in (new or {}).get("reviews", [])}
                for item in prev.get("reviews", []):
                    by_id.setdefault(item["id"], item)
                merged = sorted(by_id.values(), key=lambda i: -len(i["text"]))[:MAX_PER_CLINIC]
                merged.sort(key=lambda i: (i.get("when") or ""), reverse=True)
                picked[hid] = {
                    **prev,
                    **(new or {}),
                    "quoted": len(merged),
                    "chars": sum(len(i["text"]) + len(i.get("owner_reply") or "") for i in merged),
                    "reviews": merged,
                }
                kept_old += 1
        print(f"\n  improve-only: kept the existing set for {kept_old} clinics")

    # --- report -------------------------------------------------------------
    total_chars = sum(p["chars"] for p in picked.values())
    quoted = sum(p["quoted"] for p in picked.values())
    print("\ndropped:")
    for reason, n in stats.most_common():
        print(f"  {n:>6,}  {reason}")
    print(f"\nclinics with quotable reviews: {len(picked)} of {len(by_pid)} published")
    print(f"  reviews published: {quoted:,}   characters: {total_chars:,}")
    counts = sorted(p["chars"] for p in picked.values())
    if counts:
        mid = counts[len(counts) // 2]
        print(f"  per clinic: median {mid:,} chars, max {counts[-1]:,}")
        for lo, hi in [(0, 499), (500, 1311), (1312, 1804), (1805, 10**9)]:
            n = sum(1 for c in counts if lo <= c <= hi)
            print(f"    {lo}-{hi if hi < 10**9 else '+'}: {n}")
    refreshed = sum(1 for hid, (s, c) in fresh.items()
                    if c is not None
                    and c != next((h.get("google_review_count") for h in hospitals if h["id"] == hid), None))
    print(f"  clinics whose Google review count has moved since 2026-08-18: {refreshed}")

    payload = {
        "source": "Google Maps reviews via Apify compass/google-maps-reviews-scraper",
        "retrieved": "2026-10-16",
        "note": (
            "Reviewer-written Thai reviews only; Google's machine translations of "
            "non-Thai reviews are deliberately excluded. No reviewer identity is "
            "collected (personalData: false). google_rating/google_review_count are "
            "the clinic's full Google figures as read on the retrieval date, not an "
            "average of the quoted subset."
        ),
        "cap": {"per_clinic": MAX_PER_CLINIC, "chars": MAX_CHARS, "min_review_chars": MIN_REVIEW_CHARS},
        "hospitals": dict(sorted(picked.items())),
    }
    if args.dry_run:
        print("\n--dry-run: nothing written")
        return 0
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\nwrote {OUT.relative_to(ROOT)}  ({OUT.stat().st_size/1e6:.1f} MB)")

    if args.apply_ratings:
        # The rating and count shown on the page, and the aggregateRating in
        # the JSON-LD, read from hospitals.json. Only the two Google fields are
        # touched, and only where the run actually read a number — a clinic the
        # scrape missed keeps what it had rather than being blanked.
        changed = 0
        for h in hospitals:
            score, count = fresh.get(h["id"], (None, None))
            if score is None and count is None:
                continue
            before = (h.get("google_rating"), h.get("google_review_count"))
            if score is not None:
                h["google_rating"] = score
            if count is not None:
                h["google_review_count"] = count
            if before != (h.get("google_rating"), h.get("google_review_count")):
                h["updated_at"] = payload["retrieved"]
                changed += 1
        (DATA / "hospitals.json").write_text(
            json.dumps(hospitals, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"  hospitals.json: refreshed rating/count on {changed} clinics")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
