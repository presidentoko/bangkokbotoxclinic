# -*- coding: utf-8 -*-
"""
import_bdms_packages.py — load scrape_bdms_packages.py output into
checkup_packages, attached to the right Bangkok Hospital branch.

Run after import_scraped_hospitals.py --apply, because six of the nine branches
that publish prices are hospitals the catalogue rebuild had deleted and the
Maps pass has only just restored.

Provenance is the point of this import. Every row carries the package's own URL
in source_url, so any price on the site can be clicked back to the hospital
page that published it. The catalogue this replaces could not do that: the
provincial rows came from literals typed into mega_scrape.py.

Category is derived from the package name, and only from words that actually
determine it. Anything that does not clearly belong to one of the site's eight
categories is filed as "standard" rather than guessed into a specific one — an
executive package mislabelled "cancer" is worse than one labelled generically.

    python import_bdms_packages.py --packages bdms_packages.json --dry-run
    python import_bdms_packages.py --packages bdms_packages.json --apply
"""

from __future__ import annotations

import argparse
import collections
import json
import pathlib
import re
import sys

import pymysql
from pymysql.cursors import DictCursor

from config import DB_CONFIG

# Branch path on bangkokhospital.com -> how the hospital is named in our data.
# Matched against hospitals.name case-insensitively; a branch whose hospital is
# not in the database is reported and skipped, never invented.
BRANCH_TO_HOSPITAL = {
    "bangkok": "Bangkok Hospital (BDMS HQ)",
    "chiangmai": "Bangkok Hospital Chiang Mai",
    "phuket": "Bangkok Hospital Phuket",
    "pattaya": "Bangkok Hospital Pattaya",
    "udon": "Bangkok Hospital Udon",
    "chiangrai": "Bangkok Hospital Chiang Rai",
    # Spelled as Google Maps returned them, which is what the import wrote —
    # "KhonKaen" and "Sanam Chan" are the hospitals' own spellings, not typos.
    "khonkaen": "Bangkok Hospital KhonKaen",
    "trat": "Bangkok Hospital Trat",
    "phitsanulok": "Bangkok Hospital Phitsanulok",
    "hatyai": "Bangkok Hospital Hat Yai",
    "samui": "Bangkok Hospital Samui",
    "surat": "Bangkok Hospital Surat Thani",
    "rayong": "Bangkok Hospital Rayong",
    "ratchasima": "Bangkok Hospital Ratchasima",
    "chanthaburi": "Bangkok Hospital Chanthaburi",
    "sanamchan": "Bangkok Sanam Chan Hospital",
}

# Order matters: the first match wins, so the specific tests come before the
# generic tiers. "Wellness Signature Female Check-up" is a women's package, not
# an executive one, even though "signature" reads premium.
CATEGORY_RULES = [
    ("cancer", re.compile(r"cancer|tumou?r|oncolog", re.I)),
    ("heart", re.compile(r"heart|cardiac|cardio", re.I)),
    ("women", re.compile(r"\bwomen|\bfemale|lady|ladies|gynae", re.I)),
    ("men", re.compile(r"\bmen\b|\bmale|men's|men’s", re.I)),
    ("senior", re.compile(r"senior|elderly|over\s*6\d|age\s*6\d", re.I)),
    ("executive", re.compile(r"executive|ceo|prestige|signature|grand|premium|longevity|platinum", re.I)),
    ("basic", re.compile(r"\bbasic|classic|essential|standard\s*check", re.I)),
]


def categorise(name: str) -> str:
    for cat, rx in CATEGORY_RULES:
        if rx.search(name):
            return cat
    return "standard"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packages", required=True)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    if not (args.apply or args.dry_run):
        ap.error("pass --dry-run or --apply")

    rows = json.loads(pathlib.Path(args.packages).read_text(encoding="utf-8"))
    ok = [r for r in rows if r.get("status") == "ok"]
    print(f"{len(rows)} scraped, {len(ok)} priced check-up packages")

    cfg = dict(DB_CONFIG)
    cfg.setdefault("database", "bkkcheckup")
    cfg["cursorclass"] = DictCursor
    conn = pymysql.connect(**cfg)
    cur = conn.cursor()
    cur.execute("SELECT id, slug, name FROM hospitals")
    hospitals = cur.fetchall()
    by_name = {h["name"].strip().lower(): h for h in hospitals}

    cur.execute("SELECT source_url FROM checkup_packages WHERE source_url IS NOT NULL")
    seen_urls = {r["source_url"] for r in cur.fetchall()}

    to_insert, missing_branch, dupes = [], collections.Counter(), 0
    for r in ok:
        want = BRANCH_TO_HOSPITAL.get(r["branch"])
        hosp = by_name.get(want.strip().lower()) if want else None
        if not hosp:
            missing_branch[r["branch"]] += 1
            continue
        if r["url"] in seen_urls:
            dupes += 1
            continue
        seen_urls.add(r["url"])
        to_insert.append((hosp, r, categorise(r["name"])))

    print(f"\ninsert : {len(to_insert)}")
    print(f"already : {dupes}")
    if missing_branch:
        print("\nbranch has prices but no hospital row (skipped, not invented):")
        for b, n in missing_branch.most_common():
            print(f"   {b:<14} {n:>3} packages  (wanted: {BRANCH_TO_HOSPITAL.get(b)})")

    per_h = collections.Counter(h["slug"] for h, _, _ in to_insert)
    print("\nper hospital:")
    for slug, n in per_h.most_common():
        prices = sorted(r["price"] for h, r, _ in to_insert if h["slug"] == slug)
        print(f"   {slug:<34} {n:>3}  ฿{prices[0]:,.0f} – ฿{prices[-1]:,.0f}")
    print("\nper category: " + ", ".join(
        f"{c}={n}" for c, n in collections.Counter(c for _, _, c in to_insert).most_common()))

    if args.dry_run:
        print("\ndry run — nothing written")
        return 0

    sql = ("INSERT INTO checkup_packages "
           "(hospital_id, name, category, price, currency, source_url) "
           "VALUES (%s, %s, %s, %s, 'THB', %s)")
    for hosp, r, cat in to_insert:
        cur.execute(sql, (hosp["id"], r["name"][:255], cat, r["price"], r["url"][:1024]))
    conn.commit()
    print(f"\ninserted {len(to_insert)} packages")
    print("next: python export_to_json.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
