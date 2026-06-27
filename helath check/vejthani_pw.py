"""Vejthani health packages via Playwright."""
import re, time
from playwright.sync_api import sync_playwright

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1200, 'height': 900})
    page = ctx.new_page()

    # Try their health checkup package page
    for url in [
        'https://www.vejthani.com/health-checkup-program/',
        'https://www.vejthani.com/package-program/',
        'https://www.vejthani.com/health-package-program/',
        'https://www.vejthani.com/2024/04/health-check-up/',
    ]:
        try:
            r = page.goto(url, wait_until='domcontentloaded', timeout=15000)
            if r and r.status == 200:
                time.sleep(2)
                text = page.inner_text('body')
                # Find President packages
                for kw in ['President Lady', 'President Plus Hormone', 'President Plus Micro']:
                    idx = text.lower().find(kw.lower())
                    if idx >= 0:
                        snippet = text[max(0,idx-20):idx+200]
                        prices = [int(m.replace(',','')) for m in re.findall(r'[\d,]{5,}', snippet)
                                  if m.replace(',','').isdigit() and 3000 < int(m.replace(',','')) < 200000]
                        print(f'  {url}: {kw} → {prices}')
        except Exception as e:
            print(f'  {url}: {e}')

    browser.close()
print('done')
