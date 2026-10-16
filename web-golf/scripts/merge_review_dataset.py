#!/usr/bin/env python3
"""
Merge a compass/google-maps-reviews-scraper dataset into web-golf/data/master_db.json.

Reviews only. This does not touch coordinates, photos, opening hours, popular
times or categories — apify_to_master_db.py owns those, and the per-review
actor does not return them, so there is nothing here that could overwrite the
place fields that were recovered by hand in August.

What it writes per course: sample_reviews_{en,th,ko}, scraped_review_count,
language_breakdown, and rating / total_reviews when the dataset carries fresher
ones. Selection is review_select.pick_samples, shared with the full rebuild.

Dry run by default. Nothing is written without --write.

    python -I web-golf/scripts/merge_review_dataset.py ~/Downloads/dataset_*.json
    python -I web-golf/scripts/merge_review_dataset.py <files> --write

Four things this script exists to get right, each one a mistake made on a
sibling site this week:

1. IT JOINS ON THE REQUESTED placeId, not the one in the response. Google
   re-issues place ids when it merges listings, so the response can carry an id
   that is in no input file. petbkk joined on the response's `placeId` and lost
   90 reviews — one 100-review hospital looked like a flat non-response. The
   actor echoes what was asked in `searchString`; that is the join key, with
   the response id as a fallback only.

2. IT IS IMPROVE-ONLY. A course that comes back with 3 reviews because Google
   served a limited view must not replace one that returned 15 in August. The
   comparison is total published characters, per course, and a course that
   does not improve keeps every quote it had (feedback_scraper_monotonic_writes).

3. IT PRINTS PER-QUARTILE YIELD. A run that ends "succeeded" can still be
   short: petbkk's first pass had 96 non-responding venues with a rate running
   0/102 in the first quartile of the input file to 72/102 in the last. That is
   throttling, and the fix is to re-request the gap, which cost $1.49 there.
   If the last quartile is much worse than the first, do not merge-and-forget —
   re-run the tail.

4. IT TAKES `text`, NEVER `textTranslated`. With `language: "en"` this actor
   puts the reviewer's own words in `text` and an English machine translation
   in `textTranslated`. Publishing the translation as a reviewer's quote is
   generated text on a site under a quality demotion, and it is also how the
   dental site lost 8,550 Thai reviews in the first place
   (feedback_scraper_locale_destroys_language_data). The translation is kept
   out of master_db entirely; if an English gloss is ever wanted it should be
   labelled as one, next to the original.
"""
from __future__ import annotations

import argparse
import json
import re
import statistics
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from review_select import detect_lang, pick_samples, sample_chars  # noqa: E402

WEB = Path(__file__).resolve().parents[1]
MASTER_DB = WEB / "data" / "master_db.json"

LANG_KEYS = ("en", "th", "ko")


def first(d: dict, *keys, default=None):
    for k in keys:
        v = d.get(k)
        if v not in (None, ""):
            return v
    return default


def requested_id(item: dict) -> str:
    """The placeId this item was asked for. See point 1 in the docstring."""
    s = str(first(item, "searchString", "placeIdSearch", default="") or "")
    m = re.search(r"(ChIJ[A-Za-z0-9_\-]+)", s)
    if m:
        return m.group(1)
    return str(first(item, "placeId", "placeid", default="") or "")


def stars_of(item: dict) -> int:
    v = first(item, "stars", "rating", "reviewRating")
    try:
        n = int(round(float(v)))
    except (TypeError, ValueError):
        return 0
    return n if 1 <= n <= 5 else 0


