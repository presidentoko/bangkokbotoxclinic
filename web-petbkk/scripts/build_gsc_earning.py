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
    python web-petbkk/scripts/build_gsc_earning.py <export.xlsx> [<older-export.xlsx> ...]
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

    # Legacy place-id URL -> current slug (scripts/build-hospital-redirects.ts).
    moves: dict[str, str] = json.loads((DATA / "hospital-redirects.json").read_text(encoding="utf-8"))

    # Several exports may be given. Their three-month windows overlap, so the
    # numbers are not summed across files: each slug keeps the larger figure.
    # The veto only needs membership, and the floor must be the most a page has
    # ever earned, not whatever the latest window happens to show
    # (feedback_guard_added_after_the_loss).
    earning: dict[str, dict] = {}
    sources = [Path(a) for a in sys.argv[1:]]
    for src in sources:
        per_file = _read_export(src, moves)
        for slug, v in per_file.items():
            prev = earning.get(slug)
            if not prev or v["impressions"] > prev["impressions"]:
                earning[slug] = v

    payload = {
        "source": ", ".join(s.name for s in sources),
        "window": "three months to each export date; per-slug maximum across exports",
        "note": (
            "Clinic slugs with at least one Search Console impression, including "
            "impressions recorded against a legacy place-id URL that now 308s to "
            "the slug. Used only as a veto in lib/indexing.ts: a page listed here "
            "is never dropped from the index by the thinness gate, because it has "
            "already demonstrated it can rank. Regenerate from a fresh export "
            "before pruning again."
        ),
        "slugs": dict(sorted(earning.items(), key=lambda kv: -kv[1]["impressions"])),
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")

    total = sum(v["impressions"] for v in earning.values())
    print(f"{len(earning)} clinic slugs earned {total:,} impressions (max across {len(sources)} export(s))")
    print(f"wrote {OUT.relative_to(WEB.parent)}")
    return 0


def _read_export(src: Path, moves: dict[str, str]) -> dict[str, dict]:
    import openpyxl
    rows = list(openpyxl.load_workbook(src)["Pages"].values)
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
        # Credit a legacy URL's impressions to the page it now 308s to.
        #
        # 187 clinics moved from a raw place id (/hospital/0x30e2…) to a
        # readable slug, and Google has not caught up: on the 2026-10-22 export
        # 62% of all clinic impressions (7,159 of 11,528) were still recorded
        # against the old URL. Keyed by slug alone, this list saw those clinics
        # as earning nothing, and the gate noindexed nine of them — three with
        # clicks — on 2026-10-20. Their earnings live under a name the gate was
        # not reading.
        slug = moves.get(slug, slug)
        acc = earning.setdefault(slug, {"clicks": 0, "impressions": 0})
        acc["clicks"] += clicks
        acc["impressions"] += impressions
    return earning


if __name__ == "__main__":
    raise SystemExit(main())
