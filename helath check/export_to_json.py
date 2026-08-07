"""Export the bkkcheckup MySQL database to the JSON file the site reads at build time.

This is the migration off Railway. The site used to open a MySQL connection on
every ISR regeneration; after this it reads a bundled JSON file and has no
runtime datastore at all — the same shape the other sites in this repo already
use (web-restaurants/data/master_db.json, 2nd/data/items_db.json, ...).

    python export_to_json.py

Writes web/data/checkup_db.json. Commit that file: git history then doubles as
the backup that did not exist on 2026-08-06, when the only copy of the data sat
in a Railway container whose trial had expired.

Run this again after each scrape, then deploy — that is the whole update path.
"""

import datetime as dt
import json
import os
import pathlib
import sys

try:
    import pymysql
    from pymysql.cursors import DictCursor
except ImportError:
    sys.exit("pymysql missing — run: pip install pymysql")

HERE = pathlib.Path(__file__).parent
OUT = HERE / "web" / "data" / "checkup_db.json"

# Price snapshots are the one table that grows without bound (every package,
# every day). /trends only ever compares the two most recent points, so keeping
# the full history in the bundle would bloat the deploy for nothing. The
# complete history stays in git: each daily commit of this file carries that
# day's window, so nothing is actually lost.
SNAPSHOT_DAYS = 90


def load_env() -> dict:
    cfg = {
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASS"),
    }
    env = HERE / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if "=" not in line or line.startswith("#"):
                continue
            k, v = line.split("=", 1)
            key = {"DB_HOST": "host", "DB_PORT": "port", "DB_USER": "user",
                   "DB_PASS": "password"}.get(k.strip())
            if key and not cfg.get(key):
                cfg[key] = v.strip()
    cfg["port"] = int(cfg["port"] or 3306)
    missing = [k for k, v in cfg.items() if not v]
    if missing:
        sys.exit(f"Missing DB config: {', '.join(missing)}")
    return cfg


def jsonable(v):
    """MySQL types the site's TypeScript expects as strings.

    lib/db.ts declared DECIMAL columns as `string | null` and the pages call
    parseFloat on them, so prices must stay strings — emitting them as JSON
    numbers here would silently change `"5500.00"` into `5500` and break the
    formatting the templates rely on.
    """
    if v is None:
        return None
    if isinstance(v, (dt.date, dt.datetime)):
        return v.isoformat(sep=" ") if isinstance(v, dt.datetime) else v.isoformat()
    if isinstance(v, (bytes, bytearray)):
        return v.decode("utf-8", "replace")
    if isinstance(v, (int, float, str, bool)):
        return v
    return str(v)  # Decimal lands here -> "5500.00"


def rows(cur, sql, args=None) -> list[dict]:
    cur.execute(sql, args or ())
    return [{k: jsonable(v) for k, v in r.items()} for r in cur.fetchall()]


def main() -> None:
    cfg = load_env()
    conn = pymysql.connect(
        database="bkkcheckup", connect_timeout=30, charset="utf8mb4",
        cursorclass=DictCursor, **cfg,
    )
    cutoff = (dt.date.today() - dt.timedelta(days=SNAPSHOT_DAYS)).isoformat()

    with conn.cursor() as cur:
        hospitals = rows(cur, """
            SELECT id, name, name_th, slug, tier, area, city, jci, checkup_url,
                   lat, lng, address, phone, website, description, founded_year,
                   bed_count, specialties, accreditations, email, rating, review_count,
                   category_name, opening_hours, google_maps_url, permanently_closed
            FROM hospitals
            ORDER BY name
        """)
        # opening_hours is a JSON column; MySQL hands it back as a string, so
        # decode it here rather than making every consumer parse it again.
        for h in hospitals:
            if isinstance(h.get("opening_hours"), str):
                try:
                    h["opening_hours"] = json.loads(h["opening_hours"])
                except json.JSONDecodeError:
                    h["opening_hours"] = None
        packages = rows(cur, """
            SELECT id, hospital_id, name, category, price, currency, description,
                   has_blood, has_xray, has_ultrasound, has_ct, has_mri, has_ecg,
                   has_treadmill, has_cancer_marker, has_doctor_consult,
                   has_interpreter, results_days, source_url
            FROM checkup_packages
            ORDER BY id
        """)
        reviews = rows(cur, """
            SELECT id, hospital_id, author_name, rating, review_text, review_date, source
            FROM hospital_reviews
            ORDER BY review_date DESC
        """)
        snapshots = rows(cur, """
            SELECT package_id, snapshot_date, price
            FROM package_price_snapshots
            WHERE snapshot_date >= %s
            ORDER BY snapshot_date
        """, (cutoff,))

    conn.close()

    payload = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "snapshot_window_days": SNAPSHOT_DAYS,
        "hospitals": hospitals,
        "packages": packages,
        "reviews": reviews,
        "snapshots": snapshots,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    size_mb = OUT.stat().st_size / 1_048_576
    print(f"hospitals  {len(hospitals):>6}")
    print(f"packages   {len(packages):>6}")
    print(f"reviews    {len(reviews):>6}")
    print(f"snapshots  {len(snapshots):>6}  (last {SNAPSHOT_DAYS} days)")
    print(f"\nWrote {OUT} ({size_mb:.1f} MB)")
    if size_mb > 40:
        print("\nWARNING: over 40 MB. Vercel's serverless bundle limit is 250 MB "
              "uncompressed — consider trimming SNAPSHOT_DAYS.")


if __name__ == "__main__":
    main()
