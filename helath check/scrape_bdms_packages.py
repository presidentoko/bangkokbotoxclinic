# -*- coding: utf-8 -*-
"""
scrape_bdms_packages.py — real check-up package prices for the Bangkok Hospital
(BDMS) branches, from each package's schema.org Product markup.

How the price is read, and why it matters
-----------------------------------------
Three sources of a number exist on these pages and two of them are wrong:

  * The visible text carries page furniture. "Child Health Check-Up 6-15 years"
    renders a prominent 100,000 that belongs to a promotion banner, and the
    same 100,000 appears on unrelated packages — the tell that it is not a
    package price at all. Reading prices out of flat text is how this site
    previously published a catalogue that was 87% wrong.
  * The rendered price block shows pairs — 12,000 next to 24,000 — i.e. the
    promotional price beside the undiscounted one. Taking either at random
    doubles or halves the answer.
  * `<script type="application/ld+json">` with @type Product carries a single
    `offers.price` in THB. Cross-checked against both of the above: the Trat
    executive package resolves to 12,000, the lower of the pair, and the child
    check-up to 3,900 rather than 100,000. That is the transacted price, which
    is the number this site is supposed to publish.

So JSON-LD is the only source used here, and a package with no Product block is
skipped rather than guessed at.

`offers.price` of 0 means enquire-only, not free — those are recorded with a
null price so they can be shown as "price on request" instead of "฿0".

The markup is server-rendered, so this needs no browser and runs in about a
minute over the whole network.

    python scrape_bdms_pkg_urls.py       # writes bdms_pkg_urls.json first
    python scrape_bdms_packages.py --urls bdms_pkg_urls.json --out bdms_packages.json
"""

from __future__ import annotations

import argparse
import collections
import concurrent.futures as cf
import json
import pathlib
import re
import sys

import requests

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
LD = re.compile(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', re.S)

# Which packages belong in a health check-up comparison. The catalogue rebuild
# on 2026-08-17 dropped single procedures on purpose — a cataract screening or
# a vaccine is not something a reader compares as a "check-up" — so the same
# line is held here rather than re-importing them by the hundred.
KEEP = re.compile(
    r"check[\s-]?up|health\s+screen|annual|wellness|executive|comprehensive"
    r"|premium\s+health|longevity",
    re.I,
)
# DROP wins over KEEP. Several of these were added only after reading the
# output: "Invisalign Comprehensive 5 Years" matched KEEP on the word
# "comprehensive" and entered the list at ฿220,000, which would have become
# the most expensive "health check-up" on the site. A single screening test
# (bone density, a pre-marital certificate) is likewise not something a reader
# compares as a check-up, and child packages are excluded because the site has
# no paediatric bucket and their low prices would distort every "from" figure.
DROP = re.compile(
    r"vaccin|shockwave|surgery|surgical|botox|filler|laser|dental|implant"
    r"|ivf|fertilit|delivery|maternity|physio|rehab|massage|covid|influenza"
    r"|hajj|dermat|aesthet|hair|lasik"
    r"|invisalign|orthodon|braces"
    r"|retreat|pre[\s-]?marital|premarital|marriage"
    r"|bone\s+health|bone\s+densit"
    r"|\bkid|\bkids|child|paediatric|pediatric|infant|vaccine",
    re.I,
)


def price_from_ld(html: str) -> tuple[str | None, float | None, str | None]:
    """(package name, price, currency) from the Product block, or (None, ...)."""
    for block in LD.findall(html):
        try:
            data = json.loads(block)
        except json.JSONDecodeError:
            continue
        if data.get("@type") != "Product":
            continue
        offers = data.get("offers") or {}
        if isinstance(offers, list):
            offers = offers[0] if offers else {}
        raw = offers.get("price")
        try:
            price = float(str(raw).replace(",", ""))
        except (TypeError, ValueError):
            price = None
        # 0 is the site's marker for "enquire", not a free package.
        if price is not None and price <= 0:
            price = None
        name = (data.get("name") or "").split("|")[0].strip() or None
        return name, price, offers.get("priceCurrency")
    return None, None, None


def fetch(session: requests.Session, branch: str, url: str) -> dict:
    rec = {"branch": branch, "url": url, "slug": url.rstrip("/").split("/")[-1]}
    try:
        html = session.get(url, timeout=30).text
    except Exception as exc:                                    # noqa: BLE001
        rec["status"] = "error"
        rec["error"] = f"{type(exc).__name__}"
        return rec
    name, price, currency = price_from_ld(html)
    if not name:
        rec["status"] = "no_product_markup"
        return rec
    rec.update(name=name, price=price, currency=currency)
    if DROP.search(name):
        rec["status"] = "not_a_checkup"
    elif not KEEP.search(name):
        rec["status"] = "not_a_checkup"
    elif price is None:
        rec["status"] = "price_on_request"
    else:
        rec["status"] = "ok"
    return rec


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--urls", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--workers", type=int, default=8)
    args = ap.parse_args()

    by_branch = json.loads(pathlib.Path(args.urls).read_text(encoding="utf-8"))
    jobs = [(b, u) for b, urls in by_branch.items() for u in urls]
    print(f"{len(jobs)} package URLs across {len(by_branch)} branches")

    session = requests.Session()
    session.headers["User-Agent"] = UA
    out: list[dict] = []
    with cf.ThreadPoolExecutor(args.workers) as ex:
        for i, rec in enumerate(ex.map(lambda j: fetch(session, *j), jobs), 1):
            out.append(rec)
            if i % 50 == 0:
                print(f"  {i}/{len(jobs)}", flush=True)
    pathlib.Path(args.out).write_text(
        json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8"
    )

    counts = collections.Counter(r["status"] for r in out)
    print("\n" + ", ".join(f"{k}={v}" for k, v in counts.most_common()))
    ok = [r for r in out if r["status"] == "ok"]
    per = collections.Counter(r["branch"] for r in ok)
    print(f"\n{len(ok)} priced check-up packages:")
    for b, n in per.most_common():
        prices = sorted(r["price"] for r in ok if r["branch"] == b)
        print(f"  {b:<14} {n:>3}  ฿{prices[0]:,.0f} – ฿{prices[-1]:,.0f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
