"""Post-import repair pass over the local bkkcheckup database.

The importers each fill in whatever their own source happened to carry, so after
a full rebuild some columns the site depends on are only partly populated. This
script fixes what can be derived from data already present and reports what
cannot, so the gaps are visible instead of silently shipping as blanks.

Run after the scrapers, before export_to_json.py:

    python normalize_data.py

Currently does one repair: hospitals.city. hdmall_insert.py writes the district
into `area` and leaves `city` NULL, which strands 200+ hospitals — /city/* pages
vanish from the sitemap and getPackagesByCity returns nothing for them.
"""

import html
import re
import sys

import pymysql

from config import DB_CONFIG

# Districts and landmarks that hdmall/seed data uses in `area`, all of which are
# inside Bangkok. Anything not listed and not a known other city falls back to
# Bangkok too, because hdmall_insert.py already filters its intake to Bangkok
# ("Skipped (not BKK)") — so an unrecognised area there is still Bangkok.
OTHER_CITIES = {
    "phuket": "Phuket",
    "chiang mai": "Chiang Mai",
    "chiang rai": "Chiang Rai",
    "pattaya": "Pattaya",
    "chon buri": "Chon Buri",
    "chonburi": "Chon Buri",
    "hua hin": "Hua Hin",
    "ko samui": "Ko Samui",
    "koh samui": "Ko Samui",
    "krabi": "Krabi",
    "hat yai": "Hat Yai",
    "khon kaen": "Khon Kaen",
    "udon thani": "Udon Thani",
    "korat": "Korat",
    "nakhon ratchasima": "Korat",
    "ayutthaya": "Ayutthaya",
    "rayong": "Rayong",
    "surat thani": "Surat Thani",
    "phitsanulok": "Phitsanulok",
    "trang": "Trang",
    "lampang": "Lampang",
    "nakhon pathom": "Nakhon Pathom",
    "nakhon si thammarat": "Nakhon Si Thammarat",
    "koh chang": "Koh Chang",
}


def repair_names(cur) -> None:
    """Undo two importer defects in hospitals.name.

    1. HTML entities survive the scrape, so 12 hospitals are stored as
       "AQUA BKK Aesthetic &amp; Wellness Clinic". Besides reading wrong, this
       is where the old sitemap's "chanun-aesthetic-amp-wellness" slugs came
       from — "&amp;" slugified into the literal word "amp".
    2. Five hdmall rows have an empty name entirely. They all carry real priced
       packages, so they are not junk to drop; the slug still holds the name.
    """
    cur.execute("SELECT id, name FROM hospitals WHERE name LIKE '%&%'")
    fixes = [(html.unescape(n), i) for i, n in cur.fetchall() if html.unescape(n) != n]
    if fixes:
        cur.executemany("UPDATE hospitals SET name = %s WHERE id = %s", fixes)
    print(f"names with HTML entities decoded: {len(fixes)}")

    cur.execute("SELECT id, slug FROM hospitals WHERE name IS NULL OR name = ''")
    blanks = cur.fetchall()
    derived = []
    for hid, slug in blanks:
        # Slugs are prefixed "hdm-" by hdmall_insert.py; strip it, then title
        # case, keeping known brand capitalisation intact.
        base = re.sub(r"^hdm-", "", slug or "").replace("-", " ").strip()
        name = SLUG_NAME_OVERRIDES.get(slug, base.title())
        derived.append((name, hid))
    if derived:
        cur.executemany("UPDATE hospitals SET name = %s WHERE id = %s", derived)
    print(f"empty names filled from slug: {len(derived)}")
    for name, _ in derived:
        print(f"    {name}")


# Names for rows the importer left blank, so the drop list below can report
# them by something readable before removing them.
SLUG_NAME_OVERRIDES = {"hdm-hdmall": "HDmall", "hdm-hdcare": "HDcare"}

# hdmall_insert.py scrapes HDmall's own marketplace pages alongside the clinic
# pages, so the marketplace lists itself as a care provider. These are not
# hospitals — they have no location, no phone, and no doctor — and a
# price-comparison directory that lists the aggregator it scraped as one of the
# options it compares is straightforwardly misleading. Dropped on every run.
DROP_SLUGS = ["hdm-hdmall", "hdm-hdcare"]


