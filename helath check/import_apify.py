"""Import an Apify Google Maps export into the local bkkcheckup database.

Fills the columns that were lost with the Railway database and could not be
recovered from any local cache or log: address, phone, website, lat/lng, and
review text. Also tops up the ~15 hospitals whose rating the scraper logs did
not cover (see restore_ratings_from_logs.py for the other 230).

    # Apify → Storage → Dataset → Export → JSON, saved next to this file
    python import_apify.py apify_dataset.json [--dry-run]

Matching: Apify echoes each query back in `searchString`, and apify_input.json
built those queries as "<hospital name> <city> Thailand". So the hospital name
is recoverable from the query itself, which is far more reliable than fuzzy
matching Google's returned `title` against our own names.
"""

import argparse
import json
import re
import sys
from pathlib import Path

import pymysql

from config import DB_CONFIG

HERE = Path(__file__).parent
SLUG_MAP = HERE / "apify_slug_map.json"


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip().lower()


# Columns this importer fills that schema.sql gained later. Adding them here
# keeps the script runnable against a database created from an older schema.
NEW_COLUMNS = [
    ("category_name", "VARCHAR(128) NULL"),
    ("opening_hours", "JSON NULL"),
    ("google_maps_url", "VARCHAR(1024) NULL"),
    ("permanently_closed", "TINYINT(1) NOT NULL DEFAULT 0"),
]


def ensure_columns(cur) -> None:
    for col, ddl in NEW_COLUMNS:
        cur.execute("SHOW COLUMNS FROM hospitals LIKE %s", (col,))
        if not cur.fetchone():
            cur.execute(f"ALTER TABLE hospitals ADD COLUMN {col} {ddl}")
            print(f"  added column hospitals.{col}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("dataset", help="Apify dataset export (.json)")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not SLUG_MAP.exists():
        return print(f"missing {SLUG_MAP.name} — regenerate it alongside apify_input.json") or 1

    name_to_slug = {norm(k): v for k, v in json.loads(SLUG_MAP.read_text(encoding="utf-8")).items()}
    items = json.loads(Path(args.dataset).read_text(encoding="utf-8"))
    if isinstance(items, dict):
        items = items.get("items", [])
    print(f"dataset rows: {len(items)}")

    conn = pymysql.connect(**DB_CONFIG)
    cur = conn.cursor()
    ensure_columns(cur)
    cur.execute("SELECT slug, id FROM hospitals")
    slug_to_id = dict(cur.fetchall())

    hosp_updates: list[tuple] = []
    review_rows: list[tuple] = []
    unmatched: list[str] = []

    for it in items:
        # apify_slug_map.json is keyed by the exact search term we sent, and
        # Apify echoes that term back as `searchString` — so this is a direct
        # lookup. (An earlier version tried to strip the " <city> Thailand"
        # suffix with a regex and reconstruct the hospital name; the pattern
        # matched greedily from the left and mangled most multi-word names,
        # matching only 85 of 239 rows.)
        query = it.get("searchString") or ""
        slug = name_to_slug.get(norm(query))
        if not slug:
            # Fall back to the title Google returned.
            slug = name_to_slug.get(norm(it.get("title", "")))
        hid = slug_to_id.get(slug) if slug else None
        if not hid:
            unmatched.append(query or it.get("title", "?"))
            continue

        loc = it.get("location") or {}
        hours = it.get("openingHours") or None
        hosp_updates.append((
            (it.get("address") or "")[:512] or None,
            (it.get("phone") or "")[:64] or None,
            (it.get("website") or "")[:1024] or None,
            loc.get("lat"),
            loc.get("lng"),
            it.get("totalScore"),
            it.get("reviewsCount"),
            (it.get("placeId") or "")[:128] or None,
            (it.get("categoryName") or "")[:128] or None,
            json.dumps(hours, ensure_ascii=False) if hours else None,
            (it.get("url") or "")[:1024] or None,
            1 if (it.get("permanentlyClosed") or it.get("temporarilyClosed")) else 0,
            hid,
        ))

        for rv in (it.get("reviews") or []):
            text = (rv.get("text") or "").strip()
            if not text:
                continue
            date = (rv.get("publishedAtDate") or "")[:10] or None
            review_rows.append((
                hid, (rv.get("name") or "")[:256] or None,
                rv.get("stars"), text, date, "gbp",
            ))

    print(f"  matched hospitals: {len(hosp_updates)}")
    print(f"  review rows:       {len(review_rows)}")
    print(f"  unmatched:         {len(unmatched)}")
    for q in unmatched[:10]:
        print(f"    {q}")

    if args.dry_run:
        print("\ndry run — nothing written")
        return 0

    # COALESCE so a blank field in the export never wipes a value we already
    # have; rating in particular was painstakingly restored from the logs.
    cur.executemany(
        """UPDATE hospitals SET
             address         = COALESCE(NULLIF(%s,''), address),
             phone           = COALESCE(NULLIF(%s,''), phone),
             website         = COALESCE(NULLIF(%s,''), website),
             lat             = COALESCE(%s, lat),
             lng             = COALESCE(%s, lng),
             rating          = COALESCE(%s, rating),
             review_count    = COALESCE(%s, review_count),
             gbp_place_id    = COALESCE(NULLIF(%s,''), gbp_place_id),
             category_name   = COALESCE(NULLIF(%s,''), category_name),
             opening_hours   = COALESCE(%s, opening_hours),
             google_maps_url = COALESCE(NULLIF(%s,''), google_maps_url),
             permanently_closed = %s
           WHERE id = %s""",
        hosp_updates,
    )

    if review_rows:
        # Re-runnable: drop this source's rows for the touched hospitals first.
        cur.executemany(
            "DELETE FROM hospital_reviews WHERE hospital_id = %s AND source = 'gbp'",
            [(u[-1],) for u in hosp_updates],
        )
        cur.executemany(
            """INSERT INTO hospital_reviews
                 (hospital_id, author_name, rating, review_text, review_date, source)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            review_rows,
        )
    conn.commit()

    for label, sql in [
        ("with address", "SELECT COUNT(*) FROM hospitals WHERE address IS NOT NULL AND address<>''"),
        ("with phone", "SELECT COUNT(*) FROM hospitals WHERE phone IS NOT NULL AND phone<>''"),
        ("with rating", "SELECT COUNT(*) FROM hospitals WHERE rating IS NOT NULL"),
        ("with hours", "SELECT COUNT(*) FROM hospitals WHERE opening_hours IS NOT NULL"),
        ("with category", "SELECT COUNT(*) FROM hospitals WHERE category_name IS NOT NULL"),
        ("with place id", "SELECT COUNT(*) FROM hospitals WHERE gbp_place_id IS NOT NULL"),
        ("closed (hidden)", "SELECT COUNT(*) FROM hospitals WHERE permanently_closed = 1"),
        ("review rows", "SELECT COUNT(*) FROM hospital_reviews"),
    ]:
        cur.execute(sql)
        print(f"  {label:>14}: {cur.fetchone()[0]}")

    conn.close()
    print("\nnext: python normalize_data.py && python export_to_json.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
