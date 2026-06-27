"""Scrape Phyathai package prices with better targeting."""
import re, time, pymysql
from pathlib import Path
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

OUT = Path(__file__).parent / "price_screenshots"

URLS = {
    'phyathai-1': [
        'https://www.phyathai.com/en/pyt1/package',
        'https://www.phyathai.com/en/pyt1/center/pyt1-center-28',
    ],
    'phyathai-2': [
        'https://www.phyathai.com/en/pyt2/package',
        'https://www.phyathai.com/en/pyt2/center/pyt2-center-32',
    ],
}

PRICE_RE = re.compile(r'(?:฿|THB)\s*([\d,]+)|([\d]{1,3}[,][\d]{3})\s*(?:บาท|฿|THB)', re.IGNORECASE)

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900}, locale='en-US')
    page = ctx.new_page()

    for slug, urls in URLS.items():
        for url in urls:
            print(f'\n→ {url}')
            try:
                page.goto(url, wait_until='networkidle', timeout=25000)
                time.sleep(3)
            except Exception as e:
                print(f'  error: {e}')
                continue

            # Try to find package listing links
            text = page.inner_text('body')
            prices = re.findall(r'(?:฿|THB)\s*([\d,]+)', text)
            prices2 = re.findall(r'([\d]{1,3}[,][\d]{3})\s*(?:บาท|฿)', text)
            all_prices = list(set(prices + prices2))
            valid = [int(p.replace(',','')) for p in all_prices if 1000 <= int(p.replace(',','')) <= 100000]
            print(f'  prices: {sorted(valid)[:10]}')

            # Screenshot current page
            page.screenshot(path=str(OUT / f'{slug}_pkg.png'), full_page=True)

            # Try clicking into package list
            pkg_links = page.query_selector_all('a[href*="package"], a[href*="checkup"], a[href*="health"]')
            print(f'  package links: {len(pkg_links)}')

            if valid:
                # Get context around prices
                for m in re.finditer(r'(.{0,80})(?:฿|THB)\s*([\d,]+)', text):
                    p = int(m.group(2).replace(',',''))
                    if 1000 <= p <= 100000:
                        print(f'  ฿{p:,} | {m.group(1)[-60:].strip()!r}')

    browser.close()
