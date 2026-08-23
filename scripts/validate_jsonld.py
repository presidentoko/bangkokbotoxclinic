"""Validate AggregateRating nodes in rendered JSON-LD.

Google rejects an aggregateRating whose count or value is not positive
("Value in property 'ratingCount' must be positive" — Google reports
reviewCount under that name). An unguarded builder emits zeros for venues
that simply have no reviews yet, which invalidates the whole rich result.

Works against a live host or a local build:
    python scripts/validate_jsonld.py --base https://thailandgolfguide.com --urls ids.txt
    python scripts/validate_jsonld.py --html-dir web-golf/.next/server/app/course
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

BLOCK = re.compile(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', re.S)
UA = {"User-Agent": "Mozilla/5.0 (compatible; jsonld-validator/1.0)"}


def positive(v) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool) and v > 0


def walk(node, path, out):
    if isinstance(node, dict):
        if node.get("@type") == "AggregateRating":
            counts = [k for k in ("ratingCount", "reviewCount") if k in node]
            if not counts:
                out.append((path, "<no count property>", "-"))
            for k in counts:
                if not positive(node[k]):
                    out.append((path, k, repr(node[k])))
            if not positive(node.get("ratingValue")):
                out.append((path, "ratingValue", repr(node.get("ratingValue"))))
        for k, v in node.items():
            walk(v, f"{path}.{k}", out)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, f"{path}[{i}]", out)


def scan(label: str, html: str):
    out, nodes = [], 0
    for i, raw in enumerate(BLOCK.findall(html)):
        try:
            doc = json.loads(raw)
        except json.JSONDecodeError as e:
            out.append((f"block{i}", "PARSE ERROR", str(e)[:70]))
            continue
        nodes += raw.count('"AggregateRating"')
        walk(doc, f"block{i}", out)
    return label, out, nodes


def fetch(url: str):
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=60) as f:
            return scan(url, f.read().decode("utf-8", "replace"))
    except Exception as e:  # noqa: BLE001 - report, don't abort the sweep
        return url, [("-", "FETCH FAIL", str(e)[:70])], 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", help="live origin, e.g. https://thailandgolfguide.com")
    ap.add_argument("--urls", help="file of absolute URLs or path suffixes, one per line")
    ap.add_argument("--html-dir", help="directory of prerendered .html to scan instead")
    ap.add_argument("--workers", type=int, default=8)
    a = ap.parse_args()

    results = []
    if a.html_dir:
        files = sorted(glob.glob(os.path.join(a.html_dir, "**", "*.html"), recursive=True))
        print(f"scanning {len(files)} prerendered files under {a.html_dir}")
        for p in files:
            with open(p, encoding="utf-8", errors="replace") as f:
                results.append(scan(p, f.read()))
    else:
        if not a.urls:
            ap.error("--urls is required without --html-dir")
        raw = [l.strip() for l in open(a.urls, encoding="utf-8") if l.strip()]
        urls = [u if u.startswith("http") else f"{a.base.rstrip('/')}/{u.lstrip('/')}" for u in raw]
        print(f"fetching {len(urls)} urls")
        with ThreadPoolExecutor(max_workers=a.workers) as ex:
            results = list(ex.map(fetch, urls))

    bad = [(lbl, out) for lbl, out, _ in results if out]
    nodes = sum(n for _, _, n in results)
    print(f"\nchecked {len(results)} pages, {nodes} AggregateRating nodes")
    print(f"pages with problems: {len(bad)}")
    for lbl, out in bad[:25]:
        print(f"\n{lbl}")
        for it in out[:5]:
            print("   ", it)
    if len(bad) > 25:
        print(f"\n... and {len(bad) - 25} more")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
