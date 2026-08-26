# -*- coding: utf-8 -*-
"""
check_course_websites.py — drop course websites that no longer resolve.

master_db.json carries a `website` per course, scraped from Google Maps, and
app/course/[id]/page.tsx renders it as a link (it also reaches the blog posts
through generate_blog.py and JSON-LD through sameAs). Businesses close and let
domains lapse, so a fraction of those links are dead at any time — 8 of 242 as
of 2026-08-26. A link to nothing is a small thing on its own, but this is a
directory whose whole claim is that its listings are real, and a scraper will
happily re-add a lapsed domain on the next run.

Only NXDOMAIN counts as dead. A timeout, a 403 or a near-empty body do not:
bangkokbank.com times out from some networks, and plenty of real sites answer
403 behind Cloudflare or serve a 200-byte SPA shell. Judging on those would
delete working links, which is worse than leaving a broken one.

A replacement is used only when the site is confirmed to be the same business —
42tee-off.com moved to 42teeoff.com, whose own page says "42 TEE-OFF is
Bangkok's premier urban driving range in Sukhumvit". Domains that merely look
related are not substituted: golfpattaya.com resolves and sells green fees at
Pattaya courses, but it is a booking agency, not "Pattaya Golf Co.,Ltd", and
listing it as that course's website would be a worse error than none at all.

    python scripts/check_course_websites.py            # report
    python scripts/check_course_websites.py --apply    # write

Re-run after every scrape. Removals are recorded in dead_websites.json so the
next run can tell a newly-lapsed domain from one already dealt with.
"""

from __future__ import annotations

import argparse
import concurrent.futures as cf
import json
import pathlib
import re
import socket
import sys

HERE = pathlib.Path(__file__).resolve().parent
DB = HERE.parent / "data" / "master_db.json"
LEDGER = HERE.parent / "data" / "dead_websites.json"

# Verified same-business moves only. Anything not listed here is removed, not
# guessed at.
REPLACEMENTS = {
    "42tee-off.com": "https://42teeoff.com/",
}


def host_of(url: str) -> str | None:
    m = re.match(r"https?://([^/:?#]+)", (url or "").strip(), re.I)
    if not m:
        return None
    return m.group(1).lower().removeprefix("www.")


def resolves(host: str) -> bool:
    try:
        socket.getaddrinfo(host, 443)
        return True
    except socket.gaierror:
        return False
    except Exception:
        # Anything other than "no such name" is a network condition, not proof
        # the domain is gone.
        return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    data = json.loads(DB.read_text(encoding="utf-8"))
    rows = data if isinstance(data, list) else data.get("places") or data.get("courses") or []
    with_site = [r for r in rows if r.get("website")]
    hosts = sorted({h for r in with_site if (h := host_of(r["website"]))})
    print(f"{len(rows)} courses, {len(with_site)} with a website, {len(hosts)} distinct hosts")

    with cf.ThreadPoolExecutor(20) as ex:
        alive = dict(zip(hosts, ex.map(resolves, hosts)))
    dead = {h for h, ok in alive.items() if not ok}
    if not dead:
        print("every course website resolves")
        return 0

    fixed, removed = [], []
    for r in with_site:
        h = host_of(r["website"])
        if h not in dead:
            continue
        name = r.get("name", "?")
        if h in REPLACEMENTS:
            fixed.append((name, r["website"], REPLACEMENTS[h]))
            if args.apply:
                r["website"] = REPLACEMENTS[h]
        else:
            removed.append((name, r["website"]))
            if args.apply:
                r["website"] = None

    print(f"\n{len(dead)} dead hosts across {len(fixed) + len(removed)} courses")
    if fixed:
        print("\nreplaced (same business, confirmed):")
        for n, old, new in fixed:
            print(f"   {n[:42]:<42} {host_of(old)} -> {host_of(new)}")
    if removed:
        print("\nremoved (no verified replacement):")
        for n, old in removed:
            print(f"   {n[:42]:<42} {old}")

    if not args.apply:
        print("\nreport only — pass --apply to write")
        return 0

    # indent=2 and LF both matter, and both have to be stated explicitly.
    # indent=2 matches what apify_to_master_db.py writes; newline="" stops
    # Windows translating every \n to \r\n. Getting either wrong rewrites all
    # 208k lines, so nine changed fields arrive as a diff nobody can read and
    # every later diff of this file starts from the wrong base.
    with open(DB, "w", encoding="utf-8", newline="") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
    ledger = json.loads(LEDGER.read_text(encoding="utf-8")) if LEDGER.exists() else {}
    for n, old in removed:
        ledger[host_of(old)] = {"course": n, "was": old, "action": "removed"}
    for n, old, new in fixed:
        ledger[host_of(old)] = {"course": n, "was": old, "action": "replaced", "now": new}
    LEDGER.write_text(json.dumps(ledger, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\nwrote {DB.name} and {LEDGER.name}")
    print("next: python scripts/generate_blog.py (and generate_blog_ko.py) to "
          "refresh the posts that embed these links")
    return 0


if __name__ == "__main__":
    sys.exit(main())
