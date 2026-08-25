# -*- coding: utf-8 -*-
"""
import_scraped_hospitals.py — load scrape_missing_hospitals.py output into the
bkkcheckup database.

Only rows the scraper marked "ok" are considered, and only the fields Google
Maps actually published are written. Nothing is defaulted into a value: tier,
jci, founded_year, bed_count, description and accreditations stay NULL, because
the last time this dataset carried invented values for those it took months to
notice. A hospital page with no price and no bed count is honest; the pages
this replaces were neither.

Slugs come from the name the scraper *found*, never from the name we searched
for. That matters: several of the searched names do not exist — the guides had
invented them — and Maps answers such a query with a real, different hospital
nearby. Deriving the slug from the found name means the URL and the page agree,
and the searched-for slug is emitted as a redirect instead.

    python import_scraped_hospitals.py --found found.json --dry-run
    python import_scraped_hospitals.py --found found.json --apply

--apply also writes redirects.generated.json, which lists every requested slug
whose hospital landed under a different one. Fold those into
web/lib/hospital-redirects.ts (RENAMED_HOSPITALS) and delete the same keys from
MOVED_TO_GUIDE, or the guide redirect will shadow the page this just created.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys

import pymysql
from pymysql.cursors import DictCursor

from config import DB_CONFIG

HERE = pathlib.Path(__file__).parent


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s[:80] or "hospital"


def connect():
    cfg = dict(DB_CONFIG)
    cfg.setdefault("database", "bkkcheckup")
    cfg["cursorclass"] = DictCursor
    return pymysql.connect(**cfg)


def clean(rec: dict) -> dict:
    """Map a scraped record onto hospital columns, dropping anything absent."""
    website = rec.get("website") or None
    if website and len(website) > 1024:
        website = None
    hours = rec.get("opening_hours")
    return {
        "name": rec["name"].strip(),
        "slug": slugify(rec["name"]),
        "city": rec.get("city") or None,
        "country": "Thailand",
        "address": (rec.get("address") or None),
        "phone": (rec.get("phone") or None),
        "website": website,
        "lat": rec.get("lat"),
        "lng": rec.get("lng"),
        "rating": rec.get("rating"),
        "review_count": rec.get("review_count"),
        "category_name": (rec.get("category") or None),
        "opening_hours": json.dumps(hours, ensure_ascii=False) if hours else None,
        "google_maps_url": (rec.get("maps_url") or None),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--found", required=True)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    if not (args.apply or args.dry_run):
        ap.error("pass --dry-run or --apply")

    rows = json.loads(pathlib.Path(args.found).read_text(encoding="utf-8"))
    ok = [r for r in rows if r.get("status") == "ok" and r.get("name")]
    print(f"{len(rows)} scraped, {len(ok)} accepted")

    conn = connect()
    cur = conn.cursor()
    cur.execute("SELECT slug, name FROM hospitals")
    existing = {r["slug"]: r["name"] for r in cur.fetchall()}

    to_insert, already, redirects, collisions = [], [], {}, []
    seen: dict[str, str] = {}
    for r in ok:
        row = clean(r)
        final = row["slug"]
        if final != r["slug"]:
            # No city guard is needed here: scrape_missing_hospitals.py already
            # rejects any result whose address is outside the city the URL was
            # about, so everything reaching this point is city-consistent by
            # construction. A second check on the same fact would only ever be
            # dead code.
            redirects[r["slug"]] = final
        if final in existing:
            already.append((r["slug"], final, existing[final]))
            continue
        if final in seen:
            # Two searched names resolved to the same real hospital — keep one
            # row and redirect both old URLs at it.
            collisions.append((r["slug"], final, seen[final]))
            continue
        seen[final] = r["slug"]
        to_insert.append((row, r))

    print(f"\ninsert     : {len(to_insert)}")
    print(f"already in DB: {len(already)}")
    print(f"dupes merged : {len(collisions)}")
    print(f"slug changed : {len(redirects)}  (searched name != real name)")
    for row, src in sorted(to_insert, key=lambda x: -x[1].get("impr", 0))[:25]:
        print(f"  +{src.get('impr',0):>4} imp  {row['slug']:<44} {row['name'][:38]}")
    if already:
        print("\nalready present (will 308 to the live page instead):")
        for req, final, name in already[:15]:
            print(f"   {req:<42} -> {final} ({name[:30]})")
    if collisions:
        print("\nmerged onto one row:")
        for req, final, first in collisions:
            print(f"   {req:<42} -> {final} (also from {first})")

    # Every requested slug that is not its own final slug needs a redirect,
    # including the ones whose target already existed. The `req != final` guard
    # is not cosmetic: on a second run every hospital is "already in DB", and
    # without it each slug that matched its own name emitted a redirect to
    # itself — an infinite loop that takes the page down completely.
    for req, final, _name in already:
        if req != final:
            redirects[req] = final
    for req, final, _first in collisions:
        if req != final:
            redirects[req] = final

    if args.dry_run:
        print("\ndry run — nothing written")
        return 0

    cols = list(clean(ok[0]).keys())
    sql = (
        f"INSERT INTO hospitals ({', '.join(cols)}) "
        f"VALUES ({', '.join(['%s'] * len(cols))})"
    )
    for row, _src in to_insert:
        cur.execute(sql, [row[c] for c in cols])
    conn.commit()
    print(f"\ninserted {len(to_insert)} hospitals")

    out = HERE / "redirects.generated.json"
    out.write_text(json.dumps(redirects, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {out} with {len(redirects)} slug redirects")
    print("next: python export_to_json.py, then fold redirects into "
          "web/lib/hospital-redirects.ts")
    return 0


if __name__ == "__main__":
    sys.exit(main())
