"""Restore hospital ratings from the archived gmaps scraper stdout.

When the Railway database was lost on 2026-08-06, ratings looked unrecoverable:
they came from live Google scraping and none of the HTML caches carry them. But
the scraper runs had their stdout redirected to gmaps_out.txt / gmaps_out2.txt,
and those files print every result as

    ★4.9 (265) Bangkok Anti-Aging Center

— which is the rating, the review count, and the hospital name. That is the
whole of what the `rating` / `review_count` columns held, so the logs are a
complete backup of them that nobody meant to make.

    python restore_ratings_from_logs.py [--dry-run]

Matches on hospital name because that is all the logs carry. Names are compared
case-insensitively with whitespace collapsed; anything that does not match
exactly one row is reported rather than guessed at.
"""

import argparse
import re
import sys
from collections import OrderedDict
from pathlib import Path

import pymysql

from config import DB_CONFIG

HERE = Path(__file__).parent
LOGS = ["gmaps_out.txt", "gmaps_out2.txt"]

# "  ★4.9 (265) Bangkok Anti-Aging Center" — counts may carry thousands commas.
LINE = re.compile(r"★\s*([\d.]+)\s*\(([\d,]+)\)\s*(.+?)\s*$")


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip().lower()


def parse_logs() -> "OrderedDict[str, tuple[float, int, str]]":
    # Each log prints the same hospital more than once (a "needing ratings"
    # pass, then a final summary). Later lines are the settled values, so let
    # them overwrite earlier ones.
    found: OrderedDict[str, tuple[float, int, str]] = OrderedDict()
    for fname in LOGS:
        path = HERE / fname
        if not path.exists():
            print(f"  (skipping missing {fname})")
            continue
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            m = LINE.search(line)
            if not m:
                continue
            rating = float(m.group(1))
            count = int(m.group(2).replace(",", ""))
            name = m.group(3).strip()
            if not (0 < rating <= 5) or not name:
                continue
            found[norm(name)] = (rating, count, name)
    return found


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    parsed = parse_logs()
    print(f"parsed {len(parsed)} distinct hospitals from logs")

    conn = pymysql.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT id, name FROM hospitals")
    by_name: dict[str, list[int]] = {}
    for hid, name in cur.fetchall():
        by_name.setdefault(norm(name), []).append(hid)

    updates: list[tuple[float, int, int]] = []
    unmatched: list[str] = []
    ambiguous: list[str] = []
    for key, (rating, count, name) in parsed.items():
        ids = by_name.get(key)
        if not ids:
            # A handful of log lines are cut off at the console width
            # ("Newton EM Physiotherapy Clinic (นิวตั้น"), so fall back to
            # treating the logged name as a prefix — but only accept it when
            # exactly one hospital starts with it, never a best guess.
            prefix = [v for k, v in by_name.items() if k.startswith(key)]
            ids = prefix[0] if len(prefix) == 1 else None
        if not ids:
            unmatched.append(name)
        elif len(ids) > 1:
            ambiguous.append(name)
        else:
            updates.append((rating, count, ids[0]))

    print(f"  matched   {len(updates)}")
    print(f"  unmatched {len(unmatched)}")
    if ambiguous:
        print(f"  ambiguous {len(ambiguous)} (same name on multiple rows, skipped)")

    if unmatched:
        print("\n  not found in DB:")
        for n in unmatched[:15]:
            print(f"    {n}")
        if len(unmatched) > 15:
            print(f"    ... and {len(unmatched) - 15} more")

    if args.dry_run:
        print("\ndry run — nothing written")
        return 0

    # Only fill blanks: a rating already in the table came from a later, more
    # trustworthy pass than these logs.
    cur.executemany(
        "UPDATE hospitals SET rating = %s, review_count = %s "
        "WHERE id = %s AND (rating IS NULL OR review_count IS NULL)",
        updates,
    )
    conn.commit()

    cur.execute("SELECT COUNT(*) FROM hospitals WHERE rating IS NOT NULL")
    have = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM hospitals")
    total = cur.fetchone()[0]
    print(f"\nhospitals with a rating: {have}/{total}")
    conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
