"""Check if surgeries sitemap exists and page 2 of treatment-and-surgery."""
from __future__ import annotations
import re, sys, time
from collections import Counter
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

URLS = [
    "https://hdmall.co.th/sitemap/surgeries/brands",
    "https://hdmall.co.th/sitemap/treatment-and-surgery/brands?page=2",
    "https://hdmall.co.th/surgeries",
]


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(
            locale="th-TH",
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0",
        )
        page = ctx.new_page()

        for url in URLS:
            resp = page.goto(url, wait_until="domcontentloaded", timeout=20000)
            try:
                page.wait_for_load_state("networkidle", timeout=5000)
            except PWTimeout:
                pass
            html = page.content()

            prefixes: Counter = Counter()
            for m in re.finditer(r'href="(/([^/"]+)/[^"?#]+)"', html):
                prefixes[m.group(2)] += 1
            top = prefixes.most_common(15)
            print(f"{url}: status={resp.status if resp else '?'}")
            print(f"  top path prefixes: {[(k,v) for k,v in top if v > 1]}")
            time.sleep(0.5)

        ctx.close()
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
