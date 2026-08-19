#!/usr/bin/env python3
"""Recompute every item's price_ranges from the samples already in the DB.

The ranges in items_db.json were built with a raw min()/max() over the scraped
samples, so one junk listing set the bound — 49 of 190 items published a range
wider than 8x, and the Patek Aquanaut read 8,500-4,594,500 THB. price_sampler
now derives ranges properly (see `recalculate_ranges` there), but that only
takes effect on the next weekly run. This applies the same function to the
samples already stored, so the site stops publishing the bad numbers today.

    python 3rd/scraper/rebuild_ranges.py            # report only
    python 3rd/scraper/rebuild_ranges.py --write    # rewrite items_db.json
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from price_sampler import DB_PATH, recalculate_ranges  # noqa: E402


def spread(r: dict | None) -> float:
    if not r or not r.get('min'):
        return 0.0
    return r['max'] / r['min']


def main() -> int:
    write = '--write' in sys.argv
    db = json.loads(DB_PATH.read_text(encoding='utf-8'))

    changed = wide_before = wide_after = lost = gained = 0
    for item in db['items']:
        samples = item.get('price_samples') or []
        if not samples:
            continue
        before = item.get('price_ranges') or {}
        after = recalculate_ranges(samples, item.get('retail_price_thb', 0))

        if spread(before.get('very_good')) >= 8:
            wide_before += 1
        if spread(after.get('very_good')) >= 8:
            wide_after += 1
        if before and not after:
            lost += 1
            print(f"  DROPPED  {item['brand']} {item['model']} "
                  f"(retail {item.get('retail_price_thb', 0):,}) — no credible cluster")
        if not before and after:
            gained += 1
        if before != after:
            changed += 1
            item['price_ranges'] = after

    print(f"\nitems changed:            {changed} / {len(db['items'])}")
    print(f"ranges wider than 8x:     {wide_before} -> {wide_after}")
    print(f"items that lost a range:  {lost}")
    print(f"items that gained one:    {gained}")

    if not write:
        print('\n(report only — pass --write to apply)')
        return 0

    DB_PATH.write_text(json.dumps(db, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f'\nwrote {DB_PATH}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
