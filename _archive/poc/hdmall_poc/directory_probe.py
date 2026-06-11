"""HDmall directory probe — check sitemap + clinic-list page structure."""
from __future__ import annotations
import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

OUT_DIR = Path(__file__).parent
DEBUG_DIR = OUT_DIR / "debug_html"
DEBUG_DIR.mkdir(exist_ok=True)

TARGETS = [
    ("sitemap_xml", "https://hdmall.co.th/sitemap.xml"),
    ("sitemap_index", "https://hdmall.co.th/sitemap_index.xml"),
    ("clinics_dir", "https://hdmall.co.th/รพ.-คลินิกทั้งหมด"),
    ("brands_page", "https://hdmall.co.th/brands"),
    ("providers_page", "https://hdmall.co.th/providers"),
]

RE_CLINIC_URL = re.compile(r'href="(/(?:clinic|hospital|dental|brand|provider)[^"]*)"')
RE_LOC = re.compile(r"<loc>(https://hdmall\.co\.th/[^<]+)</loc>")


def probe(page, name: str, url: str):
    print(f"\n[{name}] GET {url}")
    try:
        resp = page.goto(url, wait_until="domcontentloaded", timeout=20000)
        status = resp.status if resp else "?"
        print(f"  status={status}")
        try:
            page.wait_for_load_state("networkidle", timeout=5000)
        except PWTimeout:
            pass
        html = page.content()
        out_path = DEBUG_DIR / f"dir_{name}.html"
        out_path.write_text(html, encoding="utf-8")
        print(f"  saved {out_path} ({len(html)} bytes)")
        # Extract URL patterns
        locs = RE_LOC.findall(html)
        if locs:
            print(f"  sitemap locs={len(locs)} sample={locs[:5]}")
        clinic_links = RE_CLINIC_URL.findall(html)
        if clinic_links:
            unique = sorted(set(clinic_links))
            print(f"  clinic-like hrefs={len(unique)} sample={unique[:5]}")
        # Show page title / first heading
        title_m = re.search(r"<title>([^<]+)</title>", html, re.I)
        if title_m:
            print(f"  title={title_m.group(1)[:80]}")
        h1_m = re.search(r"<h1[^>]*>([^<]+)</h1>", html, re.I)
        if h1_m:
            print(f"  h1={h1_m.group(1)[:80]}")
        # Look for any provider/clinic card patterns
        for pat_name, pat in [
            ("onclick_brand", re.compile(r"posthog\.capture\('ai_overview_brand_clicked'")),
            ("href_brand", re.compile(r'href="(/[^"]*(?:clinic|hospital|dental|beauty|laser|skin|surgery)[^"]*)"', re.I)),
            ("data_brand", re.compile(r'data-brand-(?:id|name|slug)="([^"]+)"')),
        ]:
            hits = pat.findall(html)
            if hits:
                unique_h = list(dict.fromkeys(hits))
                print(f"  {pat_name}: {len(unique_h)} unique, sample={unique_h[:3]}")
    except Exception as e:
        print(f"  ERROR: {type(e).__name__}: {e}")


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=[
            "--disable-blink-features=AutomationControlled",
        ])
        ctx = browser.new_context(
            locale="th-TH",
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            extra_http_headers={"Accept-Language": "th,en;q=0.9"},
        )
        ctx.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
        )
        page = ctx.new_page()
        page.set_default_timeout(20000)
        for name, url in TARGETS:
            probe(page, name, url)
        ctx.close()
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
