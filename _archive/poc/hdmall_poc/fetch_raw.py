"""Fetch raw resources to understand brand directory structure."""
from __future__ import annotations
import re, sys, json
from pathlib import Path
import urllib.request, urllib.parse

OUT_DIR = Path(__file__).parent / "debug_html"
OUT_DIR.mkdir(exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "th,en;q=0.9",
}

TARGETS = [
    ("sitemap_raw_xml", "https://hdmall.co.th/sitemap.xml"),
    ("gtm_brand_backlinks", "https://app.hd.co.th/assets/js/gtm-brand-dir-backlinks.js"),
    ("th_brands_replacement", "https://app.hd.co.th/assets/js/th-brands-page-gib-replacement.js"),
    ("brands_api_v1", "https://hdmall.co.th/api/v1/brands"),
    ("brands_api", "https://hdmall.co.th/api/brands"),
    ("app_brands_api", "https://app.hd.co.th/api/brands"),
    ("brands_json", "https://hdmall.co.th/brands.json"),
    ("sitemap_brands_beauty_raw", "https://hdmall.co.th/sitemap/beauty/brands"),
]


def fetch(name: str, url: str):
    print(f"\n[{name}] {url}")
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as r:
            status = r.status
            ct = r.headers.get("Content-Type", "")
            data = r.read()
        print(f"  status={status} ct={ct} size={len(data)}")
        out = OUT_DIR / f"raw_{name}.txt"
        out.write_bytes(data)
        print(f"  saved {out}")
        # Preview
        preview = data[:300].decode("utf-8", errors="replace")
        print(f"  preview: {repr(preview[:200])}")
        # If it's XML, look for loc tags
        if b"<loc>" in data:
            locs = re.findall(rb"<loc>(https?://hdmall\.co\.th/[^<]+)</loc>", data)
            print(f"  XML locs: {len(locs)}")
            if locs:
                print(f"  sample: {[l.decode() for l in locs[:10]]}")
    except Exception as e:
        print(f"  ERROR: {type(e).__name__}: {e}")


def main():
    for name, url in TARGETS:
        fetch(name, url)
    return 0


if __name__ == "__main__":
    sys.exit(main())
