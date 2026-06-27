import time, requests
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "price_screenshots"

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1600, 'height': 1000})
    page = ctx.new_page()

    page.goto('https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages',
              wait_until='networkidle', timeout=30000)
    time.sleep(2)

    # Get the full image URL
    imgs = page.query_selector_all('img')
    for img in imgs:
        src = img.get_attribute('src') or ''
        if 'Comparison' in src or 'comparison' in src or 'CC.jpg' in src:
            print(f'Found: {src}')
            # Download at native resolution
            if src.startswith('//'):
                src = 'https:' + src
            elif src.startswith('/'):
                src = 'https://www.bumrungrad.com' + src

            r = requests.get(src, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.bumrungrad.com/'
            }, timeout=30)
            if r.status_code == 200:
                path = OUT / 'bumrungrad_pricetable_hires.jpg'
                path.write_bytes(r.content)
                print(f'Downloaded: {len(r.content):,} bytes → {path}')
            break

    browser.close()
