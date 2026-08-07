"""Fetch each hospital's own website and cache the pages to disk.

Google Maps gave us address, phone, hours and reviews, but not the profile
fields the hospital detail page renders: founded year, bed count, specialties,
accreditations, email, and a description. Those live on the hospitals' own
sites, and `hospitals.website` now holds ~208 of them.

    python fetch_hospital_sites.py [--limit N] [--refetch]

Everything lands in site_cache/<slug>/. That caching is the whole point: when
the Railway database died on 2026-08-06 the only reason the catalogue could be
rebuilt at all was that earlier scrapers had left their raw pages on disk. Parse
from the cache, never from the network, so re-parsing costs nothing and a
changed extractor can be re-run against the exact same input.

Fetching is free. Parsing is a separate script.
"""

import argparse
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

import pymysql

from config import DB_CONFIG

HERE = Path(__file__).parent
CACHE = HERE / "site_cache"

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
)
TIMEOUT = 20
DELAY = 1.0  # be a polite guest on someone else's server

# The profile fields we want are almost never on the home page. Try a handful
# of conventional paths per host; whichever return HTML get cached.
SUBPAGES = ["", "/about", "/about-us", "/en/about", "/en/about-us", "/contact", "/en/contact"]


def get(url: str) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en,th;q=0.8"})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            ctype = r.headers.get("Content-Type", "")
            if "html" not in ctype.lower():
                return r.status, ""
            raw = r.read(3_000_000)
            charset = r.headers.get_content_charset() or "utf-8"
            return r.status, raw.decode(charset, "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception:
        return 0, ""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="stop after N hospitals")
    ap.add_argument("--refetch", action="store_true", help="ignore existing cache")
    args = ap.parse_args()

    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute(
            "SELECT slug, name, website FROM hospitals "
            "WHERE website IS NOT NULL AND website <> '' "
            "AND permanently_closed = 0 ORDER BY name"
        )
        hospitals = cur.fetchall()
    conn.close()

    if args.limit:
        hospitals = hospitals[: args.limit]
    print(f"hospitals with a website: {len(hospitals)}")
    CACHE.mkdir(exist_ok=True)

    fetched = skipped = failed = 0
    for i, (slug, name, website) in enumerate(hospitals, 1):
        outdir = CACHE / slug
        # A site that yielded nothing is remembered with a marker file. Without
        # it every resume re-attempts all the dead hosts from the top, and each
        # one costs seven timeouts — the crawl spent whole runs re-failing the
        # same sites and never reached the tail of the list. --refetch retries
        # them deliberately.
        if not args.refetch and outdir.exists():
            if any(outdir.glob("*.html")) or (outdir / ".failed").exists():
                skipped += 1
                continue

        origin = f"{urlparse(website).scheme or 'https'}://{urlparse(website).netloc}"
        if not urlparse(website).netloc:
            failed += 1
            continue

        outdir.mkdir(parents=True, exist_ok=True)  # exist_ok: a prior run may have left an empty dir
        got = 0
        for path in SUBPAGES:
            url = website if path == "" else urljoin(origin, path)
            status, html = get(url)
            time.sleep(DELAY)
            if status != 200 or len(html) < 500:
                continue
            fname = (re.sub(r"[^a-z0-9]+", "_", path.strip("/").lower()) or "index") + ".html"
            (outdir / fname).write_text(html, encoding="utf-8")
            got += 1

        if got:
            fetched += 1
            print(f"[{i}/{len(hospitals)}] {name[:44]:<44} {got} page(s)")
        else:
            failed += 1
            # Leave a marker instead of deleting the directory, so the next
            # resume skips this host. (An earlier version removed the empty
            # directory via a conditional expression that called iterdir() on
            # a path that could already be gone — one FileNotFoundError killed
            # the whole crawl at hospital 37.)
            try:
                (outdir / ".failed").write_text(website, encoding="utf-8")
            except OSError:
                pass
            print(f"[{i}/{len(hospitals)}] {name[:44]:<44} — nothing usable")

    print(f"\nfetched {fetched} · cached-already {skipped} · failed {failed}")
    print(f"cache: {CACHE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
