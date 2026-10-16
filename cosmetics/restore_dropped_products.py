#!/usr/bin/env python3
"""
Put back the products a half-finished scrape run deleted on 2026-06-11.

WHAT HAPPENED

    8ed183f  2026-06-05  data: 1820 products - 2026-06-05 19:42 [auto]
    3ef6a9b  2026-06-11  chore(data): auto-update master_db @ 2026-06-11
                         (1002 products, +33 new from Konvy)

The commit message counted what the run added and never looked at what the
write removed: 833 products left master_db.json that day. Konvy did not delist
half its catalogue in six days — the run saw a subset and the rebuild wrote
exactly what it saw. That is the failure mode recorded in
feedback_scraper_partial_source_shrink ("ok and complete are not the same") and
feedback_dual_catalogue_silent_revert.

build_master_db.py has since been fixed: main() now layers freshly scraped rows
on top of the products already in master_db.json, with a comment explaining
that otherwise "a run that only got through 23 products ... would silently
REPLACE a 1002-product database with a 23-product one". The guard is right, but
it arrived after the loss, so it has been holding the damaged catalogue as the
floor ever since. 1,003 products today against 1,820 in June.

WHAT IT COST

Search Console, 2026-10-15: 1,395 URLs under "Not found (404)", validation
Failed. In the 1,000-row drilldown 787 are product URLs, and of the ones whose
id can be read, 353 point at products that are in the June snapshot and not in
master_db.json. Google is still asking for pages this bug deleted, across all
four locales (/th 328, /en 277, /ar 201, /ko 179) — and /ar and /ko 308 to /en,
so those land on a redirect to a 404.

The site is at 482 indexed pages against 4,239 not indexed, 20 impressions a
week, and zero clicks for eight straight weeks. Restoring the catalogue is not
a cure for that, but publishing 45% fewer pages than the index was built on is
a thing this repo did to itself, and it is reversible for free.

WHY THE PRICES ARE NOT AN OBJECTION

The obvious worry is that the recovered rows carry June prices. They do — and
so does the live catalogue. Measured 2026-10-16 across master_db.json:

    fetched_at    current catalogue    recovered rows
    2026-06-01             8                  -
    2026-06-02           386                  -
    2026-06-03           553                561
    2026-06-04             -                196
    2026-06-05             -                 76
    2026-06-11            33                  -
    2026-07-31            23                  -

947 of the 1,003 rows the site publishes today are the same vintage as the ones
it dropped. Restoring them makes the catalogue bigger, not staler. The separate
problem — that those prices were published undated, as if current — is fixed in
cosmetics/web/lib/priceFreshness.ts, which dates every published price and
withholds the -X% badge once a row goes stale.

Schema is compatible: every field on a recovered row also exists today, and the
fields added since (boots, makeup_category, makeup_score, spf, form, dose_mg,
servings) are optional and simply absent, exactly as they are for the skincare
rows that predate them. The recovered rows are not thin — all 833 have a
description and a price, 661 have Konvy review counts and 510 have an
ingredient list, which is what the ingredient and dupe pages are built from.

Dead affiliate links are already handled by the site: the product page gates
its CTA on isLinkAlive(product_id), so a recovered product whose Konvy page is
gone renders as an undated-free dated price with no buy button rather than a
broken link.

WHAT THIS SCRIPT DOES

Union, not replace. Rows already in master_db.json win; only ids missing from
it are added back, each tagged `recovered_from` with the revision it came from
so the next reader knows where it has been. Nothing is written without --write,
and the summary prints the id count before and after plus the fetched_at spread
so a restore that pulls in something unexpected is visible before it lands.

Rebuild rankings afterwards, because value_score / total_score medians are
computed over the whole catalogue:

    python cosmetics/build_master_db.py

Usage:
    python cosmetics/restore_dropped_products.py            # dry run
    python cosmetics/restore_dropped_products.py --write
    python cosmetics/restore_dropped_products.py --rev 8ed183f --write
"""
from __future__ import annotations

import argparse
import collections
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTER_DB = ROOT / "cosmetics" / "web" / "data" / "master_db.json"
TRACKED = "cosmetics/web/data/master_db.json"

# The last revision written before the 2026-06-11 run: 1,820 products.
DEFAULT_REV = "8ed183f"


def snapshot(rev: str) -> dict:
    out = subprocess.run(
        ["git", "show", f"{rev}:{TRACKED}"],
        cwd=ROOT, capture_output=True, check=True,
    )
    return json.loads(out.stdout.decode("utf-8"))


def spread(rows) -> str:
    c = collections.Counter(str(p.get("fetched_at") or "")[:10] for p in rows)
    return "  ".join(f"{d or '(none)'}:{n}" for d, n in sorted(c.items()))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--rev", default=DEFAULT_REV)
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    current = db["products"]
    old = snapshot(args.rev)["products"]

    missing = [k for k in old if k not in current]
    print(f"master_db.json now:        {len(current):>5} products")
    print(f"{args.rev}:                  {len(old):>5} products")
    print(f"  in both:                 {len(set(old) & set(current)):>5}")
    print(f"  added since (kept):      {len(set(current) - set(old)):>5}")
    print(f"  dropped, recoverable:    {len(missing):>5}")
    if not missing:
        print("nothing to restore")
        return 0

    rows = [old[k] for k in missing]
    extra_fields = set()
    for p in rows:
        extra_fields |= set(p)
    known = set()
    for p in list(current.values())[:400]:
        known |= set(p)
    unknown = extra_fields - known
    print(f"  fields on recovered rows that today's rows do not have: "
          f"{sorted(unknown) if unknown else 'none'}")
    print(f"  with description: {sum(1 for p in rows if p.get('description')):>5}")
    print(f"  with ingredients: {sum(1 for p in rows if p.get('ingredients')):>5}")
    print(f"  with reviews:     {sum(1 for p in rows if (p.get('konvy_review_count') or 0) > 0):>5}")
    print(f"  fetched_at spread (recovered): {spread(rows)}")
    print(f"  fetched_at spread (current):   {spread(current.values())}")

    if not args.write:
        print(f"\nDRY RUN — would restore {len(missing)} products "
              f"({len(current)} → {len(current) + len(missing)}). Re-run with --write.")
        return 0

    for k in missing:
        rec = dict(old[k])
        rec["recovered_from"] = args.rev
        current[k] = rec
    db["products"] = current
    MASTER_DB.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nrestored {len(missing)} products → {len(current)} total")
    print("now rebuild so the medians and rankings see them:")
    print("    python cosmetics/build_master_db.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
