"""Probe an individual HDmall clinic brand page to understand parser targets."""
from __future__ import annotations
import re, sys, json, time
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

OUT_DIR = Path(__file__).parent / "debug_html"
OUT_DIR.mkdir(exist_ok=True)

SAMPLE_CLINICS = [
    ("beauty", "aestiq-clinic"),
    ("beauty", "aura-bangkok-clinic"),
    ("dental-clinics", "32-dental-clinic"),
]


def probe_clinic(page, category: str, slug: str):
    url = f"https://hdmall.co.th/{category}/{slug}"
    print(f"\n[{category}/{slug}]")
    try:
        resp = page.goto(url, wait_until="domcontentloaded", timeout=25000)
        try:
            page.wait_for_load_state("networkidle", timeout=8000)
        except PWTimeout:
            pass
        html = page.content()
        (OUT_DIR / f"clinic_{slug[:30]}.html").write_text(html, encoding="utf-8")
        print(f"  status={resp.status if resp else '?'} size={len(html)}")

        # Name / title
        title_m = re.search(r"<title>([^<]+)</title>", html, re.I)
        if title_m:
            print(f"  title: {title_m.group(1)[:80]}")

        og_name = re.search(r'<meta[^>]+property="og:title"[^>]+content="([^"]+)"', html, re.I)
        if og_name:
            print(f"  og:title: {og_name.group(1)[:80]}")

        # Rating patterns
        rating_pats = [
            (r'"ratingValue"[^>]*>\s*([0-9.]+)', "ratingValue LD+JSON"),
            (r'brand.rating["\s]*[=:]\s*([0-9.]+)', "brand.rating"),
            (r'"rating":\s*"?([0-9.]+)"?', "json rating"),
            (r'rating[^"]{0,20}"([0-9.]+)"', "rating near"),
            (r'(?:avg|average|star|score)[^<]{0,30}([0-9]\.[0-9])', "avg/star score"),
        ]
        for pat, name in rating_pats:
            m = re.search(pat, html, re.I)
            if m:
                print(f"  rating[{name}]: {m.group(1)}")
                break

        # Review count
        for pat in [r'"reviewCount"[^>]*>\s*([0-9,]+)', r'"review_count":\s*([0-9]+)', r'([0-9,]+)\s*(?:review|รีวิว|คน)']:
            m = re.search(pat, html, re.I)
            if m:
                print(f"  reviews: {m.group(1)}")
                break

        # Address
        for pat in [r'"address"[^>]*>([^<]+)<', r'"streetAddress":\s*"([^"]+)"', r'(?:address|ที่อยู่)[^<]{0,50}([0-9].{5,50}Bangkok)', ]:
            m = re.search(pat, html, re.I)
            if m:
                print(f"  address: {m.group(1)[:100]}")
                break

        # Package/price sections
        price_hits = re.findall(r'([0-9,]+)\s*(?:บาท|THB|฿)', html)
        if price_hits:
            print(f"  prices found: {len(price_hits)} (sample: {price_hits[:5]})")

        # JSON-LD blocks
        jsonld_matches = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL)
        for i, jld in enumerate(jsonld_matches[:3]):
            try:
                data = json.loads(jld.strip())
                print(f"  ld+json[{i}]: @type={data.get('@type', '?')} keys={list(data.keys())[:6]}")
            except Exception:
                print(f"  ld+json[{i}]: parse error, snippet: {jld[:100]}")

        # posthog brand events (like search page)
        onclick_re = re.compile(r"posthog\.capture\('([^']+)'")
        events = [m.group(1) for m in onclick_re.finditer(html)]
        unique_events = sorted(set(events))
        if unique_events:
            print(f"  posthog events: {unique_events[:5]}")

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
        page.set_default_timeout(25000)

        for cat, slug in SAMPLE_CLINICS:
            probe_clinic(page, cat, slug)
            time.sleep(1)

        ctx.close()
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
