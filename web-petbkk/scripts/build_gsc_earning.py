#!/usr/bin/env python3
"""
data/hospital-gsc-earning.json — clinic pages Search Console says are working.

The indexing gate in lib/indexing.ts is about to stop offering thin clinic
pages to Google. This file is the veto list: any URL that earned an impression
in the last three months is exempt from that gate whatever its data looks like.

That veto is not a nicety. bangkokfillers lost 80% of its impressions the day
after a deploy that pruned pages judged "unable to rank" — pages that were in
fact the ones earning (feedback_crawl_surface_cut_killed_impressions). A page
that ranks has already disproved the theory being used to remove it.

Source: the Search Console Performance export, Pages sheet, three months to
2026-10-15. Re-export and re-run before any future prune; a stale earning list
is worse than none, because it protects pages that have since died and exposes
pages that have since started working.

Usage:
    python web-petbkk/scripts/build_gsc_earning.py <Performance-on-Search.xlsx>
"""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
import warnings
from pathlib import Path

warnings.filterwarnings("ignore")

HERE = Path(__file__).resolve()
WEB = HERE.parents[1]
DATA = WEB / "data"
OUT = DATA / "hospital-gsc-earning.json"


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    import openpyxl

    src = Path(sys.argv[1])
    wb = openpyxl.load_workbook(src)
    rows = list(wb["Pages"].values)

    earning: dict[str, dict] = {}
    for r in rows[1:]:
        url = str(r[0] or "")
        clicks = int(r[1] or 0)
        impressions = int(r[2] or 0)
        m = re.search(r"/hospital/([^/?#]+)/?$", url)
        if not m or impressions < 1:
            continue
        # The export percent-encodes Thai slugs; the site's own slug map does not.
        slug = urllib.parse.unquote(m.group(1))
        prev = earning.get(slug)
        if prev and prev["impressions"] >= impressions:
            continue
        earning[slug] = {"clicks": clicks, "impressions": impressions}

    payload = {
        "source": src.name,
        "window": "three months to 2026-10-15",
        "note": (
            "Clinic slugs with at least one Search Console impression. Used only "
            "as a veto in lib/indexing.ts: a page listed here is never dropped "
            "from the index by the thinness gate, because it has already "
            "demonstrated it can rank. Regenerate from a fresh export before "
            "pruning again."
        ),
        "slugs": dict(sorted(earning.items(), key=lambda kv: -kv[1]["impressions"])),
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")

    total = sum(v["impressions"] for v in earning.values())
    print(f"{len(earning)} clinic slugs earned {total:,} impressions")
    print(f"wrote {OUT.relative_to(WEB.parent)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