def drop_non_clinics(cur) -> None:
    placeholders = ", ".join(["%s"] * len(DROP_SLUGS))
    cur.execute(f"SELECT id, slug, name FROM hospitals WHERE slug IN ({placeholders})", DROP_SLUGS)
    rows = cur.fetchall()
    if not rows:
        print("non-clinic listings: none present")
        return

    ids = [r[0] for r in rows]
    id_ph = ", ".join(["%s"] * len(ids))
    cur.execute(f"SELECT id FROM checkup_packages WHERE hospital_id IN ({id_ph})", ids)
    pkg_ids = [r[0] for r in cur.fetchall()]

    if pkg_ids:
        pkg_ph = ", ".join(["%s"] * len(pkg_ids))
        # Snapshots and clicks carry no FK constraint, so clear them by hand
        # before the packages disappear or they become orphans.
        cur.execute(f"DELETE FROM package_price_snapshots WHERE package_id IN ({pkg_ph})", pkg_ids)
        cur.execute(f"DELETE FROM package_clicks WHERE package_id IN ({pkg_ph})", pkg_ids)
        cur.execute(f"DELETE FROM checkup_packages WHERE id IN ({pkg_ph})", pkg_ids)
    cur.execute(f"DELETE FROM hospital_reviews WHERE hospital_id IN ({id_ph})", ids)
    cur.execute(f"DELETE FROM hospitals WHERE id IN ({id_ph})", ids)

    print(f"dropped {len(rows)} non-clinic listings ({len(pkg_ids)} packages):")
    for _, slug, name in rows:
        print(f"    {name or slug}")


def drop_duplicate_shells(cur) -> None:
    """Remove seed rows that a later importer re-added under a better slug.

    seed_hospitals.py created e.g. `bangkok-phuket`, then scrape_chiangmai_phuket.py
    inserted the same hospital as `bangkok-hospital-phuket` with its packages
    attached. Both survive, so the site gets two pages for one hospital and one
    of them is permanently empty. Only the package-less side is dropped, and
    only when a namesake with packages exists — a hospital that is merely
    missing its packages is left alone.
    """
    cur.execute(
        """SELECT h.id, h.slug, h.name FROM hospitals h
           WHERE (SELECT COUNT(*) FROM checkup_packages WHERE hospital_id = h.id) = 0
             AND EXISTS (
               SELECT 1 FROM hospitals o
               WHERE o.id <> h.id AND o.name = h.name
                 AND (SELECT COUNT(*) FROM checkup_packages WHERE hospital_id = o.id) > 0
             )"""
    )
    dupes = cur.fetchall()
    if not dupes:
        print("duplicate empty shells: none")
        return
    ids = [d[0] for d in dupes]
    ph = ", ".join(["%s"] * len(ids))
    cur.execute(f"DELETE FROM hospital_reviews WHERE hospital_id IN ({ph})", ids)
    cur.execute(f"DELETE FROM hospitals WHERE id IN ({ph})", ids)
    print(f"dropped {len(dupes)} duplicate empty shells:")
    for _, slug, name in dupes:
        print(f"    {name} ({slug})")


def main() -> None:
    conn = pymysql.connect(**DB_CONFIG)
    cur = conn.cursor()

    repair_names(cur)
    drop_non_clinics(cur)
    drop_duplicate_shells(cur)
    conn.commit()
    print()

    cur.execute("SELECT id, name, area FROM hospitals WHERE city IS NULL OR city = ''")
    missing = cur.fetchall()
    print(f"hospitals without a city: {len(missing)}")

    updates: list[tuple[str, int]] = []
    for hid, name, area in missing:
        haystack = f"{area or ''} {name or ''}".lower()
        city = next((c for k, c in OTHER_CITIES.items() if k in haystack), "Bangkok")
        updates.append((city, hid))

    if updates:
        cur.executemany("UPDATE hospitals SET city = %s WHERE id = %s", updates)
        conn.commit()

    cur.execute(
        "SELECT city, COUNT(*) FROM hospitals GROUP BY city ORDER BY COUNT(*) DESC"
    )
    print("\ncity distribution after repair:")
    for city, n in cur.fetchall():
        print(f"  {str(city):>22}: {n}")

    # Report what could not be repaired — these need a scraper run, not a query.
    print("\nremaining gaps (need re-scraping, not derivable):")
    for label, sql in [
        ("hospitals without rating", "SELECT COUNT(*) FROM hospitals WHERE rating IS NULL"),
        ("hospitals without address", "SELECT COUNT(*) FROM hospitals WHERE address IS NULL OR address = ''"),
        ("packages without price", "SELECT COUNT(*) FROM checkup_packages WHERE price IS NULL"),
        ("packages without category", "SELECT COUNT(*) FROM checkup_packages WHERE category IS NULL"),
        ("price snapshot days", "SELECT COUNT(DISTINCT snapshot_date) FROM package_price_snapshots"),
        ("review rows", "SELECT COUNT(*) FROM hospital_reviews"),
    ]:
        cur.execute(sql)
        print(f"  {label:>28}: {cur.fetchone()[0]}")


    conn.close()


if __name__ == "__main__":
    sys.exit(main())
