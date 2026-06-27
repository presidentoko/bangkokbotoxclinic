"""Save Phyathai page HTML via Playwright for offline parsing."""
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

CACHE = Path(__file__).parent / 'cache'
CACHE.mkdir(exist_ok=True)

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False, slow_mo=500)
    ctx = browser.new_context(
        viewport={'width': 1400, 'height': 900},
        locale='en-US',
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    )
    page = ctx.new_page()

    for slug, url in [
        ('phyathai1_pkg', 'https://www.phyathai.com/en/pyt1/package'),
        ('phyathai2_pkg', 'https://www.phyathai.com/en/pyt2/package'),
    ]:
        print(f'Loading {url}...')
        page.goto(url, wait_until='networkidle', timeout=30000)
        time.sleep(6)

        # Scroll to load lazy content
        for _ in range(5):
            page.mouse.wheel(0, 800)
            time.sleep(1)

        html = page.content()
        out = CACHE / f'{slug}.html'
        out.write_text(html, encoding='utf-8')
        print(f'  Saved {len(html):,} bytes → {out.name}')

        text = page.inner_text('body')
        # Print all unique numbers that look like prices
        import re
        prices = sorted(set(
            int(m.group(1).replace(',',''))
            for m in re.finditer(r'[฿฿]([\d,]+)', text)
            if 1000 < int(m.group(1).replace(',','')) < 200000
        ))
        print(f'  Price-like numbers: {prices}')

        txt_out = CACHE / f'{slug}.txt'
        txt_out.write_text(text, encoding='utf-8')
        print(f'  Text saved: {len(text):,} chars')

    browser.close()
print('done')
