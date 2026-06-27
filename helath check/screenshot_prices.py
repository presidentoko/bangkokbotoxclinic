"""
Screenshot hospital price tables for manual/vision extraction.
"""
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "price_screenshots"
OUT.mkdir(exist_ok=True)

TARGETS = [
    ('bumrungrad', 'https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages'),
    ('phyathai-1', 'https://www.phyathai.com/en/pyt1/center/pyt1-center-28'),
    ('phyathai-2', 'https://www.phyathai.com/en/pyt2/package'),
]

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)  # visible so JS loads fully
    ctx = browser.new_context(
        viewport={'width': 1400, 'height': 900},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    )
    page = ctx.new_page()

    for slug, url in TARGETS:
        print(f'→ {slug}')
        page.goto(url, wait_until='networkidle', timeout=30000)
        time.sleep(3)

        # Try to find and click price image/table
        for selector in ['img[alt*="price"]', 'img[alt*="Price"]', 'img[src*="price"]',
                         'img[src*="package"]', '.price-table', '[class*="price"]',
                         'img[alt*="check"]', 'img[alt*="Check"]']:
            try:
                el = page.query_selector(selector)
                if el:
                    el.scroll_into_view_if_needed()
                    time.sleep(0.5)
                    print(f'  Found element: {selector}')
                    break
            except Exception:
                pass

        # Full page screenshot
        page.screenshot(path=str(OUT / f'{slug}_full.png'), full_page=True)
        print(f'  Saved {slug}_full.png')

        # Also try to find and screenshot just the price section
        for selector in ['table', '[class*="package"]', '[class*="price"]', 'main', 'article']:
            try:
                el = page.query_selector(selector)
                if el:
                    el.screenshot(path=str(OUT / f'{slug}_section.png'))
                    print(f'  Saved {slug}_section.png ({selector})')
                    break
            except Exception:
                pass

    browser.close()

print('Done. Screenshots saved to price_screenshots/')