def load_items(paths: list[Path]) -> list[dict]:
    items: list[dict] = []
    for p in paths:
        raw = json.loads(p.read_text(encoding="utf-8"))
        rows = raw if isinstance(raw, list) else raw.get("items") or []
        print(f"  {p.name}: {len(rows):,} rows")
        items.extend(r for r in rows if isinstance(r, dict))
    return items


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("datasets", nargs="+", type=Path)
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--inputs", type=Path,
                    default=WEB.parent / "apify_inputs" / "golf_course_reviews",
                    help="the input files that were run, for the yield report")
    args = ap.parse_args()

    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    courses = db["courses"]
    by_id: dict[str, dict] = {}
    for c in courses:
        for key in (c.get("place_id"), c.get("id")):
            if key:
                by_id.setdefault(str(key), c)

    print("datasets:")
    items = load_items(args.datasets)
    print(f"  total {len(items):,} review rows")

    # ── group by the requested id ────────────────────────────────────────────
    grouped: dict[str, list[dict]] = defaultdict(list)
    unknown = Counter()
    for it in items:
        pid = requested_id(it)
        if not pid:
            unknown["no id at all"] += 1
            continue
        if pid not in by_id:
            unknown[pid] += 1
            continue
        grouped[pid].append(it)
    print(f"  courses answered: {len(grouped)}")
    if unknown:
        print(f"  rows whose id is not in master_db: {sum(unknown.values()):,} "
              f"across {len(unknown)} ids")

    # ── per-quartile yield, to catch a throttled tail ────────────────────────
    if args.inputs.exists():
        for f in sorted(args.inputs.glob("*.json")):
            asked = json.loads(f.read_text(encoding="utf-8")).get("placeIds") or []
            if not asked:
                continue
            q = max(1, len(asked) // 4)
            parts = [asked[i:i + q] for i in range(0, len(asked), q)][:4]
            rates = [f"{sum(1 for p in part if grouped.get(p))}/{len(part)}" for part in parts]
            missing = [p for p in asked if not grouped.get(p)]
            print(f"  {f.name}: answered by quartile {' '.join(rates)}"
                  f"   silent {len(missing)}/{len(asked)}")

    # ── rebuild samples ─────────────────────────────────────────────────────
    improved, unchanged, worse = 0, 0, 0
    before_total, after_total = 0, 0
    deltas: list[int] = []
    rating_moved, count_moved = 0, 0
    pending: list[tuple[dict, dict]] = []

    for pid, rows in grouped.items():
        c = by_id[pid]
        chunks: dict[str, list[tuple[str, int, str]]] = defaultdict(list)
        seen_ids: set[str] = set()
        seen_text: set[str] = set()
        lang_count = {k: 0 for k in ("th", "en", "ko", "ja", "other")}
        kept = 0
        for it in rows:
            # point 4: the reviewer's words, never the machine translation.
            text = str(first(it, "text", "reviewText", default="") or "").strip()
            if not text:
                continue
            rid = str(first(it, "reviewId", "reviewid", default="") or "")
            if rid and rid in seen_ids:
                continue
            fingerprint = " ".join(text.split())[:60].lower()
            if fingerprint in seen_text:
                continue
            if rid:
                seen_ids.add(rid)
            seen_text.add(fingerprint)
            kept += 1
            lang = detect_lang(text)
            lang_count[lang] = lang_count.get(lang, 0) + 1
            chunks[lang].append((text, stars_of(it), str(first(it, "name", "reviewerName", default="") or "")))

        new_samples = {k: pick_samples(chunks.get(k, [])) for k in LANG_KEYS}
        new_chars = sum(len(r["text"]) for v in new_samples.values() for r in v)
        old_chars = sample_chars(c)
        before_total += old_chars

        if new_chars > old_chars:
            improved += 1
            after_total += new_chars
            deltas.append(new_chars - old_chars)
            patch: dict = {f"sample_reviews_{k}": new_samples[k] for k in LANG_KEYS}
            patch["scraped_review_count"] = kept
            patch["language_breakdown"] = lang_count
            # The dataset's own counters are fresher than master_db's
            # 2026-08-19 snapshot; take them when present.
            score = first(rows[0], "totalScore")
            n_rev = first(rows[0], "reviewsCount")
            try:
                if score is not None and abs(float(score) - (c.get("rating") or 0)) >= 0.05:
                    patch["rating"] = round(float(score), 1)
                    rating_moved += 1
            except (TypeError, ValueError):
                pass
            try:
                if n_rev is not None and int(n_rev) != (c.get("total_reviews") or 0):
                    patch["total_reviews"] = int(n_rev)
                    count_moved += 1
            except (TypeError, ValueError):
                pass
            pending.append((c, patch))
        else:
            after_total += old_chars
            if new_chars == old_chars:
                unchanged += 1
            else:
                worse += 1

    silent = [pid for pid in by_id if pid not in grouped]
    print("\n── merge ──")
    print(f"  improved:  {improved}")
    print(f"  unchanged: {unchanged}")
    print(f"  kept (dataset was thinner — improve-only): {worse}")
    print(f"  published review chars, these courses: {before_total:,} → {after_total:,}")
    if deltas:
        print(f"  median gain where it improved: {int(statistics.median(deltas)):,} chars")
    print(f"  rating refreshed: {rating_moved}   review count refreshed: {count_moved}")

    allq = [sample_chars(c) for c in courses if (c.get("total_reviews") or 0) > 0]
    print(f"  site-wide median before: {int(statistics.median(allq)):,} chars")

    if not args.write:
        print("\nDRY RUN — nothing written. Re-run with --write once the numbers look right.")
        return 0

    for c, patch in pending:
        c.update(patch)
    after = [sample_chars(c) for c in courses if (c.get("total_reviews") or 0) > 0]
    db["review_merge"] = {
        "merged_at": datetime.now(timezone.utc).isoformat(),
        "datasets": [p.name for p in args.datasets],
        "courses_improved": improved,
        "courses_silent": len(silent),
    }
    MASTER_DB.write_text(json.dumps(db, ensure_ascii=False), encoding="utf-8")
    print(f"\nwritten {MASTER_DB.relative_to(WEB.parent)}")
    print(f"  site-wide median after: {int(statistics.median(after)):,} chars")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
