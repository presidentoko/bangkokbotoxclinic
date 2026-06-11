"""Probe a single /sitemap/<cat>/brands page to understand brand link format."""
from __future__ import annotations
import re, sys, json, time
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

OUT_DIR = Path(__file__).parent / "debug_html"
OUT_DIR.mkdir(exist_ok=True)

# Clinic-relevant categories
CATEGORIES = [
    "beauty",
    "dental-clinics",
    "medical-aesthetics",
    "health-checkup",
    "treatment-and-surgery",
    "anti-aging",
    "spa-and-salon",
    "physiotherapy",
    "male-health",
    "screening-by-symptoms",
    "vaccine-injection",
    "family-planning",
    "mom-and-kid",
    "elderly-and-patient-care",
]

RE_BRAND_HREF = re.compile(r'href="(https://hdmall\.co\.th/[^"?#]+|/[^"?#/][^"?#]*)"')


def get_brands_from_cat(page, cat: str) -> list[str]:
    url = f"https://hdmall.co.th/sitemap/{cat}/brands"
    try:
        resp = page.goto(url, wait_until="domcontentloaded", timeout=20000)
        try:
            page.wait_for_load_state("networkidle", timeout=6000)
        except PWTimeout:
            pass
        html = page.content()
        (OUT_DIR / f"sitemap_{cat.replace('-','_')}_brands.html").write_text(html, encoding="utf-8")
        # Extract brand hrefs — look for links that are NOT navigation/sitemap
        hrefs = RE_BRAND_HREF.findall(html)
        # Normalize
        brand_urls = set()
        for h in hrefs:
            if h.startswith("/"):
                h = "https://hdmall.co.th" + h
            # Skip sitemap, tags, categories, reviews, search, nav links
            if any(x in h for x in ["/sitemap/", "/tags/", "/categories", "/reviews", "/search", "/brands", "/deals", "/campaigns", "/current_cart", "/c/"]):
                continue
            # Must look like a brand page: /some-slug or /some/slug
            path = h.replace("https://hdmall.co.th", "")
            parts = [p for p in path.split("/") if p]
            if len(parts) == 1 and len(parts[0]) > 2:  # top-level slug = brand page
                brand_urls.add(h)
        return sorted(brand_urls)
    except Exception as e:
        print(f"  ERROR {cat}: {e}")
        return []


def main():
    all_brands: dict[str, list[str]] = {}  # cat -> [url, ...]

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

        for cat in CATEGORIES:
            urls = get_brands_from_cat(page, cat)
            all_brands[cat] = urls
            print(f"  {cat}: {len(urls)} brands found")
            time.sleep(0.8)

        ctx.close()
        browser.close()

    # Save results
    out = Path(__file__).parent / "sitemap_brands_probe.json"
    out.write_text(json.dumps(all_brands, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nSaved to {out}")

    # Summary
    all_unique = set()
    for urls in all_brands.values():
        all_unique.update(urls)
    print(f"Total unique brand URLs: {len(all_unique)}")
    print("Sample:", list(all_unique)[:10])
    return 0


if __name__ == "__main__":
    sys.exit(main())
