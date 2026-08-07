"""Extract hospital profile fields from the pages cached by fetch_hospital_sites.py.

Fills email, founded_year and accreditations — the fields that
are stated as plain facts on an About page and so don't need a language model
to read. Runs entirely offline against site_cache/, costs nothing, and is safe
to re-run: only blank columns are written, so a value from a better source is
never overwritten.

    python parse_hospital_sites.py [--dry-run]

description and specialties are deliberately *not* handled here — they're prose
and summarisation, which is what an LLM is actually for. Those come from a
separate, paid pass; see the note at the end of this file.
"""

import argparse
import html as htmllib
import re
import sys
from collections import Counter
from pathlib import Path

import pymysql

from config import DB_CONFIG

HERE = Path(__file__).parent
CACHE = HERE / "site_cache"

# Hospital sites are Thai-market marketing pages: inline scripts, style blocks
# and nav chrome dwarf the prose. Strip the noise before matching so a phone
# number in a tracking script can't be read as a founding year.
SCRIPT_STYLE = re.compile(r"<(script|style|noscript)\b[^>]*>.*?</\1>", re.S | re.I)
TAG = re.compile(r"<[^>]+>")

EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
# "Established in 1980", "founded 1997", "since 2005" — require 19xx/20xx and a
# sane upper bound so a price or a phone fragment can't match.
FOUNDED = re.compile(
    r"\b(?:established|founded|opened|since|est\.)\s*(?:in\s*)?(?:year\s*)?(19[3-9]\d|20[0-2]\d)\b",
    re.I,
)
# bed_count is deliberately NOT extracted. A regex over marketing copy can't
# tell a current capacity from a historical one: Bumrungrad's own page reads
# "Opened 200 bed facility: September 17, 1980" under Milestones, and the
# pattern took that as 200 beds today — the hospital now runs roughly 580.
# Across the whole cache the rule produced two values and got one of them
# wrong. On a medical directory a confidently wrong number is worse than a
# blank field, so the rule was removed rather than tightened. Reviving it needs
# a source that states current capacity, or an LLM pass that can read the
# surrounding clause.

ACCREDITATIONS = [
    ("JCI", re.compile(r"\bJCI\b|Joint Commission International", re.I)),
    ("HA", re.compile(r"\bHospital Accreditation\b|\bHA\s*Thailand\b", re.I)),
    ("ISO 9001", re.compile(r"ISO[\s-]?9001", re.I)),
    ("ISO 15189", re.compile(r"ISO[\s-]?15189", re.I)),
    ("AACI", re.compile(r"\bAACI\b", re.I)),
    ("GHA", re.compile(r"Global Healthcare Accreditation|\bGHA\b", re.I)),
]

# Addresses and boilerplate produce these constantly; none is an email we want.
JUNK_EMAIL = re.compile(r"(sentry|example|domain|your(name|email)|wixpress|\.png|\.jpg|@2x)", re.I)


def visible_text(raw: str) -> str:
    raw = SCRIPT_STYLE.sub(" ", raw)
    raw = TAG.sub(" ", raw)
    return re.sub(r"\s+", " ", htmllib.unescape(raw))


def parse_dir(d: Path) -> dict:
    text = " ".join(visible_text(f.read_text(encoding="utf-8", errors="replace"))
                    for f in sorted(d.glob("*.html")))
    out: dict = {}

    emails = [e for e in EMAIL.findall(text) if not JUNK_EMAIL.search(e)]
    if emails:
        # Several pages repeat the same contact address; take the most common,
        # which beats "first seen" when a partner or vendor address appears once.
        out["email"] = Counter(e.lower() for e in emails).most_common(1)[0][0][:256]

    m = FOUNDED.search(text)
    if m:
        out["founded_year"] = int(m.group(1))

    found = [label for label, pat in ACCREDITATIONS if pat.search(text)]
    if found:
        out["accreditations"] = ", ".join(found)[:255]

    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not CACHE.exists():
        return print("no site_cache/ — run fetch_hospital_sites.py first") or 1

    conn = pymysql.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT slug, id FROM hospitals")
    slug_to_id = dict(cur.fetchall())

    updates: list[tuple] = []
    stats = Counter()
    for d in sorted(CACHE.iterdir()):
        if not d.is_dir():
            continue
        hid = slug_to_id.get(d.name)
        if not hid:
            stats["unknown slug"] += 1
            continue
        got = parse_dir(d)
        if not got:
            stats["nothing found"] += 1
            continue
        for k in got:
            stats[k] += 1
        updates.append((
            got.get("email"), got.get("founded_year"),
            got.get("accreditations"), hid,
        ))

    print(f"directories parsed: {len(updates)}")
    for k, n in stats.most_common():
        print(f"  {k:<16} {n}")

    if args.dry_run:
        print("\ndry run — nothing written")
        return 0

    # Only fill blanks. A value already in the table came from a curated or
    # more authoritative source than a regex over marketing copy.
    cur.executemany(
        """UPDATE hospitals SET
             email          = COALESCE(email, NULLIF(%s,'')),
             founded_year   = COALESCE(founded_year, %s),
             accreditations = COALESCE(accreditations, NULLIF(%s,''))
           WHERE id = %s""",
        updates,
    )
    conn.commit()

    for label, sql in [
        ("with email", "SELECT COUNT(*) FROM hospitals WHERE email IS NOT NULL AND email<>''"),
        ("with founded_year", "SELECT COUNT(*) FROM hospitals WHERE founded_year IS NOT NULL"),
        ("with accreditations", "SELECT COUNT(*) FROM hospitals WHERE accreditations IS NOT NULL AND accreditations<>''"),
    ]:
        cur.execute(sql)
        print(f"  {label:>20}: {cur.fetchone()[0]}")

    conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
